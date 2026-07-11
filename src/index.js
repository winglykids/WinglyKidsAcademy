const DEFAULT_SUPABASE_URL = 'https://qhyjvexemvmfavooxlao.supabase.co';
const DEFAULT_TEACHER_EMAIL = 'winglykids@gmail.com';
const DEFAULT_SENDER_ADDRESS = 'WinglyKidsAcademy <hello@winglykidsacademy.com>';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === '/api/enroll' && request.method === 'POST') {
      return handleEnroll(request, env);
    }

    // Compatibility for the previous endpoint name. It now uses the same secure path.
    if (url.pathname === '/api/notify-enrollment' && request.method === 'POST') {
      return handleNotifyEnrollmentOnly(request, env);
    }

    return env.ASSETS.fetch(request);
  }
};

async function handleEnroll(request, env) {
  try {
    const payload = await request.json();
    const username = clean(payload.student_username).toLowerCase();
    const password = String(payload.student_password || '');
    const parentEmail = clean(payload.parent_email).toLowerCase();

    if (!/^[a-z0-9_.]{3,}$/.test(username)) {
      return jsonResponse({ success: false, error: 'Username can only have letters, numbers, dots, underscores and must be at least 3 characters.' }, 400);
    }
    if (password.length < 6) {
      return jsonResponse({ success: false, error: 'Password must be at least 6 characters.' }, 400);
    }
    if (!parentEmail.includes('@')) {
      return jsonResponse({ success: false, error: 'Parent email is required.' }, 400);
    }

    const requiredFields = ['child_name', 'child_age', 'child_grade', 'english_level', 'parent_name', 'whatsapp', 'preferred_days', 'preferred_time_slot'];
    for (const field of requiredFields) {
      if (!clean(payload[field])) {
        return jsonResponse({ success: false, error: `Missing ${field.replace(/_/g, ' ')}.` }, 400);
      }
    }

    const existing = await supabaseFetch(env, `/rest/v1/students?username=eq.${encodeURIComponent(username)}&select=username&limit=1`, { method: 'GET' });
    if (existing && existing.length) {
      return jsonResponse({ success: false, error: 'That username is already taken. Please choose another.' }, 409);
    }

    const authEmail = deriveAuthEmail(parentEmail, username);
    const authUser = await supabaseFetch(env, '/auth/v1/admin/users', {
      method: 'POST',
      body: JSON.stringify({
        email: authEmail,
        password,
        email_confirm: true,
        user_metadata: {
          username,
          parent_email: parentEmail,
          child_name: clean(payload.child_name)
        }
      })
    });

    const rows = await supabaseFetch(env, '/rest/v1/students', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        auth_user_id: authUser.id,
        username,
        auth_email: authEmail,
        child_name: clean(payload.child_name),
        child_age: clean(payload.child_age),
        child_grade: clean(payload.child_grade),
        english_level: clean(payload.english_level),
        parent_name: clean(payload.parent_name),
        parent_email: parentEmail,
        parent_phone: clean(payload.whatsapp),
        session_format: clean(payload.session_format),
        payment_plan: clean(payload.payment_plan),
        preferred_days: clean(payload.preferred_days),
        preferred_time_slot: clean(payload.preferred_time_slot),
        notes: clean(payload.notes)
      })
    });

    const emailResult = await sendEnrollmentEmails(env, {
      ...payload,
      student_username: username,
      parent_email: parentEmail,
      registered_at: new Date().toISOString()
    });

    return jsonResponse({
      success: true,
      student_id: rows && rows[0] ? rows[0].id : null,
      teacherEmailSent: emailResult.teacherEmailSent,
      parentEmailSent: emailResult.parentEmailSent
    }, 200);
  } catch (err) {
    console.error('enroll: unexpected error', err);
    return jsonResponse({ success: false, error: err.message || 'Enrollment failed.' }, 500);
  }
}

async function handleNotifyEnrollmentOnly(request, env) {
  try {
    const payload = await request.json();
    const result = await sendEnrollmentEmails(env, normalizeNotifyPayload(payload));
    return jsonResponse({ success: true, ...result }, 200);
  } catch (err) {
    console.error('notify-enrollment: unexpected error', err);
    return jsonResponse({ success: false, error: err.message || 'Email notification failed.' }, 500);
  }
}

async function supabaseFetch(env, path, options = {}) {
  const supabaseUrl = (env.SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/$/, '');
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured in Cloudflare.');

  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = body && (body.msg || body.message || body.error_description || body.error);
    throw new Error(message || `Supabase request failed (${response.status})`);
  }
  return body;
}

async function sendEnrollmentEmails(env, payload) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured in Cloudflare.');

  const teacherEmail = env.TEACHER_EMAIL || DEFAULT_TEACHER_EMAIL;
  const senderAddress = env.RESEND_FROM_EMAIL || DEFAULT_SENDER_ADDRESS;
  const parentEmail = clean(payload.parent_email || payload.parentEmail).toLowerCase();
  if (!parentEmail) throw new Error('Missing parent email.');

  const teacher = await sendResendEmail(apiKey, {
    from: senderAddress,
    to: [teacherEmail],
    reply_to: parentEmail,
    subject: `New Enrollment: ${clean(payload.child_name || payload.childName)}`,
    html: teacherEmailHtml(payload)
  });
  const parent = await sendResendEmail(apiKey, {
    from: senderAddress,
    to: [parentEmail],
    reply_to: teacherEmail,
    subject: 'Thank you for registering with WinglyKidsAcademy!',
    html: parentEmailHtml(payload)
  });

  if (!teacher.ok) console.error('teacher email failed', teacher.error);
  if (!parent.ok) console.error('parent email failed', parent.error);
  return { teacherEmailSent: teacher.ok, parentEmailSent: parent.ok };
}

async function sendResendEmail(apiKey, payload) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) return { ok: false, error: `${res.status}: ${await res.text()}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function teacherEmailHtml(payload) {
  return `
    <div style="font-family:sans-serif;max-width:560px;">
      <h2 style="color:#1b2b4b;">New WinglyKids enrollment</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row('Student name', payload.child_name || payload.childName)}
        ${row('Age / grade', `${clean(payload.child_age)} / ${clean(payload.child_grade)}`)}
        ${row('English level', payload.english_level)}
        ${row('Parent name', payload.parent_name || payload.parentName)}
        ${row('Parent email', payload.parent_email || payload.parentEmail)}
        ${row('WhatsApp', payload.whatsapp || payload.parentPhone)}
        ${row('Username', payload.student_username)}
        ${row('Lesson type', `${clean(payload.session_format || payload.sessionFormat)} / ${clean(payload.payment_plan || payload.paymentPlan)}`)}
        ${row('Preferred schedule', `${clean(payload.preferred_days || payload.preferredDays)} / ${clean(payload.preferred_time_slot || payload.preferredTimeSlot)}`)}
        ${row('Notes', payload.notes || 'None')}
        ${row('Registered at', payload.registered_at || payload.registeredAt || new Date().toISOString())}
      </table>
    </div>
  `;
}

function parentEmailHtml(payload) {
  const parentName = clean(payload.parent_name || payload.parentName);
  const childName = clean(payload.child_name || payload.childName);
  return `
    <div style="font-family:sans-serif;max-width:560px;">
      <h2 style="color:#1b2b4b;">Thank you for registering! 🌿</h2>
      <p>Hi ${escapeHtml(parentName)},</p>
      <p>Thank you for registering <strong>${escapeHtml(childName)}</strong> with <strong>WinglyKidsAcademy</strong>.</p>
      <p>We received your enrollment and will contact you shortly to confirm the schedule and Google Meet details.</p>
      <p><strong>Student username:</strong> ${escapeHtml(payload.student_username || '')}</p>
      <p>For security, we do not send passwords by email. Please keep the password you chose safe.</p>
      <p style="margin-top:24px;">Warmly,<br>WinglyKidsAcademy</p>
    </div>
  `;
}

function row(label, value) {
  return `<tr><td style="padding:6px 0;color:#888;">${escapeHtml(label)}</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(value)}</td></tr>`;
}

function normalizeNotifyPayload(payload) {
  return {
    child_name: payload.child_name || payload.childName,
    parent_name: payload.parent_name || payload.parentName,
    parent_email: payload.parent_email || payload.parentEmail,
    whatsapp: payload.whatsapp || payload.parentPhone,
    session_format: payload.session_format || payload.sessionFormat,
    payment_plan: payload.payment_plan || payload.paymentPlan,
    preferred_days: payload.preferred_days || payload.preferredDays,
    preferred_time_slot: payload.preferred_time_slot || payload.preferredTimeSlot,
    registered_at: payload.registered_at || payload.registeredAt
  };
}

function deriveAuthEmail(parentEmail, username) {
  const atIndex = parentEmail.indexOf('@');
  return atIndex === -1 ? parentEmail : `${parentEmail.slice(0, atIndex)}+${username}${parentEmail.slice(atIndex)}`;
}

function clean(value) {
  return String(value || '').trim();
}

function jsonResponse(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

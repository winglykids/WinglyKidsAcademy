const DEFAULT_SUPABASE_URL = 'https://qhyjvexemvmfavooxlao.supabase.co';
const DEFAULT_TEACHER_EMAIL = 'winglykids@gmail.com';
const DEFAULT_SENDER_ADDRESS = 'WinglyKidsAcademy <hello@winglykidsacademy.com>';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    if (url.pathname === '/api/check-username' && request.method === 'GET') {
      return handleCheckUsername(url, env);
    }

    if (url.pathname === '/api/availability' && request.method === 'GET') {
      return handleAvailability(url, env);
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
    const lessonDate = clean(payload.selected_lesson_date);
    const lessonTime = normalizeStartTime(payload.selected_lesson_time);

    if (!/^[a-z0-9_.]{3,}$/.test(username)) {
      return jsonResponse({ success: false, error: 'Username can only have letters, numbers, dots, underscores and must be at least 3 characters.' }, 400);
    }
    if (!isStrongPassword(password)) {
      return jsonResponse({ success: false, error: 'Password must be at least 8 characters and include at least one letter and one number.' }, 400);
    }
    if (!parentEmail.includes('@')) {
      return jsonResponse({ success: false, error: 'Parent email is required.' }, 400);
    }
    if (!isValidIsoDate(lessonDate) || !lessonTime) {
      return jsonResponse({ success: false, error: 'Please choose an available lesson date and time.' }, 400);
    }
    if (!availableStartTimesForDate(lessonDate).includes(lessonTime)) {
      return jsonResponse({ success: false, error: 'That lesson time is not available for the selected date.' }, 400);
    }
    if (clean(payload.booking_policy_accepted) !== 'yes') {
      return jsonResponse({ success: false, error: 'Booking policy must be accepted.' }, 400);
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
        selected_lesson_date: lessonDate,
        selected_lesson_time: lessonTime,
        lessons_per_week: Number.parseInt(payload.lessons_per_week, 10) || 2,
        notes: clean(payload.notes)
      })
    });
    const studentId = rows && rows[0] ? rows[0].id : null;

    try {
      await supabaseFetch(env, '/rest/v1/lesson_bookings', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({
          student_id: studentId,
          lesson_date: lessonDate,
          start_time: lessonTime,
          duration_minutes: 50,
          status: 'booked',
          notes: clean(payload.notes)
        })
      });
    } catch (bookingErr) {
      const conflict = /duplicate|unique|already/i.test(bookingErr.message || '');
      return jsonResponse({
        success: false,
        error: conflict ? 'Sorry, that time was just booked by someone else. Please choose another time.' : bookingErr.message
      }, conflict ? 409 : 500);
    }

    const emailResult = await sendEnrollmentEmails(env, {
      ...payload,
      student_username: username,
      parent_email: parentEmail,
      selected_lesson_date: lessonDate,
      selected_lesson_time: lessonTime,
      registered_at: new Date().toISOString()
    });

    return jsonResponse({
      success: true,
      student_id: studentId,
      teacherEmailSent: emailResult.teacherEmailSent,
      parentEmailSent: emailResult.parentEmailSent
    }, 200);
  } catch (err) {
    console.error('enroll: unexpected error', err);
    return jsonResponse({ success: false, error: err.message || 'Enrollment failed.' }, 500);
  }
}

async function handleContact(request, env) {
  try {
    const payload = await request.json();
    const parentName = clean(payload.name || payload.parent_name);
    const phone = normalizePhone(payload.phone);
    const email = clean(payload.email).toLowerCase();
    const subject = clean(payload.subject);
    const message = clean(payload.message);

    if (!parentName || !phone || !email || !subject || !message) {
      return jsonResponse({ success: false, error: 'Your message could not be sent. Please try again or contact us directly on WhatsApp.' }, 400);
    }
    if (!isValidEmail(email) || !isValidPhone(phone)) {
      return jsonResponse({ success: false, error: 'Your message could not be sent. Please try again or contact us directly on WhatsApp.' }, 400);
    }

    const rows = await supabaseFetch(env, '/rest/v1/contact_messages', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        parent_name: parentName,
        phone,
        email,
        subject,
        message,
        status: 'new'
      })
    });

    let notificationSent = false;
    try {
      const notification = await sendContactNotification(env, {
        parent_name: parentName,
        phone,
        email,
        subject,
        message,
        contact_message_id: rows && rows[0] ? rows[0].id : null,
        submitted_at: new Date().toISOString()
      });
      notificationSent = notification.sent;
    } catch (notifyErr) {
      console.error('contact notification failed after database save', notifyErr);
    }

    return jsonResponse({ success: true, notificationSent }, 200);
  } catch (err) {
    console.error('contact: unexpected error', err);
    return jsonResponse({ success: false, error: 'Your message could not be sent. Please try again or contact us directly on WhatsApp.' }, 500);
  }
}

async function handleCheckUsername(url, env) {
  try {
    const username = clean(url.searchParams.get('username')).toLowerCase();
    if (!/^[a-z0-9_.]{3,}$/.test(username)) {
      return jsonResponse({ success: false, available: false, error: 'Username can only have letters, numbers, dots, underscores and must be at least 3 characters.' }, 400);
    }
    const existing = await supabaseFetch(env, `/rest/v1/students?username=eq.${encodeURIComponent(username)}&select=username&limit=1`, { method: 'GET' });
    return jsonResponse({ success: true, available: !(existing && existing.length) }, 200);
  } catch (err) {
    console.error('check-username: unexpected error', err);
    return jsonResponse({ success: false, available: false, error: 'Could not check username. Please try again.' }, 500);
  }
}

async function handleAvailability(url, env) {
  const date = clean(url.searchParams.get('date'));
  if (!isValidIsoDate(date)) {
    return jsonResponse({ success: false, error: 'A valid date is required.' }, 400);
  }
  const startTimes = availableStartTimesForDate(date);
  try {
    const bookings = await supabaseFetch(env, `/rest/v1/lesson_bookings?lesson_date=eq.${encodeURIComponent(date)}&status=neq.cancelled&select=start_time`, {
      method: 'GET'
    });
    const booked = new Set((bookings || []).map(row => normalizeStartTime(row.start_time)));
    const slots = startTimes.map(start_time => ({
      start_time,
      duration_minutes: 50,
      available: !booked.has(start_time)
    }));
    return jsonResponse({ success: true, date, slots }, 200);
  } catch (err) {
    console.error('availability: unexpected error', err);
    const slots = startTimes.map(start_time => ({
      start_time,
      duration_minutes: 50,
      available: true,
      fallback: true
    }));
    return jsonResponse({ success: true, date, slots, fallback: true }, 200);
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

async function sendContactNotification(env, payload) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('contact notification skipped: RESEND_API_KEY is not configured in Cloudflare.');
    return { sent: false };
  }

  const teacherEmail = env.TEACHER_EMAIL || DEFAULT_TEACHER_EMAIL;
  const senderAddress = env.RESEND_FROM_EMAIL || DEFAULT_SENDER_ADDRESS;
  const result = await sendResendEmail(apiKey, {
    from: senderAddress,
    to: [teacherEmail],
    reply_to: payload.email,
    subject: `New Contact Message: ${payload.subject}`,
    html: contactEmailHtml(payload)
  });
  if (!result.ok) console.error('contact email failed', result.error);
  return { sent: result.ok };
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

function contactEmailHtml(payload) {
  return `
    <div style="font-family:sans-serif;max-width:560px;">
      <h2 style="color:#1b2b4b;">New WinglyKids contact message</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row('Parent name', payload.parent_name)}
        ${row('Phone', payload.phone)}
        ${row('Email', payload.email)}
        ${row('Subject', payload.subject)}
        ${row('Message', payload.message)}
        ${row('Submitted at', payload.submitted_at)}
      </table>
    </div>
  `;
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
        ${row('First booked lesson', `${clean(payload.selected_lesson_date)} / ${formatDisplayTime(payload.selected_lesson_time)}`)}
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
      <p><strong>First booked lesson:</strong> ${escapeHtml(clean(payload.selected_lesson_date))} / ${escapeHtml(formatDisplayTime(payload.selected_lesson_time))}</p>
      <p><strong>Booking policy reminder:</strong> Changes require at least 24 hours' notice. Less than 24 hours' notice or no-show means the lesson is completed and is not refunded or rescheduled.</p>
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

function isValidIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`));
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(value));
}

function isValidPhone(value) {
  const digits = clean(value).replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

function isStrongPassword(value) {
  const password = String(value || '');
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

function normalizePhone(value) {
  const raw = clean(value);
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10 && digits.startsWith('5')) return `+90${digits}`;
  if (digits.length === 11 && digits.startsWith('05')) return `+9${digits}`;
  if (digits.length === 12 && digits.startsWith('90')) return `+${digits}`;
  return raw;
}

function normalizeStartTime(value) {
  const match = String(value || '').match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return '';
  return `${String(parseInt(match[1], 10)).padStart(2, '0')}:${match[2]}:00`;
}

function availableStartTimesForDate(value) {
  const selected = new Date(`${value}T12:00:00Z`);
  const cutoff = new Date('2026-08-01T00:00:00Z');
  const isWeekend = selected.getUTCDay() === 0 || selected.getUTCDay() === 6;
  if (selected < cutoff) {
    return ['14:00:00', '15:00:00', '16:00:00', '19:00:00', '20:00:00', '21:00:00'];
  }
  return isWeekend
    ? ['14:00:00', '15:00:00', '16:00:00', '17:00:00', '19:00:00', '20:00:00', '21:00:00']
    : ['19:00:00', '20:00:00', '21:00:00'];
}

function formatDisplayTime(start) {
  const normalized = normalizeStartTime(start);
  if (!normalized) return '';
  const [hours, minutes] = normalized.split(':').map(Number);
  const startDate = new Date(Date.UTC(2000, 0, 1, hours, minutes));
  const endDate = new Date(startDate.getTime() + 50 * 60000);
  const fmt = d => `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
  return `${fmt(startDate)} - ${fmt(endDate)}`;
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

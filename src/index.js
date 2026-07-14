// Main Worker script for this Workers-with-static-assets project.
//
// For almost every request, this just hands off to the static files
// (your HTML/CSS/JS) via env.ASSETS.fetch() — same as before.
//
// The ONE exception is POST /api/notify-enrollment, which runs the
// Resend email-sending logic below. The Resend API key is read from
// env.RESEND_API_KEY, an environment variable/secret you set in the
// Cloudflare dashboard — it is never present in any file here, so it
// is never visible in your site's page source.

const DEFAULT_TEACHER_EMAIL = 'winglykids@gmail.com';
const SENDER_ADDRESS = 'WinglyKidsAcademy <hello@winglykidsacademy.com>';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/notify-enrollment' && request.method === 'POST') {
      return handleNotifyEnrollment(request, env);
    }

    if (url.pathname === '/api/teacher-assignment' && request.method === 'POST') {
      return handleTeacherAssignment(request, env);
    }

    // Everything else: serve the static site exactly as before.
    return env.ASSETS.fetch(request);
  }
};

async function handleNotifyEnrollment(request, env) {
  try {
    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('notify-enrollment: RESEND_API_KEY is not set');
      return jsonResponse({ success: false, error: 'Email service not configured' }, 500);
    }

    const data = await request.json();
    const teacherEmail = env.TEACHER_EMAIL || DEFAULT_TEACHER_EMAIL;
    const childName = data.childName || '';
    const parentName = data.parentName || '';
    const parentEmail = data.parentEmail || '';
    const parentPhone = data.parentPhone || '';
    const sessionFormat = data.sessionFormat || '';
    const paymentPlan = data.paymentPlan || '';
    const preferredDays = data.preferredDays || '';
    const preferredTimeSlot = data.preferredTimeSlot || '';
    const registeredAt = data.registeredAt || new Date().toISOString();

    if (!parentEmail) {
      return jsonResponse({ success: false, error: 'Missing parent email' }, 400);
    }

    const teacherHtml = `
      <div style="font-family:sans-serif;max-width:520px;">
        <h2 style="color:#1b2b4b;">🌟 New Enrollment — WinglyKidsAcademy</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#888;">Student name</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(childName)}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Parent name</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(parentName)}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Parent email</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(parentEmail)}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Phone number</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(parentPhone)}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Lesson type</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(sessionFormat)} · ${escapeHtml(paymentPlan)}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Preferred schedule</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(preferredDays)} · ${escapeHtml(preferredTimeSlot)}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Registered at</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(registeredAt)}</td></tr>
        </table>
      </div>
    `;

    const parentHtml = `
      <div style="font-family:sans-serif;max-width:520px;">
        <h2 style="color:#1b2b4b;">Thank you for registering! 🌿</h2>
        <p>Hi ${escapeHtml(parentName)},</p>
        <p>Thank you for registering <strong>${escapeHtml(childName)}</strong> with <strong>WinglyKidsAcademy</strong>! We're excited to have you join us.</p>
        <p>WinglyKidsAcademy will contact you shortly to confirm your lesson schedule and share the class details.</p>
        <p>If you have any questions in the meantime, just reply to this email.</p>
        <p style="margin-top:24px;">Warmly,<br>WinglyKidsAcademy</p>
      </div>
    `;

    const [teacherResult, parentResult] = await Promise.all([
      sendResendEmail(apiKey, {
        from: SENDER_ADDRESS,
        to: [teacherEmail],
        reply_to: parentEmail,
        subject: `New Enrollment: ${childName}`,
        html: teacherHtml
      }),
      sendResendEmail(apiKey, {
        from: SENDER_ADDRESS,
        to: [parentEmail],
        reply_to: teacherEmail,
        subject: 'Thank you for registering with WinglyKidsAcademy!',
        html: parentHtml
      })
    ]);

    if (!teacherResult.ok) console.error('notify-enrollment: teacher email failed', teacherResult.error);
    if (!parentResult.ok) console.error('notify-enrollment: parent email failed', parentResult.error);

    return jsonResponse({
      success: true,
      teacherEmailSent: teacherResult.ok,
      parentEmailSent: parentResult.ok
    }, 200);

  } catch (err) {
    console.error('notify-enrollment: unexpected error', err);
    return jsonResponse({ success: false, error: 'Unexpected error' }, 200);
  }
}

async function sendResendEmail(apiKey, payload) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `${res.status}: ${text}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function handleTeacherAssignment(request, env) {
  try {
    const supabaseUrl = env.SUPABASE_URL;
    const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      console.error('teacher-assignment: Supabase service env vars are not set');
      return jsonResponse({ success: false, error: 'Assignment service not configured' }, 500);
    }

    const data = await request.json();
    const mode = data.mode === 'update' ? 'update' : 'create';
    const assignment = data.assignment || {};

    if (!assignment.student_id || !assignment.title || !assignment.due_date) {
      return jsonResponse({ success: false, error: 'Missing required assignment fields' }, 400);
    }

    const allowed = [
      'id', 'student_id', 'assignment_type', 'title', 'description', 'due_date',
      'status', 'checked_by_teacher', 'teacher_feedback', 'completed_at',
      'reviewed_at', 'file_path', 'attachment_storage_path', 'attachment_filename',
      'attachment_file_type', 'attachment_file_size'
    ];
    const payload = {};
    allowed.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(assignment, key)) payload[key] = assignment[key];
    });

    const endpoint = mode === 'update'
      ? `${supabaseUrl}/rest/v1/homework_assignments?id=eq.${encodeURIComponent(payload.id)}`
      : `${supabaseUrl}/rest/v1/homework_assignments`;
    const method = mode === 'update' ? 'PATCH' : 'POST';
    if (mode === 'update') delete payload.id;

    const res = await fetch(endpoint, {
      method,
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    if (!res.ok) {
      console.error('teacher-assignment: Supabase write failed', res.status, text);
      return jsonResponse({ success: false, error: text || 'Assignment save failed' }, res.status);
    }

    let row = null;
    try {
      const parsed = text ? JSON.parse(text) : [];
      row = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      row = null;
    }

    return jsonResponse({ success: true, assignment: row }, 200);
  } catch (err) {
    console.error('teacher-assignment: unexpected error', err);
    return jsonResponse({ success: false, error: 'Unexpected error' }, 500);
  }
}

function jsonResponse(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

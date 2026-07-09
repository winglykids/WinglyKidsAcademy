// Cloudflare Pages Function
// Lives at: /functions/api/notify-enrollment.js
// Becomes reachable at: https://<your-domain>/api/notify-enrollment
// Deploys automatically as part of the same folder you already drag into Cloudflare Pages.
//
// This is the ONLY place the Resend API key is used. It is read from an
// environment variable (context.env.RESEND_API_KEY) which you set in the
// Cloudflare dashboard — it is never present in any HTML/JS file, so it
// can never be seen by someone viewing your site's source.

const TEACHER_EMAIL = 'winglykids@gmail.com';
const SENDER_ADDRESS = 'WinglyKidsAcademy <hello@winglykidsacademy.com>';

export async function onRequestPost(context) {
  try {
    const apiKey = context.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('notify-enrollment: RESEND_API_KEY is not set');
      return jsonResponse({ success: false, error: 'Email service not configured' }, 500);
    }

    const data = await context.request.json();
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

    // ── Email 1: notify the teacher ──
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

    // ── Email 2: confirmation to the parent ──
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
        to: [TEACHER_EMAIL],
        reply_to: parentEmail,
        subject: `New Enrollment: ${childName}`,
        html: teacherHtml
      }),
      sendResendEmail(apiKey, {
        from: SENDER_ADDRESS,
        to: [parentEmail],
        reply_to: TEACHER_EMAIL,
        subject: 'Thank you for registering with WinglyKidsAcademy!',
        html: parentHtml
      })
    ]);

    if (!teacherResult.ok) console.error('notify-enrollment: teacher email failed', teacherResult.error);
    if (!parentResult.ok) console.error('notify-enrollment: parent email failed', parentResult.error);

    // Always return 200 to the browser — email delivery problems are logged
    // above, but should never block or affect the enrollment that already
    // succeeded in the database.
    return jsonResponse({
      success: true,
      teacherEmailSent: teacherResult.ok,
      parentEmailSent: parentResult.ok
    }, 200);

  } catch (err) {
    console.error('notify-enrollment: unexpected error', err);
    // Still return 200 — the caller (submitEnroll) treats email as best-effort
    // and must not treat this as a registration failure.
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

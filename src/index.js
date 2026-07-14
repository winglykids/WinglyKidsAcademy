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
const LOGIN_URL = 'https://winglykidsacademy.com/winglykids-student-dashboard.html';
const BANK_NAME = 'Yapı Kredi Bankası';
const ACCOUNT_HOLDER = 'NIMIT SHARMA';
const IBAN = 'TR51 0006 7010 0000 0048 0928 47';
const SIGNATURE_HTML = 'Nimit Sharma<br>Founder | WinglyKidsAcademy';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/notify-enrollment' && request.method === 'POST') {
      return handleNotifyEnrollment(request, env);
    }

    if (url.pathname === '/api/teacher-assignment' && request.method === 'POST') {
      return handleTeacherAssignment(request, env);
    }

    if (url.pathname === '/api/teacher-upload' && request.method === 'POST') {
      return handleTeacherUpload(request, env);
    }

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContactMessage(request, env);
    }

    if (url.pathname === '/api/reviews' && request.method === 'GET') {
      return handleApprovedReviews(env);
    }

    if (url.pathname === '/api/reviews' && request.method === 'POST') {
      return handleReviewSubmit(request, env);
    }

    if (url.pathname === '/api/teacher/reviews' && request.method === 'GET') {
      return handleTeacherReviews(request, env);
    }

    if (url.pathname === '/api/teacher/reviews' && request.method === 'PATCH') {
      return handleTeacherReviewDecision(request, env);
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
    const lessonsSelected = data.lessonsSelected || '';
    const pricePerLesson = data.pricePerLesson || '';
    const expectedAmount = data.expectedAmount || '';
    const username = data.username || '';
    const authEmail = data.authEmail || '';
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
          <tr><td style="padding:6px 0;color:#888;">Student username</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(username)}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Login email</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(authEmail)}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Lesson type</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(sessionFormat)} · ${escapeHtml(paymentPlan)}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Booking</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(lessonsSelected)} lesson(s) · ${escapeHtml(formatTl(pricePerLesson))} each · ${escapeHtml(formatTl(expectedAmount))} total</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Preferred schedule</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(preferredDays)} · ${escapeHtml(preferredTimeSlot)}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Payment reference</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(childName)} · ${escapeHtml(parentPhone)}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Registered at</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(registeredAt)}</td></tr>
        </table>
      </div>
    `;

    const parentHtml = `
      <div style="font-family:sans-serif;max-width:520px;">
        <h2 style="color:#1b2b4b;">Thank you for registering! 🌿</h2>
        <p>Hi ${escapeHtml(parentName)},</p>
        <p>Thank you for registering <strong>${escapeHtml(childName)}</strong> with <strong>WinglyKidsAcademy</strong>! We're excited to have you join us.</p>
        <p><strong>Your booking review:</strong><br>
        Plan: ${escapeHtml(paymentPlan)}<br>
        Lessons: ${escapeHtml(lessonsSelected)} total<br>
        Preferred days/time: ${escapeHtml(preferredDays)} · ${escapeHtml(preferredTimeSlot)}<br>
        Payment amount: ${escapeHtml(formatTl(expectedAmount))}</p>
        <p><strong>Student login details:</strong><br>
        Username: ${escapeHtml(username)}<br>
        Login email: ${escapeHtml(authEmail)}<br>
        Login page: <a href="${LOGIN_URL}">${LOGIN_URL}</a><br>
        Password: Please use the password you created during enrollment.</p>
        <p><strong>EFT / bank transfer details:</strong><br>
        Bank: ${escapeHtml(BANK_NAME)}<br>
        Account holder: ${escapeHtml(ACCOUNT_HOLDER)}<br>
        IBAN: ${escapeHtml(IBAN)}<br>
        Reference: ${escapeHtml(childName)} · ${escapeHtml(parentPhone)}</p>
        <p>WinglyKidsAcademy will contact you shortly to confirm your lesson schedule and share the class details.</p>
        <p>If you have any questions in the meantime, just reply to this email.</p>
        <p style="margin-top:24px;">${SIGNATURE_HTML}</p>
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
	        subject: 'Welcome to WinglyKidsAcademy — Login & Payment Details',
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

    if (mode === 'create' && (!assignment.student_id || !assignment.title || !assignment.due_date)) {
      return jsonResponse({ success: false, error: 'Missing required assignment fields' }, 400);
    }
    if (mode === 'update' && !assignment.id) {
      return jsonResponse({ success: false, error: 'Missing assignment id' }, 400);
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
    if (mode === 'update' && Object.keys(payload).length <= 1) {
      return jsonResponse({ success: false, error: 'No assignment updates provided' }, 400);
    }

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

async function handleTeacherUpload(request, env) {
  try {
    const supabaseUrl = env.SUPABASE_URL;
    const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      console.error('teacher-upload: Supabase service env vars are not set');
      return jsonResponse({ success: false, error: 'Upload service not configured' }, 500);
    }

    const form = await request.formData();
    const file = form.get('file');
    const studentId = String(form.get('student_id') || '').trim();
    const mode = String(form.get('mode') || 'message');

    if (!studentId || !file || typeof file.arrayBuffer !== 'function') {
      return jsonResponse({ success: false, error: 'Missing file or student' }, 400);
    }
    if (file.size > 10 * 1024 * 1024) {
      return jsonResponse({ success: false, error: 'File is bigger than 10 MB' }, 400);
    }
    if (!isTeacherUploadAllowed(file.name || '', file.type || '')) {
      return jsonResponse({ success: false, error: 'Please upload only PDF, JPG, JPEG or PNG files.' }, 400);
    }

    const safeName = cleanUploadName(file.name || 'upload');
    const randomPart = crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(16).slice(2, 10);
    const filePath = `teacher-messages/${studentId}/${Date.now()}-${randomPart}-${safeName}`;
    const uploadUrl = `${supabaseUrl}/storage/v1/object/submissions/${encodeStoragePath(filePath)}`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'false',
        'Cache-Control': '3600'
      },
      body: await file.arrayBuffer()
    });

    const uploadText = await uploadRes.text();
    if (!uploadRes.ok) {
      console.error('teacher-upload: storage upload failed', uploadRes.status, uploadText);
      return jsonResponse({ success: false, error: uploadText || 'File upload failed' }, uploadRes.status);
    }

    const attachment = {
      success: true,
      file_path: filePath,
      file_name: file.name || safeName,
      file_type: file.type || null,
      file_size: file.size || null
    };

    if (mode !== 'message') {
      return jsonResponse(attachment, 200);
    }

    const kind = attachmentKind(file.name || '', file.type || '');
    const icon = kind === 'image' ? '🖼️' : '📄';
    const messagePayload = {
      student_id: studentId,
      sender: 'teacher',
      body: `Shared file (${icon}): ${file.name || safeName}`,
      file_name: file.name || safeName,
      file_path: filePath,
      file_type: file.type || null,
      file_size: file.size || null
    };
    const messageRes = await fetch(`${supabaseUrl}/rest/v1/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(messagePayload)
    });
    const messageText = await messageRes.text();
    if (!messageRes.ok) {
      console.error('teacher-upload: message insert failed', messageRes.status, messageText);
      await fetch(`${supabaseUrl}/storage/v1/object/submissions/${encodeStoragePath(filePath)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey
        }
      }).catch(() => {});
      return jsonResponse({ success: false, error: messageText || 'File uploaded but message could not be saved' }, messageRes.status);
    }
    try {
      const parsed = messageText ? JSON.parse(messageText) : [];
      attachment.message = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      attachment.message = null;
    }
    return jsonResponse(attachment, 200);
  } catch (err) {
    console.error('teacher-upload: unexpected error', err);
    return jsonResponse({ success: false, error: err.message || 'Unexpected upload error' }, 500);
  }
}

async function handleContactMessage(request, env) {
  try {
    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) return jsonResponse({ success: false, error: 'Email service not configured' }, 500);

    const data = await request.json();
    const teacherEmail = env.TEACHER_EMAIL || DEFAULT_TEACHER_EMAIL;
    const name = String(data.name || '').trim();
    const phone = String(data.phone || '').trim();
    const email = String(data.email || '').trim();
    const subject = String(data.subject || 'Website contact form').trim();
    const message = String(data.message || '').trim();

    if (!name || !email || !message) {
      return jsonResponse({ success: false, error: 'Missing required contact fields' }, 400);
    }

    const html = `
      <div style="font-family:sans-serif;max-width:560px;">
        <h2 style="color:#1b2b4b;">New Contact Message — WinglyKidsAcademy</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#888;">Name</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Email</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(email)}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Phone</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(phone)}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Subject</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(subject)}</td></tr>
        </table>
        <p style="white-space:pre-wrap;line-height:1.6;">${escapeHtml(message)}</p>
      </div>
    `;

    const emailResult = await sendResendEmail(apiKey, {
      from: SENDER_ADDRESS,
      to: [teacherEmail],
      reply_to: email,
      subject: `Website Contact: ${subject}`,
      html
    });

    await insertContactMessageIfAvailable(env, { name, phone, email, subject, message });

    if (!emailResult.ok) return jsonResponse({ success: false, error: emailResult.error }, 502);
    return jsonResponse({ success: true }, 200);
  } catch (err) {
    console.error('contact: unexpected error', err);
    return jsonResponse({ success: false, error: 'Unexpected error' }, 500);
  }
}

async function insertContactMessageIfAvailable(env, payload) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return;
  await supabaseRest(env, '/rest/v1/contact_messages', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
      status: 'new'
    })
  }).catch(err => console.warn('contact: contact_messages insert skipped', err.message || err));
}

async function handleApprovedReviews(env) {
  try {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return jsonResponse({ success: true, reviews: [] }, 200);
    }
    const res = await supabaseRest(env, '/rest/v1/parent_reviews?select=id,parent_name,child_name,rating,review_text,approved_at&status=eq.approved&order=approved_at.desc&limit=6');
    if (!res.ok) return jsonResponse({ success: true, reviews: [] }, 200);
    return jsonResponse({ success: true, reviews: await res.json() }, 200);
  } catch (err) {
    console.warn('reviews: approved load failed', err.message || err);
    return jsonResponse({ success: true, reviews: [] }, 200);
  }
}

async function handleReviewSubmit(request, env) {
  try {
    const user = await getRequestUser(request, env);
    if (!user) return jsonResponse({ success: false, error: 'Please log in before leaving a review.' }, 401);

    const data = await request.json();
    const rating = Math.min(Math.max(Number(data.rating) || 5, 1), 5);
    const reviewText = String(data.review_text || '').trim();
    if (reviewText.length < 10) return jsonResponse({ success: false, error: 'Please write a little more before submitting.' }, 400);

    const studentRes = await supabaseRest(env, `/rest/v1/students?select=id,child_name,parent_name&auth_user_id=eq.${encodeURIComponent(user.id)}&limit=1`);
    const students = studentRes.ok ? await studentRes.json() : [];
    const student = Array.isArray(students) ? students[0] : null;
    if (!student) return jsonResponse({ success: false, error: 'Only enrolled families can leave a review.' }, 403);

    const insertRes = await supabaseRest(env, '/rest/v1/parent_reviews', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        student_id: student.id,
        parent_name: student.parent_name || 'Parent',
        child_name: student.child_name || 'Student',
        rating,
        review_text: reviewText,
        status: 'pending',
        submitted_at: new Date().toISOString()
      })
    });
    if (!insertRes.ok) return jsonResponse({ success: false, error: await insertRes.text() }, insertRes.status);
    return jsonResponse({ success: true, review: (await insertRes.json())[0] || null }, 200);
  } catch (err) {
    console.error('reviews: submit failed', err);
    return jsonResponse({ success: false, error: 'Unexpected error' }, 500);
  }
}

async function handleTeacherReviews(request, env) {
  try {
    const teacher = await requireTeacher(request, env);
    if (!teacher.ok) return teacher.response;
    const res = await supabaseRest(env, '/rest/v1/parent_reviews?select=id,parent_name,child_name,rating,review_text,status,submitted_at,approved_at&order=submitted_at.desc&limit=50');
    if (!res.ok) return jsonResponse({ success: false, error: await res.text() }, res.status);
    return jsonResponse({ success: true, reviews: await res.json() }, 200);
  } catch (err) {
    console.error('teacher reviews: load failed', err);
    return jsonResponse({ success: false, error: 'Unexpected error' }, 500);
  }
}

async function handleTeacherReviewDecision(request, env) {
  try {
    const teacher = await requireTeacher(request, env);
    if (!teacher.ok) return teacher.response;
    const data = await request.json();
    const id = String(data.id || '').trim();
    const status = data.status === 'approved' ? 'approved' : data.status === 'rejected' ? 'rejected' : '';
    if (!id || !status) return jsonResponse({ success: false, error: 'Missing review decision' }, 400);
    const now = new Date().toISOString();
    const patch = status === 'approved'
      ? { status, approved_at: now, approved_by: teacher.user.email || 'teacher', rejected_at: null }
      : { status, rejected_at: now, approved_at: null, approved_by: teacher.user.email || 'teacher' };
    const res = await supabaseRest(env, `/rest/v1/parent_reviews?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(patch)
    });
    if (!res.ok) return jsonResponse({ success: false, error: await res.text() }, res.status);
    return jsonResponse({ success: true, review: (await res.json())[0] || null }, 200);
  } catch (err) {
    console.error('teacher reviews: decision failed', err);
    return jsonResponse({ success: false, error: 'Unexpected error' }, 500);
  }
}

async function getRequestUser(request, env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) return null;
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: auth
    }
  });
  if (!res.ok) return null;
  return res.json();
}

async function requireTeacher(request, env) {
  const user = await getRequestUser(request, env);
  const teacherEmail = String(env.TEACHER_EMAIL || DEFAULT_TEACHER_EMAIL).toLowerCase();
  if (!user || String(user.email || '').toLowerCase() !== teacherEmail) {
    return { ok: false, response: jsonResponse({ success: false, error: 'Teacher access required' }, 403) };
  }
  return { ok: true, user };
}

function supabaseRest(env, path, options = {}) {
  return fetch(`${env.SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
}

function isTeacherUploadAllowed(name, type) {
  return ['application/pdf', 'image/jpeg', 'image/png'].includes(type) || /\.(pdf|jpe?g|png)$/i.test(name || '');
}

function cleanUploadName(name) {
  return String(name || 'upload')
    .normalize('NFKD')
    .replace(/[^\w.\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120) || 'upload';
}

function attachmentKind(fileName, fileType) {
  if ((fileType || '').includes('image') || /\.(jpe?g|png)$/i.test(fileName || '')) return 'image';
  if ((fileType || '').includes('pdf') || /\.pdf$/i.test(fileName || '')) return 'pdf';
  return 'file';
}

function encodeStoragePath(path) {
  return String(path).split('/').map(encodeURIComponent).join('/');
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

function formatTl(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return '';
  return `${amount.toLocaleString('tr-TR')} TL`;
}

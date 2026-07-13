const DEFAULT_SUPABASE_URL = 'https://qhyjvexemvmfavooxlao.supabase.co';
const DEFAULT_TEACHER_EMAIL = 'winglykids@gmail.com';
const DEFAULT_SENDER_ADDRESS = 'WinglyKidsAcademy <hello@winglykidsacademy.com>';
const POLICY_VERSION = '2026-07-11';
const WEBSITE_URL = 'https://winglykidsacademy.com';
const BANK_DETAILS = {
  bank: 'Yapı Kredi Bankası',
  accountHolder: 'NIMIT SHARMA',
  iban: 'TR51 0006 7010 0000 0048 0928 47'
};
const PRICING = {
  flexible: { unitPrice: 1800 },
  monthly: { unitPrice: 2000, lessonsPerWeek: 2, lessonsPerMonth: 8 }
};

const EMAIL_COPY = {
  en: {
    enrollmentSubject: 'Thank you for registering with WinglyKidsAcademy!',
    teacherEnrollmentSubject: 'New Enrollment',
    contactTeacherSubject: 'New Contact Message',
    contactParentSubject: 'Thank you for contacting WinglyKidsAcademy',
    enrollmentTitle: 'Thank you for registering! 🌿',
    teacherEnrollmentTitle: 'New WinglyKids enrollment',
    contactTeacherTitle: 'New WinglyKids contact message',
    contactParentTitle: 'Thank you for your message',
    hello: 'Hi',
    parentIntro: 'Thank you for registering',
    parentIntroSuffix: 'with WinglyKidsAcademy.',
    enrollmentReceived: 'We received your enrollment and will contact you shortly to confirm the schedule and Google Meet details.',
    contactReceived: 'We received your message and will contact you shortly.',
    paymentInstructions: 'Payment instructions',
    paymentNote: 'Please use bank transfer/EFT. Your lessons and selected time slots are confirmed after payment is received.',
    securityNote: 'For security, we do not send passwords by email. Please keep the password you chose safe.',
    signatureGreeting: 'Kind regards,',
    labels: {
      parentName: 'Parent name',
      childName: 'Student name',
      phone: 'Phone',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      submittedAt: 'Submitted at',
      ageGrade: 'Age / grade',
      englishLevel: 'English level',
      parentEmail: 'Parent email',
      whatsapp: 'WhatsApp',
      username: 'Username',
      lessonType: 'Lesson type',
      selectedPlan: 'Selected plan',
      lessonQuantity: 'Lesson quantity',
      lessonSchedule: 'Lesson schedule',
      firstBookedLesson: 'First booked lesson',
      pricePerLesson: 'Price per lesson',
      paymentAmount: 'Payment amount',
      paymentStatus: 'Payment status',
      bank: 'Bank',
      accountHolder: 'Account Holder',
      iban: 'IBAN',
      notes: 'Notes',
      registeredAt: 'Registered at',
      language: 'Language'
    },
    none: 'None',
    awaitingPayment: 'Awaiting payment'
  },
  tr: {
    enrollmentSubject: 'WinglyKidsAcademy kaydınız alındı!',
    teacherEnrollmentSubject: 'Yeni Kayıt',
    contactTeacherSubject: 'Yeni İletişim Mesajı',
    contactParentSubject: 'WinglyKidsAcademy mesajınızı aldı',
    enrollmentTitle: 'Kaydınız alındı! 🌿',
    teacherEnrollmentTitle: 'Yeni WinglyKids kaydı',
    contactTeacherTitle: 'Yeni WinglyKids iletişim mesajı',
    contactParentTitle: 'Mesajınız alındı',
    hello: 'Merhaba',
    parentIntro: 'WinglyKidsAcademy için',
    parentIntroSuffix: 'kaydınızı aldık.',
    enrollmentReceived: 'Kaydınızı aldık. Programı ve Google Meet detaylarını onaylamak için kısa süre içinde sizinle iletişime geçeceğiz.',
    contactReceived: 'Mesajınızı aldık ve kısa süre içinde sizinle iletişime geçeceğiz.',
    paymentInstructions: 'Ödeme bilgileri',
    paymentNote: 'Lütfen banka havalesi/EFT kullanın. Dersleriniz ve seçilen saatler ödeme alındıktan sonra onaylanır.',
    securityNote: 'Güvenlik için şifreleri e-posta ile göndermiyoruz. Lütfen seçtiğiniz şifreyi güvenli şekilde saklayın.',
    signatureGreeting: 'Saygılarımla,',
    labels: {
      parentName: 'Veli adı',
      childName: 'Öğrenci adı',
      phone: 'Telefon',
      email: 'E-posta',
      subject: 'Konu',
      message: 'Mesaj',
      submittedAt: 'Gönderim zamanı',
      ageGrade: 'Yaş / sınıf',
      englishLevel: 'İngilizce seviyesi',
      parentEmail: 'Veli e-postası',
      whatsapp: 'WhatsApp',
      username: 'Kullanıcı adı',
      lessonType: 'Ders tipi',
      selectedPlan: 'Seçilen plan',
      lessonQuantity: 'Ders sayısı',
      lessonSchedule: 'Ders programı',
      firstBookedLesson: 'İlk seçilen ders',
      pricePerLesson: 'Ders başı ücret',
      paymentAmount: 'Ödeme tutarı',
      paymentStatus: 'Ödeme durumu',
      bank: 'Banka',
      accountHolder: 'Hesap Sahibi',
      iban: 'IBAN',
      notes: 'Notlar',
      registeredAt: 'Kayıt zamanı',
      language: 'Dil'
    },
    none: 'Yok',
    awaitingPayment: 'Ödeme bekleniyor'
  }
};

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

    if (url.pathname === '/api/teacher-upload' && request.method === 'POST') {
      return handleTeacherUpload(request, env);
    }

    // Compatibility for the previous endpoint name. It now uses the same secure path.
    if (url.pathname === '/api/notify-enrollment' && request.method === 'POST') {
      return handleNotifyEnrollmentOnly(request, env);
    }

    return env.ASSETS.fetch(request);
  }
};

async function runPaymentReminderCheck(env) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('payment reminder skipped: RESEND_API_KEY is not configured in Cloudflare.');
    return;
  }

  const tomorrow = getIstanbulDateOffset(1);
  const bookings = await supabaseFetch(
    env,
    `/rest/v1/lesson_bookings?lesson_date=eq.${encodeURIComponent(tomorrow)}&status=neq.cancelled&select=id,student_id,lesson_date,start_time,duration_minutes,status`,
    { method: 'GET' }
  );
  if (!bookings || bookings.length === 0) return;

  const studentIds = [...new Set(bookings.map(b => b.student_id).filter(Boolean))];
  if (studentIds.length === 0) return;
  const students = await supabaseFetch(
    env,
    `/rest/v1/students?id=in.(${studentIds.map(encodeURIComponent).join(',')})&select=id,child_name,parent_name,parent_email,language,payment_status,enrollment_status,payment_plan,expected_amount`,
    { method: 'GET' }
  );
  const studentById = new Map((students || []).map(s => [s.id, s]));

  for (const booking of bookings) {
    const student = studentById.get(booking.student_id);
    if (!student || !isValidEmail(student.parent_email)) continue;
    if (student.payment_status !== 'awaiting_payment') continue;
    if (['cancelled', 'archived'].includes(clean(student.enrollment_status).toLowerCase())) continue;

    const existing = await supabaseFetch(
      env,
      `/rest/v1/payment_reminder_logs?lesson_id=eq.${encodeURIComponent(booking.id)}&reminder_type=eq.payment_due_tomorrow&select=id,sent_status&limit=1`,
      { method: 'GET' }
    );
    const log = existing && existing[0];
    if (log && ['sent', 'pending'].includes(log.sent_status)) continue;

    const language = normalizeLanguage(student.language);
    const logPayload = {
      lesson_id: booking.id,
      student_id: student.id,
      reminder_type: 'payment_due_tomorrow',
      recipient_email: student.parent_email,
      language,
      sent_status: 'pending',
      error_message: null,
      updated_at: new Date().toISOString()
    };
    const logRows = log
      ? await supabaseFetch(env, `/rest/v1/payment_reminder_logs?id=eq.${encodeURIComponent(log.id)}`, {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify(logPayload)
        })
      : await supabaseInsert(env, '/rest/v1/payment_reminder_logs', logPayload, null, {
          method: 'POST',
          headers: { Prefer: 'return=representation' }
        });
    const activeLog = (logRows && logRows[0]) || log;

    const result = await sendPaymentReminderEmail(env, student, booking, language);
    const statusPatch = result.ok
      ? { sent_status: 'sent', sent_at: new Date().toISOString(), error_message: null, updated_at: new Date().toISOString() }
      : { sent_status: 'failed', error_message: result.error || 'Unknown email error', updated_at: new Date().toISOString() };
    if (activeLog && activeLog.id) {
      await supabaseFetch(env, `/rest/v1/payment_reminder_logs?id=eq.${encodeURIComponent(activeLog.id)}`, {
        method: 'PATCH',
        body: JSON.stringify(statusPatch)
      });
    }
  }
}

async function sendPaymentReminderEmail(env, student, booking, language) {
  const apiKey = env.RESEND_API_KEY;
  const teacherEmail = env.TEACHER_EMAIL || DEFAULT_TEACHER_EMAIL;
  const senderAddress = env.RESEND_FROM_EMAIL || DEFAULT_SENDER_ADDRESS;
  const isTr = normalizeLanguage(language) === 'tr';
  const subject = isTr
    ? 'WinglyKidsAcademy ödeme hatırlatması'
    : 'WinglyKidsAcademy payment reminder';
  const lessonLine = `${booking.lesson_date} / ${formatDisplayTime(booking.start_time)}`;
  const body = isTr
    ? `
      <p>Merhaba ${escapeHtml(student.parent_name || '')},</p>
      <p>${escapeHtml(student.child_name || 'Your child')} için yarınki ders öncesi kısa bir ödeme hatırlatmasıdır.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row('Öğrenci', student.child_name)}
        ${row('Ders zamanı', lessonLine)}
        ${row('Plan', student.payment_plan)}
        ${row('Beklenen ödeme', formatTl(student.expected_amount))}
        ${row('Banka', BANK_DETAILS.bank)}
        ${row('Hesap Sahibi', BANK_DETAILS.accountHolder)}
        ${row('IBAN', BANK_DETAILS.iban)}
      </table>
      <p>Ödeme alındıktan sonra dersiniz onaylanacaktır.</p>
    `
    : `
      <p>Hi ${escapeHtml(student.parent_name || '')},</p>
      <p>This is a quick payment reminder before ${escapeHtml(student.child_name || 'your child')}'s lesson tomorrow.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row('Student', student.child_name)}
        ${row('Lesson time', lessonLine)}
        ${row('Plan', student.payment_plan)}
        ${row('Expected payment', formatTl(student.expected_amount))}
        ${row('Bank', BANK_DETAILS.bank)}
        ${row('Account Holder', BANK_DETAILS.accountHolder)}
        ${row('IBAN', BANK_DETAILS.iban)}
      </table>
      <p>Your lesson will be confirmed after payment is received.</p>
    `;
  return sendResendEmail(apiKey, {
    from: senderAddress,
    to: [student.parent_email],
    reply_to: teacherEmail,
    subject,
    html: emailShell(subject, body, language)
  });
}

function getIstanbulDateOffset(offsetDays) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date()).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});
  const base = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day) + offsetDays, 12, 0, 0));
  return base.toISOString().slice(0, 10);
}

async function handleEnroll(request, env) {
  try {
    const payload = await request.json();
    const username = clean(payload.student_username).toLowerCase();
    const password = String(payload.student_password || '');
    const parentEmail = clean(payload.parent_email).toLowerCase();
    const language = normalizeLanguage(payload.language);
    const plan = normalizePlan(payload.payment_plan);
    let pricing;
    let schedule;
    try {
      pricing = validatePricing(plan, payload.lessons_per_week);
      schedule = validateSchedulePayload(payload, pricing);
    } catch (validationErr) {
      return jsonResponse({ success: false, error: validationErr.message }, 400);
    }
    const firstLesson = schedule[0];
    const lessonDate = firstLesson.date;
    const lessonTime = firstLesson.time;

    if (!/^[a-z0-9_.]{3,}$/.test(username)) {
      return jsonResponse({ success: false, error: 'Username can only have letters, numbers, dots, underscores and must be at least 3 characters.' }, 400);
    }
    if (!isStrongPassword(password)) {
      return jsonResponse({ success: false, error: 'Password must be at least 8 characters and include at least one letter and one number.' }, 400);
    }
    if (!parentEmail.includes('@')) {
      return jsonResponse({ success: false, error: 'Parent email is required.' }, 400);
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

    for (const item of schedule) {
      const booked = await supabaseFetch(env, `/rest/v1/lesson_bookings?lesson_date=eq.${encodeURIComponent(item.date)}&start_time=eq.${encodeURIComponent(item.time)}&status=neq.cancelled&select=id&limit=1`, { method: 'GET' });
      if (booked && booked.length) {
        return jsonResponse({ success: false, error: 'Sorry, one of those times was just booked. Please choose another time.' }, 409);
      }
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
          child_name: clean(payload.child_name),
          language
        }
      })
    });

    const studentRecord = {
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
        payment_plan: plan,
        preferred_days: clean(payload.preferred_days),
        preferred_time_slot: clean(payload.preferred_time_slot),
        selected_lesson_date: lessonDate,
        selected_lesson_time: lessonTime,
        lessons_per_week: pricing.lessonsPerWeek,
        pricing_type: pricing.pricingType,
        schedule_type: pricing.scheduleType,
        lessons_selected: pricing.lessonsSelected,
        selected_schedule: schedule,
        price_per_lesson: pricing.unitPrice,
        expected_amount: pricing.totalAmount,
        payment_status: 'awaiting_payment',
        schedule_status: 'pending_confirmation',
        enrollment_status: 'pending',
        policy_accepted: true,
        policy_version: POLICY_VERSION,
        policy_accepted_at: clean(payload.policy_accepted_at) || new Date().toISOString(),
        notes: clean(payload.notes),
        language
      };
    const rows = await supabaseInsert(env, '/rest/v1/students', studentRecord, 'language', {
      method: 'POST',
      headers: { Prefer: 'return=representation' }
    });
    const studentId = rows && rows[0] ? rows[0].id : null;

    try {
      await supabaseFetch(env, '/rest/v1/lesson_bookings', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify(schedule.map((item, index) => ({
          student_id: studentId,
          lesson_date: item.date,
          start_time: item.time,
          duration_minutes: 50,
          status: 'pending_confirmation',
          notes: `Enrollment lesson ${index + 1}. ${clean(payload.notes)}`
        })))
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
      selected_schedule: schedule,
      pricing_summary: pricing,
      language,
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
    const language = normalizeLanguage(payload.language);

    if (!parentName || !phone || !email || !subject || !message) {
      return jsonResponse({ success: false, error: 'Your message could not be sent. Please try again or contact us directly on WhatsApp.' }, 400);
    }
    if (!isValidEmail(email) || !isValidPhone(phone)) {
      return jsonResponse({ success: false, error: 'Your message could not be sent. Please try again or contact us directly on WhatsApp.' }, 400);
    }

    const contactRecord = {
        parent_name: parentName,
        phone,
        email,
        subject,
        message,
        language,
        status: 'new'
      };
    const rows = await supabaseInsert(env, '/rest/v1/contact_messages', contactRecord, 'language', {
      method: 'POST',
      headers: { Prefer: 'return=representation' }
    });

    let notificationSent = false;
    try {
      const notification = await sendContactNotification(env, {
        parent_name: parentName,
        phone,
        email,
        subject,
        message,
        language,
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

async function handleTeacherUpload(request, env) {
  try {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      return jsonResponse({ success: false, error: 'Teacher login expired. Please log in again.' }, 401);
    }

    const teacher = await verifyTeacherToken(env, token);
    if (!teacher.ok) {
      return jsonResponse({ success: false, error: 'Only the teacher can upload files.' }, 403);
    }

    const form = await request.formData();
    const studentId = clean(form.get('student_id'));
    const mode = clean(form.get('mode'));
    const file = form.get('file');
    if (!studentId) {
      return jsonResponse({ success: false, error: 'Missing student.' }, 400);
    }
    if (!file || typeof file.arrayBuffer !== 'function') {
      return jsonResponse({ success: false, error: 'Missing file.' }, 400);
    }

    validateTeacherUploadFile(file);

    const studentRows = await supabaseFetch(env, `/rest/v1/students?id=eq.${encodeURIComponent(studentId)}&select=id&limit=1`, { method: 'GET' });
    if (!studentRows || studentRows.length === 0) {
      return jsonResponse({ success: false, error: 'Student not found.' }, 404);
    }

    const filePath = `teacher-messages/${studentId}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${cleanUploadName(file.name)}`;
    const uploadResult = await supabaseStorageUpload(env, filePath, file);
    if (mode === 'assignment') {
      return jsonResponse({
        success: true,
        file_path: filePath,
        file_name: file.name,
        file_type: file.type || null,
        file_size: file.size || null,
        message: null,
        storage: uploadResult
      }, 200);
    }

    const kind = getAttachmentKind(file.name, file.type);
    const icon = kind === 'image' ? '🖼️' : '📄';
    const messageRows = await supabaseInsert(env, '/rest/v1/messages', {
      student_id: studentId,
      sender: 'teacher',
      body: `Shared file (${icon}): ${file.name}`,
      file_name: file.name,
      file_path: filePath,
      file_type: file.type || null,
      file_size: file.size || null
    }, null, {
      method: 'POST',
      headers: { Prefer: 'return=representation' }
    }).catch(async (err) => {
      await supabaseStorageDelete(env, filePath).catch(deleteErr => console.error('teacher upload cleanup failed', deleteErr));
      throw err;
    });

    return jsonResponse({
      success: true,
      file_path: filePath,
      file_name: file.name,
      file_type: file.type || null,
      file_size: file.size || null,
      message: messageRows && messageRows[0] ? messageRows[0] : null,
      storage: uploadResult
    }, 200);
  } catch (err) {
    console.error('teacher-upload: unexpected error', err);
    return jsonResponse({ success: false, error: err.message || 'File upload failed.' }, 500);
  }
}

async function verifyTeacherToken(env, token) {
  const supabaseUrl = (env.SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/$/, '');
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured in Cloudflare.');

  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${token}`
    }
  });
  if (!userResponse.ok) return { ok: false };
  const user = await userResponse.json();
  const isMetadataTeacher = user && user.app_metadata && user.app_metadata.role === 'teacher';
  if (isMetadataTeacher) return { ok: true, user };

  const rows = await supabaseFetch(env, `/rest/v1/teacher_profiles?user_id=eq.${encodeURIComponent(user.id)}&select=user_id&limit=1`, { method: 'GET' });
  return { ok: Boolean(rows && rows.length), user };
}

function validateTeacherUploadFile(file) {
  const maxBytes = 10 * 1024 * 1024;
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  const allowedByName = /\.(pdf|jpe?g|png)$/i.test(file.name || '');
  if (!allowedTypes.includes(file.type) && !allowedByName) {
    throw new Error('Please upload only PDF, JPG, JPEG or PNG files.');
  }
  if (file.size > maxBytes) {
    throw new Error(`${file.name} is bigger than 10 MB.`);
  }
}

function getAttachmentKind(fileName, fileType) {
  if ((fileType || '').includes('image') || /\.(jpe?g|png)$/i.test(fileName || '')) return 'image';
  if ((fileType || '').includes('pdf') || /\.pdf$/i.test(fileName || '')) return 'pdf';
  return 'file';
}

function cleanUploadName(name) {
  return clean(name).normalize('NFKD').replace(/[^\w.\-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 120) || 'upload';
}

async function supabaseStorageUpload(env, filePath, file) {
  const supabaseUrl = (env.SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/$/, '');
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured in Cloudflare.');

  const encodedPath = filePath.split('/').map(part => encodeURIComponent(part)).join('/');
  const response = await fetch(`${supabaseUrl}/storage/v1/object/submissions/${encodedPath}`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'false'
    },
    body: await file.arrayBuffer()
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = body && (body.msg || body.message || body.error_description || body.error);
    throw new Error(message || `Storage upload failed (${response.status})`);
  }
  return body;
}

async function supabaseStorageDelete(env, filePath) {
  const supabaseUrl = (env.SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/$/, '');
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured in Cloudflare.');

  const response = await fetch(`${supabaseUrl}/storage/v1/object/submissions`, {
    method: 'DELETE',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prefixes: [filePath] })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Storage cleanup failed (${response.status})`);
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

async function supabaseInsert(env, path, record, optionalColumn, options = {}) {
  try {
    return await supabaseFetch(env, path, {
      ...options,
      body: JSON.stringify(record)
    });
  } catch (err) {
    const missingOptionalColumn = optionalColumn && new RegExp(`\\b${optionalColumn}\\b`, 'i').test(err.message || '');
    if (!missingOptionalColumn) throw err;
    const fallbackRecord = { ...record };
    delete fallbackRecord[optionalColumn];
    console.warn(`Retrying ${path} without optional column ${optionalColumn}. Run DATABASE_SETUP.sql to persist it.`);
    return supabaseFetch(env, path, {
      ...options,
      body: JSON.stringify(fallbackRecord)
    });
  }
}

async function sendEnrollmentEmails(env, payload) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured in Cloudflare.');

  const teacherEmail = env.TEACHER_EMAIL || DEFAULT_TEACHER_EMAIL;
  const senderAddress = env.RESEND_FROM_EMAIL || DEFAULT_SENDER_ADDRESS;
  const parentEmail = clean(payload.parent_email || payload.parentEmail).toLowerCase();
  const language = normalizeLanguage(payload.language);
  const copy = getEmailCopy(language);
  if (!parentEmail) throw new Error('Missing parent email.');

  const teacher = await sendResendEmail(apiKey, {
    from: senderAddress,
    to: [teacherEmail],
    reply_to: parentEmail,
    subject: `${copy.teacherEnrollmentSubject}: ${clean(payload.child_name || payload.childName)}`,
    html: teacherEmailHtml(payload, language)
  });
  const parent = await sendResendEmail(apiKey, {
    from: senderAddress,
    to: [parentEmail],
    reply_to: teacherEmail,
    subject: copy.enrollmentSubject,
    html: parentEmailHtml(payload, language)
  });

  if (!teacher.ok) console.error('teacher email failed', teacher.error);
  if (!parent.ok) console.error('parent email failed', parent.error);
  return { teacherEmailSent: teacher.ok, parentEmailSent: parent.ok };
}

async function sendContactNotification(env, payload) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('contact notification skipped: RESEND_API_KEY is not configured in Cloudflare.');
    return { sent: false, teacherSent: false, parentSent: false };
  }

  const teacherEmail = env.TEACHER_EMAIL || DEFAULT_TEACHER_EMAIL;
  const senderAddress = env.RESEND_FROM_EMAIL || DEFAULT_SENDER_ADDRESS;
  const language = normalizeLanguage(payload.language);
  const copy = getEmailCopy(language);
  const teacher = await sendResendEmail(apiKey, {
    from: senderAddress,
    to: [teacherEmail],
    reply_to: payload.email,
    subject: `${copy.contactTeacherSubject}: ${payload.subject}`,
    html: contactTeacherEmailHtml(payload, language)
  });
  const parent = await sendResendEmail(apiKey, {
    from: senderAddress,
    to: [payload.email],
    reply_to: teacherEmail,
    subject: copy.contactParentSubject,
    html: contactParentEmailHtml(payload, language)
  });
  if (!teacher.ok) console.error('contact teacher email failed', teacher.error);
  if (!parent.ok) console.error('contact parent email failed', parent.error);
  return { sent: teacher.ok || parent.ok, teacherSent: teacher.ok, parentSent: parent.ok };
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

function contactTeacherEmailHtml(payload, language) {
  const copy = getEmailCopy(language);
  const l = copy.labels;
  return emailShell(copy.contactTeacherTitle, `
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${row(l.parentName, payload.parent_name)}
      ${row(l.phone, payload.phone)}
      ${row(l.email, payload.email)}
      ${row(l.subject, payload.subject)}
      ${row(l.message, payload.message)}
      ${row(l.submittedAt, payload.submitted_at)}
      ${row(l.language, normalizeLanguage(payload.language).toUpperCase())}
    </table>
  `, language);
}

function contactParentEmailHtml(payload, language) {
  const copy = getEmailCopy(language);
  const l = copy.labels;
  return emailShell(copy.contactParentTitle, `
    <p>${copy.hello} ${escapeHtml(clean(payload.parent_name))},</p>
    <p>${copy.contactReceived}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px;">
      ${row(l.subject, payload.subject)}
      ${row(l.message, payload.message)}
      ${row(l.submittedAt, payload.submitted_at)}
    </table>
  `, language);
}

function teacherEmailHtml(payload, language) {
  const copy = getEmailCopy(language);
  const l = copy.labels;
  const pricing = normalizePricingSummary(payload);
  return emailShell(copy.teacherEnrollmentTitle, `
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${row(l.childName, payload.child_name || payload.childName)}
      ${row(l.ageGrade, `${clean(payload.child_age)} / ${clean(payload.child_grade)}`)}
      ${row(l.englishLevel, payload.english_level)}
      ${row(l.parentName, payload.parent_name || payload.parentName)}
      ${row(l.parentEmail, payload.parent_email || payload.parentEmail)}
      ${row(l.whatsapp, payload.whatsapp || payload.parentPhone)}
      ${row(l.username, payload.student_username)}
      ${row(l.lessonType, `${clean(payload.session_format || payload.sessionFormat)} / ${clean(payload.payment_plan || payload.paymentPlan)}`)}
      ${row(l.selectedPlan, clean(payload.payment_plan || payload.paymentPlan))}
      ${row(l.lessonQuantity, pricing.lessonQuantity)}
      ${row(l.lessonSchedule, formatScheduleForEmail(payload))}
      ${row(l.firstBookedLesson, `${clean(payload.selected_lesson_date)} / ${formatDisplayTime(payload.selected_lesson_time)}`)}
      ${row(l.pricePerLesson, formatTl(pricing.unitPrice))}
      ${row(l.paymentAmount, formatTl(pricing.totalAmount))}
      ${row(l.paymentStatus, copy.awaitingPayment)}
      ${row(l.notes, payload.notes || copy.none)}
      ${row(l.registeredAt, payload.registered_at || payload.registeredAt || new Date().toISOString())}
      ${row(l.language, normalizeLanguage(payload.language).toUpperCase())}
    </table>
  `, language);
}

function parentEmailHtml(payload, language) {
  const copy = getEmailCopy(language);
  const l = copy.labels;
  const parentName = clean(payload.parent_name || payload.parentName);
  const childName = clean(payload.child_name || payload.childName);
  const pricing = normalizePricingSummary(payload);
  return emailShell(copy.enrollmentTitle, `
    <p>${copy.hello} ${escapeHtml(parentName)},</p>
    <p>${copy.parentIntro} <strong>${escapeHtml(childName)}</strong> ${copy.parentIntroSuffix}</p>
    <p>${copy.enrollmentReceived}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px;">
      ${row(l.selectedPlan, clean(payload.payment_plan || payload.paymentPlan))}
      ${row(l.lessonQuantity, pricing.lessonQuantity)}
      ${row(l.lessonSchedule, formatScheduleForEmail(payload))}
      ${row(l.firstBookedLesson, `${clean(payload.selected_lesson_date)} / ${formatDisplayTime(payload.selected_lesson_time)}`)}
      ${row(l.pricePerLesson, formatTl(pricing.unitPrice))}
      ${row(l.paymentAmount, formatTl(pricing.totalAmount))}
      ${row(l.paymentStatus, copy.awaitingPayment)}
      ${row(l.bank, BANK_DETAILS.bank)}
      ${row(l.accountHolder, BANK_DETAILS.accountHolder)}
      ${row(l.iban, BANK_DETAILS.iban)}
      ${row(l.username, payload.student_username || '')}
    </table>
    <p><strong>${copy.paymentInstructions}:</strong> ${copy.paymentNote}</p>
    <p>${copy.securityNote}</p>
  `, language);
}

function row(label, value) {
  return `<tr><td style="padding:6px 0;color:#888;">${escapeHtml(label)}</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(value)}</td></tr>`;
}

function emailShell(title, body, language) {
  return `
    <div style="font-family:sans-serif;max-width:560px;color:#1b2b4b;line-height:1.55;">
      <h2 style="color:#1b2b4b;">${escapeHtml(title)}</h2>
      ${body}
      ${emailSignature(language)}
    </div>
  `;
}

function emailSignature(language) {
  const greeting = getEmailCopy(language).signatureGreeting;
  return `
    <p style="margin-top:24px;">
      ${escapeHtml(greeting)}<br><br>
      Nimit Sharma<br>
      Founder & English Language Educator<br>
      WinglyKidsAcademy<br><br>
      🌐 <a href="${WEBSITE_URL}" style="color:#1b2b4b;">${WEBSITE_URL}</a>
    </p>
  `;
}

function getEmailCopy(language) {
  return EMAIL_COPY[normalizeLanguage(language)] || EMAIL_COPY.en;
}

function normalizeLanguage(value) {
  return clean(value).toLowerCase() === 'tr' ? 'tr' : 'en';
}

function normalizePricingSummary(payload) {
  const pricing = payload.pricing_summary || payload.pricingSummary || {};
  const plan = normalizePlan(payload.payment_plan || payload.paymentPlan);
  const selected = Number.parseInt(payload.lessons_per_week || payload.lessonsPerWeek, 10);
  const isFlexible = plan === 'Flexible';
  const unitPrice = Number(pricing.unitPrice) || (isFlexible ? PRICING.flexible.unitPrice : PRICING.monthly.unitPrice);
  const lessonQuantity = Number(pricing.lessonsSelected) || (isFlexible && [1, 2, 3].includes(selected) ? selected : PRICING.monthly.lessonsPerMonth);
  const totalAmount = Number(pricing.totalAmount) || unitPrice * lessonQuantity;
  return { unitPrice, lessonQuantity, totalAmount };
}

function formatScheduleForEmail(payload) {
  const schedule = parseSchedule(payload.selected_schedule || payload.selectedSchedule);
  if (schedule.length) {
    return schedule.map(item => `${item.date} / ${formatDisplayTime(item.time)}`).join('; ');
  }
  const date = clean(payload.selected_lesson_date);
  const time = formatDisplayTime(payload.selected_lesson_time);
  return [date, time].filter(Boolean).join(' / ');
}

function parseSchedule(value) {
  if (Array.isArray(value)) return value.map(normalizeScheduleItem).filter(item => item.date && item.time);
  try {
    const parsed = JSON.parse(clean(value) || '[]');
    return Array.isArray(parsed) ? parsed.map(normalizeScheduleItem).filter(item => item.date && item.time) : [];
  } catch (_) {
    return [];
  }
}

function normalizeScheduleItem(item) {
  return {
    date: clean(item && item.date),
    time: normalizeStartTime(item && item.time)
  };
}

function formatTl(value) {
  const amount = Number(value) || 0;
  return `${amount.toLocaleString('tr-TR')} TL`;
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
    language: normalizeLanguage(payload.language),
    registered_at: payload.registered_at || payload.registeredAt
  };
}

function normalizePlan(value) {
  const plan = clean(value).toLowerCase();
  if (plan === 'flexible') return 'Flexible';
  return 'Monthly';
}

function validatePricing(plan, lessonsPerWeekValue) {
  if (plan === 'Flexible') {
    const lessonsSelected = Number.parseInt(lessonsPerWeekValue, 10) || 1;
    if (![1, 2, 3].includes(lessonsSelected)) {
      throw new Error('Flexible plan must have 1, 2, or 3 lessons.');
    }
    return {
      pricingType: 'per_lesson',
      scheduleType: 'flexible',
      lessonsSelected,
      lessonsPerWeek: lessonsSelected,
      unitPrice: PRICING.flexible.unitPrice,
      totalAmount: PRICING.flexible.unitPrice * lessonsSelected
    };
  }
  return {
    pricingType: 'monthly_package',
    scheduleType: 'fixed',
    lessonsSelected: PRICING.monthly.lessonsPerMonth,
    lessonsPerWeek: PRICING.monthly.lessonsPerWeek,
    unitPrice: PRICING.monthly.unitPrice,
    totalAmount: PRICING.monthly.unitPrice * PRICING.monthly.lessonsPerMonth
  };
}

function validateSchedulePayload(payload, pricing) {
  let schedule = [];
  try {
    const parsed = JSON.parse(clean(payload.selected_schedule) || '[]');
    if (Array.isArray(parsed)) schedule = parsed;
  } catch (_) {
    schedule = [];
  }

  if (!schedule.length && clean(payload.selected_lesson_date) && clean(payload.selected_lesson_time)) {
    schedule = [{ lesson: 1, date: clean(payload.selected_lesson_date), time: clean(payload.selected_lesson_time) }];
  }

  const requiredCount = pricing.scheduleType === 'fixed' ? PRICING.monthly.lessonsPerWeek : pricing.lessonsSelected;
  schedule = schedule.slice(0, requiredCount).map((item, index) => ({
    lesson: index + 1,
    date: clean(item.date),
    time: normalizeStartTime(item.time)
  }));

  if (schedule.length !== requiredCount || schedule.some(item => !isValidIsoDate(item.date) || !item.time)) {
    throw new Error(`Please choose date and time for ${requiredCount} lesson${requiredCount === 1 ? '' : 's'}.`);
  }

  const unique = new Set(schedule.map(item => `${item.date} ${item.time}`));
  if (unique.size !== schedule.length) {
    throw new Error('Please choose different date and time combinations.');
  }

  for (const item of schedule) {
    if (!availableStartTimesForDate(item.date).includes(item.time)) {
      throw new Error('One of the selected lesson times is not available.');
    }
  }
  return schedule;
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

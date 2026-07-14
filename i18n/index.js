(function () {
  const KEY = 'wingly_language';
  const TR = {
    'Home': 'Ana Sayfa',
    'Pricing': 'Fiyatlar',
    'How It Works': 'Nasıl Çalışır',
    'Schedule': 'Takvim',
    'Contact Us': 'İletişim',
    'Contact': 'İletişim',
    '✍️ Enroll Now': '✍️ Kayıt Ol',
    '👧 Student Login': '👧 Öğrenci Girişi',
    '👩‍🏫 Teacher Login': '👩‍🏫 Öğretmen Girişi',
    'Read. Speak. Grow. Together. 📚🗣️🌱': 'Oku. Konuş. Geliş. Birlikte. 📚🗣️🌱',
    'Live 1-on-1 English lessons where shy kids find their voice, struggling readers build confidence, and every child discovers that learning English can be fun.': 'Çekingen çocukların kendini ifade etmeye başladığı, okumakta zorlanan öğrencilerin güven kazandığı ve her çocuğun İngilizce öğrenmenin eğlenceli olabileceğini keşfettiği canlı bire bir İngilizce dersleri.',
    '✨ Real progress.': '✨ Gerçek ilerleme.',
    '😊 Happy kids.': '😊 Mutlu çocuklar.',
    '❤️ Confident learners.': '❤️ Kendine güvenen öğrenciler.',
    'How It Works →': 'Nasıl Çalışır →',
    '12 Years': '12 Yıl',
    'teaching experience': 'öğretmenlik deneyimi',
    '2× Per Week': 'Haftada 2 Kez',
    'flexible schedule': 'esnek program',
    '📸 Learning in Action': '📸 Öğrenme Anları',
    'Every lesson is an adventure': 'Her ders bir macera',
    'From phonics to projects, reading to role-play — lessons built to keep kids curious and confident.': 'Ses bilgisinden projelere, okumadan rol oyunlarına; dersler çocukların merakını ve özgüvenini canlı tutmak için hazırlanır.',
    '1-on-1': 'Bire Bir',
    'Online': 'Online',
    'Group': 'Grup',
    '📖 Reading & Comprehension': '📖 Okuma ve Anlama',
    '💻 Live Online Sessions': '💻 Canlı Online Dersler',
    '📝 Creative Projects': '📝 Yaratıcı Projeler',
    '👥 Group Study Sessions': '👥 Grup Çalışmaları',
    '💬 Family Reviews': '💬 Aile Yorumları',
    'What families say': 'Aileler ne diyor',
    'Parent reviews will appear here soon.': 'Veli yorumları yakında burada görünecek.',
    "Ready to start your child's English journey? 🚀": 'Çocuğunuzun İngilizce yolculuğuna başlamaya hazır mısınız? 🚀',
    'Spots are limited — enroll today and secure your preferred schedule.': 'Kontenjan sınırlıdır; bugün kayıt olun ve size uygun programı ayırtın.',
    "✍️ Enroll Now — It's Easy!": '✍️ Kayıt Ol — Çok Kolay!',
    'View Pricing →': 'Fiyatları Gör →',
    'Quick Links': 'Hızlı Bağlantılar',
    'Legal': 'Yasal',
    'Fun, personalised online English lessons for primary school children, based in Istanbul.': 'İstanbul merkezli, ilkokul çocukları için eğlenceli ve kişiye özel online İngilizce dersleri.',
    '📍 Istanbul, Turkey': '📍 İstanbul, Türkiye',
    '💬 Lessons held online via Google Meet': '💬 Dersler Google Meet üzerinden online yapılır',
    '© 2026 WinglyKidsAcademy · Made with ❤️ for curious kids': '© 2026 WinglyKidsAcademy · Meraklı çocuklar için ❤️ ile hazırlandı',
    'Privacy Policy': 'Gizlilik Politikası',
    'Terms & Conditions': 'Şartlar ve Koşullar',
    'Lesson options': 'Ders seçenekleri',
    'Choose the learning format that fits your child.': 'Çocuğunuza uygun öğrenme formatını seçin.',
    '💰 Pricing': '💰 Fiyatlar',
    '1-on-1 · Flexible': 'Bire Bir · Esnek',
    'Flexible Sessions': 'Esnek Dersler',
    '1-on-1 · Premium Monthly': 'Bire Bir · Premium Aylık',
    'Premium Monthly': 'Premium Aylık',
    'Small Group · 3–4 Students': 'Küçük Grup · 3-4 Öğrenci',
    'Small Group': 'Küçük Grup',
    'Face-to-Face · Limited Availability': 'Yüz Yüze · Sınırlı Kontenjan',
    'Face-to-Face': 'Yüz Yüze',
    'Book when needed, with no monthly commitment.': 'Aylık taahhüt olmadan, ihtiyaç oldukça ders alın.',
    'Fixed weekly schedule with monthly commitment and priority booking.': 'Aylık planla sabit haftalık program ve öncelikli rezervasyon.',
    'Small groups of 3–4 students with shared learning activities.': '3-4 öğrencilik küçük gruplarla ortak öğrenme etkinlikleri.',
    'Premium service for families who specifically need in-person lessons.': 'Özellikle yüz yüze ders isteyen aileler için premium hizmet.',
    '50 min per session': 'Her ders 50 dakika',
    'Book when needed': 'İhtiyaç oldukça rezervasyon',
    'No monthly commitment': 'Aylık taahhüt yok',
    'Student dashboard access': 'Öğrenci paneli erişimi',
    'Projects & activities': 'Projeler ve etkinlikler',
    'Teacher notes': 'Öğretmen notları',
    'WhatsApp parent support': 'WhatsApp veli desteği',
    'Fixed weekly schedule': 'Sabit haftalık program',
    'Monthly commitment': 'Aylık plan',
    'Priority booking': 'Öncelikli rezervasyon',
    'Homework and project tracking': 'Ödev ve proje takibi',
    'Teacher feedback': 'Öğretmen geri bildirimi',
    'Reading activities & games': 'Okuma etkinlikleri ve oyunlar',
    'Lesson materials': 'Ders materyalleri',
    '3–4 students per group': 'Grup başına 3-4 öğrenci',
    'Group projects': 'Grup projeleri',
    'Shared materials': 'Ortak materyaller',
    'Price shared privately on request': 'Ücret talep üzerine özel olarak paylaşılır',
    'Limited availability': 'Sınırlı kontenjan',
    'Premium service': 'Premium hizmet',
    'Family should message directly': 'Aile doğrudan mesaj göndermelidir',
    'Available': 'Uygunluk var',
    'per session': 'ders başına',
    'per student / session': 'öğrenci / ders başına',
    'on demand': 'talep üzerine',
    '⭐ Main Offer': '⭐ Ana Paket',
    '👥 Group': '👥 Grup',
    '🏡 Limited': '🏡 Sınırlı',
    'Get started →': 'Başla →',
    'Enroll Now →': 'Kayıt Ol →',
    'Join a group →': 'Gruba katıl →',
    'Message directly →': 'Doğrudan mesaj gönder →',
    'Cancellation Policy — No session is ever wasted!': 'İptal Politikası — Hiçbir ders boşa gitmez!',
    "If a session is cancelled for any reason (by parent or teacher), it automatically moves to a Pending list and is rescheduled at a convenient time. You always get every session you've paid for.": 'Bir ders herhangi bir nedenle iptal edilirse, uygun bir zamanda yeniden planlanmak üzere bekleme listesine alınır. Ödediğiniz her dersi mutlaka alırsınız.',
    'How it works': 'Nasıl çalışır',
    '🗺️ The Journey': '🗺️ Yolculuk',
    'From enrollment to first lesson in just a few steps.': 'Kayıttan ilk derse sadece birkaç adım.',
    'Enroll online': 'Online kayıt ol',
    "Fill in the form — child's name, age, English level, session type. Takes 3 minutes.": 'Formu doldurun: çocuğun adı, yaşı, İngilizce seviyesi ve ders türü. Yaklaşık 3 dakika sürer.',
    'Pick your schedule': 'Programını seç',
    'Choose 2 days per week from available slots. Same time every week — no rebooking.': 'Uygun saatlerden haftada 2 gün seçin. Her hafta aynı saat, yeniden rezervasyon gerekmez.',
    'Transfer & confirm': 'Ödeme yap ve onayla',
    'After choosing your schedule, bank transfer details are shown. Your spot is confirmed when the transfer is received.': 'Programınızı seçtikten sonra banka transfer bilgileri gösterilir. Ödeme ulaştığında yeriniz onaylanır.',
    'Start learning!': 'Öğrenmeye başla!',
    'Receive Google Meet link, access materials, chat with teacher — all in one place.': 'Google Meet bağlantısı, materyaller ve öğretmenle mesajlaşma; hepsi tek yerde.',
    "📚 What's included in every lesson?": '📚 Her derse neler dahil?',
    'Goal-based curriculum tailored to each child': 'Her çocuğa özel hedef odaklı program',
    'Homework, creative projects & teacher feedback': 'Ödevler, yaratıcı projeler ve öğretmen geri bildirimi',
    'Live speaking practice during lessons': 'Derslerde canlı konuşma pratiği',
    'Reading activities, games, worksheets & vocab lists': 'Okuma etkinlikleri, oyunlar, çalışma kağıtları ve kelime listeleri',
    'Lesson materials, videos & practice resources': 'Ders materyalleri, videolar ve pratik kaynakları',
    'Direct chat with teacher via the platform': 'Platform üzerinden öğretmenle doğrudan mesajlaşma',
    'Monthly progress reports (monthly plan)': 'Aylık ilerleme raporları (aylık plan)',
    '✍️ Ready? Enroll Now →': '✍️ Hazır mısınız? Kayıt Ol →',
    '📅 Availability': '📅 Uygunluk',
    'Weekly Schedule': 'Haftalık Program',
    'Weekdays 17:30–21:30 · Weekends 14:00–20:00 · 50 minutes each': 'Hafta içi 17:30-21:30 · Hafta sonu 14:00-20:00 · Her ders 50 dakika',
    'Monday': 'Pazartesi',
    'Tuesday': 'Salı',
    'Wednesday': 'Çarşamba',
    'Thursday': 'Perşembe',
    'Friday': 'Cuma',
    'Saturday': 'Cumartesi',
    'Sunday': 'Pazar',
    '✓ Available': '✓ Uygun',
    '2 spots left': '2 yer kaldı',
    'Limited': 'Sınırlı',
    '📋 Good to know': '📋 Bilmeniz iyi olur',
    'Each session is': 'Her ders',
    '50 minutes': '50 dakika',
    'long.': 'sürer.',
    'Your schedule': 'Programınız',
    'repeats automatically': 'otomatik olarak tekrar eder',
    'every week — no rebooking needed.': 'her hafta; yeniden rezervasyon gerekmez.',
    'Cancelled sessions are': 'İptal edilen dersler',
    'never lost': 'asla kaybolmaz',
    '— rescheduled via the Pending list.': 've yeniden planlanır.',
    'WhatsApp reminder': 'WhatsApp hatırlatması',
    'sent 1 hour before each session.': 'her dersten 1 saat önce gönderilir.',
    'Group sessions:': 'Grup dersleri:',
    'max 4 students': 'en fazla 4 öğrenci',
    '— book early!': 'erken rezervasyon yapın!',
    '✍️ Book Your Spot →': '✍️ Yerini Ayır →',
    '📬 Contact': '📬 İletişim',
    'Get in Touch': 'Bize Ulaşın',
    'Have questions before enrolling? We reply within a few hours.': 'Kayıt öncesi sorularınız mı var? Genellikle birkaç saat içinde yanıtlıyoruz.',
    'Send us a message': 'Bize mesaj gönderin',
    'Your name': 'Adınız',
    'Phone': 'Telefon',
    'Email': 'E-posta',
    'Subject': 'Konu',
    'Message': 'Mesaj',
    '📨 Send Message': '📨 Mesaj Gönder',
    'Location': 'Konum',
    'Lesson Hours': 'Ders Saatleri',
    'Usually replies within 1 hour': 'Genellikle 1 saat içinde yanıtlanır',
    'All lessons are online (Google Meet)': 'Tüm dersler online yapılır (Google Meet)',
    'Weekdays · 17:30 – 21:30': 'Hafta içi · 17:30 - 21:30',
    'Weekends · 14:00 – 20:00': 'Hafta sonu · 14:00 - 20:00',
    '🚀 Ready to enroll?': '🚀 Kayıt olmaya hazır mısınız?',
    'Skip the message and go straight to enrollment — takes just 3 minutes!': 'Mesajı atlayıp doğrudan kayıt formuna geçebilirsiniz; sadece 3 dakika sürer!',
    'Tell me more about lessons': 'Dersler hakkında bilgi almak istiyorum',
    'Pricing question': 'Fiyat sorusu',
    'Scheduling question': 'Program sorusu',
    'Group session availability': 'Grup dersi uygunluğu',
    'Other': 'Diğer',
    'Enroll Your Child ✍️': 'Çocuğunuzu Kaydedin ✍️',
    'Step 1 of 5 — Session type & plan': 'Adım 1 / 5 — Ders türü ve plan',
    'Session format': 'Ders formatı',
    'Payment plan': 'Ödeme planı',
    'Monthly': 'Aylık',
    '8 lessons total': 'Toplam 8 ders',
    'Flexible': 'Esnek',
    'Choose 1, 2, or 3 lessons': '1, 2 veya 3 ders seçin',
    'Flexible bookings': 'Esnek rezervasyon',
    '1 lesson': '1 ders',
    '2 lessons': '2 ders',
    '3 lessons': '3 ders',
    'Continue →': 'Devam →',
    '← Back': '← Geri',
    'Step 2 of 5 — About your child': 'Adım 2 / 5 — Çocuğunuz hakkında',
    "Child's full name": 'Çocuğun tam adı',
    'Age': 'Yaş',
    'Select age': 'Yaş seçin',
    'Grade': 'Sınıf',
    'Select grade': 'Sınıf seçin',
    'English level': 'İngilizce seviyesi',
    'Select level': 'Seviye seçin',
    'Complete beginner': 'Tam başlangıç',
    'Basic — alphabet & simple words': 'Temel — alfabe ve basit kelimeler',
    'Can form simple sentences': 'Basit cümle kurabilir',
    'Intermediate': 'Orta seviye',
    'Parent name': 'Veli adı',
    'WhatsApp': 'WhatsApp',
    'Email language': 'E-posta dili',
    'English': 'İngilizce',
    'Türkçe': 'Türkçe',
    'Step 3 of 5 — Schedule': 'Adım 3 / 5 — Program',
    'Preferred days (pick 2)': 'Tercih edilen günler (2 gün seçin)',
    'Preferred time slot': 'Tercih edilen saat',
    'Select time slot': 'Saat seçin',
    'Step 4 of 5 — Payment method': 'Adım 4 / 5 — Ödeme yöntemi',
    'Bank Transfer Details': 'Banka Havale Bilgileri',
    'Important Booking & Cancellation Policy': 'Önemli Rezervasyon ve İptal Politikası',
    'I have read and agree to the WinglyKidsAcademy Booking & Cancellation Policy.': 'WinglyKidsAcademy Rezervasyon ve İptal Politikası’nı okudum ve kabul ediyorum.',
    'Notes (optional)': 'Notlar (isteğe bağlı)',
    "Step 5 of 5 — Create your child's login": 'Adım 5 / 5 — Çocuğunuz için giriş oluşturun',
    'Choose a username': 'Kullanıcı adı seçin',
    'Choose a password': 'Şifre seçin',
    'Confirm password': 'Şifreyi onaylayın',
    '🎉 Complete Enrollment!': '🎉 Kaydı Tamamla!',
    "You're enrolled!": 'Kaydınız alındı!',
    "Thank you! You'll receive a WhatsApp message within a few hours to confirm your schedule and Google Meet link.": 'Teşekkürler! Programınızı ve Google Meet bağlantınızı onaylamak için birkaç saat içinde WhatsApp mesajı alacaksınız.',
    '← Back to site': '← Siteye dön',
    'Loading your space…': 'Alanınız yükleniyor…',
    'Daily streak': 'Günlük seri',
    'XP to next level ⚡': 'Sonraki seviyeye XP ⚡',
    'Logout': 'Çıkış Yap',
    'My Space': 'Alanım',
    'Homework': 'Ödevler',
    'Projects': 'Projeler',
    'Messages': 'Mesajlar',
    'Friends': 'Arkadaşlar',
    'My Stars': 'Yıldızlarım',
    'Parent Review': 'Veli Yorumu',
    'Families can share a website review here.': 'Aileler burada web sitesi için yorum paylaşabilir.',
    'Submit feedback': 'Geri Bildirimi Gönder',
    'Thank you for sharing your feedback.': 'Görüşlerinizi paylaştığınız için teşekkür ederiz.',
    'My Medals': 'Madalyalarım',
    "You're doing amazing — keep it up! 💪": 'Harika gidiyorsun, böyle devam! 💪',
    'Next class': 'Sonraki ders',
    'Not scheduled yet': 'Henüz planlanmadı',
    'Lessons Done': 'Tamamlanan Dersler',
    'Homework Done': 'Tamamlanan Ödevler',
    'Medals Earned': 'Kazanılan Madalyalar',
    'Avg Star Rating': 'Ortalama Yıldız',
    'Parent Notes': 'Veli Notları',
    'Next Class': 'Sonraki Ders',
    'Feedback': 'Geri Bildirim',
    'Progress': 'İlerleme',
    'Homework Due': 'Bekleyen Ödev',
    'No homework due': 'Bekleyen ödev yok',
    'Active Projects': 'Aktif Projeler',
    'No active projects': 'Aktif proje yok',
    'See all →': 'Tümünü gör →',
    'My Homework': 'Ödevlerim',
    'Complete your homework before the due date — your teacher can see it!': 'Ödevini son tarihten önce tamamla; öğretmenin görebilir!',
    'My Projects': 'Projelerim',
    'Projects are bigger tasks — take your time and have fun with them!': 'Projeler daha büyük çalışmalardır; zamanını kullan ve keyif al!',
    'My Schedule': 'Programım',
    'Join Google Meet 📹': 'Google Meet’e Katıl 📹',
    'Past Sessions': 'Geçmiş Dersler',
    'Chat with Teacher': 'Öğretmenle Mesajlaş',
    'Send messages, ask questions or share something fun! 😊': 'Mesaj gönder, soru sor veya eğlenceli bir şey paylaş! 😊',
    'Only teacher and student can see uploads/messages.': 'Yüklemeleri ve mesajları yalnızca öğretmen ve öğrenci görebilir.',
    'Your Teacher 🌿': 'Öğretmenin 🌿',
    'WinglyKidsAcademy · Always here to help!': 'WinglyKidsAcademy · Yardım için buradayım!',
    'New messages ↓': 'Yeni mesajlar ↓',
    'Quick:': 'Hızlı:',
    '📎 Upload': '📎 Yükle',
    'Type your message...': 'Mesajını yaz...',
    'Upload homework, projects, photos or videos: PDF, JPG, PNG, MP4': 'Ödev, proje, fotoğraf veya video yükle: PDF, JPG, PNG, MP4',
    'Friends & Study Groups': 'Arkadaşlar ve Çalışma Grupları',
    'Learn together, share projects and practise English with classmates.': 'Birlikte öğren, projelerini paylaş ve arkadaşlarınla İngilizce pratik yap.',
    'My Star Performance': 'Yıldız Performansım',
    'My Medal Cabinet': 'Madalyalarım',
    'Session Ratings': 'Ders Puanları',
    'Delete': 'Sil',
    'This message was deleted.': 'Bu mesaj silindi.',
    'Are you sure you want to delete this message?': 'Bu mesajı silmek istediğinizden emin misiniz?'
  };

  function normalizeLanguage(value) {
    return String(value || '').trim().toUpperCase() === 'TR' ? 'TR' : 'EN';
  }

  function getLanguage() {
    return normalizeLanguage(localStorage.getItem(KEY));
  }

  function translateText(text, lang) {
    if (lang !== 'TR') return text;
    return TR[text] || text;
  }

  function walkText(root, lang) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || ['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (!node.__winglyOriginal) node.__winglyOriginal = node.nodeValue;
      const raw = node.__winglyOriginal;
      const trimmed = raw.trim();
      if (!trimmed) return;
      const translated = translateText(trimmed, lang);
      const next = raw.replace(trimmed, translated);
      if (node.nodeValue !== next) node.nodeValue = next;
    });
  }

  function translateAttributes(root, lang) {
    root.querySelectorAll('[placeholder],[title],[aria-label],option').forEach(el => {
      ['placeholder', 'title', 'aria-label'].forEach(attr => {
        if (!el.hasAttribute(attr)) return;
        const key = `data-wingly-original-${attr}`;
        if (!el.hasAttribute(key)) el.setAttribute(key, el.getAttribute(attr));
        const next = translateText(el.getAttribute(key), lang);
        if (el.getAttribute(attr) !== next) el.setAttribute(attr, next);
      });
    });
  }

  function ensureSwitch(container) {
    if (!container || container.querySelector('.wingly-lang-switch')) return;
    const wrap = document.createElement('div');
    wrap.className = 'wingly-lang-switch';
    wrap.setAttribute('aria-label', 'Language');
    wrap.innerHTML = '<button type="button" data-lang="EN">EN</button><span>/</span><button type="button" data-lang="TR">TR</button>';
    wrap.addEventListener('click', event => {
      const btn = event.target.closest('button[data-lang]');
      if (btn) setLanguage(btn.dataset.lang);
    });
    container.appendChild(wrap);
  }

  function syncControls(lang) {
    document.querySelectorAll('.wingly-lang-switch button[data-lang]').forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    const emailLang = document.getElementById('preferred_language');
    if (emailLang) emailLang.value = lang;
  }

  function applyTranslations(language) {
    const lang = normalizeLanguage(language);
    document.documentElement.lang = lang === 'TR' ? 'tr' : 'en';
    document.title = lang === 'TR'
      ? document.title.replace('Online English Lessons for Kids', 'Çocuklar İçin Online İngilizce Dersleri').replace('My Learning Space', 'Öğrenme Alanım')
      : document.title.replace('Çocuklar İçin Online İngilizce Dersleri', 'Online English Lessons for Kids').replace('Öğrenme Alanım', 'My Learning Space');
    walkText(document.body, lang);
    translateAttributes(document.body, lang);
    syncControls(lang);
  }

  function setLanguage(language) {
    const lang = normalizeLanguage(language);
    localStorage.setItem(KEY, lang);
    applyTranslations(lang);
    window.dispatchEvent(new CustomEvent('wingly-language-change', { detail: { language: lang } }));
  }

  function init() {
    const navLanguageSlot = document.getElementById('nav-language-slot');
    if (navLanguageSlot) ensureSwitch(navLanguageSlot);
    else ensureSwitch(document.querySelector('.nav-portal-btns'));
    ensureSwitch(document.querySelector('.tb-right'));
    ensureSwitch(document.querySelector('.em-title')?.parentElement);
    applyTranslations(getLanguage());
    let timer = null;
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => applyTranslations(getLanguage()), 80);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.WinglyI18n = { normalizeLanguage, getLanguage, setLanguage, applyTranslations, refresh: () => applyTranslations(getLanguage()) };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

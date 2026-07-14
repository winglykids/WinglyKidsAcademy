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
    'Where kids fall in love with English!': 'Çocukların İngilizceyi sevdiği yer!',
    'Fun, personalised 1-on-1 and group English lessons for primary school children. Live online sessions, real progress, happy kids — and happy parents! 🎉': 'İlkokul çocukları için eğlenceli, kişiye özel bire bir ve grup İngilizce dersleri. Canlı çevrim içi dersler, gerçek ilerleme, mutlu çocuklar ve mutlu aileler! 🎉',
    'How It Works →': 'Nasıl Çalışır →',
    '12 Years': '12 Yıl',
    'teaching experience': 'öğretmenlik deneyimi',
    '2× Per Week': 'Haftada 2 Kez',
    'flexible schedule': 'esnek program',
    'Every lesson is an adventure': 'Her ders bir macera',
    'What families say': 'Aileler ne diyor',
    'Parent reviews will appear here soon.': 'Veli yorumları yakında burada görünecek.',
    "Ready to start your child's English journey? 🚀": 'Çocuğunuzun İngilizce yolculuğuna başlamaya hazır mısınız? 🚀',
    'Spots are limited — enroll today and secure your preferred schedule.': 'Kontenjan sınırlıdır; bugün kayıt olun ve size uygun programı ayırtın.',
    "✍️ Enroll Now — It's Easy!": '✍️ Kayıt Ol — Çok Kolay!',
    'View Pricing →': 'Fiyatları Gör →',
    'Quick Links': 'Hızlı Bağlantılar',
    'Legal': 'Yasal',
    'Privacy Policy': 'Gizlilik Politikası',
    'Terms & Conditions': 'Şartlar ve Koşullar',
    'Lesson options': 'Ders seçenekleri',
    'Choose the learning format that fits your child.': 'Çocuğunuza uygun öğrenme formatını seçin.',
    'Flexible Sessions': 'Esnek Dersler',
    'Premium Monthly': 'Premium Aylık',
    'Small Group': 'Küçük Grup',
    'Get started →': 'Başla →',
    'Enroll Now →': 'Kayıt Ol →',
    'How it works': 'Nasıl çalışır',
    'Enroll online': 'Online kayıt ol',
    'Pick your schedule': 'Programını seç',
    'Transfer & confirm': 'Ödeme yap ve onayla',
    'Start learning!': 'Öğrenmeye başla!',
    'Weekly Schedule': 'Haftalık Program',
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
        const key = `winglyOriginal${attr}`;
        if (!el.dataset[key]) el.dataset[key] = el.getAttribute(attr);
        const next = translateText(el.dataset[key], lang);
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
    ensureSwitch(document.querySelector('.nav-portal-btns'));
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

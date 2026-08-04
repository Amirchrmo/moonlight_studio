/* =============================================================================
 * Moonlight Studio — فایل محتوای متمرکز صفحه (Centralized Page Content)
 * =============================================================================
 *
 * ▸ راهنمای کلی برای کارفرما:
 *   تمام متن‌ها، تصاویر و لینک‌های قابل‌ویرایشِ سایت در همین یک فایل قرار دارند.
 *   برای تغییر محتوای سایت، فقط مقدار داخل گیومه‌ها ("...") را عوض کنید و
 *   ساختار فایل (نام فیلدها، آکولادها {} و براکت‌ها []) را دست‌نخورده بگذارید.
 *
 * ▸ درباره‌ی فرمت فایل:
 *   این فایل یک ماژول جاوااسکریپت است که فقط «داده» نگه می‌دارد (مثل JSON ولی با
 *   قابلیت افزودن توضیح/کامنت فارسی). تنها بخش «کد» آن، خط اول (export default) و
 *   آکولاد انتهایی است؛ باقی همه محتواست. هیچ کامپوننت React را لازم نیست ویرایش کنید.
 *
 * ▸ درباره‌ی تصاویر (مهم):
 *   تصاویر فعلی از سرویس نمونه‌ی «picsum» بارگذاری می‌شوند و مقدار "src" آن‌ها یک
 *   «کد عکس» (یک عدد) است، نه مسیر فایل. برای جایگزینی با عکس واقعی، کافی است این
 *   عدد را با کد عکس دلخواه عوض کنید. اگر خواستید از عکس‌های آپلودی خودتان استفاده
 *   کنید، به توسعه‌دهنده بگویید تا مسیر فایل (مثلاً "/images/hero.jpg") را جایگزین کند.
 *   فیلد "alt" متن جایگزین تصویر برای دسترس‌پذیری و سئوست و باید توصیف کوتاه تصویر باشد.
 * ========================================================================== */

const content = {
  /* ---------------------------------------------------------------------------
   * اطلاعات کلی سایت (لوگو، نام برند، سئو)
   * ------------------------------------------------------------------------- */
  site: {
    // نام استودیو؛ در متن جایگزین لوگو و برچسب‌های دسترس‌پذیری استفاده می‌شود
    brandName: "Moonlight Studio",

    // لوگوی سایت که در نوار بالای همه‌ی صفحه‌ها نمایش داده می‌شود
    // ابعاد فایل فعلی حدود 2685×628 (لوگوی سفید روی زمینه‌ی شفاف)
    logo: {
      src: "/logo.png",
      alt: "Moonlight Studio",
    },

    // مقادیر سئو و عنوان مرورگر. توجه: این مقادیر در فایل index.html قرار دارند
    // (چون مرورگر آن‌ها را پیش از بارگذاری React می‌خواند). برای تغییر واقعی سئو،
    // علاوه بر این‌جا، همان مقادیر را در فایل index.html نیز به‌روزرسانی کنید.
    seo: {
      // عنوان صفحه در تب مرورگر و نتایج گوگل؛ کمتر از ۶۰ کاراکتر توصیه می‌شود
      title: "Moonlight Studio — Luxury Photography",
      // توضیح متا برای موتورهای جست‌وجو؛ حدود ۱۵۰ تا ۱۶۰ کاراکتر
      description:
        "Moonlight Studio is a luxury photography studio crafting cinematic, timeless imagery — commercial, portrait, fashion, wedding and editorial photography.",
    },
  },

  /* ---------------------------------------------------------------------------
   * اطلاعات تماس مرجع (منبع واحد)
   * این مقادیر یک‌بار این‌جا تعریف می‌شوند و هم در «صفحه‌ی تماس» و هم در «فوتر»
   * استفاده می‌شوند؛ پس با تغییر آن‌ها در همین بخش، همه‌جا به‌روز می‌شود.
   * ------------------------------------------------------------------------- */
  contactInfo: {
    // نشانی اینستاگرام استودیو
    instagram: {
      // متنی که در صفحه‌ی تماس نمایش داده می‌شود (آی‌دی صفحه)
      value: "@moonlight.studio",
      // لینک کامل صفحه‌ی اینستاگرام
      url: "https://instagram.com/moonlight.studio",
    },
    // شماره تماس استودیو
    phone: {
      // شماره‌ای که روی صفحه دیده می‌شود
      value: "+989145321207",
      // همان شماره بدون فاصله/علامت، برای قابلیت کلیک و تماس (پیشوند tel:)
      tel: "+989145321207",
    },
    // ایمیل استودیو
    email: "hello@moonlight.studio",
    // نشانی/آدرس استودیو
    address: {
      // خط اول آدرس (در فوتر)
      line1: "14 Aurelia Lane",
      // خط دوم آدرس (در فوتر)
      line2: "San Francisco, CA",
      // یادداشت زیر آدرس در فوتر
      note: "By appointment",
      // آدرس کامل تک‌خطی که در کارت آدرسِ صفحه‌ی تماس نمایش داده می‌شود
      full: "14 Aurelia Lane, San Francisco, CA",
      // لینک نقشه (با کلیک روی کارت آدرس باز می‌شود)
      mapUrl: "https://maps.google.com/?q=14+Aurelia+Lane+San+Francisco+CA",
    },
  },

  /* ---------------------------------------------------------------------------
   * منوی ناوبری اصلی (نوار بالای سایت + منوی موبایل)
   * برای افزودن/حذف آیتم منو، عضوی از این آرایه را اضافه یا کم کنید.
   * فیلد end فقط برای صفحه‌ی خانه true است (نباید تغییر کند).
   * ------------------------------------------------------------------------- */
  navigation: [
    { label: "Home", url: "/", end: true },
    { label: "Portfolio", url: "/portfolio" },
    { label: "About", url: "/about" },
    { label: "Contact", url: "/contact" },
  ],

  /* ---------------------------------------------------------------------------
   * بخش «هیرو» صفحه‌ی خانه (تصویر تمام‌صفحه‌ی بالای سایت)
   * ------------------------------------------------------------------------- */
  hero: {
    // برچسب کوچک بالای تیتر اصلی
    // eyebrow: "Moonlight Studio — Est. 2014",

    // تیتر بزرگ صفحه، سه کلمه در سه خط. کلمه‌ای که accent:true دارد با رنگ برند و
    // به‌صورت ایتالیک نمایش داده می‌شود. برای هماهنگی انیمیشن، تعداد خطوط را کم/زیاد نکنید.
    titleLines: [
      { text: "Light" },
      { text: "that" },
      { text: "remembers", accent: true },
    ],

    // توضیح کوتاه زیر تیتر؛ بهتر است کمتر از ۱۶۰ کاراکتر باشد
    tagline:
      "A luxury photography studio composing cinematic, timeless imagery — for the people, brands and moments worth keeping forever.",

    // دکمه‌ی اصلی (پررنگ) بخش هیرو
    primaryButton: { label: "View the portfolio", url: "/portfolio", openInNewTab: false },
    // دکمه‌ی دوم (شیشه‌ای) بخش هیرو
    secondaryButton: { label: "Our story", url: "/about", openInNewTab: false },

    // متن نشانگر اسکرول در گوشه‌ی پایین راست
    scrollLabel: "Scroll",

    // برچسب دسترس‌پذیری کل بخش هیرو (برای صفحه‌خوان‌ها؛ روی صفحه دیده نمی‌شود)
    ariaLabel: "Introduction",

    // تصویر پس‌زمینه‌ی تمام‌صفحه‌ی هیرو؛ ابعاد پیشنهادی: 1920×1080 یا بزرگ‌تر
    image: { src: 1027, alt: "A cinematic black and white portrait" },
  },

  /* ---------------------------------------------------------------------------
   * اسلایدر سینمایی تمام‌صفحه (بلافاصله زیر هیرو در صفحه‌ی خانه)
   * ------------------------------------------------------------------------- */
  slider: {
    // برچسب دسترس‌پذیری کل اسلایدر
    ariaLabel: "Featured work",
    // متن دکمه‌ای که به صفحه‌ی نمونه‌کارها می‌رود
    viewAllButton: { label: "All projects", url: "/portfolio", openInNewTab: false },
    // اسلایدهای اسلایدر؛ هر آیتم یک تصویر تمام‌صفحه با عنوان و دسته‌بندی است
    items: [
      { title: "Nocturne", category: "Portrait", image: { src: 1027, alt: "Nocturne — Portrait" } },
      { title: "Objects of Desire", category: "Commercial", image: { src: 1080, alt: "Objects of Desire — Commercial" } },
      { title: "Atelier Noir", category: "Fashion", image: { src: 64, alt: "Atelier Noir — Fashion" } },
      { title: "First Light", category: "Wedding", image: { src: 1039, alt: "First Light — Wedding" } },
      { title: "Two", category: "Couple", image: { src: 1062, alt: "Two — Couple" } },
    ],
  },

  /* ---------------------------------------------------------------------------
   * بخش‌های میانی صفحه‌ی خانه (بعد از اسلایدر)
   * ------------------------------------------------------------------------- */
  home: {
    // بخش «فلسفه/معرفی» — یک جمله‌ی بزرگ درباره‌ی رویکرد استودیو
    intro: {
      // برچسب کوچک بالای جمله
      eyebrow: "The studio",
      // جمله‌ی اصلی؛ کلمه‌ی وسط (emphasis) با رنگ برند و ایتالیک نمایش داده می‌شود
      statement: {
        before: "We photograph not the moment, but the ",
        emphasis: "feeling",
        after:
          " that outlives it — composing frames that stay luminous long after the light has gone.",
      },
      // لینک متنی زیر جمله (فلش ← به‌صورت خودکار اضافه می‌شود)
      link: { label: "Read our philosophy", url: "/about", openInNewTab: false },
    },

    // بخش «کارهای منتخب» — چهار نمونه‌کار اول از فهرست نمونه‌کارها به‌صورت خودکار نمایش داده می‌شوند
    featured: {
      // تیتر بخش
      title: "Selected work",
      // دکمه‌ی رفتن به صفحه‌ی کامل نمونه‌کارها
      button: { label: "Explore portfolio", url: "/portfolio", openInNewTab: false },
    },

    // نوار متحرک (مارکی) بین بخش‌ها؛ متن به‌صورت پیوسته حرکت می‌کند
    marquee: {
      text: "Cinematic · Editorial · Timeless · Emotional · Cinematic · Editorial · Timeless · Emotional · ",
    },

    // بخش «خدمات» — کارت‌های خدمات استودیو
    services: {
      // برچسب کوچک بالای تیتر
      eyebrow: "What we do",
      // تیتر بخش خدمات
      title: "A full-service studio for images that endure.",
      // فهرست خدمات؛ شماره (n) صرفاً نمایشی است. برای افزودن خدمت، یک عضو جدید اضافه کنید.
      items: [
        { n: "01", title: "Commercial", text: "Campaigns and brand imagery with a cinematic signature." },
        { n: "02", title: "Portrait", text: "Character-driven portraiture, quiet and unhurried." },
        { n: "03", title: "Fashion", text: "Editorial fashion stories with sculptural light." },
        { n: "04", title: "Weddings", text: "Documentary elegance for the day you keep forever." },
      ],
    },

    // بخش «آمار» — چهار عدد کلیدی درباره‌ی استودیو
    statistics: {
      // هر آیتم: value = عدد نمایشی، label = توضیح زیر عدد
      items: [
        { value: "11", label: "Years behind the lens" },
        { value: "480+", label: "Stories told" },
        { value: "27", label: "Countries traveled" },
        { value: "14", label: "Industry awards" },
      ],
    },

    // بخش پایانی صفحه‌ی خانه (نوار دعوت به اقدام روی تصویر تیره)
    cta: {
      // برچسب کوچک بالای تیتر
      eyebrow: "Available for 2026 commissions",
      // تیتر؛ خط دوم (emphasis) با رنگ برند و ایتالیک نمایش داده می‌شود
      title: { line1: "Let's make something", emphasis: "unforgettable." },
      // دکمه‌ی اصلی که به صفحه‌ی تماس می‌رود
      button: { label: "Get in touch", url: "/contact", openInNewTab: false },
      // تصویر پس‌زمینه‌ی این بخش؛ ابعاد پیشنهادی: 1920×800 (تصویر تیره)
      image: { src: 341, alt: "Studio still life" },
    },
  },

  /* ---------------------------------------------------------------------------
   * صفحه‌ی نمونه‌کارها (Portfolio)
   * ------------------------------------------------------------------------- */
  portfolio: {
    // سربرگ بالای صفحه‌ی نمونه‌کارها
    header: {
      // برچسب کوچک
      eyebrow: "Portfolio",
      // تیتر؛ خط دوم (emphasis) با رنگ برند و ایتالیک است
      title: { line1: "A decade of", emphasis: "quiet obsession." },
      // توضیح زیر تیتر
      subtitle:
        "Browse selected commissions across commercial, portrait, fashion, wedding and personal work. Every project opens into a fullscreen gallery.",
    },

    // دسته‌بندی‌های فیلتر بالای گرید. آیتم اول ("All") یعنی «همه» و باید بماند.
    // این دسته‌ها باید با فیلد category در پروژه‌های زیر یکسان باشند.
    categories: ["All", "Commercial", "Portrait", "Fashion", "Wedding", "Birthday", "Couple", "Kids"],

    // فهرست پروژه‌ها. هر پروژه یک کارت در گرید است و با کلیک، گالری تمام‌صفحه باز می‌شود.
    //  • id: شناسه‌ی یکتا (انگلیسی/بدون فاصله) — نباید تکراری باشد
    //  • title / category / year / location: متن‌های نمایشی کارت و گالری
    //  • blurb: توضیح کوتاه پروژه
    //  • ratio: نسبت ابعاد تصویر کاور (تنظیم چیدمان — بهتر است تغییر نکند)
    //  • cover: تصویر کاور کارت
    //  • gallery: تصاویر گالری تمام‌صفحه‌ی همان پروژه
    projects: [
      {
        id: "atelier-noir",
        title: "Atelier Noir",
        category: "Fashion",
        year: "2025",
        location: "Paris",
        blurb: "An editorial study of tailoring, shadow and stillness.",
        ratio: 0.8,
        cover: { src: 64, alt: "Atelier Noir — Fashion" },
        gallery: [
          { src: 64, alt: "Atelier Noir — image 1" },
          { src: 65, alt: "Atelier Noir — image 2" },
          { src: 66, alt: "Atelier Noir — image 3" },
          { src: 68, alt: "Atelier Noir — image 4" },
        ],
      },
      {
        id: "first-light",
        title: "First Light",
        category: "Wedding",
        year: "2025",
        location: "Tuscany",
        blurb: "A quiet ceremony captured between dawn and the hills.",
        ratio: 1.5,
        cover: { src: 1039, alt: "First Light — Wedding" },
        gallery: [
          { src: 1039, alt: "First Light — image 1" },
          { src: 1043, alt: "First Light — image 2" },
          { src: 1050, alt: "First Light — image 3" },
          { src: 1053, alt: "First Light — image 4" },
        ],
      },
      {
        id: "the-founder",
        title: "The Founder",
        category: "Portrait",
        year: "2024",
        location: "New York",
        blurb: "Character portraiture for a modern house of design.",
        ratio: 0.8,
        cover: { src: 1005, alt: "The Founder — Portrait" },
        gallery: [
          { src: 1005, alt: "The Founder — image 1" },
          { src: 1011, alt: "The Founder — image 2" },
          { src: 1012, alt: "The Founder — image 3" },
          { src: 1025, alt: "The Founder — image 4" },
        ],
      },
      {
        id: "objects-of-desire",
        title: "Objects of Desire",
        category: "Commercial",
        year: "2025",
        location: "Milan",
        blurb: "Product storytelling for a luxury fragrance launch.",
        ratio: 1.5,
        cover: { src: 1080, alt: "Objects of Desire — Commercial" },
        gallery: [
          { src: 1080, alt: "Objects of Desire — image 1" },
          { src: 1084, alt: "Objects of Desire — image 2" },
          { src: 106, alt: "Objects of Desire — image 3" },
          { src: 119, alt: "Objects of Desire — image 4" },
        ],
      },
      {
        id: "two",
        title: "Two",
        category: "Couple",
        year: "2024",
        location: "Lisbon",
        blurb: "Intimacy, distance and the space between two people.",
        ratio: 1.5,
        cover: { src: 1062, alt: "Two — Couple" },
        gallery: [
          { src: 1062, alt: "Two — image 1" },
          { src: 1074, alt: "Two — image 2" },
          { src: 177, alt: "Two — image 3" },
          { src: 203, alt: "Two — image 4" },
        ],
      },
      {
        id: "small-hands",
        title: "Small Hands",
        category: "Kids",
        year: "2025",
        location: "Copenhagen",
        blurb: "The unguarded honesty of childhood, in monochrome.",
        ratio: 0.8,
        cover: { src: 1074, alt: "Small Hands — Kids" },
        gallery: [
          { src: 1074, alt: "Small Hands — image 1" },
          { src: 1069, alt: "Small Hands — image 2" },
          { src: 1066, alt: "Small Hands — image 3" },
          { src: 1084, alt: "Small Hands — image 4" },
        ],
      },
      {
        id: "golden-year",
        title: "Golden Year",
        category: "Birthday",
        year: "2024",
        location: "London",
        blurb: "A milestone celebration documented like a film.",
        ratio: 1.5,
        cover: { src: 219, alt: "Golden Year — Birthday" },
        gallery: [
          { src: 219, alt: "Golden Year — image 1" },
          { src: 225, alt: "Golden Year — image 2" },
          { src: 250, alt: "Golden Year — image 3" },
          { src: 292, alt: "Golden Year — image 4" },
        ],
      },
      {
        id: "silhouette",
        title: "Silhouette",
        category: "Fashion",
        year: "2025",
        location: "Berlin",
        blurb: "Sculptural forms and the architecture of the body.",
        ratio: 0.8,
        cover: { src: 338, alt: "Silhouette — Fashion" },
        gallery: [
          { src: 338, alt: "Silhouette — image 1" },
          { src: 342, alt: "Silhouette — image 2" },
          { src: 349, alt: "Silhouette — image 3" },
          { src: 351, alt: "Silhouette — image 4" },
        ],
      },
      {
        id: "house-of-glass",
        title: "House of Glass",
        category: "Commercial",
        year: "2024",
        location: "Tokyo",
        blurb: "A campaign built on reflection, light and restraint.",
        ratio: 1.5,
        cover: { src: 366, alt: "House of Glass — Commercial" },
        gallery: [
          { src: 366, alt: "House of Glass — image 1" },
          { src: 370, alt: "House of Glass — image 2" },
          { src: 374, alt: "House of Glass — image 3" },
          { src: 375, alt: "House of Glass — image 4" },
        ],
      },
      {
        id: "vows",
        title: "Vows",
        category: "Wedding",
        year: "2025",
        location: "Santorini",
        blurb: "Two families, one horizon, and everything unsaid.",
        ratio: 0.8,
        cover: { src: 431, alt: "Vows — Wedding" },
        gallery: [
          { src: 431, alt: "Vows — image 1" },
          { src: 447, alt: "Vows — image 2" },
          { src: 453, alt: "Vows — image 3" },
          { src: 459, alt: "Vows — image 4" },
        ],
      },
      {
        id: "her",
        title: "Her",
        category: "Portrait",
        year: "2024",
        location: "Vienna",
        blurb: "A single subject, studied across an afternoon.",
        ratio: 0.8,
        cover: { src: 494, alt: "Her — Portrait" },
        gallery: [
          { src: 494, alt: "Her — image 1" },
          { src: 505, alt: "Her — image 2" },
          { src: 513, alt: "Her — image 3" },
          { src: 524, alt: "Her — image 4" },
        ],
      },
      {
        id: "the-in-between",
        title: "The In-Between",
        category: "Couple",
        year: "2025",
        location: "Oslo",
        blurb: "A love story told in glances rather than poses.",
        ratio: 1.5,
        cover: { src: 628, alt: "The In-Between — Couple" },
        gallery: [
          { src: 628, alt: "The In-Between — image 1" },
          { src: 633, alt: "The In-Between — image 2" },
          { src: 637, alt: "The In-Between — image 3" },
          { src: 659, alt: "The In-Between — image 4" },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------------------
   * صفحه‌ی درباره‌ی ما (About)
   * ------------------------------------------------------------------------- */
  about: {
    // سربرگ بالای صفحه
    header: {
      eyebrow: "About the studio",
      // تیتر دو خطی؛ بخش emphasis با رنگ برند و ایتالیک است
      title: { lead: "We are a small studio", beforeEmphasis: "with a ", emphasis: "long memory." },
    },
    // تصویر بزرگ عرضی زیر سربرگ؛ ابعاد پیشنهادی: 1920×870
    heroImage: { src: 1027, alt: "The studio at work" },

    // بخش ۰۱ — داستان ما
    story: {
      index: "01",
      title: "Our Story",
      // پاراگراف‌های داستان (هر عضو آرایه یک پاراگراف است)
      paragraphs: [
        "Moonlight Studio began in 2014 in a borrowed darkroom, with a single medium-format camera and a stubborn belief that photographs should feel like memories rather than records. What started as a two-person practice has grown into a full creative studio — yet the intention has never moved.",
        "We work slowly and deliberately, taking on a limited number of commissions each year so that every project receives the attention it deserves. Our images live in campaigns, in galleries, and — most meaningfully — on the walls of the families who trusted us with their moments.",
      ],
    },

    // بخش ۰۲ — چشم‌انداز ما
    vision: {
      index: "02",
      title: "Our Vision",
      paragraph:
        "We believe luxury is not gloss — it is feeling, permanence, and truth. Our vision is to make photography that resists the pace of the feed: images unhurried enough to be lived with, black-and-white enough to be timeless, and honest enough to still move you in twenty years.",
      // نقل‌قول برجسته زیر پاراگراف
      quote:
        "The best photographs are the ones you keep returning to, finding something new in the shadows each time.",
      // تصویر کنار متن چشم‌انداز
      image: { src: 64, alt: "A vision in monochrome" },
    },

    // بخش «چگونه کار می‌کنیم» — سه ارزش کلیدی
    values: {
      title: "How we work",
      items: [
        { title: "Patience", text: "We wait for the frame that tells the truth, however long it takes." },
        { title: "Restraint", text: "What we leave out gives the image its power. Less, always deliberately." },
        { title: "Craft", text: "From lighting to final grade, every step is done by hand, in-house." },
      ],
    },

    // بخش ۰۳ — پشت صحنه
    behindTheScenes: {
      index: "03",
      title: "Behind the Scenes",
      subtitle:
        "Long days, careful light, and the quiet choreography of a set. A glimpse at how the work actually gets made.",
      // تصاویر پشت صحنه (گرید چیدمان خودکار). اولین تصویر عریض‌تر نمایش داده می‌شود.
      images: [
        { src: 1084, alt: "Behind the scenes" },
        { src: 366, alt: "Behind the scenes" },
        { src: 219, alt: "Behind the scenes" },
        { src: 431, alt: "Behind the scenes" },
        { src: 628, alt: "Behind the scenes" },
        { src: 342, alt: "Behind the scenes" },
      ],
    },

    // بخش ۰۴ — معرفی تیم استودیو
    team: {
      index: "04",
      title: "Meet the Studio",
      // اعضای تیم؛ برای هر نفر: نام، سمت و عکس پروفایل (نسبت ابعاد عمودی)
      members: [
        { name: "Elias Moreau", role: "Founder · Director", image: { src: 1005, alt: "Elias Moreau" } },
        { name: "Noor Haddad", role: "Lead Photographer", image: { src: 494, alt: "Noor Haddad" } },
        { name: "Sena Okafor", role: "Creative Producer", image: { src: 338, alt: "Sena Okafor" } },
        { name: "Ravi Kapoor", role: "Post & Color", image: { src: 1012, alt: "Ravi Kapoor" } },
      ],
    },
  },

  /* ---------------------------------------------------------------------------
   * صفحه‌ی تماس (Contact)
   * (مقادیر تماس از بخش contactInfo بالای همین فایل خوانده می‌شوند)
   * ------------------------------------------------------------------------- */
  contact: {
    // سربرگ بالای صفحه‌ی تماس
    header: {
      eyebrow: "Contact us",
      // تیتر؛ خط دوم (emphasis) با رنگ برند و ایتالیک است
      title: { line1: "Let's start a", emphasis: "conversation." },
      subtitle:
        "Commissions, collaborations, or a simple hello — we read every message. Reach the studio through any of the channels below.",
    },
    // برچسب‌های کارت‌های تماس (مقدارشان از contactInfo می‌آید؛ این‌ها فقط عنوان بالای کارت‌اند)
    labels: {
      instagram: "Instagram",
      phone: "Phone",
      address: "Address",
    },
    // بخش «ساعات کاری استودیو»
    hours: {
      label: "Studio hours",
      lines: ["Mon – Fri · 9:00 – 18:00", "Weekends by appointment"],
    },
    // تصویر سینمایی کنار اطلاعات تماس + دو برچسب زیر آن
    visual: {
      image: { src: 1027, alt: "Moonlight Studio" },
      captionLeft: "The studio",
      captionRight: "San Francisco",
    },
    // نوار پایانی «ترجیح می‌دهید بنویسید؟» + دکمه‌ی ایمیل (ایمیل از contactInfo می‌آید)
    cta: {
      title: "Prefer to write?",
    },
  },

  /* ---------------------------------------------------------------------------
   * فوتر سایت (پایین همه‌ی صفحه‌ها)
   * (اطلاعات تماس از بخش contactInfo خوانده می‌شود)
   * ------------------------------------------------------------------------- */
  footer: {
    // برچسب کوچک بالای عنوان فوتر
    eyebrow: "Let's create",
    // عنوان بزرگ فوتر (دو خط)
    headline: { line1: "Every frame", line2: "is a keepsake." },

    // ستون «لینک‌های سریع»
    quickLinks: {
      title: "Quick Links",
      items: [
        { label: "Home", url: "/", openInNewTab: false },
        { label: "Portfolio", url: "/portfolio", openInNewTab: false },
        { label: "About", url: "/about", openInNewTab: false },
        // توجه: این لینک عمداً به‌صورت ایمیل تنظیم شده است (مانند نسخه‌ی فعلی سایت)
        { label: "Contact", url: "mailto:hello@moonlight.studio", openInNewTab: false },
      ],
    },

    // عنوان ستون «استودیو» (مقادیرش اینستاگرام/تلفن/ایمیل از contactInfo می‌آید)
    studioColumn: {
      title: "Studio",
      // متن نمایشی لینک اینستاگرام در فوتر
      instagramLabel: "Instagram ↗",
    },

    // عنوان ستون «آدرس» (خطوط آدرس از contactInfo.address می‌آید)
    visitColumn: {
      title: "Visit",
    },

    // نوار پایینی فوتر
    base: {
      // متن کپی‌رایت؛ سال به‌صورت خودکار جلوی این متن اضافه می‌شود → «© 2026 Moonlight Studio»
      copyrightSuffix: "Moonlight Studio",
      // عبارت میانی (ایتالیک)
      mark: "Crafted under moonlight",
      // عبارت سمت چپ/راست
      tagline: "Photography · Direction · Story",
    },
  },

  /* ---------------------------------------------------------------------------
   * متن‌های رابط کاربری و دسترس‌پذیری (برچسب دکمه‌ها، متن‌های صفحه‌خوان و ...)
   * این‌ها معمولاً روی صفحه دیده نمی‌شوند اما برای دسترس‌پذیری و سئو مهم‌اند.
   * ------------------------------------------------------------------------- */
  ui: {
    // لینک «پرش به محتوا» برای کاربران صفحه‌خوان
    skipToContent: "Skip to content",
    // متن وضعیت هنگام بارگذاری صفحه‌ها
    loading: "Loading",
    // برچسب دکمه‌ی تغییر تم (روشن/تاریک)
    theme: {
      switchToLight: "Switch to light theme",
      switchToDark: "Switch to dark theme",
    },
    // برچسب‌های دسترس‌پذیری نوار ناوبری
    nav: {
      brandAria: "Moonlight Studio — home",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      primaryNavAria: "Primary",
      mobileNavAria: "Mobile",
    },
    // برچسب‌های دسترس‌پذیری اسلایدر
    slider: {
      prev: "Previous slide",
      next: "Next slide",
      goToPrefix: "Go to", // به‌همراه عنوان اسلاید ترکیب می‌شود، مثل: "Go to Nocturne"
      slidesAria: "Slides",
      roleDescription: "carousel", // توضیح نوع بخش برای صفحه‌خوان‌ها
    },
    // برچسب‌های دسترس‌پذیری صفحه‌ی نمونه‌کارها و گالری تمام‌صفحه (Lightbox)
    portfolio: {
      filtersAria: "Filter projects by category",
      openGalleryPrefix: "Open", // مثل: "Open Atelier Noir gallery"
      openGallerySuffix: "gallery",
      // متن کوچکی که هنگام هاور روی هر کارت نمونه‌کار نمایش داده می‌شود
      viewGalleryLabel: "View gallery →",
    },
    lightbox: {
      close: "Close gallery",
      prevImage: "Previous image",
      nextImage: "Next image",
      viewImagePrefix: "View image", // مثل: "View image 1"
    },
  },
}

export default content

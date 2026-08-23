/* =========================================================================
   بيانات تطبيق المنطقة الحرة الزرقاء
   التصنيفات الكاملة + كل دول العالم + بيانات تجريبية + دوال مساعدة
   ========================================================================= */

/* -------------------------------------------------------------------------v
   قائمة دول العالم (كل الدول) — الاسم بالعربية + الإنجليزية + العلم + رمز الاتصال
   ------------------------------------------------------------------------- */
const COUNTRY_CODES = [
  // الدول العربية
  { code:"+962", flag:"🇯🇴", name:"الأردن",          en:"Jordan",          digits:9 },
  { code:"+970", flag:"🇵🇸", name:"فلسطين",         en:"Palestine",       digits:9 },
  { code:"+963", flag:"🇸🇾", name:"سوريا",          en:"Syria",           digits:9 },
  { code:"+961", flag:"🇱🇧", name:"لبنان",          en:"Lebanon",         digits:7 },
  { code:"+964", flag:"🇮🇶", name:"العراق",         en:"Iraq",            digits:10 },
  { code:"+966", flag:"🇸🇦", name:"السعودية",       en:"Saudi Arabia",    digits:9 },
  { code:"+971", flag:"🇦🇪", name:"الإمارات",       en:"UAE",             digits:9 },
  { code:"+965", flag:"🇰🇼", name:"الكويت",         en:"Kuwait",          digits:8 },
  { code:"+974", flag:"🇶🇦", name:"قطر",            en:"Qatar",           digits:8 },
  { code:"+973", flag:"🇧🇭", name:"البحرين",        en:"Bahrain",         digits:8 },
  { code:"+968", flag:"🇴🇲", name:"عُمان",           en:"Oman",            digits:8 },
  { code:"+967", flag:"🇾🇪", name:"اليمن",          en:"Yemen",           digits:9 },
  { code:"+20",  flag:"🇪🇬", name:"مصر",            en:"Egypt",           digits:10 },
  { code:"+249", flag:"🇸🇩", name:"السودان",        en:"Sudan",           digits:9 },
  { code:"+218", flag:"🇱🇾", name:"ليبيا",          en:"Libya",           digits:9 },
  { code:"+216", flag:"🇹🇳", name:"تونس",           en:"Tunisia",         digits:8 },
  { code:"+213", flag:"🇩🇿", name:"الجزائر",        en:"Algeria",         digits:9 },
  { code:"+212", flag:"🇲🇦", name:"المغرب",         en:"Morocco",         digits:9 },
  { code:"+222", flag:"🇲🇷", name:"موريتانيا",      en:"Mauritania",      digits:8 },
  { code:"+252", flag:"🇸🇴", name:"الصومال",        en:"Somalia",         digits:8 },
  { code:"+253", flag:"🇩🇯", name:"جيبوتي",         en:"Djibouti",        digits:8 },
  { code:"+269", flag:"🇰🇲", name:"جزر القمر",      en:"Comoros",         digits:7 },
  // تركيا وإيران والجوار
  { code:"+90",  flag:"🇹🇷", name:"تركيا",          en:"Turkey",          digits:10 },
  { code:"+98",  flag:"🇮🇷", name:"إيران",          en:"Iran",            digits:10 },
  { code:"+972", flag:"🇮🇱", name:"إسرائيل",        en:"Israel",          digits:9 },
  { code:"+357", flag:"🇨🇾", name:"قبرص",           en:"Cyprus",          digits:8 },
  { code:"+93",  flag:"🇦🇫", name:"أفغانستان",      en:"Afghanistan",     digits:9 },
  { code:"+92",  flag:"🇵🇰", name:"باكستان",        en:"Pakistan",        digits:10 },
  // آسيا
  { code:"+86",  flag:"🇨🇳", name:"الصين",          en:"China",           digits:11 },
  { code:"+91",  flag:"🇮🇳", name:"الهند",          en:"India",           digits:10 },
  { code:"+81",  flag:"🇯🇵", name:"اليابان",        en:"Japan",           digits:10 },
  { code:"+82",  flag:"🇰🇷", name:"كوريا الجنوبية", en:"South Korea",     digits:9 },
  { code:"+62",  flag:"🇮🇩", name:"إندونيسيا",      en:"Indonesia",       digits:10 },
  { code:"+60",  flag:"🇲🇾", name:"ماليزيا",        en:"Malaysia",        digits:9 },
  { code:"+65",  flag:"🇸🇬", name:"سنغافورة",       en:"Singapore",       digits:8 },
  { code:"+66",  flag:"🇹🇭", name:"تايلاند",        en:"Thailand",        digits:9 },
  { code:"+84",  flag:"🇻🇳", name:"فيتنام",         en:"Vietnam",         digits:9 },
  { code:"+63",  flag:"🇵🇭", name:"الفلبين",        en:"Philippines",     digits:10 },
  { code:"+880", flag:"🇧🇩", name:"بنغلاديش",       en:"Bangladesh",      digits:10 },
  { code:"+94",  flag:"🇱🇰", name:"سريلانكا",       en:"Sri Lanka",       digits:9 },
  { code:"+977", flag:"🇳🇵", name:"نيبال",          en:"Nepal",           digits:10 },
  { code:"+95",  flag:"🇲🇲", name:"ميانمار",        en:"Myanmar",         digits:9 },
  { code:"+855", flag:"🇰🇭", name:"كمبوديا",        en:"Cambodia",        digits:9 },
  { code:"+856", flag:"🇱🇦", name:"لاوس",           en:"Laos",            digits:9 },
  { code:"+976", flag:"🇲🇳", name:"منغوليا",        en:"Mongolia",        digits:8 },
  { code:"+7",   flag:"🇰🇿", name:"كازاخستان",      en:"Kazakhstan",      digits:10 },
  { code:"+998", flag:"🇺🇿", name:"أوزبكستان",      en:"Uzbekistan",      digits:9 },
  { code:"+993", flag:"🇹🇲", name:"تركمانستان",     en:"Turkmenistan",    digits:8 },
  { code:"+996", flag:"🇰🇬", name:"قيرغيزستان",     en:"Kyrgyzstan",      digits:9 },
  { code:"+992", flag:"🇹🇯", name:"طاجيكستان",      en:"Tajikistan",      digits:9 },
  { code:"+994", flag:"🇦🇿", name:"أذربيجان",       en:"Azerbaijan",      digits:9 },
  { code:"+374", flag:"🇦🇲", name:"أرمينيا",        en:"Armenia",         digits:8 },
  { code:"+995", flag:"🇬🇪", name:"جورجيا",         en:"Georgia",         digits:9 },
  { code:"+886", flag:"🇹🇼", name:"تايوان",         en:"Taiwan",          digits:9 },
  { code:"+852", flag:"🇭🇰", name:"هونغ كونغ",      en:"Hong Kong",       digits:8 },
  // أوروبا
  { code:"+49",  flag:"🇩🇪", name:"ألمانيا",        en:"Germany",         digits:10 },
  { code:"+44",  flag:"🇬🇧", name:"بريطانيا",       en:"United Kingdom",  digits:10 },
  { code:"+33",  flag:"🇫🇷", name:"فرنسا",          en:"France",          digits:9 },
  { code:"+39",  flag:"🇮🇹", name:"إيطاليا",        en:"Italy",           digits:10 },
  { code:"+34",  flag:"🇪🇸", name:"إسبانيا",        en:"Spain",           digits:9 },
  { code:"+351", flag:"🇵🇹", name:"البرتغال",       en:"Portugal",        digits:9 },
  { code:"+31",  flag:"🇳🇱", name:"هولندا",         en:"Netherlands",     digits:9 },
  { code:"+32",  flag:"🇧🇪", name:"بلجيكا",         en:"Belgium",         digits:9 },
  { code:"+41",  flag:"🇨🇭", name:"سويسرا",         en:"Switzerland",     digits:9 },
  { code:"+43",  flag:"🇦🇹", name:"النمسا",         en:"Austria",         digits:10 },
  { code:"+46",  flag:"🇸🇪", name:"السويد",         en:"Sweden",          digits:9 },
  { code:"+47",  flag:"🇳🇴", name:"النرويج",        en:"Norway",          digits:8 },
  { code:"+45",  flag:"🇩🇰", name:"الدانمرك",       en:"Denmark",         digits:8 },
  { code:"+358", flag:"🇫🇮", name:"فنلندا",         en:"Finland",         digits:9 },
  { code:"+354", flag:"🇮🇸", name:"آيسلندا",        en:"Iceland",         digits:7 },
  { code:"+353", flag:"🇮🇪", name:"أيرلندا",        en:"Ireland",         digits:9 },
  { code:"+48",  flag:"🇵🇱", name:"بولندا",         en:"Poland",          digits:9 },
  { code:"+420", flag:"🇨🇿", name:"التشيك",         en:"Czechia",         digits:9 },
  { code:"+421", flag:"🇸🇰", name:"سلوفاكيا",       en:"Slovakia",        digits:9 },
  { code:"+36",  flag:"🇭🇺", name:"المجر",          en:"Hungary",         digits:9 },
  { code:"+40",  flag:"🇷🇴", name:"رومانيا",        en:"Romania",         digits:9 },
  { code:"+359", flag:"🇧🇬", name:"بلغاريا",        en:"Bulgaria",        digits:9 },
  { code:"+30",  flag:"🇬🇷", name:"اليونان",        en:"Greece",          digits:10 },
  { code:"+385", flag:"🇭🇷", name:"كرواتيا",        en:"Croatia",         digits:9 },
  { code:"+381", flag:"🇷🇸", name:"صربيا",          en:"Serbia",          digits:8 },
  { code:"+386", flag:"🇸🇮", name:"سلوفينيا",       en:"Slovenia",        digits:8 },
  { code:"+387", flag:"🇧🇦", name:"البوسنة والهرسك", en:"Bosnia & Herzegovina", digits:8 },
  { code:"+355", flag:"🇦🇱", name:"ألبانيا",        en:"Albania",         digits:9 },
  { code:"+380", flag:"🇺🇦", name:"أوكرانيا",       en:"Ukraine",         digits:9 },
  { code:"+7",   flag:"🇷🇺", name:"روسيا",          en:"Russia",          digits:10 },
  { code:"+375", flag:"🇧🇾", name:"بيلاروس",        en:"Belarus",         digits:9 },
  { code:"+373", flag:"🇲🇩", name:"مولدوفا",        en:"Moldova",         digits:8 },
  { code:"+370", flag:"🇱🇹", name:"ليتوانيا",       en:"Lithuania",       digits:8 },
  { code:"+371", flag:"🇱🇻", name:"لاتفيا",         en:"Latvia",          digits:8 },
  { code:"+372", flag:"🇪🇪", name:"إستونيا",        en:"Estonia",         digits:8 },
  { code:"+356", flag:"🇲🇹", name:"مالطا",          en:"Malta",           digits:8 },
  { code:"+352", flag:"🇱🇺", name:"لوكسمبورغ",      en:"Luxembourg",      digits:8 },
  { code:"+389", flag:"🇲🇰", name:"شمال مقدونيا",   en:"North Macedonia", digits:8 },
  { code:"+382", flag:"🇲🇪", name:"الجبل الأسود",   en:"Montenegro",      digits:8 },
  // الأمريكيتان
  { code:"+1",   flag:"🇺🇸", name:"الولايات المتحدة", en:"United States",  digits:10 },
  { code:"+1",   flag:"🇨🇦", name:"كندا",            en:"Canada",          digits:10 },
  { code:"+52",  flag:"🇲🇽", name:"المكسيك",         en:"Mexico",          digits:10 },
  { code:"+55",  flag:"🇧🇷", name:"البرازيل",        en:"Brazil",          digits:11 },
  { code:"+54",  flag:"🇦🇷", name:"الأرجنتين",       en:"Argentina",       digits:10 },
  { code:"+56",  flag:"🇨🇱", name:"تشيلي",           en:"Chile",           digits:9 },
  { code:"+57",  flag:"🇨🇴", name:"كولومبيا",        en:"Colombia",        digits:10 },
  { code:"+51",  flag:"🇵🇪", name:"بيرو",            en:"Peru",            digits:9 },
  { code:"+58",  flag:"🇻🇪", name:"فنزويلا",         en:"Venezuela",       digits:10 },
  { code:"+593", flag:"🇪🇨", name:"الإكوادور",       en:"Ecuador",         digits:9 },
  { code:"+591", flag:"🇧🇴", name:"بوليفيا",         en:"Bolivia",         digits:8 },
  { code:"+595", flag:"🇵🇾", name:"باراغواي",        en:"Paraguay",        digits:9 },
  { code:"+598", flag:"🇺🇾", name:"الأوروغواي",      en:"Uruguay",         digits:8 },
  { code:"+53",  flag:"🇨🇺", name:"كوبا",            en:"Cuba",            digits:8 },
  { code:"+1",   flag:"🇩🇴", name:"جمهورية الدومينيكان", en:"Dominican Republic", digits:10 },
  { code:"+502", flag:"🇬🇹", name:"غواتيمالا",       en:"Guatemala",       digits:8 },
  { code:"+504", flag:"🇭🇳", name:"هندوراس",         en:"Honduras",        digits:8 },
  { code:"+503", flag:"🇸🇻", name:"السلفادور",       en:"El Salvador",     digits:8 },
  { code:"+505", flag:"🇳🇮", name:"نيكاراغوا",       en:"Nicaragua",       digits:8 },
  { code:"+506", flag:"🇨🇷", name:"كوستاريكا",       en:"Costa Rica",      digits:8 },
  { code:"+507", flag:"🇵🇦", name:"بنما",            en:"Panama",          digits:8 },
  { code:"+509", flag:"🇭🇹", name:"هايتي",           en:"Haiti",           digits:8 },
  { code:"+1",   flag:"🇯🇲", name:"جامايكا",         en:"Jamaica",         digits:10 },
  { code:"+1",   flag:"🇹🇹", name:"ترينيداد وتوباغو", en:"Trinidad & Tobago", digits:10 },
  { code:"+1",   flag:"🇧🇸", name:"الباهاما",        en:"Bahamas",         digits:10 },
  { code:"+1",   flag:"🇧🇧", name:"باربادوس",        en:"Barbados",        digits:10 },
  // أفريقيا
  { code:"+234", flag:"🇳🇬", name:"نيجيريا",         en:"Nigeria",         digits:10 },
  { code:"+251", flag:"🇪🇹", name:"إثيوبيا",         en:"Ethiopia",        digits:9 },
  { code:"+254", flag:"🇰🇪", name:"كينيا",           en:"Kenya",           digits:9 },
  { code:"+233", flag:"🇬🇭", name:"غانا",            en:"Ghana",           digits:9 },
  { code:"+27",  flag:"🇿🇦", name:"جنوب أفريقيا",    en:"South Africa",    digits:9 },
  { code:"+255", flag:"🇹🇿", name:"تنزانيا",         en:"Tanzania",        digits:9 },
  { code:"+256", flag:"🇺🇬", name:"أوغندا",          en:"Uganda",          digits:9 },
  { code:"+237", flag:"🇨🇲", name:"الكاميرون",       en:"Cameroon",        digits:9 },
  { code:"+225", flag:"🇨🇮", name:"ساحل العاج",      en:"Côte d'Ivoire",   digits:10 },
  { code:"+221", flag:"🇸🇳", name:"السنغال",         en:"Senegal",         digits:9 },
  { code:"+263", flag:"🇿🇼", name:"زيمبابوي",        en:"Zimbabwe",        digits:9 },
  { code:"+260", flag:"🇿🇲", name:"زامبيا",          en:"Zambia",          digits:9 },
  { code:"+250", flag:"🇷🇼", name:"رواندا",          en:"Rwanda",          digits:9 },
  { code:"+257", flag:"🇧🇮", name:"بوروندي",         en:"Burundi",         digits:8 },
  { code:"+261", flag:"🇲🇬", name:"مدغشقر",          en:"Madagascar",      digits:9 },
  { code:"+258", flag:"🇲🇿", name:"موزمبيق",         en:"Mozambique",      digits:9 },
  { code:"+244", flag:"🇦🇴", name:"أنغولا",          en:"Angola",          digits:9 },
  { code:"+223", flag:"🇲🇱", name:"مالي",            en:"Mali",            digits:8 },
  { code:"+227", flag:"🇳🇪", name:"النيجر",          en:"Niger",           digits:8 },
  { code:"+235", flag:"🇹🇩", name:"تشاد",            en:"Chad",            digits:8 },
  { code:"+226", flag:"🇧🇫", name:"بوركينا فاسو",    en:"Burkina Faso",    digits:8 },
  { code:"+229", flag:"🇧🇯", name:"بنين",            en:"Benin",           digits:8 },
  { code:"+228", flag:"🇹🇬", name:"توغو",            en:"Togo",            digits:8 },
  { code:"+224", flag:"🇬🇳", name:"غينيا",           en:"Guinea",          digits:9 },
  { code:"+232", flag:"🇸🇱", name:"سيراليون",        en:"Sierra Leone",    digits:8 },
  { code:"+231", flag:"🇱🇷", name:"ليبيريا",         en:"Liberia",         digits:8 },
  { code:"+265", flag:"🇲🇼", name:"مالاوي",          en:"Malawi",          digits:9 },
  { code:"+267", flag:"🇧🇼", name:"بوتسوانا",        en:"Botswana",        digits:8 },
  { code:"+264", flag:"🇳🇦", name:"ناميبيا",         en:"Namibia",         digits:9 },
  { code:"+266", flag:"🇱🇸", name:"ليسوتو",          en:"Lesotho",         digits:8 },
  { code:"+268", flag:"🇸🇿", name:"إسواتيني",        en:"Eswatini",        digits:8 },
  { code:"+230", flag:"🇲🇺", name:"موريشيوس",        en:"Mauritius",       digits:8 },
  { code:"+238", flag:"🇨🇻", name:"الرأس الأخضر",    en:"Cape Verde",      digits:7 },
  { code:"+241", flag:"🇬🇦", name:"الغابون",         en:"Gabon",           digits:8 },
  { code:"+242", flag:"🇨🇬", name:"الكونغو",         en:"Congo",           digits:9 },
  { code:"+243", flag:"🇨🇩", name:"الكونغو الديمقراطية", en:"DR Congo",     digits:9 },
  { code:"+240", flag:"🇬🇶", name:"غينيا الاستوائية", en:"Equatorial Guinea", digits:9 },
  { code:"+291", flag:"🇪🇷", name:"إريتريا",         en:"Eritrea",         digits:7 },
  { code:"+211", flag:"🇸🇸", name:"جنوب السودان",    en:"South Sudan",     digits:9 },
  { code:"+236", flag:"🇨🇫", name:"أفريقيا الوسطى",  en:"Central African Republic", digits:8 },
  { code:"+248", flag:"🇸🇨", name:"سيشل",            en:"Seychelles",      digits:7 },
  { code:"+220", flag:"🇬🇲", name:"غامبيا",          en:"Gambia",          digits:7 },
  // أوقيانوسيا
  { code:"+61",  flag:"🇦🇺", name:"أستراليا",        en:"Australia",       digits:9 },
  { code:"+64",  flag:"🇳🇿", name:"نيوزيلندا",       en:"New Zealand",     digits:9 },
  { code:"+679", flag:"🇫🇯", name:"فيجي",            en:"Fiji",            digits:7 },
  { code:"+675", flag:"🇵🇬", name:"بابوا غينيا الجديدة", en:"Papua New Guinea", digits:8 }
];

/* -------------------------------------------------------------------------
   هيكل التصنيف الهرمي:
   القسم (مركبات/بضائع/خدمات) -> صنف رئيسي -> صنف فرعي -> علامات/أنواع
   ------------------------------------------------------------------------- */
const CATEGORIES = [
  {
    id: "vehicles",
    name: "مركبات",
    icon: "🚗",
    color: "#2563eb",
    subs: [
      {
        id: "cars",
        name: "سيارات",
        icon: "🚙",
        types: ["سيدان", "دفع رباعي SUV", "هاتشباك", "كوبيه", "كابورليه (مكشوفة)", "فان / ميني فان", "بيك أب", "كهربائية (EV)", "هجينة", "سيدان تنفيذية", "أخرى"],
        brands: ["تويوتا", "هيونداي", "كيا", "نيسان", "هوندا", "مازدا", "ميتسوبيشي", "سوزوكي", "سوبارو", "مرسيدس-بنز", "BMW", "أودي", "فولكس فاجن", "شيفروليه", "فورد", "جيب", "دودج", "جي إم سي", "كاديلاك", "لكزس", "إنفينيتي", "أكورا", "بورش", "فولفو", "لاند روفر", "جاكوار", "بيجو", "رينو", "ستروين", "فيات", "سكودا", "سيات", "تيسلا", "بي إي واي دي BYD", "جيلي", "تشيري", "MG", "هافال Haval", "تشانغان Changan", "جيتور Jetour", "GAC", "هونغ تشي Hongqi", "زيكر Zeekr", "شاوبنغ Xpeng", "نيو Nio", "لوسيد Lucid", "رولز رويس", "بنتلي", "لامبورغيني", "فيراري", "مازيراتي", "أستون مارتن", "جينيسيس Genesis", "تاتا", "ماهيندرا", "سانغ يونغ", "داسيا", "لادا", "أخرى"]
      },
      {
        id: "trucks",
        name: "شاحنات",
        icon: "🚚",
        types: ["شاحنة خفيفة", "شاحنة متوسطة", "شاحنة ثقيلة", "شاحنة قلابة", "شاحنة براد (تبريد)", "ناقلة سيارات", "خلاطة خرسانة", "شاحنة سطحة", "شاحنة صهريج", "شاحنة حاويات", "شاحنة سحب وإنقاذ", "أخرى"],
        brands: ["مرسيدس-بنز", "فولفو", "مان MAN", "سكانيا", "رينو", "إيفيكو", "ميتسوبيشي فوسو", "إيسوزو", "هيونداي", "دايو", "كاماز", "تاترا", "ماك MAC", "بيتربيلت", "أخرى"]
      },
      {
        id: "buses",
        name: "حافلات وميكروباصات",
        icon: "🚌",
        types: ["حافلة ركاب كبيرة", "حافلة متوسطة (كوستر)", "ميكروباص", "حافلة سياحية فاخرة", "حافلة مدرسية", "ميني باص", "أخرى"],
        brands: ["مرسيدس-بنز", "تويوتا (كوستر)", "هيونداي", "كيا", "مان MAN", "فولفو", "إيفيكو", "سكانيا", "سترا", "Temsa", "أخرى"]
      },
      {
        id: "heavy",
        name: "آليات ومعدات ثقيلة",
        icon: "🚜",
        types: ["حفارة (إكسكيفتر)", "بلدوزر", "لودر (شيولدر)", "شاحنة قلابة كبيرة", "رافعة شوكية", "رافعة برجية", "حفارة خرسانة", "كمبوسر (دكاكة)", "فينشر (معدات مناجم)", "كرين متحرك", "حفارة مصغرة (ميني)", "جرافة زراعية", "آلة تمهيد (موتر جريدر)", "أخرى"],
        brands: ["كاتربيلر", "كوماتسو", "هيتاشي", "فولفو CE", "ليبور", "جي سي بي JCB", "بوك لين", "دوسان", "ساني", "كوبيلكو", "بوب كات Bobcat", "أخرى"]
      },
      {
        id: "agri",
        name: "مركبات وآليات زراعية",
        icon: "🚜",
        types: ["جرار زراعي", "حصادة", "آلة حرث", "رشاشة زراعية", "بالير (حاطبة)", "مركبة أعمل (UTV)", "أخرى"],
        brands: ["جون دير", "ماساي فيرغسون", "نيوهولاند", "كوبوتا", "فالترا", "CLS", "أخرى"]
      },
      {
        id: "bikes",
        name: "دراجات نارية وهوائية",
        icon: "🏍️",
        types: ["دراجة نارية رياضية", "دراجة نارية كلاسيكية", "سكوتر", "دراجة كهربائية", "دراجة جبلية", "دراجة هوائية", "دراجة ثلاثية العجلات", "دراجة بضائع", "أخرى"],
        brands: ["هوندا", "ياماها", "سوزوكي", "كاواساكي", "بي إم دبليو", "دوكاتي", "هارلي ديفيدسون", "كي تي ام KTM", "أبريليا", "تريمف", "فيسبا", "رويال إنفيلد", "أخرى"]
      },
      {
        id: "boats",
        name: "قوارب ويخوت",
        icon: "🛥️",
        types: ["يخت فاخر", "قارب صيد", "قارب سريع (زورق)", "قارب تجديف/كاياك", "جل باوت (قارب مطاطي)", "سفينة تجارية", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "rvs",
        name: "كرفانات ومركبات إسكان",
        icon: "🚐",
        types: ["كرفان متحرك (Motorhome)", "مقطورة إسكان (Caravan)", "كرفان مخيم", "مقطورة سفر", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "trailers",
        name: "مقطورات وتيلر",
        icon: "🚛",
        types: ["مقطورة صغيرة", "تيلر ثقيل (semi-trailer)", "مقطورة سيارات", "مقطورة صهريج", "مقطورة بضائع مسطحة", "مقطورة قلابة", "أخرى"],
        brands: ["شميتز", "كوغيل", "كراون", "أخرى"]
      },
      {
        id: "spareparts",
        name: "قطع غيار",
        icon: "🔩",
        types: ["محركات وقطع محرك", "إطارات وجنوط", "بطاريات", "نظام تعليق ومساعدات", "مكابح", "علبة سرعة (جير)", "كهرباء ودينمو", "كشتلات وبدي", "شكمان وعادم", "فلاتر وزيوت", "أنظمة تعليق هوائي", "أخرى"],
        brands: ["أصلية (وكيل)", "بوش", "إنجرسول راند", "إم تي إل", "NGK", "Denso", "Mann-Filter", "Continental", "أخرى"]
      },
      {
        id: "accessories",
        name: "اكسسوارات",
        icon: "🎛️",
        types: ["أنظمة صوت وترفيه", "كاميرات ورادار خلفي", "شاشات", "كراسي ومقاعد", "إضاءة وزينون و LED", "تغطية وحماية (واقيات)", "زينة وملصقات", "حوامل ورفوف", "نوافذ وأفلام حرارية", "أغطية وأرضيات", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "vehicles_other",
        name: "أخرى",
        icon: "➕",
        types: ["طائرة", "مروحية", "مركبة قتالية/مدرعة", "غواصة/بحرية", "سكوتر هوائي", "أخرى"],
        brands: ["أخرى"]
      }
    ]
  },
  {
    id: "goods",
    name: "بضائع",
    icon: "📦",
    color: "#0d9488",
    subs: [
      {
        id: "appliances",
        name: "أجهزة كهربائية",
        icon: "🔌",
        types: ["ثلاجات وفريزر", "غسالات ملابس", "غسالات صحون", "بوتاجاز / فرن", "ميكروويف", "مكيفات", "سخانات مياه", "مكانس كهربائية", "خلاطات وعجانات", "أجهزة طبخ", "آلة قهوة", "أخرى"],
        brands: ["إل جي", "سامسونج", "بوش", "هيونداي", "شيبنيكس", "فريش", "توشيبا", "بلاك آند ديكر", "فيليبس", "كنوود", "براون", "أخرى"]
      },
      {
        id: "electronics",
        name: "أجهزة إلكترونية",
        icon: "💻",
        types: ["هواتف ذكية", "حواسيب محمولة", "حواسيب مكتبيّة", "تلفزيونات وشاشات", "كاميرات وتصوير", "سماعات وسماعات لاسلكية", "أجهزة لوحية (تابلت)", "ألعاب وكونسول", "طابعات ومستلزمات", "أجهزة شبكات وراوتر", "ساعات ذكية", "ملحقات وكابلات", "أخرى"],
        brands: ["آبل", "سامسونج", "هواوي", "شاومي", "أوبو", "ريلمي", "ديل", "إتش بي HP", "لينوفو", "أسوس", "إيسر", "سوني", "مايكروسوفت", "جي بي إل JBL", "أخرى"]
      },
      {
        id: "furniture",
        name: "مفروشات وأثاث",
        icon: "🛋️",
        types: ["كنب وصالونات", "طاولات", "أسرّة وغرف نوم", "خزائن ودواليب", "كراسي", "ستائر ومفروشات", "سجاد وموكيت", "مطابخ جاهزة", "أثاث مكتبي", "ديكور وتحف", "إضاءة منزلية", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "clothing",
        name: "ملابس وأزياء",
        icon: "👕",
        types: ["ملابس رجالي", "ملابس نسائي", "ملابس أطفال", "أحذية", "حقائب ومحافظ", "إكسسوارات وساعات", "ملابس رياضية", "أقمشة وخياطة", "ملابس داخلية وبيت", "عبايات و جلابيات", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "food",
        name: "مواد غذائية",
        icon: "🛒",
        types: ["مواد غذائية جافة", "معلبات", "مشروبات وعصائر", "مواد غذائية بالجملة", "منتجات ألبان", "حلويات وسكريات", "زيوت وسمن", "بهارات وتوابل", "حبوب وقطاني", "لحوم ودواجن مبردة", "قهوة وشاي", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "building",
        name: "مواد بناء وأدوات",
        icon: "🧱",
        types: ["سيراميك وبلاط", "أدوات صحية وسيراميك", "دهانات وألوان", "أسلاك ومستلزمات كهربائية", "أدوات يدوية", "سباكة وتركيبات", "حديد وألمنيوم", "أخشاب وألواح", "أدوات حدادة", "إسمنت وبلوك", "عزل ومواد لاصقة", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "cosmetics",
        name: "مستحضرات وعطور",
        icon: "🧴",
        types: ["عطور", "مواد تجميل ومكياج", "منتجات عناية بالبشرة", "منتجات عناية بالشعر", "مستلزمات نسائية", "أدوات تجميل", "عناية بالأطفال", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "jewelry",
        name: "مجوهرات وساعات",
        icon: "💎",
        types: ["مصوغات ذهب", "مجوهرات فضة", "مجوهرات وألماس", "ساعات فاخرة", "ساعات عادية", "إكسسوارات معدنية", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "baby",
        name: "مستلزمات أطفال",
        icon: "🍼",
        types: ["حفاضات", "حليب وغذاء أطفال", "عربات وكراسي أطفال", "ألعاب تعليمية", "ملابس أطفال رضع", "مستلزمات سلامة", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "toys",
        name: "ألعاب وترفيه",
        icon: "🧸",
        types: ["ألعاب أطفال", "ألعاب تعليمية", "ألعاب تحكم وريموت", "ألعاب لوحية", "دراجات أطفال", "بلياردو وطاولة", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "sports",
        name: "رياضة ولياقة",
        icon: "⚽",
        types: ["أجهزة لياقة بدنية", "كرة قدم وكرة طائرة", "دراجات رياضية", "مستلزمات تخييم", "أسلحة صيد ورمي", "ملابس ومعدات رياضية", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "musical",
        name: "آلات موسيقية",
        icon: "🎸",
        types: ["جيتار", "بيانو وكيبورد", "إيقاع ودرامز", "وترية (كمان)", "نفخية", "معدات صوت ومكسر", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "garden",
        name: "حدائق وزراعة",
        icon: "🌱",
        types: ["أدوات حدائق", "بذور وشتلات", "أسمدة ومبيدات", "أنظمة ري", "أحواض ونباتات زينة", "معدات تشذيب", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "solar",
        name: "طاقة ومولدات",
        icon: "☀️",
        types: ["ألواح طاقة شمسية", "بطاريات وإنفرتر", "مولدات كهرباء", "شاحنات وأجهزة شحن", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "medical",
        name: "مستلزمات طبية",
        icon: "🩺",
        types: ["أجهزة قياس", "كراسي متحركة", "أجهزة سمع ونظارات", "مستلزمات إسعاف", "تأهيل وعلاج طبيعي", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "industrial",
        name: "مواد خام وصناعية",
        icon: "⚙️",
        types: ["بلاستيك ومطاط", "معادن خام", "مواد كيميائية", "آلات ومعدات مصنع", "تعبئة وتغليف", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "office",
        name: "قرطاسية ومكتب",
        icon: "📎",
        types: ["قرطاسية ومكتب", "أثاث مكتبي", "إلكترونيات مكتبية", "مستلزمات طباعة", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "pets",
        name: "حيوانات ومستلزماتها",
        icon: "🐾",
        types: ["حيوانات أليفة", "أعلاف وغذاء", "مستلزمات عناية", "أقفاص وبيوت", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "tobacco",
        name: "تبغ ونارجيلة",
        icon: "🚬",
        types: ["سجائر", "نارجيلة ومعسّل", "إلكترونية (vape)", "مستلزمات تدخين", "أخرى"],
        brands: ["أخرى"]
      },
      {
        id: "goods_other",
        name: "أخرى",
        icon: "➕",
        types: ["هدايا وكماليات", "كتب وقرطاسية", "أخرى"],
        brands: ["أخرى"]
      }
    ]
  },
  {
    id: "services",
    name: "خدمات",
    icon: "🤝",
    color: "#9333ea",
    subs: [
      { id: "banks",            name: "بنوك ومؤسسات مالية",      icon: "🏦", types: ["بنوك تجارية", "شركات صرافة", "حوالات مالية", "تمويل وإيجار", "حسابات تجارية", "أخرى"], brands: [] },
      { id: "insurance",        name: "شركات تأمين",             icon: "🛡️", types: ["تأمين سيارات", "تأمين على الحياة", "تأمين ممتلكات", "تأمين تجاري", "تأمين صحي", "تأمين شحن وبضائع", "أخرى"], brands: [] },
      { id: "clearance",        name: "تخليص جمركي",             icon: "📋", types: ["تخليص استيراد", "تخليص تصدير", "خدمات المنطقة الحرة", "مستندات وتصاريح", "حسابات تخزين", "أخرى"], brands: [] },
      { id: "land",             name: "أراضي ومستودعات للبيع",   icon: "🏭", types: ["مستودعات ومخازن", "أراضي تجارية", "محلات ومعارض", "مكاتب إدارية", "كراجات ومحطات", "أخرى"], brands: [] },
      { id: "realty",           name: "عقارات ووساطة",           icon: "🏢", types: ["شقق سكنية", "فلل وبيوت", "محلات تجارية", "إيجار ووساطة", "إدارة أملاك", "أخرى"], brands: [] },
      { id: "inspection",       name: "فحص فني",                 icon: "🔍", types: ["فحص سيارات", "فحص آليات", "تقييم مركبات", "فحص بضائع", "شهادات فحص", "فحص معاينات قبل الشراء", "أخرى"], brands: [] },
      { id: "grocery",          name: "بقالة وسوبرماركت",        icon: "🏪", types: ["بقالة", "سوبرماركت", "بيع بالجملة", "تموينات", "منافذ بيع", "أخرى"], brands: [] },
      { id: "logistics",        name: "شحن ولوجستيات",          icon: "🚢", types: ["شحن بحري", "شحن جوي", "شحن بري", "نقل داخلي", "تخزين وتوزيع", "شحن دولي", "سلاسل توريد", "أخرى"], brands: [] },
      { id: "maintenance",      name: "صيانة وورشات",           icon: "🔧", types: ["ورشة سيارات", "كهرباء سيارات", "سمكرة وبوية", "ميكانيك", "زجاج", "مركز صيانة أجهزة", "صيانة تبريد", "أخرى"], brands: [] },
      { id: "importexport",     name: "استيراد وتصدير",         icon: "🌍", types: ["شركات استيراد", "شركات تصدير", "وكلاء تجاريون", "تمثيل تجاري", "توزيع وجملة", "أخرى"], brands: [] },
      { id: "restaurants",      name: "مطاعم ومقاهي",           icon: "🍽️", types: ["مطعم", "مقهى", "كاترينغ وضيافة", "وجبات سريعة", "مخبز وحلويات", "أخرى"], brands: [] },
      { id: "hotels",           name: "فنادق وإقامة",           icon: "🏨", types: ["فندق", "شقق مفروشة", "قاعات مناسبات", "نُزل وشاليهات", "أخرى"], brands: [] },
      { id: "education",        name: "تعليم وتدريب",           icon: "🎓", types: ["دورات تدريبية", "مركز تعليم لغات", "تدريب مهني", "دروس خصوصية", "تدريب قيادة", "أخرى"], brands: [] },
      { id: "health",           name: "خدمات طبية",             icon: "🏥", types: ["عيادات", "مختبرات وأشعة", "طب أسنان", "علاج طبيعي", "خدمات تمريض", "أخرى"], brands: [] },
      { id: "legal",            name: "خدمات قانونية",          icon: "⚖️", types: ["استشارات قانونية", "محاماة وقضايا", "تحكيم وتسوية", "توثيق وعقود", "أخرى"], brands: [] },
      { id: "it",               name: "تقنية وبرمجة",           icon: "💻", types: ["تصميم وبرمجة مواقع", "تطبيقات جوال", "دعم تقني وصيانة حاسب", "شبكات وأنظمة", "تسويق رقمي", "أخرى"], brands: [] },
      { id: "cleaning",         name: "تنظيف ومكافحة حشرات",    icon: "🧹", types: ["تنظيف منازل ومكاتب", "تنظيف سجاد وكنب", "مكافحة حشرات", "تنظيف خزانات", "أخرى"], brands: [] },
      { id: "events",           name: "تنظيم مناسبات",          icon: "🎉", types: ["تنظيم أفراح", "قاعات مؤتمرات", "ديكور وتنسيق", "فرق فنية ودي جي", "أخرى"], brands: [] },
      { id: "transport",        name: "نقل وليموزين",           icon: "🚕", types: ["تاكسي وليموزين", "نقل موظفين", "توصيل وطرود", "نقل مدرسي", "أخرى"], brands: [] },
      { id: "security",         name: "حراسة وأمن",             icon: "🔐", types: ["شركات حراسة", "أنظمة مراقبة وكاميرات", "إنذار وأمان", "أخرى"], brands: [] },
      { id: "tourism",          name: "سياحة وسفر",             icon: "✈️", types: ["وكالات سفر", "حجوزات طيران", "جولات سياحية", "تأشيرات", "أخرى"], brands: [] },
      { id: "recruitment",      name: "توظيف وموارد بشرية",     icon: "👔", types: ["توظيف وإعلان وظائف", "استقدام عمالة", "مقابلات وتوظيف", "استشارات موارد بشرية", "أخرى"], brands: [] },
      { id: "beauty",           name: "صالونات وتجميل",         icon: "💇", types: ["صالونات رجالي", "صالونات نسائية", "تجميل وعناية", "سبا ومساج", "أخرى"], brands: [] },
      { id: "contracting",      name: "مقاولات وبناء",          icon: "🏗️", types: ["مقاولات عامة", "مقاولات كهرباء", "مقاولات سباكة", "ديكور ودهانات", "صيانة مباني", "أخرى"], brands: [] },
      { id: "printing",         name: "طباعة ودعاية",           icon: "🖨️", types: ["طباعة ومستنسخات", "لافتات وإعلانات", "هدايا دعائية", "تصميم جرافيك", "أخرى"], brands: [] },
      { id: "fuel",             name: "محطات وقود وغاز",        icon: "⛽", types: ["محطة وقود", "بيع غاز", "زيوت ومواد تشحيم", "أخرى"], brands: [] },
      { id: "consultancy",      name: "استشارات إدارية ومالية", icon: "📊", types: ["استشارات إدارية", "استشارات مالية ومحاسبة", "دراسات جدوى", "تدقيق وضرائب", "أخرى"], brands: [] },
      { id: "services_other",   name: "خدمات أخرى",             icon: "➕", types: ["خدمات ترجمة", "خدمات تأمينية", "أخرى"], brands: [] }
    ]
  }
];

/* -------------------------------------------------------------------------
   دوال مساعدة للتعامل مع التصنيفات
   ------------------------------------------------------------------------- */
function findSection(id) { return CATEGORIES.find(s => s.id === id); }
function findSub(sectionId, subId) {
  const s = findSection(sectionId);
  return s ? s.subs.find(x => x.id === subId) : null;
}
function getSectionName(id) { const s = findSection(id); return s ? s.name : ""; }
function getSubName(sectionId, subId) { const s = findSub(sectionId, subId); return s ? s.name : ""; }
function getSubPath(sectionId, subId) {
  const s = findSection(sectionId), sub = findSub(sectionId, subId);
  return s && sub ? `${s.icon} ${s.name} › ${sub.icon} ${sub.name}` : "";
}

/* -------------------------------------------------------------------------v
   بيانات إعلانات تجريبية (الدولة تُخزَّن بالاسم العربي ويُعرض العلم تلقائياً)
   ------------------------------------------------------------------------- */
const SEED_USERS = [
  { id: "u1", name: "أبو محمد التجاري",      phone: "+962790000001", country: "الأردن",   joined: "2024-03-12", verified: true,  stars: 5, deals: 128, bio: "معرض سيارات ومركبات في المنطقة الحرة منذ 12 عاماً" },
  { id: "u2", name: "شركة الأمانة للاستيراد", phone: "+964770000002", country: "العراق",   joined: "2023-11-05", verified: true,  stars: 4, deals: 76,  bio: "استيراد قطع غيار وآليات" },
  { id: "u3", name: "مكتب النور للتخليص",     phone: "+963940000003", country: "سوريا",    joined: "2025-01-20", verified: true,  stars: 4, deals: 54,  bio: "تخليص جمركي ومعاملات المنطقة الحرة" },
  { id: "u4", name: "بازار الشرق",           phone: "+90530000004",  country: "تركيا",    joined: "2025-06-01", verified: false, stars: 3, deals: 9,   bio: "بضائع كهربائية وإلكترونية" },
  { id: "u5", name: "الخليج للآليات",        phone: "+97150000005",  country: "الإمارات", joined: "2025-04-18", verified: true,  stars: 4, deals: 41,  bio: "آليات ثقيلة ومعدات" }
];

const SEED_LISTINGS = [
  { id: "l1", deal: "sell", section: "vehicles", sub: "cars",        type: "دفع رباعي SUV", brand: "هيونداي", model: "سانتافي 2023", title: "هيونداي سانتافي 2023 فل أوبشن", price: 28500, currency: "USD", location: "معرض الأزرق", images: 1, img: "images/seed-car.jpg", user: "u1", date: "2026-08-18", featured: true,  desc: "سيارة جديدة كلياً فل أوبشن، بانوراما، جلد، ضمان الوكيل. متوفرة في المنطقة الحرة." },
  { id: "l2", deal: "sell", section: "vehicles", sub: "heavy",       type: "حفارة (إكسكيفتر)", brand: "كوماتسو", model: "PC200", title: "حفارة كوماتسو PC200 حالة ممتازة", price: 65000, currency: "USD", location: "ساحة الآليات", images: 1, img: "images/warehouse1.jpg", user: "u2", date: "2026-08-15", featured: false, desc: "حفارة كوماتسو PC200 سنة 2021، ساعات عمل منخفضة، صيانة دورية كاملة." },
  { id: "l3", deal: "sell", section: "vehicles", sub: "trucks",      type: "شاحنة براد (تبريد)", brand: "مرسيدس-بنز", model: "Actros", title: "شاحنة براد مرسيدس اكتروس 2020", price: 42000, currency: "USD", location: "المستودعات", images: 1, img: "images/truck1.jpg", user: "u1", date: "2026-08-10", featured: false, desc: "شاحنة تبريد بحالة ممتازة، جاهزة للعمل فوراً." },
  { id: "l4", deal: "sell", section: "goods",    sub: "appliances",  type: "مكيفات", brand: "إل جي", model: "", title: "مكيفات إل جي انفرتر سبليت", price: 320, currency: "USD", location: "محل 24", images: 1, img: "images/seed-ac.jpg", user: "u4", date: "2026-08-19", featured: true,  desc: "مكيفات سبليت 24000 وحدة، ضمان سنتين، كميات متوفرة بأسعار الجملة." },
  { id: "l5", deal: "buy",  section: "goods",    sub: "electronics", type: "هواتف ذكية", brand: "آبل", model: "", title: "أبحث عن آيفون 15 برو ماكس بالجملة", price: 0, currency: "USD", location: "—", images: 1, img: "images/seed-phone.jpg", user: "u2", date: "2026-08-17", featured: false, desc: "مشترٍ جاد يبحث عن كمية 50 قطعة آيفون 15 برو ماكس، يرجى التواصل بالأسعار." },
  { id: "l6", deal: "sell", section: "services", sub: "clearance",   type: "خدمات المنطقة الحرة", brand: "", model: "", title: "خدمات تخليص جمركي بالمنطقة الحرة", price: 0, currency: "USD", location: "مكتب 7", images: 1, img: "images/warehouse2.jpg", user: "u3", date: "2026-08-12", featured: true,  desc: "جميع معاملات التخليص الجمركي داخل المنطقة الحرة، سرعة في الإنجاز وأسعار منافسة." },
  { id: "l7", deal: "sell", section: "services", sub: "land",        type: "مستودعات ومخازن", brand: "", model: "", title: "مستودع 400م للإيجار داخل المنطقة الحرة", price: 800, currency: "USD", location: "المنطقة الغربية", images: 1, img: "images/warehouse3.jpg", user: "u3", date: "2026-08-08", featured: false, desc: "مستودع بمساحة 400 متر مربع، ارتفاع 7م، كهرباء وماء، موقع مميز." },
  { id: "l8", deal: "sell", section: "vehicles", sub: "bikes",       type: "دراجة نارية رياضية", brand: "ياماها", model: "YZF-R1", title: "ياماها R1 2022 حالة الوكيل", price: 13500, currency: "USD", location: "معرض الأزرق", images: 1, img: "images/seed-bike.jpg", user: "u1", date: "2026-08-14", featured: false, desc: "دراجة ياماها R1، استخدام نادر، إطارات جديدة." }
];

// الصور عبر خدمة صور وهمية ملوّنة حسب القسم (data URI متجهات بسيطة)
function placeholderImg(seed, label, color) {
  const c = color || "#2563eb";
  return `data:image/svg+xml;utf8,` + encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${c}'/><stop offset='1' stop-color='#0b1f44'/>
      </linearGradient></defs>
      <rect width='400' height='260' fill='url(#g)'/>
      <text x='50%' y='46%' font-size='70' text-anchor='middle'>${label || "🚗"}</text>
      <text x='50%' y='74%' font-family='sans-serif' font-size='20' fill='#fff' text-anchor='middle' opacity='0.85'>المنطقة الحرة الزرقاء</text>
    </svg>`
  );
}

// تصدير البيانات عند التشغيل على Node (للخادم)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CATEGORIES, COUNTRY_CODES, SEED_USERS, SEED_LISTINGS };
}

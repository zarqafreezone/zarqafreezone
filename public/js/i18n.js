/* =========================================================================
   نظام اللغتين (i18n) — عربي / إنجليزي
   ========================================================================= */
const I18N_KEY = "fz_blue_lang";
let LANG = localStorage.getItem(I18N_KEY) || "ar";

function setLang(l){
  LANG = l;
  localStorage.setItem(I18N_KEY, l);
  document.documentElement.lang = l;
  document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  if (window.render) render();
  if (window.renderTopbarLang) renderTopbarLang();
}

/* نصوص الواجهة */
const STR = {
  brand_zarqa:      { ar:"الزرقاء", en:"Zarqa" },
  brand_full:       { ar:"المنطقة الحرة الزرقاء", en:"Zarqa Free Zone" },
  tagline:          { ar:"بوابة التجارة الحرة", en:"The Gateway to Free Trade" },
  search_ph:        { ar:"ابحث عن سيارة، بضاعة، خدمة...", en:"Search cars, goods, services..." },
  login:            { ar:"تسجيل الدخول", en:"Login" },
  nav_home:         { ar:"الرئيسية", en:"Home" },
  nav_cats:         { ar:"التصنيفات", en:"Categories" },
  nav_fav:          { ar:"المفضلة", en:"Favorites" },
  nav_account:      { ar:"حسابي", en:"Account" },
  nav_admin:        { ar:"الإدارة", en:"Admin" },

  hero_free_badge:  { ar:`⏱️ عرض مجاني لمدة 3 أشهر لكل إعلان جديد`, en:`⏱️ 3 months FREE listing for every new ad` },
  hero_title:       { ar:"المنطقة الحرة الزرقاء — بوابة التجارة الحرة", en:"Zarqa Free Zone — Gateway to Free Trade" },
  hero_desc:        { ar:"اعرض مركباتك وبضائعك وخدماتك بلا جمارك، وصل مع آلاف المشترين والبائعين حول العالم.", en:"List your vehicles, goods and services duty-free. Connect with thousands of buyers and sellers worldwide." },
  all_sections:     { ar:"كل الأقسام", en:"All sections" },
  deal_any:         { ar:"بيع وشراء", en:"Buy & Sell" },
  deal_sell:        { ar:"🟢 للبيع", en:"🟢 For Sale" },
  deal_buy:         { ar:"🔵 للشراء", en:"🔵 Wanted" },
  search_btn:       { ar:"🔍 بحث", en:"🔍 Search" },
  stat_listings:    { ar:"إعلان نشط", en:"Active listings" },
  stat_sections:    { ar:"أقسام رئيسية", en:"Main sections" },
  stat_subs:        { ar:"تصنيف فرعي", en:"Subcategories" },
  stat_countries:   { ar:"دولة", en:"Countries" },
  main_sections:    { ar:"🗂️ الأقسام الرئيسية", en:"🗂️ Main Sections" },
  ads_label:        { ar:"إعلان", en:"listings" },
  sub_count:        { ar:"تصنيف فرعي", en:"subcategories" },
  featured:         { ar:"⭐ إعلانات مميّزة", en:"⭐ Featured Listings" },
  latest:           { ar:"🆕 أحدث الإعلانات", en:"🆕 Latest Listings" },
  view_all:         { ar:"عرض الكل ←", en:"View all →" },
  rating_title:     { ar:"⭐ نظام النجوم للموثوقية", en:"⭐ Trust Star Rating" },
  rt_5: { ar:"تاجر موثوق ومجرّب — صفقات كثيرة", en:"Trusted & proven — many deals" },
  rt_4: { ar:"موثوق عالي — تجربة إيجابية", en:"Highly trusted — positive experience" },
  rt_3: { ar:"جيد — قيد بناء السمعة", en:"Good — building reputation" },
  rt_2: { ar:"جديد / يحتاج تقييم", en:"New / needs rating" },
  rt_1: { ar:"تحذير — توخَّ الحذر", en:"Caution — be careful" },

  breadcrumb_home:  { ar:"الرئيسية", en:"Home" },
  all_categories:   { ar:"🗂️ كل التصنيفات", en:"🗂️ All Categories" },
  choose_type:      { ar:"اختر النوع/الصنف للوصول إلى الإعلانات الدقيقة:", en:"Pick a type to find precise listings:" },
  related_types:    { ar:"الأنواع ذات الصلة", en:"Related types" },
  latest_in:        { ar:"أحدث الإعلانات في", en:"Latest listings in" },
  no_ads_yet:       { ar:"لا توجد إعلانات بعد في هذا التصنيف", en:"No listings in this category yet" },
  be_first:         { ar:"＋ كن أول من يضيف إعلاناً", en:"＋ Be the first to post" },

  tab_all:          { ar:"الكل", en:"All" },
  results_count:    { ar:"نتيجة", en:"results" },
  no_results:       { ar:"لا توجد نتائج مطابقة", en:"No matching results" },
  add_your_ad:      { ar:"＋ أضف إعلانك", en:"＋ Add your listing" },
  search_text:      { ar:"بحث نصّي...", en:"Text search..." },
  sort_latest:      { ar:"الأحدث", en:"Latest" },
  sort_price_up:    { ar:"السعر ↑", en:"Price ↑" },
  sort_price_down:  { ar:"السعر ↓", en:"Price ↓" },
  back:             { ar:"← رجوع", en:"← Back" },
  for_sale:         { ar:"للبيع", en:"For Sale" },
  wanted:           { ar:"للشراء", en:"Wanted" },
  free_tag:         { ar:"مجاني", en:"FREE" },
  paid_tag:         { ar:"مدفوع", en:"PAID" },
  day:              { ar:"ي", en:"d" },
  at_call:          { ar:"السعر عند الاتصال", en:"Price on call" },
  buyer_label:      { ar:"مشترٍ", en:"Buyer" },
  days_left:        { ar:"متبقٍ", en:"left" },
  day_word:         { ar:"يوم", en:"days" },
  description:      { ar:"📝 الوصف", en:"📝 Description" },
  no_desc:          { ar:"لا يوجد وصف", en:"No description" },
  publisher:        { ar:"👤 معلومات الناشر", en:"👤 Publisher info" },
  deals_count:      { ar:"صفقة", en:"deals" },
  verified:         { ar:"✔ موثّق", en:"✔ Verified" },
  contact:          { ar:"عرض رقم الجوال", en:"Show phone number" },
  contact_login:    { ar:"سجّل للتواصل", en:"Login to contact" },

  add_title:        { ar:"＋ أضف إعلاناً جديداً", en:"＋ Add a New Listing" },
  add_note:         { ar:"سيظهر إعلانك مجاناً لمدة 3 أشهر، ثم ينتقل للباقة المدفوعة.", en:"Your ad shows FREE for 3 months, then moves to a paid plan." },
  add_banner_note:  { ar:"ℹ️ كل مستخدم جديد يحصل على فترة عرض مجانية. بعد انتهائها يمكن تمديد الإعلان عبر الباقات المدفوعة.", en:"ℹ️ Every new user gets a free listing period. After it ends, extend via paid plans." },
  deal_type:        { ar:"نوع الإعلان", en:"Listing type" },
  f_section:        { ar:"القسم", en:"Section" },
  f_choose_section: { ar:"اختر القسم", en:"Choose section" },
  f_sub:            { ar:"التصنيف الفرعي", en:"Subcategory" },
  f_choose_sub:     { ar:"اختر التصنيف", en:"Choose subcategory" },
  f_pick:           { ar:"— اختر —", en:"— Select —" },
  f_section_first:  { ar:"اختر القسم أولاً", en:"Pick a section first" },
  f_type:           { ar:"النوع/الصنف", en:"Type" },
  f_brand:          { ar:"العلامة / الماركة", en:"Brand" },
  not_avail:        { ar:"غير متاح", en:"Not available" },
  f_title:          { ar:"عنوان الإعلان", en:"Listing title" },
  f_title_ph:       { ar:"مثال: هيونداي سانتافي 2023 فل أوبشن", en:"e.g. Hyundai Santa Fe 2023 full option" },
  f_budget:         { ar:"الميزانية التقريبية (USD)", en:"Approx. budget (USD)" },
  f_price:          { ar:"السعر (USD)", en:"Price (USD)" },
  f_location:       { ar:"الموقع داخل المنطقة الحرة", en:"Location in the Free Zone" },
  f_location_ph:    { ar:"مثال: معرض 12", en:"e.g. Showroom 12" },
  f_model:          { ar:"الموديل / تفاصيل إضافية", en:"Model / extra details" },
  f_model_ph:       { ar:"مثال: موديل 2023، فل أوبشن", en:"e.g. 2023 model, full option" },
  f_desc:           { ar:"الوصف التفصيلي", en:"Detailed description" },
  f_desc_ph:        { ar:"اكتب وصفاً تفصيلياً لبضاعتك أو خدمتك...", en:"Write a detailed description of your goods or service..." },
  f_image:          { ar:"صورة المنتج (اختياري)", en:"Product image (optional)" },
  publish_free:     { ar:"🚀 نشر الإعلان (مجاني)", en:"🚀 Publish (Free)" },
  req:              { ar:"*", en:"*" },

  zone_label:       { ar:"📍 موقع العرض", en:"📍 Offer location" },
  zone_pick:        { ar:"هل العرض داخل المنطقة الحرة أم خارجها؟", en:"Is the offer inside or outside the Free Zone?" },
  zone_inside:      { ar:"داخل المنطقة الحرة", en:"Inside Free Zone" },
  zone_outside:     { ar:"خارج المنطقة الحرة", en:"Outside Free Zone" },
  zone_badge_in:    { ar:"داخل", en:"Inside" },
  zone_badge_out:   { ar:"خارج", en:"Outside" },
  offer_address:    { ar:"عنوان العرض", en:"Offer address" },
  offer_address_ph: { ar:"حدد مكان العرض: المدينة، المنطقة، أو المعبر الحدودي...", en:"Specify: city, area, or border crossing..." },

  acc_login_title:  { ar:"سجّل الدخول لمتابعة حسابك", en:"Login to access your account" },
  acc_login_desc:   { ar:"ادخل برقم الجوال من أي دولة", en:"Sign in with your phone from any country" },
  my_listings:      { ar:"📋 إعلاناتي", en:"📋 My listings" },
  add_listing:      { ar:"＋ إضافة إعلان", en:"＋ Add listing" },
  my_ads:           { ar:"إعلاناتي", en:"My listings" },
  my_free:          { ar:"إعلانات مجانية", en:"Free listings" },
  my_rating:        { ar:"تقييم النجوم", en:"Star rating" },
  my_deals:         { ar:"صفقة منجزة", en:"deals done" },
  no_listings:      { ar:"لم تنشر أي إعلان بعد", en:"You haven't posted any listing yet" },
  add_first:        { ar:"＋ أضف إعلانك الأول", en:"＋ Add your first listing" },
  rating_me:        { ar:"⭐ تقييمي للموثوقية", en:"⭐ My trust rating" },
  exp_label:        { ar:"التجربة", en:"Experience" },
  trust_label:      { ar:"الموثوقية", en:"Trust" },
  wthq_label:       { ar:"الوثوقية", en:"Verified" },
  wthq_done:        { ar:"حساب موثّق ✔", en:"Verified account ✔" },
  wthq_wait:        { ar:"بانتظار التوثيق", en:"Awaiting verification" },
  plans_title:      { ar:"💎 الباقات المدفوعة", en:"💎 Paid Plans" },
  plans_desc:       { ar:"عند انتهاء فترة العرض المجانية (3 أشهر)، انتقل لإحدى الباقات لإبقاء إعلانك ظاهراً ومميّزاً:", en:"After the free period (3 months) ends, switch to a plan to keep your ad visible & featured:" },
  plan_basic:       { ar:"أساسية", en:"Basic" },
  plan_featured:    { ar:"مميّزة ⭐", en:"Featured ⭐" },
  plan_pro:         { ar:"احترافية 👑", en:"Pro 👑" },
  plan_basic_d:     { ar:"تمديد 30 يوماً", en:"Extend 30 days" },
  plan_feat_d:      { ar:"ظهور في المقدمة + 60 يوم", en:"Top placement + 60 days" },
  plan_pro_d:       { ar:"إعلان مميّز دائم + توثيق", en:"Permanent featured + verification" },
  logout:           { ar:"خروج", en:"Logout" },
  browse_ads:       { ar:"تصفّح الإعلانات", en:"Browse listings" },

  auth_welcome:     { ar:"مرحباً بك 👋", en:"Welcome 👋" },
  auth_desc:        { ar:"سجّل دخولك برقم الجوال من أي دولة في العالم", en:"Sign in with your phone number from anywhere in the world" },
  f_name:           { ar:"الاسم", en:"Name" },
  f_name_ph:        { ar:"اسمك أو اسم شركتك", en:"Your name or company" },
  f_phone:          { ar:"رقم الجوال", en:"Phone number" },
  f_phone_ph:       { ar:"7XXXXXXXX", en:"7XXXXXXXX" },
  send_otp:         { ar:"إرسال رمز التحقق", en:"Send verification code" },
  tos:              { ar:"بإنشائك حساباً فإنك توافق على شروط استخدام المنصة", en:"By creating an account you agree to the platform's terms" },
  enter_otp:        { ar:"أدخل رمز التحقق", en:"Enter verification code" },
  otp_sent:         { ar:"أرسلنا رمزاً من 4 أرقام إلى", en:"We sent a 4-digit code to" },
  otp_hint:         { ar:"للتجربة استخدم الرمز: 1234", en:"For demo use code: 1234" },
  confirm:          { ar:"تأكيد ودخول", en:"Confirm & Login" },
  change_num:       { ar:"تغيير الرقم", en:"Change number" },

  fav_title:        { ar:"❤️ المفضلة", en:"❤️ Favorites" },
  no_fav:           { ar:"لا توجد إعلانات في المفضلة بعد", en:"No favorites yet" },

  gallery_title:    { ar:"📸 من المنطقة الحرة الزرقاء", en:"📸 From the Zarqa Free Zone" },
  gallery_desc:     { ar:"منطقة بلا جمارك تربط الأردن بالعالم", en:"A duty-free zone connecting Jordan to the world" },

  free_period:      { ar:"3 أشهر", en:"3 months" },

  /* الإدارة */
  admin_title:      { ar:"🛠️ لوحة تحكم المدير", en:"🛠️ Admin Dashboard" },
  admin_login_t:    { ar:"دخول المدير", en:"Admin Login" },
  admin_pass:       { ar:"كلمة مرور المدير", en:"Admin password" },
  admin_pass_ph:    { ar:"••••••••", en:"••••••••" },
  admin_enter:      { ar:"دخول", en:"Enter" },
  admin_hint:       { ar:"للتجربة: admin123", en:"Demo: admin123" },
  admin_stats_listings: { ar:"إعلان", en:"Listings" },
  admin_stats_users:    { ar:"مستخدم", en:"Users" },
  admin_stats_featured: { ar:"مميّز", en:"Featured" },
  admin_stats_revenue:  { ar:"الإيرادات", en:"Revenue" },
  admin_tab_listings:   { ar:"الإعلانات", en:"Listings" },
  admin_tab_users:      { ar:"المستخدمون", en:"Users" },
  admin_tab_banners:    { ar:"الإعلانات المدفوعة", en:"Paid Banners" },
  admin_user_col:       { ar:"المستخدم", en:"User" },
  admin_stars:          { ar:"النجوم", en:"Stars" },
  admin_verified:       { ar:"موثّق", en:"Verified" },
  admin_set_stars:      { ar:"تعيين النجوم", en:"Set stars" },
  admin_action:         { ar:"إجراء", en:"Action" },
  admin_feature:        { ar:"تمييز", en:"Feature" },
  admin_unfeature:      { ar:"إلغاء التمييز", en:"Unfeature" },
  admin_delete:         { ar:"حذف", en:"Delete" },
  admin_banner_long:    { ar:"بنر طويل (أفقي)", en:"Long banner (horizontal)" },
  admin_banner_square:  { ar:"بنر مربع صغير", en:"Small square banner" },
  admin_text:           { ar:"النص", en:"Text" },
  admin_link:           { ar:"الرابط", en:"Link" },
  admin_active:         { ar:"مفعّل", en:"Active" },
  admin_inactive:       { ar:"متوقف", en:"Inactive" },
  admin_save:           { ar:"حفظ", en:"Save" },

  /* الدفع */
  checkout_title:      { ar:"💳 إتمام الدفع", en:"💳 Checkout" },
  checkout_plan:       { ar:"الباقة", en:"Plan" },
  checkout_amount:     { ar:"المبلغ", en:"Amount" },
  card_number:         { ar:"رقم البطاقة", en:"Card number" },
  card_expiry:         { ar:"الانتهاء", en:"Expiry" },
  card_cvc:            { ar:"CVC", en:"CVC" },
  pay_now:             { ar:"ادفع الآن", en:"Pay now" },
  processing:          { ar:"جارٍ المعالجة...", en:"Processing..." },
  pay_success:         { ar:"تم الدفع بنجاح ✓ شكراً لك!", en:"Payment successful ✓ Thank you!" },
  pay_demo_note:       { ar:"وضع تجريبي — استخدم أي أرقام، أو 4242 4242 4242 4242", en:"Demo mode — use any numbers, or 4242 4242 4242 4242" },
  pay_real_note:       { ar:"بوابة دفع آمنة عبر Stripe", en:"Secure payment via Stripe" },

  added_fav:  { ar:"أُضيف للمفضلة ❤️", en:"Added to favorites ❤️" },
  removed_fav:{ ar:"أُزيل من المفضلة", en:"Removed from favorites" },
  free_remaining: { ar:"مجاني • متبقٍ", en:"FREE •" },
  paid_ad:    { ar:"إعلان مدفوع", en:"PAID AD" },
  ad_space:   { ar:"مساحة إعلانية متاحة", en:"Ad space available" },
  powered_by: { ar:"© جميع الحقوق محفوظة: شبكة نشوان للتسويق", en:"© All rights reserved: Nashwan Marketing Network" },

  /* المحادثات */
  chat:             { ar:"💬 المحادثات", en:"💬 Chats" },
  chat_with:        { ar:"محادثة مع", en:"Chat with" },
  inbox:            { ar:"صندوق الوارد", en:"Inbox" },
  no_chats:         { ar:"لا توجد محادثات بعد — تواصل مع بائع من أي إعلان للبدء", en:"No chats yet — contact a seller from any listing to start" },
  type_msg:         { ar:"اكتب رسالتك...", en:"Type a message..." },
  send:             { ar:"إرسال", en:"Send" },
  chat_now:         { ar:"💬 محادثة", en:"💬 Chat" },
  call_seller:      { ar:"📞 اتصال", en:"📞 Call" },
  online:           { ar:"متصل", en:"online" },
  start_chat_login: { ar:"سجّل الدخول لبدء المحادثة", en:"Login to start chatting" },
};

/* قاموس ترجمة بيانات التصنيفات (عربي → إنجليزي) */
const DICT = {
  "مركبات":"Vehicles","بضائع":"Goods","خدمات":"Services",
  "سيارات":"Cars","شاحنات":"Trucks","آليات ومعدات ثقيلة":"Heavy Machinery","دراجات":"Motorcycles","قطع غيار":"Spare Parts","اكسسوارات":"Accessories","أخرى":"Other",
  "أجهزة كهربائية":"Electrical Appliances","أجهزة إلكترونية":"Electronics","مفروشات وأثاث":"Furniture","ملابس وأزياء":"Clothing & Fashion","مواد غذائية":"Food Products","مواد بناء وأدوات":"Building Materials & Tools","مستحضرات وعطور":"Cosmetics & Perfumes",
  "بنوك ومؤسسات مالية":"Banks & Financial","شركات تأمين":"Insurance Companies","تخليص جمركي":"Customs Clearance","أراضي ومستودعات للبيع":"Land & Warehouses","فحص فني":"Technical Inspection","بقالة وسوبرماركت":"Grocery & Supermarkets","شحن ولوجستيات":"Shipping & Logistics","صيانة وورشات":"Maintenance & Workshops","استيراد وتصدير":"Import & Export","مطاعم ومقاهي":"Restaurants & Cafes","فنادق وإقامة":"Hotels & Accommodation","خدمات أخرى":"Other Services",
  // أنواع السيارات
  "سيدان":"Sedan","دفع رباعي SUV":"4WD / SUV","هاتشباك":"Hatchback","كوبيه":"Coupe","كابورليه (مكشوفة)":"Convertible","فان / ميني فان":"Van / Minivan","بيك أب":"Pickup","كهربائية":"Electric","هجينة":"Hybrid",
  // الشاحنات
  "شاحنة خفيفة":"Light Truck","شاحنة متوسطة":"Medium Truck","شاحنة ثقيلة":"Heavy Truck","شاحنة قلابة":"Dump Truck","شاحنة براد (تبريد)":"Refrigerated Truck","ناقلة سيارات":"Car Carrier","خلاطة خرسانة":"Concrete Mixer","شاحنة سطحة":"Flatbed Truck","شاحنة صهريج":"Tanker Truck",
  // الآليات
  "حفارة (إكسكيفتر)":"Excavator","بلدوزر":"Bulldozer","لودر (شيولدر)":"Wheel Loader","شاحنة قلابة كبيرة":"Large Dump Truck","رافعة شوكية":"Forklift","رافعة برجية":"Tower Crane","حفارة خرسانة":"Concrete Breaker","كمبوسر (دكاكة)":"Compactor","فينشر (معدات مناجم)":"Mining Equipment","كرين متحرك":"Mobile Crane",
  // الدراجات
  "دراجة نارية رياضية":"Sport Motorcycle","دراجة نارية كلاسيكية":"Classic Motorcycle","سكوتر":"Scooter","دراجة كهربائية":"Electric Bike","دراجة جبلية":"Mountain Bike","دراجة هوائية":"Bicycle","دراجة ثلاثية العجلات":"Tricycle",
  // قطع الغيار
  "محركات وقطع محرك":"Engines & Engine Parts","إطارات وجنوط":"Tires & Wheels","بطاريات":"Batteries","نظام تعليق ومساعدات":"Suspension & Shocks","مكابح":"Brakes","علبة سرعة (جير)":"Gearbox","كهرباء ودينمو":"Electrical & Alternator","كشتلات وبدي":"Body Panels","شكمان وعادم":"Exhaust","فلاتر وزيوت":"Filters & Oils",
  // الإكسسوارات
  "أنظمة صوت وترفييه":"Audio & Entertainment","كاميرات ورادار خلفي":"Cameras & Rear Radar","شاشات":"Displays","كراسي ومقاعد":"Seats","إضاءة وزينون و LED":"Lighting (Xenon/LED)","تغطية وحماية (واقيات)":"Covers & Protectors","زينة وملصقات":"Decor & Stickers","حوامل ورفوف":"Racks & Mounts",
  // مركبات أخرى
  "قارب":"Boat","طائرة":"Aircraft","مركبة زراعية":"Agricultural Vehicle","مقطورة":"Trailer",
  // الأجهزة الكهربائية
  "ثلاجات وفريزر":"Refrigerators & Freezers","غسالات ملابس":"Washing Machines","غسالات صحون":"Dishwashers","بوتاجاز / فرن":"Stove / Oven","ميكروويف":"Microwave","مكيفات":"Air Conditioners","سخانات مياه":"Water Heaters","مكانس كهربائية":"Vacuum Cleaners","خلاطات وعجانات":"Blenders & Mixers","أجهزة طبخ":"Cooking Appliances",
  // الإلكترونيات
  "هواتف ذكية":"Smartphones","حواسيب محمولة":"Laptops","حواسيب مكتبيّة":"Desktops","تلفزيونات وشاشات":"TVs & Monitors","كاميرات وتصوير":"Cameras","سماعات وسماعات لاسلكية":"Headphones & Earbuds","أجهزة لوحية (تابلت)":"Tablets","ألعاب وكونسول":"Gaming & Consoles","طابعات ومستلزمات":"Printers","أجهزة شبكات وراوتر":"Networking & Routers","ساعات ذكية":"Smartwatches",
  // المفروشات
  "كنب وصالونات":"Sofas & Living Rooms","طاولات":"Tables","أسرّة وغرف نوم":"Beds & Bedrooms","خزائن ودواليب":"Cabinets & Wardrobes","كراسي":"Chairs","ستائر ومفروشات":"Curtains & Textiles","سجاد وموكيت":"Carpets","مطابخ جاهزة":"Ready Kitchens","أثاث مكتبي":"Office Furniture","ديكور وتحف":"Decor",
  // الملابس
  "ملابس رجالي":"Men's Clothing","ملابس نسائي":"Women's Clothing","ملابس أطفال":"Kids' Clothing","أحذية":"Shoes","حقائب ومحافظ":"Bags & Wallets","إكسسوارات وساعات":"Accessories & Watches","ملابس رياضية":"Sportswear","أقمشة وخياطة":"Fabrics & Tailoring",
  // المواد الغذائية
  "مواد غذائية جافة":"Dry Food","معلبات":"Canned Goods","مشروبات وعصائر":"Beverages & Juices","مواد غذائية بالجملة":"Wholesale Food","منتجات ألبان":"Dairy Products","حلويات وسكريات":"Sweets & Sugar","زيوت وسمن":"Oils & Ghee","بهارات وبهارات":"Spices",
  // مواد البناء
  "سيراميك وبلاط":"Ceramic & Tiles","أدوات صحية وسيراميك":"Sanitary Ware","دهانات وألوان":"Paints & Colors","أسلاك ومستلزمات كهربائية":"Wiring & Electrical","أدوات يدوية":"Hand Tools","سباكة وتركيبات":"Plumbing","حديد وألمنيوم":"Iron & Aluminum","أخشاب وألواح":"Wood & Boards","أدوات حدادة":"Blacksmith Tools",
  // العطور
  "عطور":"Perfumes","مواد تجميل ومكياج":"Makeup & Cosmetics","منتجات عناية بالبشرة":"Skincare","منتجات عناية بالشعر":"Haircare","مستلزمات نسائية":"Feminine Products",
  // بضائع أخرى
  "مستلزمات أطفال":"Baby Products","رياضة و لياقة":"Sports & Fitness","هدايا وكماليات":"Gifts & Accessories","كتب وقرطاسية":"Books & Stationery","حيوانات أليفة ومستلزمات":"Pets & Supplies",
  // الخدمات
  "بنوك تجارية":"Commercial Banks","شركات صرافة":"Exchange Companies","حوالات مالية":"Money Transfers","تمويل وإيجار":"Finance & Leasing",
  "تأمين سيارات":"Car Insurance","تأمين على الحياة":"Life Insurance","تأمين ممتلكات":"Property Insurance","تأمين تجاري":"Commercial Insurance","تأمين صحي":"Health Insurance",
  "تخليص استيراد":"Import Clearance","تخليص تصدير":"Export Clearance","خدمات المنطقة الحرة":"Free Zone Services","مستندات وتصاريح":"Documents & Permits",
  "مستودعات ومخازن":"Warehouses","أراضي تجارية":"Commercial Land","محلات ومعارض":"Shops & Showrooms","مكاتب إدارية":"Administrative Offices","كراجات ومحطات":"Garages & Stations",
  "فحص سيارات":"Car Inspection","فحص آليات":"Machinery Inspection","تقييم مركبات":"Vehicle Valuation","فحص بضائع":"Goods Inspection","شهادات فحص":"Inspection Certificates",
  "بقالة":"Grocery","سوبرماركت":"Supermarket","بيع بالجملة":"Wholesale","تموينات":"Provisions",
  "شحن بحري":"Sea Freight","شحن جوي":"Air Freight","شحن بري":"Land Freight","نقل داخلي":"Inland Transport","تخزين وتوزيع":"Storage & Distribution","شحن دولي":"International Shipping",
  "ورشة سيارات":"Car Workshop","كهرباء سيارات":"Auto Electrical","سمكرة وبوية":"Bodywork & Paint","ميكانيك":"Mechanics","زجاج":"Glass","مركز صيانة أجهزة":"Appliance Service Center",
  "شركات استيراد":"Import Companies","شركات تصدير":"Export Companies","وكلاء تجاريون":"Commercial Agents","تمثيل تجاري":"Trade Representation",
  "مطعم":"Restaurant","مقهى":"Cafe","كاترينغ وضيافة":"Catering","وجبات سريعة":"Fast Food",
  "فندق":"Hotel","شقق مفروشة":"Furnished Apartments","قاعات مناسبات":"Event Halls",
  "خدمات ترجمة":"Translation Services","خدمات قانونية":"Legal Services","خدمات تسويق وإعلان":"Marketing & Advertising","خدمات تقنية":"IT Services","خدمات طبية":"Medical Services",
  // الماركات
  "تويوتا":"Toyota","هيونداي":"Hyundai","كيا":"Kia","نيسان":"Nissan","هوندا":"Honda","مازدا":"Mazda","ميتسوبيشي":"Mitsubishi","مرسيدس-بنز":"Mercedes-Benz","أودي":"Audi","فولكس فاجن":"Volkswagen","شيفروليه":"Chevrolet","فورد":"Ford","لكزس":"Lexus","إنفينيتي":"Infiniti","بورش":"Porsche","تيسلا":"Tesla","بي إي واي دي BYD":"BYD","جيلي":"Geely","تشيري":"Chery",
  "فولفو":"Volvo","مان MAN":"MAN","سكانيا":"Scania","رينو":"Renault","إيفيكو":"Iveco","ميتسوبيشي فوسو":"Mitsubishi Fuso","إيسوزو":"Isuzu","كاماز":"KamAZ",
  "كاتربيلر":"Caterpillar","كوماتسو":"Komatsu","هيتاشي":"Hitachi","فولفو CE":"Volvo CE","ليبور":"Liebherr","جي سي بي JCB":"JCB","بوك لين":"Poclain","دوسان":"Doosan","ساني":"SANY",
  "ياماها":"Yamaha","سوزوكي":"Suzuki","كاواساكي":"Kawasaki","بي إم دبليو":"BMW","دوكاتي":"Ducati","هارلي ديفيدسون":"Harley-Davidson","كي تي ام KTM":"KTM","فيسبا":"Vespa",
  "أصلية (وكيل)":"OEM (Dealer)","بوش":"Bosch","إنجرسول راند":"Ingersoll Rand","إم تي إل":"MTL",
  "إل جي":"LG","سامسونج":"Samsung","شيبنيكس":"Shibnics","فريش":"Fresh","توشيبا":"Toshiba",
  "آبل":"Apple","هواوي":"Huawei","شاومي":"Xiaomi","ديل":"Dell","إتش بي HP":"HP","لينوفو":"Lenovo","سوني":"Sony",
  // دول
  "🇯🇴 الأردن":"🇯🇴 Jordan","🇵🇸 فلسطين":"🇵🇸 Palestine","🇸🇾 سوريا":"🇸🇾 Syria","🇱🇧 لبنان":"🇱🇧 Lebanon","🇮🇶 العراق":"🇮🇶 Iraq","🇸🇦 السعودية":"🇸🇦 Saudi Arabia","🇦🇪 الإمارات":"🇦🇪 UAE","🇰🇼 الكويت":"🇰🇼 Kuwait","🇶🇦 قطر":"🇶🇦 Qatar","🇧🇭 البحرين":"🇧🇭 Bahrain","🇴🇲 عُمان":"🇴🇲 Oman","🇪🇬 مصر":"🇪🇬 Egypt","🇹🇷 تركيا":"🇹🇷 Turkey","🇺🇸 أمريكا":"🇺🇸 USA","🇬🇧 بريطانيا":"🇬🇧 UK","🇩🇪 ألمانيا":"🇩🇪 Germany",
};

function t(key){ const s = STR[key]; return s ? (s[LANG] || s.ar) : key; }
function tData(ar){ if(!ar) return ""; return LANG === "en" ? (DICT[ar] || ar) : ar; }

document.documentElement.lang = LANG;
document.documentElement.dir = LANG === "ar" ? "rtl" : "ltr";

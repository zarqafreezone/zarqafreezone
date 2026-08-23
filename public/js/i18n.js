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
  if (typeof pendingAuth !== "undefined" && pendingAuth && pendingAuth.stage && window.drawAuth) drawAuth();
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

  /* تثبيت التطبيق */
  install_app:      { ar:"📱 تثبيت التطبيق", en:"📱 Install App" },
  install_title:    { ar:"📲 ثبّت تطبيق المنطقة الحرة الزرقاء", en:"📲 Install the Zarqa Free Zone app" },
  install_sub:      { ar:"وصول سريع وتجربة كالتطبيقات على جهازك، مع إمكانية العمل دون اتصال.", en:"Quick access and a native-app experience on your device, with offline support." },
  installed_toast:  { ar:"تم تثبيت التطبيق ✓", en:"App installed ✓" },
  install_ios_t:    { ar:"آيفون / آيباد (Safari)", en:"iPhone / iPad (Safari)" },
  install_ios_s:    { ar:"١) اضغط زر المشاركة ⎋ في أسفل المتصفح\n٢) اختر «إضافة إلى الشاشحة الرئيسية»\n٣) اضغط «إضافة»", en:"1) Tap the Share button ⎋ at the bottom\n2) Choose 'Add to Home Screen'\n3) Tap 'Add'" },
  install_and_t:    { ar:"أندرويد", en:"Android" },
  install_and_s:    { ar:"١) افتح قائمة المتصفح ⋮\n٢) اختر «تثبيت التطبيق» أو «إضافة إلى الشاشحة الرئيسية»", en:"1) Open the browser menu ⋮\n2) Choose 'Install app' or 'Add to Home screen'" },
  install_pc_t:     { ar:"كمبيوتر", en:"Desktop" },
  install_pc_s:     { ar:"اضغط أيقونة التثبيت ⊕ بجانب شريط العنوان، أو من قائمة المتصفح ⋮ اختر «تثبيت التطبيق».", en:"Click the install icon ⊕ next to the address bar, or from the browser menu ⋮ choose 'Install app'." },
  got_it:           { ar:"حسناً", en:"Got it" },
  install_now:      { ar:"⚡ تثبيت فوري الآن", en:"⚡ Install instantly" },
  apk_download:     { ar:"⬇️ تحميل تطبيق أندرويد (APK)", en:"⬇️ Download Android App (APK)" },
  apk_short:        { ar:"🤖 تحميل أندرويد APK", en:"🤖 Android APK" },
  apk_hint:         { ar:"ملف تثبيت لأجهزة أندرويد — فعّل «تثبيت من مصادر غير معروفة» إن طُلب منك.", en:"Android installer — enable 'Install from unknown sources' if prompted." },

  /* المرحلة 1: عملة + وضع ليلي + مشاهدات + واتساب + إبلاغ */
  currency:         { ar:"العملة", en:"Currency" },
  theme:            { ar:"الوضع الليلي", en:"Theme" },
  views:            { ar:"مشاهدة", en:"views" },
  call:             { ar:"اتصال", en:"Call" },
  whatsapp:         { ar:"واتساب", en:"WhatsApp" },
  verified_badge:   { ar:"موثّق", en:"Verified" },
  report_ad:        { ar:"🚩 إبلاغ عن الإعلان", en:"🚩 Report listing" },
  report_title:     { ar:"الإبلاغ عن إعلان", en:"Report a listing" },
  report_desc:      { ar:"ساعدنا في حماية المنصة. اختر سبب البلاغ:", en:"Help us keep the platform safe. Choose a reason:" },
  r_scam:           { ar:"احتيال أو نصب", en:"Scam or fraud" },
  r_dup:            { ar:"إعلان مكرّر", en:"Duplicate listing" },
  r_wrong:          { ar:"معلومات خاطئة", en:"Misleading info" },
  r_prohibited:     { ar:"منتج/خدمة ممنوعة", en:"Prohibited item/service" },
  r_other:          { ar:"سبب آخر", en:"Other" },
  r_sent:           { ar:"شكراً لك، تم استلام البلاغ وسيتم مراجعته ✓", en:"Thank you, your report was received and will be reviewed ✓" },
  r_login:          { ar:"سجّل الدخول للإبلاغ عن إعلان", en:"Login to report a listing" },

  /* المرحلة 2: عروض أسعار + فيديو + طلبات شراء + فلاتر + إحصائيات */
  make_offer:       { ar:"💎 قدّم عرض سعر", en:"💎 Make an offer" },
  offer_title:      { ar:"تقديم عرض سعر", en:"Make an Offer" },
  offer_desc:       { ar:"قدّم سعرك للبائع/المشتري مباشرةً.", en:"Submit your price directly to the seller/buyer." },
  offer_price:      { ar:"سعر العرض", en:"Offer price" },
  offer_note:       { ar:"ملاحظة (اختياري)", en:"Note (optional)" },
  offer_sent:       { ar:"تم إرسال عرضك بنجاح ✓", en:"Your offer was sent ✓" },
  offers_label:     { ar:"العروض المقدّمة", en:"Offers received" },
  offers_count:     { ar:"عرض", en:"offers" },
  no_offers:        { ar:"لا توجد عروض بعد", en:"No offers yet" },
  video_field:      { ar:"🎬 فيديو للإعلان (اختياري — حتى 8MB)", en:"🎬 Listing video (optional — up to 8MB)" },
  video_too_big:    { ar:"حجم الفيديو كبير (الحد 8MB)", en:"Video too large (max 8MB)" },
  wanted_section:   { ar:"🔵 طلبات الشراء", en:"🔵 Wanted requests" },
  wanted_view_all:  { ar:"عرض كل الطلبات ←", en:"View all requests →" },
  filter_price:     { ar:"السعر", en:"Price" },
  min_price:        { ar:"الأدنى", en:"Min" },
  max_price:        { ar:"الأعلى", en:"Max" },
  filter_zone:      { ar:"الموقع", en:"Location" },
  zone_all:         { ar:"كل المواقع", en:"All locations" },
  sort_popular:     { ar:"🔥 الأكثر مشاهدة", en:"🔥 Most viewed" },
  apply:            { ar:"تطبيق", en:"Apply" },
  my_views:         { ar:"إجمالي المشاهدات", en:"Total views" },
  save_search:      { ar:"💾 حفظ هذا البحث", en:"💾 Save this search" },
  saved_searches:   { ar:"🔍 عمليات البحث المحفوظة", en:"🔍 Saved searches" },
  search_saved:     { ar:"تم حفظ البحث ✓", en:"Search saved ✓" },
  no_saved_search:  { ar:"لم تحفظ أي بحث بعد", en:"No saved searches yet" },
  new_results:      { ar:"نتائج جديدة", en:"new results" },

  /* قصص فيديو */
  stories:          { ar:"قصص", en:"Stories" },
  add_story:        { ar:"أضف إعلانك", en:"Add your ad" },
  story_tap:        { ar:"انقر للعرض", en:"Tap to view" },

  /* باقات الترقية */
  promote_btn:      { ar:"🚀 ترقية الإعلان", en:"🚀 Promote ad" },
  promo_title:      { ar:"باقات الترقية", en:"Promotion packages" },
  promo_desc:       { ar:"اجعل إعلانك يظهر أولاً ويصل لعدد أكبر من المشترين", en:"Get your ad shown first and reach more buyers" },
  promo_featured:   { ar:"⭐ مميز", en:"⭐ Featured" },
  promo_boost:      { ar:"🚀 حملة مشاهدات", en:"🚀 Boost campaign" },
  promo_premium:    { ar:"👑 مميز بلس", en:"👑 Premium" },
  promo_feat_d:     { ar:"إطار ذهبي + أولوية في القوائم — 90 يوماً", en:"Gold border + list priority — 90 days" },
  promo_boost_d:    { ar:"في القمة لمدة 7 أيام + شارة مميزة", en:"Top spot for 7 days + special badge" },
  promo_prem_d:     { ar:"مميز + بطاقة أكبر + شارة ملكية — 180 يوماً", en:"Featured + bigger card + royal badge — 180 days" },
  days:             { ar:"يوماً", en:"days" },
  promo_success:    { ar:"تم تفعيل الباقة! إعلانك الآن في المقدمة 🎉", en:"Package activated! Your ad is now on top 🎉" },
  promo_active:     { ar:"الباقة الحالية", en:"Current package" },
  promo_pick:       { ar:"اختر باقة", en:"Choose a package" },

  /* تنبيهات ذكية */
  alerts:           { ar:"التنبيهات", en:"Alerts" },
  no_alerts:        { ar:"لا توجد تنبيهات جديدة", en:"No new alerts" },
  alerts_sub:       { ar:"نتائج جديدة مطابقة لعمليات بحثك المحفوظة", en:"New results matching your saved searches" },
  enable_notif:     { ar:"تفعيل إشعارات المتصفح", en:"Enable browser notifications" },
  notif_on:         { ar:"تم تفعيل الإشعارات ✓", en:"Notifications enabled ✓" },

  /* صفحات المتاجر + فلتر أفراد/معارض */
  store_title:      { ar:"المتجر", en:"Store" },
  store_listings:   { ar:"إعلانات المتجر", en:"Store listings" },
  store_since:      { ar:"عضو منذ", en:"Member since" },
  store_empty:      { ar:"لا توجد إعلانات في هذا المتجر بعد", en:"No listings in this store yet" },
  view_store:       { ar:"عرض المتجر", en:"View store" },
  dealer:           { ar:"معرض", en:"Dealer" },
  individual:       { ar:"فرد", en:"Individual" },
  filter_dealer_all:{ ar:"الكل", en:"All" },
  filter_dealer_d:  { ar:"معارض", en:"Dealers" },
  filter_dealer_i:  { ar:"أفراد", en:"Individuals" },
  become_dealer:    { ar:"تحويل إلى حساب معرض (متجر)", en:"Upgrade to dealer account (store)" },
  become_individual:{ ar:"تحويل إلى حساب فرد", en:"Switch to individual account" },
  store_name_lbl:   { ar:"اسم المتجر/المعرض", en:"Store/Dealer name" },
  store_desc_lbl:   { ar:"نبذة عن المتجر", en:"About the store" },
  save_store:       { ar:"حفظ", en:"Save" },
  account_type:     { ar:"نوع الحساب", en:"Account type" },
  dealer_badge:     { ar:"🏛️ معرض موثّق", en:"🏛️ Verified dealer" },

  /* التعليقات */
  comments:         { ar:"التعليقات والأسئلة", en:"Comments & questions" },
  comments_count:   { ar:"تعليق", en:"comments" },
  no_comments:      { ar:"لا توجد تعليقات بعد — كن أول من يعلّق!", en:"No comments yet — be the first!" },
  write_comment:    { ar:"اكتب تعليقاً أو سؤالاً...", en:"Write a comment or question..." },
  comment_reply_ph: { ar:"اكتب ردّك...", en:"Write your reply..." },
  reply:            { ar:"رد", en:"Reply" },
  comment_send:     { ar:"إرسال", en:"Send" },
  comment_posted:   { ar:"تم نشر تعليقك ✓", en:"Your comment was posted ✓" },
  login_comment:    { ar:"سجّل الدخول للتعليق", en:"Login to comment" },
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

  // ===== أنواع وماركات جديدة — مركبات =====
  "كهربائية (EV)":"Electric (EV)","سيدان تنفيذية":"Executive Sedan",
  "سوبارو":"Subaru","BMW":"BMW","جيب":"Jeep","دودج":"Dodge","جي إم سي":"GMC","كاديلاك":"Cadillac","أكورا":"Acura","لاند روفر":"Land Rover","جاكوار":"Jaguar","بيجو":"Peugeot","ستروين":"Citroën","فيات":"Fiat","سكودا":"Škoda","سيات":"SEAT",
  "MG":"MG","هافال Haval":"Haval","تشانغان Changan":"Changan","جيتور Jetour":"Jetour","GAC":"GAC","هونغ تشي Hongqi":"Hongqi","زيكر Zeekr":"Zeekr","شاوبنغ Xpeng":"Xpeng","نيو Nio":"Nio","لوسيد Lucid":"Lucid",
  "رولز رويس":"Rolls-Royce","بنتلي":"Bentley","لامبورغيني":"Lamborghini","فيراري":"Ferrari","مازيراتي":"Maserati","أستون مارتن":"Aston Martin","جينيسيس Genesis":"Genesis","تاتا":"Tata","ماهيندرا":"Mahindra","سانغ يونغ":"SsangYong","داسيا":"Dacia","لادا":"Lada",
  "شاحنة حاويات":"Container Truck","شاحنة سحب وإنقاذ":"Tow & Recovery Truck","دايو":"Daewoo","تاترا":"Tatra","ماك MAC":"Mack","بيتربيلت":"Peterbilt",
  // حافلات
  "حافلات وميكروباصات":"Buses & Minibuses","حافلة ركاب كبيرة":"Large Passenger Bus","حافلة متوسطة (كوستر)":"Medium Bus (Coaster)","ميكروباص":"Minibus","حافلة سياحية فاخرة":"Luxury Tourist Bus","حافلة مدرسية":"School Bus","ميني باص":"Mini Bus",
  "تويوتا (كوستر)":"Toyota (Coaster)","سترا":"Setra","Temsa":"Temsa",
  // آليات إضافية + زراعية
  "حفارة مصغرة (ميني)":"Mini Excavator","جرافة زراعية":"Agricultural Tractor","آلة تمهيد (موتر جريدر)":"Motor Grader","كوبيلكو":"Kobelco","بوب كات Bobcat":"Bobcat",
  "مركبات وآليات زراعية":"Agricultural Vehicles & Machinery","جرار زراعي":"Farm Tractor","حصادة":"Harvester","آلة حرث":"Plowing Machine","رشاشة زراعية":"Crop Sprayer","بالير (حاطبة)":"Baler","مركبة أعمل (UTV)":"Utility Vehicle (UTV)",
  "جون دير":"John Deere","ماساي فيرغسون":"Massey Ferguson","نيوهولاند":"New Holland","كوبوتا":"Kubota","فالترا":"Valtra","CLS":"CLS",
  // دراجات + قوارب + كرفانات + مقطورات
  "دراجات نارية وهوائية":"Motorcycles & Bicycles","دراجة بضائع":"Delivery Bike","أبريليا":"Aprilia","تريمف":"Triumph","رويال إنفيلد":"Royal Enfield",
  "قوارب ويخوت":"Boats & Yachts","يخت فاخر":"Luxury Yacht","قارب صيد":"Fishing Boat","قارب سريع (زورق)":"Speedboat","قارب تجديف/كاياك":"Kayak / Rowing","جل باوت (قارب مطاطي)":"Inflatable Boat","سفينة تجارية":"Commercial Vessel",
  "كرفانات ومركبات إسكان":"RVs & Camper Vehicles","كرفان متحرك (Motorhome)":"Motorhome","مقطورة إسكان (Caravan)":"Caravan","كرفان مخيم":"Campervan","مقطورة سفر":"Travel Trailer",
  "مقطورات وتيلر":"Trailers & Semi-Trailers","مقطورة صغيرة":"Small Trailer","تيلر ثقيل (semi-trailer)":"Semi-Trailer","مقطورة سيارات":"Car Trailer","مقطورة صهريج":"Tanker Trailer","مقطورة بضائع مسطحة":"Flatbed Trailer","مقطورة قلابة":"Dump Trailer",
  "شميتز":"Schmitz","كوغيل":"Kögel","كراون":"Krone",
  "أنظمة تعليق هوائي":"Air Suspension","NGK":"NGK","Denso":"Denso","Mann-Filter":"Mann-Filter","Continental":"Continental",
  "أنظمة صوت وترفيه":"Audio & Entertainment","نوافذ وأفلام حرارية":"Windows & Heat Films","أغطية وأرضيات":"Covers & Floor Mats",
  "مروحية":"Helicopter","مركبة قتالية/مدرعة":"Combat / Armored Vehicle","غواصة/بحرية":"Submarine / Marine","سكوتر هوائي":"E-Scooter",
  // ===== أنواع وماركات جديدة — بضائع =====
  "آلة قهوة":"Coffee Machine","بلاك آند ديكر":"Black & Decker","فيليبس":"Philips","كنوود":"Kenwood","براون":"Braun","ملحقات وكابلات":"Accessories & Cables","إضاءة منزلية":"Home Lighting",
  "أوبو":"Oppo","ريلمي":"Realme","أسوس":"Asus","إيسر":"Acer","مايكروسوفت":"Microsoft","جي بي إل JBL":"JBL",
  "ملابس داخلية وبيت":"Underwear & Loungewear","عبايات و جلابيات":"Abayas & Jellabiyas",
  "بهارات وتوابل":"Spices & Seasonings","حبوب وقطاني":"Grains & Legumes","لحوم ودواجن مبردة":"Chilled Meat & Poultry","قهوة وشاي":"Coffee & Tea",
  "إسمنت وبلوك":"Cement & Blocks","عزل ومواد لاصقة":"Insulation & Adhesives",
  "أدوات تجميل":"Makeup Tools","عناية بالأطفال":"Baby Care",
  "مجوهرات وساعات":"Jewelry & Watches","مصوغات ذهب":"Gold Jewelry","مجوهرات فضة":"Silver Jewelry","مجوهرات وألماس":"Diamond Jewelry","ساعات فاخرة":"Luxury Watches","ساعات عادية":"Watches","إكسسوارات معدنية":"Metal Accessories",
  "حفاضات":"Diapers","حليب وغذاء أطفال":"Baby Milk & Food","عربات وكراسي أطفال":"Strollers & Baby Seats","ألعاب تعليمية":"Educational Toys","ملابس أطفال رضع":"Infant Clothing","مستلزمات سلامة":"Safety Products",
  "ألعاب وترفيه":"Toys & Entertainment","ألعاب أطفال":"Kids' Toys","ألعاب تحكم وريموت":"RC & Remote Toys","ألعاب لوحية":"Board Games","دراجات أطفال":"Kids' Bikes","بلياردو وطاولة":"Billiards & Table Games",
  "رياضة ولياقة":"Sports & Fitness","أجهزة لياقة بدنية":"Fitness Equipment","كرة قدم وكرة طائرة":"Football & Volleyball","دراجات رياضية":"Sports Bikes","مستلزمات تخييم":"Camping Gear","أسلحة صيد ورمي":"Hunting & Shooting","ملابس ومعدات رياضية":"Sportswear & Gear",
  "آلات موسيقية":"Musical Instruments","جيتار":"Guitar","بيانو وكيبورد":"Piano & Keyboard","إيقاع ودرامز":"Percussion & Drums","وترية (كمان)":"Strings (Violin)","نفخية":"Wind Instruments","معدات صوت ومكسر":"Audio & Mixing Gear",
  "حدائق وزراعة":"Garden & Agriculture","أدوات حدائق":"Garden Tools","بذور وشتلات":"Seeds & Seedlings","أسمدة ومبيدات":"Fertilizers & Pesticides","أنظمة ري":"Irrigation Systems","أحواض ونباتات زينة":"Pots & Ornamental Plants","معدات تشذيب":"Pruning Equipment",
  "طاقة ومولدات":"Energy & Generators","ألواح طاقة شمسية":"Solar Panels","بطاريات وإنفرتر":"Batteries & Inverters","مولدات كهرباء":"Power Generators","شاحنات وأجهزة شحن":"Chargers & Charging Devices",
  "مستلزمات طبية":"Medical Supplies","أجهزة قياس":"Measuring Devices","كراسي متحركة":"Wheelchairs","أجهزة سمع ونظارات":"Hearing Aids & Glasses","مستلزمات إسعاف":"First Aid Supplies","تأهيل وعلاج طبيعي":"Rehabilitation & Physiotherapy",
  "مواد خام وصناعية":"Raw & Industrial Materials","بلاستيك ومطاط":"Plastic & Rubber","معادن خام":"Raw Metals","مواد كيميائية":"Chemicals","آلات ومعدات مصنع":"Factory Machinery","تعبئة وتغليف":"Packaging",
  "قرطاسية ومكتب":"Stationery & Office","إلكترونيات مكتبية":"Office Electronics","مستلزمات طباعة":"Printing Supplies",
  "حيوانات ومستلزماتها":"Pets & Supplies","حيوانات أليفة":"Pets","أعلاف وغذاء":"Feed & Food","مستلزمات عناية":"Care Supplies","أقفاص وبيوت":"Cages & Houses",
  "تبغ ونارجيلة":"Tobacco & Shisha","سجائر":"Cigarettes","نارجيلة ومعسّل":"Shisha & Molasses","إلكترونية (vape)":"Electronic (Vape)","مستلزمات تدخين":"Smoking Accessories",
  // ===== أنواع جديدة — خدمات =====
  "حسابات تجارية":"Commercial Accounts","حسابات تخزين":"Storage Accounts","تأمين شحن وبضائع":"Freight & Cargo Insurance","خدمات تأمينية":"Insurance Services",
  "عقارات ووساطة":"Real Estate & Brokerage","شقق سكنية":"Residential Apartments","فلل وبيوت":"Villas & Houses","محلات تجارية":"Commercial Shops","إيجار ووساطة":"Rent & Brokerage","إدارة أملاك":"Property Management",
  "فحص معاينات قبل الشراء":"Pre-Purchase Inspection","منافذ بيع":"Sales Outlets","سلاسل توريد":"Supply Chains","صيانة تبريد":"Cooling Maintenance","توزيع وجملة":"Distribution & Wholesale","مخبز وحلويات":"Bakery & Sweets","نُزل وشاليهات":"Lodges & Chalets",
  "تعليم وتدريب":"Education & Training","دورات تدريبية":"Training Courses","مركز تعليم لغات":"Language Center","تدريب مهني":"Vocational Training","دروس خصوصية":"Private Tutoring","تدريب قيادة":"Driving Training",
  "عيادات":"Clinics","مختبرات وأشعة":"Labs & X-ray","طب أسنان":"Dentistry","علاج طبيعي":"Physiotherapy","خدمات تمريض":"Nursing Services",
  "استشارات قانونية":"Legal Consulting","محاماة وقضايا":"Law & Litigation","تحكيم وتسوية":"Arbitration & Settlement","توثيق وعقود":"Notary & Contracts",
  "تقنية وبرمجة":"IT & Programming","تصميم وبرمجة مواقع":"Web Design & Development","تطبيقات جوال":"Mobile Apps","دعم تقني وصيانة حاسب":"Tech Support & PC Repair","شبكات وأنظمة":"Networks & Systems","تسويق رقمي":"Digital Marketing",
  "تنظيف ومكافحة حشرات":"Cleaning & Pest Control","تنظيف منازل ومكاتب":"Home & Office Cleaning","تنظيف سجاد وكنب":"Carpet & Sofa Cleaning","مكافحة حشرات":"Pest Control","تنظيف خزانات":"Tank Cleaning",
  "تنظيم مناسبات":"Event Planning","تنظيم أفراح":"Wedding Planning","قاعات مؤتمرات":"Conference Halls","ديكور وتنسيق":"Decor & Coordination","فرق فنية ودي جي":"Bands & DJs",
  "نقل وليموزين":"Transport & Limousine","تاكسي وليموزين":"Taxi & Limousine","نقل موظفين":"Staff Transport","توصيل وطرود":"Delivery & Parcels","نقل مدرسي":"School Transport",
  "حراسة وأمن":"Guarding & Security","شركات حراسة":"Security Companies","أنظمة مراقبة وكاميرات":"Surveillance & Cameras","إنذار وأمان":"Alarm & Safety",
  "سياحة وسفر":"Tourism & Travel","وكالات سفر":"Travel Agencies","حجوزات طيران":"Flight Booking","جولات سياحية":"Tour Packages","تأشيرات":"Visas",
  "توظيف وموارد بشرية":"Recruitment & HR","توظيف وإعلان وظائف":"Recruitment & Job Ads","استقدام عمالة":"Labor Recruitment","مقابلات وتوظيف":"Interviews & Hiring","استشارات موارد بشرية":"HR Consulting",
  "صالونات وتجميل":"Salons & Beauty","صالونات رجالي":"Men's Salons","صالونات نسائية":"Women's Salons","تجميل وعناية":"Beauty & Care","سبا ومساج":"Spa & Massage",
  "مقاولات وبناء":"Contracting & Construction","مقاولات عامة":"General Contracting","مقاولات كهرباء":"Electrical Contracting","مقاولات سباكة":"Plumbing Contracting","ديكور ودهانات":"Decor & Painting","صيانة مباني":"Building Maintenance",
  "طباعة ودعاية":"Printing & Advertising","طباعة ومستنسخات":"Printing & Copiers","لافتات وإعلانات":"Signs & Ads","هدايا دعائية":"Promotional Gifts","تصميم جرافيك":"Graphic Design",
  "محطات وقود وغاز":"Fuel & Gas Stations","محطة وقود":"Fuel Station","بيع غاز":"Gas Sales","زيوت ومواد تشحيم":"Oils & Lubricants",
  "استشارات إدارية ومالية":"Management & Financial Consulting","استشارات إدارية":"Management Consulting","استشارات مالية ومحاسبة":"Financial & Accounting","دراسات جدوى":"Feasibility Studies","تدقيق وضرائب":"Audit & Taxes",

  // ===== قسم "أخرى" =====
  "تسويق":"Marketing","وساطة تجارية":"Commercial Brokerage","عروض شراكة":"Partnership Offers","عروض استثمار":"Investment Offers","فرص تجارية":"Business Opportunities","عروض متنوعة":"Miscellaneous Offers",
  "وساطة بيع وشراء":"Buy/Sell Brokerage","وكالة تجارية":"Commercial Agency","تمثيل شركات أجنبية":"Foreign Company Representation","ربط صفقات":"Deal Matching","وساطة استيراد وتصدير":"Import/Export Brokerage","سمسار معتمد":"Certified Broker",
  "شراكة تسويقية":"Marketing Partnership","رعاية وإعلان":"Sponsorship & Ads","تسويق بالعمولة":"Affiliate Marketing","وكالة تسويق":"Marketing Agency","علاقات عامة":"Public Relations","حملات إطلاق منتج":"Product Launch Campaigns",
  "شريك مؤسس":"Co-founder Partner","شريك مالي":"Financial Partner","شراكة تشغيلية":"Operational Partnership","شراكة عينية":"In-kind Partnership","انضمام لفريق مؤسس":"Join Founding Team","شراكة توسّع":"Expansion Partnership",
  "استثمار في مشروع ناشئ":"Startup Investment","بيع حصة في شركة":"Selling Company Share","استثمار عقاري":"Real Estate Investment","تمويل رأس مال":"Venture Capital","صناديق استثمار":"Investment Funds","طرح عام":"Public Offering (IPO)","استثمار زراعي/صناعي":"Agro/Industrial Investment",
  "امتياز تجاري":"Franchise","توزيع ووكالة حصرية":"Exclusive Distribution","فرصة استيراد":"Import Opportunity","فرصة تصدير":"Export Opportunity","عطاءات ومناقصات":"Tenders & Bids","تصفية محفظة":"Portfolio Liquidation",
  "تصفية مخزون":"Stock Liquidation","مقايضة":"Barter / Swap","طلب عروض أسعار":"Request for Quotation","بيع أصل تجاري":"Selling Business Asset","هدايا وعينيات":"Gifts & In-kind",
};

function t(key){ const s = STR[key]; return s ? (s[LANG] || s.ar) : key; }
function tData(ar){ if(!ar) return ""; return LANG === "en" ? (DICT[ar] || ar) : ar; }

/* مساعدات عرض الدول ثنائية اللغة */
function countryName(c){ if(!c) return ""; return (LANG === "en" && c.en) ? c.en : c.name; }
function showCountry(ar){
  if(!ar) return "";
  const find = (v) => (typeof COUNTRY_CODES !== "undefined") ? COUNTRY_CODES.find(x => x.name === v) : null;
  let c = find(ar);
  if(!c){
    const stripped = ar.replace(/^[\p{Emoji}\p{Extended_Pictographic}\uFE0F\u200d\s]+/u, "").trim();
    if(stripped && stripped !== ar) c = find(stripped);
  }
  if(!c) return ar;
  return c.flag + " " + countryName(c);
}

document.documentElement.lang = LANG;
document.documentElement.dir = LANG === "ar" ? "rtl" : "ltr";

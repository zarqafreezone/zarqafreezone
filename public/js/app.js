/* =========================================================================
   منطق تطبيق المنطقة الحرة الزرقاء (الزرقاء) — SPA (عربي/إنجليزي)
   v3: بيانات مركزية على الخادم عبر طبقة store
   ========================================================================= */
const app = document.getElementById("app");
const overlay = document.getElementById("overlay");
const toastEl = document.getElementById("toast");

/* ---------- الوضع الليلي (Dark Mode) ---------- */
let THEME = localStorage.getItem("fz_theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark":"light");
function applyTheme(){ document.documentElement.setAttribute("data-theme", THEME); const m=document.querySelector('meta[name="theme-color"]'); if(m) m.setAttribute("content", THEME==="dark"?"#0b1220":"#1e3a8a"); }
function toggleTheme(){ THEME = THEME==="dark"?"light":"dark"; localStorage.setItem("fz_theme",THEME); applyTheme(); render(); }
applyTheme();

let route = { name:"home", params:{} };
let pendingAuth = {};
let stripeCfg = { demo:true };

/* ---------- إعداد خادم الدفع ---------- */
async function loadConfig(){ try{ const r=await fetch("/api/config"); stripeCfg=await r.json(); }catch(e){ stripeCfg={demo:true}; } }
loadConfig();

/* ---------- مساعدات ---------- */
const esc = s => String(s ?? "").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function starsHTML(n){ let h=""; for(let i=1;i<=5;i++) h+= i<=n?"★":`<span class="empty">★</span>`; return h; }
function notify(msg){ toastEl.textContent=msg; toastEl.classList.add("show"); clearTimeout(notify._t); notify._t=setTimeout(()=>toastEl.classList.remove("show"),2400); }
function userInitials(name){ return (name||"؟").trim().slice(0,1); }
function thumbURL(l){
  if(l.images&&l.images.length) return l.images[0];
  if(l.img) return l.img;
  const sec=findSection(l.section);
  return placeholderImg(l.id, sec?sec.icon:"🛃", sec?sec.color:"#2563eb");
}
function locDeal(l){ return l.deal==="sell"? t("for_sale"): t("wanted"); }

/* ---------- واتساب + إبلاغ ---------- */
function waLink(phone, title){
  const digits = String(phone||"").replace(/\D/g,"");
  const msg = encodeURIComponent((LANG=="en"?"Hello, I'm interested in: ":"مرحباً، أنا مهتم بـ: ") + (title||""));
  return "https://wa.me/"+digits+"?text="+msg;
}
let reportTarget=null;
function openReport(id){
  if(!currentUser()){notify(t("r_login"));openAuth();return;}
  reportTarget=id;
  const opts=[["r_scam"],["r_dup"],["r_wrong"],["r_prohibited"],["r_other"]].map(([k],i)=>`<option value="${k}" ${i===0?"selected":""}>${t(k)}</option>`).join("");
  overlay.classList.add("show");
  overlay.innerHTML=`<div class="modal modal-wrap"><button class="modal-close" onclick="closeReport()">×</button>
    <div style="font-size:44px;text-align:center">🚩</div>
    <h2 style="text-align:center">${t("report_title")}</h2>
    <p class="muted center" style="margin-bottom:14px">${t("report_desc")}</p>
    <div class="field"><select id="reportReason" style="width:100%;padding:12px;border:1.5px solid var(--line);border-radius:11px;background:#fff">${opts}</select></div>
    <button class="btn btn-primary btn-block btn-lg" onclick="submitReport()">${t("report_ad")}</button>
    <button class="btn btn-ghost btn-block" style="margin-top:8px" onclick="closeReport()">${t("got_it")}</button></div>`;
}
function closeReport(){ overlay.classList.remove("show"); overlay.innerHTML=""; reportTarget=null; }
async function submitReport(){
  if(!reportTarget) return;
  const reason=document.getElementById("reportReason").value;
  try{ await store.reportListing(reportTarget, reason); closeReport(); notify(t("r_sent")); }catch(e){ notify(LANG=="en"?"Failed":"تعذّر"); }
}

/* =========================================================================
   الموجّه
   ========================================================================= */
async function go(name, params={}){ stopChatPoll(); route={name,params}; window.scrollTo(0,0); await maybeRefresh(name); render(); highlightNav(); }
let _lastListingsRefresh=0;
async function maybeRefresh(name){
  const needs=["home","categories","section","sub","browse","detail","favorites","account"].includes(name);
  if(needs && Date.now()-_lastListingsRefresh>8000){ try{ await store.refreshListings(); }catch(e){} _lastListingsRefresh=Date.now(); }
}
function highlightNav(){ document.querySelectorAll(".bottom-nav [data-route]").forEach(b=>b.classList.toggle("active", b.dataset.route===route.name)); }

function render(){
  renderTopbar();
  renderTicker();
  updateStaticUI();
  switch(route.name){
    case "home":       return viewHome();
    case "categories": return viewCategories();
    case "section":    return viewSection(route.params.section);
    case "sub":        return viewSub(route.params.section, route.params.sub);
    case "browse":     return viewBrowse(route.params);
    case "detail":     return viewDetail(route.params.id);
    case "add":        return viewAdd();
    case "account":    return viewAccount();
    case "favorites":  return viewFavorites();
    case "chat":       return viewChat(route.params);
    case "store":      return viewStore(route.params.id);
    case "edit":       return viewEdit(route.params.id);
    case "admin":      return viewAdmin();
    default:           return viewHome();
  }
}

/* =========================================================================
   الشريط العلوي + النصوص الثابتة
   ========================================================================= */
function renderTopbar(){
  const u = currentUser();
  const el = document.getElementById("authArea");
  const langBtn = `<button class="lang-btn" onclick="setLang('${LANG==="ar"?"en":"ar"}')" title="Language">${LANG==="ar"?"EN":"ع"}</button>`;
  const chatBtn = `<button class="lang-btn chat-btn" onclick="go('chat')" title="${t("chat")}">💬<span class="chat-badge" id="chatBadge">0</span></button>`;
  const bellBtn = savedSearches.length?`<button class="lang-btn bell-btn" onclick="openAlerts()" title="${t("alerts")}">🔔<span class="chat-badge" id="bellBadge">0</span></button>`:"";
  let userHtml = u
    ? `<button class="chip-user" onclick="go('account')"><span class="avatar" style="width:30px;height:30px;font-size:14px">${esc(userInitials(u.name))}</span><span class="cname">${esc(u.name)}</span>${u.stars?`<span class="stars-mini">${"★".repeat(u.stars)}</span>`:""}</button>`
    : `<button class="btn btn-primary login-btn" onclick="openAuth()"><span class="login-ico">👤</span><span class="login-txt">${t("login")}</span></button>`;
  const themeBtn = `<button class="lang-btn" onclick="toggleTheme()" title="${t("theme")}">${THEME==="dark"?"☀️":"🌙"}</button>`;
  const curBtn = `<select class="lang-btn cur-sel" onchange="setCurrency(this.value)" title="${t("currency")}">${["USD","JOD","SAR"].map(c=>`<option value="${c}" ${c===CUR?"selected":""}>${CUR_SYM[c]}</option>`).join("")}</select>`;
  el.innerHTML = curBtn + themeBtn + langBtn + chatBtn + bellBtn + userHtml + `<button id="topAdmin" class="btn btn-ghost btn-sm" onclick="go('admin')" title="${t("nav_admin")}">⚙️</button>`;
  paintBadge();
  paintBell();
  ensureInstallFab();
}
/* =========================================================================
   الشريط الإخباري المتحرك (مصدر أخباره: لوحة المدير)
   ========================================================================= */
let _tickerSig="", _tickerRAF=null;
function newsTime(ts){ const d=new Date(ts||Date.now()); const p=n=>String(n).padStart(2,"0"); return p(d.getDate())+"/"+p(d.getMonth()+1)+" "+p(d.getHours())+":"+p(d.getMinutes()); }
function renderTicker(){
  const el=document.getElementById("newsTicker"); if(!el) return;
  const items=(state.news||[]).filter(n=>n.active!==false && (n.text||"").trim());
  const sig=items.map(n=>n.id+"|"+(n.text||"")+"|"+(n.link||"")+"|"+newsTime(n.ts)).join("§")+(LANG==="en"?"_en":"_ar");
  if(sig===_tickerSig){ if(items.length && el.style.display!=="flex") el.style.display="flex"; return; }  // لم يتغير — حافظ على الحركة الجارية
  if(_tickerRAF){ cancelAnimationFrame(_tickerRAF); _tickerRAF=null; }   // تغيّر المحتوى → أوقف القديم وأعد البناء
  _tickerSig=sig;
  if(!items.length){ el.innerHTML=""; el.style.display="none"; return; }
  el.style.display="flex";
  el.innerHTML=`<span class="ticker-label">${t("news_label")}</span><div class="ticker-viewport" id="tickerVp"></div>`;
  const vp=el.querySelector("#tickerVp"); const vw=vp.clientWidth||800;
  // كل خبر = عنصر مستقل صغير (طبقة GPU صغيرة) لتفادي حدّ الحجم الأقصى للطبقة على الأجهزة الضعيفة
  const makeEl=n=>{ const s=document.createElement("span"); s.className="ticker-item";
    s.style.cssText="position:absolute;top:50%;left:0;white-space:nowrap;will-change:transform;display:inline-flex;align-items:center;";
    s.innerHTML=(n.link?`<a href="${esc(n.link)}" target="_blank" rel="noopener">📰 ${esc(n.text)}</a>`:`📰 ${esc(n.text)}`)+`<span class="ticker-time">· ${newsTime(n.ts)}</span><span class="ticker-sep">◆</span>`;
    vp.appendChild(s); const w=s.offsetWidth+22; return {el:s,w:w}; };
  const list=[]; let base=0, copies=0;
  do{ for(const n of items){ const o=makeEl(n); o.base=base; base+=o.w; list.push(o); } copies++; }while(base<vw+400 && copies<6);
  const totalW=base||1;
  let offset=0, last=performance.now(), paused=false;
  el.onmouseenter=()=>{paused=true;}; el.onmouseleave=()=>{paused=false;};
  const speed=85;   // بكسل/ث نحو اليمين — تكرار لا نهائي سلس (حلقة دائرية)
  (function frame(now){
    const dt=Math.min(0.05,(now-last)/1000); last=now;
    if(!paused){ offset+=speed*dt; }
    for(const o of list){ const sx=((o.base+offset)%totalW+totalW)%totalW; o.el.style.transform="translate("+sx+"px,-50%)"; }
    _tickerRAF=requestAnimationFrame(frame);
  })(performance.now());
}

function updateStaticUI(){
  document.getElementById("topSearch").placeholder = t("search_ph");
  const bT1=document.getElementById("brandText1"), bT2=document.getElementById("brandText2");
  if(LANG==="ar"){ bT1.textContent="المنطقة الحرة"; bT2.textContent="الزرقاء"; }
  else { bT1.textContent="Zarqa"; bT2.textContent="Free Zone"; }
  document.getElementById("footBrand").textContent = t("brand_full");
  document.getElementById("footDesc").textContent = LANG==="ar"
    ? "منصة إعلانات بلا جمارك تربط التجار حول العالم. المنطقة الحرة الزرقاء — الأردن."
    : "A duty-free classifieds platform connecting traders worldwide. Zarqa Free Zone — Jordan.";
  document.getElementById("copyText").textContent = t("powered_by");
  document.getElementById("navHome").querySelector(".lbl").textContent = t("nav_home");
  document.getElementById("navCats").querySelector(".lbl").textContent = t("nav_cats");
  document.getElementById("navFav").querySelector(".lbl").textContent = t("nav_fav");
  document.getElementById("navAcc").querySelector(".lbl").textContent = t("nav_account");
  document.getElementById("logoLink").onclick = ()=>go("home");
  document.getElementById("footLinks").innerHTML =
    [["home",t("nav_home")],["categories",t("nav_cats")],["add",t("add_listing")],["admin",t("nav_admin")]]
    .map(([r,lbl])=>`<a onclick="go('${r}')">${lbl}</a>`).join("") +
    (pwaStandalone()?'':`<a onclick="installApp()">${t("install_app")}</a>`) +
    (window.__APK_READY?`<a href="${APK_URL}" download>${t("apk_short")}</a>`:'');
}

/* =========================================================================
   نافذة تسجيل الدخول عبر الجوال + OTP
   ========================================================================= */
function openAuth(){ pendingAuth={stage:"phone"}; drawAuth(); overlay.classList.add("show"); }
function closeAuth(){ overlay.classList.remove("show"); overlay.innerHTML=""; pendingAuth={}; }

function drawAuth(){
  const o=pendingAuth;
  if(o.stage==="phone"){
    const opts=COUNTRY_CODES.map(c=>`<option value="${c.code}" data-d="${c.digits}">${c.flag} ${countryName(c)} ${c.code}</option>`).join("");
    overlay.innerHTML=`<div class="modal modal-wrap">
      <button class="modal-close" onclick="closeAuth()">×</button>
      <h2>${t("auth_welcome")}</h2><p class="muted">${t("auth_desc")}</p>
      <div class="field"><label>${t("f_name")}</label><input id="authName" placeholder="${t("f_name_ph")}" value="${esc(o.name||"")}"></div>
      <div class="field"><label>${t("f_phone")} <span class="req">${t("req")}</span></label>
        <div class="country-row"><select id="authCC">${opts}</select>
        <input id="authPhone" type="tel" inputmode="numeric" placeholder="${t("f_phone_ph")}" maxlength="12"></div></div>
      <button class="btn btn-primary btn-block btn-lg" onclick="sendOtp()">${t("send_otp")}</button>
      <p class="muted center" style="font-size:12px;margin-top:14px">${t("tos")}</p></div>`;
  } else if(o.stage==="otp"){
    overlay.innerHTML=`<div class="modal modal-wrap">
      <button class="modal-close" onclick="closeAuth()">×</button>
      <h2>${t("enter_otp")}</h2><p class="muted">${t("otp_sent")} <b>${esc(o.cc+" "+o.phone)}</b></p>
      <div class="otp-row">${[0,1,2,3].map(()=>`<input maxlength="1" class="otp" oninput="otpNext(this)">`).join("")}</div>
      <p class="muted center" style="font-size:12px;margin-bottom:14px">${t("otp_hint")}</p>
      <button class="btn btn-primary btn-block btn-lg" onclick="verifyOtp()">${t("confirm")}</button>
      <button class="btn btn-ghost btn-block" style="margin-top:10px" onclick="pendingAuth.stage='phone';drawAuth()">${t("change_num")}</button></div>`;
    setTimeout(()=>document.querySelector(".otp")?.focus(),60);
  }
}
function sendOtp(){
  const name=document.getElementById("authName").value.trim(); const ccSel=document.getElementById("authCC");
  const phone=document.getElementById("authPhone").value.trim().replace(/\D/g,"");
  if(!phone){ notify(LANG==="en"?"Enter phone number":"أدخل رقم الجوال"); return; }
  if(phone.length<6){ notify(LANG==="en"?"Incomplete number":"رقم الجوال غير مكتمل"); return; }
  pendingAuth={stage:"otp",name,cc:ccSel.value,phone,full:ccSel.value+phone}; drawAuth();
}
function otpNext(el){ if(el.value && el.nextElementSibling && el.nextElementSibling.classList.contains("otp")) el.nextElementSibling.focus(); }
async function verifyOtp(){
  const code=[...document.querySelectorAll(".otp")].map(i=>i.value).join("");
  if(code!=="1234"){ notify(LANG==="en"?"Wrong code (try 1234)":"الرمز غير صحيح (جرّب 1234)"); return; }
  const o=pendingAuth; const c=COUNTRY_CODES.find(x=>x.code===o.cc);
  try{
    await store.login(o.name||"", o.full, c?c.name:"");
    closeAuth(); notify(LANG==="en"?"Logged in ✓":"تم تسجيل الدخول بنجاح ✓"); go("account"); refreshChatBadge();
  }catch(e){ notify(LANG==="en"?"Login failed":"تعذّر تسجيل الدخول"); }
}

/* =========================================================================
   البنرات المدفوعة المتحركة
   ========================================================================= */
/* إعلان مجموعة البستنجي المدفوع — وكيل ZEEKR و Lynk & Co (معرض داخل المنطقة الحرة) */
function bzCountUp(){
  document.querySelectorAll(".bz-num[data-n]:not([data-done])").forEach(el=>{
    el.setAttribute("data-done","1");
    const n=+el.getAttribute("data-n"), dur=1500, t0=performance.now();
    const fmt=v=>v>=1000?(v/1000).toFixed(v>=15000?0:1)+"K+":String(v)+"+";
    (function step(now){ const p=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-p,3);
      el.textContent=fmt(Math.round(n*e));
      if(p<1) requestAnimationFrame(step); })(t0);
  });
}
function bannerLong(){
  const b=getBanner("long"); if(!b||!b.active) return "";
  setTimeout(bzCountUp,80);
  return `<a class="bz-banner" href="https://bustanjimotors.com" target="_blank" rel="sponsored noopener">
    <span class="ad-label">${t("paid_ad")}</span>
    <div class="bz-bg"></div>
    <div class="bz-speeds"><i></i><i></i><i></i><i></i><i></i></div>
    <div class="bz-parts"><i></i><i></i><i></i><i></i><i></i><i></i></div>
    <div class="bz-inner">
      <div class="bz-brand">
        <div class="bz-logo">🚘<em>⚡</em></div>
        <div class="bz-names">
          <div class="bz-name-ar">${t("bz_brand")}</div>
          <div class="bz-name-sub">${t("bz_tagline")}</div>
        </div>
      </div>
      <div class="bz-msgs">
        <div class="bz-msg">${t("bz_msg1")}</div>
        <div class="bz-msg">${t("bz_msg2")}</div>
        <div class="bz-msg">${t("bz_msg3")}</div>
        <div class="bz-msg">${t("bz_msg4")}</div>
      </div>
      <div class="bz-side">
        <div class="bz-stats">
          <div class="bz-stat"><b class="bz-num" data-n="48">48+</b><span>${t("bz_years")}</span></div>
          <div class="bz-stat"><b class="bz-num" data-n="15000">15K+</b><span>${t("bz_cars")}</span></div>
          <div class="bz-stat"><b class="bz-num" data-n="8">8</b><span>${t("bz_showrooms")}</span></div>
        </div>
        <span class="bz-cta">${t("bz_cta")}</span>
      </div>
    </div>
    <div class="bz-foot">${t("bz_loc")} <b>bustanjigroup.com</b></div>
  </a>`;
}
function bannerSquare(){
  const b=getBanner("square"); if(!b||!b.active) return "";
  setTimeout(bzCountUp,80);
  return `<a class="bzs-banner" href="https://bustanjimotors.com" target="_blank" rel="sponsored noopener">
    <span class="ad-label">${t("paid_ad")}</span>
    <div class="bzs-bg"></div>
    <div class="bz-speeds"><i></i><i></i><i></i></div>
    <div class="bz-parts"><i></i><i></i><i></i><i></i></div>
    <div class="bzs-inner">
      <div class="bzs-logo">🚘<em>⚡</em></div>
      <div class="bzs-name">${t("bz_brand")}</div>
      <div class="bzs-pills"><span class="bzs-pill">ZEEKR</span><span class="bzs-pill">Lynk &amp; Co</span></div>
      <div class="bzs-msgs">
        <div class="bzs-msg">${t("bzs_msg1")}</div>
        <div class="bzs-msg">${t("bzs_msg2")}</div>
        <div class="bzs-msg">${t("bzs_msg3")}</div>
      </div>
      <div class="bz-stats">
        <div class="bz-stat"><b class="bz-num" data-n="48">48+</b><span>${t("bz_years")}</span></div>
        <div class="bz-stat"><b class="bz-num" data-n="15000">15K+</b><span>${t("bz_cars")}</span></div>
        <div class="bz-stat"><b class="bz-num" data-n="8">8</b><span>${t("bz_showrooms")}</span></div>
      </div>
      <span class="bzs-cta">${t("bzs_cta")}</span>
    </div>
  </a>`;
}

/* إعلان الافتتاح (Splash) — شاشة كاملة 4 ثوانٍ، مرة واحدة لكل زيارة */
let _splashT1=null,_splashT2=null;
function showSplashAd(){
  try{
    if(sessionStorage.getItem("fz_splash_ad")==="1") return;
    const b=getBanner("splash"); if(!b||!b.active) return;
    sessionStorage.setItem("fz_splash_ad","1");
    const link=b.link||"https://bustanjimotors.com";
    const ov=document.createElement("div"); ov.id="splashAd"; ov.className="sa-overlay";
    ov.innerHTML=`
      <div class="sa-speeds"><i></i><i></i><i></i><i></i></div>
      <div class="sa-orb sa-orb1"></div><div class="sa-orb sa-orb2"></div>
      <span class="sa-label">${t("paid_ad")}</span>
      <button class="sa-skip" aria-label="skip">${t("sa_skip")} ⏭ <b>4</b></button>
      <div class="sa-bar"><i></i></div>
      <div class="sa-card">
        <div class="sa-logo">🚘<em>⚡</em></div>
        <div class="sa-brand">${t("bz_brand")}</div>
        <div class="sa-tag">${t("bz_tagline")}</div>
        <div class="sa-pills"><span>${t("sa_pills")}</span><span>${t("sa_pills2")}</span></div>
        <div class="bz-stats">
          <div class="bz-stat"><b class="bz-num" data-n="48">48+</b><span>${t("bz_years")}</span></div>
          <div class="bz-stat"><b class="bz-num" data-n="15000">15K+</b><span>${t("bz_cars")}</span></div>
          <div class="bz-stat"><b class="bz-num" data-n="8">8</b><span>${t("bz_showrooms")}</span></div>
        </div>
        <a class="sa-cta" href="${esc(link)}" target="_blank" rel="sponsored noopener" onclick="closeSplashAd()">${t("bz_cta")}</a>
        <div class="sa-foot">${t("bz_loc")}</div>
      </div>`;
    document.body.appendChild(ov);
    setTimeout(bzCountUp,200);
    requestAnimationFrame(()=>ov.classList.add("show"));
    let left=4; const cnt=ov.querySelector(".sa-skip b");
    _splashT1=setInterval(()=>{ left--; if(cnt)cnt.textContent=left; if(left<=0) closeSplashAd(); },1000);
    ov.querySelector(".sa-skip").addEventListener("click",closeSplashAd);
    _splashT2=setTimeout(closeSplashAd,4600);
  }catch(e){}
}
function closeSplashAd(){
  clearInterval(_splashT1); clearTimeout(_splashT2);
  const ov=document.getElementById("splashAd"); if(!ov) return;
  ov.classList.remove("show");
  setTimeout(()=>{ const o=document.getElementById("splashAd"); if(o)o.remove(); },500);
}

/* =========================================================================
   1) الصفحة الرئيسية
   ========================================================================= */
function viewHome(){
  const total=allListings().length; const subs=CATEGORIES.reduce((a,c)=>a+c.subs.length,0);
  const featured=queryListings({featured:true}); const latest=queryListings({sort:"newest"}).slice(0,8); const wanted=queryListings({deal:"buy"}).slice(0,4);
  app.innerHTML=`
    <section class="hero" style="background-image:linear-gradient(135deg,rgba(30,58,138,.86),rgba(37,99,235,.78)),url('images/zone.jpg')">
      <div class="wrap"><div class="badge-free">${t("hero_free_badge")}</div>
        <h1>${t("hero_title")}</h1><p>${t("hero_desc")}</p>
        <div class="hero-search">
          <select id="hSec"><option value="">${t("all_sections")}</option>${CATEGORIES.map(c=>`<option value="${c.id}">${c.icon} ${tData(c.name)}</option>`).join("")}</select>
          <select id="hDeal"><option value="">${t("deal_any")}</option><option value="sell">${t("deal_sell")}</option><option value="buy">${t("deal_buy")}</option></select>
          <input id="hQ" placeholder="${LANG==="en"?"Search: car, fridge...":"ابحث: سيارة، ثلاجة..."}">
          <button class="btn btn-primary" onclick="homeSearch()">${t("search_btn")}</button>
        </div>
        <div class="hero-stats">
          <div><b>${total}+</b><span>${t("stat_listings")}</span></div>
          <div><b>${CATEGORIES.length}</b><span>${t("stat_sections")}</span></div>
          <div><b>${subs}</b><span>${t("stat_subs")}</span></div>
          <div><b>${COUNTRY_CODES.length}+</b><span>${t("stat_countries")}</span></div>
        </div>
        ${pwaStandalone()?'':`<div style="text-align:center;margin-top:18px"><button class="btn btn-ghost" id="heroInstall" onclick="installApp()" style="font-weight:700">${t("install_app")}</button></div>`}</div>
    </section>
    <div class="wrap">${bannerLong()}</div>
    <section class="section"><div class="wrap"><div class="sec-head"><h2>${t("main_sections")}</h2></div>
      <div class="cat-grid">${CATEGORIES.map(c=>{const n=allListings().filter(l=>l.section===c.id).length;
        return `<div class="cat-card" onclick="go('section',{section:'${c.id}'})"><span class="count">${n} ${t("ads_label")}</span><div class="ico">${c.icon}</div><h3>${tData(c.name)}</h3><p>${c.subs.length} ${t("sub_count")}</p></div>`;}).join("")}</div></div></section>
    ${storiesBarHTML()}
    ${featured.length?`<section class="section" style="padding-top:0"><div class="wrap"><div class="sec-head"><h2>${t("featured")}</h2><a onclick="go('browse',{featured:'1'})">${t("view_all")}</a></div><div class="list-grid">${listCardsHTML(featured)}</div></div></section>`:""}
    <section class="section" style="padding-top:0"><div class="wrap"><div class="sec-head"><h2>${t("latest")}</h2><a onclick="go('browse',{sort:'newest'})">${t("view_all")}</a></div><div class="list-grid">${listCardsHTML(latest)}</div></div></section>
    ${wanted.length?`<section class="section" style="padding-top:0"><div class="wrap"><div class="sec-head"><h2>${t("wanted_section")}</h2><a onclick="go('browse',{deal:'buy'})">${t("wanted_view_all")}</a></div><div class="list-grid">${listCardsHTML(wanted)}</div></div></section>`:""}
    <section class="section" style="padding-top:0"><div class="wrap"><div class="rating-legend"><h3>${t("rating_title")}</h3>
      ${[["★★★★★",100,"rt_5"],["★★★★",80,"rt_4"],["★★★",60,"rt_3"],["★★",40,"rt_2"],["★",20,"rt_1"]].map(r=>`<div class="rt-row"><span class="s">${r[0]}</span><div class="bar"><i style="width:${r[1]}%"></i></div><span class="d">${t(r[2])}</span></div>`).join("")}</div></div></section>`;
}
function homeSearch(){ go("browse",{section:document.getElementById("hSec").value,deal:document.getElementById("hDeal").value,q:document.getElementById("hQ").value}); }

/* =========================================================================
   2) التصنيفات
   ========================================================================= */
function viewCategories(){
  app.innerHTML=`<section class="section"><div class="wrap">
    <div class="breadcrumb"><a onclick="go('home')">${t("breadcrumb_home")}</a><span>/</span><span>${t("all_categories")}</span></div>
    <div class="sec-head"><h2>${t("all_categories")}</h2></div>
    ${CATEGORIES.map(c=>`<div style="margin-bottom:26px"><h3 style="margin-bottom:12px;display:flex;align-items:center;gap:8px;color:${c.color}">${c.icon} ${tData(c.name)}</h3>
      <div class="sub-grid">${c.subs.map(s=>{const n=allListings().filter(l=>l.section===c.id&&l.sub===s.id).length;
        return `<div class="sub-card" onclick="go('sub',{section:'${c.id}',sub:'${s.id}'})"><div class="ico">${s.icon}</div><h4>${tData(s.name)}</h4><div class="cnt">${n} ${t("ads_label")}</div></div>`;}).join("")}</div></div>`).join("")}
  </div></section>`;
}

/* =========================================================================
   3) صفحة قسم
   ========================================================================= */
function viewSection(sectionId){
  const s=findSection(sectionId); if(!s){go("home");return;}
  app.innerHTML=`<section class="section"><div class="wrap">
    <div class="breadcrumb"><a onclick="go('home')">${t("breadcrumb_home")}</a><span>/</span><span>${tData(s.name)}</span></div>
    <div class="sec-head"><h2>${s.icon} ${tData(s.name)}</h2></div>
    <div class="sub-grid">${s.subs.map(sub=>{const n=allListings().filter(l=>l.section===s.id&&l.sub===sub.id).length;
      return `<div class="sub-card" onclick="go('sub',{section:'${s.id}',sub:'${sub.id}'})"><div class="ico">${sub.icon}</div><h4>${tData(sub.name)}</h4><div class="cnt">${n} ${t("ads_label")}</div></div>`;}).join("")}</div>
  </div></section>`;
}

/* =========================================================================
   4) صفحة تصنيف فرعي
   ========================================================================= */
function viewSub(sectionId, subId){
  const s=findSection(sectionId), sub=findSub(sectionId,subId); if(!s||!sub){go("home");return;}
  const items=allListings().filter(l=>l.section===sectionId&&l.sub===subId);
  app.innerHTML=`<section class="section"><div class="wrap">
    <div class="breadcrumb"><a onclick="go('home')">${t("breadcrumb_home")}</a><span>/</span><a onclick="go('section',{section:'${s.id}'})">${tData(s.name)}</a><span>/</span><span>${tData(sub.name)}</span></div>
    <div class="sec-head"><h2>${sub.icon} ${tData(sub.name)}</h2><a onclick="go('browse',{section:'${s.id}',sub:'${sub.id}'})">${LANG==="en"?`All listings (${items.length})`:`عرض كل الإعلانات (${items.length})`} →</a></div>
    <p class="muted" style="margin-bottom:12px">${t("choose_type")}</p>
    <div class="type-list">${sub.types.map(ty=>{const n=items.filter(l=>l.type===ty).length;
      return `<span class="type-chip" onclick="go('browse',{section:'${s.id}',sub:'${sub.id}',q:'${ty.replace(/'/g,"")}'}">${tData(ty)} ${n?`<span class="muted">(${n})</span>`:""}</span>`;}).join("")}</div>
    ${items.length?`<h3 style="margin:26px 0 14px">${t("latest_in")} ${tData(sub.name)}</h3><div class="list-grid">${listCardsHTML(items.slice(0,4))}</div>`
      :`<div class="list-empty"><div class="big">${sub.icon}</div><p>${t("no_ads_yet")}</p><button class="btn btn-primary" style="margin-top:14px" onclick="go('add')">${t("be_first")}</button></div>`}
  </div></section>`;
}

/* =========================================================================
   5) تصفّح / بحث
   ========================================================================= */
function viewBrowse(p){
  const items=queryListings(p); const title = p.section? tData(getSectionName(p.section)) : (LANG==="en"?"Results":"النتائج");
  app.innerHTML=`<section class="section"><div class="wrap">
    <div class="breadcrumb"><a onclick="go('home')">${t("breadcrumb_home")}</a><span>/</span><span>${esc(p.q||title)}</span></div>
    <div class="browse-layout"><div class="browse-main">
      <div class="fab-row"><div class="tabs">
        <button class="${!p.deal?'active':''}" onclick="go('browse',{...currentBrowse(),deal:''})">${t("tab_all")}</button>
        <button class="${p.deal==='sell'?'active':''}" onclick="go('browse',{...currentBrowse(),deal:'sell'})">${t("deal_sell")}</button>
        <button class="${p.deal==='buy'?'active':''}" onclick="go('browse',{...currentBrowse(),deal:'buy'})">${t("deal_buy")}</button>
      </div>
      <input id="brQ" placeholder="${t("search_text")}" value="${esc(p.q||"")}" style="flex:1;min-width:140px" onkeydown="if(event.key==='Enter')browseSearch()">
      <select id="brSort" onchange="go('browse',{...currentBrowse(),sort:this.value})"><option value="">${t("sort_latest")}</option><option value="price_asc" ${p.sort==='price_asc'?'selected':''}>${t("sort_price_up")}</option><option value="price_desc" ${p.sort==='price_desc'?'selected':''}>${t("sort_price_down")}</option><option value="popular" ${p.sort==='popular'?'selected':''}>${t("sort_popular")}</option></select></div>
      <div class="filter-bar"><span class="muted" style="font-weight:700;white-space:nowrap">${t("filter_price")}</span><input id="brMin" type="number" inputmode="numeric" placeholder="${t("min_price")}" value="${esc(p.min||"")}" style="width:84px"><span class="muted">—</span><input id="brMax" type="number" inputmode="numeric" placeholder="${t("max_price")}" value="${esc(p.max||"")}" style="width:84px"><select id="brZone"><option value="">${t("zone_all")}</option><option value="inside" ${p.zone==='inside'?'selected':''}>${t("zone_inside")}</option><option value="outside" ${p.zone==='outside'?'selected':''}>${t("zone_outside")}</option></select><select id="brDealer"><option value="">${t("filter_dealer_all")}</option><option value="dealer" ${p.dealer==='dealer'?'selected':''}>${t("filter_dealer_d")}</option><option value="individual" ${p.dealer==='individual'?'selected':''}>${t("filter_dealer_i")}</option></select><button class="btn btn-primary btn-sm" onclick="applyFilters()">${t("apply")}</button><button class="btn btn-ghost btn-sm" onclick="saveSearch()">${t("save_search")}</button></div>
      <p class="muted" style="margin-bottom:14px">${items.length} ${t("results_count")}</p>
      ${items.length?`<div class="list-grid">${listCardsHTML(items)}</div>`:`<div class="list-empty"><div class="big">🔍</div><p>${t("no_results")}</p><button class="btn btn-primary" style="margin-top:14px" onclick="go('add')">${t("add_your_ad")}</button></div>`}
      ${bannerLong()}</div>
      <aside class="browse-side">${bannerSquare()}<div class="side-card">${t("ad_space")}</div></aside></div>
  </div></section>`;
}
function currentBrowse(){ return route.params; }
function browseSearch(){ go("browse",{...currentBrowse(),q:document.getElementById("brQ").value}); }
function applyFilters(){ go("browse",{...currentBrowse(),min:document.getElementById("brMin").value,max:document.getElementById("brMax").value,zone:document.getElementById("brZone").value,dealer:document.getElementById("brDealer").value}); }
let savedSearches=JSON.parse(localStorage.getItem("fz_saved_searches")||"[]");
function searchLabel(p){ const b=[]; if(p.q)b.push(p.q); if(p.section)b.push(tData(getSectionName(p.section))); if(p.deal==='sell')b.push(t("deal_sell")); if(p.deal==='buy')b.push(t("deal_buy")); return b.join(" \u2022 ")||t("all_categories"); }
function saveSearch(){ const s={...route.params,saved:Date.now()}; savedSearches.unshift(s); savedSearches=savedSearches.slice(0,12); localStorage.setItem("fz_saved_searches",JSON.stringify(savedSearches)); notify(t("search_saved")); renderTopbar(); }
function savedNewCount(s){ try{ const list=queryListings(s); const since=s.saved||0; return list.filter(l=>{ const lt=l.ts||new Date(l.date).getTime(); return lt>since; }).length; }catch(e){ return 0; } }
function goSaved(i){ const s=savedSearches[i]; if(!s)return; const {saved,...params}=s; go("browse",params); }
function delSavedSearch(i){ savedSearches.splice(i,1); localStorage.setItem("fz_saved_searches",JSON.stringify(savedSearches)); render(); }
/* عروض الأسعار (Make Offer) */
let offerTarget=null;
function openOffer(id){ if(!currentUser()){notify(t("r_login"));openAuth();return;} offerTarget=id; overlay.classList.add("show"); overlay.innerHTML=`<div class="modal modal-wrap"><button class="modal-close" onclick="closeOffer()">×</button><div style="font-size:44px;text-align:center">💎</div><h2 style="text-align:center">${t("offer_title")}</h2><p class="muted center" style="margin-bottom:14px">${t("offer_desc")}</p><div class="field"><label>${t("offer_price")} (${CUR_SYM[CUR]})</label><input id="offerPrice" type="number" min="0" inputmode="numeric" placeholder="0"></div><div class="field"><label>${t("offer_note")}</label><textarea id="offerNote" style="min-height:80px"></textarea></div><button class="btn btn-primary btn-block btn-lg" onclick="submitOffer()">${t("make_offer")}</button><button class="btn btn-ghost btn-block" style="margin-top:8px" onclick="closeOffer()">${t("got_it")}</button></div>`; }
function closeOffer(){ overlay.classList.remove("show"); overlay.innerHTML=""; offerTarget=null; }
async function submitOffer(){ if(!offerTarget)return; const l=findListing(offerTarget); if(!l)return; const price=document.getElementById("offerPrice").value; const note=document.getElementById("offerNote").value.trim(); const me=currentUser(); try{ await store.offerListing(offerTarget,price,note); if(l.owner&&l.owner.phone){ const txt=(LANG=="en"?"\U0001f4b0 New offer: ":"\U0001f4b0 عرض سعر جديد: ")+(price?(Number(price).toLocaleString("en-US")+" "+CUR_SYM[CUR]):t("at_call"))+(note?(" \u2014 "+note):""); fetch("/api/chat/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({from:me.phone,to:l.owner.phone,text:txt,lang:LANG})}); } closeOffer(); notify(t("offer_sent")); }catch(e){ notify(LANG=="en"?"Failed":"\u062a\u0639\u0630\u0631"); } }
function offersListHTML(offers){ return offers.slice().reverse().map(o=>`<div class="offer-row"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(o.name)}</b><span class="muted" style="font-size:12px">${relDate(new Date(o.ts).toISOString())}</span></div><div class="offer-price">${o.price?(Number(o.price).toLocaleString("en-US")+" "+CUR_SYM[CUR]):t("at_call")}</div>${o.note?`<div class="muted" style="font-size:13px;margin-top:2px">${esc(o.note)}</div>`:""}</div>`).join(""); }
function offersCard(l,owner){ const offers=l.offers||[]; const mine=currentUser()&&owner&&currentUser().id===owner.id; return `<div class="info-card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><h3>${t("offers_label")}</h3><span class="pill">${offers.length} ${t("offers_count")}</span></div><button class="btn btn-primary btn-block" onclick="openOffer('${l.id}')">${t("make_offer")}</button>${mine&&offers.length?`<div style="margin-top:14px">${offersListHTML(offers)}</div>`:(mine?`<p class="muted" style="margin-top:12px;font-size:13px">${t("no_offers")}</p>`:"")}</div>`; }

/* =========================================================================
   بطاقات الإعلانات + المفضلة
   ========================================================================= */
function listCardsHTML(list){
  if(!list.length) return `<div class="list-empty"><div class="big">📭</div><p>${LANG==="en"?"No listings":"لا توجد إعلانات"}</p></div>`;
  return list.map(l=>{const sec=findSection(l.section);const free=isFree(l);
    return `<div class="list-card ${promoActive(l)?'promo-card promo-'+l.promo:''}" onclick="go('detail',{id:'${l.id}'})"><div class="thumb">
      <img src="${thumbURL(l)}" alt=""><span class="deal-tag ${l.deal==='sell'?'deal-sell':'deal-buy'}">${locDeal(l)}</span>
      <button class="fav ${isFav(l.id)?'on':''}" onclick="event.stopPropagation();favToggle('${l.id}')">${isFav(l.id)?'❤️':'🤍'}</button>
      ${promoActive(l)?'<span class="promo-tag promo-tag-'+l.promo+'">'+({featured:"⭐",boost:"🚀",premium:"👑"}[l.promo])+'</span>':""}
      ${free?`<span class="free-tag">⏱️ ${t("free_tag")} • ${daysLeft(l)}${t("day")}</span>`:`<span class="paid-tag">👑 ${t("paid_tag")}</span>`}
      </div><div class="body"><div class="t">${esc(l.title)}${l.owner&&l.owner.verified?'<i class="vbadge">✔</i>':""}</div><div class="p">${esc(fmtPrice(l))}</div>
      <div class="meta"><span class="loc">${l.zone==='outside'?'🔴':'🟢'} ${esc(l.location)}</span><span class="vw">👁 ${l.views||0} • ${relDate(l.date)}</span></div></div></div>`;}).join("");
}
async function favToggle(id){
  if(!currentUser()){ notify(LANG==="en"?"Login to save favorites":"سجّل الدخول لحفظ المفضلة"); openAuth(); return; }
  const on = !isFav(id);
  try{ await store.setFav(id, on); render(); notify(on?t("added_fav"):t("removed_fav")); }catch(e){ notify(LANG==="en"?"Failed":"تعذّر"); }
}

/* =========================================================================
   6) تفاصيل الإعلان
   ========================================================================= */
let _viewLog={};
function logView(id){ const now=Date.now(); if(_viewLog[id] && now-_viewLog[id]<30000) return; _viewLog[id]=now; store.viewListing(id); const x=findListing(id); if(x) x.views=(x.views||0)+1; }
function viewDetail(id){
  const l=findListing(id); if(!l){go("home");return;}
  logView(id);
  const owner=l.owner||{}, sec=findSection(l.section), sub=findSub(l.section,l.sub), free=isFree(l);
  app.innerHTML=`<section class="section"><div class="wrap"><span class="back" onclick="go('home')">${t("back")}</span>
    <div class="detail-grid"><div>
      ${galleryHTML(l)}
      ${bannerLong()}
      ${sub&&sub.types.length?`<div class="info-card" style="margin-top:16px"><h3 style="margin-bottom:10px">${t("related_types")}</h3><div class="type-list">${sub.types.map(ty=>`<span class="type-chip" onclick="go('browse',{section:'${l.section}',sub:'${l.sub}',q:'${ty.replace(/'/g,"")}'}">${tData(ty)}</span>`).join("")}</div></div>`:""}
    </div><div class="detail-info">
      <div class="info-card"><div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap">
        <span class="pill" style="background:${l.deal==='sell'?'#dcfce7':'#dbeafe'};color:${l.deal==='sell'?'#16a34a':'#1d4ed8'}">${locDeal(l)}</span>
        ${free?`<span class="pill" style="background:#fef3c7;color:#92400e">⏱️ ${t("free_tag")} • ${t("free_remaining")} ${daysLeft(l)} ${t("day_word")}</span>`:`<span class="pill" style="background:#e2e8f0;color:#475569">👑 ${t("paid_tag")}</span>`}
      </div><h1>${esc(l.title)}</h1><div class="price">${esc(fmtPrice(l))}</div>
      <div class="tags"><span class="pill">${sec.icon} ${tData(sec.name)}</span>${sub?`<span class="pill">${sub.icon} ${tData(sub.name)}</span>`:""}${l.zone==='outside'?`<span class="pill" style="background:#dbeafe;color:#1d4ed8">🌐 ${t("zone_outside")}</span>`:`<span class="pill" style="background:#d1fae5;color:#047857">📍 ${t("zone_inside")}</span>`}${l.type?`<span class="pill">🏷️ ${tData(l.type)}</span>`:""}${l.brand?`<span class="pill">🏢 ${tData(l.brand)}</span>`:""}${l.model?`<span class="pill">🔢 ${esc(l.model)}</span>`:""}</div></div>
      <div class="info-card"><h3 style="margin-bottom:8px">${t("description")}</h3><p class="desc">${esc(l.desc||t("no_desc"))}</p>
        <div style="display:flex;justify-content:space-between;color:var(--muted);font-size:13px;margin-top:14px"><span>📍 ${esc(l.location)}</span><span>👁 ${l.views||0} ${t("views")}</span><span>🕒 ${relDate(l.date)}</span></div></div>
      ${offersCard(l,owner)}
      ${commentsCard(l,owner)}
      ${owner.name?`<div class="info-card"><h3 style="margin-bottom:12px">${t("publisher")}</h3>
        <div class="seller"><span class="avatar">${esc(userInitials(owner.name))}</span><div style="flex:1"><div class="nm">${owner.type==="dealer"?"<span class=\"dealer-pill\">🏛️ "+t("dealer")+"</span> ":""}<a onclick="go('store',{id:'${owner.id}'})" style="cursor:pointer;color:inherit">${esc(owner.name)}</a></div>
          <div class="stars">${starsHTML(owner.stars||0)} <span class="muted" style="font-size:12px">(${owner.deals||0} ${t("deals_count")})</span></div>
          ${owner.verified?`<div class="verified">${t("verified")}</div>`:""}</div></div>
        <p class="muted" style="font-size:13px;margin-top:10px">🌐 ${esc(showCountry(owner.country))}</p>
        <a class="btn btn-ghost btn-sm" style="margin-top:8px;display:inline-flex" onclick="go('store',{id:'${owner.id}'})">🏪 ${t("view_store")}</a>
        <div class="detail-cta">
          <button class="btn btn-primary" style="flex:1" onclick="openChatFromListing('${esc(owner.phone)}','${esc(owner.name).replace(/'/g,"")}')">${t("chat_now")}</button>
          <a class="btn btn-ghost" href="tel:${esc(owner.phone)}">📞 ${t("call")}</a>
          <a class="btn wa-btn" href="${waLink(owner.phone,l.title)}" target="_blank" rel="noopener">✅ ${t("whatsapp")}</a>
        </div>
        ${currentUser()&&owner&&owner.id===currentUser().id?`<button class="btn btn-ghost btn-block" style="margin-top:12px" onclick="go('edit',{id:'${l.id}'})">${t("edit_btn")}</button><button class="btn btn-primary btn-block" style="margin-top:8px" onclick="openPromote('${l.id}')">${t("promote_btn")}${promoActive(l)?" • "+t("promo_active"):""}</button>`:`<button class="btn btn-ghost btn-sm" style="margin-top:12px;width:100%;color:var(--muted)" onclick="openReport('${l.id}')">${t("report_ad")}</button>`}</div>`:""}
    </div></div></div></section>`;
}
function contactOwner(phone){
  if(!currentUser()){notify(LANG==="en"?"Login to contact":"سجّل الدخول للتواصل");openAuth();return;}
  notify("📱 "+(LANG==="en"?"Contact: ":"رقم التواصل: ")+(phone||""));
}

/* =========================================================================
   7) إضافة إعلان
   ========================================================================= */
let addForm={deal:"sell",section:"",sub:"",zone:"inside"};
let editTarget=null, imagePicks=[];
function viewEdit(id){ const l=findListing(id); if(!l){go("home");return;} if(!currentUser()||currentUser().id!==l.user){notify(t("edit_only_owner"));return;} editTarget=id; addForm={deal:l.deal||"sell",section:l.section||"",sub:l.sub||"",zone:l.zone||"inside"}; imagePicks=(l.images&&l.images.length?l.images:(l.img?[l.img]:[])).map(u=>({url:u,preview:u})); drawAdd(); }
function viewAdd(){ if(!currentUser()){notify(LANG==="en"?"Login to add":"سجّل الدخول لإضافة إعلان");openAuth();return;} editTarget=null; addForm={deal:"sell",section:"",sub:"",zone:"inside"}; imagePicks=[]; drawAdd(); }
function drawAdd(){
  const _draft=document.getElementById("fTitle")?_preserveFields():null;
  const sec=findSection(addForm.section), sub=addForm.sub?findSub(addForm.section,addForm.sub):null;
  app.innerHTML=`<section class="section"><div class="wrap"><span class="back" onclick="go('home')">${t("back")}</span>
    <div class="form-card"><h2 style="margin-bottom:6px">${editTarget?t("edit_listing"):t("add_title")}</h2><p class="muted" style="margin-bottom:18px">${t("add_note")}</p>
      <div class="note-free">${t("add_banner_note")}</div>
      <div class="field full"><label>${t("deal_type")} <span class="req">${t("req")}</span></label>
        <div class="deal-toggle" style="background:#f1f5f9">
          <button type="button" class="${addForm.deal==='sell'?'active':''}" onclick="setDeal('sell')" style="${addForm.deal==='sell'?'background:var(--green)':'color:var(--muted)'}">${t("deal_sell")}</button>
          <button type="button" class="${addForm.deal==='buy'?'active':''}" onclick="setDeal('buy')" style="${addForm.deal==='buy'?'background:var(--blue)':'color:var(--muted)'}">${t("deal_buy")}</button>
        </div></div>
      <div class="form-grid">
        <div class="field"><label>${t("f_section")} <span class="req">${t("req")}</span></label><select onchange="setSection(this.value)"><option value="">${t("f_choose_section")}</option>${CATEGORIES.map(c=>`<option value="${c.id}" ${c.id===addForm.section?'selected':''}>${c.icon} ${tData(c.name)}</option>`).join("")}</select></div>
        <div class="field"><label>${t("f_sub")} <span class="req">${t("req")}</span></label><select onchange="addForm.sub=this.value;drawAdd()" ${!sec?'disabled':''}><option value="">${sec?t("f_choose_sub"):t("f_section_first")}</option>${sec?sec.subs.map(s=>`<option value="${s.id}" ${s.id===addForm.sub?'selected':''}>${s.icon} ${tData(s.name)}</option>`).join(""):""}</select></div>
      </div>
      ${sec?`<div class="field full"><label>${t("zone_label")} <span class="req">${t("req")}</span></label>
        <p class="muted" style="font-size:12px;margin-bottom:8px">${t("zone_pick")}</p>
        <div class="deal-toggle" style="background:#f1f5f9">
          <button type="button" class="${addForm.zone==='inside'?'active':''}" onclick="setZone('inside')" style="${addForm.zone==='inside'?'background:var(--teal)':'color:var(--muted)'}">${t("zone_inside")}</button>
          <button type="button" class="${addForm.zone==='outside'?'active':''}" onclick="setZone('outside')" style="${addForm.zone==='outside'?'background:var(--purple)':'color:var(--muted)'}">${t("zone_outside")}</button>
        </div></div>`:""}
      ${sub?`<div class="form-grid"><div class="field"><label>${t("f_type")}</label><select id="fType"><option value="">${t("f_pick")}</option>${sub.types.map(ty=>`<option value="${esc(ty)}">${tData(ty)}</option>`).join("")}</select></div>
        <div class="field"><label>${t("f_brand")}</label><select id="fBrand" ${!sub.brands.length?'disabled':''}><option value="">${sub.brands.length?t("f_pick"):t("not_avail")}</option>${sub.brands.map(b=>`<option value="${esc(b)}">${tData(b)}</option>`).join("")}</select></div></div>`:""}
      <div class="field full"><label>${t("f_title")} <span class="req">${t("req")}</span></label><input id="fTitle" placeholder="${t("f_title_ph")}"></div>
      ${addForm.zone==='outside'
        ? `<div class="form-grid"><div class="field"><label>${addForm.deal==='buy'?t("f_budget"):t("f_price")}</label><input id="fPrice" type="number" min="0" placeholder="0"></div>
             <div class="field"><label>${t("offer_address")} <span class="req">${t("req")}</span></label><input id="fLoc" placeholder="${t("offer_address_ph")}"></div></div>`
        : `<div class="field"><label>${addForm.deal==='buy'?t("f_budget"):t("f_price")}</label><input id="fPrice" type="number" min="0" placeholder="0"></div>
             <input type="hidden" id="fLoc" value="${t("zone_inside")}">`
      }
      <div class="field full"><label>${t("f_model")}</label><input id="fModel" placeholder="${t("f_model_ph")}"></div>
      <div class="field full"><label>${t("f_desc")}</label><textarea id="fDesc" placeholder="${t("f_desc_ph")}"></textarea></div>
      <div class="field full"><label>${t("f_images")} <span class="muted" style="font-weight:400">(<span id="imgCount">${imagePicks.length}</span>/4)</span></label>
        <div id="imgSlots" class="img-slots"></div>
        <input id="fImg" type="file" accept="image/jpeg,image/png,image/webp,image/*" multiple style="display:none" onchange="onImgPick(this)">
        <button type="button" id="addImgBtn" class="btn btn-ghost btn-sm" onclick="document.getElementById('fImg').click()">${t("add_image")}</button>
        <p class="muted" style="font-size:12px;margin-top:6px">${t("images_hint")}</p></div>
      <div class="field full"><label>${t("video_field")}</label><input id="fVideo" type="file" accept="video/*"></div>
      <button class="btn btn-primary btn-block btn-lg" id="publishBtn" onclick="${editTarget?("submitEdit('"+editTarget+"')"):"submitListing()"}">${editTarget?t("save_edit"):t("publish_free")}</button>
    </div></div></section>`;
  if(_draft){ _restoreFields(_draft); }
  else if(editTarget){ const e=findListing(editTarget); const set=(id,v)=>{const el=document.getElementById(id); if(el) el.value=v;};
    set("fTitle",e.title||""); set("fPrice",e.price||""); set("fModel",e.model||""); set("fDesc",e.desc||""); set("fLoc",e.location||"");
    const tt=document.getElementById("fType"); if(tt&&e.type) tt.value=e.type;
    const bb=document.getElementById("fBrand"); if(bb&&e.brand) bb.value=e.brand; }
  renderImgSlots();
}
function _preserveFields(){ const g=id=>{const e=document.getElementById(id);return e?e.value:"";}; return {fTitle:g("fTitle"),fPrice:g("fPrice"),fModel:g("fModel"),fDesc:g("fDesc"),fLoc:g("fLoc"),fType:g("fType"),fBrand:g("fBrand")}; }
function _restoreFields(v){ const s=(id,val)=>{const e=document.getElementById(id); if(e&&val!=null)e.value=val;}; s("fTitle",v.fTitle);s("fPrice",v.fPrice);s("fModel",v.fModel);s("fDesc",v.fDesc);s("fLoc",v.fLoc);s("fType",v.fType);s("fBrand",v.fBrand); }

/* صور متعددة + معرض + تعديل */
function onImgPick(input){
  const remaining=4-imagePicks.length; if(remaining<=0){ notify(t("img_max")); return; }
  const files=[...input.files].slice(0,remaining);
  for(const f of files){ imagePicks.push({file:f, preview:URL.createObjectURL(f)}); }
  input.value=""; renderImgSlots();
}
function renderImgSlots(){
  const c=document.getElementById("imgSlots"); if(!c) return;
  c.innerHTML=imagePicks.map((p,i)=>`<div class="img-slot"><img src="${p.preview||p.url||""}" alt=""><span class="img-slot-n">${i+1}</span>${i===0?`<span class="main-tag">${t("main_img")}</span>`:""}${i>0?`<button type="button" class="img-slot-act" onclick="setMainImg(${i})" title="${t("make_main")}">⭐</button>`:""}<button type="button" class="img-slot-del" onclick="removeImg(${i})">×</button></div>`).join("");
  const cn=document.getElementById("imgCount"); if(cn) cn.textContent=imagePicks.length;
  const ab=document.getElementById("addImgBtn"); if(ab) ab.style.display=imagePicks.length<4?"":"none";
}
function removeImg(i){ imagePicks.splice(i,1); renderImgSlots(); }
function setMainImg(i){ if(i<=0) return; const [it]=imagePicks.splice(i,1); imagePicks.unshift(it); renderImgSlots(); }
function drawAdd_keepPicks(){ /* re-render form keeping current imagePicks + addForm state without resetting */ drawAdd(); }
async function resolvePicks(){ const out=[]; for(const p of imagePicks){ if(p.url) out.push(p.url); else if(p.file){ try{ out.push(await store.uploadImage(p.file)); }catch(e){} } } return out; }
async function submitEdit(id){
  const title=document.getElementById("fTitle").value.trim();
  if(!title){notify(t("f_title"));return;}
  const btn=document.getElementById("publishBtn"); btn.disabled=true; btn.textContent=LANG=="en"?"Saving…":"جارٍ الحفظ…";
  const vidEl=document.getElementById("fVideo"), vfile=vidEl&&vidEl.files&&vidEl.files[0];
  if(vfile && vfile.size>8*1024*1024){ btn.disabled=false; btn.textContent=t("save_edit"); notify(t("video_too_big")); return; }
  let images=[]; try{ images=await resolvePicks(); }catch(e){}
  try{
    await store.updateListing(id,{deal:addForm.deal,section:addForm.section,sub:addForm.sub,
      type:document.getElementById("fType")?.value||"",brand:document.getElementById("fBrand")?.value||"",
      model:document.getElementById("fModel").value.trim(),title,price:document.getElementById("fPrice").value,
      zone:addForm.zone,location:document.getElementById("fLoc").value.trim(),desc:document.getElementById("fDesc").value.trim(),images,videoFile:vfile});
    notify(t("edited_ok")); editTarget=null; imagePicks=[]; go("detail",{id});
  }catch(e){ btn.disabled=false; btn.textContent=t("save_edit"); notify(LANG=="en"?"Failed":"تعذّر الحفظ"); }
}
/* معرض متعدد الصور */
let _galImgs=[], _galIdx=0;
function galleryHTML(l){
  const imgs=(l.images&&l.images.length)?l.images.slice():(l.img?[l.img]:[]);
  window._galImgs=imgs; window._galIdx=0;
  if(l.video){ return `<div class="gallery"><div class="main"><video src="${l.video}" controls playsinline preload="metadata" style="width:100%;height:100%;object-fit:cover;background:#000"></video></div>${imgs.length?`<div class="gal-thumbs">${imgs.map((s,i)=>`<img class="gal-thumb" src="${s}" onclick="galSelect(${i})">`).join("")}</div>`:""}</div>`; }
  if(!imgs.length){ return `<div class="gallery"><div class="main"><img src="${thumbURL(l)}" alt=""></div></div>`; }
  return `<div class="gallery"><div class="main"><img id="galMain" src="${imgs[0]}" alt="">${imgs.length>1?`<span class="gal-count">1/${imgs.length}</span><button class="gal-arrow prev" onclick="galStep(-1)">‹</button><button class="gal-arrow next" onclick="galStep(1)">›</button>`:""}</div>${imgs.length>1?`<div class="gal-thumbs">${imgs.map((s,i)=>`<img class="gal-thumb ${i===0?"active":""}" src="${s}" onclick="galSelect(${i})">`).join("")}</div>`:""}</div>`;
}
function galSelect(i){ _galIdx=i; _galRender(); }
function galStep(d){ if(!_galImgs.length) return; _galIdx=(_galIdx+d+_galImgs.length)%_galImgs.length; _galRender(); }
function _galRender(){ const m=document.getElementById("galMain"); if(m) m.src=_galImgs[_galIdx]; const c=document.querySelector(".gal-count"); if(c) c.textContent=(_galIdx+1)+"/"+_galImgs.length; document.querySelectorAll(".gal-thumb").forEach((th,i)=>th.classList.toggle("active",i===_galIdx)); }

function setDeal(d){addForm.deal=d;drawAdd();}
function setSection(id){addForm.section=id;addForm.sub="";drawAdd();}
function setZone(z){addForm.zone=z;drawAdd();}
async function submitListing(){
  const title=document.getElementById("fTitle").value.trim();
  if(!addForm.section){notify(t("f_choose_section"));return;}
  if(!addForm.sub){notify(t("f_choose_sub"));return;}
  if(!title){notify(t("f_title"));return;}
  if(addForm.zone==="outside"&&!document.getElementById("fLoc").value.trim()){notify(t("offer_address"));return;}
  const btn=document.getElementById("publishBtn"); btn.disabled=true; btn.textContent=LANG==="en"?"Publishing…":"جارٍ النشر…";
  const vidEl=document.getElementById("fVideo"), vfile=vidEl&&vidEl.files&&vidEl.files[0];
  if(vfile && vfile.size>8*1024*1024){ btn.disabled=false; btn.textContent=t("publish_free"); notify(t("video_too_big")); return; }
  let images=[], imgFailed=false;
  try{ images=await resolvePicks(); if(imagePicks.length && images.length<imagePicks.length) imgFailed=true; }catch(e){ imgFailed=true; }
  try{
    const l=await store.createListing({deal:addForm.deal,section:addForm.section,sub:addForm.sub,
      type:document.getElementById("fType")?.value||"",brand:document.getElementById("fBrand")?.value||"",
      model:document.getElementById("fModel").value.trim(),title,price:document.getElementById("fPrice").value,
      zone:addForm.zone,location:document.getElementById("fLoc").value.trim(),desc:document.getElementById("fDesc").value.trim(),images,videoFile:vfile});
    notify(LANG==="en"?"Published ✓ (free 3 months)":"تم نشر إعلانك بنجاح ✓ (مجاني 3 أشهر)");
    if(l&&l._imgFailed){ setTimeout(()=>notify(LANG=="en"?"Image upload failed (try JPG)":"تعذّر رفع الصورة — جرّب صيغة JPG"),900); }
    imagePicks=[]; editTarget=null;
    go("detail",{id:l.id});
  }catch(e){ btn.disabled=false; btn.textContent=t("publish_free"); notify(LANG==="en"?"Failed to publish":"تعذّر النشر"); }
}

/* =========================================================================
   8) حسابي
   ========================================================================= */
function viewAccount(){
  const u=currentUser();
  if(!u){app.innerHTML=`<section class="section"><div class="wrap center"><div class="form-card" style="max-width:420px"><div class="big" style="font-size:60px">🔒</div><h2 style="margin:10px 0">${t("acc_login_title")}</h2><p class="muted" style="margin-bottom:18px">${t("acc_login_desc")}</p><button class="btn btn-primary btn-block btn-lg" onclick="openAuth()">${t("login")}</button></div></div></section>`;return;}
  const mine=userListings(u.id), freeCount=mine.filter(isFree).length, totalViews=mine.reduce((a,l)=>a+(l.views||0),0);
  app.innerHTML=`<section class="section"><div class="wrap">
    <div class="profile-head"><span class="avatar">${esc(userInitials(u.name))}</span>
      <div style="flex:1"><h2>${esc(u.name)} ${u.verified?`<span style="font-size:14px;opacity:.8">${t("verified")}</span>`:""}</h2>
        <div class="ph">${esc(showCountry(u.country))} • ${esc(u.phone)}</div>
        <div class="stars" style="margin-top:6px">${starsHTML(u.stars)} <span style="font-size:13px;opacity:.85">${u.deals} ${t("deals_count")}</span></div></div>
      <button class="btn btn-ghost" onclick="doLogout()">${t("logout")}</button></div>
    <div class="stat-row"><div class="stat-box"><b>${mine.length}</b><span>${t("my_ads")}</span></div><div class="stat-box"><b>${freeCount}</b><span>${t("my_free")}</span></div><div class="stat-box"><b>${u.stars||0}/5</b><span>${t("my_rating")}</span></div><div class="stat-box"><b>${u.deals}</b><span>${t("my_deals")}</span></div><div class="stat-box"><b>${totalViews}</b><span>${t("my_views")}</span></div></div>
    ${accountTypeCard(u)}
    <div class="info-card" style="max-width:none"><h3 style="margin-bottom:12px">${t("saved_searches")}</h3>${savedSearches.length?`<div class="saved-list">${savedSearches.map((s,i)=>{const n=savedNewCount(s);return `<div class="saved-item" onclick="goSaved(${i})"><span style="flex:1">${esc(searchLabel(s))}</span>${n?`<span class="ci-badge">${n} ${t("new_results")}</span>`:""}<button class="saved-del" onclick="event.stopPropagation();delSavedSearch(${i})">×</button></div>`;}).join("")}</div>`:`<p class="muted" style="font-size:13px">${t("no_saved_search")}</p>`}</div>
    <div class="sec-head"><h2>${t("my_listings")}</h2><button class="btn btn-primary" onclick="go('add')">${t("add_listing")}</button></div>
    ${mine.length?`<div class="list-grid">${listCardsHTML(mine)}</div>`:`<div class="list-empty"><div class="big">📭</div><p>${t("no_listings")}</p><button class="btn btn-primary" style="margin-top:14px" onclick="go('add')">${t("add_first")}</button></div>`}
    <div class="rating-legend" style="margin-top:24px"><h3>${t("rating_me")}</h3>
      <div class="rt-row"><span class="s">${t("exp_label")}</span><div class="bar"><i style="width:${Math.min(100,u.deals/150*100)}%"></i></div><span class="d">${u.deals} ${t("deals_count")}</span></div>
      <div class="rt-row"><span class="s">${t("trust_label")}</span><div class="bar"><i style="width:${u.stars/5*100}%"></i></div><span class="d">${u.stars} / 5</span></div>
      <div class="rt-row"><span class="s">${t("wthq_label")}</span><div class="bar"><i style="width:${u.verified?100:30}%"></i></div><span class="d">${u.verified?t("wthq_done"):t("wthq_wait")}</span></div></div>
    <div class="info-card" style="max-width:none"><h3 style="margin-bottom:10px">${t("plans_title")}</h3><p class="muted">${t("plans_desc")}</p>
      <div class="sub-grid" style="margin-top:14px">
        ${[["basic",t("plan_basic"),PLANS.basic.price,t("plan_basic_d"),"#64748b"],["featured",t("plan_featured"),PLANS.featured.price,t("plan_feat_d"),"var(--gold)"],["pro",t("plan_pro"),PLANS.pro.price,t("plan_pro_d"),"var(--purple)"]].map(p=>`<div class="sub-card plan-card" onclick="openCheckout('${p[0]}')"><div class="ico" style="color:${p[4]}">$${p[2]}</div><h4>${p[1]}</h4><div class="cnt">${p[3]}</div></div>`).join("")}
      </div></div>
  </div></section>`;
}
async function doLogout(){ await store.logout(); go("home"); notify(LANG==="en"?"Logged out":"تم تسجيل الخروج"); }

/* =========================================================================
   9) المفضلة
   ========================================================================= */
function viewFavorites(){
  const favs=[...state.favorites].map(findListing).filter(Boolean);
  app.innerHTML=`<section class="section"><div class="wrap"><div class="sec-head"><h2>${t("fav_title")}</h2></div>
    ${favs.length?`<div class="list-grid">${listCardsHTML(favs)}</div>`:`<div class="list-empty"><div class="big">❤️</div><p>${t("no_fav")}</p><button class="btn btn-primary" style="margin-top:14px" onclick="go('home')">${t("browse_ads")}</button></div>`}
  </div></section>`;
}

/* =========================================================================
   10) لوحة تحكم المدير
   ========================================================================= */
async function viewAdmin(){
  if(!isAdmin()){ app.innerHTML=adminLoginView(); return; }
  const tab=route.params.tab||"listings";
  app.innerHTML=`<section class="section"><div class="wrap"><div class="center muted" style="padding:40px">⏳</div></div></section>`;
  let stats={listings:0,users:0,featured:0,revenue:0};
  try{ stats=await store.adminStats(); }catch(e){}
  if(tab==="users"){ try{ await store.refreshUsers(); }catch(e){} }
  if(tab==="news"){ try{ await store.refreshNews(); }catch(e){} }
  app.innerHTML=`<section class="section"><div class="wrap">
    <div class="sec-head"><h2>${t("admin_title")}</h2><button class="btn btn-ghost" onclick="doAdminLogout()">${t("logout")}</button></div>
    <div class="stat-row">
      <div class="stat-box"><b>${stats.listings}</b><span>${t("admin_stats_listings")}</span></div>
      <div class="stat-box"><b>${stats.users}</b><span>${t("admin_stats_users")}</span></div>
      <div class="stat-box"><b>${stats.featured}</b><span>${t("admin_stats_featured")}</span></div>
      <div class="stat-box"><b>$${stats.revenue}</b><span>${t("admin_stats_revenue")}</span></div>
    </div>
    <div class="tabs" style="margin-bottom:18px">
      <button class="${tab==='listings'?'active':''}" onclick="go('admin',{tab:'listings'})">${t("admin_tab_listings")}</button>
      <button class="${tab==='users'?'active':''}" onclick="go('admin',{tab:'users'})">${t("admin_tab_users")}</button>
      <button class="${tab==='banners'?'active':''}" onclick="go('admin',{tab:'banners'})">${t("admin_tab_banners")}</button>
      <button class="${tab==='news'?'active':''}" onclick="go('admin',{tab:'news'})">${t("admin_tab_news")}</button>
    </div>
    ${tab==="listings"?adminListings():tab==="users"?adminUsers():tab==="news"?adminNews():adminBanners()}
  </div></section>`;
}
function adminLoginView(){
  return `<section class="section"><div class="wrap"><div class="form-card" style="max-width:420px;margin:40px auto">
    <h2 style="margin-bottom:6px">${t("admin_login_t")}</h2><p class="muted" style="margin-bottom:18px">${t("admin_hint")}</p>
    <div class="field"><label>${t("admin_pass")}</label><input id="adminPass" type="password" placeholder="${t("admin_pass_ph")}" onkeydown="if(event.key==='Enter')doAdminLogin()"></div>
    <button class="btn btn-primary btn-block btn-lg" onclick="doAdminLogin()">${t("admin_enter")}</button>
    <span class="back" style="margin-top:18px" onclick="go('home')">${t("back")}</span></div></div></section>`;
}
async function doAdminLogin(){
  if(await store.adminLogin(document.getElementById("adminPass").value)){ notify(LANG==="en"?"Welcome admin":"أهلاً أيها المدير"); render(); }
  else notify(LANG==="en"?"Wrong password":"كلمة المرور خاطئة");
}
function doAdminLogout(){ store.adminLogout(); go("home"); }
function adminListings(){
  return `<div class="admin-table">${allListings().map(l=>{const sec=findSection(l.section);
    return `<div class="admin-row"><div class="ar-main"><b>${esc(l.title)}</b><span class="muted">${sec.icon} ${tData(sec.name)} • ${locDeal(l)} • ${fmtPrice(l)}</span><span class="muted" style="font-size:12px">${esc(l.owner?.name||"—")} • ${relDate(l.date)}</span></div>
      <div class="ar-actions"><button class="btn btn-ghost btn-sm" onclick="doToggleFeature('${l.id}')">${l.featured?"⭐ "+t("admin_unfeature"):"☆ "+t("admin_feature")}</button><button class="btn btn-ghost btn-sm danger" onclick="doDelListing('${l.id}')">🗑 ${t("admin_delete")}</button></div></div>`;}).join("")}</div>`;
}
function adminUsers(){
  return `<div class="admin-table">${state.users.map(u=>`
    <div class="admin-row"><div class="ar-main"><b>${esc(u.name)} ${u.verified?'✔':''}</b><span class="muted">${esc(showCountry(u.country))} • ${esc(u.phone)}</span><span class="muted" style="font-size:12px">${u.deals} ${t("deals_count")}</span></div>
      <div class="ar-actions"><div class="star-input">${[1,2,3,4,5].map(n=>`<span class="${n<=u.stars?'on':''}" onclick="doSetStars('${u.id}',${n})">★</span>`).join("")}</div>
        <button class="btn btn-ghost btn-sm" onclick="doToggleVerified('${u.id}')">${u.verified?t("admin_inactive"):t("admin_active")}</button><button class="btn btn-ghost btn-sm danger" onclick="doDelUser('${u.id}')">🗑</button></div></div>`).join("")}</div>`;
}
function adminBanners(){
  const L=getBanner("long"), S=getBanner("square"), SP=getBanner("splash")||{active:false,link:""};
  return `<div class="form-grid">
    <div class="info-card"><h3 style="margin-bottom:12px">${t("admin_banner_long")}</h3>
      <div class="field"><label>${LANG==="en"?"Text (AR)":"النص (عربي)"}</label><input id="bn_long_ar" value="${esc(L.text_ar)}"></div>
      <div class="field"><label>${LANG==="en"?"Text (EN)":"النص (إنجليزي)"}</label><input id="bn_long_en" value="${esc(L.text_en)}"></div>
      <div class="field"><label>${t("admin_link")}</label><input id="bn_long_link" value="${esc(L.link)}"></div>
      <button class="btn btn-primary" onclick="doSaveBanner('long')">${t("admin_save")}</button>
      <button class="btn btn-ghost" style="margin-inline-start:8px" onclick="doToggleBanner('long')">${L.active?t("admin_inactive"):t("admin_active")}</button></div>
    <div class="info-card"><h3 style="margin-bottom:12px">${t("admin_banner_square")}</h3>
      <div class="field"><label>${LANG==="en"?"Text (AR)":"النص (عربي)"}</label><input id="bn_square_ar" value="${esc(S.text_ar)}"></div>
      <div class="field"><label>${LANG==="en"?"Text (EN)":"النص (إنجليزي)"}</label><input id="bn_square_en" value="${esc(S.text_en)}"></div>
      <div class="field"><label>${t("admin_link")}</label><input id="bn_square_link" value="${esc(S.link)}"></div>
      <button class="btn btn-primary" onclick="doSaveBanner('square')">${t("admin_save")}</button>
      <button class="btn btn-ghost" style="margin-inline-start:8px" onclick="doToggleBanner('square')">${S.active?t("admin_inactive"):t("admin_active")}</button></div>
    <div class="info-card"><h3 style="margin-bottom:12px">${t("admin_banner_splash")}</h3>
      <p class="muted" style="font-size:12.5px;margin-bottom:10px">${t("splash_note")}</p>
      <div class="field"><label>${t("admin_link")}</label><input id="bn_splash_link" value="${esc(SP.link)}"></div>
      <button class="btn btn-primary" onclick="doSaveBanner('splash')">${t("admin_save")}</button>
      <button class="btn btn-ghost" style="margin-inline-start:8px" onclick="doToggleBanner('splash')">${SP.active?t("admin_inactive"):t("admin_active")}</button></div>
  </div>`;
}
/* ---- الشريط الإخباري (إدارة المدير) ---- */
function adminNews(){
  const list=state.news||[];
  return `<div class="info-card" style="max-width:none">
    <h3 style="margin-bottom:6px">📰 ${t("manage_news")}</h3>
    <p class="muted" style="font-size:13px;margin-bottom:14px">${t("news_admin_hint")}</p>
    <div class="form-grid">
      <div class="field" style="flex:2"><label>${t("news_text")} <span class="req">${t("req")}</span></label><input id="nwText" placeholder="${t("news_text_ph")}" onkeydown="if(event.key==='Enter')document.getElementById('nwLink').focus()"></div>
      <div class="field" style="flex:1"><label>${t("news_link")}</label><input id="nwLink" placeholder="${t("news_link_ph")}" onkeydown="if(event.key==='Enter')doAddNews()"></div>
    </div>
    <button class="btn btn-primary" style="margin-top:10px" onclick="doAddNews()">➕ ${t("add_news")}</button>
    <div class="admin-table" style="margin-top:20px">
      ${list.length?list.map(n=>`<div class="admin-row"><div class="ar-main"><b>📰 ${esc(n.text)}</b>${n.link?`<span class="muted" style="font-size:12px">🔗 ${esc(n.link)}</span>`:""}<span class="muted" style="font-size:12px">🕐 ${newsTime(n.ts)} • ${t("news_ttl")}</span></div>
        <div class="ar-actions"><button class="btn btn-ghost btn-sm" onclick="doToggleNews('${n.id}')">${n.active!==false?"🟢 "+t("admin_active"):"⚫ "+t("admin_inactive")}</button><button class="btn btn-ghost btn-sm danger" onclick="doDelNews('${n.id}')">🗑 ${t("admin_delete")}</button></div></div>`).join(""):`<p class="muted center" style="padding:20px">${t("news_empty")}</p>`}
    </div>
  </div>`;
}
function newsOpFail(e){ if(e&&e.status===403){ store.adminLogout(); notify(t("admin_expired")); go("admin"); } else notify(t("news_op_fail")); }
async function doAddNews(){ const text=document.getElementById("nwText").value.trim(); if(!text){notify(t("news_text"));return;} const link=document.getElementById("nwLink").value.trim(); try{ await store.addNews(text,link); notify(t("news_added")); _tickerSig=""; renderTicker(); render(); }catch(e){ newsOpFail(e); } }
async function doDelNews(id){ try{ await store.deleteNews(id); notify(t("news_deleted")); _tickerSig=""; renderTicker(); render(); }catch(e){ newsOpFail(e); } }
async function doToggleNews(id){ try{ await store.toggleNews(id); _tickerSig=""; renderTicker(); render(); }catch(e){ newsOpFail(e); } }

/* إجراءات الإدارة (غير متزامنة) */
async function doToggleFeature(id){ try{ await store.toggleFeatured(id); render(); }catch(e){ notify(LANG==="en"?"Failed":"تعذّر"); } }
async function doDelListing(id){ try{ await store.deleteListing(id); render(); notify(LANG==="en"?"Deleted":"تم الحذف"); }catch(e){ notify(LANG==="en"?"Failed":"تعذّر"); } }
async function doSetStars(id,n){ try{ await store.setUserStars(id,n); const u=state.users.find(x=>x.id===id); if(u) u.stars=n; render(); }catch(e){} }
async function doToggleVerified(id){ try{ const v=await store.toggleVerified(id); const u=state.users.find(x=>x.id===id); if(u) u.verified=v; render(); }catch(e){} }
async function doDelUser(id){ try{ await store.deleteUser(id); render(); notify(LANG==="en"?"Deleted":"تم الحذف"); }catch(e){} }
async function doSaveBanner(id){
  const cur=getBanner(id)||{};
  const val=k=>{ const el=document.getElementById("bn_"+id+"_"+k); return el?el.value:(cur[k]||""); };
  try{ await store.updateBanner(id,{text_ar:val("ar"),text_en:val("en"),link:val("link")}); notify(LANG==="en"?"Saved ✓":"تم الحفظ ✓"); render(); }catch(e){}
}
async function doToggleBanner(id){ const b=getBanner(id); try{ await store.updateBanner(id,{active:!(b&&b.active)}); render(); }catch(e){} }

/* =========================================================================
   11) بوابة الدفع (Stripe حقيقية / وضع تجريبي)
   ========================================================================= */
function openCheckout(planId){
  const plan=PLANS[planId]; if(!plan) return;
  overlay.classList.add("show");
  overlay.innerHTML=`<div class="modal modal-wrap"><button class="modal-close" onclick="closeCheckout()">×</button>
    <h2>${t("checkout_title")}</h2>
    <div class="checkout-plan"><span>${t("checkout_plan")}: <b>${planId==="basic"?t("plan_basic"):planId==="featured"?t("plan_featured"):t("plan_pro")}</b></span><span class="price-big">$${plan.price}</span></div>
    <div id="payArea"><div class="center muted" style="padding:30px">⏳</div></div></div>`;
  drawCheckoutForm(plan);
}
function closeCheckout(){ overlay.classList.remove("show"); overlay.innerHTML=""; }
function drawCheckoutForm(plan){
  const real = stripeCfg && stripeCfg.stripePK; const note = real? t("pay_real_note") : t("pay_demo_note");
  document.getElementById("payArea").innerHTML=`<p class="pay-note">${note}</p>
    <div class="field"><label>${t("card_number")}</label><input id="ccNum" inputmode="numeric" placeholder="4242 4242 4242 4242" maxlength="19" oninput="formatCard(this)"></div>
    <div class="form-grid"><div class="field"><label>${t("card_expiry")}</label><input id="ccExp" placeholder="MM / YY" maxlength="7" oninput="formatExp(this)"></div>
      <div class="field"><label>${t("card_cvc")}</label><input id="ccCvc" inputmode="numeric" placeholder="123" maxlength="4"></div></div>
    <button class="btn btn-primary btn-block btn-lg" id="payBtn" onclick="processPayment('${plan.id}')">${t("pay_now")} — $${plan.price}</button>
    <div class="pay-badges">🔒 SSL &nbsp;•&nbsp; <b>Stripe</b> &nbsp;•&nbsp; 💳 Visa / Mastercard</div>`;
}
function formatCard(el){ let v=el.value.replace(/\D/g,"").slice(0,16); el.value=v.match(/.{1,4}/g)?.join(" ")||""; }
function formatExp(el){ let v=el.value.replace(/\D/g,"").slice(0,4); if(v.length>=3) v=v.slice(0,2)+" / "+v.slice(2); el.value=v; }
async function processPayment(planId){
  const plan=PLANS[planId]; const num=document.getElementById("ccNum").value.replace(/\s/g,"");
  if(num.length<12){ notify(LANG==="en"?"Invalid card":"رقم البطاقة غير صالح"); return; }
  const btn=document.getElementById("payBtn"); btn.disabled=true; btn.textContent=t("processing");
  if(stripeCfg && stripeCfg.stripePK){
    try{ await fetch("/api/create-payment-intent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:plan.price,plan:planId})}); }catch(e){}
    await new Promise(res=>setTimeout(res,1400));
  } else { await new Promise(res=>setTimeout(res,1500)); }
  try{ await store.recordPayment(planId, plan.price); }catch(e){}
  closeCheckout(); notify(t("pay_success")); if(route.name==="account") render();
}

/* =========================================================================
   12) المحادثات المباشرة بين المشتري والبائع
   ========================================================================= */
let chatPoll=null, unreadCount=0, chatPeer=null, convoLoaded=false, lastSeenIncomingTs=0, lastGlobalUnread=0, audioCtx=null;
const BASE_TITLE=document.title;
let chatNames = JSON.parse(localStorage.getItem("fz_chat_names")||"{}");
function rememberName(phone,name){ if(phone&&name){ chatNames[phone]=name; localStorage.setItem("fz_chat_names",JSON.stringify(chatNames)); } }
function nameFor(phone){ return chatNames[phone] || phone; }
function stopChatPoll(){ if(chatPoll){ clearInterval(chatPoll); chatPoll=null; } }

function viewChat(p){
  const me=currentUser();
  if(!me){ app.innerHTML=`<section class="section"><div class="wrap center"><div class="form-card" style="max-width:420px"><div class="big" style="font-size:60px">💬</div><h2 style="margin:10px 0">${t("start_chat_login")}</h2><button class="btn btn-primary btn-block btn-lg" onclick="openAuth()">${t("login")}</button></div></div></section>`; return; }
  if(p.peer){ openConvo(p.peer, p.name); } else { renderInbox(); }
}
function openChatFromListing(phone,name){ if(!currentUser()){ notify(t("start_chat_login")); openAuth(); return; } go("chat",{peer:phone,name:name}); }

async function renderInbox(){
  const me=currentUser();
  app.innerHTML=`<section class="section"><div class="wrap"><div class="sec-head"><h2>${t("inbox")}</h2></div><div id="inboxList" class="chat-inbox"><div class="center muted" style="padding:30px">…</div></div></div></section>`;
  try{
    const r=await fetch("/api/chat/inbox?user="+encodeURIComponent(me.phone)); const d=await r.json();
    const list=document.getElementById("inboxList"); const convos=d.conversations||[];
    if(!convos.length){ list.innerHTML=`<div class="list-empty"><div class="big">💬</div><p>${t("no_chats")}</p><button class="btn btn-primary" style="margin-top:14px" onclick="go('home')">${t("browse_ads")}</button></div>`; return; }
    list.innerHTML=convos.map(c=>`<div class="chat-inbox-item" onclick="openConvo('${c.peer}','${esc(nameFor(c.peer)).replace(/'/g,"")}')">
      <span class="avatar">${esc(userInitials(nameFor(c.peer)))}</span><div class="ci-main">
      <div class="ci-top"><b>${esc(nameFor(c.peer))}</b>${c.unread?`<span class="ci-badge">${c.unread}</span>`:""}<span class="ci-time">${relDate(new Date(c.ts).toISOString())}</span></div>
      <div class="ci-last ${c.unread?"unread":""}">${esc(c.last)||("📷 "+(LANG==="en"?"Photo":"صورة"))}</div></div></div>`).join("");
  }catch(e){ const l=document.getElementById("inboxList"); if(l) l.innerHTML=`<p class="muted center">${LANG==="en"?"Connection error":"خطأ في الاتصال"}</p>`; }
}
async function openConvo(peer, name){
  chatPeer=peer; if(name) rememberName(peer,name);
  app.innerHTML=`<section class="section"><div class="wrap chat-wrap"><div class="chat-head">
    <span class="back" onclick="stopChatPoll();go('chat')">${t("back")}</span><span class="avatar">${esc(userInitials(nameFor(peer)))}</span>
    <div class="ch-info"><b>${esc(nameFor(peer))}</b><div style="font-size:12px;color:var(--green);font-weight:700">● ${t("online")}</div></div></div>
    <div class="chat-thread" id="chatThread"><div class="center muted" style="padding:30px">…</div></div>
    <div class="chat-input-row"><button class="chat-attach" onclick="document.getElementById('chatImg').click()" title="${LANG==="en"?"Send image":"إرسال صورة"}">📎</button>
      <input id="chatInput" placeholder="${t("type_msg")}" onkeydown="if(event.key==='Enter')sendChat()" autocomplete="off">
      <button class="btn btn-primary" onclick="sendChat()">${t("send")}</button>
      <input id="chatImg" type="file" accept="image/jpeg,image/png,image/webp,image/*" style="display:none" onchange="sendChatImage(this)"></div></div></section>`;
  convoLoaded=false; lastSeenIncomingTs=0; await refreshConvo();
  stopChatPoll(); chatPoll=setInterval(refreshConvo,2500); document.getElementById("chatInput")?.focus();
}
async function refreshConvo(){
  if(route.name!=="chat"||!chatPeer){ stopChatPoll(); return; }
  try{
    const me=currentUser(); const r=await fetch("/api/chat/convo?from="+encodeURIComponent(me.phone)+"&to="+encodeURIComponent(chatPeer)); const d=await r.json();
    const th=document.getElementById("chatThread"); if(!th) return; const msgs=d.messages||[];
    let incomingMax=0; msgs.forEach(m=>{ if(m.from===chatPeer && m.ts>incomingMax) incomingMax=m.ts; });
    if(!convoLoaded){ lastSeenIncomingTs=incomingMax; convoLoaded=true; }
    else if(incomingMax>lastSeenIncomingTs){ playMsgSound(); lastSeenIncomingTs=incomingMax; refreshChatBadge(); }
    th.innerHTML=msgs.map(m=>{const mine=m.from===me.phone;
      const content=(m.kind==="image"&&m.img)?`<img class="cm-image" src="${esc(m.img)}" alt="image" onclick="window.open('${esc(m.img)}','_blank')">`:esc(m.text);
      return `<div class="chat-msg ${mine?"mine":"theirs"}"><span class="cm-bubble ${m.kind==="image"?"cm-bubble-img":""}">${content}</span><span class="cm-time">${new Date(m.ts).toLocaleTimeString(LANG==="en"?"en":"ar",{hour:"2-digit",minute:"2-digit"})}</span></div>`;}).join("");
    th.scrollTop=th.scrollHeight;
  }catch(e){}
}
async function sendChat(){
  const inp=document.getElementById("chatInput"); if(!inp) return; const text=inp.value.trim(); if(!text) return; inp.value=""; const me=currentUser();
  try{ await fetch("/api/chat/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({from:me.phone,to:chatPeer,text,lang:LANG})}); refreshConvo(); }catch(e){ notify(LANG==="en"?"Failed to send":"تعذّر الإرسال"); }
}
function sendChatImage(inp){
  const file=inp.files&&inp.files[0]; if(!file) return; inp.value="";
  if(file.size>8*1024*1024){ notify(LANG==="en"?"Image too large (max 8MB)":"الصورة كبيرة (الحد 8MB)"); return; }
  resizeImageToDataURL(file).then(dataURL=>{ const me=currentUser();
    fetch("/api/chat/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({from:me.phone,to:chatPeer,kind:"image",data:dataURL,lang:LANG})})
      .then(r=>r.json()).then(d=>{ if(d.error){ notify(LANG==="en"?"Image rejected":"تم رفض الصورة"); } refreshConvo(); })
      .catch(()=>notify(LANG==="en"?"Failed to send":"تعذّر الإرسال"));
  }).catch(()=>notify(LANG==="en"?"Failed to send":"تعذّر الإرسال"));
}
/* الإشعارات الصوتية */
function initAudio(){ try{ audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==="suspended") audioCtx.resume(); }catch(e){} }
function playMsgSound(){ initAudio(); if(!audioCtx) return; try{ const t=audioCtx.currentTime; const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type="sine"; o.frequency.setValueAtTime(880,t); o.frequency.exponentialRampToValueAtTime(1320,t+0.12); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.2,t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+0.3); o.start(t); o.stop(t+0.32);}catch(e){} }

/* شارة الرسائل */
async function refreshChatBadge(){
  const me=currentUser(); if(!me){ unreadCount=0; lastGlobalUnread=0; paintBadge(); setTitle(0); return; }
  try{ const r=await fetch("/api/chat/inbox?user="+encodeURIComponent(me.phone)); const d=await r.json();
    unreadCount=(d.conversations||[]).reduce((a,c)=>a+(c.unread||0),0); paintBadge(); setTitle(unreadCount);
    const inConvo=(route.name==="chat"&&chatPeer); if(!inConvo && unreadCount>lastGlobalUnread && unreadCount>0){ playMsgSound(); } lastGlobalUnread=unreadCount;
  }catch(e){}
}
function setTitle(n){ document.title = n>0?`(${n}) ${BASE_TITLE}`:BASE_TITLE; }
function paintBadge(){ const el=document.getElementById("chatBadge"); if(el){ el.textContent=unreadCount; el.style.display=unreadCount?"":"none"; } }

/* =========================================================================
   ربط الأحداث
   ========================================================================= */
document.getElementById("fabAdd").addEventListener("click",()=>go("add"));
document.querySelectorAll(".bottom-nav [data-route]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.route)));
document.getElementById("topSearch").addEventListener("keydown",e=>{ if(e.key==="Enter"){const q=e.target.value.trim(); if(q) go("browse",{q});} });
overlay.addEventListener("click",e=>{ if(e.target===overlay){ closeAuth(); closeCheckout(); closeReport(); closeInstallGuide(); closeOffer(); closePromote(); closeStory(); closeAlerts(); } });

/* انطلاق */
(async function init(){
  try{ await store.bootstrap(); }catch(e){}
  render();
  hideSplash();
  refreshChatBadge();
  checkApk();
  setInterval(refreshChatBadge, 6000);
  document.addEventListener("pointerdown", initAudio, { once:true });
  // إعادة بناء الشريط عند تغيير حجم النافذة (دوران الجوال مثلاً)
  let _rzT; window.addEventListener("resize", ()=>{ clearTimeout(_rzT); _rzT=setTimeout(()=>{ _tickerSig=""; renderTicker(); }, 250); });
  // ضمان إضافي: إن بقي الشريط فارغاً (بيانات مفقودة)، أعد الجلب بعد لحظات
  setTimeout(async ()=>{ if(!(state.news||[]).length){ try{ await store.refreshNews(); }catch(e){} _tickerSig=""; renderTicker(); } }, 2500);
  // إعلان الافتتاح (Splash) — مرة واحدة لكل زيارة، بعد اختفاء شاشة التحميل
  setTimeout(showSplashAd, 900);
})();
function hideSplash(){ const sp=document.getElementById("splash"); if(!sp) return; setTimeout(()=>{ sp.classList.add("hide"); setTimeout(()=>sp.remove(),600); }, 650); }

/* =========================================================================
   PWA: تسجيل Service Worker + زر تثبيت التطبيق (يعمل على كل المنصات)
   ========================================================================= */
let deferredPrompt = null;
function pwaStandalone(){ return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true; }
function pwaIsIOS(){ return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
function pwaIsAndroid(){ return /android/i.test(navigator.userAgent); }

function ensureInstallFab(){
  if(pwaStandalone()) return; // التطبيق مثبّت بالفعل
  let ib = document.getElementById("installBtn");
  if(!ib){ ib = document.createElement("button"); ib.id="installBtn"; ib.className="install-fab"; ib.onclick=installApp; document.body.appendChild(ib); }
  ib.innerHTML = "⬇️ " + (LANG==="en"?"Install App":"تثبيت التطبيق");
  ib.style.display = "";
}
const APK_URL = "downloads/zarqa-free-zone.apk";
function checkApk(){
  fetch(APK_URL, {method:"HEAD"}).then(r=>{ const ok = r.ok && (r.headers.get('content-type')||'').includes('android.package'); if(ok!==!!window.__APK_READY){ window.__APK_READY=ok; if(window.render) render(); } }).catch(()=>{});
}
function doNativeInstall(){
  if(deferredPrompt){ const dp=deferredPrompt; dp.prompt(); dp.userChoice.then(r=>{ if(r.outcome==="accepted") notify(t("installed_toast")); deferredPrompt=null; closeInstallGuide(); hideInstallUI(); }).catch(()=>{ deferredPrompt=null; }); }
}
function installApp(){ showInstallGuide(); }
function showInstallGuide(){
  const native = !!deferredPrompt;
  let title, steps;
  if(pwaIsIOS()){ title=t("install_ios_t"); steps=t("install_ios_s"); }
  else if(pwaIsAndroid()){ title=t("install_and_t"); steps=t("install_and_s"); }
  else { title=t("install_pc_t"); steps=t("install_pc_s"); }
  const apkBtn = window.__APK_READY ? `<a class="btn btn-primary btn-block btn-lg" href="${APK_URL}" download style="text-decoration:none;margin-bottom:8px">${t("apk_download")}</a><p class="muted center" style="font-size:12px;margin-bottom:12px">${t("apk_hint")}</p>` : "";
  const nowBtn = native ? `<button class="btn ${window.__APK_READY?'btn-ghost':'btn-primary'} btn-block btn-lg" onclick="doNativeInstall()" style="margin-bottom:12px">${t("install_now")}</button>` : "";
  overlay.classList.add("show");
  overlay.innerHTML = `<div class="modal modal-wrap">
    <button class="modal-close" onclick="closeInstallGuide()">×</button>
    <div style="font-size:52px;text-align:center;margin-bottom:4px">📲</div>
    <h2 style="text-align:center">${t("install_title")}</h2>
    <p class="muted center" style="margin-bottom:16px">${t("install_sub")}</p>
    ${apkBtn}${nowBtn}
    <div class="install-guide"><h4 style="margin-bottom:8px">${title}</h4><p style="white-space:pre-line;line-height:1.9">${esc(steps)}</p></div>
    <button class="btn btn-ghost btn-block" style="margin-top:14px" onclick="closeInstallGuide()">${t("got_it")}</button></div>`;
}
function closeInstallGuide(){ overlay.classList.remove("show"); overlay.innerHTML=""; }
function hideInstallUI(){
  const ib=document.getElementById("installBtn"); if(ib) ib.style.display="none";
  const hi=document.getElementById("heroInstall"); if(hi) hi.style.display="none";
}

window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredPrompt = e; ensureInstallFab(); });
window.addEventListener("appinstalled", () => { hideInstallUI(); deferredPrompt=null; });
if("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(()=>{}));
}
/* =========================================================================
   13) قصص فيديو + باقات الترقية + تنبيهات ذكية (المرحلة 2 — تكملة)
   ========================================================================= */
const PROMO_PACKAGES=[
  {id:"featured",price:9,days:90,ico:"⭐",name:"promo_featured",desc:"promo_feat_d",color:"#f59e0b"},
  {id:"boost",price:5,days:7,ico:"🚀",name:"promo_boost",desc:"promo_boost_d",color:"#dc2626"},
  {id:"premium",price:19,days:180,ico:"👑",name:"promo_premium",desc:"promo_prem_d",color:"#9333ea"}
];
/* ---- باقات الترقية (Promote) ---- */
function openPromote(id){
  const l=findListing(id); if(!l) return;
  overlay.classList.add("show");
  overlay.innerHTML=`<div class="modal modal-wrap"><button class="modal-close" onclick="closePromote()">×</button>
    <h2 style="text-align:center">${t("promo_title")}</h2>
    <p class="muted center" style="margin-bottom:16px;font-size:13px">${t("promo_desc")}</p>
    ${PROMO_PACKAGES.map(p=>`<div class="promo-pkg ${promoActive(l)&&l.promo===p.id?"cur":""}" onclick="buyPromo('${id}','${p.id}')">
      <div class="promo-ico" style="background:${p.color}22;color:${p.color}">${p.ico}</div>
      <div style="flex:1;min-width:0"><b>${t(p.name)}</b><div class="muted" style="font-size:12px">${t(p.desc)}</div></div>
      <div class="promo-price">$${p.price}<small style="display:block;font-size:10px;opacity:.7">/${p.days} ${t("days")}</small></div></div>`).join("")}
    <button class="btn btn-ghost btn-block" style="margin-top:10px" onclick="closePromote()">${t("got_it")}</button></div>`;
}
function closePromote(){ overlay.classList.remove("show"); overlay.innerHTML=""; }
async function buyPromote(id,pkgId){
  const p=PROMO_PACKAGES.find(x=>x.id===pkgId); if(!p) return;
  if(!currentUser()){notify(t("r_login"));openAuth();return;}
  const m=overlay.querySelector(".modal"); if(m) m.innerHTML=`<div class="center" style="padding:40px 0"><div style="font-size:40px">💳</div><p class="muted">${t("processing")}</p></div>`;
  if(stripeCfg&&stripeCfg.stripePK){ try{ await fetch("/api/create-payment-intent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:p.price,plan:"promo_"+pkgId})}); }catch(e){} await new Promise(r=>setTimeout(r,1400)); }
  else { await new Promise(r=>setTimeout(r,1300)); }
  try{ await store.promoteListing(id,pkgId); closePromote(); notify(t("promo_success")); render(); }
  catch(e){ closePromote(); notify(LANG=="en"?"Failed":"تعذّر"); }
}
/* ---- قصص فيديو (Stories) ---- */
function storyListNow(){ return queryListings({}).filter(l=>l.video||l.featured).sort((a,b)=>(promoRank(b)-promoRank(a))||((b.date<a.date)?-1:1)).slice(0,14); }
function storiesBarHTML(){
  const stories=storyListNow();
  const bubbles=`<div class="story-item" onclick="go('add')"><div class="story-bubble add"><span>＋</span></div><small>${t("add_story")}</small></div>`
    + stories.map((l,i)=>`<div class="story-item" onclick="openStoryViewer(${i})"><div class="story-bubble ${l.video?"has-video":""}"><img src="${thumbURL(l)}" alt="">${l.video?'<span class="story-play">▶</span>':""}</div><small>${esc((l.title||"").slice(0,14))}</small></div>`).join("");
  return `<section class="stories-bar"><div class="stories-scroll">${bubbles}</div></section>`;
}
let storyList=[], storyIdx=0;
function openStoryViewer(i){ storyList=storyListNow(); storyIdx=i; if(storyList.length) drawStory(); }
function drawStory(){
  const l=storyList[storyIdx]; if(!l){closeStory();return;}
  overlay.classList.add("show");
  overlay.innerHTML=`<div class="story-viewer" onclick="storyNext()">
    <button class="story-close" onclick="event.stopPropagation();closeStory()">×</button>
    <div class="story-progress"><i></i></div>
    <div class="story-media">${l.video?`<video src="${l.video}" autoplay muted playsinline onended="storyNext()">`:`<img src="${thumbURL(l)}">`}</div>
    <div class="story-foot" onclick="event.stopPropagation();closeStory();go('detail',{id:'${l.id}'})">
      <div style="min-width:0"><b style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(l.title)}</b><span style="opacity:.95">${esc(fmtPrice(l))}</span></div>
      <button class="btn btn-primary btn-sm">${t("story_tap")}</button></div>
    <button class="story-nav prev" onclick="event.stopPropagation();storyPrev()">‹</button>
    <button class="story-nav next" onclick="event.stopPropagation();storyNext()">›</button>
  </div>`;
  const bar=overlay.querySelector(".story-progress>i"); if(bar) bar.style.animation="storyProg 6s linear forwards";
}
function storyNext(){ storyIdx++; if(storyIdx>=storyList.length) closeStory(); else drawStory(); }
function storyPrev(){ storyIdx=Math.max(0,storyIdx-1); drawStory(); }
function closeStory(){ overlay.classList.remove("show"); overlay.innerHTML=""; }
/* ---- تنبيهات ذكية (Smart Alerts) ---- */
function alertsNewCount(){
  if(!savedSearches.length) return 0;
  const seen=Number(localStorage.getItem("fz_alerts_seen")||0);
  let n=0;
  savedSearches.forEach(s=>{ const since=Math.max(s.saved||0,seen); const list=queryListings(s); n+=list.filter(l=>{ const lt=l.ts||new Date(l.date).getTime(); return lt>since; }).length; });
  return n;
}
function paintBell(){ const b=document.getElementById("bellBadge"); if(!b) return; const n=alertsNewCount(); b.style.display=n?"inline-flex":"none"; b.textContent=n>99?"99+":n; }
function openAlerts(){
  const prevSeen=Number(localStorage.getItem("fz_alerts_seen")||0);
  let rows="";
  if(savedSearches.length){
    savedSearches.forEach(s=>{ const list=queryListings(s); const since=Math.max(s.saved||0,prevSeen); const fresh=list.filter(l=>{ const lt=l.ts||new Date(l.date).getTime(); return lt>since; });
      if(!fresh.length) return;
      rows+=`<div class="alert-search"><div class="alert-shead"><b>${esc(searchLabel(s))}</b><span class="ci-badge" style="background:var(--green)">${fresh.length}</span></div>${fresh.slice(0,6).map(l=>`<div class="alert-item" onclick="closeAlerts();go('detail',{id:'${l.id}'})"><img class="alert-thumb" src="${thumbURL(l)}"><div style="flex:1;min-width:0"><div class="alert-t">${esc(l.title)}</div><div class="alert-p">${esc(fmtPrice(l))}</div></div><span class="muted" style="font-size:11px;white-space:nowrap">${relDate(l.date)}</span></div>`).join("")}</div>`;
    });
  }
  localStorage.setItem("fz_alerts_seen", Date.now());
  paintBell();
  overlay.classList.add("show");
  overlay.innerHTML=`<div class="modal modal-wrap" style="max-width:520px"><button class="modal-close" onclick="closeAlerts()">×</button>
    <h2>🔔 ${t("alerts")}</h2>
    <p class="muted" style="font-size:13px;margin-bottom:14px">${t("alerts_sub")}</p>
    ${rows||`<div class="center muted" style="padding:30px">${t("no_alerts")}</div>`}
    <button class="btn btn-ghost btn-block btn-sm" style="margin-top:12px" onclick="enableNotifications()">🔔 ${t("enable_notif")}</button>
    <button class="btn btn-ghost btn-block" style="margin-top:8px" onclick="closeAlerts()">${t("got_it")}</button></div>`;
}
function closeAlerts(){ overlay.classList.remove("show"); overlay.innerHTML=""; }
async function enableNotifications(){
  if(!("Notification" in window)){ notify(LANG=="en"?"Not supported":"غير مدعوم"); return; }
  try{
    const perm=await Notification.requestPermission();
    if(perm!=="granted"){ notify(LANG=="en"?"Permission denied":"تم رفض الإذن"); return; }
    if("serviceWorker" in navigator){ try{ const reg=await navigator.serviceWorker.ready; const sub=await reg.pushManager.subscribe({userVisibleOnly:true}); if(sub) await store.subscribePush({endpoint:sub.endpoint, keys:(sub.toJSON&&sub.toJSON().keys)||{}}); }catch(e){} }
    notify(t("notif_on"));
  }catch(e){ notify(LANG=="en"?"Failed":"تعذّر"); }
}
/* =========================================================================
   14) صفحات المتاجر + أفراد/معارض + التعليقات (المرحلة 3)
   ========================================================================= */
async function viewStore(id){
  app.innerHTML=`<section class="section"><div class="wrap"><span class="back" onclick="go('home')">← ${t("back")}</span><div class="center muted" style="padding:40px">⏳</div></div></section>`;
  window.scrollTo(0,0);
  let data=null; try{ data=await store.getUserProfile(id); }catch(e){}
  if(!data||!data.user){ app.innerHTML=`<section class="section"><div class="wrap"><p class="center muted">${LANG=="en"?"Store not found":"المتجر غير موجود"}</p></div></section>`; return; }
  const u=data.user; const listings=data.listings||[]; const me=currentUser();
  app.innerHTML=`<section class="section"><div class="wrap"><span class="back" onclick="go('home')">← ${t("back")}</span>
    <div class="store-head">
      <div class="store-logo">${esc(userInitials(u.storeName||u.name))}</div>
      <div style="flex:1;min-width:0">
        <h1>${esc(u.storeName||u.name)} ${u.verified?'<i class="verified">✔</i>':""}</h1>
        <div class="muted" style="margin-top:4px">${u.type==="dealer"?'<span class="dealer-pill">🏛️ '+t("dealer")+'</span> ':""}🌐 ${esc(showCountry(u.country))} • ${t("store_since")} ${u.joined}</div>
        ${(u.storeDesc||u.bio)?`<p class="store-bio">${esc(u.storeDesc||u.bio)}</p>`:""}
        <div style="margin-top:8px">${u.stars?`<span class="stars">${"★".repeat(u.stars)}<span class="empty">${"☆".repeat(5-u.stars)}</span></span> <span class="muted" style="font-size:13px">• ${u.deals} ${t("deals_count")}</span>`:""}</div>
      </div>
      <div class="store-cta">${me&&me.id===u.id?"":`<a class="btn btn-ghost btn-sm" href="tel:${esc(u.phone)}">📞 ${t("call")}</a><button class="btn btn-primary btn-sm" onclick="openChatFromListing('${esc(u.phone)}','${esc((u.storeName||u.name)).replace(/'/g,"")}')">${t("chat_now")}</button>`}</div>
    </div>
    <div class="sec-head" style="margin-top:24px"><h2>${t("store_listings")} <span class="muted" style="font-size:16px">(${listings.length})</span></h2></div>
    ${listings.length?`<div class="list-grid">${listCardsHTML(listings)}</div>`:`<div class="list-empty"><div class="big">🏪</div><p>${t("store_empty")}</p></div>`}
  </div></section>`;
}
/* ---- التعليقات ---- */
function commentsCard(l,owner){
  const cm=l.comments||[];
  return `<div class="info-card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3>💬 ${t("comments")}</h3><span class="pill">${cm.length} ${t("comments_count")}</span></div>
    <div class="comment-box"><textarea id="cmText" placeholder="${t("write_comment")}" style="min-height:60px"></textarea><button class="btn btn-primary btn-sm" style="margin-top:8px" onclick="postComment('${l.id}',null)">↩ ${t("comment_send")}</button></div>
    <div style="margin-top:16px;display:flex;flex-direction:column;gap:14px">${cm.length?cm.map(c=>commentHTML(c,l.id)).join(""):`<p class="muted center" style="padding:10px 0;font-size:13px">${t("no_comments")}</p>`}</div></div>`;
}
function commentHTML(c,lid){
  const replies=(c.replies||[]).map(r=>`<div class="comment reply"><div class="cmt-avatar sm">${esc((r.name||"?").slice(0,1))}</div><div style="flex:1;min-width:0"><div class="cmt-head"><b>${esc(r.name)}</b><span class="muted" style="font-size:11px">${relDate(new Date(r.ts).toISOString())}</span></div><div class="cmt-body">${esc(r.text)}</div></div></div>`).join("");
  return `<div class="comment"><div class="cmt-avatar">${esc((c.name||"?").slice(0,1))}</div><div style="flex:1;min-width:0"><div class="cmt-head"><b>${esc(c.name)}</b><span class="muted" style="font-size:11px">${relDate(new Date(c.ts).toISOString())}</span></div><div class="cmt-body">${esc(c.text)}</div><button class="cmt-reply" onclick="toggleReply('${c.id}')">${t("reply")}</button>${replies}<div id="reply_${c.id}" style="display:none;margin-top:8px"><textarea id="replyText_${c.id}" class="reply-input" placeholder="${t("comment_reply_ph")}" style="min-height:44px"></textarea><button class="btn btn-primary btn-sm" style="margin-top:6px" onclick="postComment('${lid}','${c.id}')">${t("comment_send")}</button></div></div></div>`;
}
function toggleReply(cid){ const el=document.getElementById("reply_"+cid); if(el) el.style.display=el.style.display==="none"?"block":"none"; }
async function postComment(lid,parentId){
  if(!currentUser()){notify(t("login_comment"));openAuth();return;}
  const ta=document.getElementById(parentId?("replyText_"+parentId):"cmText"); if(!ta) return;
  const text=ta.value.trim(); if(!text) return;
  try{ await store.postComment(lid,text,parentId); notify(t("comment_posted")); render(); }catch(e){ notify(LANG=="en"?"Failed":"تعذّر"); }
}
/* ---- نوع الحساب (أفراد/معارض) + إعدادات المتجر ---- */
function accountTypeCard(u){
  const isD=u.type==="dealer";
  return `<div class="info-card" style="max-width:none"><h3 style="margin-bottom:12px">${t("account_type")}: <span class="pill">${isD?"🏛️ "+t("dealer"):"👤 "+t("individual")}</span></h3>
    <button class="btn ${isD?"btn-ghost":"btn-primary"} btn-block" onclick="toggleDealerType()">${isD?t("become_individual"):t("become_dealer")}</button>
    ${isD?`<div style="margin-top:14px"><div class="field"><label>${t("store_name_lbl")}</label><input id="stName" value="${esc(u.storeName||u.name)}"></div><div class="field"><label>${t("store_desc_lbl")}</label><textarea id="stDesc" style="min-height:70px">${esc(u.storeDesc||u.bio||"")}</textarea></div><button class="btn btn-primary btn-block" onclick="saveStore()">💾 ${t("save_store")}</button></div>`:""}</div>`;
}
async function toggleDealerType(){
  if(!currentUser()) return;
  const newType=currentUser().type==="dealer"?"individual":"dealer";
  try{ await store.updateMyProfile({type:newType}); notify(newType==="dealer"?t("become_dealer"):t("become_individual")+" ✓"); render(); }catch(e){ notify(LANG=="en"?"Failed":"تعذّر"); }
}
async function saveStore(){
  if(!currentUser()) return;
  const name=document.getElementById("stName").value.trim(), desc=document.getElementById("stDesc").value.trim();
  try{ await store.updateMyProfile({storeName:name,storeDesc:desc,name}); notify(t("save_store")+" ✓"); render(); }catch(e){ notify(LANG=="en"?"Failed":"تعذّر"); }
}



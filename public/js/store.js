/* =========================================================================
   طبقة البيانات (v3) — قاعدة بيانات مركزية على الخادم + ذاكرة مؤقتة
   كل البيانات (مستخدمون/إعلانات/مفضلة/بنرات) تأتي من الخادم الآن.
   ========================================================================= */

const FREE_DAYS = 90;                 // العرض المجاني: 3 أشهر
const PLANS = { basic:{id:"basic",price:5}, featured:{id:"featured",price:15}, pro:{id:"pro",price:39} };

/* ----- حالة العميل (ذاكرة مؤقتة تُملأ من الخادم) ----- */
const state = {
  listings: [],
  user: null,
  banners: [],
  favorites: new Set(),
  users: [],                          // قائمة المستخدمين (للإدارة)
  token: localStorage.getItem("fz_token") || "",
  adminToken: localStorage.getItem("fz_admin") || ""
};

/* ----- مساعدات fetch ----- */
function headers(extra){
  const h = Object.assign({}, extra||{});
  if(state.token) h["Authorization"] = "Bearer "+state.token;
  if(state.adminToken) h["x-admin-token"] = state.adminToken;
  return h;
}
async function jget(url){ const r=await fetch(url,{headers:headers()}); if(!r.ok) throw new Error(r.status); return r.json(); }
async function jpost(url,body){ const r=await fetch(url,{method:"POST",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify(body||{})}); return r.json(); }
async function jpatch(url,body){ const r=await fetch(url,{method:"PATCH",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify(body||{})}); return r.json(); }
async function jdel(url){ const r=await fetch(url,{method:"DELETE",headers:headers()}); return r.json(); }

/* تصغير الصورة قبل الرفع */
function resizeImageToDataURL(file, maxW=1000){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{ const img=new Image(); img.onload=()=>{ const c=document.createElement("canvas"); let w=img.width,h=img.height; if(w>maxW){h=h*maxW/w;w=maxW;} c.width=w;c.height=h; c.getContext("2d").drawImage(img,0,0,w,h); resolve(c.toDataURL("image/jpeg",0.82)); }; img.onerror=reject; img.src=reader.result; };
    reader.onerror=reject; reader.readAsDataURL(file);
  });
}

/* =========================================================================
   واجهة store (عمليات غير متزامنة تتصل بالخادم)
   ========================================================================= */
const store = {
  /* تحميل أولي لكل البيانات */
  async bootstrap(){
    await Promise.all([this.refreshBanners(), this.refreshListings()]);
    if(state.token){
      try { await this.me(); await this.refreshFavorites(); }
      catch(e){ state.token=""; localStorage.removeItem("fz_token"); state.user=null; }
    }
  },
  async refreshListings(){ const d=await jget("/api/listings"); state.listings=d.listings||[]; return state.listings; },
  async refreshBanners(){ const d=await jget("/api/banners"); state.banners=d.banners||[]; return state.banners; },
  async refreshFavorites(){ if(!state.token) return; const d=await jget("/api/favorites"); state.favorites=new Set(d.favorites||[]); },
  async me(){ const d=await jget("/api/me"); state.user=d.user||null; return state.user; },

  /* مصادقة */
  async login(name, phone, country){
    const d=await jpost("/api/auth/login",{name,phone,country});
    if(d.token){ state.token=d.token; localStorage.setItem("fz_token",d.token); state.user=d.user; await this.refreshFavorites(); }
    return d.user;
  },
  async logout(){ try{ await jpost("/api/auth/logout"); }catch(e){} state.token=""; localStorage.removeItem("fz_token"); state.user=null; state.favorites=new Set(); },
  async updateProfile(patch){ if(!state.user) return; await jpatch("/api/users/"+state.user.id, patch); Object.assign(state.user, patch); },

  /* الإعلانات */
  async createListing(data){
    let img="";
    if(data.file){ try{ const url=await this.uploadImage(data.file); img=url; }catch(e){} }
    const body={deal:data.deal,section:data.section,sub:data.sub,type:data.type,brand:data.brand,model:data.model,title:data.title,price:data.price,currency:data.currency,location:data.location,desc:data.desc,img};
    const d=await jpost("/api/listings", body);
    if(d.listing){ state.listings.unshift(d.listing); }
    return d.listing;
  },
  async uploadImage(file){
    const dataURL = typeof file==="string" ? file : await resizeImageToDataURL(file);
    const d=await jpost("/api/upload",{data:dataURL});
    if(!d.url) throw new Error("upload_failed");
    return d.url;
  },
  async deleteListing(id){ await jdel("/api/listings/"+id); state.listings=state.listings.filter(l=>l.id!==id); },
  async toggleFeatured(id){ const d=await jpatch("/api/listings/"+id+"/feature"); if(d.listing){ const i=state.listings.findIndex(l=>l.id===id); if(i>=0) state.listings[i]=d.listing; } },

  /* المفضلة */
  async setFav(id, on){ if(on){ await jpost("/api/favorites/"+id); state.favorites.add(id); } else { await jdel("/api/favorites/"+id); state.favorites.delete(id); } },

  /* البنرات */
  async updateBanner(id, patch){ const d=await jpatch("/api/admin/banners/"+id, patch); if(d.banner){ const i=state.banners.findIndex(b=>b.id===id); if(i>=0) state.banners[i]=d.banner; } },

  /* المدفوعات */
  async recordPayment(plan, amount){ await jpost("/api/payments",{plan,amount}); },

  /* الإدارة */
  async adminLogin(password){ const d=await jpost("/api/admin/login",{password}); if(d.adminToken){ state.adminToken=d.adminToken; localStorage.setItem("fz_admin",d.adminToken); return true; } return false; },
  adminLogout(){ state.adminToken=""; localStorage.removeItem("fz_admin"); },
  async refreshUsers(){ const d=await jget("/api/admin/users"); state.users=d.users||[]; },
  async adminStats(){ return jget("/api/admin/stats"); },
  async setUserStars(id,n){ await jpatch("/api/admin/users/"+id,{stars:n}); },
  async toggleVerified(id){ const u=state.users.find(x=>x.id===id); const v=!(u&&u.verified); await jpatch("/api/admin/users/"+id,{verified:v}); return v; },
  async deleteUser(id){ await jdel("/api/admin/users/"+id); state.users=state.users.filter(u=>u.id!==id); state.listings=state.listings.filter(l=>l.user!==id); },
};

/* =========================================================================
   دوال قراءة متزامنة (تقرأ من الذاكرة المؤقتة) — تستخدمها الواجهة مباشرة
   ========================================================================= */
const currentUser   = ()=> state.user;
const allListings   = ()=> state.listings;
function findListing(id){ return state.listings.find(l=>l.id===id) || null; }
function userListings(uid){ const id=uid||(state.user&&state.user.id); return state.listings.filter(l=>l.user===id); }
function allBanners(){ return state.banners; }
function getBanner(id){ return state.banners.find(b=>b.id===id); }
function isFav(id){ return state.favorites.has(id); }
function isAdmin(){ return !!state.adminToken; }

function isFree(l){ if(!l||!l.date) return true; return (Date.now()-new Date(l.date).getTime())/86400000 <= FREE_DAYS; }
function daysLeft(l){ return Math.max(0, Math.round(FREE_DAYS-(Date.now()-new Date(l.date).getTime())/86400000)); }

function queryListings({section,sub,deal,q,featured,sort}={}){
  let r = state.listings.slice();
  if(section)  r=r.filter(l=>l.section===section);
  if(sub)      r=r.filter(l=>l.sub===sub);
  if(deal)     r=r.filter(l=>l.deal===deal);
  if(featured) r=r.filter(l=>l.featured);
  if(q){ const s=q.toLowerCase(); r=r.filter(l=>(l.title||"").toLowerCase().includes(s)||(l.desc||"").toLowerCase().includes(s)||(l.type||"").toLowerCase().includes(s)||(l.brand||"").toLowerCase().includes(s)||(tData(l.type)||"").toLowerCase().includes(s)||(tData(l.brand)||"").toLowerCase().includes(s)); }
  if(sort==="price_asc") r.sort((a,b)=>a.price-b.price);
  else if(sort==="price_desc") r.sort((a,b)=>b.price-a.price);
  else r.sort((a,b)=>(b.date<a.date?-1:1));
  return r;
}
function locSection(id){ return tData(getSectionName(id)); }
function locSub(sec,sub){ return tData(getSubName(sec,sub)); }
function fmtPrice(l){ if(l.deal==="buy") return t("buyer_label"); if(l.price===0) return t("at_call"); return Number(l.price).toLocaleString("en-US")+" "+l.currency; }
function relDate(d){ const days=Math.floor((Date.now()-new Date(d).getTime())/86400000); const en=LANG==="en";
  if(days<=0) return en?"Today":"اليوم"; if(days===1) return en?"Yesterday":"أمس";
  if(days<7) return en?`${days} days ago`:`قبل ${days} أيام`;
  if(days<30) return en?`${Math.floor(days/7)} weeks ago`:`قبل ${Math.floor(days/7)} أسابيع`;
  return en?`${Math.floor(days/30)} months ago`:`قبل ${Math.floor(days/30)} أشهر`; }

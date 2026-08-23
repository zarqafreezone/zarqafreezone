/* =========================================================================
   خادم المنطقة الحرة الزرقاء (الزرقاء) — Node خالص بدون مكتبات خارجية
   - قاعدة بيانات مركزية db.json (مستخدمون + إعلانات + بنرات + مدفوعات)
   - مصادقة بالرموز (Bearer token)
   - محادثات مباشرة + رفع صور + بوابة Stripe
   - قاعدة بيانات دائمة MongoDB Atlas (مع db.json احتياطي)
   ========================================================================= */
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { MongoClient } = require("mongodb");
const DATA = require("./public/js/data.js");

const PORT = process.env.PORT || 8000;
const PUBLIC = path.join(__dirname, "public");
const DB_FILE = path.join(__dirname, "db.json");
const STRIPE_PK = process.env.STRIPE_PUBLISHABLE_KEY || "";
const STRIPE_SK = process.env.STRIPE_SECRET_KEY || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const MONGO_URI = process.env.MONGODB_URI || "";
let ADMIN_SESSION = "";

const SEED_USERS = DATA.SEED_USERS;
const SEED_LISTINGS = DATA.SEED_LISTINGS;
const DEFAULT_BANNERS = [
  { id:"long",   active:true, text_ar:"🚢 استيراد وتصدير المركبات والآليات — أسعار تنافسية بلا جمارك داخل المنطقة الحرة الزرقاء", text_en:"🚢 Import & export of vehicles & machinery — duty-free competitive prices inside the Zarqa Free Zone", link:"#browse" },
  { id:"square", active:true, text_ar:"🏭 مستودعات وأراضٍ متاحة للإيجار داخل المنطقة الحرة", text_en:"🏭 Warehouses & land available for lease in the Free Zone", link:"#browse" }
];

const MIME = { ".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"application/javascript; charset=utf-8",".json":"application/json",".jpg":"image/jpeg",".jpeg":"image/jpeg",".png":"image/png",".webp":"image/webp",".svg":"image/svg+xml",".ico":"image/x-icon",".mp4":"video/mp4",".webm":"video/webm",".apk":"application/vnd.android.package-archive",".woff2":"font/woff2" };

/* ---------- قاعدة البيانات (MongoDB Atlas دائمة + db.json احتياطي محلي) ---------- */
let mongoClient=null, stateCol=null, chatCol=null, imgCol=null, MONGO_ERR="";
function freshSeed(){ return { users:SEED_USERS.map(u=>({...u,token:"",favorites:[]})), listings:SEED_LISTINGS.slice(), banners:DEFAULT_BANNERS.slice(), payments:[], revenue:0, meta:{created:Date.now()} }; }
function loadDBFile(){ try { return JSON.parse(fs.readFileSync(DB_FILE)); } catch { const db=freshSeed(); try{fs.writeFileSync(DB_FILE,JSON.stringify(db));}catch{} return db; } }
async function connectMongo(){
  if(!MONGO_URI) return false;
  try{
    mongoClient = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS:8000 });
    await mongoClient.connect();
    const ddb = mongoClient.db("zarqafreezone");
    stateCol = ddb.collection("state");
    chatCol  = ddb.collection("chat");
    imgCol   = ddb.collection("images");
    console.log("📦 متصل بـ MongoDB Atlas ✓");
    return true;
  }catch(e){ MONGO_ERR=e.message; console.error("⚠️ فشل اتصال MongoDB (سأستخدم db.json محلياً):", e.message); stateCol=null; chatCol=null; return false; }
}
function saveDB(db){
  if(db) DB=db;
  try { fs.writeFileSync(DB_FILE, JSON.stringify(DB)); } catch {}
  if(stateCol) stateCol.updateOne({_id:"main"}, {$set:{data:DB, updatedAt:new Date()}}, {upsert:true}).catch(()=>{});
}
let DB = null;   // يُملأ في initDB() قبل بدء الاستماع
let CHAT = {messages:[]};
async function initDB(){
  const ok = await connectMongo();
  if(ok && stateCol){
    const doc = await stateCol.findOne({_id:"main"});
    if(doc && doc.data && Array.isArray(doc.data.users)){ DB = doc.data; console.log("📥 DB محمّلة من MongoDB"); }
    else { DB = freshSeed(); saveDB(DB); console.log("🌱 تمت زرع بيانات أولية في MongoDB"); }
  } else {
    DB = loadDBFile(); console.log("📄 DB من ملف db.json (محلي)");
  }
  DB.users=DB.users||[]; DB.listings=DB.listings||[]; DB.banners=DB.banners||DEFAULT_BANNERS.slice(); DB.payments=DB.payments||[]; DB.revenue=DB.revenue||0;
  // مزامنة الإعلانات النموذجية: إدراج الجديدة المفقودة + تعبئة أي صورة ناقصة (آمن، مرة واحدة)
  let _seedSynced = false;
  for(const sl of SEED_LISTINGS){
    const ex = (DB.listings||[]).find(l=>l.id===sl.id);
    if(!ex){ DB.listings.push({...sl}); _seedSynced = true; }           // إدراج إعلان جديد
    else if(sl.img && !ex.img){ ex.img = sl.img; _seedSynced = true; }  // تعبئة صورة ناقصة
  }
  if(_seedSynced){ saveDB(DB); console.log("🧩 تمت مزامنة الإعلانات النموذجية (إضافة/صور)"); }
  // تحميل المحادثات
  if(chatCol){
    const cdoc = await chatCol.findOne({_id:"main"});
    CHAT = (cdoc && cdoc.data && Array.isArray(cdoc.data.messages)) ? cdoc.data : {messages:[]};
    console.log("📥 المحادثات:", CHAT.messages.length, "رسالة (MongoDB)");
  } else { CHAT = loadChatFile(); }
}

function pubUser(u){ return u ? {id:u.id,name:u.name,phone:u.phone,country:u.country,joined:u.joined,verified:u.verified,stars:u.stars,deals:u.deals,bio:u.bio} : null; }
function withOwner(l){ return Object.assign({views:0, reports:0, offers:[]}, l, { owner: pubUser(DB.users.find(u=>u.id===l.user)) }); }

/* ---------- مساعدات الرد والاستقبال ---------- */
function send(res, code, body, type="application/json"){
  res.writeHead(code, {"Content-Type":type, "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Headers":"Content-Type, Authorization, x-admin-token"});
  res.end(typeof body==="string"||Buffer.isBuffer(body)?body:JSON.stringify(body));
}
function readBody(req){ return new Promise(res=>{ let d=""; req.on("data",c=>d+=c); req.on("end",()=>{ try{res(JSON.parse(d||"{}"))}catch{res({})} }); }); }
function authUser(req){
  const h = req.headers["authorization"]||"";
  const m = h.match(/^Bearer (.+)$/);
  if(!m) return null;
  return DB.users.find(u=>u.token===m[1]) || null;
}
function isAdmin(req){ return req.headers["x-admin-token"]===ADMIN_SESSION && ADMIN_SESSION; }

/* ---------- رفع الصور ---------- */
const UPLOAD_DIR = path.join(PUBLIC, "uploads");
try { fs.mkdirSync(UPLOAD_DIR, {recursive:true}); } catch {}
function saveDataURI(dataURI, id){
  try{
    const m = String(dataURI).match(/^data:image\/(\w+);base64,(.*)$/);
    if(!m || m[2].length>4*1024*1024) return null;
    const ext = m[1]==="jpeg"?"jpg":m[1];
    try { fs.writeFileSync(path.join(UPLOAD_DIR, id+"."+ext), Buffer.from(m[2],"base64")); } catch {}
    if(imgCol){ imgCol.updateOne({_id:id}, {$set:{data:dataURI, ext, updatedAt:new Date()}}, {upsert:true}).catch(()=>{}); }
    return "/api/img/"+id;
  }catch(e){ return null; }
}
/* رفع مقطع فيديو (يُخزَّن في مجموعة الوسائط، الحد 10MB) */
function saveVideo(dataURI, id){
  try{
    const m = String(dataURI).match(/^data:video\/(\w+);base64,(.*)$/);
    if(!m || m[2].length>10*1024*1024) return null;
    const ext = m[1]==="quicktime"?"mov":m[1];
    try { fs.writeFileSync(path.join(UPLOAD_DIR, id+"."+ext), Buffer.from(m[2],"base64")); } catch {}
    if(imgCol){ imgCol.updateOne({_id:id}, {$set:{data:dataURI, ext, kind:"video", updatedAt:new Date()}}, {upsert:true}).catch(()=>{}); }
    return "/api/img/"+id;
  }catch(e){ return null; }
}

/* ---------- Stripe ---------- */
async function createStripeIntent(amount, plan){
  const r = await fetch("https://api.stripe.com/v1/payment_intents", { method:"POST",
    headers:{"Authorization":`Bearer ${STRIPE_SK}`,"Content-Type":"application/x-www-form-urlencoded"},
    body:`amount=${Math.round(amount*100)}&currency=usd&automatic_payment_methods[enabled]=true&metadata[plan]=${plan}` });
  return await r.json();
}

/* ---------- المحادثات ---------- */
const CHAT_FILE = path.join(__dirname, "chat.json");
const SEED_PHONES = ["+962790000001","+964770000002","+963940000003","+90530000004"];
function loadChatFile(){ try { return JSON.parse(fs.readFileSync(CHAT_FILE)); } catch { return {messages:[]}; } }
function loadChat(){ return CHAT; }
function saveChat(c){ if(c) CHAT=c; try { fs.writeFileSync(CHAT_FILE, JSON.stringify(CHAT)); } catch {} if(chatCol) chatCol.updateOne({_id:"main"}, {$set:{data:CHAT, updatedAt:new Date()}}, {upsert:true}).catch(()=>{}); }
function autoReply(lang){
  const R = {
    ar:["مرحباً 👋 شكراً لرسالتك! كيف يمكنني مساعدتك بخصوص الإعلان؟","أهلاً وسهلاً، المنتج متوفر ويمكنك زيارته في المنطقة الحرة. هل تريد التفاصيل؟","تمام، السعر قابل للتفاوض البسيط. متى يناسبك المعاينة؟"],
    en:["Hello 👋 Thanks for your message! How can I help you with this listing?","Welcome, the item is available and you can view it in the Free Zone. Need details?","Sure, the price is slightly negotiable. When suits you for inspection?"]
  };
  const arr = R[lang]||R.ar; return arr[Math.floor(Math.random()*arr.length)];
}

/* =========================================================================
   الخادم
   ========================================================================= */
process.on("uncaughtException", e=>console.error("⚠️ uncaughtException:", e && e.message));
process.on("unhandledRejection", e=>console.error("⚠️ unhandledRejection:", e && e.message));

const server = http.createServer(async (req,res)=>{
  if(req.method==="OPTIONS") return send(res,204,"");
  const url = new URL(req.url, "http://localhost");
  const p = url.pathname, M = req.method;
  const m = (re)=> p.match(re);
  try{

  /* ----- إعدادات/صحة ----- */
  if(p==="/api/config") return send(res,200,{stripePK:STRIPE_PK, demo:!STRIPE_PK});
  if(p==="/api/health") return send(res,200,{ok:true, time:new Date().toISOString(), db: stateCol?"mongodb":"file", listings: DB?DB.listings.length:0, users: DB?DB.users.length:0});

  /* ----- الدفع ----- */
  if(p==="/api/create-payment-intent" && M==="POST"){
    if(!STRIPE_SK) return send(res,200,{clientSecret:"demo_secret",demo:true});
    try{ const b=await readBody(req); const d=await createStripeIntent(b.amount||5,b.plan||"basic");
      if(d.client_secret) return send(res,200,{clientSecret:d.client_secret,demo:false});
      return send(res,400,{error:"stripe_error",detail:d}); }
    catch(e){ return send(res,500,{error:"server_error",detail:String(e)}); }
  }
  if(p==="/api/payments" && M==="POST"){
    const u=authUser(req); if(!u) return send(res,401,{error:"unauthorized"});
    const b=await readBody(req);
    DB.payments.push({id:"p"+Date.now(), plan:b.plan, amount:Number(b.amount)||0, date:new Date().toISOString().slice(0,10), user:u.id});
    DB.revenue += Number(b.amount)||0; saveDB(DB);
    return send(res,200,{ok:true, revenue:DB.revenue});
  }

  /* ----- المصادقة ----- */
  if(p==="/api/auth/login" && M==="POST"){
    const b=await readBody(req);
    if(!b.phone) return send(res,400,{error:"phone_required"});
    let u = DB.users.find(x=>x.phone===b.phone);
    if(!u){ u={id:"u"+Date.now(), name:(b.name||"").trim()||("User "+b.phone.slice(-4)), phone:b.phone, country:b.country||"", joined:new Date().toISOString().slice(0,10), verified:false, stars:0, deals:0, bio:"", token:"", favorites:[]}; DB.users.push(u); }
    else if(b.name && !u.name){ u.name=b.name; }
    if(b.country) u.country=b.country;
    u.token = crypto.randomBytes(16).toString("hex"); saveDB(DB);
    return send(res,200,{token:u.token, user:pubUser(u)});
  }
  if(p==="/api/auth/logout" && M==="POST"){
    const u=authUser(req); if(u){ u.token=""; saveDB(DB); } return send(res,200,{ok:true});
  }
  if(p==="/api/me" && M==="GET"){
    const u=authUser(req); return u? send(res,200,{user:pubUser(u)}) : send(res,200,{user:null});
  }

  /* ----- رفع صورة ----- */
  if(p==="/api/upload" && M==="POST"){
    const u=authUser(req); if(!u) return send(res,401,{error:"unauthorized"});
    const b=await readBody(req);
    const saved = saveDataURI(b.data, "img"+Date.now());
    return saved? send(res,200,{url:saved}) : send(res,400,{error:"invalid_image"});
  }
  if(p==="/api/upload-video" && M==="POST"){
    const u=authUser(req); if(!u) return send(res,401,{error:"unauthorized"});
    const b=await readBody(req);
    const saved = saveVideo(b.data, "vid"+Date.now());
    return saved? send(res,200,{url:saved}) : send(res,400,{error:"invalid_video"});
  }
  if(m(/^\/api\/img\/([^/]+)$/)){
    if(M!=="GET") return send(res,405,{error:"method"});
    const id=p.split("/")[3];
    try{ const fn = fs.existsSync(UPLOAD_DIR) ? fs.readdirSync(UPLOAD_DIR).find(x=>x.startsWith(id+".")) : null;
      if(fn){ const data=fs.readFileSync(path.join(UPLOAD_DIR,fn)); return send(res,200,data, MIME[path.extname(fn).toLowerCase()]||"image/jpeg"); } }catch{}
    if(imgCol){ try{ const doc=await imgCol.findOne({_id:id}); if(doc&&doc.data){ const mm=String(doc.data).match(/^data:(image|video)\/([\w-]+)/); let ct="image/jpeg"; if(mm){ ct=(mm[1]==="image"&&mm[2]==="jpeg")?"image/jpeg":(mm[1]+"/"+(mm[2]==="quicktime"?"mp4":mm[2])); } const b64=String(doc.data).split(",")[1]||""; return send(res,200,Buffer.from(b64,"base64"),ct); } }catch{} }
    return send(res,404,"Not Found","text/plain");
  }

  /* ----- الإعلانات ----- */
  if(p==="/api/listings" && M==="GET"){
    let r = DB.listings.slice();
    const {section,sub,deal,featured,sort,q} = Object.fromEntries(url.searchParams);
    if(section) r=r.filter(l=>l.section===section);
    if(sub) r=r.filter(l=>l.sub===sub);
    if(deal) r=r.filter(l=>l.deal===deal);
    if(featured) r=r.filter(l=>l.featured);
    if(q){ const s=q.toLowerCase(); r=r.filter(l=> (l.title||"").toLowerCase().includes(s)||(l.desc||"").toLowerCase().includes(s)||(l.type||"").toLowerCase().includes(s)||(l.brand||"").toLowerCase().includes(s)); }
    if(sort==="price_asc") r.sort((a,b)=>a.price-b.price);
    else if(sort==="price_desc") r.sort((a,b)=>b.price-a.price);
    else r.sort((a,b)=>(b.date<a.date?-1:1));
    return send(res,200,{listings:r.map(withOwner)});
  }
  if(p==="/api/listings" && M==="POST"){
    const u=authUser(req); if(!u) return send(res,401,{error:"unauthorized"});
    const b=await readBody(req);
    const l={ id:"l"+Date.now(), deal:b.deal||"sell", section:b.section, sub:b.sub, type:b.type||"", brand:b.brand||"", model:b.model||"", title:(b.title||"").slice(0,200), price:Number(b.price)||0, currency:b.currency||"USD", zone:b.zone||"inside", location:b.location||"", images:b.img?1:0, img:b.img||"", video:b.video||"", user:u.id, date:new Date().toISOString().slice(0,10), featured:false, desc:(b.desc||"").slice(0,2000) };
    DB.listings.unshift(l); saveDB(DB);
    return send(res,200,{listing:withOwner(l)});
  }
  let rm;
  if((rm=m(/^\/api\/listings\/([^/]+)$/))){
    const id=rm[1], l=DB.listings.find(x=>x.id===id);
    if(!l) return send(res,404,{error:"not_found"});
    if(M==="GET") return send(res,200,{listing:withOwner(l)});
    if(M==="DELETE"){ const u=authUser(req); if(!(u && (u.id===l.user || isAdmin(req)))) return send(res,403,{error:"forbidden"}); DB.listings=DB.listings.filter(x=>x.id!==id); saveDB(DB); return send(res,200,{ok:true}); }
  }
  if(m(/^\/api\/listings\/([^/]+)\/feature$/) && M==="PATCH"){
    if(!isAdmin(req)) return send(res,403,{error:"forbidden"});
    const id=p.split("/")[3], l=DB.listings.find(x=>x.id===id); if(!l) return send(res,404,{error:"not_found"});
    l.featured=!l.featured; saveDB(DB); return send(res,200,{listing:withOwner(l)});
  }
  if(m(/^\/api\/listings\/([^/]+)\/view$/) && M==="POST"){
    const id=p.split("/")[3], l=DB.listings.find(x=>x.id===id); if(!l) return send(res,404,{error:"not_found"});
    l.views=(l.views||0)+1; saveDB(DB); return send(res,200,{views:l.views});
  }
  if(m(/^\/api\/listings\/([^/]+)\/report$/) && M==="POST"){
    const u=authUser(req); if(!u) return send(res,401,{error:"unauthorized"});
    const id=p.split("/")[3], l=DB.listings.find(x=>x.id===id); if(!l) return send(res,404,{error:"not_found"});
    const b=await readBody(req);
    DB.reports=DB.reports||[]; DB.reports.push({id:"r"+Date.now(), listing:id, by:u.id, reason:(b.reason||"").slice(0,300), date:new Date().toISOString().slice(0,10)});
    l.reports=(l.reports||0)+1; saveDB(DB); return send(res,200,{ok:true});
  }
  if(m(/^\/api\/listings\/([^/]+)\/offer$/) && M==="POST"){
    const u=authUser(req); if(!u) return send(res,401,{error:"unauthorized"});
    const id=p.split("/")[3], l=DB.listings.find(x=>x.id===id); if(!l) return send(res,404,{error:"not_found"});
    const b=await readBody(req);
    l.offers=l.offers||[];
    l.offers.push({id:"o"+Date.now(), from:u.id, name:u.name, price:Number(b.price)||0, note:(b.note||"").slice(0,300), ts:Date.now()});
    saveDB(DB); return send(res,200,{ok:true, offers:l.offers});
  }

  /* ----- المفضلة ----- */
  if(p==="/api/favorites" && M==="GET"){
    const u=authUser(req); if(!u) return send(res,401,{error:"unauthorized"});
    return send(res,200,{favorites:u.favorites||[]});
  }
  if((rm=m(/^\/api\/favorites\/([^/]+)$/))){
    const u=authUser(req); if(!u) return send(res,401,{error:"unauthorized"});
    u.favorites=u.favorites||[]; const id=rm[1];
    if(M==="POST"){ if(!u.favorites.includes(id)) u.favorites.push(id); }
    else if(M==="DELETE"){ u.favorites=u.favorites.filter(x=>x!==id); }
    saveDB(DB); return send(res,200,{favorites:u.favorites});
  }

  /* ----- البنرات ----- */
  if(p==="/api/banners" && M==="GET") return send(res,200,{banners:DB.banners});
  if(m(/^\/api\/admin\/banners\/([^/]+)$/) && M==="PATCH"){
    if(!isAdmin(req)) return send(res,403,{error:"forbidden"});
    const id=p.split("/")[4], b=DB.banners.find(x=>x.id===id); if(!b) return send(res,404);
    const patch=await readBody(req); Object.assign(b,patch); saveDB(DB); return send(res,200,{banner:b});
  }

  /* ----- الإدارة ----- */
  if(p==="/api/admin/login" && M==="POST"){
    const b=await readBody(req);
    if(b.password!==ADMIN_PASSWORD) return send(res,401,{error:"wrong_password"});
    ADMIN_SESSION = crypto.randomBytes(12).toString("hex");
    return send(res,200,{adminToken:ADMIN_SESSION});
  }
  if(p==="/api/admin/stats" && M==="GET"){
    if(!isAdmin(req)) return send(res,403,{error:"forbidden"});
    return send(res,200,{listings:DB.listings.length, users:DB.users.length, featured:DB.listings.filter(l=>l.featured).length, revenue:DB.revenue});
  }
  if(p==="/api/admin/users" && M==="GET"){
    if(!isAdmin(req)) return send(res,403,{error:"forbidden"});
    return send(res,200,{users:DB.users.map(u=>({...pubUser(u), favorites:(u.favorites||[]).length}))});
  }
  if((rm=m(/^\/api\/admin\/users\/([^/]+)$/))){
    if(!isAdmin(req)) return send(res,403,{error:"forbidden"});
    const id=rm[1], u=DB.users.find(x=>x.id===id); if(!u) return send(res,404);
    if(M==="PATCH"){ const patch=await readBody(req); if("stars"in patch) u.stars=Math.max(0,Math.min(5,+patch.stars)); if("verified"in patch) u.verified=!!patch.verified; saveDB(DB); return send(res,200,{user:pubUser(u)}); }
    if(M==="DELETE"){ DB.listings=DB.listings.filter(l=>l.user!==id); DB.users=DB.users.filter(x=>x.id!==id); saveDB(DB); return send(res,200,{ok:true}); }
  }

  /* ----- المحادثات ----- */
  if(p==="/api/chat/send" && M==="POST"){
    const b=await readBody(req); const isImage=b.kind==="image"&&b.data;
    if(!b.from||!b.to||(!b.text&&!isImage)) return send(res,400,{error:"missing_fields"});
    const c=loadChat(); const msgId="m"+Date.now()+Math.random().toString(36).slice(2,5);
    const msg={id:msgId, from:b.from, to:b.to, kind:isImage?"image":"text", text:b.text?String(b.text).slice(0,1000):"", img:"", ts:Date.now(), read:false};
    if(isImage){ const saved=saveDataURI(b.data,msgId); if(!saved) return send(res,400,{error:"image_invalid"}); msg.img=saved; }
    c.messages.push(msg); saveChat(c);
    if(SEED_PHONES.includes(b.to)){ setTimeout(()=>{ const cc=loadChat(); cc.messages.push({id:"m"+Date.now(),from:b.to,to:b.from,kind:"text",text:autoReply(b.lang||"ar"),img:"",ts:Date.now(),read:false}); saveChat(cc); },1300); }
    return send(res,200,{ok:true,img:msg.img});
  }
  if(p==="/api/chat/convo" && M==="GET"){
    const from=url.searchParams.get("from"), to=url.searchParams.get("to"); if(!from||!to) return send(res,400,{error:"missing"});
    const c=loadChat(); let changed=false;
    c.messages.forEach(x=>{ if(x.to===from&&x.from===to&&!x.read){x.read=true;changed=true;} });
    if(changed) saveChat(c);
    const msgs=c.messages.filter(x=>(x.from===from&&x.to===to)||(x.from===to&&x.to===from)).sort((a,b)=>a.ts-b.ts);
    return send(res,200,{messages:msgs});
  }
  if(p==="/api/chat/inbox" && M==="GET"){
    const user=url.searchParams.get("user"); if(!user) return send(res,400,{error:"missing"});
    const c=loadChat(); const peers={};
    c.messages.forEach(x=>{ if(x.from!==user&&x.to!==user) return; const peer=x.from===user?x.to:x.from; if(!peers[peer]) peers[peer]={peer,last:"",ts:0,unread:0}; if(x.ts>=peers[peer].ts){peers[peer].last=x.text;peers[peer].ts=x.ts;} if(x.to===user&&!x.read) peers[peer].unread++; });
    return send(res,200,{conversations:Object.values(peers).sort((a,b)=>b.ts-a.ts)});
  }

  /* ----- ملفات ثابتة ----- */
  }catch(e){ console.error("⚠️ API error:", e && e.message); return send(res,500,{error:"server_error",detail:String(e&&e.message)}); }
  let fp=decodeURIComponent(p); if(fp==="/"||fp==="") fp="/index.html";
  fp=path.join(PUBLIC, fp);
  if(!fp.startsWith(PUBLIC)) return send(res,403,"Forbidden","text/plain");
  fs.readFile(fp,(err,data)=>{
    if(err){ fs.readFile(path.join(PUBLIC,"index.html"),(e2,d2)=>{ if(e2) return send(res,404,"Not Found","text/plain"); send(res,200,d2,MIME[".html"]); }); return; }
    send(res,200,data,MIME[path.extname(fp).toLowerCase()]||"application/octet-stream");
  });
});

(async ()=>{
  await initDB();
  server.listen(PORT,"0.0.0.0",()=>console.log(`🛃 Zarqa Free Zone — http://0.0.0.0:${PORT} | DB: ${DB.listings.length} listings, ${DB.users.length} users${stateCol?" | MongoDB ✓":""}`));
})();
 
 

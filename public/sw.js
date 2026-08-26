/* =========================================================================
   Service Worker — المنطقة الحرة الزرقاء (PWA)
   الاستراتيجية:
   - التنقّل (HTML): الشبكة أولاً ثم الكاش (بيانات طازجة عند الاتصال)
   - الملفات الثابتة (css/js/icons): stale-while-revalidate
   - الـAPI والرفعات: شبكة فقط (دائماً أحدث البيانات)
   ========================================================================= */
const CACHE = "zfz-v52";
const SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/css/styles.css",
  "/js/app.js",
  "/js/store.js",
  "/js/data.js",
  "/js/i18n.js",
  "/images/logo.jpg",
  "/images/icon-192.png",
  "/images/icon-512.png",
  "/images/icon-192-maskable.png",
  "/images/icon-512-maskable.png",
  "/images/apple-touch-icon.png",
  "/images/favicon.ico",
  "/images/zone.jpg"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  const url = new URL(req.url);

  // الطلبات غير GET أو من مصدر آخر: تجاهل (دع المتصفح يتولّاها)
  if (req.method !== "GET") return;

  // الـAPI والرفعات: شبكة فقط — لا تخزين مؤقت (بيانات حية دائماً)
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/uploads/")) {
    return;
  }

  // التنقّل بين الصفحات: الشبكة أولاً ثم الكاش (واجهة بديلة عند انقطاع الشبكة)
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).catch(() => caches.match("/index.html").then(r => r || caches.match("/")))
    );
    return;
  }

  // الملفات الثابتة من نفس المصدر: الكود (js/css/json) شبكة-أولاً (دائماً طازج)، الصور stale-while-revalidate
  if (url.origin === self.location.origin) {
    const isCode = /\.(js|css|json)$/.test(url.pathname);
    if (isCode) {
      e.respondWith(
        fetch(req).then(res => { if (res && res.ok) { const c = res.clone(); caches.open(CACHE).then(cc => cc.put(req, c)); } return res; })
          .catch(() => caches.match(req).then(r => r || Response.error()))
      );
      return;
    }
    e.respondWith(
      caches.match(req).then(cached => {
        const network = fetch(req).then(res => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
  }
});

/* ===== إشعارات Web Push (جاهز — يتفعّل عند ضبط مفاتيح VAPID على الخادم) ===== */
self.addEventListener("push", e => {
  let d = { title: "إشعار جديد", body: "" };
  try { d = e.data ? e.data.json() : d; } catch (err) { d = { title: "إشعار", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "🔔", { body: d.body || "", icon: "/images/icon-192.png", badge: "/images/icon-192.png", data: d.url || "/" }));
});
self.addEventListener("notificationclick", e => { e.notification.close(); e.waitUntil(clients.matchAll({ type: "window" }).then(cs => { for (const c of cs) { if ("focus" in c) return c.focus(); } if (clients.openWindow) return clients.openWindow(e.notification.data || "/"); })); });

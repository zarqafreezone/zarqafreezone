/* =========================================================================
   Service Worker — المنطقة الحرة الزرقاء (PWA)
   الاستراتيجية:
   - التنقّل (HTML): الشبكة أولاً ثم الكاش (بيانات طازجة عند الاتصال)
   - الملفات الثابتة (css/js/icons): stale-while-revalidate
   - الـAPI والرفعات: شبكة فقط (دائماً أحدث البيانات)
   ========================================================================= */
const CACHE = "zfz-v6";
const SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/css/styles.css",
  "/js/app.js",
  "/js/store.js",
  "/js/data.js",
  "/js/i18n.js",
  "/images/logo.svg",
  "/images/icon.svg",
  "/images/icon-192.png",
  "/images/icon-512.png",
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

  // الملفات الثابتة من نفس المصدر: stale-while-revalidate
  if (url.origin === self.location.origin) {
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

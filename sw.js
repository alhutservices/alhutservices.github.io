/* منصة الحوت — عامل الخدمة
   يجعل لوحة الشريك قابلة للتثبيت على الشاشة الرئيسية،
   ويبقي الإشعارات تعمل عندما تكون اللوحة في الخلفية. */

const CACHE = "hut-partner-v2";
const SHELL = ["./partners.html"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* الشبكة أولاً: بيانات الطلبات يجب أن تكون طازجة دائماً.
   الكاش يخدم فقط عند انقطاع الإنترنت حتى لا تظهر شاشة فارغة. */
self.addEventListener("fetch", e => {
  const url = e.request.url;
  if (e.request.method !== "GET") return;
  if (url.includes("script.google.com") || url.includes("firebaseio") ||
      url.includes("firebasedatabase") || url.includes("googleapis")) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

/* النقر على الإشعار يفتح اللوحة بدل فتح تبويب جديد */
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({type: "window", includeUncontrolled: true}).then(list => {
      for (const c of list) if (c.url.includes("partners") && "focus" in c) return c.focus();
      return self.clients.openWindow("./partners.html");
    })
  );
});

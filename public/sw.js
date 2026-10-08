const SHELL = "shell-v1", IMG = "img-v1";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(["/", "/index.html"])));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.pathname === "/heartbeat.txt") return;

  if (url.hostname === "image.tmdb.org") {           // cache-first for posters
    e.respondWith(caches.open(IMG).then(async (c) => {
      const hit = await c.match(e.request);
      if (hit) return hit;
      const res = await fetch(e.request);
      c.put(e.request, res.clone());
      return res;
    }));
  } else if (url.origin === location.origin) {        // network-first for the shell
    e.respondWith(fetch(e.request).then((res) => {
      caches.open(SHELL).then((c) => c.put(e.request, res.clone()));
      return res;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match("/index.html"))));
  }
});
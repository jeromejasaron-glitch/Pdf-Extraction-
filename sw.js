const SHELL = "encre-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(clients.claim()));
self.addEventListener("fetch", e => {
  const req = e.request, u = new URL(req.url);
  if (req.method === "POST" && u.searchParams.has("share")) {
    e.respondWith((async () => {
      const f = (await req.formData()).get("pdf");
      const c = await caches.open("inbox");
      await c.put(new URL("inbox", self.registration.scope), new Response(f, { headers: { "x-name": encodeURIComponent((f && f.name) || "note.pdf") } }));
      return Response.redirect("./?shared=1", 303);
    })());
    return;
  }
  if (req.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(fetch(req).then(r => { const k = r.clone(); caches.open(SHELL).then(c => c.put(req, k)); return r; }).catch(() => caches.match(req, { ignoreSearch: true })));
});

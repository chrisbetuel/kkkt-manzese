/*
 * Service worker ya KKKT Manzese.
 *
 * Huhifadhi (cache) maudhui ya UMMA pekee ili tovuti ifanye kazi haraka na bila mtandao kwa sehemu:
 *  - faili za tovuti (JS/CSS/picha/fonti)       -> cache-first
 *  - kurasa (navigation)                         -> network-first, ukurasa wa mwisho ukikosa mtandao
 *  - API za maudhui ya umma (neno la leo, mahubiri, matukio, maudhui) -> network-first + akiba
 *
 * HAIHIFADHI kamwe: /api/me*, /api/auth*, /api/verify*, /admin, /ofisi, /sanctum, maombi yasiyo GET,
 * wala majibu yenye kuki za akaunti — taarifa binafsi, za fedha na za kichungaji haziwekwi kwenye kifaa.
 */
const VERSION = 'kkkt-v1'
const STATIC = `${VERSION}-static`
const PAGES = `${VERSION}-pages`
const DATA = `${VERSION}-data`

const PUBLIC_API = [/^\/api\/content$/, /^\/api\/devotions(\/|$)/, /^\/api\/sermons(\/|$|\?)/, /^\/api\/events(\/|$|\?)/,
  /^\/api\/announcements(\/|$|\?)/, /^\/api\/reading-plans(\/|$)/, /^\/api\/ministries/, /^\/api\/jumuiya$/, /^\/api\/projects/, /^\/api\/library$/]
const NEVER = [/^\/api\/me/, /^\/api\/auth/, /^\/api\/verify/, /^\/admin/, /^\/ofisi/, /^\/sanctum/, /^\/livewire/, /^\/storage\/.*private/]

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(PAGES).then((c) => c.addAll(['/'])).catch(() => {}))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))),
  )
  self.clients.claim()
})

async function networkFirst(req, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName)
  try {
    const res = await fetch(req)
    if (res.ok && !res.headers.has('Set-Cookie')) cache.put(req, res.clone())
    return res
  } catch {
    return (await cache.match(req)) || (fallbackUrl && (await cache.match(fallbackUrl))) || Response.error()
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(STATIC)
  const hit = await cache.match(req)
  if (hit) return hit
  const res = await fetch(req)
  if (res.ok) cache.put(req, res.clone())
  return res
}

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  const path = url.pathname
  if (NEVER.some((r) => r.test(path))) return

  if (req.mode === 'navigate') {
    e.respondWith(networkFirst(req, PAGES, '/'))
    return
  }
  if (PUBLIC_API.some((r) => r.test(path + url.search))) {
    e.respondWith(networkFirst(req, DATA))
    return
  }
  if (/^\/(assets|images|icons)\//.test(path) || /\.(css|js|woff2?|png|jpe?g|webp|svg)$/.test(path)) {
    e.respondWith(cacheFirst(req))
  }
})

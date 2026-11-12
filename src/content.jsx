import { createContext, useContext, useEffect, useState } from 'react'
import * as S from './data/site.js'
import { apiFetch, apiUrl as _apiUrl } from './lib/api.js'
import { fmtDate, fmtTime } from './lib/format.js'

export const apiUrl = _apiUrl

// "[JAZA ...]" ni alama ya taarifa ambayo ofisi bado haijaweka. Haionyeshwi hadharani:
// sehemu nzima huachwa wazi (kurasa huficha sehemu tupu) hadi taarifa halisi iwekwe kwenye admin.
export const isPlaceholder = (v) => typeof v === 'string' && /\[JAZA/i.test(v)

function scrub(v) {
  if (isPlaceholder(v)) return ''
  if (Array.isArray(v)) return v.map(scrub)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, scrub(x)]))
  return v
}

/** Kifurushi salama kwa umma: bila alama za [JAZA], na bila njia za sadaka zisizo na namba. */
function publicBundle(b) {
  const c = scrub(b)
  return { ...c, givingMethods: (c.givingMethods || []).filter((m) => m.number) }
}

// ---- shape returned everywhere via useSite() ----
// Akiba (API ikishindwa): utambulisho wa kanisa tu. Matukio, mahubiri, matangazo na shuhuda
// HAZIONYESHWI kutoka faili la mfano — maudhui ya mfano hayaonyeshwi kama ya kweli.
const fallbackBundle = publicBundle({
  church: S.church,
  // hakuna picha ya akiba: picha ya "stock" isionekane kama ya mchungaji halisi
  pastorWelcome: { ...S.pastorWelcome, photo: null },
  beliefs: S.beliefs,
  values: S.values,
  sacraments: S.sacraments,
  involveOptions: S.involveOptions,
  givingPurposes: S.givingPurposes,
  givingInPerson: S.givingInPerson,
  choirs: S.choirs,
  serviceTeams: S.serviceTeams,
  volunteerAreas: S.volunteerAreas,
  baptismChecklist: S.baptismChecklist,
  services: [],
  departments: [],
  events: [],
  announcements: [],
  sermons: [],
  testimonies: [],
  givingMethods: [],
  partnerWays: S.partnerWays,
  leadership: { clergy: [], council: [] },
  galleryImages: S.galleryImages,
  quickLinks: S.quickLinks,
  homepage: {},
  loaded: false,
})

const nonEmpty = (a, fb) => (Array.isArray(a) && a.length ? a : fb)

function normalize(d) {
  const s = d.settings || {}
  return {
    church: s.church || S.church,
    pastorWelcome: s.pastorWelcome || { ...S.pastorWelcome, photo: null },
    beliefs: s.beliefs || S.beliefs,
    values: nonEmpty(s.values, S.values),
    sacraments: nonEmpty(s.sacraments, S.sacraments),
    involveOptions: nonEmpty(s.involveOptions, S.involveOptions),
    givingPurposes: nonEmpty(s.givingPurposes, S.givingPurposes),
    givingInPerson: s.givingInPerson || S.givingInPerson,
    choirs: nonEmpty(s.choirs, S.choirs),
    serviceTeams: nonEmpty(s.serviceTeams, S.serviceTeams),
    volunteerAreas: nonEmpty(s.volunteerAreas, S.volunteerAreas),
    baptismChecklist: nonEmpty(s.baptismChecklist, S.baptismChecklist),
    homepage: s.homepage || {},

    services: nonEmpty(d.services, []).map((x) => ({
      day: x.day, name: x.name, time: x.time_label, note: x.note,
    })),
    departments: nonEmpty(d.departments, []).map((x) => ({
      slug: x.slug, name: x.name, kind: x.kind || 'ministry', leader: x.leader, meets: x.meets,
      icon: x.icon, color: x.color || 'from-navy-800 to-navy-950', text: x.description, image: x.imageUrl || '',
    })),
    events: nonEmpty(d.events, []).map((x) => ({
      slug: x.slug, title: x.title, tag: x.tag, startsAt: x.starts_at, endsAt: x.ends_at,
      // tarehe halisi hupewa kipaumbele; maandishi ya ofisi hutumika kwa matukio ya kujirudia
      date: x.starts_at ? fmtDate(x.starts_at) : x.date_label,
      time: x.starts_at ? fmtTime(x.starts_at) : x.time_label,
      location: x.location, text: x.description, image: x.imageUrl || '',
      requiresRegistration: !!x.requires_registration,
    })),
    announcements: nonEmpty(d.announcements, []).map((x) => ({
      slug: x.slug, title: x.title, date: x.date_label, text: x.body, image: x.imageUrl || '',
    })),
    sermons: nonEmpty(d.sermons, []).map((x) => ({
      slug: x.slug, title: x.title, preacher: x.preacher, series: x.series, scripture: x.scripture,
      date: x.preached_on, summary: x.summary, type: x.type || 'video',
      link: x.link || '', youtubeId: x.youtube_id || '', thumbnail: x.thumbnail_url || '',
      audioUrl: x.audioUrl || '', docUrl: x.docUrl || '',
    })),
    testimonies: nonEmpty(d.testimonies, []).map((x) => ({
      name: x.name, role: x.role, type: x.type, text: x.body, date: x.year,
      youtubeId: x.youtube_id || '', audioUrl: x.type === 'audio' ? x.mediaUrl : '',
      mediaUrl: x.mediaUrl || '', link: x.link || '', thumbnail: x.thumbnail_url || '',
    })),
    givingMethods: nonEmpty(d.givingMethods, []).map((x) => ({
      name: x.name, group: x.group_label, holder: x.holder, number: x.number, icon: x.icon,
    })),
    partnerWays: nonEmpty(d.partnerWays, []).map((x) => ({
      title: x.title, icon: x.icon, text: x.description,
    })),
    leadership:
      d.leadership && (d.leadership.clergy?.length || d.leadership.council?.length)
        ? { clergy: d.leadership.clergy || [], council: d.leadership.council || [] }
        : { clergy: [], council: [] },

    galleryImages: S.galleryImages,
    quickLinks: S.quickLinks,
    loaded: true,
  }
}

const ContentContext = createContext(fallbackBundle)

export function ContentProvider({ children }) {
  const [bundle, setBundle] = useState(fallbackBundle)

  useEffect(() => {
    let alive = true
    apiFetch('/content')
      .then((d) => alive && setBundle(publicBundle(normalize(d))))
      .catch(() => {}) // keep the identity-only fallback
    return () => {
      alive = false
    }
  }, [])

  return <ContentContext.Provider value={bundle}>{children}</ContentContext.Provider>
}

export const useSite = () => useContext(ContentContext)

// ---- form helpers (zote hupitia apiFetch: CSRF + kuki ya session) ----
export function postSubmission(type, { name, email, phone, ...fields }) {
  return apiFetch('/submissions', { method: 'POST', body: { type, name, email, phone, fields } })
}

export function postTestimony(formData) {
  return apiFetch('/testimonies', { method: 'POST', body: formData })
}

// ---- maombi (prayer wall) ----
export function fetchPrayers() {
  return apiFetch('/prayer-requests')
}

export function postPrayer(data) {
  return apiFetch('/prayer-requests', { method: 'POST', body: data })
}

export function prayFor(id) {
  return apiFetch(`/prayer-requests/${id}/pray`, { method: 'POST' })
}

// ---- usajili wa washirika ----
/** Hutupa Error yenye `status` na `errors` (kutoka validation ya Laravel) ikishindikana. */
export function postMember(formData) {
  return apiFetch('/members', { method: 'POST', body: formData })
}

// ---- matunzio (albamu) ----
const slugify = (s) =>
  String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** Albamu za akiba (picha halisi za kanisa zilizo kwenye tovuti) API ikishindwa. */
function fallbackAlbums() {
  const by = new Map()
  for (const g of S.galleryImages) {
    if (!by.has(g.album)) by.set(g.album, { slug: slugify(g.album), title: g.album, description: '', date: null, photos: [], videos: [] })
    by.get(g.album).photos.push(g.src)
  }
  return [...by.values()].map((a) => ({ ...a, cover: a.photos[0] }))
}

/** Albamu zote za matunzio: { albums, loading }. */
export function useGallery() {
  const [state, setState] = useState({ albums: [], loading: true })
  useEffect(() => {
    let alive = true
    apiFetch('/gallery')
      .then((albums) => alive && setState({ albums: albums.length ? albums : fallbackAlbums(), loading: false }))
      .catch(() => alive && setState({ albums: fallbackAlbums(), loading: false }))
    return () => {
      alive = false
    }
  }, [])
  return state
}

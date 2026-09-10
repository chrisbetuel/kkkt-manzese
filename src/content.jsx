import { createContext, useContext, useEffect, useState } from 'react'
import * as S from './data/site.js'

const API = import.meta.env.VITE_API_URL || ''
export const apiUrl = (path) => `${API}/api${path}`

// ---- shape returned everywhere via useSite() ----
const fallbackBundle = {
  church: S.church,
  pastorWelcome: S.pastorWelcome,
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
  services: S.services,
  departments: S.departments,
  events: S.events,
  announcements: S.announcements,
  sermons: S.sermons,
  testimonies: S.testimonies,
  givingMethods: S.givingMethods,
  partnerWays: S.partnerWays,
  leadership: S.leadership,
  galleryImages: S.galleryImages,
  quickLinks: S.quickLinks,
}

const nonEmpty = (a, fb) => (Array.isArray(a) && a.length ? a : fb)

function normalize(d) {
  const s = d.settings || {}
  return {
    church: s.church || S.church,
    pastorWelcome: s.pastorWelcome || S.pastorWelcome,
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

    services: nonEmpty(d.services, []).map((x) => ({
      day: x.day, name: x.name, time: x.time_label, note: x.note,
    })),
    departments: nonEmpty(d.departments, []).map((x) => ({
      slug: x.slug, name: x.name, leader: x.leader, meets: x.meets,
      icon: x.icon, color: x.color || 'from-navy-800 to-navy-950', text: x.description,
    })),
    events: nonEmpty(d.events, []).map((x) => ({
      title: x.title, tag: x.tag, date: x.date_label, time: x.time_label,
      location: x.location, text: x.description, image: x.imageUrl || '',
    })),
    announcements: nonEmpty(d.announcements, []).map((x) => ({
      title: x.title, date: x.date_label, text: x.body, image: x.imageUrl || '',
    })),
    sermons: nonEmpty(d.sermons, []).map((x) => ({
      title: x.title, preacher: x.preacher, series: x.series, scripture: x.scripture,
      date: x.preached_on, summary: x.summary, type: x.type || 'video',
      link: x.link || '', youtubeId: x.youtube_id || '',
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
        : S.leadership,

    galleryImages: S.galleryImages,
    quickLinks: S.quickLinks,
  }
}

const ContentContext = createContext(fallbackBundle)

export function ContentProvider({ children }) {
  const [bundle, setBundle] = useState(fallbackBundle)

  useEffect(() => {
    let alive = true
    fetch(apiUrl('/content'), { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => alive && setBundle(normalize(d)))
      .catch(() => {}) // keep the static fallback
    return () => {
      alive = false
    }
  }, [])

  return <ContentContext.Provider value={bundle}>{children}</ContentContext.Provider>
}

export const useSite = () => useContext(ContentContext)

// ---- form helpers ----
export async function postSubmission(type, { name, email, phone, ...fields }) {
  const res = await fetch(apiUrl('/submissions'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ type, name, email, phone, fields }),
  })
  if (!res.ok) throw new Error('submission failed')
  return res.json()
}

export async function postTestimony(formData) {
  const res = await fetch(apiUrl('/testimonies'), {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData, // FormData (supports file upload)
  })
  if (!res.ok) throw new Error('testimony failed')
  return res.json()
}

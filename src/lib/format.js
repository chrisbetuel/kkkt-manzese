const MONTHS = ['Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba']
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi']

export const monthName = (i, lang = 'sw') => (lang === 'en' ? MONTHS_EN : MONTHS)[i]

/** "25 Desemba 2026" */
export function fmtDate(iso, { lang = 'sw', weekday = false } = {}) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const s = `${d.getDate()} ${monthName(d.getMonth(), lang)} ${d.getFullYear()}`
  return weekday && lang === 'sw' ? `${DAYS[d.getDay()]}, ${s}` : s
}

/** "09:00" (saa 24 — kuepuka mkanganyiko wa saa za Kiswahili na am/pm) */
export function fmtTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export const money = (v) => `TSh ${Number(v || 0).toLocaleString('en-US')}`

export function waShare(text, url) {
  return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`
}

/** Kiungo cha "ongeza kwenye Google Calendar". */
export function googleCalendarUrl({ title, startsAt, endsAt, location, details }) {
  if (!startsAt) return null
  const f = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const end = endsAt || new Date(new Date(startsAt).getTime() + 2 * 3600 * 1000).toISOString()
  const q = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${f(startsAt)}/${f(end)}`, location: location || '', details: details || '' })
  return `https://calendar.google.com/calendar/render?${q}`
}

/** Namba ya WhatsApp katika mfumo wa kimataifa (tarakimu pekee, 0 -> 255). */
export function waNumber(raw = '') {
  let n = String(raw || '').replace(/\D/g, '')
  if (!n) return ''
  if (n.startsWith('0')) n = '255' + n.slice(1)
  return n
}

/** Kiungo cha wa.me chenye ujumbe wa awali (si lazima). */
export function waLink(raw, text = '') {
  const n = waNumber(raw)
  if (!n) return ''
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

// Picha halisi za usharika (public/images/kanisa) — zinatumika pale maudhui hayana picha yake.

export const photo = (name, small = false) => `/images/kanisa/${name}${small ? '-sm' : ''}.jpg`

export const CHURCH_PHOTOS = [
  'maombi-ibada',
  'ubatizo-familia',
  'mchungaji-madhabahu',
  'mahubiri-mimbari',
  'baba-na-mtoto',
  'washirika',
]

// tukio lisilo na picha hupewa picha kulingana na aina/jina lake
const MATCH = [
  [/ubatizo|mtoto|watoto|shule ya jumapili/, 'baba-na-mtoto'],
  [/maombi|sala|masifa|mkesha/, 'maombi-ibada'],
  [/mahubiri|neno|semina|mafundisho|kipaimara/, 'mahubiri-mimbari'],
  [/krismasi|pasaka|sikukuu|ibada/, 'mchungaji-madhabahu'],
  [/vijana|harambee|ujenzi|mkutano|ushirika|diakonia|wagonjwa/, 'washirika'],
]

/**
 * Picha kwa kila kipengele (tukio/tangazo). Kilicho na picha yake huitumia;
 * vingine hupewa picha ya usharika bila kurudia hadi picha zote zitumike.
 */
export function fallbackPhotos(list, { offset = 0 } = {}) {
  const used = new Set()
  return list.map((item, i) => {
    if (item.image) return item.image
    if (used.size >= CHURCH_PHOTOS.length) used.clear()
    const text = `${item.tag || ''} ${item.title || ''}`.toLowerCase()
    const hit = MATCH.find(([re]) => re.test(text))?.[1]
    const name =
      hit && !used.has(hit)
        ? hit
        : CHURCH_PHOTOS.map((_, k) => CHURCH_PHOTOS[(k + i + offset) % CHURCH_PHOTOS.length]).find((n) => !used.has(n))
    used.add(name)
    return photo(name, true)
  })
}

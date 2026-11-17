// Muundo wa menyu: makundi kama ilivyoombwa (Mwanzo, Kuhusu Sisi, Ibada, Huduma, Jumuiya, Matukio,
// Mafundisho, Habari na Matangazo, Maktaba, Mawasiliano). Kila kipengele kina Kiswahili (msingi) na Kiingereza.
export const navGroups = [
  { sw: 'Mwanzo', en: 'Home', to: '/' },
  {
    sw: 'Kuhusu Sisi', en: 'About', to: '/kuhusu',
    items: [
      { sw: 'Historia na Imani', en: 'History & Beliefs', to: '/kuhusu' },
      { sw: 'Uongozi', en: 'Leadership', to: '/uongozi' },
      { sw: 'Miradi ya Maendeleo', en: 'Church Projects', to: '/miradi' },
    ],
  },
  {
    sw: 'Ibada', en: 'Worship', to: '/ratiba',
    items: [
      { sw: 'Ratiba ya Ibada', en: 'Service Times', to: '/ratiba' },
      { sw: 'Tazama Ibada Mubashara', en: 'Watch Live', to: '/tazama' },
      { sw: 'Sadaka na Michango', en: 'Giving', to: '/michango' },
      { sw: 'Ubatizo', en: 'Baptism', to: '/ubatizo' },
    ],
  },
  {
    sw: 'Huduma', en: 'Ministries', to: '/idara',
    items: [
      { sw: 'Huduma na Kwaya', en: 'Ministries & Choirs', to: '/idara' },
      { sw: 'Shiriki Nasi', en: 'Get Involved', to: '/shiriki' },
      { sw: 'Jiunge na Kwaya / Timu', en: 'Join a Team', to: '/jiunge' },
      { sw: 'Kujitolea', en: 'Volunteer', to: '/kujitolea' },
    ],
  },
  { sw: 'Jumuiya', en: 'Fellowships', to: '/jumuiya' },
  { sw: 'Matukio', en: 'Events', to: '/matukio' },
  {
    sw: 'Mafundisho', en: 'Teaching', to: '/mahubiri',
    items: [
      { sw: 'Mahubiri', en: 'Sermons', to: '/mahubiri' },
      { sw: 'Neno la Leo', en: 'Daily Devotion', to: '/neno-la-leo' },
      { sw: 'Mipango ya Kusoma Biblia', en: 'Bible Reading Plans', to: '/mipango-ya-kusoma' },
      { sw: 'Elimu ya Kikristo', en: 'Christian Education', to: '/elimu' },
    ],
  },
  {
    sw: 'Habari', en: 'News', to: '/habari',
    items: [
      { sw: 'Habari na Matangazo', en: 'News & Announcements', to: '/habari' },
      { sw: 'Picha na Video', en: 'Photos & Videos', to: '/matunzio' },
    ],
  },
  { sw: 'Maktaba', en: 'Library', to: '/maktaba' },
  {
    sw: 'Mawasiliano', en: 'Contact', to: '/wasiliana',
    items: [
      { sw: 'Wasiliana Nasi', en: 'Contact Us', to: '/wasiliana' },
      { sw: 'Maombi na Huduma ya Kichungaji', en: 'Prayer & Pastoral Care', to: '/maombi' },
      { sw: 'Mgeni? Karibu', en: 'New here? Welcome', to: '/karibu' },
    ],
  },
]

// Vitendo vikuu (vinaonekana daima)
export const ctas = {
  join: { sw: 'Jiunge Nasi', en: 'Join Us', to: '/jisajili' },
  watch: { sw: 'Tazama Ibada', en: 'Watch Live', to: '/tazama' },
  pray: { sw: 'Omba Maombi', en: 'Prayer Request', to: '/maombi' },
}

// ---- kwa kurasa za zamani zinazotumia orodha bapa ----
export const navLinks = navGroups.flatMap((g) => (g.items ? g.items : [g])).map((l) => ({ label: l.sw, to: l.to }))
  .filter((l, i, a) => a.findIndex((x) => x.to === l.to) === i)
export const homeLinks = navLinks.filter((l) => l.to !== '/')
export const moreLinks = []
export const ctaLink = { label: 'Toa Sadaka', to: '/michango' }

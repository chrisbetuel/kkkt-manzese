// =============================================================
//  KKKT MANZESE — Taarifa kuu za tovuti
//  Badilisha maadili yaliyo na [JAZA] na taarifa halisi za kanisa.
// =============================================================

export const church = {
  name: 'KKKT Manzese',
  fullName: 'Kanisa la Kiinjili la Kilutheri Tanzania',
  parish: 'Usharika wa Manzese',
  tagline: 'Tukikua pamoja katika neema na kweli ya Kristo',
  logo: '/logo.png', // weka nembo rasmi hapa; ikikosekana tunatumia /logo.svg
  logoFallback: '/logo.svg',
  founded: '[JAZA mwaka]',
  address: '[JAZA anwani], Manzese, Dar es Salaam, Tanzania',
  poBox: 'S.L.P [JAZA], Dar es Salaam',
  phone: '+255 [JAZA namba]',
  phoneAlt: '+255 [JAZA namba ya pili]',
  whatsapp: '', // namba ya WhatsApp, mfano: 255712345678
  email: 'info@kkktmanzese.or.tz',
  mapEmbed:
    'https://www.google.com/maps?q=Manzese,Dar+es+Salaam,Tanzania&output=embed',
  mapLink: 'https://maps.google.com/?q=Manzese+Dar+es+Salaam',
  social: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    youtube: 'https://youtube.com/',
  },
}

export const pastorWelcome = {
  name: 'Mchungaji Kiongozi',
  title: 'Mchungaji Kiongozi — KKKT Manzese',
  photo:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=70',
  message:
    'Karibu katika familia ya Mungu hapa Manzese. Iwe unatafuta mahali pa kuabudu au unarejea nyumbani — mlango wetu uko wazi. Mungu akubariki.',
}

export const beliefs = {
  history:
    'Usharika ulianzishwa mwaka [JAZA] ukihudumia waumini wa Kilutheri wa Manzese na maeneo ya jirani. Umekua kutoka kundi dogo hadi jumuiya yenye idara na vikundi vya kila rika. [JAZA historia fupi].',
  vision: 'Usharika hai unaomtukuza Mungu na kuleta mabadiliko katika jamii. [JAZA dira]',
  mission:
    'Kuhubiri Injili, kufundisha Neno, na kuhudumia jamii kiroho na kimwili. [JAZA dhamira]',
  confession:
    'Biblia ni Neno la Mungu na kanuni pekee ya imani. Tunakiri maungamo ya Kilutheri na Katekismo ya Luther. Wokovu ni kwa neema pekee, kwa imani pekee, katika Kristo pekee.',
}

export const values = [
  {
    icon: 'book',
    title: 'Neno la Mungu',
    text: 'Biblia ndiyo msingi wa kila tunachofundisha na kuishi.',
  },
  {
    icon: 'cross',
    title: 'Neema pekee',
    text: 'Tunaokolewa kwa neema ya Mungu kupitia imani katika Yesu Kristo.',
  },
  {
    icon: 'hands',
    title: 'Ushirika',
    text: 'Tunakua pamoja kama familia moja katika upendo na kuhudumiana.',
  },
  {
    icon: 'heart',
    title: 'Huduma kwa jamii',
    text: 'Tunaakisi upendo wa Kristo kwa vitendo katika jamii ya Manzese.',
  },
]

export const services = [
  {
    day: 'Jumapili',
    name: 'Ibada ya Kwanza',
    time: '[JAZA saa] asubuhi',
    note: 'Kiswahili · Ibada ya jumla',
  },
  {
    day: 'Jumapili',
    name: 'Ibada ya Pili',
    time: '[JAZA saa]',
    note: 'Kiswahili · Kwaya Kuu',
  },
  {
    day: 'Jumapili',
    name: 'Katekesi / Shule ya Jumapili',
    time: '[JAZA saa]',
    note: 'Watoto na vijana',
  },
  {
    day: 'Jumatano',
    name: 'Ibada ya Katikati ya Wiki',
    time: '[JAZA saa] jioni',
    note: 'Maombi na Neno',
  },
  {
    day: 'Ijumaa',
    name: 'Mazoezi ya Kwaya',
    time: '[JAZA saa] jioni',
    note: 'Kwaya zote',
  },
]

export const sacraments = [
  { title: 'Ubatizo', text: 'Watoto na watu wazima, baada ya maandalizi.' },
  { title: 'Ushirika Mtakatifu', text: 'Kila Jumapili ya [JAZA] na sikukuu za kanisa.' },
  { title: 'Ndoa', text: 'Mafunzo ya ndoa kabla ya harusi kanisani.' },
  { title: 'Mazishi', text: 'Huduma ya faraja kwa familia zilizofiwa.' },
]

export const leadership = {
  clergy: [
    {
      name: '[JAZA jina]',
      role: 'Mchungaji Kiongozi',
      photo:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=70',
      bio: 'Huduma ya Neno na Sakramenti.',
    },
    {
      name: '[JAZA jina]',
      role: 'Mchungaji Msaidizi',
      photo:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=70',
      bio: 'Huduma za vijana na uinjilisti.',
    },
    {
      name: '[JAZA jina]',
      role: 'Mwinjilisti',
      photo:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=70',
      bio: 'Uinjilisti na malezi ya kiroho.',
    },
  ],
  council: [
    { name: '[JAZA jina]', role: 'Mwenyekiti wa Halmashauri' },
    { name: '[JAZA jina]', role: 'Katibu wa Usharika' },
    { name: '[JAZA jina]', role: 'Mweka Hazina' },
    { name: '[JAZA jina]', role: 'Mzee wa Kanisa' },
    { name: '[JAZA jina]', role: 'Mzee wa Kanisa' },
    { name: '[JAZA jina]', role: 'Mwakilishi wa Vijana' },
  ],
}

export const departments = [
  {
    slug: 'kwaya-kuu',
    name: 'Kwaya Kuu',
    leader: '[JAZA jina la kiongozi]',
    meets: 'Mazoezi: Ijumaa & Jumapili',
    color: 'from-navy-700 to-navy-900',
    icon: 'music',
    text: 'Huongoza kuabudu katika ibada za Jumapili na matukio ya kanisa.',
  },
  {
    slug: 'vijana',
    name: 'Umoja wa Vijana (UKVKKKT)',
    leader: '[JAZA jina la kiongozi]',
    meets: 'Kila Jumamosi jioni',
    color: 'from-gold-600 to-gold-800',
    icon: 'spark',
    text: 'Ibada, semina, michezo na miradi ya vijana.',
  },
  {
    slug: 'wanawake',
    name: 'Umoja wa Wanawake (UWAKKKT)',
    leader: '[JAZA jina la kiongozi]',
    meets: 'Alhamisi & Jumapili',
    color: 'from-navy-600 to-navy-800',
    icon: 'flower',
    text: 'Maombi, mafundisho na huduma kwa wahitaji.',
  },
  {
    slug: 'wanaume',
    name: 'Umoja wa Wanaume (UWAMKKKT)',
    leader: '[JAZA jina la kiongozi]',
    meets: 'Jumapili ya kwanza ya mwezi',
    color: 'from-navy-800 to-navy-950',
    icon: 'shield',
    text: 'Uongozi wa familia, ujenzi na uchumi wa usharika.',
  },
  {
    slug: 'shule-ya-jumapili',
    name: 'Shule ya Jumapili / Watoto',
    leader: '[JAZA jina la kiongozi]',
    meets: 'Kila Jumapili wakati wa ibada',
    color: 'from-gold-500 to-gold-700',
    icon: 'child',
    text: 'Hadithi za Biblia, nyimbo na malezi kwa watoto.',
  },
]

export const events = [
  {
    title: 'Ibada Kuu ya Jumapili',
    date: 'Kila Jumapili',
    time: '[JAZA saa]',
    location: 'Kanisani KKKT Manzese',
    tag: 'Ibada',
    text: 'Mahubiri, sifa na Ushirika Mtakatifu.',
  },
  {
    title: 'Semina ya Vijana',
    date: '[JAZA tarehe]',
    time: '[JAZA saa]',
    location: 'Ukumbi wa Usharika',
    tag: 'Semina',
    text: 'Semina ya siku moja kwa vijana.',
  },
  {
    title: 'Harambee ya Ujenzi',
    date: '[JAZA tarehe]',
    time: '[JAZA saa]',
    location: 'Uwanja wa Kanisa',
    tag: 'Harambee',
    text: 'Mchango kwa mradi wa ujenzi wa [JAZA].',
  },
  {
    title: 'Ibada ya Krismasi',
    date: '25 Desemba',
    time: '[JAZA saa]',
    location: 'Kanisani KKKT Manzese',
    tag: 'Sikukuu',
    text: 'Ibada maalum ya kuzaliwa kwa Kristo.',
  },
]

export const sermons = [
  {
    title: 'Neema Inayotosha',
    preacher: '[JAZA jina la mhubiri]',
    date: '[JAZA tarehe]',
    scripture: '2 Wakorintho 12:9',
    series: 'Kuishi kwa Imani',
    type: 'video',
    link: '',
    summary: 'Katika udhaifu wetu, nguvu ya Mungu hukamilika.',
  },
  {
    title: 'Msamaha wa Kweli',
    preacher: '[JAZA jina la mhubiri]',
    date: '[JAZA tarehe]',
    scripture: 'Mathayo 18:21-35',
    series: 'Maisha ya Ufalme',
    type: 'video',
    link: '',
    summary: 'Kusamehe bila kikomo, kama Mungu anavyotusamehe.',
  },
  {
    title: 'Mwanga wa Ulimwengu',
    preacher: '[JAZA jina la mhubiri]',
    date: '[JAZA tarehe]',
    scripture: 'Mathayo 5:14-16',
    series: 'Mahubiri ya Mlimani',
    type: 'video',
    link: '',
    summary: 'Tumeitwa kung’aa kwa matendo mema yanayomtukuza Mungu.',
  },
]

// Matunzio yamepangwa kwa albamu — mtumiaji huchagua anayotaka kuona.
const U = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`

export const galleryImages = [
  { album: 'Ibada', src: U('1438032005730-c779502df39b'), caption: 'Ibada ya Jumapili' },
  { album: 'Ibada', src: U('1507692049790-de58290a4334'), caption: 'Ndani ya kanisa' },
  { album: 'Ibada', src: U('1511988617509-a57c8a288659'), caption: 'Ushirika baada ya ibada' },
  { album: 'Kwaya', src: U('1445445290350-18a3b86e0b5a'), caption: 'Kwaya Kuu ikiimba' },
  { album: 'Kwaya', src: U('1510915361894-db8b60106cb1'), caption: 'Mazoezi ya kwaya' },
  { album: 'Vijana', src: U('1529070538774-1843cb3265df'), caption: 'Semina ya vijana' },
  { album: 'Vijana', src: U('1523240795612-9a054b0db644'), caption: 'Mkutano wa vijana' },
  { album: 'Ubatizo', src: U('1438032005730-c779502df39b'), caption: 'Ubatizo Mtakatifu' },
  { album: 'Ushirika', src: U('1511988617509-a57c8a288659'), caption: 'Chai baada ya ibada' },
  { album: 'Ujenzi', src: U('1466629437334-b4f6603563c5'), caption: 'Harambee ya ujenzi' },
  { album: 'Ujenzi', src: U('1541888946425-d81bb19240f5'), caption: 'Ujenzi unaendelea' },
  { album: 'Watoto', src: U('1508963493744-76fce69379c0'), caption: 'Shule ya Jumapili' },
  { album: 'Sikukuu', src: U('1516450360452-9312f5e86fc7'), caption: 'Sherehe ya Krismasi' },
]

export const givingMethods = [
  {
    name: 'M-Pesa (Vodacom)',
    group: 'Simu / Mobile Money',
    holder: 'KKKT Manzese',
    number: '[JAZA namba]',
    icon: 'phone',
  },
  {
    name: 'Mixx by Yas (Tigo Pesa)',
    group: 'Simu / Mobile Money',
    holder: 'KKKT Manzese',
    number: '[JAZA namba]',
    icon: 'phone',
  },
  {
    name: 'Airtel Money',
    group: 'Simu / Mobile Money',
    holder: 'KKKT Manzese',
    number: '[JAZA namba]',
    icon: 'phone',
  },
  {
    name: 'Akaunti ya Benki',
    group: 'Benki',
    holder: 'KKKT Usharika wa Manzese',
    number: '[JAZA] · Benki: [JAZA]',
    icon: 'bank',
  },
]

export const givingInPerson =
  'Pia unaweza kutoa ana kwa ana wakati wa ibada au ofisini (Jumatatu–Ijumaa).'

export const givingPurposes = [
  { title: 'Zaka', text: 'Sehemu ya kumi ya kipato chako.' },
  { title: 'Sadaka', text: 'Toleo la hiari kwa kazi ya Mungu.' },
  { title: 'Mradi wa Ujenzi', text: 'Miundombinu ya usharika.' },
  { title: 'Huduma kwa Wahitaji', text: 'Yatima, wajane na familia zenye uhitaji.' },
]

export const quickLinks = [
  { label: 'Kuhusu Sisi', to: '/kuhusu' },
  { label: 'Ratiba ya Ibada', to: '/ratiba' },
  { label: 'Wasiliana Nasi', to: '/wasiliana' },
]

// =============================================================
//  SHIRIKI — Jiunge, jitolee, jiandikishe
// =============================================================

export const involveOptions = [
  { title: 'Jiandikishe kwa Ubatizo', text: 'Wewe au mtoto wako.', to: '/ubatizo', icon: 'cross' },
  { title: 'Jiunge na Kwaya / Kikundi', text: 'Tumia kipawa chako.', to: '/jiunge', icon: 'music' },
  { title: 'Jitolee Kuhudumu', text: 'Saidia katika huduma.', to: '/kujitolea', icon: 'hands' },
  { title: 'Shiriki Ushuhuda', text: 'Simulia kazi ya Mungu.', to: '/ushuhuda', icon: 'heart' },
  { title: 'Toa Sadaka & Zaka', text: 'Changia kazi ya Injili.', to: '/michango', icon: 'hand' },
  { title: 'Ubia na Uwekezaji', text: 'Kuwa mshirika wa maendeleo.', to: '/ubia', icon: 'shield' },
  { title: 'Pakia Hubiri', text: 'Kwa timu ya media.', to: '/mahubiri/pakia', icon: 'play' },
]

// =============================================================
//  UBIA NA UWEKEZAJI — Partnership & investment
// =============================================================

export const partnerWays = [
  {
    title: 'Mshirika wa Kila Mwezi',
    icon: 'heart',
    text: 'Weka ahadi ya mchango wa kila mwezi unaosaidia huduma kuendelea kwa uhakika.',
  },
  {
    title: 'Wekeza katika Miradi',
    icon: 'bank',
    text: 'Changia mradi maalum — ujenzi, vifaa, au chombo cha usafiri — kwa kiasi unachoweza.',
  },
  {
    title: 'Ubia wa Biashara / Ujuzi',
    icon: 'hands',
    text: 'Toa utaalamu, huduma au bidhaa za kampuni yako kusaidia kazi ya kanisa.',
  },
  {
    title: 'Wafadhili wa Huduma kwa Jamii',
    icon: 'child',
    text: 'Fadhili elimu, afya au chakula kwa yatima na familia zenye uhitaji Manzese.',
  },
]

// =============================================================
//  HABARI / MATANGAZO — What's going on
// =============================================================

export const announcements = [
  {
    title: 'Ratiba mpya ya ibada',
    date: '[JAZA tarehe]',
    text: 'Tafadhali angalia nyakati mpya za ibada za Jumapili.',
  },
  {
    title: 'Usajili wa Katekism umefunguliwa',
    date: '[JAZA tarehe]',
    text: 'Vijana na watu wazima wanaotaka kubatizwa wajiandikishe ofisini.',
  },
  {
    title: 'Kikao cha Halmashauri ya Usharika',
    date: '[JAZA tarehe]',
    text: 'Wajumbe wote wahudhurie ukumbi wa usharika.',
  },
]

// Kwaya na vikundi vinavyopokea wanachama wapya
export const choirs = [
  { value: 'Kwaya Kuu', label: 'Kwaya Kuu', desc: 'Ibada kuu za Jumapili.' },
  { value: 'Kwaya ya Vijana', label: 'Kwaya ya Vijana', desc: 'Mahadhi ya kisasa.' },
  { value: 'Kwaya ya Wamama', label: 'Kwaya ya Wamama', desc: 'Umoja wa Wanawake.' },
  { value: 'Kwaya ya Kalvari', label: 'Kwaya ya Kalvari', desc: 'Nyimbo za jadi na uinjilisti.' },
]

// Timu nyingine za huduma (si za wimbo)
export const serviceTeams = [
  'Utumishi wa Meza (Ushering)',
  'Timu ya Media na Sauti',
  'Maombezi',
  'Huduma kwa Wagonjwa',
  'Shule ya Jumapili (Walimu)',
  'Usafi na Mapokezi',
]

export const volunteerAreas = [
  'Media, sauti na utangazaji',
  'Ushering na mapokezi ya wageni',
  'Walimu wa Shule ya Jumapili',
  'Kwaya na muziki',
  'Maombezi',
  'Huduma kwa wagonjwa na wazee',
  'Usafi wa kanisa',
  'Ulinzi na usalama',
  'Michango na uhasibu',
  'Ujenzi na matengenezo',
]

export const baptismChecklist = [
  'Cheti cha kuzaliwa au kitambulisho',
  'Majina ya wazazi na wadhamini',
  'Watu wazima: masomo ya katekism',
  'Kupanga tarehe na ofisi ya kanisa',
]

// =============================================================
//  USHUHUDA — Testimonies (mifano; zitabadilishwa na halisi)
// =============================================================

export const testimonies = [
  {
    type: 'text',
    name: '[JAZA jina]',
    role: 'Mwanausharika',
    date: '2025',
    text: 'Mungu amenirudisha kwenye imani baada ya miaka mingi. Kupitia ushirika wa KKKT Manzese nimepata familia mpya ya kiroho na amani ya moyoni.',
  },
  {
    type: 'video',
    name: '[JAZA jina]',
    role: 'Kiongozi wa Vijana',
    date: '2025',
    text: 'Jinsi Mungu alivyobadilisha maisha yangu kupitia kwaya ya vijana.',
    youtubeId: '', // weka kitambulisho cha YouTube (mfano: dQw4w9WgXcQ)
  },
  {
    type: 'audio',
    name: '[JAZA jina]',
    role: 'Mama wa nyumbani',
    date: '2024',
    text: 'Ushuhuda wa uponyaji na maombezi ya kanisa.',
    audioUrl: '', // weka kiungo cha faili ya sauti (mp3)
  },
]

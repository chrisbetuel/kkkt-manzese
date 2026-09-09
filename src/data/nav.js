export const navLinks = [
  { label: 'Nyumbani', to: '/' },
  { label: 'Kuhusu', to: '/kuhusu' },
  { label: 'Uongozi', to: '/uongozi' },
  { label: 'Ratiba', to: '/ratiba' },
  { label: 'Idara', to: '/idara' },
  { label: 'Matukio', to: '/matukio' },
  { label: 'Mahubiri', to: '/mahubiri' },
  { label: 'Shiriki', to: '/shiriki' },
  { label: 'Matunzio', to: '/matunzio' },
  { label: 'Ushuhuda', to: '/ushuhuda' },
  { label: 'Ubia', to: '/ubia' },
  { label: 'Wasiliana', to: '/wasiliana' },
]

// Faharasa ya ukurasa wa nyumbani (isiyo na "Nyumbani")
export const homeLinks = navLinks.filter((l) => l.to !== '/')

// Kitufe cha wito maalum
export const ctaLink = { label: 'Toa Sadaka', to: '/michango' }

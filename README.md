# KKKT Manzese — Tovuti Rasmi

Tovuti ya Usharika wa KKKT Manzese (Kanisa la Kiinjili la Kilutheri Tanzania), imejengwa kwa **React + Vite + Tailwind CSS + React Router**.

## Kuanza

```bash
npm install
npm run dev      # kufungua kwenye http://localhost:5173
npm run build    # kutengeneza toleo la uzalishaji (dist/)
npm run preview  # kuangalia toleo la build
```

## Nembo ya Kanisa

Weka nembo rasmi ya KKKT hapa: **`public/logo.png`** (au `public/logo.svg`).
Ikiwa haipo, tovuti hutumia nembo ya muda `public/logo.svg`.
Ukibadilisha jina la faili, sasisha `src/data/site.js` → `church.logo`.

Favicon: `public/favicon.svg`.

## Kuhariri Maudhui

Karibu maudhui yote yako sehemu moja: **`src/data/site.js`**
(taarifa za kanisa, ratiba, uongozi, idara, matukio, mahubiri, michango, picha).
Menyu: **`src/data/nav.js`**.

Tafuta alama `[JAZA ...]` na uziweke taarifa halisi (mwaka wa kuanzishwa, namba za simu,
namba za M-Pesa/benki, majina ya viongozi, saa za ibada, n.k.).

## Kurasa

| Njia | Ukurasa |
|------|---------|
| `/` | Nyumbani — skrini moja isiyosogezwa (no scroll); utambulisho + viungo kwa kila sehemu |
| `/kuhusu` | Kuhusu Sisi (Historia, Dira, Dhamira, Imani) |
| `/uongozi` | Uongozi wa Kanisa |
| `/ratiba` | Ratiba ya Ibada na Huduma |
| `/idara` | Idara na Vikundi |
| `/matukio` | Matukio na Kalenda |
| `/mahubiri` | Habari na Mahubiri (sikiliza / tazama / soma) |
| `/mahubiri/pakia` | Pakia hubiri (timu ya media) |
| `/michango` | Sadaka, Zaka na Michango |
| `/matunzio` | Picha na Video |
| `/wasiliana` | Wasiliana Nasi (fomu + ramani) |
| `/shiriki` | Shiriki Nasi (kitovu cha njia zote) |
| `/ubatizo` | Jiandikishe kwa Ubatizo |
| `/jiunge` | Jiunge na kwaya / timu (Kwaya Kuu, Vijana, Wamama, Kalvari) |
| `/kujitolea` | Jiandikishe kujitolea |
| `/ushuhuda` | Ushuhuda — soma na shiriki wako |

## Fomu (Contact, Ubatizo, Jiunge, Kujitolea, Ushuhuda, Pakia Hubiri)

Fomu zote kwa sasa zinaonyesha ujumbe wa mafanikio pekee (hazitumi popote).
Kuunganisha na barua pepe / backend halisi:

- Njia rahisi: **Formspree** au **EmailJS** — badilisha `onSubmit`/`handleSubmit` katika kila ukurasa,
  au katika kifuniko cha pamoja **`src/components/Form.jsx`** (`FormPanel`).
- **Ushuhuda** (`src/pages/Testimonies.jsx`): mawasilisho huhifadhiwa kwenye `localStorage` ya kivinjari
  na huonekana yakiwa na alama "Inasubiri idhini". Kwa uchapishaji halisi, unahitaji backend + mfumo wa idhini.
- **Pakia Hubiri** (`src/pages/UploadSermon.jsx`): kupakia faili kikweli kunahitaji hifadhi
  (mfano Cloudinary, S3, au YouTube kwa video) + backend. Ongeza `audioUrl` / `youtubeId`
  kwenye vitu vya `sermons` katika `src/data/site.js` ili kicheza sauti/video kionekane.

## Toleo la vifurushi

`package.json` inaonyesha `vite ^8.2.2` (rolldown-vite) na `react-router-dom ^7.x`.
Ikiwa `npm install` itashindwa kupata matoleo hayo, rudi kwenye matoleo thabiti:
`vite ^5.4`, `react-router-dom ^6.26`.

## Picha

Picha za mfano zinatoka Unsplash. Zibadilishe na picha halisi za kanisa —
ziweke katika `src/assets/` au `public/` na usasishe viungo katika `src/data/site.js`.

## Kupeleka Mtandaoni (Deploy)

- **Netlify / Vercel**: unganisha repo, amri ya build `npm run build`, folda ya matokeo `dist`.
  Faili `public/_redirects` tayari imewekwa kwa ajili ya SPA routing kwenye Netlify.
- Kikoa kinachopendekezwa: `kkktmanzese.or.tz`
- Hakikisha SSL (https) imewashwa.

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

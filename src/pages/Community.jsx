import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Section } from '../components/Section.jsx'
import { PageIntro, Loading, Empty, BackLink, Badge, Input, ErrorNote, SuccessNote } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { EventCard } from './Events.jsx'
import { errorText, useApi } from '../lib/api.js'
import { useLang, useMeta } from '../lib/prefs.jsx'
import { postSubmission } from '../content.jsx'

/** Orodha ya jumuiya (taarifa za umma tu: jina, eneo, siku ya kukutana). */
export function Jumuiya() {
  const { t } = useLang()
  const { data, loading } = useApi('/jumuiya')
  useMeta(t('Jumuiya', 'Fellowships'))
  return (
    <>
      <PageIntro crumbs={[t('Jumuiya', 'Fellowships')]} eyebrow={t('Jumuiya za Usharika', 'Neighbourhood Fellowships')}
        title={t('Kanisa karibu na nyumbani kwako', 'Church close to your home')}
        intro={t('Jumuiya ni vikundi vya washirika wanaoishi eneo moja: wanaabudu, wanasaidiana na kutembeleana. Ofisi ya kanisa itakuunganisha na jumuiya ya eneo lako.', 'Fellowships are groups of members living in the same area who worship, support and visit one another. The church office will connect you with your area’s fellowship.')} />
      <Section tint="white" className="!pt-0">
        {loading ? <Loading /> : !data?.length ? (
          <Empty icon="users" title={t('Orodha ya jumuiya itawekwa hivi karibuni', 'The fellowship list will be published soon')}
            action={<Link to="/wasiliana" className="btn-navy">{t('Wasiliana na ofisi', 'Contact the office')}</Link>} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((j) => (
              <div key={j.slug} className="card">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-parchment text-gold-700"><Icon name="users" className="h-5 w-5" /></span>
                <h2 className="mt-4 text-lg font-bold">{j.name}</h2>
                {j.area && <p className="mt-1 flex items-center gap-1.5 text-sm text-soft"><Icon name="pin" className="h-4 w-4" />{j.area}</p>}
                {j.meets && <p className="mt-1 flex items-center gap-1.5 text-sm text-soft"><Icon name="clock" className="h-4 w-4" />{j.meets}</p>}
                {j.description && <p className="mt-3 text-sm leading-relaxed">{j.description}</p>}
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 rounded-2xl border border-line bg-cream p-5 text-sm">
          {t('Wewe ni mshirika?', 'Already a member?')} <Link to="/akaunti" className="font-bold underline">{t('Ingia', 'Sign in')}</Link> {t('kuona jumuiya yako na matangazo yake.', 'to see your fellowship and its announcements.')}
        </div>
      </Section>
    </>
  )
}

/** Wasifu wa huduma/kwaya: maelezo, siku za kukutana na matukio yajayo. */
export function MinistryDetail() {
  const { slug } = useParams()
  const { t } = useLang()
  const { data: d, loading, error } = useApi(`/ministries/${slug}`)
  useMeta(d?.name, d?.description)

  if (loading) return <Section tint="white"><Loading rows={1} /></Section>
  if (error || !d) return <Section tint="white"><Empty icon="music" title={t('Huduma haikupatikana', 'Ministry not found')} action={<BackLink to="/idara" />} /></Section>

  return (
    <>
      <PageIntro crumbs={[t('Huduma', 'Ministries'), d.name]} eyebrow={d.kind === 'choir' ? t('Kwaya', 'Choir') : t('Huduma', 'Ministry')} title={d.name} intro={d.description} />
      <Section tint="white" className="!pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            {d.image && <img src={d.image} alt="" className="mb-6 aspect-[16/9] w-full rounded-3xl object-cover" />}
            <h2 className="text-xl font-extrabold">{t('Matukio yajayo', 'Upcoming events')}</h2>
            {d.events?.length ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">{d.events.map((e) => <EventCard key={e.slug} e={e} photo={e.image} />)}</div>
            ) : (
              <p className="mt-3 text-sm text-soft">{t('Hakuna matukio yaliyotangazwa kwa sasa.', 'No events announced at the moment.')}</p>
            )}
          </div>
          <aside className="space-y-3 rounded-3xl border border-line bg-cream p-5">
            {d.meets && <p className="flex items-center gap-2 text-sm"><Icon name="clock" className="h-4 w-4 text-gold-600" />{d.meets}</p>}
            {d.leader && <p className="flex items-center gap-2 text-sm"><Icon name="user" className="h-4 w-4 text-gold-600" />{t('Kiongozi', 'Leader')}: {d.leader}</p>}
            {d.memberCount > 0 && <p className="flex items-center gap-2 text-sm"><Icon name="users" className="h-4 w-4 text-gold-600" />{t(`Wanachama ${d.memberCount}`, `${d.memberCount} members`)}</p>}
            <Link to="/jiunge" className="btn-primary w-full">{t('Jiunge na huduma hii', 'Join this ministry')}</Link>
            <BackLink to="/idara">{t('Huduma zote', 'All ministries')}</BackLink>
          </aside>
        </div>
      </Section>
    </>
  )
}

/** Kadi ya mgeni — "Mgeni? Karibu". */
export function Visitor() {
  const { t } = useLang()
  const [f, setF] = useState({ name: '', phone: '', email: '', area: '', heard: '', interest: '', followUp: true })
  const [state, setState] = useState({ busy: false, ok: false, err: '' })
  useMeta(t('Mgeni? Karibu', 'New here? Welcome'))
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  async function submit(e) {
    e.preventDefault()
    setState({ busy: true, ok: false, err: '' })
    try {
      await postSubmission('visitor', { name: f.name, phone: f.phone, email: f.email || undefined, eneo: f.area, alitusikiaje: f.heard, anapenda: f.interest, afuatiliwe: f.followUp ? 'Ndiyo' : 'Hapana' })
      setState({ busy: false, ok: true, err: '' })
    } catch (err) {
      setState({ busy: false, ok: false, err: errorText(err) })
    }
  }

  return (
    <>
      <PageIntro crumbs={[t('Karibu', 'Welcome')]} eyebrow={t('Wageni', 'Visitors')} title={t('Karibu sana! Tungependa kukufahamu', 'Welcome! We’d love to get to know you')}
        intro={t('Jaza kadi hii fupi ya mgeni. Hutapokea ujumbe mwingi — mtu mmoja kutoka usharika atakusalimu tu kama utapenda.', 'Fill in this short visitor card. You won’t be flooded with messages — someone from the parish will greet you only if you wish.')} />
      <Section tint="white" className="!pt-0">
        <div className="mx-auto max-w-2xl">
          {state.ok ? (
            <SuccessNote>{t('Asante kwa kutembelea KKKT Manzese! Mungu akubariki.', 'Thank you for visiting KKKT Manzese! God bless you.')}</SuccessNote>
          ) : (
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
              <Input label={t('Jina', 'Name')} name="name" required value={f.name} onChange={set('name')} autoComplete="name" />
              <Input label={t('Simu', 'Phone')} name="phone" type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" />
              <Input label={t('Barua pepe (si lazima)', 'Email (optional)')} name="email" type="email" value={f.email} onChange={set('email')} />
              <Input label={t('Unaishi eneo gani?', 'Where do you live?')} name="area" value={f.area} onChange={set('area')} />
              <Input label={t('Ulitusikiaje?', 'How did you hear about us?')} name="heard" value={f.heard} onChange={set('heard')} className="sm:col-span-2" />
              <Input as="textarea" label={t('Ungependa kujua nini zaidi / ombi lolote?', 'Anything you’d like to know or a request?')} name="interest" value={f.interest} onChange={set('interest')} className="sm:col-span-2" />
              <label className="flex items-start gap-3 text-sm sm:col-span-2">
                <input type="checkbox" checked={f.followUp} onChange={set('followUp')} className="mt-1 h-4 w-4" />
                {t('Ningependa mtu wa usharika anipigie / anisalimu.', 'I’d like someone from the parish to contact me.')}
              </label>
              <div className="sm:col-span-2"><ErrorNote>{state.err}</ErrorNote></div>
              <button type="submit" disabled={state.busy} className="btn-primary sm:col-span-2 disabled:opacity-60">{state.busy ? t('Inatuma…', 'Sending…') : t('Tuma kadi ya mgeni', 'Send visitor card')}</button>
            </form>
          )}
        </div>
      </Section>
    </>
  )
}

/** Uthibitisho wa kadi ya uanachama (kupitia QR) — taarifa chache tu. */
export function VerifyCard() {
  const { token } = useParams()
  const { t } = useLang()
  const { data, loading, error } = useApi(`/verify/${token}`)
  useMeta(t('Uthibitisho wa Kadi', 'Card Verification'))
  return (
    <Section tint="cream">
      <div className="mx-auto max-w-md rounded-3xl border border-line bg-white p-8 text-center shadow-card">
        {loading ? <Loading rows={1} /> : data?.valid ? (
          <>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Icon name="done" className="h-8 w-8" /></span>
            <h1 className="mt-4 text-xl font-extrabold">{t('Kadi halali', 'Valid card')}</h1>
            <p className="mt-2 text-lg font-bold">{data.name}</p>
            <p className="text-sm text-soft">{data.reference}</p>
            <div className="mt-4 flex justify-center gap-2">
              <Badge tone="green">{t('Mshirika aliyethibitishwa', 'Verified member')}</Badge>
              {data.memberSince && <Badge tone="navy">{t(`Tangu ${data.memberSince}`, `Since ${data.memberSince}`)}</Badge>}
            </div>
            <p className="mt-4 text-sm text-soft">{data.church}</p>
          </>
        ) : (
          <>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600"><Icon name="x" className="h-8 w-8" /></span>
            <h1 className="mt-4 text-xl font-extrabold">{t('Kadi haitambuliki', 'Card not recognised')}</h1>
            <p className="mt-2 text-sm text-soft">{error?.status === 429 ? t('Majaribio mengi. Jaribu baadaye.', 'Too many attempts. Try later.') : t('Kadi hii haipo, imebatilishwa au mshirika hajathibitishwa.', 'This card does not exist, was revoked, or the member is not verified.')}</p>
          </>
        )}
      </div>
    </Section>
  )
}

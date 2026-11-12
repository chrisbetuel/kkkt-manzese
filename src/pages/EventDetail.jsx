import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Section } from '../components/Section.jsx'
import { PageIntro, Loading, Empty, BackLink, Input, ErrorNote, SuccessNote, Badge } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { apiFetch, apiUrl, errorText, useApi } from '../lib/api.js'
import { useAuth, useLang, useMeta } from '../lib/prefs.jsx'
import { fmtDate, fmtTime, googleCalendarUrl, waShare } from '../lib/format.js'

export default function EventDetail() {
  const { slug } = useParams()
  const { t, lang } = useLang()
  const { user } = useAuth()
  const { data: e, loading, error, reload } = useApi(`/events/${slug}`)
  const [form, setForm] = useState({ name: '', phone: '', guests: 0 })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState({ ok: '', err: '' })
  useMeta(e?.title, e?.description)

  if (loading) return <Section tint="white"><Loading rows={2} /></Section>
  if (error || !e)
    return <Section tint="white"><Empty title={t('Tukio halikupatikana', 'Event not found')} action={<BackLink to="/matukio">{t('Matukio yote', 'All events')}</BackLink>} /></Section>

  const when = e.startsAt
    ? `${fmtDate(e.startsAt, { lang, weekday: true })} · ${fmtTime(e.startsAt)}${e.endsAt ? ` – ${fmtTime(e.endsAt)}` : ''}`
    : [e.dateLabel, e.timeLabel].filter(Boolean).join(' · ')
  const gcal = googleCalendarUrl({ title: e.title, startsAt: e.startsAt, endsAt: e.endsAt, location: e.location, details: window.location.href })

  async function register(ev) {
    ev.preventDefault()
    setBusy(true)
    setMsg({ ok: '', err: '' })
    try {
      await apiFetch(`/events/${slug}/register`, { method: 'POST', body: user ? { guests: form.guests } : form })
      setMsg({ ok: t('Umesajiliwa! Utapokea ujumbe wa uthibitisho na kumbusho kabla ya tukio.', 'You are registered! You will receive a confirmation and a reminder before the event.'), err: '' })
      reload()
    } catch (err) {
      setMsg({ ok: '', err: errorText(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageIntro crumbs={[t('Matukio', 'Events'), e.title]} eyebrow={e.tag || t('Tukio', 'Event')} title={e.title} />
      <Section tint="white" className="!pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            {e.image && <img src={e.image} alt="" className="mb-6 aspect-[16/9] w-full rounded-3xl object-cover" />}
            <ul className="space-y-2 text-[15px]">
              {when && <li className="flex items-center gap-2"><Icon name="calendar" className="h-5 w-5 text-gold-600" />{when}</li>}
              {e.location && <li className="flex items-center gap-2"><Icon name="pin" className="h-5 w-5 text-gold-600" />{e.location}</li>}
              {e.ministry && <li className="flex items-center gap-2"><Icon name="users" className="h-5 w-5 text-gold-600" />{e.ministry}</li>}
              {e.organizer && <li className="flex items-center gap-2"><Icon name="user" className="h-5 w-5 text-gold-600" />{t('Mratibu', 'Organizer')}: {e.organizer}</li>}
            </ul>
            {e.description && <p className="mt-6 whitespace-pre-line text-[16px] leading-relaxed text-ink/80">{e.description}</p>}
          </div>

          <aside className="space-y-3">
            {e.requiresRegistration && (
              <div className="rounded-3xl border border-line bg-cream p-5">
                <h2 className="text-lg font-extrabold">{t('Jisajili kwa tukio hili', 'Register for this event')}</h2>
                {e.capacity && <p className="mt-1 text-sm text-soft">{t(`Nafasi: ${e.capacity}`, `Capacity: ${e.capacity}`)}</p>}
                {msg.ok ? (
                  <div className="mt-4"><SuccessNote>{msg.ok}</SuccessNote></div>
                ) : !e.registrationOpen ? (
                  <div className="mt-4"><Badge tone="red">{e.isFull ? t('Nafasi zimejaa', 'Fully booked') : t('Usajili umefungwa', 'Registration closed')}</Badge></div>
                ) : (
                  <form onSubmit={register} className="mt-4 space-y-3">
                    {!user && (
                      <>
                        <Input label={t('Jina kamili', 'Full name')} name="name" required value={form.name} onChange={(x) => setForm({ ...form, name: x.target.value })} autoComplete="name" />
                        <Input label={t('Namba ya simu', 'Phone number')} name="phone" type="tel" required value={form.phone} onChange={(x) => setForm({ ...form, phone: x.target.value })} autoComplete="tel" placeholder="07XX XXX XXX" />
                      </>
                    )}
                    <Input label={t('Unakuja na wageni wangapi?', 'Number of guests')} name="guests" type="number" min="0" max="10" value={form.guests} onChange={(x) => setForm({ ...form, guests: x.target.value })} />
                    <ErrorNote>{msg.err}</ErrorNote>
                    <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
                      {busy ? t('Inatuma…', 'Sending…') : t('Jisajili', 'Register')}
                    </button>
                    {user && <p className="text-[12px] text-soft">{t('Unasajiliwa kwa akaunti yako ya mshirika.', 'You are registering with your member account.')}</p>}
                  </form>
                )}
              </div>
            )}
            {e.startsAt && (
              <div className="grid grid-cols-2 gap-2">
                {gcal && <a href={gcal} target="_blank" rel="noreferrer" className="btn-navy !px-3 !text-[13px]"><Icon name="calendar" className="h-4 w-4" />Google</a>}
                <a href={apiUrl(`/events/${slug}/calendar.ics`)} className="btn-navy !px-3 !text-[13px]"><Icon name="download" className="h-4 w-4" />{t('Kalenda (.ics)', 'Calendar (.ics)')}</a>
              </div>
            )}
            <a href={waShare(`${e.title} — ${when}`, window.location.href)} target="_blank" rel="noreferrer" className="btn-navy w-full">
              <Icon name="whatsapp" className="h-4 w-4" /> {t('Shiriki kwa WhatsApp', 'Share on WhatsApp')}
            </a>
            <BackLink to="/matukio">{t('Matukio yote', 'All events')}</BackLink>
          </aside>
        </div>
      </Section>
    </>
  )
}

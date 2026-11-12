import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Section } from '../components/Section.jsx'
import { PageIntro, Loading, Empty, Input, ErrorNote, SuccessNote, Tabs, Badge } from '../components/ui.jsx'
import MembershipCard from '../components/MembershipCard.jsx'
import Icon from '../components/Icon.jsx'
import { apiFetch, apiUrl, errorText, useApi } from '../lib/api.js'
import { useAuth, useLang, useMeta } from '../lib/prefs.jsx'
import { fmtDate, fmtTime, money } from '../lib/format.js'

export default function Account() {
  const { user, ready } = useAuth()
  const { t } = useLang()
  useMeta(t('Akaunti Yangu', 'My Account'))

  if (!ready) return <Section tint="white"><Loading rows={1} /></Section>
  return user ? <Dashboard /> : <SignIn />
}

// =====================================================================
// Kuingia / kufungua akaunti / kurejesha nenosiri
// =====================================================================
function SignIn() {
  const { t } = useLang()
  const [mode, setMode] = useState('login')
  return (
    <>
      <PageIntro crumbs={[t('Akaunti', 'Account')]} eyebrow={t('Washirika', 'Members')} title={t('Akaunti ya mshirika', 'Member account')}
        intro={t('Ona wasifu wako, kadi ya uanachama, jumuiya na huduma zako, matangazo na matukio uliyojisajili.', 'See your profile, membership card, fellowship and ministries, announcements and event registrations.')} />
      <Section tint="white" className="!pt-0">
        <div className="mx-auto max-w-md">
          <Tabs value={mode} onChange={setMode} tabs={[
            { value: 'login', label: t('Ingia', 'Sign in') },
            { value: 'activate', label: t('Fungua akaunti', 'Activate account') },
            { value: 'reset', label: t('Umesahau nenosiri?', 'Forgot password?') },
          ]} />
          <div className="mt-6 rounded-3xl border border-line bg-white p-6 shadow-soft">
            {mode === 'login' && <LoginForm />}
            {mode === 'activate' && <ActivateForm />}
            {mode === 'reset' && <ResetForm onDone={() => setMode('login')} />}
          </div>
          <p className="mt-6 text-center text-sm text-soft">
            {t('Bado hujajisajili kama mshirika?', 'Not registered as a member yet?')}{' '}
            <Link to="/jisajili" className="font-bold text-ink underline">{t('Jisajili hapa', 'Register here')}</Link>
          </p>
        </div>
      </Section>
    </>
  )
}

function LoginForm() {
  const { t } = useLang()
  const { login } = useAuth()
  const [f, setF] = useState({ identifier: '', password: '', remember: true })
  const [s, setS] = useState({ busy: false, err: '' })
  async function submit(e) {
    e.preventDefault()
    setS({ busy: true, err: '' })
    try {
      await login(f.identifier, f.password, f.remember)
    } catch (err) {
      setS({ busy: false, err: errorText(err) })
    }
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <Input label={t('Simu, barua pepe au namba ya usajili', 'Phone, email or registration number')} name="identifier" required autoComplete="username"
        value={f.identifier} onChange={(e) => setF({ ...f, identifier: e.target.value })} placeholder="07XX XXX XXX" />
      <Input label={t('Nenosiri', 'Password')} name="password" type="password" required autoComplete="current-password"
        value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={f.remember} onChange={(e) => setF({ ...f, remember: e.target.checked })} className="h-4 w-4" />
        {t('Nikumbuke kwenye kifaa hiki', 'Keep me signed in on this device')}
      </label>
      <ErrorNote>{s.err}</ErrorNote>
      <button type="submit" disabled={s.busy} className="btn-primary w-full disabled:opacity-60">{s.busy ? t('Inaingia…', 'Signing in…') : t('Ingia', 'Sign in')}</button>
    </form>
  )
}

function ActivateForm() {
  const { t } = useLang()
  const { activate } = useAuth()
  const [f, setF] = useState({ reference: '', phone: '', date_of_birth: '', password: '', password_confirmation: '' })
  const [s, setS] = useState({ busy: false, err: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  async function submit(e) {
    e.preventDefault()
    setS({ busy: true, err: '' })
    try {
      await activate(f)
    } catch (err) {
      setS({ busy: false, err: errorText(err) })
    }
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-soft">{t('Kwa washirika waliothibitishwa na ofisi. Tumia namba ya usajili/ahadi uliyopewa (mf. KKKT-MNZ-2026-000123).', 'For members verified by the office. Use the registration/pledge number you received (e.g. KKKT-MNZ-2026-000123).')}</p>
      <Input label={t('Namba ya usajili / ahadi', 'Registration / pledge number')} name="reference" required value={f.reference} onChange={set('reference')} />
      <Input label={t('Simu uliyosajili nayo', 'Phone you registered with')} name="phone" type="tel" required value={f.phone} onChange={set('phone')} autoComplete="tel" />
      <Input label={t('Tarehe ya kuzaliwa', 'Date of birth')} name="date_of_birth" type="date" required value={f.date_of_birth} onChange={set('date_of_birth')} />
      <Input label={t('Nenosiri jipya', 'New password')} name="password" type="password" required autoComplete="new-password" value={f.password} onChange={set('password')}
        hint={t('Angalau herufi 8, zenye herufi na namba.', 'At least 8 characters with letters and numbers.')} />
      <Input label={t('Rudia nenosiri', 'Confirm password')} name="password_confirmation" type="password" required autoComplete="new-password" value={f.password_confirmation} onChange={set('password_confirmation')} />
      <ErrorNote>{s.err}</ErrorNote>
      <button type="submit" disabled={s.busy} className="btn-primary w-full disabled:opacity-60">{t('Fungua akaunti', 'Activate account')}</button>
    </form>
  )
}

function ResetForm({ onDone }) {
  const { t } = useLang()
  const [step, setStep] = useState(1)
  const [f, setF] = useState({ identifier: '', code: '', password: '', password_confirmation: '' })
  const [s, setS] = useState({ busy: false, err: '', ok: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  async function request(e) {
    e.preventDefault()
    setS({ busy: true, err: '', ok: '' })
    try {
      const r = await apiFetch('/auth/forgot', { method: 'POST', body: { identifier: f.identifier } })
      setS({ busy: false, err: '', ok: r.message })
      setStep(2)
    } catch (err) {
      setS({ busy: false, err: errorText(err), ok: '' })
    }
  }
  async function reset(e) {
    e.preventDefault()
    setS({ busy: true, err: '', ok: '' })
    try {
      await apiFetch('/auth/reset', { method: 'POST', body: f })
      setS({ busy: false, err: '', ok: t('Nenosiri limebadilishwa. Ingia sasa.', 'Password changed. Sign in now.') })
      setTimeout(onDone, 1200)
    } catch (err) {
      setS({ busy: false, err: errorText(err), ok: '' })
    }
  }
  return step === 1 ? (
    <form onSubmit={request} className="space-y-4">
      <Input label={t('Simu, barua pepe au namba ya usajili', 'Phone, email or registration number')} name="identifier" required value={f.identifier} onChange={set('identifier')} />
      <ErrorNote>{s.err}</ErrorNote>
      <button type="submit" disabled={s.busy} className="btn-primary w-full">{t('Nitumie msimbo', 'Send me a code')}</button>
    </form>
  ) : (
    <form onSubmit={reset} className="space-y-4">
      <SuccessNote>{s.ok}</SuccessNote>
      <Input label={t('Msimbo wa tarakimu 6', '6-digit code')} name="code" inputMode="numeric" required maxLength={6} value={f.code} onChange={set('code')} />
      <Input label={t('Nenosiri jipya', 'New password')} name="password" type="password" required autoComplete="new-password" value={f.password} onChange={set('password')} />
      <Input label={t('Rudia nenosiri', 'Confirm password')} name="password_confirmation" type="password" required value={f.password_confirmation} onChange={set('password_confirmation')} />
      <ErrorNote>{s.err}</ErrorNote>
      <button type="submit" disabled={s.busy} className="btn-primary w-full">{t('Badilisha nenosiri', 'Change password')}</button>
    </form>
  )
}

// =====================================================================
// Dashibodi ya mshirika
// =====================================================================
function Dashboard() {
  const { t } = useLang()
  const { logout } = useAuth()
  const { data: p, loading, reload } = useApi('/me')
  const { data: notes } = useApi('/me/notifications')
  const { data: songs } = useApi('/me/songs')
  const [tab, setTab] = useState('home')

  if (loading || !p) return <Section tint="white"><Loading rows={2} /></Section>

  const tabs = [
    { value: 'home', label: t('Muhtasari', 'Overview') },
    { value: 'card', label: t('Kadi', 'Card') },
    { value: 'profile', label: t('Wasifu', 'Profile') },
    { value: 'notices', label: `${t('Arifa', 'Notifications')}${notes?.unread ? ` (${notes.unread})` : ''}` },
    ...(songs?.length ? [{ value: 'songs', label: t('Nyimbo za kwaya', 'Choir songs') }] : []),
    ...(p.pledgeVisible ? [{ value: 'giving', label: t('Ahadi na michango', 'Pledges & giving') }] : []),
    { value: 'security', label: t('Usalama', 'Security') },
  ]

  return (
    <>
      <PageIntro crumbs={[t('Akaunti', 'Account')]} eyebrow={t('Karibu', 'Welcome')} title={p.fullName}>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone={p.status === 'approved' ? 'green' : 'gold'}>{p.statusLabel}</Badge>
          <Badge tone="navy">{p.reference}</Badge>
          <button type="button" onClick={logout} className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-ink/70 hover:text-ink">
            <Icon name="logout" className="h-4 w-4" /> {t('Toka', 'Sign out')}
          </button>
        </div>
      </PageIntro>
      <Section tint="white" className="!pt-0">
        <Tabs tabs={tabs} value={tab} onChange={setTab} />
        <div className="mt-6">
          {tab === 'home' && <Overview p={p} />}
          {tab === 'card' && <MembershipCard profile={p} />}
          {tab === 'profile' && <ProfileForm p={p} onSaved={reload} />}
          {tab === 'notices' && <Notices notes={notes} p={p} onSaved={reload} />}
          {tab === 'songs' && <Songs songs={songs} />}
          {tab === 'giving' && <Giving />}
          {tab === 'security' && <PasswordForm />}
        </div>
      </Section>
    </>
  )
}

function Overview({ p }) {
  const { t, lang } = useLang()
  const { data: ann } = useApi('/me/announcements')
  const { data: regs } = useApi('/me/events')
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="card">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-soft"><Icon name="users" className="h-4 w-4" />{t('Jumuiya yangu', 'My fellowship')}</h2>
        {p.jumuiya ? (
          <>
            <p className="mt-3 text-lg font-bold">{p.jumuiya.name}</p>
            {p.jumuiya.meets && <p className="text-sm text-soft">{p.jumuiya.meets}</p>}
          </>
        ) : <p className="mt-3 text-sm text-soft">{t('Bado hujapangiwa jumuiya. Ofisi itakupangia.', 'Not yet assigned. The office will assign you.')}</p>}
        <h2 className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-soft"><Icon name="music" className="h-4 w-4" />{t('Huduma na kwaya', 'Ministries & choirs')}</h2>
        {p.ministries.length ? (
          <ul className="mt-3 space-y-1.5">
            {p.ministries.map((m) => (
              <li key={m.slug} className="flex items-center justify-between gap-2 text-sm">
                <Link to={`/idara/${m.slug}`} className="font-semibold hover:underline">{m.name}</Link>
                {m.role !== 'member' && <Badge>{m.role === 'leader' ? t('Kiongozi', 'Leader') : m.role === 'assistant' ? t('Msaidizi', 'Assistant') : m.role}</Badge>}
                {m.voicePart && <Badge tone="navy">{m.voicePart}</Badge>}
              </li>
            ))}
          </ul>
        ) : <p className="mt-3 text-sm text-soft">—</p>}
      </div>

      <div className="card lg:col-span-2">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-soft"><Icon name="news" className="h-4 w-4" />{t('Matangazo kwa ajili yako', 'Announcements for you')}</h2>
        {ann?.length ? (
          <ul className="mt-3 divide-y divide-line">
            {ann.slice(0, 6).map((a) => (
              <li key={a.slug} className="py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{a.title}</p>
                  {a.audience && <Badge tone="navy">{a.audience}</Badge>}
                </div>
                {a.body && <p className="mt-1 line-clamp-2 text-sm text-soft">{a.body}</p>}
              </li>
            ))}
          </ul>
        ) : <p className="mt-3 text-sm text-soft">{t('Hakuna matangazo kwa sasa.', 'No announcements right now.')}</p>}
      </div>

      <div className="card lg:col-span-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-soft"><Icon name="calendar" className="h-4 w-4" />{t('Matukio niliyojisajili', 'My event registrations')}</h2>
          <Link to="/matukio" className="text-sm font-bold hover:underline">{t('Tazama matukio', 'Browse events')}</Link>
        </div>
        {regs?.length ? (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {regs.map((r) => (
              <li key={r.slug + r.startsAt}>
                <Link to={`/matukio/${r.slug}`} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5 hover:bg-cream">
                  <span>
                    <span className="block text-sm font-semibold">{r.title}</span>
                    <span className="block text-[12px] text-soft">{r.startsAt ? `${fmtDate(r.startsAt, { lang })} · ${fmtTime(r.startsAt)}` : r.dateLabel}</span>
                  </span>
                  {r.attended ? <Badge tone="green">{t('Ulihudhuria', 'Attended')}</Badge> : r.status === 'cancelled' ? <Badge tone="red">{t('Imeghairiwa', 'Cancelled')}</Badge> : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : <p className="mt-3 text-sm text-soft">{t('Hujajisajili kwa tukio lolote bado.', 'You have not registered for any event yet.')}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:col-span-3">
        <Link to="/maombi" className="btn-navy"><Icon name="hands" className="h-4 w-4" />{t('Tuma ombi la maombi', 'Send a prayer request')}</Link>
        <Link to="/ushuhuda" className="btn-navy"><Icon name="heart" className="h-4 w-4" />{t('Shiriki ushuhuda', 'Share a testimony')}</Link>
        <Link to="/mahubiri" className="btn-navy"><Icon name="play" className="h-4 w-4" />{t('Mahubiri', 'Sermons')}</Link>
      </div>
    </div>
  )
}

function ProfileForm({ p, onSaved }) {
  const { t } = useLang()
  const [f, setF] = useState({
    alt_phone: p.altPhone || '', email: p.email || '', address: p.address || '', ward: p.ward || '',
    district: p.district || '', occupation: p.occupation || '', workplace: p.workplace || '',
    spiritual_gifts: (p.spiritualGifts || []).join(', '),
  })
  const [s, setS] = useState({ busy: false, err: '', ok: '' })
  const [photo, setPhoto] = useState(null)
  const [photoKey, setPhotoKey] = useState(0)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  async function save(e) {
    e.preventDefault()
    setS({ busy: true, err: '', ok: '' })
    try {
      await apiFetch('/me', { method: 'PATCH', body: { ...f, spiritual_gifts: f.spiritual_gifts.split(',').map((x) => x.trim()).filter(Boolean) } })
      if (photo) {
        const fd = new FormData()
        fd.append('photo', photo)
        await apiFetch('/me/photo', { method: 'POST', body: fd })
        setPhoto(null)
        setPhotoKey((k) => k + 1)
      }
      setS({ busy: false, err: '', ok: t('Taarifa zimehifadhiwa.', 'Saved.') })
      onSaved()
    } catch (err) {
      setS({ busy: false, err: errorText(err), ok: '' })
    }
  }

  return (
    <form onSubmit={save} className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <div>
        <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-parchment">
          {p.hasPhoto ? <img key={photoKey} src={`${apiUrl('/me/photo')}?v=${photoKey}`} alt="" className="h-full w-full object-cover" />
            : <span className="flex h-full items-center justify-center text-gold-700"><Icon name="user" className="h-12 w-12" /></span>}
        </div>
        <label className="btn-navy mt-3 w-full cursor-pointer !text-[13px]">
          <Icon name="camera" className="h-4 w-4" />{photo ? photo.name.slice(0, 18) : t('Badilisha picha', 'Change photo')}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
        </label>
      </div>
      <div>
        <dl className="mb-6 grid gap-3 rounded-2xl border border-line bg-cream p-4 text-sm sm:grid-cols-3">
          <div><dt className="text-soft">{t('Simu kuu', 'Main phone')}</dt><dd className="font-semibold">{p.phone}</dd></div>
          <div><dt className="text-soft">{t('Tarehe ya kuzaliwa', 'Date of birth')}</dt><dd className="font-semibold">{fmtDate(p.dateOfBirth)}</dd></div>
          <div><dt className="text-soft">{t('Ubatizo', 'Baptism')}</dt><dd className="font-semibold">{p.isBaptized ? `${t('Ndiyo', 'Yes')}${p.baptismYear ? ` (${p.baptismYear})` : ''}` : t('Hapana', 'No')}</dd></div>
        </dl>
        <p className="mb-4 text-[12.5px] text-soft">{t('Jina, simu kuu, tarehe ya kuzaliwa na taarifa za kiroho hubadilishwa na ofisi ya kanisa ili kumbukumbu zibaki sahihi.', 'Name, main phone, date of birth and spiritual records are updated by the church office to keep records accurate.')}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label={t('Simu mbadala', 'Alternative phone')} name="alt_phone" type="tel" value={f.alt_phone} onChange={set('alt_phone')} />
          <Input label={t('Barua pepe', 'Email')} name="email" type="email" value={f.email} onChange={set('email')} />
          <Input label={t('Makazi', 'Address')} name="address" value={f.address} onChange={set('address')} className="sm:col-span-2" />
          <Input label={t('Kata', 'Ward')} name="ward" value={f.ward} onChange={set('ward')} />
          <Input label={t('Wilaya', 'District')} name="district" value={f.district} onChange={set('district')} />
          <Input label={t('Kazi', 'Occupation')} name="occupation" value={f.occupation} onChange={set('occupation')} />
          <Input label={t('Mahali pa kazi', 'Workplace')} name="workplace" value={f.workplace} onChange={set('workplace')} />
          <Input label={t('Karama / maeneo ya kuhudumu (tenganisha kwa koma)', 'Gifts / areas to serve (comma separated)')} name="spiritual_gifts" value={f.spiritual_gifts} onChange={set('spiritual_gifts')} className="sm:col-span-2" />
        </div>
        <div className="mt-4 space-y-3">
          <ErrorNote>{s.err}</ErrorNote>
          <SuccessNote>{s.ok}</SuccessNote>
          <button type="submit" disabled={s.busy} className="btn-primary disabled:opacity-60">{s.busy ? t('Inahifadhi…', 'Saving…') : t('Hifadhi', 'Save')}</button>
        </div>
      </div>
    </form>
  )
}

function Notices({ notes, p, onSaved }) {
  const { t, lang } = useLang()
  const [prefs, setPrefs] = useState(p.commPrefs)
  const [msg, setMsg] = useState('')
  const CATS = [
    ['announcement', t('Matangazo ya usharika', 'Church announcements')],
    ['ministry', t('Matangazo ya huduma/kwaya', 'Ministry & choir notices')],
    ['jumuiya', t('Matangazo ya jumuiya', 'Fellowship notices')],
    ['event', t('Makumbusho ya matukio', 'Event reminders')],
    ['worship', t('Ibada', 'Worship')],
  ]

  useEffect(() => {
    if (notes?.unread) apiFetch('/me/notifications/read', { method: 'POST' }).catch(() => {})
  }, [notes?.unread])

  async function save(next) {
    setPrefs(next)
    try {
      await apiFetch('/me', { method: 'PATCH', body: { comm_prefs: next } })
      setMsg(t('Mapendeleo yamehifadhiwa.', 'Preferences saved.'))
      onSaved()
    } catch (err) {
      setMsg(errorText(err))
    }
  }
  const muted = new Set(prefs.muted || [])

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div>
        {!notes?.items?.length ? <Empty icon="bell" title={t('Hakuna arifa', 'No notifications')} /> : (
          <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
            {notes.items.map((n) => (
              <li key={n.id} className={`px-4 py-3 ${n.read ? '' : 'bg-parchment/60'}`}>
                <p className="text-[12px] text-soft">{fmtDate(n.at, { lang })}</p>
                <p className="font-semibold">{n.title}</p>
                <p className="text-sm text-soft">{n.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="card space-y-4">
        <h2 className="font-bold">{t('Jinsi ya kupokea arifa', 'How you receive notices')}</h2>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" className="h-4 w-4" checked={!!prefs.sms} onChange={(e) => save({ ...prefs, sms: e.target.checked })} />SMS</label>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" className="h-4 w-4" checked={!!prefs.email} onChange={(e) => save({ ...prefs, email: e.target.checked })} />{t('Barua pepe', 'Email')}</label>
        <h3 className="pt-2 text-sm font-bold">{t('Aina za arifa ninazotaka', 'Notice types I want')}</h3>
        {CATS.map(([k, label]) => (
          <label key={k} className="flex items-center gap-3 text-sm">
            <input type="checkbox" className="h-4 w-4" checked={!muted.has(k)}
              onChange={(e) => {
                const m = new Set(muted)
                e.target.checked ? m.delete(k) : m.add(k)
                save({ ...prefs, muted: [...m] })
              }} />
            {label}
          </label>
        ))}
        <p className="text-[12px] text-soft">{t('Matangazo muhimu ya kiutawala hutumwa kwa wote.', 'Important administrative notices are sent to everyone.')}</p>
        {msg && <p className="text-[12.5px] font-semibold text-emerald-700">{msg}</p>}
      </div>
    </div>
  )
}

function Songs({ songs }) {
  const { t } = useLang()
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {songs.map((s) => (
        <details key={s.id} className="card">
          <summary className="cursor-pointer">
            <span className="font-bold">{s.title}</span>
            <span className="block text-[12.5px] text-soft">{[s.composer, s.choir].filter(Boolean).join(' · ')}</span>
          </summary>
          {s.notes && <p className="mt-3 rounded-xl bg-parchment p-3 text-sm">{s.notes}</p>}
          {s.audioUrl && (/\.(mp3|m4a|ogg|wav|aac)(\?|$)/i.test(s.audioUrl)
            ? <audio controls preload="none" src={s.audioUrl} className="mt-3 w-full" />
            : <a href={s.audioUrl} target="_blank" rel="noreferrer" className="btn-navy mt-3 !py-2 !text-[13px]"><Icon name="audio" className="h-4 w-4" />{t('Sikiliza', 'Listen')}</a>)}
          {s.videoUrl && <a href={s.videoUrl} target="_blank" rel="noreferrer" className="btn-navy mt-3 !py-2 !text-[13px]"><Icon name="play" className="h-4 w-4" />Video</a>}
          {s.lyrics && <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed">{s.lyrics}</pre>}
        </details>
      ))}
    </div>
  )
}

function Giving() {
  const { t, lang } = useLang()
  const { data, loading, error } = useApi('/me/giving')
  if (loading) return <Loading rows={1} />
  if (error || !data) return <Empty icon="wallet" title={t('Taarifa hazipatikani', 'Not available')} />
  const pl = data.pledge
  const pct = pl.amount ? Math.min(100, Math.round((pl.paid / pl.amount) * 100)) : 0
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.6fr]">
      <div className="card space-y-3">
        <h2 className="font-bold">{t('Ahadi yangu', 'My pledge')}</h2>
        <p className="text-sm text-soft">{t('Namba', 'Number')}: <span className="font-mono font-semibold text-ink">{pl.number}</span></p>
        {pl.amount != null ? (
          <>
            <p className="text-2xl font-extrabold">{money(pl.amount)}</p>
            {(pl.purpose || pl.period) && <p className="text-sm text-soft">{[pl.purpose, pl.period].filter(Boolean).join(' · ')}</p>}
            <div className="h-2 overflow-hidden rounded-full bg-cream"><div className="h-full bg-gold-500" style={{ width: `${pct}%` }} /></div>
            <p className="text-sm">{t('Imelipwa', 'Paid')}: <strong>{money(pl.paid)}</strong> ({pct}%)</p>
          </>
        ) : <p className="text-sm text-soft">{t('Hakuna ahadi iliyorekodiwa.', 'No pledge recorded.')}</p>}
      </div>
      <div className="card">
        <h2 className="font-bold">{t('Michango iliyorekodiwa', 'Recorded contributions')}</h2>
        {!data.contributions.length ? <p className="mt-3 text-sm text-soft">—</p> : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead><tr className="text-left text-soft"><th className="py-2">{t('Tarehe', 'Date')}</th><th>{t('Aina', 'Type')}</th><th>{t('Risiti', 'Receipt')}</th><th className="text-right">{t('Kiasi', 'Amount')}</th></tr></thead>
              <tbody className="divide-y divide-line">
                {data.contributions.map((c) => (
                  <tr key={c.receipt}><td className="py-2">{fmtDate(c.date, { lang })}</td><td>{c.category}</td><td className="font-mono text-[12px]">{c.receipt}</td><td className="text-right font-semibold">{money(c.amount)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function PasswordForm() {
  const { t } = useLang()
  const [f, setF] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [s, setS] = useState({ busy: false, err: '', ok: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  async function submit(e) {
    e.preventDefault()
    setS({ busy: true, err: '', ok: '' })
    try {
      await apiFetch('/me/password', { method: 'POST', body: f })
      setS({ busy: false, err: '', ok: t('Nenosiri limebadilishwa.', 'Password changed.') })
      setF({ current_password: '', password: '', password_confirmation: '' })
    } catch (err) {
      setS({ busy: false, err: errorText(err), ok: '' })
    }
  }
  return (
    <form onSubmit={submit} className="max-w-md space-y-4">
      <Input label={t('Nenosiri la sasa', 'Current password')} name="current_password" type="password" required autoComplete="current-password" value={f.current_password} onChange={set('current_password')} />
      <Input label={t('Nenosiri jipya', 'New password')} name="password" type="password" required autoComplete="new-password" value={f.password} onChange={set('password')} />
      <Input label={t('Rudia nenosiri jipya', 'Confirm new password')} name="password_confirmation" type="password" required autoComplete="new-password" value={f.password_confirmation} onChange={set('password_confirmation')} />
      <ErrorNote>{s.err}</ErrorNote>
      <SuccessNote>{s.ok}</SuccessNote>
      <button type="submit" disabled={s.busy} className="btn-primary">{t('Badilisha nenosiri', 'Change password')}</button>
    </form>
  )
}

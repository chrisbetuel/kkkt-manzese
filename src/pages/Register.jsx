import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { Section } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { postMember, useSite } from '../content.jsx'

// ---- chaguo: [thamani (ya API), Kiswahili, English] ----
const GENDERS = [
  ['male', 'Mwanaume', 'Male'],
  ['female', 'Mwanamke', 'Female'],
]
const MARITAL = [
  ['single', 'Hajaoa / Hajaolewa', 'Single'],
  ['married', 'Ameoa / Ameolewa', 'Married'],
  ['widowed', 'Mjane / Mgane', 'Widowed'],
  ['divorced', 'Ametalikiana', 'Divorced'],
]
const EDUCATION = [
  ['primary', 'Elimu ya Msingi', 'Primary'],
  ['secondary', 'Sekondari (O-Level)', 'Secondary (O-Level)'],
  ['advanced', 'Sekondari (A-Level)', 'Secondary (A-Level)'],
  ['certificate', 'Cheti', 'Certificate'],
  ['diploma', 'Stashahada (Diploma)', 'Diploma'],
  ['degree', 'Shahada (Degree)', "Bachelor's Degree"],
  ['masters', 'Uzamili (Masters)', "Master's Degree"],
  ['doctorate', 'Uzamivu (PhD)', 'Doctorate (PhD)'],
  ['other', 'Nyingine', 'Other'],
]
const YES_NO = [
  ['1', 'Ndiyo', 'Yes'],
  ['0', 'Hapana', 'No'],
]
const CONFIRMATION = [
  ['yes', 'Ndiyo', 'Yes'],
  ['no', 'Hapana', 'No'],
  ['na', 'Haihusiki', 'Not applicable'],
]
const MEMBERSHIP = [
  ['new', 'Mshirika Mpya', 'New Member'],
  ['existing', 'Mshirika Aliyepo', 'Existing Member'],
  ['transferred', 'Nimehamia', 'Transferred Member'],
]
const DEPARTMENTS = [
  ['kwaya', 'Kwaya', 'Choir'],
  ['media', 'Media na TEHAMA', 'Media and ICT'],
  ['uinjilisti', 'Uinjilisti', 'Evangelism'],
  ['sunday_school', 'Shule ya Jumapili', 'Sunday School'],
  ['vijana', 'Vijana', 'Youth Ministry'],
  ['wanawake', 'Wanawake', "Women's Ministry"],
  ['wanaume', 'Wanaume', "Men's Ministry"],
  ['diakonia', 'Diakonia', 'Diakonia'],
  ['usafi', 'Usafi na Mazingira', 'Cleaning and Environment'],
  ['ukarimu', 'Ukarimu', 'Hospitality'],
  ['maombi', 'Maombi', 'Prayer Ministry'],
  ['ibada', 'Usimamizi wa Ibada', 'Worship Coordination'],
  ['other', 'Idara Nyingine', 'Other Departments'],
]
const CHOIRS = [
  ['vijana', 'Kwaya ya Vijana', 'Youth Choir'],
  ['kalvari', 'Kwaya ya Kalvari', 'Calvary Choir'],
  ['wamama', 'Kwaya ya Wamama', "Women's Choir"],
  ['kuu', 'Kwaya Kuu', 'Main Choir'],
  ['other', 'Kwaya Nyingine', 'Other Choirs'],
]
const PLEDGE_STATUS = [
  ['not_started', 'Bado Kuanza', 'Not Started'],
  ['partial', 'Imelipwa Sehemu', 'Partially Paid'],
  ['paid', 'Imelipwa Yote', 'Fully Paid'],
]
const RELATIONS = ['Mtoto', 'Mzazi', 'Ndugu', 'Mjukuu', 'Mpwa', 'Mlezi']

const STEPS = [
  { sw: 'Binafsi', en: 'Personal', fields: ['full_name', 'date_of_birth', 'gender', 'phone', 'alt_phone', 'email', 'address', 'photo', 'occupation', 'workplace', 'education_level'] },
  { sw: 'Familia', en: 'Family', fields: ['marital_status', 'dependants_count', 'dependants', 'spouse_name', 'spouse_phone'] },
  { sw: 'Kiroho', en: 'Spiritual', fields: ['is_baptized', 'baptism_year', 'baptism_church', 'confirmation_status', 'confirmation_year'] },
  { sw: 'Huduma', en: 'Ministry', fields: ['membership_type', 'previous_church', 'departments', 'other_department', 'choirs', 'other_choir'] },
  { sw: 'Ahadi', en: 'Pledge', fields: ['has_pledge_number', 'pledge_number', 'pledge_amount', 'pledge_status', 'pledge_notes'] },
  { sw: 'Hakiki', en: 'Review', fields: ['consent'] },
]

const EMPTY = {
  full_name: '', date_of_birth: '', gender: '', phone: '', alt_phone: '', email: '', address: '',
  occupation: '', workplace: '', education_level: '',
  marital_status: '', dependants_count: '', dependants: [], spouse_name: '', spouse_phone: '',
  is_baptized: '', baptism_year: '', baptism_church: '', confirmation_status: '', confirmation_year: '',
  membership_type: '', previous_church: '',
  departments: [], other_department: '', choirs: [], other_choir: '',
  has_pledge_number: '', pledge_number: '', pledge_amount: '', pledge_status: '', pledge_notes: '',
  consent: false,
}

const THIS_YEAR = new Date().getFullYear()
const TODAY = new Date().toISOString().slice(0, 10)

// tarehe inaandikwa DD/MM/YYYY; mikwaju huwekwa yenyewe, na "5/5/" huwa "05/05/"
const maskDob = (raw) => {
  const parts = raw.split(/\D+/)
  const n = parts
    .map((p, i) => (i < 2 && i < parts.length - 1 && p.length === 1 ? `0${p}` : p))
    .join('')
    .slice(0, 8)
  return [n.slice(0, 2), n.slice(2, 4), n.slice(4)].filter(Boolean).join('/')
}
// "14/05/1990" -> "1990-05-14", au '' kama si tarehe halali
const dobIso = (s) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s)
  if (!m) return ''
  const [dd, mm, yyyy] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const dt = new Date(Date.UTC(yyyy, mm - 1, dd))
  return dt.getUTCDate() === dd && dt.getUTCMonth() === mm - 1 ? dt.toISOString().slice(0, 10) : ''
}

const PHONE_RE = /^\+?[0-9\s()-]{9,20}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_PHOTO = 5 * 1024 * 1024

const LANG_KEY = 'kkkt_lang'

function useLang() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'sw'
    } catch {
      return 'sw'
    }
  })
  const change = (l) => {
    setLang(l)
    try {
      localStorage.setItem(LANG_KEY, l)
    } catch {
      /* ignore */
    }
  }
  return [lang, change]
}

const label = (opts, value, lang) => {
  const o = opts.find((x) => x[0] === value)
  return o ? (lang === 'en' ? o[2] : o[1]) : ''
}
const money = (v) => (v === '' || v == null ? '' : Number(v).toLocaleString('en-US'))

// ---- vipengele vidogo vya fomu ----
const inputCls = (err) =>
  `w-full border bg-cream px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 ${
    err ? 'border-red-400' : 'border-ink/15'
  }`

function FieldShell({ id, label: text, required, optional, hint, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink/85">
        {text} {required && <span className="text-gold-600">*</span>}
        {optional && <span className="ml-1 text-xs font-normal text-ink/40">({optional})</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1 text-xs text-ink/50">{hint}</p>
      )}
    </div>
  )
}

function Input({ id, label: text, required, optional, hint, error, ...props }) {
  return (
    <FieldShell id={id} label={text} required={required} optional={optional} hint={hint} error={error}>
      <input id={id} name={id} aria-invalid={!!error} className={inputCls(error)} {...props} />
    </FieldShell>
  )
}

function Choice({ id, label: text, options, value, onChange, lang, required, error, cols = 2 }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-ink/85">
        {text} {required && <span className="text-gold-600">*</span>}
      </legend>
      <div className={`grid gap-2.5 ${cols === 3 ? 'sm:grid-cols-3' : cols === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'}`}>
        {options.map(([v, sw, en]) => {
          const active = value === v
          return (
            <label
              key={v}
              className={`flex cursor-pointer items-center gap-3 border px-3.5 py-3 text-sm transition-colors ${
                active ? 'border-gold-500 bg-gold-50 text-ink ring-1 ring-gold-300' : 'border-ink/15 bg-cream text-ink/75 hover:border-gold-400'
              }`}
            >
              <input
                type="radio"
                name={id}
                value={v}
                checked={active}
                onChange={() => onChange(v)}
                className="h-4 w-4 accent-gold-600"
              />
              <span className="font-medium">{lang === 'en' ? en : sw}</span>
            </label>
          )
        })}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}

function Multi({ label: text, hint, options, value, onChange, lang, error }) {
  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  return (
    <fieldset>
      <legend className="mb-1 text-sm font-medium text-ink/85">{text}</legend>
      {hint && <p className="mb-2.5 text-xs text-ink/50">{hint}</p>}
      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 lg:grid-cols-3">
        {options.map(([v, sw, en]) => {
          const on = value.includes(v)
          return (
            <button
              type="button"
              key={v}
              onClick={() => toggle(v)}
              aria-pressed={on}
              className={`flex items-center gap-2.5 border px-3 py-2.5 text-left text-sm transition-colors ${
                on ? 'border-ink bg-ink text-cream' : 'border-ink/15 bg-cream text-ink/75 hover:border-gold-400'
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
                  on ? 'border-gold-400 bg-gold-500 text-ink' : 'border-ink/30 bg-white'
                }`}
              >
                {on && <Icon name="check" className="h-3 w-3" strokeWidth={3} />}
              </span>
              <span>
                {lang === 'en' ? en : sw}
                {lang === 'en' && en !== sw && <span className="block text-[11px] text-current opacity-55">{sw}</span>}
              </span>
            </button>
          )
        })}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}

function SelectBox({ id, label: text, options, value, onChange, lang, optional, placeholder }) {
  return (
    <FieldShell id={id} label={text} optional={optional}>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls()}>
        <option value="">{placeholder}</option>
        {options.map(([v, sw, en]) => (
          <option key={v} value={v}>
            {lang === 'en' ? en : sw}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

function StepTitle({ eyebrow, title, intro }) {
  return (
    <div className="mb-6 border-b border-ink/10 pb-5">
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-600">
        <span className="text-gold-500">✦</span>
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-semibold uppercase tracking-tight text-ink md:text-2xl">{title}</h2>
      {intro && <p className="mt-2 text-sm leading-relaxed text-ink/60">{intro}</p>}
    </div>
  )
}

// ---- ukurasa ----
export default function Register() {
  const { church } = useSite()
  const [lang, setLang] = useLang()
  const tx = (sw, en) => (lang === 'en' ? en : sw)
  const optional = tx('si lazima', 'optional')

  const [step, setStep] = useState(0)
  const [maxStep, setMaxStep] = useState(0)
  const [d, setD] = useState(EMPTY)
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState('')
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [formError, setFormError] = useState('')
  const [done, setDone] = useState(null)
  const [copied, setCopied] = useState(false)
  const top = useRef(null)

  const set = (k) => (v) => {
    setD((p) => ({ ...p, [k]: v }))
    setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e))
  }
  const bind = (k) => ({ value: d[k], onChange: (e) => set(k)(e.target.value), error: errors[k] })

  useEffect(() => {
    if (!photo) return setPreview('')
    const url = URL.createObjectURL(photo)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step, done])

  const married = d.marital_status === 'married'
  const inChoir = d.departments.includes('kwaya')

  function pickPhoto(file) {
    if (!file) return
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setErrors((e) => ({ ...e, photo: tx('Chagua picha ya JPG, PNG au WEBP.', 'Choose a JPG, PNG or WEBP image.') }))
      return
    }
    if (file.size > MAX_PHOTO) {
      setErrors((e) => ({ ...e, photo: tx('Picha isizidi MB 5.', 'The photo must be 5 MB or smaller.') }))
      return
    }
    setPhoto(file)
    setErrors((e) => ({ ...e, photo: undefined }))
  }

  function validate(i) {
    const e = {}
    const req = tx('Sehemu hii inahitajika.', 'This field is required.')
    const badPhone = tx('Weka namba sahihi ya simu, mfano 0712 345 678.', 'Enter a valid phone number, e.g. 0712 345 678.')
    const badYear = tx(`Weka mwaka kati ya 1900 na ${THIS_YEAR}.`, `Enter a year between 1900 and ${THIS_YEAR}.`)
    const year = (v) => v === '' || (Number(v) >= 1900 && Number(v) <= THIS_YEAR)

    if (i === 0) {
      if (d.full_name.trim().length < 3) e.full_name = tx('Andika jina lako kamili.', 'Enter your full name.')
      const dob = dobIso(d.date_of_birth)
      if (!d.date_of_birth) e.date_of_birth = req
      else if (!dob || dob >= TODAY || dob < '1900-01-01')
        e.date_of_birth = tx('Andika tarehe sahihi, mfano 14/05/1990.', 'Enter a valid date, e.g. 14/05/1990.')
      if (!d.gender) e.gender = req
      if (!PHONE_RE.test(d.phone.trim())) e.phone = badPhone
      if (d.alt_phone && !PHONE_RE.test(d.alt_phone.trim())) e.alt_phone = badPhone
      if (d.email && !EMAIL_RE.test(d.email.trim())) e.email = tx('Barua pepe si sahihi.', 'Email address is not valid.')
      if (!d.address.trim()) e.address = req
      if (!d.occupation.trim()) e.occupation = req
      if (!photo) e.photo = tx('Tafadhali weka picha yako.', 'Please add your photo.')
    }
    if (i === 1) {
      if (!d.marital_status) e.marital_status = req
      if (married && d.spouse_phone && !PHONE_RE.test(d.spouse_phone.trim())) e.spouse_phone = badPhone
      if (d.dependants.some((x) => !x.name.trim() && x.relationship.trim()))
        e.dependants = tx('Kila mtegemezi anahitaji jina.', 'Each dependant needs a name.')
    }
    if (i === 2) {
      if (d.is_baptized === '') e.is_baptized = req
      if (d.is_baptized === '1' && !d.baptism_year) e.baptism_year = tx('Weka mwaka wa ubatizo.', 'Enter your baptism year.')
      else if (d.is_baptized === '1' && !year(d.baptism_year)) e.baptism_year = badYear
      if (!d.confirmation_status) e.confirmation_status = req
      if (d.confirmation_status === 'yes' && !year(d.confirmation_year)) e.confirmation_year = badYear
    }
    if (i === 3) {
      if (!d.membership_type) e.membership_type = req
      if (d.departments.includes('other') && !d.other_department.trim())
        e.other_department = tx('Taja idara unayotaka kuhudumu.', 'Name the department you wish to serve in.')
      if (inChoir && d.choirs.length === 0) e.choirs = tx('Chagua angalau kwaya moja.', 'Select at least one choir.')
      if (inChoir && d.choirs.includes('other') && !d.other_choir.trim())
        e.other_choir = tx('Taja jina la kwaya.', 'Name the choir.')
    }
    if (i === 5 && !d.consent) e.consent = tx('Tafadhali kubali ili kuendelea.', 'Please give your consent to continue.')
    return e
  }

  function goTo(i) {
    setFormError('')
    setStep(i)
    setMaxStep((m) => Math.max(m, i))
  }

  function next() {
    const e = validate(step)
    setErrors(e)
    if (Object.values(e).some(Boolean)) return
    goTo(step + 1)
  }

  function build() {
    const fd = new FormData()
    const keep = { ...d }
    if (!married) keep.spouse_name = keep.spouse_phone = ''
    if (keep.is_baptized !== '1') keep.baptism_year = keep.baptism_church = ''
    if (keep.confirmation_status !== 'yes') keep.confirmation_year = ''
    if (!keep.departments.includes('other')) keep.other_department = ''
    if (!inChoir) keep.choirs = []
    if (!keep.choirs.includes('other')) keep.other_choir = ''
    if (keep.has_pledge_number !== '1') keep.pledge_number = ''
    keep.date_of_birth = dobIso(keep.date_of_birth)

    for (const [k, v] of Object.entries(keep)) {
      if (k === 'dependants') {
        const list = v.filter((x) => x.name.trim()).map((x) => ({ name: x.name.trim(), relationship: x.relationship.trim() }))
        if (list.length) fd.append('dependants', JSON.stringify(list))
      } else if (Array.isArray(v)) {
        v.forEach((x) => fd.append(`${k}[]`, x))
      } else if (k === 'consent') {
        fd.append('consent', v ? '1' : '0')
      } else if (String(v).trim() !== '') {
        fd.append(k, String(v).trim())
      }
    }
    if (photo) fd.append('photo', photo)
    return fd
  }

  async function submit() {
    const e = validate(5)
    setErrors(e)
    if (Object.values(e).some(Boolean)) return
    setSending(true)
    setFormError('')
    try {
      const res = await postMember(build())
      setDone(res)
    } catch (err) {
      if (err.status === 422 && err.errors) {
        const mapped = {}
        for (const [k, msgs] of Object.entries(err.errors)) mapped[k.split('.')[0]] = msgs[0]
        setErrors(mapped)
        const at = STEPS.findIndex((s) => s.fields.some((f) => mapped[f]))
        if (at >= 0 && at !== 5) setStep(at)
        setFormError(tx('Tafadhali rekebisha sehemu zilizowekwa alama nyekundu.', 'Please correct the highlighted fields.'))
      } else if (err.status === 409) {
        setFormError(err.message)
      } else if (err.status === 429) {
        setFormError(tx('Majaribio mengi mno. Subiri dakika chache kisha ujaribu tena.', 'Too many attempts. Please wait a few minutes and try again.'))
      } else {
        setFormError(tx('Imeshindikana kutuma. Angalia mtandao kisha ujaribu tena.', 'Could not submit. Check your connection and try again.'))
      }
    } finally {
      setSending(false)
    }
  }

  function onSubmit(e) {
    e.preventDefault()
    if (step < 5) next()
    else submit()
  }

  async function copyRef() {
    try {
      await navigator.clipboard.writeText(done.pledgeNumber || done.reference)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const updateDep = (i, k, v) =>
    set('dependants')(d.dependants.map((x, j) => (j === i ? { ...x, [k]: v } : x)))

  // ---- muhtasari (hatua ya mwisho) ----
  const review = [
    {
      step: 0,
      rows: [
        [tx('Jina Kamili', 'Full Name'), d.full_name],
        [tx('Tarehe ya Kuzaliwa', 'Date of Birth'), d.date_of_birth],
        [tx('Jinsia', 'Gender'), label(GENDERS, d.gender, lang)],
        [tx('Simu', 'Phone'), [d.phone, d.alt_phone].filter(Boolean).join(' / ')],
        [tx('Barua Pepe', 'Email'), d.email],
        [tx('Makazi', 'Residence'), d.address],
        [tx('Kazi', 'Occupation'), [d.occupation, d.workplace].filter(Boolean).join(' — ')],
        [tx('Elimu', 'Education'), label(EDUCATION, d.education_level, lang)],
      ],
    },
    {
      step: 1,
      rows: [
        [tx('Hali ya Ndoa', 'Marital Status'), label(MARITAL, d.marital_status, lang)],
        married && [tx('Mwenzi', 'Spouse'), [d.spouse_name, d.spouse_phone].filter(Boolean).join(' — ')],
        [tx('Idadi ya Wategemezi', 'Number of Dependants'), d.dependants_count],
        [
          tx('Wategemezi', 'Dependants'),
          d.dependants.filter((x) => x.name.trim()).map((x) => (x.relationship ? `${x.name} (${x.relationship})` : x.name)).join(', '),
        ],
      ],
    },
    {
      step: 2,
      rows: [
        [
          tx('Ubatizo', 'Baptism'),
          d.is_baptized === '1'
            ? [tx('Ndiyo', 'Yes'), d.baptism_year, d.baptism_church].filter(Boolean).join(' · ')
            : label(YES_NO, d.is_baptized, lang),
        ],
        [
          tx('Kipaimara', 'Confirmation'),
          [label(CONFIRMATION, d.confirmation_status, lang), d.confirmation_status === 'yes' && d.confirmation_year]
            .filter(Boolean)
            .join(' · '),
        ],
      ],
    },
    {
      step: 3,
      rows: [
        [tx('Uanachama', 'Membership'), label(MEMBERSHIP, d.membership_type, lang)],
        [tx('Kanisa la Awali', 'Previous Church'), d.previous_church],
        [
          tx('Idara', 'Departments'),
          d.departments
            .map((v) => (v === 'other' && d.other_department ? d.other_department : label(DEPARTMENTS, v, lang)))
            .join(', '),
        ],
        inChoir && [
          tx('Kwaya', 'Choirs'),
          d.choirs.map((v) => (v === 'other' && d.other_choir ? d.other_choir : label(CHOIRS, v, lang))).join(', '),
        ],
      ],
    },
    {
      step: 4,
      rows: [
        [
          tx('Namba ya Ahadi', 'Pledge Number'),
          d.has_pledge_number === '1' && d.pledge_number ? d.pledge_number : tx('Itatolewa ukimaliza usajili', 'Issued when you submit'),
        ],
        [tx('Kiasi', 'Amount'), d.pledge_amount ? `TSh ${money(d.pledge_amount)}` : ''],
        [tx('Hali ya Malipo', 'Payment Status'), label(PLEDGE_STATUS, d.pledge_status, lang)],
        [tx('Maelezo', 'Notes'), d.pledge_notes],
      ],
    },
  ]

  // ---- imefanikiwa ----
  if (done) {
    return (
      <>
        <PageHeader crumbs={['Jisajili']} />
        <Section tint="cream">
          <div ref={top} className="mx-auto max-w-xl scroll-mt-24 border border-gold-300 bg-white px-6 py-12 text-center md:px-10">
            <span className="mx-auto flex h-16 w-16 items-center justify-center bg-gold-100 text-gold-700">
              <Icon name="check" className="h-8 w-8" strokeWidth={2.25} />
            </span>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-600">
              {tx('Usajili Umepokelewa', 'Registration Received')}
            </p>
            <h2 className="mt-2 text-2xl font-semibold uppercase tracking-tight">
              {tx('Karibu, ', 'Welcome, ')}
              {done.name?.split(' ')[0]}!
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              {tx(
                'Asante kwa kujisajili. Ofisi ya kanisa itahakiki taarifa zako hivi karibuni.',
                'Thank you for registering. The church office will verify your details shortly.',
              )}
            </p>

            <div className="mt-7 border border-dashed border-ink/25 bg-cream px-4 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">
                {tx('Namba yako ya ahadi', 'Your pledge number')}
              </p>
              <p className="mt-1.5 break-all font-mono text-xl font-semibold tracking-wide text-ink">{done.pledgeNumber || done.reference}</p>
              <button
                type="button"
                onClick={copyRef}
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-700 hover:text-gold-800"
              >
                <Icon name={copied ? 'check' : 'copy'} className="h-3.5 w-3.5" />
                {copied ? tx('Imenakiliwa', 'Copied') : tx('Nakili', 'Copy')}
              </button>
            </div>

            <p className="mt-5 text-xs text-ink/50">
              {done.smsSent || done.emailSent
                ? tx('Tumekutumia uthibitisho kwa ', 'We have sent a confirmation by ') +
                  [done.smsSent && 'SMS', done.emailSent && tx('barua pepe', 'email')].filter(Boolean).join(tx(' na ', ' and ')) +
                  '.'
                : tx('Hifadhi namba hii — utaihitaji ukiwasiliana na ofisi.', 'Keep this number — you will need it when contacting the office.')}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/" className="btn-primary">
                {tx('Rudi Nyumbani', 'Back to Home')}
              </Link>
              <button type="button" onClick={() => window.print()} className="btn-navy">
                {tx('Chapisha', 'Print')}
              </button>
            </div>
          </div>
        </Section>
      </>
    )
  }

  const s = STEPS[step]
  const pct = Math.round(((step + 1) / STEPS.length) * 100)

  return (
    <>
      <PageHeader crumbs={['Jisajili']} />

      <Section tint="cream" className="!pt-10 sm:!pt-14">
        <div className="mx-auto max-w-3xl">
          {/* kichwa + lugha */}
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-600">
                <span className="text-gold-500">✦</span>
                {tx('Usajili wa Washirika', 'Member Registration')}
              </p>
              <h1 className="text-2xl font-semibold uppercase tracking-tight text-ink md:text-[2rem] md:leading-[1.15]">
                {tx('Jisajili kama Mshirika', 'Register as a Member')}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
                {tx(
                  `Karibu katika familia ya ${church.name}. Jaza hatua sita fupi — inachukua takriban dakika 5.`,
                  `Welcome to the ${church.name} family. Complete six short steps — it takes about 5 minutes.`,
                )}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 self-start border border-ink/15 bg-white p-1 sm:self-auto" role="group" aria-label="Language">
              <Icon name="lang" className="mx-1.5 h-4 w-4 text-ink/40" />
              {[
                ['sw', 'Kiswahili'],
                ['en', 'English'],
              ].map(([k, t]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setLang(k)}
                  aria-pressed={lang === k}
                  className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                    lang === k ? 'bg-ink text-cream' : 'text-ink/55 hover:text-ink'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* maendeleo */}
          <div ref={top} className="mb-6 scroll-mt-24">
            <div className="sm:hidden">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em]">
                <span className="text-ink">
                  {tx('Hatua', 'Step')} {step + 1}/{STEPS.length} · {s[lang]}
                </span>
                <span className="text-ink/45">{pct}%</span>
              </div>
              <div className="mt-2 h-1.5 bg-ink/10">
                <div className="h-full bg-gold-500 transition-all duration-300" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <ol className="hidden grid-cols-6 gap-1.5 sm:grid">
              {STEPS.map((x, i) => {
                const state = i === step ? 'now' : i < step || i <= maxStep ? 'done' : 'todo'
                const reachable = i <= maxStep && i !== step
                return (
                  <li key={x.sw}>
                    <button
                      type="button"
                      disabled={!reachable}
                      onClick={() => reachable && goTo(i)}
                      aria-current={i === step ? 'step' : undefined}
                      className="group w-full text-left disabled:cursor-default"
                    >
                      <span
                        className={`block h-1 transition-colors ${
                          state === 'now' ? 'bg-gold-500' : state === 'done' ? 'bg-ink' : 'bg-ink/12'
                        }`}
                      />
                      <span
                        className={`mt-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                          state === 'todo' ? 'text-ink/35' : 'text-ink'
                        } ${reachable ? 'group-hover:text-gold-700' : ''}`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center text-[10px] ${
                            state === 'now'
                              ? 'bg-gold-500 text-ink'
                              : state === 'done'
                                ? 'bg-ink text-cream'
                                : 'border border-ink/20 text-ink/40'
                          }`}
                        >
                          {state === 'done' && i < step ? <Icon name="check" className="h-3 w-3" strokeWidth={3} /> : i + 1}
                        </span>
                        <span className="truncate">{x[lang]}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>

          <form onSubmit={onSubmit} noValidate className="border border-ink/12 bg-white p-5 sm:p-7 md:p-9">
            {step === 0 && (
              <div className="animate-fade-up">
                <StepTitle
                  eyebrow={tx('Hatua ya 1', 'Step 1')}
                  title={tx('Taarifa Binafsi', 'Personal Information')}
                  intro={tx('Taarifa zako za msingi na mawasiliano.', 'Your basic details and contact information.')}
                />

                {/* picha */}
                <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <label
                    htmlFor="photo"
                    className={`relative flex h-28 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed bg-cream transition-colors hover:border-gold-500 ${
                      errors.photo ? 'border-red-400' : 'border-ink/20'
                    }`}
                  >
                    {preview ? (
                      <img src={preview} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Icon name="camera" className="h-7 w-7 text-ink/35" />
                    )}
                  </label>
                  <div>
                    <p className="text-sm font-medium text-ink/85">
                      {tx('Picha Yako', 'Profile Photograph')} <span className="text-gold-600">*</span>
                    </p>
                    <p className="mt-1 text-xs text-ink/50">
                      {tx(
                        'Picha ya uso inayoonekana vizuri. JPG, PNG au WEBP, isizidi MB 5.',
                        'A clear photo of your face. JPG, PNG or WEBP, up to 5 MB.',
                      )}
                    </p>
                    <label
                      htmlFor="photo"
                      className="mt-2.5 inline-flex cursor-pointer items-center gap-1.5 border border-ink/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70 hover:border-ink hover:text-ink"
                    >
                      <Icon name="camera" className="h-3.5 w-3.5" />
                      {photo ? tx('Badilisha picha', 'Change photo') : tx('Chagua picha', 'Choose photo')}
                    </label>
                    <input
                      id="photo"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(e) => pickPhoto(e.target.files?.[0])}
                    />
                    {errors.photo && (
                      <p className="mt-1.5 text-xs text-red-600" role="alert">
                        {errors.photo}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input id="full_name" label={tx('Jina Kamili', 'Full Name')} required autoComplete="name" {...bind('full_name')} />
                  </div>
                  <Input
                    id="date_of_birth"
                    inputMode="numeric"
                    label={tx('Tarehe ya Kuzaliwa', 'Date of Birth')}
                    required
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                    autoComplete="bday"
                    hint={tx('Andika siku/mwezi/mwaka, mfano 14/05/1990.', 'Type day/month/year, e.g. 14/05/1990.')}
                    value={d.date_of_birth}
                    onChange={(e) => set('date_of_birth')(maskDob(e.target.value))}
                    error={errors.date_of_birth}
                  />
                  <Choice
                    id="gender"
                    label={tx('Jinsia', 'Gender')}
                    required
                    options={GENDERS}
                    value={d.gender}
                    onChange={set('gender')}
                    lang={lang}
                    error={errors.gender}
                  />
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    label={tx('Namba ya Simu', 'Phone Number')}
                    required
                    placeholder="0712 345 678"
                    autoComplete="tel"
                    hint={tx('Tutakutumia uthibitisho kwa SMS.', 'We will send your confirmation by SMS.')}
                    {...bind('phone')}
                  />
                  <Input
                    id="alt_phone"
                    type="tel"
                    inputMode="tel"
                    label={tx('Simu Mbadala', 'Alternative Phone')}
                    optional={optional}
                    {...bind('alt_phone')}
                  />
                  <Input
                    id="email"
                    type="email"
                    label={tx('Barua Pepe', 'Email Address')}
                    optional={optional}
                    autoComplete="email"
                    {...bind('email')}
                  />
                  <Input
                    id="address"
                    label={tx('Makazi / Mahali Unapoishi', 'Residential Address / Location')}
                    required
                    placeholder={tx('mfano: Manzese, Mtaa wa Tip Top', 'e.g. Manzese, Tip Top Street')}
                    {...bind('address')}
                  />
                  <Input id="occupation" label={tx('Kazi Unayofanya', 'Occupation')} required {...bind('occupation')} />
                  <Input
                    id="workplace"
                    label={tx('Mahali pa Kazi / Jina la Biashara', 'Workplace / Business Name')}
                    optional={optional}
                    {...bind('workplace')}
                  />
                  <div className="sm:col-span-2">
                    <SelectBox
                      id="education_level"
                      label={tx('Kiwango cha Elimu', 'Education Level')}
                      optional={optional}
                      placeholder={tx('Chagua...', 'Select...')}
                      options={EDUCATION}
                      value={d.education_level}
                      onChange={set('education_level')}
                      lang={lang}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="animate-fade-up space-y-6">
                <StepTitle
                  eyebrow={tx('Hatua ya 2', 'Step 2')}
                  title={tx('Taarifa za Familia', 'Family Information')}
                  intro={tx('Hutusaidia kuihudumia familia yako kwa ukamilifu.', 'Helps us care for your whole family.')}
                />
                <Choice
                  id="marital_status"
                  label={tx('Hali ya Ndoa', 'Marital Status')}
                  required
                  options={MARITAL}
                  value={d.marital_status}
                  onChange={set('marital_status')}
                  lang={lang}
                  error={errors.marital_status}
                  cols={4}
                />

                {married && (
                  <div className="grid animate-fade-up gap-5 border-l-2 border-gold-400 pl-4 sm:grid-cols-2">
                    <Input id="spouse_name" label={tx('Jina la Mwenzi', "Spouse's Name")} optional={optional} {...bind('spouse_name')} />
                    <Input
                      id="spouse_phone"
                      type="tel"
                      inputMode="tel"
                      label={tx('Simu ya Mwenzi', "Spouse's Phone Number")}
                      optional={optional}
                      {...bind('spouse_phone')}
                    />
                  </div>
                )}

                <div className="max-w-xs">
                  <Input
                    id="dependants_count"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="30"
                    label={tx('Idadi ya Wategemezi', 'Number of Dependants')}
                    optional={optional}
                    {...bind('dependants_count')}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-ink/85">
                    {tx('Majina ya Wategemezi', 'Names of Dependants')}{' '}
                    <span className="text-xs font-normal text-ink/40">({optional})</span>
                  </p>
                  <p className="mt-0.5 text-xs text-ink/50">
                    {tx('Watoto au wengine unaowalea.', 'Children or others in your care.')}
                  </p>
                  <datalist id="relations">
                    {RELATIONS.map((r) => (
                      <option key={r} value={r} />
                    ))}
                  </datalist>
                  <div className="mt-3 space-y-2.5">
                    {d.dependants.map((x, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_12rem]">
                          <input
                            aria-label={tx('Jina la mtegemezi', 'Dependant name')}
                            placeholder={tx('Jina', 'Name')}
                            value={x.name}
                            onChange={(e) => updateDep(i, 'name', e.target.value)}
                            className={inputCls()}
                          />
                          <input
                            aria-label={tx('Uhusiano', 'Relationship')}
                            placeholder={tx('Uhusiano (mf. Mtoto)', 'Relationship (e.g. Child)')}
                            list="relations"
                            value={x.relationship}
                            onChange={(e) => updateDep(i, 'relationship', e.target.value)}
                            className={inputCls()}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => set('dependants')(d.dependants.filter((_, j) => j !== i))}
                          aria-label={tx('Ondoa', 'Remove')}
                          className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center border border-ink/15 text-ink/50 hover:border-red-300 hover:text-red-600"
                        >
                          <Icon name="trash" className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {errors.dependants && <p className="mt-1 text-xs text-red-600">{errors.dependants}</p>}
                  {d.dependants.length < 30 && (
                    <button
                      type="button"
                      onClick={() => set('dependants')([...d.dependants, { name: '', relationship: '' }])}
                      className="mt-3 inline-flex items-center gap-1.5 border border-dashed border-ink/25 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/65 hover:border-gold-500 hover:text-ink"
                    >
                      <Icon name="plus" className="h-3.5 w-3.5" />
                      {tx('Ongeza mtegemezi', 'Add dependant')}
                    </button>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-up space-y-6">
                <StepTitle
                  eyebrow={tx('Hatua ya 3', 'Step 3')}
                  title={tx('Ubatizo na Maisha ya Kiroho', 'Baptism and Spiritual Life')}
                />
                <Choice
                  id="is_baptized"
                  label={tx('Umebatizwa?', 'Have you been baptized?')}
                  required
                  options={YES_NO}
                  value={d.is_baptized}
                  onChange={set('is_baptized')}
                  lang={lang}
                  error={errors.is_baptized}
                />
                {d.is_baptized === '1' && (
                  <div className="grid animate-fade-up gap-5 border-l-2 border-gold-400 pl-4 sm:grid-cols-2">
                    <Input
                      id="baptism_year"
                      type="number"
                      inputMode="numeric"
                      min="1900"
                      max={THIS_YEAR}
                      label={tx('Mwaka wa Ubatizo', 'Baptism Year')}
                      required
                      placeholder={String(THIS_YEAR - 20)}
                      {...bind('baptism_year')}
                    />
                    <Input
                      id="baptism_church"
                      label={tx('Kanisa Ulipobatizwa', 'Baptism Church')}
                      optional={optional}
                      {...bind('baptism_church')}
                    />
                  </div>
                )}
                {d.is_baptized === '0' && (
                  <p className="animate-fade-up border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-ink/70">
                    {tx('Karibu! ', 'Welcome! ')}
                    <Link to="/ubatizo" className="font-semibold text-gold-700 underline underline-offset-2">
                      {tx('Soma kuhusu madarasa ya ubatizo', 'Learn about baptism classes')}
                    </Link>
                    .
                  </p>
                )}

                <Choice
                  id="confirmation_status"
                  label={tx('Umepata Kipaimara?', 'Are you confirmed?')}
                  required
                  options={CONFIRMATION}
                  value={d.confirmation_status}
                  onChange={set('confirmation_status')}
                  lang={lang}
                  error={errors.confirmation_status}
                  cols={3}
                />
                {d.confirmation_status === 'yes' && (
                  <div className="max-w-xs animate-fade-up border-l-2 border-gold-400 pl-4">
                    <Input
                      id="confirmation_year"
                      type="number"
                      inputMode="numeric"
                      min="1900"
                      max={THIS_YEAR}
                      label={tx('Mwaka wa Kipaimara', 'Year of Confirmation')}
                      optional={optional}
                      {...bind('confirmation_year')}
                    />
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-up space-y-6">
                <StepTitle
                  eyebrow={tx('Hatua ya 4', 'Step 4')}
                  title={tx('Uanachama na Huduma', 'Membership and Ministry')}
                  intro={tx('Mungu amekupa karama — tuambie unapotamani kuhudumu.', 'God has given you gifts — tell us where you would love to serve.')}
                />
                <Choice
                  id="membership_type"
                  label={tx('Hali ya Uanachama', 'Membership Status')}
                  required
                  options={MEMBERSHIP}
                  value={d.membership_type}
                  onChange={set('membership_type')}
                  lang={lang}
                  error={errors.membership_type}
                  cols={3}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    id="previous_church"
                    label={tx('Kanisa la Awali', 'Previous Church')}
                    optional={optional}
                    hint={d.membership_type === 'transferred' ? tx('Usharika ulikotoka.', 'The congregation you came from.') : undefined}
                    {...bind('previous_church')}
                  />
                </div>

                <Multi
                  label={tx('Idara Unazotamani Kuhudumu', 'Departments You Wish to Serve In')}
                  hint={tx('Chagua moja au zaidi.', 'Select one or more.')}
                  options={DEPARTMENTS}
                  value={d.departments}
                  onChange={set('departments')}
                  lang={lang}
                />
                {d.departments.includes('other') && (
                  <div className="animate-fade-up border-l-2 border-gold-400 pl-4">
                    <Input id="other_department" label={tx('Taja idara', 'Name the department')} required {...bind('other_department')} />
                  </div>
                )}

                {inChoir && (
                  <div className="animate-fade-up space-y-4 border border-gold-300 bg-gold-50/60 p-4 sm:p-5">
                    <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <Icon name="music" className="h-4 w-4 text-gold-700" />
                      {tx('Chagua kwaya yako', 'Choose your choir')}
                    </p>
                    <Multi
                      label={tx('Kwaya', 'Choirs')}
                      hint={tx('Unaweza kuchagua zaidi ya moja.', 'You may select more than one.')}
                      options={CHOIRS}
                      value={d.choirs}
                      onChange={set('choirs')}
                      lang={lang}
                      error={errors.choirs}
                    />
                    {d.choirs.includes('other') && (
                      <Input id="other_choir" label={tx('Jina la kwaya', 'Choir name')} required {...bind('other_choir')} />
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="animate-fade-up space-y-6">
                <StepTitle
                  eyebrow={tx('Hatua ya 5', 'Step 5')}
                  title={tx('Ahadi Yangu kwa Bwana', 'My Pledge to the Lord')}
                />
                <div className="flex items-start gap-3 border border-navy-200 bg-navy-50 px-4 py-3.5 text-sm leading-relaxed text-navy-800">
                  <Icon name="lock" className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    <strong>{tx('Hiari na siri.', 'Voluntary and confidential.')}</strong>{' '}
                    {tx(
                      'Sehemu hii yote si lazima. Taarifa za ahadi huonwa na Mchungaji na idara ya fedha pekee.',
                      'This entire section is optional. Pledge details are seen only by the Pastor and the finance office.',
                    )}
                  </p>
                </div>
                <Choice
                  id="has_pledge_number"
                  label={tx('Una namba ya ahadi tayari?', 'Do you have an existing pledge number?')}
                  options={YES_NO}
                  value={d.has_pledge_number}
                  onChange={set('has_pledge_number')}
                  lang={lang}
                />
                {d.has_pledge_number === '0' && (
                  <p className="animate-fade-up -mt-3 text-xs text-ink/55">
                    {tx('Utapewa namba mpya ya ahadi ukimaliza usajili.', 'You will receive a new pledge number when you finish registering.')}
                  </p>
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  {d.has_pledge_number === '1' && (
                    <Input id="pledge_number" label={tx('Namba ya Ahadi', 'Pledge Number')} optional={optional} {...bind('pledge_number')} />
                  )}
                  <FieldShell id="pledge_amount" label={tx('Kiasi cha Ahadi', 'Amount Pledged')} optional={optional} error={errors.pledge_amount}>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink/45">
                        TSh
                      </span>
                      <input
                        id="pledge_amount"
                        inputMode="numeric"
                        value={money(d.pledge_amount)}
                        onChange={(e) => set('pledge_amount')(e.target.value.replace(/\D/g, '').slice(0, 12))}
                        placeholder="0"
                        className={`${inputCls(errors.pledge_amount)} pl-14`}
                      />
                    </div>
                  </FieldShell>
                </div>
                <Choice
                  id="pledge_status"
                  label={tx('Hali ya Malipo ya Ahadi', 'Pledge Payment Status')}
                  options={PLEDGE_STATUS}
                  value={d.pledge_status}
                  onChange={set('pledge_status')}
                  lang={lang}
                  cols={3}
                />
                <FieldShell id="pledge_notes" label={tx('Maelezo ya Ziada', 'Additional Commitment Notes')} optional={optional}>
                  <textarea
                    id="pledge_notes"
                    rows={3}
                    maxLength={1000}
                    value={d.pledge_notes}
                    onChange={(e) => set('pledge_notes')(e.target.value)}
                    className={inputCls()}
                  />
                </FieldShell>
              </div>
            )}

            {step === 5 && (
              <div className="animate-fade-up">
                <StepTitle
                  eyebrow={tx('Hatua ya 6', 'Step 6')}
                  title={tx('Hakiki na Uwasilishe', 'Review and Submit')}
                  intro={tx('Hakikisha taarifa zako ni sahihi. Bofya "Hariri" kurekebisha.', 'Check that your details are correct. Tap "Edit" to make changes.')}
                />

                <div className="mb-6 flex items-center gap-4 border border-ink/10 bg-cream p-4">
                  {preview && <img src={preview} alt="" className="h-20 w-16 shrink-0 object-cover" />}
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-ink">{d.full_name}</p>
                    <p className="text-sm text-ink/55">{d.phone}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {review.map((sec) => {
                    const rows = sec.rows.filter(Boolean)
                    return (
                      <div key={sec.step} className="border border-ink/10">
                        <div className="flex items-center justify-between border-b border-ink/10 bg-parchment/60 px-4 py-2.5">
                          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
                            {sec.step === 4 && <Icon name="lock" className="h-3.5 w-3.5 text-gold-700" />}
                            {STEPS[sec.step][lang]}
                          </p>
                          <button
                            type="button"
                            onClick={() => goTo(sec.step)}
                            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-700 hover:text-gold-800"
                          >
                            {tx('Hariri', 'Edit')}
                          </button>
                        </div>
                        <dl className="divide-y divide-ink/5 px-4">
                          {rows.map(([k, v]) => (
                            <div key={k} className="grid gap-0.5 py-2 text-sm sm:grid-cols-[11rem_1fr] sm:gap-4">
                              <dt className="text-ink/50">{k}</dt>
                              <dd className={v ? 'text-ink' : 'text-ink/30'}>{v || '—'}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )
                  })}
                </div>

                <label
                  className={`mt-6 flex cursor-pointer items-start gap-3 border p-4 text-sm leading-relaxed text-ink/75 ${
                    errors.consent ? 'border-red-400 bg-red-50/40' : 'border-ink/15 bg-cream'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={d.consent}
                    onChange={(e) => set('consent')(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-gold-600"
                  />
                  <span>
                    {tx(
                      `Ninakubali taarifa hizi zikusanywe na kutumiwa na ${church.name} kwa ajili ya huduma za kichungaji na utawala wa kanisa pekee. Hazitashirikishwa kwa mtu wa nje bila idhini yangu.`,
                      `I consent to ${church.name} collecting and using this information solely for pastoral care and church administration. It will not be shared with outside parties without my permission.`,
                    )}
                  </span>
                </label>
                {errors.consent && <p className="mt-1 text-xs text-red-600">{errors.consent}</p>}
              </div>
            )}

            {formError && (
              <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {formError}
              </p>
            )}

            {/* vitufe */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              {step > 0 ? (
                <button type="button" onClick={() => goTo(step - 1)} className="btn-navy">
                  <Icon name="back" className="h-4 w-4" />
                  {tx('Rudi', 'Back')}
                </button>
              ) : (
                <span className="hidden sm:block" />
              )}
              <button type="submit" disabled={sending} className="btn-primary disabled:opacity-60">
                {step < 5 ? (
                  <>
                    {tx('Endelea', 'Continue')}
                    <Icon name="next" className="h-4 w-4" />
                  </>
                ) : sending ? (
                  tx('Inatuma…', 'Submitting…')
                ) : (
                  <>
                    <Icon name="check" className="h-4 w-4" />
                    {tx('Wasilisha Usajili', 'Submit Registration')}
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-5 flex items-start justify-center gap-2 text-center text-xs text-ink/45">
            <Icon name="shield" className="h-4 w-4 shrink-0 text-gold-600" />
            {tx('Taarifa zako zinahifadhiwa kwa usalama na kuonwa na uongozi wa kanisa pekee.', 'Your information is stored securely and seen only by church leadership.')}
          </p>
        </div>
      </Section>
    </>
  )
}

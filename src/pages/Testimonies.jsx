import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { Field, RadioCards } from '../components/Form.jsx'
import Recorder from '../components/Recorder.jsx'
import { Embed, ytId } from '../components/Media.jsx'
import { useSite, postTestimony } from '../content.jsx'

const TYPE_LABEL = { text: 'Maandishi', audio: 'Sauti', video: 'Video' }
const TYPE_ICON = { text: 'book', audio: 'music', video: 'play' }

function initialOf(name = '') {
  const c = name.trim().replace(/[^\p{L}]/gu, '')[0]
  return c ? c.toUpperCase() : '✦'
}

function Person({ t, className = '' }) {
  return (
    <figcaption className={`flex items-center gap-3 ${className}`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-navy-950 font-display text-sm font-bold text-gold-400">
        {initialOf(t.name)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-ink">{t.name}</span>
        <span className="block truncate text-xs text-ink/50">
          {[t.role, t.date].filter(Boolean).join(' · ')}
        </span>
      </span>
    </figcaption>
  )
}

function TypeTag({ type, pending }) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-600">
        <Icon name={TYPE_ICON[type] || 'book'} className="h-3.5 w-3.5" />
        {TYPE_LABEL[type] || 'Maandishi'}
      </span>
      {pending && (
        <span className="bg-gold-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gold-700">
          Inasubiri idhini
        </span>
      )}
    </div>
  )
}

/** Ushuhuda wa kwanza — kadi kubwa yenye nukuu. */
function FeaturedCard({ t }) {
  return (
    <figure className="relative overflow-hidden border border-ink/15 bg-white">
      <span className="absolute inset-x-0 top-0 h-1 bg-gold-500" />
      <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <TypeTag type={t.type} pending={t.pending} />
          <span className="mt-4 font-display text-5xl leading-none text-gold-400">&ldquo;</span>
          {t.text ? (
            <blockquote className="mt-1 text-lg font-medium leading-relaxed text-ink/85 sm:text-xl">
              {t.text}
            </blockquote>
          ) : (
            <p className="mt-1 text-base text-ink/60">Ushuhuda wa {TYPE_LABEL[t.type]?.toLowerCase()}.</p>
          )}
          <Person t={t} className="mt-6 border-t border-ink/10 pt-5" />
        </div>
        {t.type !== 'text' && (
          <div className="flex items-center bg-parchment p-5 sm:p-6">
            <div className="w-full">
              <Embed
                link={t.link}
                mediaUrl={t.mediaUrl}
                type={t.type}
                title={t.name}
                placeholder="Itapatikana baada ya idhini"
              />
            </div>
          </div>
        )}
      </div>
    </figure>
  )
}

function TestimonyCard({ t }) {
  return (
    <figure className="flex flex-col border border-ink/12 bg-white transition-shadow hover:shadow-[5px_5px_0_0_#e6cd9d]">
      <div className="flex flex-1 flex-col p-6">
        <TypeTag type={t.type} pending={t.pending} />

        {t.type !== 'text' && (
          <div className="mt-4">
            <Embed
              link={t.link}
              mediaUrl={t.mediaUrl}
              type={t.type}
              title={t.name}
              placeholder="Itapatikana baada ya idhini"
            />
          </div>
        )}

        {t.text && (
          <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink/70">
            <span className="mr-1 font-display text-xl leading-none text-gold-400">&ldquo;</span>
            {t.text}
          </blockquote>
        )}

        <Person t={t} className="mt-5 border-t border-ink/10 pt-4" />
      </div>
    </figure>
  )
}

export default function Testimonies() {
  const { testimonies } = useSite()
  const [mine, setMine] = useState([]) // optimistic, this session only
  const [filter, setFilter] = useState('Zote')
  const [error, setError] = useState('')

  // form state
  const [type, setType] = useState('text')
  const [method, setMethod] = useState('record') // record | upload | link
  const [recording, setRecording] = useState(null) // { url, blob }
  const [upload, setUpload] = useState(null) // { url, name, file }
  const [done, setDone] = useState(false)
  const [sending, setSending] = useState(false)

  const all = useMemo(() => [...mine, ...testimonies], [mine, testimonies])
  const list =
    filter === 'Zote' ? all : all.filter((t) => TYPE_LABEL[t.type] === filter)
  const [featured, ...rest] = list

  const counts = useMemo(() => {
    const c = { Zote: all.length, Maandishi: 0, Sauti: 0, Video: 0 }
    all.forEach((t) => (c[TYPE_LABEL[t.type]] = (c[TYPE_LABEL[t.type]] || 0) + 1))
    return c
  }, [all])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const f = Object.fromEntries(new FormData(e.currentTarget).entries())

    const fd = new FormData()
    fd.append('type', type)
    fd.append('name', f.name || 'Bila jina')
    fd.append('role', f.role || 'Mwanausharika')
    if (f.contact) fd.append('contact', f.contact)
    if (f.text) fd.append('body', f.text)
    if (type !== 'text' && method === 'link' && f.link) fd.append('link', f.link)
    const file =
      method === 'record' ? recording?.blob : method === 'upload' ? upload?.file : null
    if (type !== 'text' && file) {
      fd.append('media', file, method === 'record' ? 'ushuhuda.webm' : upload.name)
    }

    setSending(true)
    try {
      await postTestimony(fd)
      // optimistic pending card for this session
      setMine((m) => [
        {
          type,
          name: f.name || 'Bila jina',
          role: f.role || 'Mwanausharika',
          date: new Date().getFullYear().toString(),
          text: f.text || '',
          pending: true,
          mediaUrl:
            method === 'record' ? recording?.url : method === 'upload' ? upload?.url : '',
          link: method === 'link' ? f.link : '',
          youtubeId: method === 'link' && type === 'video' ? ytId(f.link) : '',
        },
        ...m,
      ])
      setDone(true)
      setRecording(null)
      setUpload(null)
    } catch {
      setError('Imeshindikana kutuma. Jaribu tena au wasiliana na ofisi.')
    } finally {
      setSending(false)
    }
  }

  function resetForm() {
    setDone(false)
    setType('text')
    setMethod('record')
    setRecording(null)
    setUpload(null)
  }

  return (
    <>
      <PageHeader crumbs={['Ushuhuda']} />

      {/* ---------- View ---------- */}
      <Section tint="cream">
        <SectionTitle
          eyebrow="Shuhuda za Waumini"
          title="Mungu bado anatenda"
          intro="Soma, sikiliza na tazama jinsi Bwana alivyowatendea wengine katika usharika wetu."
        />

        <div className="mb-10 flex flex-wrap gap-2">
          {['Zote', 'Maandishi', 'Sauti', 'Video'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`inline-flex items-center gap-2 border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                filter === t
                  ? 'border-ink bg-ink text-cream'
                  : 'border-ink/25 bg-white/70 text-ink/70 hover:border-ink hover:text-ink'
              }`}
            >
              {t}
              <span
                className={`text-[10px] ${filter === t ? 'text-cream/60' : 'text-ink/35'}`}
              >
                {counts[t] || 0}
              </span>
            </button>
          ))}
        </div>

        {mine.some((t) => t.pending) && (
          <div className="mb-8 flex items-start gap-3 border-l-2 border-gold-500 bg-gold-50 p-4 text-sm text-ink/70">
            <Icon name="shield" className="h-5 w-5 shrink-0 text-gold-700" />
            <p>
              Ushuhuda wako unasubiri idhini ya uongozi kabla ya kuonekana kwa
              umma. Unauona hapa kwa sababu umewasilishwa kutoka kifaa hiki.
            </p>
          </div>
        )}

        {list.length === 0 ? (
          <p className="border border-ink/12 bg-white/70 p-6 text-sm text-ink/55">
            Hakuna ushuhuda wa aina hii kwa sasa. Kuwa wa kwanza kushiriki hapa chini.
          </p>
        ) : (
          <div className="space-y-6">
            <FeaturedCard t={featured} />
            {rest.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((t, i) => (
                  <TestimonyCard key={i} t={t} />
                ))}
              </div>
            )}
          </div>
        )}
      </Section>

      {/* ---------- Share ---------- */}
      <Section tint="white">
        <div className="mx-auto max-w-2xl">
          <SectionTitle
            center
            eyebrow="Shiriki Ushuhuda Wako"
            title="Andika, rekodi au pakia"
            intro="Uongozi hupitia kila ushuhuda kabla ya kuchapishwa."
          />

          {done ? (
            <div className="flex flex-col items-center border border-gold-200 bg-white px-6 py-14 text-center">
              <span className="flex h-16 w-16 items-center justify-center bg-gold-100 text-gold-700">
                <Icon name="heart" className="h-8 w-8" />
              </span>
              <h3 className="mt-4 text-xl font-semibold">Asante kwa kushiriki!</h3>
              <p className="mt-2 max-w-md text-sm text-ink/60">
                Ushuhuda wako umepokelewa na utapitiwa na uongozi wa kanisa.
              </p>
              <button
                onClick={resetForm}
                className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-700 hover:text-gold-800"
              >
                Wasilisha mwingine
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 border border-ink/12 bg-white p-6 md:p-8">
              <RadioCards
                name="type"
                label="Aina ya ushuhuda"
                required
                defaultValue="text"
                onChange={setType}
                options={[
                  { value: 'text', label: 'Maandishi', desc: 'Andika ushuhuda' },
                  { value: 'audio', label: 'Sauti', desc: 'Rekodi au pakia sauti' },
                  { value: 'video', label: 'Video', desc: 'Rekodi, pakia au kiungo (YouTube, TikTok, Instagram)' },
                ]}
              />

              {type === 'text' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink/80">
                    Ushuhuda wako <span className="text-gold-600">*</span>
                  </label>
                  <textarea
                    name="text"
                    required
                    rows={6}
                    placeholder="Andika kwa uhuru jinsi Mungu alivyotenda..."
                    className="w-full rounded-sm border border-ink/25 bg-cream px-4 py-3 text-ink outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                  />
                </div>
              )}

              {type !== 'text' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {[
                      ['record', 'Rekodi hapa'],
                      ['upload', 'Pakia faili'],
                      ['link', 'Weka kiungo'],
                    ].map(([v, l]) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setMethod(v)}
                        className={`border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                          method === v
                            ? 'border-ink bg-ink text-cream'
                            : 'border-ink/25 text-ink/60 hover:border-ink'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>

                  {method === 'record' && (
                    <Recorder mode={type} onChange={setRecording} />
                  )}

                  {method === 'upload' && (
                    <label className="flex cursor-pointer items-center gap-3 border border-dashed border-ink/30 bg-cream px-4 py-4 text-sm text-ink/60 hover:border-gold-400">
                      <Icon name="arrow" className="h-5 w-5 -rotate-90 text-gold-600" />
                      {upload ? upload.name : `Chagua faili ya ${type === 'video' ? 'video' : 'sauti'}`}
                      <input
                        type="file"
                        accept={type === 'video' ? 'video/*' : 'audio/*'}
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          setUpload(file ? { file, url: URL.createObjectURL(file), name: file.name } : null)
                        }}
                      />
                    </label>
                  )}

                  {method === 'link' && (
                    <div>
                      <Field
                        label={
                          type === 'video'
                            ? 'Kiungo cha video (YouTube, TikTok, Instagram au Facebook)'
                            : 'Kiungo cha faili ya sauti'
                        }
                        name="link"
                        type="url"
                        required
                        placeholder={
                          type === 'video'
                            ? 'https://... (YouTube / TikTok / Instagram)'
                            : 'https://...'
                        }
                      />
                      {type === 'video' && (
                        <p className="mt-1.5 text-xs text-ink/50">
                          Nakili kiungo cha video kutoka YouTube, TikTok, Instagram
                          Reel au Facebook.
                        </p>
                      )}
                    </div>
                  )}

                  <Field
                    label="Maelezo mafupi (si lazima)"
                    name="text"
                    placeholder="Kichwa au muhtasari wa ushuhuda"
                  />
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Jina (au 'Bila jina')" name="name" required />
                <Field label="Wadhifa / Jumuiya" name="role" placeholder="Mfano: Kwaya ya Vijana" />
              </div>
              <Field label="Barua pepe / simu (haitachapishwa)" name="contact" />

              <p className="flex items-start gap-2 text-xs leading-relaxed text-ink/50">
                <Icon name="shield" className="h-4 w-4 shrink-0 text-gold-600" />
                Kwa kuwasilisha, unaruhusu kanisa kuchapisha ushuhuda huu katika
                tovuti na machapisho yake.
              </p>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60">
                {sending ? 'Inatuma…' : 'Wasilisha ushuhuda'}
              </button>
            </form>
          )}
        </div>
      </Section>
    </>
  )
}

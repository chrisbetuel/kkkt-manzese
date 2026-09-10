import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { Field, Select, TextArea } from '../components/Form.jsx'
import { fetchPrayers, postPrayer, prayFor } from '../content.jsx'

const CATEGORIES = [
  'Afya na Uponyaji',
  'Familia na Ndoa',
  'Kazi na Masomo',
  'Shukrani',
  'Uongozi wa Nchi',
  'Nyingine',
]

function prayedKey(id) {
  return `kkkt_prayed_${id}`
}

function PrayerCard({ p }) {
  const [count, setCount] = useState(p.prayedCount || 0)
  const [done, setDone] = useState(() => {
    try {
      return localStorage.getItem(prayedKey(p.id)) === '1'
    } catch {
      return false
    }
  })
  const [busy, setBusy] = useState(false)

  async function join() {
    if (done || busy) return
    setBusy(true)
    setCount((c) => c + 1)
    setDone(true)
    try {
      localStorage.setItem(prayedKey(p.id), '1')
    } catch {
      /* ignore */
    }
    try {
      const r = await prayFor(p.id)
      if (typeof r.prayedCount === 'number') setCount(r.prayedCount)
    } catch {
      /* keep optimistic value */
    } finally {
      setBusy(false)
    }
  }

  return (
    <figure className="flex flex-col border border-ink/12 bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">
          <Icon name="hands" className="h-3.5 w-3.5" />
          {p.category}
        </span>
        {p.answered && (
          <span className="bg-gold-100 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-gold-700">
            Limejibiwa
          </span>
        )}
      </div>

      <blockquote className="mt-3 flex-1 text-[13px] leading-relaxed text-ink/75">{p.body}</blockquote>

      {p.answered && p.answerNote && (
        <p className="mt-3 border-l-2 border-gold-500 bg-cream px-3 py-2 text-[12px] text-ink/70">
          <span className="font-semibold text-gold-700">Shukrani: </span>
          {p.answerNote}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/10 pt-3">
        <span className="truncate text-[12px] text-ink/50">— {p.name}</span>
        <button
          type="button"
          onClick={join}
          disabled={done}
          className={`inline-flex shrink-0 items-center gap-1.5 border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
            done
              ? 'border-gold-300 bg-gold-50 text-gold-700'
              : 'border-ink/20 text-ink/60 hover:border-ink hover:text-ink'
          }`}
        >
          <Icon name="hands" className="h-3.5 w-3.5" />
          {done ? 'Umeungana' : 'Naungana'}
          {count > 0 && <span className="text-ink/40">· {count}</span>}
        </button>
      </div>
    </figure>
  )
}

export default function Prayer() {
  const [wall, setWall] = useState([])
  const [filter, setFilter] = useState('Zote')

  const [done, setDone] = useState(null) // null | 'private' | 'public'
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [priv, setPriv] = useState(false)

  useEffect(() => {
    fetchPrayers()
      .then(setWall)
      .catch(() => {})
  }, [])

  const cats = useMemo(
    () => ['Zote', ...Array.from(new Set(wall.map((p) => p.category)))],
    [wall],
  )
  const list = filter === 'Zote' ? wall : wall.filter((p) => p.category === filter)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const f = Object.fromEntries(new FormData(e.currentTarget).entries())
    setSending(true)
    try {
      await postPrayer({
        name: f.name || '',
        contact: f.contact || '',
        category: f.category || 'Nyingine',
        body: f.body,
        is_private: priv,
      })
      setDone(priv ? 'private' : 'public')
    } catch {
      setError('Imeshindikana kutuma. Jaribu tena au wasiliana na ofisi ya kanisa.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <PageHeader crumbs={['Maombi']} />

      <Section tint="cream">
        <SectionTitle
          eyebrow="Ukuta wa Maombi"
          title="Tuombeane"
          intro="Wasilisha ombi lako na uungane kuwaombea wengine. “Ombeaneni ninyi kwa ninyi mpate kuponywa.” — Yakobo 5:16"
        />

        {cats.length > 2 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                  filter === c
                    ? 'border-ink bg-ink text-cream'
                    : 'border-ink/25 bg-white/70 text-ink/70 hover:border-ink hover:text-ink'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {list.length === 0 ? (
          <p className="border border-ink/12 bg-white/70 p-6 text-sm text-ink/55">
            Bado hakuna maombi ukutani. Kuwa wa kwanza kuwasilisha hapa chini.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <PrayerCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </Section>

      <Section tint="white">
        <div className="mx-auto max-w-2xl">
          <SectionTitle
            center
            eyebrow="Wasilisha Ombi"
            title="Tunaomba pamoja nawe"
            intro="Uongozi wa kanisa hupitia kila ombi. Chagua faragha kama hutaki lionekane ukutani."
          />

          {done ? (
            <div className="flex flex-col items-center border border-gold-200 bg-white px-6 py-14 text-center">
              <span className="flex h-16 w-16 items-center justify-center bg-gold-100 text-gold-700">
                <Icon name="hands" className="h-8 w-8" />
              </span>
              <h3 className="mt-4 text-xl font-semibold">Tumepokea ombi lako</h3>
              <p className="mt-2 max-w-md text-sm text-ink/60">
                {done === 'private'
                  ? 'Uongozi wa kanisa utaliombea kwa faragha. Mungu akubariki.'
                  : 'Litawekwa kwenye ukuta wa maombi baada ya kupitiwa na uongozi.'}
              </p>
              <button
                onClick={() => {
                  setDone(null)
                  setPriv(false)
                }}
                className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-700 hover:text-gold-800"
              >
                Wasilisha ombi lingine
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 border border-ink/12 bg-white p-6 md:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Jina (au acha wazi)" name="name" />
                <Field label="Simu / barua pepe (haitachapishwa)" name="contact" />
              </div>
              <Select label="Aina ya ombi" name="category" options={CATEGORIES} />
              <TextArea
                label="Ombi lako"
                name="body"
                required
                rows={5}
                placeholder="Andika ombi lako hapa..."
              />

              <label className="flex cursor-pointer items-start gap-3 border border-ink/15 bg-cream p-4 text-sm text-ink/70">
                <input
                  type="checkbox"
                  checked={priv}
                  onChange={(e) => setPriv(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-gold-600"
                />
                <span>
                  <span className="font-semibold text-ink">Omba kwa faragha</span> — uongozi
                  wa kanisa pekee ataliona; halitawekwa kwenye ukuta wa maombi.
                </span>
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60">
                {sending ? 'Inatuma…' : 'Wasilisha ombi'}
              </button>
            </form>
          )}
        </div>
      </Section>
    </>
  )
}

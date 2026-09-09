import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { useSite } from '../content.jsx'

function CopyRow({ label, value }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard haipatikani */
    }
  }
  return (
    <div className="flex items-center justify-between gap-3 border-t border-ink/10 pt-3">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/45">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-ink">{value}</p>
      </div>
      <button
        onClick={copy}
        className="shrink-0 border border-ink px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-cream"
      >
        {copied ? 'Imenakiliwa' : 'Nakili'}
      </button>
    </div>
  )
}

export default function Giving() {
  const { givingMethods, givingInPerson, givingPurposes } = useSite()
  return (
    <>
      <PageHeader
        crumbs={['Sadaka, Zaka na Michango']}
        eyebrow="Sadaka, Zaka na Michango"
        title="Toa kwa moyo wa shukrani"
        subtitle="&ldquo;Mungu humpenda yeye atoaye kwa moyo wa ukunjufu.&rdquo; — 2 Wakorintho 9:7"
      />

      <Section tint="cream">
        <SectionTitle eyebrow="Njia za Kutoa" title="Chagua njia inayokufaa" />
        <div className="grid gap-6 md:grid-cols-2">
          {givingMethods.map((m) => (
            <div key={m.name} className="card flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-navy-900 text-gold-400">
                  <Icon name={m.icon} className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">
                    {m.group}
                  </p>
                  <h3 className="text-lg font-semibold">{m.name}</h3>
                </div>
              </div>
              <CopyRow label="Jina la mpokeaji" value={m.holder} />
              <CopyRow label="Namba" value={m.number} />
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-4 border border-ink/12 bg-white/60 p-6">
          <Icon name="hand" className="h-6 w-6 shrink-0 text-gold-600" />
          <p className="text-sm leading-relaxed text-ink/70">{givingInPerson}</p>
        </div>
      </Section>

      <Section tint="white">
        <SectionTitle eyebrow="Matumizi" title="Michango yako inasaidia nini" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {givingPurposes.map((p) => (
            <div key={p.title} className="border border-ink/12 bg-cream p-6">
              <h3 className="font-display text-base font-semibold uppercase tracking-[0.1em] text-ink">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-ink/65">{p.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center gap-4 bg-parchment p-6">
          <Icon name="shield" className="h-6 w-6 shrink-0 text-gold-600" />
          <p className="text-sm text-ink/75">
            <strong className="font-semibold text-ink">Uwazi:</strong> Kwa risiti au
            maswali ya kifedha, wasiliana na Mweka Hazina.
          </p>
        </div>
      </Section>
    </>
  )
}

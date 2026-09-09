import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { useSite } from '../content.jsx'

export default function About() {
  const { church, beliefs, values } = useSite()
  return (
    <>
      <PageHeader
        crumbs={['Kuhusu Sisi']}
        eyebrow="Kuhusu Sisi"
        title="Historia, Dira, Dhamira na Imani"
        subtitle="Fahamu safari ya Usharika wa KKKT Manzese na misingi inayoiongoza."
        image="https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=75"
      />

      {/* History */}
      <Section tint="cream">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <SectionTitle eyebrow="Historia" title="Safari yetu" />
            <div className="prose-church">
              <p>{beliefs.history}</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              ['calendar', 'Ulianzishwa', church.founded],
              ['pin', 'Eneo', 'Manzese, Dar es Salaam'],
              ['book', 'Dhehebu', 'KKKT (Kilutheri)'],
            ].map(([icon, label, val]) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                  <Icon name={icon} className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gold-700">
                    {label}
                  </p>
                  <p className="font-display text-lg font-semibold text-navy-900">
                    {val}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Vision & Mission */}
      <Section tint="white">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-navy-950 p-8 text-cream md:p-10">
            <Icon name="spark" className="h-9 w-9 text-gold-400" />
            <h3 className="mt-4 text-2xl font-bold text-white">Dira (Vision)</h3>
            <p className="mt-3 leading-relaxed text-navy-200">{beliefs.vision}</p>
          </div>
          <div className="rounded-3xl border border-gold-200 bg-parchment p-8 md:p-10">
            <Icon name="heart" className="h-9 w-9 text-gold-700" />
            <h3 className="mt-4 text-2xl font-bold text-navy-900">
              Dhamira (Mission)
            </h3>
            <p className="mt-3 leading-relaxed text-navy-700">{beliefs.mission}</p>
          </div>
        </div>
      </Section>

      {/* Confession */}
      <Section tint="cream">
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionTitle eyebrow="Imani ya Kilutheri" title="Tunachokiri" />
          <div className="prose-church rounded-2xl border border-navy-100 bg-white p-8">
            <p>{beliefs.confession}</p>
          </div>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="card">
              <Icon name={v.icon} className="h-8 w-8 text-gold-600" />
              <h4 className="mt-3 text-lg font-semibold">{v.title}</h4>
              <p className="mt-2 text-sm text-navy-600">{v.text}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { useSite } from '../content.jsx'

export default function Leadership() {
  const { leadership } = useSite()
  return (
    <>
      <PageHeader
        crumbs={['Uongozi']}
        eyebrow="Uongozi wa Kanisa"
        title="Watumishi wanaoongoza usharika"
        subtitle="Wachungaji, wainjilisti, wazee wa kanisa na Halmashauri ya Usharika."
        image="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1600&q=75"
      />

      <Section tint="cream">
        <SectionTitle eyebrow="Watumishi wa Neno" title="Wachungaji na Wainjilisti" />
        <div className="grid gap-8 md:grid-cols-3">
          {leadership.clergy.map((p) => (
            <div key={p.role} className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <img
                src={p.photo}
                alt={p.name}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold-700">
                  {p.role}
                </p>
                <h3 className="mt-1 text-xl font-semibold">{p.name}</h3>
                <p className="mt-2 text-sm text-navy-600">{p.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section tint="white">
        <SectionTitle
          eyebrow="Utawala"
          title="Halmashauri ya Usharika"
          intro="Kamati inayosimamia uendeshaji wa usharika."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.council.map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-navy-100 bg-cream p-5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                <Icon name="shield" className="h-6 w-6" />
              </span>
              <div>
                <p className="font-semibold text-navy-900">{m.name}</p>
                <p className="text-sm text-navy-500">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

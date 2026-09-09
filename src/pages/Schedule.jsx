import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { useSite } from '../content.jsx'

export default function Schedule() {
  const { services, sacraments } = useSite()
  return (
    <>
      <PageHeader
        crumbs={['Ratiba ya Ibada']}
        eyebrow="Ratiba ya Ibada na Huduma"
        title="Nyakati za kukutana na kuabudu"
        subtitle="Karibu ujiunge nasi. Ibada zetu zinafanyika kwa lugha ya Kiswahili."
        image="https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?auto=format&fit=crop&w=1600&q=75"
      />

      <Section tint="cream">
        <SectionTitle eyebrow="Kila Wiki" title="Ratiba ya kawaida" />
        <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white">
          <table className="w-full text-left">
            <thead className="bg-navy-950 text-cream">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-widest">
                  Siku / Huduma
                </th>
                <th className="hidden px-6 py-4 text-sm font-semibold uppercase tracking-widest sm:table-cell">
                  Maelezo
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-widest">
                  Muda
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {services.map((s) => (
                <tr key={s.name} className="transition-colors hover:bg-cream">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-navy-900">{s.name}</p>
                    <p className="text-sm text-navy-500">{s.day}</p>
                  </td>
                  <td className="hidden px-6 py-4 text-sm text-navy-600 sm:table-cell">
                    {s.note}
                  </td>
                  <td className="px-6 py-4 text-right font-display text-lg text-gold-700">
                    {s.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section tint="white">
        <SectionTitle eyebrow="Huduma Maalum" title="Sakramenti" />
        <div className="grid gap-6 sm:grid-cols-2">
          {sacraments.map((s) => (
            <div key={s.title} className="card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                <Icon name="cross" className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl bg-parchment p-8 text-center">
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/ubatizo" className="btn-primary">
              Jiandikishe kwa Ubatizo
            </Link>
            <Link to="/wasiliana" className="btn-navy">
              Wasiliana na ofisi ya kanisa
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}

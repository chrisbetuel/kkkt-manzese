import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { useSite } from '../content.jsx'

export default function Departments() {
  const { departments } = useSite()
  return (
    <>
      <PageHeader
        crumbs={['Idara na Vikundi']}
        eyebrow="Idara na Vikundi"
        title="Vikundi vinavyohudumia kila rika"
        subtitle="Chagua kinachokufaa na ujiunge."
        image="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1600&q=75"
      />

      <Section tint="cream">
        <div className="space-y-6">
          {departments.map((d, i) => (
            <div
              key={d.slug}
              className={`grid gap-6 rounded-3xl border border-navy-100 bg-white p-6 md:grid-cols-[auto_1fr] md:p-8 ${
                i % 2 ? '' : ''
              }`}
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${d.color} text-white`}
              >
                <Icon name={d.icon} className="h-8 w-8" />
              </div>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xl font-semibold md:text-2xl">{d.name}</h3>
                  <span className="text-xs font-medium uppercase tracking-widest text-gold-700">
                    {d.meets}
                  </span>
                </div>
                <p className="mt-3 leading-relaxed text-navy-600">{d.text}</p>
                <p className="mt-4 text-sm text-navy-500">
                  <span className="font-semibold text-navy-800">Kiongozi:</span>{' '}
                  {d.leader}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-navy-950 p-10 text-center text-cream">
          <h3 className="text-2xl font-bold text-white">Unataka kujiunga?</h3>
          <p className="mx-auto mt-3 max-w-lg text-navy-200">
            Jaza fomu ya kujiunga na kwaya au timu ya huduma, au ongea na kiongozi
            wa idara husika baada ya ibada.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/jiunge" className="btn-primary">
              Jiunge na Kikundi
            </Link>
            <Link to="/kujitolea" className="btn-outline">
              Jitolee Kuhudumu
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}

import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { useSite } from '../content.jsx'

export default function Involve() {
  const { involveOptions } = useSite()
  return (
    <>
      <PageHeader
        crumbs={['Shiriki']}
        eyebrow="Shiriki Nasi"
        title="Kuna nafasi kwa ajili yako"
        subtitle="Chagua namna unavyotaka kushiriki."
        image="https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1600&q=75"
      />

      <Section tint="cream">
        <SectionTitle
          eyebrow="Njia za Kushiriki"
          title="Chagua unachotaka kufanya"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {involveOptions.map((o) => (
            <Link key={o.to} to={o.to} className="card group flex flex-col">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                <Icon name={o.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{o.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">{o.text}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-700">
                Endelea
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  )
}

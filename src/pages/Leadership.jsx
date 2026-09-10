import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { useSite } from '../content.jsx'

function Contact({ phone, email }) {
  if (!phone && !email) return null
  return (
    <div className="mt-3 space-y-1.5 border-t border-ink/10 pt-3 text-[13px]">
      {phone && (
        <a
          href={`tel:${phone.replace(/\s/g, '')}`}
          className="flex items-center gap-2 text-ink/65 transition-colors hover:text-gold-700"
        >
          <Icon name="phone" className="h-3.5 w-3.5 shrink-0 text-gold-500" />
          {phone}
        </a>
      )}
      {email && (
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-2 break-all text-ink/65 transition-colors hover:text-gold-700"
        >
          <Icon name="mail" className="h-3.5 w-3.5 shrink-0 text-gold-500" />
          {email}
        </a>
      )}
    </div>
  )
}

function Avatar({ src, name, className = '' }) {
  if (src) return <img src={src} alt={name} className={`object-cover ${className}`} />
  return (
    <div className={`flex items-center justify-center bg-navy-950 ${className}`}>
      <span className="font-display text-4xl font-bold text-gold-400/60">{name?.[0] || '✦'}</span>
    </div>
  )
}

export default function Leadership() {
  const { leadership } = useSite()
  const clergy = leadership.clergy || []
  const council = leadership.council || []

  return (
    <>
      <PageHeader
        crumbs={['Uongozi']}
        image="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1600&q=75"
      />

      {clergy.length > 0 && (
        <Section tint="cream">
          <SectionTitle eyebrow="Watumishi wa Neno" title="Wachungaji na Wainjilisti" />
          <div className="grid gap-8 md:grid-cols-3">
            {clergy.map((p, i) => (
              <div key={i} className="overflow-hidden border border-ink/12 bg-white">
                <Avatar src={p.photo} name={p.name} className="aspect-[4/5] w-full" />
                <div className="p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-600">
                    {p.role}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold">{p.name}</h3>
                  {p.bio && <p className="mt-2 text-sm text-ink/60">{p.bio}</p>}
                  <Contact phone={p.phone} email={p.email} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section tint="white">
        <SectionTitle
          eyebrow="Utawala"
          title="Halmashauri ya Usharika"
          intro="Kamati inayosimamia uendeshaji wa usharika."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {council.map((m, i) => (
            <div key={i} className="flex flex-col border border-ink/12 bg-cream p-5">
              <div className="flex items-start gap-4">
                <Avatar src={m.photo} name={m.name} className="h-16 w-16 shrink-0 rounded-full" />
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">
                    {m.role}
                  </p>
                  <p className="mt-0.5 font-semibold text-ink">{m.name}</p>
                  {m.bio && <p className="mt-1 text-sm leading-relaxed text-ink/60">{m.bio}</p>}
                </div>
              </div>
              <Contact phone={m.phone} email={m.email} />
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

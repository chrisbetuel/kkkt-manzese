import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { church } from '../data/site.js'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: unganisha na huduma ya barua pepe / backend (mfano Formspree, EmailJS)
    setSent(true)
  }

  const details = [
    { icon: 'pin', label: 'Anwani', value: church.address, href: church.mapLink },
    { icon: 'mail', label: 'Barua pepe', value: church.email, href: `mailto:${church.email}` },
    {
      icon: 'phone',
      label: 'Simu',
      value: `${church.phone} / ${church.phoneAlt}`,
      href: `tel:${church.phone.replace(/\s/g, '')}`,
    },
  ]

  return (
    <>
      <PageHeader
        crumbs={['Wasiliana']}
        eyebrow="Wasiliana Nasi"
        title="Tungependa kusikia kutoka kwako"
        subtitle="Tuma ujumbe, tupigie simu, au tembelea kanisani. Karibu sana."
        image="https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=1600&q=75"
      />

      <Section tint="cream">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Details */}
          <div>
            <SectionTitle eyebrow="Mawasiliano" title="Taarifa za kanisa" />
            <div className="space-y-4">
              {details.map((d) => (
                <a
                  key={d.label}
                  href={d.href}
                  target={d.icon === 'pin' ? '_blank' : undefined}
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-5 transition-colors hover:border-gold-300"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                    <Icon name={d.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gold-700">
                      {d.label}
                    </p>
                    <p className="font-medium text-navy-900">{d.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              {[
                ['facebook', church.social.facebook],
                ['instagram', church.social.instagram],
                ['youtube', church.social.youtube],
              ].map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-200 text-navy-700 transition-colors hover:border-gold-400 hover:text-gold-700"
                >
                  <Icon name={name} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-navy-100 bg-white p-6 md:p-8">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                  <Icon name="mail" className="h-8 w-8" />
                </span>
                <h3 className="mt-4 text-xl font-semibold">Asante!</h3>
                <p className="mt-2 text-navy-600">
                  Ujumbe wako umepokelewa. Tutawasiliana nawe hivi karibuni.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-semibold">Tuma ujumbe</h3>
                <Field label="Jina lako" name="name" required />
                <Field label="Barua pepe" name="email" type="email" required />
                <Field label="Namba ya simu" name="phone" type="tel" />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy-800">
                    Ujumbe
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    className="w-full rounded-xl border border-navy-200 bg-cream px-4 py-3 text-navy-900 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Tuma ujumbe
                </button>
              </form>
            )}
          </div>
        </div>
      </Section>

      {/* Map */}
      <section className="h-[420px] w-full">
        <iframe
          title="Ramani ya KKKT Manzese"
          src={church.mapEmbed}
          className="h-full w-full border-0 grayscale-[0.2]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  )
}

function Field({ label, name, type = 'text', required }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy-800">
        {label} {required && <span className="text-gold-600">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-navy-200 bg-cream px-4 py-3 text-navy-900 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
      />
    </div>
  )
}

import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { Field, Select, TextArea, FormPanel } from '../components/Form.jsx'
import { useSite, postSubmission } from '../content.jsx'

export default function Partner() {
  const { partnerWays } = useSite()
  return (
    <>
      <PageHeader crumbs={['Shiriki', 'Ubia na Uwekezaji']} />

      <Section tint="cream">
        <SectionTitle
          eyebrow="Ubia na Uwekezaji"
          title="Ungana nasi kujenga kanisa na jamii"
          intro="Ubia wako — wa fedha, ujuzi au biashara — husaidia huduma za kiroho na maendeleo Manzese."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {partnerWays.map((w) => (
            <div key={w.title} className="card flex gap-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-navy-900 text-gold-400">
                <Icon name={w.icon} className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-lg font-semibold">{w.title}</h3>
                <p className="mt-1 text-sm text-ink/65">{w.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border border-ink/12 bg-white/60 p-6">
          <Icon name="hand" className="h-6 w-6 shrink-0 text-gold-600" />
          <p className="text-sm text-ink/70">
            Kwa michango ya moja kwa moja, angalia{' '}
            <Link to="/michango" className="border-b border-ink/40 font-semibold hover:border-ink">
              njia za kutoa
            </Link>
            .
          </p>
        </div>
      </Section>

      <Section tint="white">
        <div className="mx-auto max-w-2xl">
          <SectionTitle center eyebrow="Fomu" title="Onyesha nia ya kuwa mshirika" />
          <FormPanel
              onSubmit={(data) => postSubmission('partner', data)}
            submitLabel="Wasilisha"
            successTitle="Asante!"
            successText="Uongozi wa usharika utawasiliana nawe kuzungumzia hatua zinazofuata."
            note="Taarifa zako zitatumika kwa mawasiliano ya ubia pekee."
          >
            <Field label="Jina / Jina la taasisi" name="name" required />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Namba ya simu" name="phone" type="tel" required />
              <Field label="Barua pepe" name="email" type="email" />
            </div>
            <Select
              label="Aina ya ubia"
              name="partnerType"
              required
              options={partnerWays.map((w) => w.title)}
            />
            <Select
              label="Kiwango unachotarajia (si lazima)"
              name="amount"
              options={[
                'Chini ya TZS 50,000 / mwezi',
                'TZS 50,000 – 200,000 / mwezi',
                'TZS 200,000+ / mwezi',
                'Mchango wa mara moja kwa mradi',
                'Ujuzi / bidhaa (si fedha)',
              ]}
            />
            <TextArea label="Maelezo ya ziada" name="notes" rows={4} />
          </FormPanel>
        </div>
      </Section>
    </>
  )
}

import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { Field, Select, TextArea, RadioCards, CheckboxList, FormPanel } from '../components/Form.jsx'
import { useSite, postSubmission } from '../content.jsx'

export default function JoinTeam() {
  const { choirs, serviceTeams } = useSite()
  return (
    <>
      <PageHeader
        crumbs={['Shiriki', 'Jiunge na Kikundi']}
        eyebrow="Jiunge na Timu"
        title="Tumia kipawa chako katika huduma"
        subtitle="Jiunge na kwaya au timu ya huduma."
        image="https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?auto=format&fit=crop&w=1600&q=75"
      />

      <Section tint="cream">
        <SectionTitle eyebrow="Kwaya Zetu" title="Chagua kwaya" center />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {choirs.map((c) => (
            <div key={c.value} className="card">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                <Icon name="music" className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{c.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tint="white">
        <div className="mx-auto max-w-2xl">
          <SectionTitle eyebrow="Fomu ya Kujiunga" title="Jaza taarifa zako" center />
          <FormPanel
              onSubmit={(data) => postSubmission('join_team', data)}
            submitLabel="Wasilisha ombi la kujiunga"
            successTitle="Karibu timu!"
            successText="Kiongozi wa kikundi ulichochagua atawasiliana nawe kuhusu mazoezi na hatua zinazofuata."
            note="Taarifa zako zitashirikiwa na kiongozi wa kikundi husika pekee."
          >
            <Field label="Jina kamili" name="name" required />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Namba ya simu" name="phone" type="tel" required />
              <Field label="Barua pepe" name="email" type="email" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Umri" name="age" type="number" min="5" max="120" />
              <Field label="Jumuiya / Mtaa" name="community" />
            </div>

            <RadioCards
              required
              name="choir"
              label="Kwaya unayotaka kujiunga nayo"
              options={choirs}
            />

            <CheckboxList
              name="teams"
              label="Timu nyingine za huduma (si lazima)"
              options={serviceTeams}
            />

            <Select
              label="Una uzoefu wa kuimba / kucheza ala?"
              name="experience"
              options={[
                'Sina uzoefu — nataka kujifunza',
                'Kidogo (nimeimba kwaya awali)',
                'Uzoefu wa kutosha',
                'Napiga ala ya muziki',
              ]}
            />

            <TextArea
              label="Kwa nini unataka kujiunga?"
              name="motivation"
              rows={3}
            />
          </FormPanel>
        </div>
      </Section>
    </>
  )
}

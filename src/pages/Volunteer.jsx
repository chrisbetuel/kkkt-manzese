import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { Field, TextArea, Select, CheckboxList, FormPanel } from '../components/Form.jsx'
import { volunteerAreas } from '../data/site.js'

export default function Volunteer() {
  return (
    <>
      <PageHeader
        crumbs={['Shiriki', 'Kujitolea']}
        eyebrow="Kujitolea"
        title="Toa muda na kipawa chako"
        subtitle="&ldquo;Kila mmoja na atumie kipawa alichopewa kwa kuhudumiana.&rdquo; — 1 Petro 4:10"
        image="https://images.unsplash.com/photo-1466629437334-b4f6603563c5?auto=format&fit=crop&w=1600&q=75"
      />

      <Section tint="cream">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionTitle eyebrow="Maeneo ya Huduma" title="Tunapohitaji msaada" />
            <div className="grid gap-3 sm:grid-cols-2">
              {volunteerAreas.map((a) => (
                <div
                  key={a}
                  className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white p-4 text-sm text-navy-700"
                >
                  <Icon name="hands" className="h-5 w-5 shrink-0 text-gold-600" />
                  {a}
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle eyebrow="Fomu" title="Jiandikishe kujitolea" />
            <FormPanel
              submitLabel="Wasilisha"
              successTitle="Asante kwa moyo wa kujitolea!"
              successText="Mratibu wa huduma atawasiliana nawe kukueleza jinsi unavyoweza kuanza."
              note="Baadhi ya huduma zinaweza kuhitaji mafunzo mafupi au usaili."
            >
              <Field label="Jina kamili" name="name" required />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Namba ya simu" name="phone" type="tel" required />
                <Field label="Barua pepe" name="email" type="email" />
              </div>
              <CheckboxList
                name="areas"
                label="Maeneo unayopenda kujitolea"
                options={volunteerAreas}
              />
              <Select
                label="Upatikanaji wako"
                name="availability"
                options={[
                  'Jumapili pekee',
                  'Wiki nzima',
                  'Jioni za wiki',
                  'Wikendi',
                  'Matukio maalum tu',
                ]}
              />
              <TextArea
                label="Ujuzi au uzoefu unaoweza kusaidia"
                name="skills"
                rows={3}
                placeholder="Mfano: uhasibu, uandishi, useremala, muziki, uuguzi..."
              />
            </FormPanel>
          </div>
        </div>
      </Section>
    </>
  )
}

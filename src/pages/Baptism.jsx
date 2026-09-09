import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { Field, Select, TextArea, RadioCards, FormPanel } from '../components/Form.jsx'
import { baptismChecklist } from '../data/site.js'

export default function Baptism() {
  return (
    <>
      <PageHeader
        crumbs={['Shiriki', 'Ubatizo']}
        eyebrow="Sakramenti ya Ubatizo"
        title="Jiandikishe kwa Ubatizo Mtakatifu"
        subtitle="&ldquo;…mkiwabatiza kwa jina la Baba, na la Mwana, na la Roho Mtakatifu.&rdquo; — Mathayo 28:19"
        image="https://images.unsplash.com/photo-1523803326055-13445f07f1f6?auto=format&fit=crop&w=1600&q=75"
      />

      <Section tint="cream">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          {/* Info */}
          <div>
            <SectionTitle eyebrow="Maandalizi" title="Kabla ya kujiandikisha" />
            <ul className="space-y-3">
              {baptismChecklist.map((c) => (
                <li key={c} className="flex gap-3 text-sm text-navy-700">
                  <Icon name="cross" className="h-5 w-5 shrink-0 text-gold-600" />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-8 bg-parchment p-6 text-sm text-navy-700">
              <strong>Kumbuka:</strong> Ofisi ya kanisa itawasiliana nawe kupanga
              tarehe baada ya kujaza fomu.
            </div>
          </div>

          {/* Form */}
          <div>
            <SectionTitle eyebrow="Fomu" title="Taarifa za maombi" />
            <FormPanel
              submitLabel="Wasilisha maombi ya ubatizo"
              successTitle="Maombi yamepokelewa"
              successText="Ofisi ya kanisa itawasiliana nawe kupanga tarehe ya ubatizo. Mungu akubariki."
              note="Taarifa hizi ni kwa maandalizi ya ubatizo pekee."
            >
              <RadioCards
                required
                name="baptismFor"
                label="Ubatizo ni kwa ajili ya nani?"
                options={[
                  { value: 'Mtoto', label: 'Mtoto', desc: 'Chini ya miaka 13' },
                  { value: 'Mtu mzima', label: 'Mtu mzima', desc: 'Miaka 13 na zaidi' },
                ]}
              />
              <Field label="Jina kamili la mbatizwa" name="candidateName" required />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Tarehe ya kuzaliwa" name="dob" type="date" />
                <Select
                  label="Jinsia"
                  name="gender"
                  options={['Mume', 'Mke']}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Jina la baba" name="fatherName" />
                <Field label="Jina la mama" name="motherName" />
              </div>
              <Field label="Majina ya wadhamini (godparents)" name="godparents" />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Namba ya simu ya mawasiliano" name="phone" type="tel" required />
                <Field label="Barua pepe" name="email" type="email" />
              </div>
              <Field label="Jumuiya / Mtaa" name="community" />
              <TextArea
                label="Maelezo ya ziada"
                name="notes"
                rows={3}
                placeholder="Mfano: tarehe unayopendelea, mahitaji maalum..."
              />
            </FormPanel>
          </div>
        </div>
      </Section>
    </>
  )
}

import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { Field, Select, TextArea, RadioCards, FormPanel } from '../components/Form.jsx'
import { postSubmission } from '../content.jsx'

export default function UploadSermon() {
  return (
    <>
      <PageHeader crumbs={['Mahubiri', 'Pakia']} />

      <Section tint="cream">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex items-start gap-3 border-l-2 border-gold-500 bg-gold-50 p-4 text-sm text-ink/70">
            <Icon name="shield" className="h-5 w-5 shrink-0 text-gold-700" />
            <p>
              Tovuti haihifadhi faili za mahubiri. Pakia hubiri kwenye YouTube,
              Facebook, mixlr, SoundCloud au Google Drive, kisha weka <strong>kiungo</strong> hapa.
            </p>
          </div>

          <SectionTitle eyebrow="Timu ya Media" title="Wasilisha kiungo cha hubiri" />
          <FormPanel
            onSubmit={(data) => postSubmission('sermon_upload', data)}
            submitLabel="Wasilisha kiungo"
            successTitle="Kiungo kimewasilishwa"
            successText="Msimamizi wa tovuti atakithibitisha na kukichapisha kwenye ukurasa wa Mahubiri."
            note="Hakikisha una ruhusa ya kushiriki rekodi hii hadharani."
          >
            <RadioCards
              required
              name="type"
              label="Aina ya hubiri"
              options={[
                { value: 'Video', label: 'Video', desc: 'YouTube, Facebook n.k.' },
                { value: 'Sauti', label: 'Sauti', desc: 'mixlr, SoundCloud, MP3' },
                { value: 'Maandishi', label: 'Maandishi', desc: 'Google Docs / PDF' },
              ]}
            />
            <Field label="Kichwa cha hubiri" name="title" required />
            <Field
              label="Kiungo cha hubiri (URL)"
              name="link"
              type="url"
              required
              placeholder="https://youtube.com/watch?v=..."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Mhubiri" name="preacher" required />
              <Field label="Tarehe ya kuhubiriwa" name="date" type="date" required />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Andiko / Msingi wa Biblia" name="scripture" placeholder="Mfano: Yohana 3:16" />
              <Field label="Mfululizo (series)" name="series" placeholder="Mfano: Kuishi kwa Imani" />
            </div>
            <TextArea label="Muhtasari mfupi wa hubiri" name="summary" rows={4} required />
            <Select
              label="Lugha"
              name="language"
              options={['Kiswahili', 'Kiingereza', 'Nyingine']}
            />
          </FormPanel>

          <p className="mt-6 text-center text-sm text-ink/50">
            Unatafuta mahubiri ya kusikiliza?{' '}
            <Link to="/mahubiri" className="font-semibold text-gold-700 hover:text-gold-800">
              Nenda kwenye ukurasa wa Mahubiri
            </Link>
          </p>
        </div>
      </Section>
    </>
  )
}

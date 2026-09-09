import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { Field, Select, TextArea, RadioCards, FileInput, FormPanel } from '../components/Form.jsx'

export default function UploadSermon() {
  return (
    <>
      <PageHeader
        crumbs={['Mahubiri', 'Pakia']}
        eyebrow="Timu ya Media"
        title="Pakia hubiri jipya"
        subtitle="Fomu hii ni kwa ajili ya timu ya media ya kanisa kupakia mahubiri ya sauti, video au maandishi."
        image="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=75"
      />

      <Section tint="cream">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex items-center gap-3 border border-gold-200 bg-gold-50 p-4 text-sm text-navy-700">
            <Icon name="shield" className="h-5 w-5 shrink-0 text-gold-700" />
            <p>Kwa video kubwa, pakia YouTube kisha weka kiungo hapa.</p>
          </div>

          <SectionTitle eyebrow="Fomu" title="Taarifa za hubiri" />
          <FormPanel
            submitLabel="Pakia hubiri"
            successTitle="Hubiri limewasilishwa"
            successText="Msimamizi wa tovuti atalithibitisha na kulichapisha kwenye ukurasa wa Mahubiri."
            note="Hakikisha una ruhusa ya kuchapisha rekodi hii."
          >
            <RadioCards
              required
              name="type"
              label="Aina ya hubiri"
              options={[
                { value: 'Video', label: 'Video', desc: 'YouTube au faili ya video' },
                { value: 'Sauti', label: 'Sauti', desc: 'MP3 / rekodi ya sauti' },
                { value: 'Maandishi', label: 'Maandishi', desc: 'Nakala ya hubiri' },
              ]}
            />
            <Field label="Kichwa cha hubiri" name="title" required />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Mhubiri" name="preacher" required />
              <Field label="Tarehe ya kuhubiriwa" name="date" type="date" required />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Andiko / Msingi wa Biblia" name="scripture" placeholder="Mfano: Yohana 3:16" />
              <Field label="Mfululizo (series)" name="series" placeholder="Mfano: Kuishi kwa Imani" />
            </div>
            <Field
              label="Kiungo cha YouTube / SoundCloud (kama kipo)"
              name="link"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
            />
            <FileInput
              label="Pakia faili (sauti au video)"
              name="mediaFile"
              accept="audio/*,video/*,.pdf,.doc,.docx"
              hint="MP3, MP4, PDF au Word. Kikomo kinategemea mtoa huduma wa hosting."
            />
            <TextArea label="Muhtasari wa hubiri" name="summary" rows={4} required />
            <Select
              label="Lugha"
              name="language"
              options={['Kiswahili', 'Kiingereza', 'Nyingine']}
            />
          </FormPanel>

          <p className="mt-6 text-center text-sm text-navy-500">
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

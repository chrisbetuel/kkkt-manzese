import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useSite } from '../content.jsx'
import { useLang } from '../lib/prefs.jsx'
import { apiUrl } from '../lib/api.js'
import Icon from './Icon.jsx'

/**
 * Kadi ya uanachama ya kidijitali. QR ina kiungo cha uthibitisho chenye tokeni ya nasibu tu —
 * haina taarifa binafsi; anayeichanganua huona jina na hali ya uanachama pekee.
 */
export default function MembershipCard({ profile }) {
  const { t } = useLang()
  const { church } = useSite()
  const [qr, setQr] = useState('')
  const [photoOk, setPhotoOk] = useState(profile.hasPhoto)

  useEffect(() => {
    if (!profile.card?.verifyUrl) return
    QRCode.toDataURL(profile.card.verifyUrl, { margin: 1, width: 240, color: { dark: '#0e2344', light: '#ffffff' } })
      .then(setQr)
      .catch(() => setQr(''))
  }, [profile.card?.verifyUrl])

  if (!profile.card) {
    return (
      <p className="rounded-2xl border border-line bg-parchment p-5 text-sm">
        {t('Kadi itapatikana baada ya usajili wako kuthibitishwa na ofisi ya kanisa.', 'Your card will be available once the church office verifies your registration.')}
      </p>
    )
  }

  return (
    <div>
      <div className="print-card mx-auto w-full max-w-[420px] overflow-hidden rounded-[20px] bg-navy-950 text-white shadow-card [aspect-ratio:1.586/1]">
        <div className="flex h-full flex-col justify-between p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="" className="h-9 w-9 rounded-full bg-white object-contain p-0.5" />
            <div className="leading-tight">
              <p className="text-[13px] font-extrabold tracking-tight">KKKT {t('Usharika wa Manzese', 'Manzese Parish')}</p>
              <p className="text-[9.5px] uppercase tracking-[0.16em] text-gold-300">{t('Kadi ya Mshirika', 'Membership Card')}</p>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <div className="h-[72px] w-[60px] shrink-0 overflow-hidden rounded-lg bg-white/10 sm:h-20 sm:w-16">
              {photoOk ? (
                <img src={apiUrl('/me/photo')} alt="" onError={() => setPhotoOk(false)} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-gold-300"><Icon name="user" className="h-7 w-7" /></span>
              )}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[15px] font-extrabold sm:text-base">{profile.fullName}</p>
              <p className="mt-1 font-mono text-[11px] text-gold-200">{profile.membershipNumber || profile.reference}</p>
              {profile.memberSince && <p className="mt-0.5 text-[10px] text-white/60">{t('Tangu', 'Since')} {profile.memberSince.slice(0, 4)}</p>}
            </div>
            {qr && <img src={qr} alt={t('Msimbo wa QR wa kuthibitisha', 'Verification QR code')} className="h-[72px] w-[72px] shrink-0 rounded-md bg-white p-1 sm:h-20 sm:w-20" />}
          </div>
        </div>
      </div>
      <div className="no-print mt-4 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={() => window.print()} className="btn-primary !py-2.5">
          <Icon name="print" className="h-4 w-4" /> {t('Chapisha kadi', 'Print card')}
        </button>
      </div>
      <p className="no-print mt-3 text-center text-[12px] text-soft">
        {t('Kadi ikipotea, mjulishe ofisi ya kanisa ili QR ya zamani ibatilishwe.', 'If your card is lost, tell the church office so the old QR can be revoked.')}
      </p>
    </div>
  )
}

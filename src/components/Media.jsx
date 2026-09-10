import Icon from './Icon.jsx'

export function ytId(url = '') {
  const m = url.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/|live\/)([\w-]{11})/)
  return m ? m[1] : ''
}

/**
 * Tambua jukwaa (YouTube, TikTok, Instagram) kutoka kwenye kiungo
 * na urudishe URL ya kupachika (embed) inayofanya kazi bila SDK.
 */
export function videoEmbed(url = '') {
  const u = (url || '').trim()
  if (!u) return null

  const yt = ytId(u)
  if (yt)
    return { platform: 'YouTube', src: `https://www.youtube.com/embed/${yt}`, portrait: false }

  let m = u.match(/tiktok\.com\/(?:[^/]+\/video\/|v\/|embed\/v2\/)(\d{6,25})/)
  if (m)
    return { platform: 'TikTok', src: `https://www.tiktok.com/embed/v2/${m[1]}`, portrait: true }

  m = u.match(/instagram\.com\/(p|reel|tv)\/([\w-]+)/)
  if (m)
    return {
      platform: 'Instagram',
      src: `https://www.instagram.com/${m[1]}/${m[2]}/embed`,
      portrait: true,
    }

  return null
}

export function platformOf(url = '') {
  if (/tiktok\.com/i.test(url)) return 'TikTok'
  if (/instagram\.com/i.test(url)) return 'Instagram'
  if (/youtu\.?be/i.test(url)) return 'YouTube'
  if (/facebook\.com|fb\.watch/i.test(url)) return 'Facebook'
  if (/soundcloud\.com/i.test(url)) return 'SoundCloud'
  if (/spotify\.com/i.test(url)) return 'Spotify'
  if (/drive\.google|docs\.google/i.test(url)) return 'Google Drive'
  if (/mixlr\.com/i.test(url)) return 'Mixlr'
  return 'kiungo'
}

/** Kitufe cha kufungua kiungo cha nje (jukwaa lisiloweza kupachikwa). */
export function LinkOut({ url, label }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 border border-ink/15 bg-parchment px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink/70 transition-colors hover:border-ink hover:text-ink"
    >
      <Icon name="play" className="h-4 w-4 text-gold-600" />
      {label || `Fungua kwenye ${platformOf(url)}`}
      <Icon name="arrow" className="ml-auto h-4 w-4" />
    </a>
  )
}

/**
 * Onyesho la media kutoka kiungo: hupachika YouTube/TikTok/Instagram,
 * hucheza faili ya sauti/video moja kwa moja, au hutoa kitufe cha kufungua.
 */
export function Embed({ link = '', mediaUrl = '', type = 'video', title = '', placeholder }) {
  const embed = videoEmbed(link)
  if (embed)
    return (
      <div
        className={`overflow-hidden border border-ink/10 ${
          embed.portrait ? 'mx-auto aspect-[9/16] max-w-[320px]' : 'aspect-video'
        }`}
      >
        <iframe
          className="h-full w-full"
          src={embed.src}
          title={`${title} — ${embed.platform}`}
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    )

  if (mediaUrl && type === 'audio')
    return <audio src={mediaUrl} controls className="w-full" />
  if (mediaUrl)
    return <video src={mediaUrl} controls className="w-full border border-ink/10" />

  if (link) return <LinkOut url={link} />

  if (placeholder)
    return (
      <div className="flex items-center gap-3 border border-ink/12 bg-parchment px-4 py-3 text-xs uppercase tracking-wide text-ink/50">
        <Icon name="play" className="h-4 w-4 text-gold-600" />
        {placeholder}
      </div>
    )
  return null
}

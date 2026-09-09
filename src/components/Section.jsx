export function Section({ children, className = '', tint = 'cream', id }) {
  const bg = {
    cream: 'bg-cream',
    white: 'bg-white',
    parchment: 'bg-parchment',
    navy: 'bg-navy-950 text-cream',
  }[tint]
  return (
    <section id={id} className={`py-14 sm:py-20 md:py-28 ${bg} ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  )
}

export function SectionTitle({ eyebrow, title, intro, center = false, invert = false }) {
  return (
    <div className={`${center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} mb-10 sm:mb-14`}>
      {eyebrow && (
        <p
          className={`mb-4 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] ${
            center ? 'justify-center' : ''
          } ${invert ? 'text-gold-300' : 'text-gold-600'}`}
        >
          <span className={invert ? 'text-gold-300' : 'text-gold-500'}>✦</span>
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-2xl font-semibold uppercase tracking-tight md:text-[2rem] md:leading-[1.15] ${
          invert ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-5 text-base leading-relaxed ${
            invert ? 'text-cream/70' : 'text-ink/65'
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  )
}

/** Thin divider with a centered brass mark — echoes the reference site's section breaks */
export function Rule({ mark = '✦', className = '' }) {
  return (
    <div className={`rule ${className}`}>
      <span className="text-xs">{mark}</span>
    </div>
  )
}

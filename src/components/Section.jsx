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
          className={`mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] ${
            center ? 'justify-center' : ''
          } ${invert ? 'text-gold-300' : 'text-gold-700'}`}
        >
          <span className={`h-[2px] w-7 rounded-full ${invert ? 'bg-gold-300' : 'bg-gold-500'}`} />
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.025em] md:text-[2.4rem] md:leading-[1.1] ${
          invert ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            invert ? 'text-white/70' : 'text-soft'
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

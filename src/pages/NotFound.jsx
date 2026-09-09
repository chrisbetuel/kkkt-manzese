import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-navy-950 text-cream">
      <div className="container-x text-center">
        <p className="font-display text-7xl font-bold text-gold-400">404</p>
        <h1 className="mt-4 text-2xl font-bold text-white">Ukurasa haukupatikana</h1>
        <p className="mx-auto mt-3 max-w-md text-navy-300">
          Samahani, ukurasa unaoutafuta haupo au umehamishwa.
        </p>
        <Link to="/" className="btn-primary mt-8">
          Rudi Nyumbani
        </Link>
      </div>
    </section>
  )
}

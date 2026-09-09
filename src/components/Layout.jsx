import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function Layout() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  // On the landing page the whole thing fits one screen — no page scroll.
  useEffect(() => {
    const root = document.documentElement
    if (isLanding) {
      root.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    }
    return () => {
      root.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [isLanding])

  return (
    <div
      className={`flex flex-col overflow-x-clip ${
        isLanding ? 'h-[100svh] overflow-hidden' : 'min-h-screen'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-cream"
      >
        Rukia kwenye maudhui
      </a>
      <Navbar />
      <main id="main" className={isLanding ? 'min-h-0 flex-1' : 'flex-1'}>
        <Outlet />
      </main>
      {!isLanding && <Footer />}
    </div>
  )
}

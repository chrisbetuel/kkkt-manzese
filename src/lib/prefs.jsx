import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiFetch } from './api.js'

/* ------------------------------------------------------------------
 * Mapendeleo ya mtazamaji (lugha, mandhari) — localStorage kwa urahisi tu.
 * Akaunti ya mshirika — session ya kuki (httpOnly) kupitia Sanctum, si localStorage.
 * ------------------------------------------------------------------ */

const store = {
  get(key) {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key, v) {
    try {
      localStorage.setItem(key, v)
    } catch {
      /* hali ya faragha / hifadhi imezuiwa */
    }
  },
}

// ---------------- lugha ----------------
const LangContext = createContext({ lang: 'sw', setLang: () => {}, t: (sw) => sw })

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => (store.get('kkkt.lang') === 'en' ? 'en' : 'sw'))
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  const setLang = useCallback((l) => {
    setLangState(l)
    store.set('kkkt.lang', l)
  }, [])
  // Kiswahili ni lugha ya msingi; maneno ya Kiingereza hutolewa pale yalipoandikwa
  const t = useCallback((sw, en) => (lang === 'en' && en ? en : sw), [lang])
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)

// ---------------- mandhari (mwanga / giza) ----------------
const ThemeContext = createContext({ theme: 'system', setTheme: () => {}, dark: false })

const systemDark = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => store.get('kkkt.theme') || 'system')
  const [sysDark, setSysDark] = useState(systemDark)

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const on = (e) => setSysDark(e.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])

  const dark = theme === 'dark' || (theme === 'system' && sysDark)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b1526' : '#0e2344')
  }, [dark])

  const setTheme = useCallback((t) => {
    setThemeState(t)
    store.set('kkkt.theme', t)
  }, [])

  return <ThemeContext.Provider value={{ theme, setTheme, dark }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)

// ---------------- akaunti ya mshirika ----------------
const AuthContext = createContext({ user: null, ready: false })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const d = await apiFetch('/auth/session')
      setUser(d?.user || null)
    } catch {
      setUser(null)
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(async (identifier, password, remember) => {
    const d = await apiFetch('/auth/login', { method: 'POST', body: { identifier, password, remember } })
    setUser(d.user)
    return d.user
  }, [])

  const activate = useCallback(async (payload) => {
    const d = await apiFetch('/auth/activate', { method: 'POST', body: payload })
    setUser(d.user)
    return d.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' })
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, activate, refresh }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

// ---------------- kichwa cha ukurasa ----------------
/** Huweka <title> na maelezo wakati wa kuhama kurasa ndani ya SPA (server huweka ya mwanzo). */
export function useMeta(title, description) {
  useEffect(() => {
    if (!title) return
    document.title = title.includes('KKKT Manzese') ? title : `${title} | KKKT Manzese`
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}

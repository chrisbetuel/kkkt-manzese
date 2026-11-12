import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || ''
export const apiUrl = (path) => `${API}/api${path}`
export const backendUrl = (path) => `${API}${path}`

function readCookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : null
}

let csrfReady = null
/** Kuki ya CSRF ya Sanctum — inahitajika kabla ya POST/PATCH yoyote kutoka kwenye tovuti. */
async function ensureCsrf() {
  if (readCookie('XSRF-TOKEN')) return
  csrfReady ??= fetch(backendUrl('/sanctum/csrf-cookie'), { credentials: 'include' }).finally(() => {
    csrfReady = null
  })
  await csrfReady
}

/**
 * Ombi kwa API. Hutupa Error yenye `status` na `errors` (validation ya Laravel) ikishindikana.
 * `body` inaweza kuwa object (JSON) au FormData (faili).
 */
export async function apiFetch(path, { method = 'GET', body, headers = {}, ...rest } = {}) {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData
  const h = { Accept: 'application/json', ...headers }
  if (method !== 'GET') {
    await ensureCsrf()
    const token = readCookie('XSRF-TOKEN')
    if (token) h['X-XSRF-TOKEN'] = token
  }
  if (body && !isForm) h['Content-Type'] = 'application/json'

  const res = await fetch(apiUrl(path), {
    method,
    headers: h,
    credentials: 'include',
    cache: 'no-store',
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    ...rest,
  })
  const data = res.status === 204 ? null : await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error((data && data.message) || `HTTP ${res.status}`)
    err.status = res.status
    err.errors = (data && data.errors) || {}
    throw err
  }
  return data
}

/** Kupata data kwa njia rahisi: { data, loading, error, reload }. */
export function useApi(path, { enabled = true } = {}) {
  const [state, setState] = useState({ data: null, loading: !!(enabled && path), error: null })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!enabled || !path) {
      setState({ data: null, loading: false, error: null })
      return
    }
    let alive = true
    setState((s) => ({ ...s, loading: true, error: null }))
    apiFetch(path)
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }))
    return () => {
      alive = false
    }
  }, [path, enabled, tick])

  return { ...state, reload: () => setTick((t) => t + 1) }
}

/** Ujumbe wa kwanza wa kosa la validation (au ujumbe wa jumla). */
export function errorText(err, fallback = 'Imeshindikana. Jaribu tena.') {
  if (!err) return ''
  const first = Object.values(err.errors || {})[0]
  if (Array.isArray(first) && first[0]) return first[0]
  if (err.status === 429) return 'Majaribio mengi mno. Subiri dakika chache kisha ujaribu tena.'
  return err.message && !err.message.startsWith('HTTP') ? err.message : fallback
}

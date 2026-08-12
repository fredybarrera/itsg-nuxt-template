export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'planos-theme'

/**
 * Modo claro/oscuro: alterna la clase `dark` en <html>, que activa los
 * tokens oscuros de main.css y las utilidades dark:*. La preferencia se
 * persiste en localStorage; sin preferencia guardada se usa la del sistema.
 */
export function useTheme() {
  const theme = useState<Theme>('theme', () => 'light')

  function aplicar(t: Theme) {
    document.documentElement.classList.toggle('dark', t === 'dark')
  }

  function setTheme(t: Theme) {
    theme.value = t
    localStorage.setItem(STORAGE_KEY, t)
    aplicar(t)
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  /** Llamado una vez al arrancar por plugins/theme.client.ts. */
  function initTheme() {
    const guardada = localStorage.getItem(STORAGE_KEY) as Theme | null
    const inicial: Theme =
      guardada ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    theme.value = inicial
    aplicar(inicial)
  }

  return { theme, setTheme, toggleTheme, initTheme }
}

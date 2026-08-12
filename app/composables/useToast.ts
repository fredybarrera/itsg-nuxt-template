export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

let _nextId = 1

export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])

  function showToast(message: string, type: ToastType = 'success') {
    const id = _nextId++
    toasts.value = [...toasts.value, { id, message, type }]
    setTimeout(() => dismiss(id), 4000)
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, showToast, dismiss }
}

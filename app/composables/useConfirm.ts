export interface ConfirmOptions {
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'danger' | 'primary'
}

interface ConfirmState extends ConfirmOptions {
  open: boolean
  resolve: ((value: boolean) => void) | null
}

function estadoInicial(): ConfirmState {
  return {
    open: false,
    message: '',
    title: undefined,
    confirmLabel: undefined,
    cancelLabel: undefined,
    tone: 'primary',
    resolve: null,
  }
}

export function useConfirm() {
  const state = useState<ConfirmState>('confirmDialog', estadoInicial)

  function confirmar(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      state.value = { ...options, open: true, resolve }
    })
  }

  function responder(value: boolean) {
    state.value.resolve?.(value)
    state.value = estadoInicial()
  }

  return { state, confirmar, responder }
}

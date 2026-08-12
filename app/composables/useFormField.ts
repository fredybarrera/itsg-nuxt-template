import type { ComputedRef, InjectionKey } from 'vue'

export interface FormFieldContext {
  /** id generado por AppFormField; conecta el <label> con el control interno. */
  id: string
  error: ComputedRef<string | undefined>
}

export const formFieldKey: InjectionKey<FormFieldContext> = Symbol('formField')

/**
 * Contexto opcional provisto por AppFormField. Los controles (AppInput,
 * AppTextarea, AppSelect) lo consumen para heredar `id` y estado de error
 * sin props extra; fuera de un AppFormField devuelve null y no pasa nada.
 */
export function useFormField(): FormFieldContext | null {
  return inject(formFieldKey, null)
}

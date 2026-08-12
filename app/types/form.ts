export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export type ComboboxValue = string | number
/** Tipo del v-model de AppCombobox: valor único (simple) o arreglo (multiple). */
export type ComboboxModel = ComboboxValue | ComboboxValue[] | null

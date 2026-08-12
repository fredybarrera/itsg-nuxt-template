export interface DataTableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
}

export interface FilterOption {
  label: string
  value: string
}

export interface FilterDef {
  /** Matches a field on each row. */
  key: string
  /** Used as the chip prefix, e.g. "Línea: MDF". */
  label: string
  placeholder: string
  options: FilterOption[]
}

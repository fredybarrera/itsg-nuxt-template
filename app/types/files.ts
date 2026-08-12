export interface FileItem {
  name: string
  /** Bytes; se muestra con formatBytes. */
  size?: number
  /** 0–100: muestra barra de progreso mientras sea < 100. */
  progress?: number
  /** Mensaje de error; pinta la fila en tono danger. */
  error?: string
  /** Si existe, el nombre es un enlace de descarga/vista. */
  url?: string
}

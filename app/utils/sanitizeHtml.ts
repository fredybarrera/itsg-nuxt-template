const TAGS_PERMITIDOS = new Set([
  'P',
  'BR',
  'B',
  'STRONG',
  'I',
  'EM',
  'U',
  'UL',
  'OL',
  'LI',
  'A',
  'DIV',
  'SPAN',
  'BLOCKQUOTE',
])
const ATRIBUTOS_PERMITIDOS: Record<string, string[]> = { A: ['href'] }
const ELIMINAR_COMPLETO = new Set([
  'SCRIPT',
  'STYLE',
  'IFRAME',
  'OBJECT',
  'EMBED',
  'SVG',
  'FORM',
  'INPUT',
  'BUTTON',
  'LINK',
  'META',
])

/**
 * Sanitización client-side del HTML del editor WYSIWYG (contenteditable):
 * limpia lo pegado desde el portapapeles antes de insertarlo. No es la
 * barrera de seguridad principal — el backend sanitiza de nuevo al
 * persistir (DescripcionSanitizer.cs), que es la fuente de verdad contra
 * XSS almacenado independientemente de lo que haga este cliente.
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html
  const doc = new DOMParser().parseFromString(html, 'text/html')
  limpiarNodo(doc.body)
  return doc.body.innerHTML
}

function limpiarNodo(nodo: Element) {
  const hijos = Array.from(nodo.childNodes)
  for (const hijo of hijos) {
    if (hijo.nodeType === Node.COMMENT_NODE) {
      hijo.remove()
      continue
    }
    if (hijo.nodeType !== Node.ELEMENT_NODE) continue

    const el = hijo as Element
    if (ELIMINAR_COMPLETO.has(el.tagName)) {
      el.remove()
      continue
    }

    limpiarNodo(el)

    if (!TAGS_PERMITIDOS.has(el.tagName)) {
      const padre = el.parentNode
      if (padre) {
        while (el.firstChild) padre.insertBefore(el.firstChild, el)
        padre.removeChild(el)
      }
      continue
    }

    const permitidos = ATRIBUTOS_PERMITIDOS[el.tagName] ?? []
    for (const attr of Array.from(el.attributes)) {
      if (!permitidos.includes(attr.name.toLowerCase())) el.removeAttribute(attr.name)
    }

    if (el.tagName === 'A') {
      const href = el.getAttribute('href') ?? ''
      if (/^\s*javascript:/i.test(href)) {
        el.removeAttribute('href')
      } else {
        el.setAttribute('target', '_blank')
        el.setAttribute('rel', 'noopener noreferrer')
      }
    }
  }
}

export function escapeHtml(texto: string): string {
  const div = document.createElement('div')
  div.textContent = texto
  return div.innerHTML
}

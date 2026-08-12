export interface SidebarLink {
  label: string
  icon?: string
  /** Ruta de navegación; los nodos con `children` la ignoran (actúan como desplegable). */
  to?: string
  /** Subniveles anidados (profundidad ilimitada; colapsados en modo rail). */
  children?: SidebarLink[]
}

export interface SidenavLinkNode {
  type: 'link'
  label: string
  icon?: string
  target: string
}

export interface SidenavParentNode {
  type: 'parent'
  label: string
  icon?: string
  children: SidenavNode[]
}

export type SidenavNode = SidenavLinkNode | SidenavParentNode

export interface SidenavGroup {
  label: string
  items: SidenavNode[]
}

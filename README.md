# ITSG Nuxt Template — Design System

Plantilla base, **sin lógica de negocio**: tokens de diseño, layout corporativo
(navbar + sidebar) y la librería de componentes del design system de IT Solutions Group,
lista para iniciar un proyecto nuevo.

> Fork del [Arauco Nuxt Template](https://github.com/fredybarrera/arauco-nuxt-template) usado
> como base estructural; la identidad visual (colores, mark, nombre) fue reemplazada por la de
> ITSG. Ver "Personalización rápida" y "Identidad visual" más abajo antes de usarla en producción.

## Stack

- **Nuxt 4** (SPA, `ssr: false`) + **TypeScript estricto**
- **Tailwind CSS v4** (tokens vía `@theme` en CSS, sin `tailwind.config`)
- **ESLint** (`@nuxt/eslint`) + **Prettier** (formato; `eslint-config-prettier` evita conflictos)
- **Modo oscuro** con clase `.dark` en `<html>` (`useTheme` + persistencia en localStorage)
- Fuentes auto-hospedadas (sin CDN): **Roboto** (UI y títulos) + **IBM Plex Mono**
  (rol de anotación técnica: eyebrows, labels, datos, ejes de gráficos)
- Sin Pinia (usar `useState()`) y sin Axios (usar `$fetch` / `useFetch`)

## Uso

Este repo es a la vez una **Nuxt Layer** (la capa reutilizable, en `app/` + `nuxt.config.ts`)
y una **app de demostración** (`.playground/`, que extiende la capa). Los scripts corren sobre
el playground:

```bash
npm install
npm run dev           # nuxt dev .playground → http://localhost:5173
npm run build         # nuxt build .playground
npm run typecheck     # vue-tsc (verifica capa + playground)
npm run lint          # eslint . (lint:fix para autocorregir)
npm run format        # prettier --write . (format:check en CI)
```

Las páginas `/`, `/componentes` y `/perfil` son demos y viven en `.playground/` justamente
para que **no** se hereden al usar la capa en otro proyecto. Para reutilizar el DS, ver
[Usar como Nuxt Layer](#usar-como-nuxt-layer).

### Documentación

| Archivo                                            | Responde                                         |
| -------------------------------------------------- | ------------------------------------------------ |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)     | Cómo está construida la capa y por qué así       |
| [`docs/BUSINESS_RULES.md`](docs/BUSINESS_RULES.md) | Las reglas del design system (`RD-nnn`)          |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md)           | Qué cambió en cada versión, y qué duele al subir |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)               | Ramas, commits y publicación de versiones        |

## Estructura

```
app/                        # ← LA CAPA (lo que heredan los consumidores)
├── assets/
│   ├── css/main.css        # Tokens @theme + clases .input, .frame, .cartela, .cartela-left, .tooltip, .skeleton
│   └── fonts/              # Roboto + IBM Plex Mono (woff2 auto-hospedadas)
├── components/             # Design system ITSG (auto-importados entre capas)
├── composables/            # useToast, useConfirm, useScrollSpy, useFormField, useFocusTrap, useTheme
├── plugins/theme.client.ts # Aplica el tema guardado (o el del sistema) al arrancar
├── app.vue                 # Fallback: <NuxtLayout><NuxtPage/></NuxtLayout>
├── error.vue               # Página de error 404/500 con estilo del DS
├── layouts/default.vue     # Shell: navbar + sidebar + ToastStack + ConfirmDialog
├── types/                  # sidenav.ts, table.ts, form.ts, tree.ts, calendar.ts, files.ts
└── utils/                  # sanitizeHtml.ts, format.ts (formatDate, formatNumber… es-CL)
nuxt.config.ts              # Config de la CAPA (css absoluto, alias #itsg, ssr:false, tailwind)
.playground/                # ← APP DEMO (no se hereda)
├── nuxt.config.ts          # extends: ['..'] + módulos solo-dev
└── app/pages/              # index.vue, componentes.vue, perfil.vue
```

> **Alias `#itsg`**: dentro de la capa, los tipos/composables se importan con
> `#itsg/...` (p. ej. `import type { SelectOption } from '#itsg/types/form'`), **no**
> con `~/...`. En una Nuxt Layer, `~/` y `@/` se resuelven contra el proyecto _consumidor_,
> así que romperían. El alias `#itsg` (definido en `nuxt.config.ts` con ruta absoluta)
> apunta siempre a `app/` de la capa, funcione donde funcione.

## Personalización rápida

1. **Identidad**: título, subtítulo y usuario del navbar se pasan como props en
   `app/layouts/default.vue` (`AppNavbar` acepta `title`, `subtitle`, `tagline`, `user-name`
   y slots `#actions` / `#user-menu`).
2. **Navegación**: el arreglo `links` en el layout alimenta `AppSidebar`
   (`links`, `linksSecundarios`, `tituloSecundario`). Cada `SidebarLink` acepta
   `children` anidados sin límite de profundidad: los nodos con hijos se despliegan
   (se abren solos cuando la ruta activa está dentro) y las hojas navegan con `to`.
   El menú de usuario del navbar incluye "Mis datos", que abre `/perfil` en una
   ventana nueva (página demo con datos ficticios, lista para conectar a `useAuth`).
3. **Colores/tokens**: bloque `@theme` en `app/assets/css/main.css`. Los componentes usan
   solo utilidades derivadas de tokens (`bg-calipso`, `text-ink`, `border-line`…), así que
   cambiar la paleta ahí re-tematiza toda la app.
4. **Modo oscuro**: los tokens neutrales se re-declaran bajo `.dark` en `main.css`; ajusta
   ahí la paleta oscura. El toggle vive en el navbar (`#actions` del layout) y usa
   `useTheme()` (`theme`, `toggleTheme`, `setTheme`). También existen utilidades `dark:*`
   para casos puntuales.
5. **Auth**: esta plantilla no incluye MSAL/Azure AD. Si tu proyecto lo necesita, agrega
   `app/plugins/msal.client.ts`, `app/plugins/api.client.ts`, `app/middleware/auth.global.ts`,
   `app/composables/useAuth.ts` y la sección `runtimeConfig` de `nuxt.config.ts` (patrón estándar
   de Nuxt + MSAL, no específico de esta capa).
6. **Logo**: el mark del navbar (`app/components/AppNavbar.vue`, bloque `<svg>` junto al
   comentario "Mark placeholder") es un ícono genérico de relleno. Reemplázalo por el logo real
   de ITSG (SVG inline o `<img>`).

## Identidad visual

El sistema conserva el concepto de **plano técnico** heredado de la plantilla base. Tres piezas
cargan esa personalidad; consérvalas, ajústalas o quítalas según la identidad de ITSG al crear
componentes nuevos:

- **Cartela** (firma de forma): esquina cortada (radio asimétrico) + escuadras en las
  esquinas opuestas. Clase `.cartela` en `main.css`, **solo en superficies contenedoras**
  (Hero, Card/`.frame`, Modal) — no en controles atómicos (KPI, inputs, badges), que se
  quedan con radio simple. Requiere que la superficie **no** tenga `overflow-hidden`
  (recorta las escuadras). Para paneles anclados a un borde (Drawer) usa `.cartela-left`,
  que marca solo el canto interior.
- **Rol mono**: eyebrows, labels, datos y ejes usan `font-mono` (→ IBM Plex Mono). No lo
  uses para texto corrido; sí para todo lo que sea "anotación" o cifra.
- **Mark del navbar**: SVG inline (placeholder) en `AppNavbar.vue`. Cámbialo ahí por el logo
  definitivo de ITSG.

La barra superior usa tokens de shell (`--color-shell`, `--color-shell-ink`,
`--color-shell-ink-strong`), no colores hardcodeados.

## APIs reales de los composables

```ts
// Toast
const { showToast } = useToast()
showToast('Guardado', 'success') // 'success' | 'error' | 'warning' | 'info'

// Confirmación
const { confirmar } = useConfirm()
const ok = await confirmar({ title: 'Eliminar', message: '¿Seguro?', tone: 'danger' })
```

## Formularios

`AppFormField` provee `id` y estado de error a los controles hijos (vía `useFormField`),
así el label queda conectado y el borde de error se activa solo:

```vue
<AppFormField label="Correo" :error="errorCorreo" required hint="Se usará para avisos.">
  <AppInput v-model="correo" type="email" placeholder="nombre@itsolutionsgroup.com" />
</AppFormField>

<AppFormField label="Área">
  <AppSelect v-model="area" :options="[{ label: 'Desarrollo', value: 'D' }]" placeholder="Selecciona…" />
</AppFormField>
```

Los controles también funcionan sueltos (sin wrapper) y aceptan `invalid` para forzar
el estado de error manualmente.

## Catálogo de componentes

60 componentes, auto-importados (sin `import`). Los `App*` son la API pública del DS; el resto
son piezas auxiliares o de composición.

### Shell y layout

| Componente                       | Notas                                                                                                                                                 |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppNavbar`                      | Barra superior oscura; props `title`, `subtitle`, `tagline`, `user-name`, slots `#actions` / `#user-menu`. Mark placeholder (SVG inline)              |
| `AppSidebar` / `AppSidebarItem`  | Navegación lateral; `links`, `linksSecundarios`, `tituloSecundario`. `children` anidados sin límite; se abren solos si la ruta activa está dentro     |
| `AppHero`                        | Cabecera con cartela; `size` sm/md/lg, `title`/`subtitle`/`eyebrow`, prop `as` (nivel de encabezado), slot `#actions` y default (p. ej. fila de KPIs) |
| `NotificationCenter`             | Campanita con dropdown de notificaciones; props `variant` (`bell`/`button`), `align`. Usada en `#actions` de `AppNavbar` en `layouts/default.vue`     |
| `SidenavItem` / `SkeletonLoader` | Piezas auxiliares del shell                                                                                                                           |

### Formularios e inputs

| Componente                            | Notas                                                                                              |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `AppFormField`                        | Envuelve cualquier control: label + hint + error; provee `id` y estado de error vía `useFormField` |
| `AppInput`                            | `icon`, `clearable`                                                                                |
| `AppTextarea`                         | `maxlength` + `show-count`                                                                         |
| `AppNumberInput`                      | `number \| null`; formato es-CL al desenfocar; `decimals`/`min`/`max`/`suffix`                     |
| `AppSelect`                           | `options: SelectOption[]`                                                                          |
| `AppCombobox`                         | Select con búsqueda; `multiple` acumula chips, `clearable`; `v-model` es `ComboboxModel`           |
| `AppCheck` / `AppRadio` / `AppSwitch` | Radio: uno por opción con `value`                                                                  |
| `AppChipInput`                        | Entrada de tags/chips                                                                              |
| `AppColorPicker`                      | Selector de color                                                                                  |
| `AppDatePicker`                       | `Date \| null`, popover por defecto; `min`/`max`/`inline`                                          |
| `AppRating`                           | Valoración por estrellas                                                                           |
| `AppDropzone`                         | Zona de arrastrar y soltar (combina con `AppFileList`)                                             |
| `AppRichEditor`                       | Editor enriquecido (usa `sanitizeHtml`)                                                            |

> Los controles aceptan `invalid` para forzar el estado de error sin `AppFormField`.

### Overlays y feedback

| Componente                         | Notas                                                                                                                              |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `AppModal`                         | `size` sm/md/lg, `closable`, slot `#footer`; lleva cartela                                                                         |
| `AppDrawer`                        | Panel lateral; cartela de borde (`.cartela-left`)                                                                                  |
| `AppPopover`                       | Primitivo con detección de bordes (flip/alineación auto); slots `#trigger="{ open }"` y default `="{ close }"`, prop `panel-class` |
| `AppDropdown` / `DropdownItem`     | Menú desplegable                                                                                                                   |
| `AppTooltip`                       | Tooltip (o clase `.tooltip`)                                                                                                       |
| `ConfirmDialog`                    | Confirmación (ver `useConfirm`)                                                                                                    |
| `AppAlert`                         | Mensaje en línea                                                                                                                   |
| `ToastStack` / `ToastNotification` | Toasts (ver `useToast`)                                                                                                            |
| `AppEmptyState`                    | Estado vacío                                                                                                                       |

> `AppModal`, `AppDrawer` y `ConfirmDialog` comparten `useFocusTrap`: focus trap, bloqueo de
> scroll, Escape y retorno de foco.

### Datos y organización

| Componente                       | Notas                                                                                                                                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppCard`                        | Tarjeta contenedora (cartela)                                                                                                                                                                                             |
| `AppButton`                      | `variant`, `size`, `iconOnly`, `loading`; `as` acepta una etiqueta nativa o un componente global — `as="NuxtLink" to="…"` para navegar. Un enlace con `disabled`/`loading` se renderiza como `<span>` inerte, sin destino |
| `AppBadge`                       | `tone` + slot                                                                                                                                                                                                             |
| `AppAvatar` / `AppAvatarGroup`   | `initials`; grupo apilado                                                                                                                                                                                                 |
| `DataTable` / `FilteredTable`    | Tabla; la filtrada añade búsqueda, filtros y export (ver `types/table.ts`)                                                                                                                                                |
| `AppPagination`                  | Standalone: `v-model` página + `total-pages`                                                                                                                                                                              |
| `AppTree` / `AppTreeItem`        | `nodes: TreeNode[]`, `v-model` clave, `v-model:expanded`, `default-expand-all`, `@select`, slot `#label="{ node, depth }"`                                                                                                |
| `AppTransferList`                | Asignación entre dos listas; `v-model` valores asignados, `options: SelectOption[]`, `searchable`, doble clic mueve, "mover todos" respeta filtro                                                                         |
| `AppTimeline`                    | Línea de tiempo                                                                                                                                                                                                           |
| `AppCalendar`                    | Vista mensual; `events: CalendarEvent[]` con `tone`, `v-model:month`, botón Hoy, "+n más" tras `max-per-day`, `@select-day` / `@select-event`                                                                             |
| `AppFileList`                    | `files: FileItem[]` con tamaño, progreso, error y enlace; `@remove`                                                                                                                                                       |
| `AppAccordion` / `AppTabs`       | Contenido colapsable / pestañas                                                                                                                                                                                           |
| `AppWizard`                      | Asistente por pasos; slots `#panel-0…n`                                                                                                                                                                                   |
| `SegmentedControl` / `StatusBar` | Toggle de opciones / barra de estado                                                                                                                                                                                      |

### Indicadores y visualización

| Componente                    | Notas                                                                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `KpiTile`                     | `size` sm/md/lg; `trend` up/down es la flecha, `sentiment` positive/negative/neutral el color (por defecto se deriva de `trend`) |
| `BarChart` / `TrendSparkline` | Gráfico de barras / sparkline                                                                                                    |
| `AppProgress`                 | `value` 0–100 o indeterminado, `tone`, `show-value`                                                                              |
| `AppSpinner`                  | Hereda el color                                                                                                                  |
| `AppSkeleton`                 | `variant`, `width`                                                                                                               |
| `AppBreadcrumbs`              | `items: { label, to? }[]`                                                                                                        |
| `AppIcon` / `IconSprite`      | Sistema de iconos (sprite SVG)                                                                                                   |

## Usar como Nuxt Layer

Este repo está preparado como **capa base**: un proyecto consumidor la extiende y hereda
automáticamente componentes, composables, utils, plugins, layout, assets/fuentes y los tokens
del DS. Un único lugar donde mantener el design system; los proyectos hijos solo consumen y
sobreescriben lo que necesiten.

### 1. En el proyecto consumidor

```ts
// nuxt.config.ts del proyecto hijo
export default defineNuxtConfig({
  extends: ['github:fredybarrera/itsg-nuxt-template'],
  // o una versión fijada:  'github:fredybarrera/itsg-nuxt-template#v1.0.0'
  // o una ruta local:       '../itsg-nuxt-template'
})
```

### 2. Instalar las dependencias que la capa necesita en runtime

Las capas por git **no** instalan sus propias dependencias en el consumidor. Como el
`nuxt.config.ts` de la capa importa el plugin de Tailwind, el proyecto hijo debe tenerlas:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

(`nuxt` y `vue` ya los tiene cualquier proyecto Nuxt.) Nada más: el CSS del DS, las fuentes,
el alias `#itsg` y los ~60 componentes `App*` quedan disponibles y auto-importados.

### 3. Personalizar

- **Navegación / identidad del shell**: crea tu propio `app/layouts/default.vue` (el del
  hijo gana sobre el de la capa) o pásale otros props/links a `AppNavbar` / `AppSidebar`.
- **Paleta / tokens**: define tu propio `app/assets/css/main.css` con un bloque `@theme` que
  redefina las variables, o crea utilidades encima. Los componentes solo usan tokens.
- **Rutas**: tus `pages/` son tuyas; la capa ya no aporta páginas.

### Notas y limitaciones

- La capa fija `ssr: false` (el DS es SPA: usa `localStorage` y un plugin `.client`). Si tu
  proyecto necesita SSR, tenlo en cuenta al sobreescribir la config.
- Dentro de código de la capa nunca uses `~/` para referenciar sus propios archivos: usa el
  alias `#itsg` (ver nota en [Estructura](#estructura)).
- `plugins/enlaces.ts` registra `NuxtLink` como componente global. **No lo quites**: los
  componentes de Nuxt se resuelven al compilar, así que sin ese registro un
  `<component :is="'NuxtLink'">` —lo que hace `AppButton` con `as="NuxtLink"`— deja en el DOM un
  `<nuxtlink>` sin `href` ni navegación. Vue no avisa (trata la cadena como etiqueta nativa) y no
  falla ni en build ni en typecheck: el botón se ve bien y no hace nada. Vale para cualquier
  componente que quieras nombrar por cadena.
- Distribución alternativa: publicar la capa como paquete privado (npm / Azure Artifacts) y
  extender con `extends: ['@itsg/design-system']`. Aporta semver real a costa de un paso de
  build/publish; recomendable solo cuando varios equipos la consuman.

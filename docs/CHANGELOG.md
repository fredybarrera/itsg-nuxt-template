# Registro de cambios

Formato inspirado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/); versionado
[SemVer](https://semver.org/lang/es/) leído **desde el consumidor**, según
[`../CONTRIBUTING.md`](../CONTRIBUTING.md).

Aquí una versión no es un despliegue: es el tag que un proyecto fija en su `nuxt.config.ts`. Un
cambio en `master` no le llega a nadie hasta que se etiqueta.

> Historial heredado del fork de origen ([`fredybarrera/arauco-nuxt-template`](https://github.com/fredybarrera/arauco-nuxt-template))
> hasta `v1.0.7`. Los entries anteriores documentan cambios de código reales de esa base; a partir
> de aquí el historial es propio de ITSG.

---

## Sin etiquetar

Cambios en `master` que todavía no están en ninguna versión.

- **Rebrand a ITSG**: paleta de colores (`app/assets/css/main.css`), mark del navbar (placeholder,
  `AppNavbar.vue`), nombre del paquete/repo y referencias de documentación. Ver README §"Identidad
  visual" y §"Personalización rápida".
- Documentación: [`../CONTRIBUTING.md`](../CONTRIBUTING.md) y esta carpeta `docs/`.
- `master` pasa a estar protegida —solo entra por PR, sin push directo ni para el dueño— y GitHub
  borra la rama al mergear.
- **`AppButton`**: las variantes `primary` y `success` no llegaban a 4.5:1 de contraste con su
  texto blanco (`bg-calipso`/`bg-verde` daban 2.8:1 y 3.3:1); ahora usan `bg-calipso-deep` /
  `bg-verde-deep` (5.9:1 y 5.0:1), igual que ya hacía `danger`. El botón `iconOnly` pasa de 38×38px
  a 44×44px, el mínimo recomendado para blanco táctil.
- **`AppSidebar`**: gana modo overlay bajo `md` (antes solo alternaba 264px↔64px fijos, nunca se
  ocultaba) — nuevo prop `mobileOpen` y evento `close`; `layouts/default.vue` ya lo conecta al
  mismo toggle del navbar. `<main>` deja de tener `margin-left` fijo en mobile.
- **`AppSidebar`/`AppSidebarItem`**: dos colores fuera de la paleta (`#9d9384`, residuo pre-rebrand;
  `#ffffff` a mano) reemplazados por `text-shell-ink/60` y `text-shell-ink-strong`.

Afecta a cualquier consumidor que dependiera de los tokens de color o el mark anteriores, o que
overrideara el ancho/posición de `AppSidebar` por CSS externo.

## [v1.0.7] — 2026-08-08

### Corregido

- **`disabled` y `loading` ahora apagan también un enlace** (`AppButton`). El atributo `disabled` no
  existe para `<a>`: el navegador lo ignoraba, la variante `disabled:` de Tailwind no enganchaba y el
  enlace seguía navegando. Un `<AppButton as="NuxtLink" disabled>` se veía normal y llevaba a donde
  dijera `to`.

  El primer intento fue el patrón habitual —`pointer-events-none`, `tabindex="-1"` y
  `aria-disabled`— y se quedó corto: paraba ratón y teclado, pero un `.click()` por código navegaba
  igual, porque vue-router ejecuta su manejador antes que cualquiera que se añada desde el
  componente. Comprobado en el playground.

  La solución: apagado **deja de ser un enlace**. Se renderiza un `<span>` sin `to`, sin `href` y sin
  `onClick`, con `aria-disabled` y atenuado.

### Ojo al subir

`AppButton` con `as="NuxtLink"` y `disabled` ya **no** responde a `getByRole('link')`: ahora es un
`<span>`. Si alguna prueba lo asumía, hay que ajustarla. Es el caso de manual de RD-010 — el DOM es
parte de la API—, y por eso se avisa aquí aunque ninguna prop haya cambiado.

## [v1.0.6] — 2026-08-08

### Corregido

- **`AppButton as="NuxtLink"` volvió a renderizar un enlace real.** `AppButton` resuelve `as` con
  `<component :is="as">`, donde el nombre llega como cadena, y los componentes de Nuxt se resuelven
  al compilar, no en ejecución: Vue no encontraba `NuxtLink` y —sin avisar, porque trata una cadena
  desconocida como etiqueta nativa— dejaba en el DOM un `<nuxtlink>` sin `href`. El botón se veía
  perfecto y no hacía nada.

  Lo destapó la prueba de humo de `arauco-apps`, donde tenía **doce botones muertos**: todos los
  «Nueva iniciativa», «Nuevo proyecto», «Editar» y «Volver al listado». No fallaba en `build`, ni en
  `typecheck`, ni en `lint`, ni en consola.

  Aquí no se veía porque el propio playground solo usaba `as` con etiquetas nativas (`as="h3"`).

### Añadido

- `app/plugins/enlaces.ts`, que registra `NuxtLink` como componente global. **No quitarlo.** Sirve
  además para cualquier otro componente que se quiera nombrar por cadena.
- Demo de `as="NuxtLink"` en el playground, junto a los botones.

### Interno

- Prettier sobre `AppSkeleton` y `FilteredTable`, que habían quedado sin formatear.

## [v1.0.5] — 2026-08-07

### Añadido

- `AppSkeleton`: variantes compuestas `text`, `card`, `table` y `tree`, retrocompatibles con las
  `line` y `avatar` anteriores.

## [v1.0.4] — 2026-07-27

### Corregido

- `FilteredTable`: la prop `filters` pasa a ser opcional, con `[]` por defecto.

## [v1.0.3] — 2026-07-20

### Añadido

- `DataTable`: **modo del lado del servidor** con `manualSort` y `manualPagination`. Es lo que
  permite a un consumidor paginar y ordenar contra la base en vez de traerse todas las filas.

## [v1.0.2] — 2026-07-20

### Cambiado

- `ToastStack`: color de fondo según el tipo (`success`, `error`, `warning`, `info`).

## [v1.0.1] — 2026-07-20

### Corregido

- **Los consumidores recibían los componentes sin estilos.** Tailwind v4 descubre las clases
  escaneando archivos, y los de la capa quedan fuera del proyecto que compila; se le indican con
  `@source` en `main.css`.

## [v1.0.0] — 2026-07-19

Línea base: la plantilla convertida en **Nuxt Layer** con playground, y las referencias apuntando a
`fredybarrera/arauco-nuxt-template`.

Lo que ya traía, construido entre el 17 y el 19 de julio:

- **60 componentes** auto-importados: shell (navbar, sidebar con submenús anidados, hero),
  formularios (input, select, combobox, date picker, number input, chip input, transfer list),
  overlays accesibles (modal, drawer, popover, dropdown, confirm), datos (`DataTable`,
  `FilteredTable`, tree, calendar, file list, timeline, wizard) e indicadores (KPI, gráfico de
  barras, status bar, badge, progress).
- **7 composables**: `useToast`, `useConfirm`, `useTheme`, `useFocusTrap`, `useFormField`, `useTree`,
  `useScrollSpy`.
- **Dirección de diseño Planos DS**: cartela, rol mono y mark de tablones.
- Tailwind v4 con tokens `@theme`, modo oscuro, fuentes auto-hospedadas, ESLint y Prettier.

## Lo que este historial no cuenta

**No hay pruebas automáticas en este repositorio**, y eso explica la forma de la lista de arriba: las
dos correcciones de `AppButton` —v1.0.6 y v1.0.7— pasaron `lint`, `typecheck` y `build` en verde, y
la primera la encontró un consumidor, no la capa.

De ahí la regla de [`../CONTRIBUTING.md`](../CONTRIBUTING.md): todo componente tocado se demuestra en
el playground **con el caso que puede fallar**, no solo con el feliz.

# Reglas del design system

Este repositorio no tiene dominio de negocio: no sabe qué es una iniciativa ni un trabajador. Su
«negocio» son las reglas del propio design system — qué puede prometer un componente, qué no, y qué
rompe a quien lo consume.

El archivo conserva el nombre `BUSINESS_RULES.md` como convención con otros repos de ITSG que
sigan el mismo patrón. Las reglas van numeradas **`RD-nnn`** (regla de diseño) para poder citarlas
en un PR.

| Marca          | Significado                                                       |
| -------------- | ----------------------------------------------------------------- |
| **Obligada**   | Se incumple y algo se rompe: el consumidor, el tema o el contrato |
| **Convención** | Coherencia del sistema. Se puede discutir, no ignorar en silencio |

Documentos hermanos: [`ARCHITECTURE.md`](ARCHITECTURE.md) y [`CHANGELOG.md`](CHANGELOG.md).

## Alcance

**RD-001** — La capa es un **design system**, no un framework de aplicación. No trae autenticación,
enrutado, cliente HTTP, capa de datos ni gestor de estado, y no va a traerlos. _(Obligada)_

**RD-002** — **Ningún componente sabe de dominio.** `DataTable` recibe filas y columnas; no sabe qué
es una iniciativa. Un componente que necesite conocer el negocio del consumidor está mal colocado:
va en el consumidor. _(Obligada)_

**RD-003** — Todo lo público empieza por `App*`. El resto de componentes son piezas auxiliares o de
composición, y el consumidor no debería usarlos directamente. _(Convención)_

## Compatibilidad: qué rompe a un consumidor

**RD-010** — **El DOM es parte de la API.** Si un componente pasa a renderizar otra etiqueta, las
pruebas de los consumidores que lo buscan por rol o por selector dejan de encontrarlo, aunque
ninguna prop haya cambiado. Eso es un cambio incompatible y se avisa. _(Obligada)_

**RD-011** — Quitar una prop, o cambiar lo que significa, es `MAJOR`. Añadirla con el comportamiento
anterior intacto es `MINOR`. Un arreglo que no toca ni la API ni el DOM es `PATCH`.
_(Obligada; ver [`../CONTRIBUTING.md`](../CONTRIBUTING.md))_

**RD-012** — Los consumidores fijan un tag, así que **mientras no haya tag, el cambio no le llega a
nadie**. Publicar es etiquetar, y el mensaje del tag es donde se avisa de lo que puede doler.
_(Obligada)_

**RD-013** — Un cambio que obliga al consumidor a tocar su código se documenta en el README además
del changelog: quien sube de versión lee el README, no el historial de git. _(Convención)_

## API de los componentes

**RD-020** — `<script setup lang="ts">` y props tipadas con `defineProps<{…}>()`. _(Obligada)_

**RD-021** — Las props opcionales llevan **default explícito** en `withDefaults`. ESLint lo señala con
`vue/require-default-prop`, pero como **warning**: no rompe el lint, así que se puede colar. Hoy
quedan dos sin arreglar en `FilteredTable`. _(Obligada)_

**RD-022** — Las props obligatorias se piensan dos veces: **`vue-tsc` no exige una prop requerida en
la plantilla del consumidor**. Omitirla no rompe el typecheck y a veces no se nota. `KpiTile`
declara `trend` y `trendLabel` requeridas, y sin ellas pinta una flecha roja hacia abajo, afirmando
una caída que los datos no dicen. Si una prop puede faltar, dale un default que no mienta.
_(Obligada)_

**RD-023** — Los `v-model` se declaran con `defineModel()`. Los overlays usan `v-model:open`.
_(Convención)_

**RD-024** — Un componente que acepta el **nombre** de otro por cadena (`<component :is>`) solo
funciona si ese otro está **registrado globalmente**. `AppButton as="NuxtLink"` depende de
`plugins/enlaces.ts`. Si se acepta otro nombre, hay que registrarlo igual. _(Obligada; el porqué en
[`ARCHITECTURE.md`](ARCHITECTURE.md#componentes-la-trampa-del-tiempo-de-compilación))_

**RD-025** — La `class` que pasa el consumidor **se conserva**. Si un componente coloca sus atributos
a mano (`inheritAttrs: false`), es su responsabilidad fusionarla en lugar de pisarla.
_(Obligada)_

**RD-026** — Un control apagado tiene que estar apagado de verdad, no solo atenuado. En un `<button>`
basta el `disabled` nativo; en un enlace **no existe** ese atributo, así que hay que quitarle el
destino. Ver `AppButton`, que en ese caso renderiza un `<span>` inerte. _(Obligada)_

## Identidad visual

**RD-030** — Tres piezas cargan la personalidad de plano técnico y se respetan al crear componentes:
la **cartela** (esquina cortada + escuadras), el **rol mono** (IBM Plex Mono para eyebrows, labels,
datos y ejes) y el **mark** de tablones del navbar. _(Convención)_

**RD-031** — `.cartela` va **solo en superficies contenedoras** — Hero, Card, Modal —, no en
controles atómicos como KPI, inputs o badges, que se quedan con radio simple. _(Convención)_

**RD-032** — `.cartela` y `.frame` **se rompen con `overflow-hidden`**: recorta las escuadras. Para
paneles anclados a un borde, como el Drawer, existe `.cartela-left`. _(Obligada)_

**RD-033** — `font-mono` no se usa para texto corrido; sí para todo lo que sea anotación técnica o
cifra. _(Convención)_

## Color y tema

**RD-040** — **Solo utilidades derivadas de tokens** (`bg-calipso`, `text-ink`, `border-line`…).
Ningún color literal en un componente: es lo que permite re-tematizar cambiando el bloque `@theme`.
_(Obligada)_

**RD-041** — La barra superior usa los tokens de shell (`--color-shell`, `--color-shell-ink`,
`--color-shell-ink-strong`), no colores propios. _(Obligada)_

**RD-042** — Todo componente tiene que verse bien en **claro y en oscuro**. Los tokens neutrales se
re-declaran bajo `.dark`; las utilidades `dark:*` son para casos puntuales, no la vía normal.
_(Obligada)_

**RD-043** — Las fuentes van **auto-hospedadas**, sin CDN. _(Obligada)_

## Accesibilidad

**RD-050** — Los controles de formulario se conectan a su etiqueta por `useFormField`, que provee el
`id` y el estado de error. Un control nuevo que acepte texto lo consume. _(Obligada)_

**RD-051** — Los overlays atrapan el foco (`useFocusTrap`), se cierran con `Escape` y llevan
`role` y `aria-modal`. _(Obligada)_

**RD-052** — Un estado se anuncia además de pintarse: `aria-busy` mientras carga, `aria-disabled`
cuando el elemento no es un control nativo deshabilitable, `aria-label` en los botones que solo
tienen icono. _(Obligada)_

**RD-053** — Lo que se puede accionar con el ratón se puede accionar con el teclado. Lo que está
apagado no recibe foco. _(Obligada)_

## Idioma y formato

**RD-060** — **Español** en código, comentarios, nombres de variables y textos. _(Obligada)_

**RD-061** — Locale de datos **es-CL / CLP**. Los formateos van por `utils/format.ts`
(`formatDate`, `formatNumber`, `formatCurrency`, `formatBytes`…), no a mano en el componente.
_(Obligada)_

**RD-062** — Prettier es la única autoridad de formato: `semi: false`, `singleQuote: true`,
`printWidth: 110`. No se discute con él. _(Obligada)_

## Convenciones heredadas por el consumidor

Estas no se aplican en este repositorio, pero la capa las impone a quien la extiende y conviene
tenerlas presentes al diseñar un componente:

**RD-070** — La capa fija `ssr: false`: las aplicaciones que la extiendan son SPA. Los server routes
de Nitro **sí** funcionan y se despliegan como funciones. _(Obligada)_

**RD-071** — `IconSprite` se monta una vez por layout, o los `AppIcon` salen vacíos. _(Obligada)_

**RD-072** — `app/layouts/default.vue` del consumidor **sobreescribe** el de la capa. El de aquí es un
punto de partida con navegación de ejemplo, no algo que se deba usar tal cual. _(Convención)_

**RD-073** — Sin Pinia (`useState()`) y sin Axios (`$fetch` / `useFetch`). _(Convención)_

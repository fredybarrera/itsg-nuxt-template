# Arquitectura

Cómo está construido el **ITSG DS**: las piezas, por qué son esas y dónde están las costuras.

Documentos hermanos: [`BUSINESS_RULES.md`](BUSINESS_RULES.md) (las reglas del design system),
[`CHANGELOG.md`](CHANGELOG.md) (qué cambió en cada versión), [`../README.md`](../README.md)
(catálogo de componentes y puesta en marcha) y [`../CONTRIBUTING.md`](../CONTRIBUTING.md) (cómo se
trabaja).

## Dos artefactos en un repositorio

```
app/  +  nuxt.config.ts     →  LA CAPA. Es lo que heredan los consumidores.
.playground/                →  UNA APP DEMO que extiende la capa. No se hereda.
```

Todos los scripts (`dev`, `build`, `typecheck`) corren sobre el playground, porque una capa sola no
se puede ejecutar: necesita una aplicación que la extienda.

Las páginas `/`, `/componentes` y `/perfil` viven en `.playground/app/pages/` justamente para que
**no** lleguen a los proyectos que consumen la capa. Si estuvieran en `app/pages/`, cualquier
consumidor heredaría una ruta `/perfil` con datos ficticios.

## Cómo la consume un proyecto

```ts
// nuxt.config.ts del consumidor
export default defineNuxtConfig({
  extends: ['github:ITSolutionsGroup/itsg-nuxt-template#v1.0.7'],
})
```

Nuxt descarga el repositorio en ese tag y lo cachea en `node_modules/.c12/`. De ahí salen tres
consecuencias que hay que tener presentes:

- **El consumidor fija una versión, no una rama.** Un cambio en `master` no le llega a nadie hasta
  que se etiqueta. El tag es el cortafuegos.
- **La caché miente si el tag cambia.** Al subir de versión conviene borrar `node_modules/.c12` y
  `node_modules/.cache` antes de `nuxt prepare`; si no, se sigue compilando contra la copia vieja.
- **Los componentes se auto-importan entre capas**, así que el consumidor escribe `<AppButton>` sin
  ningún `import`.

### Lo que la capa no instala

`tailwindcss` y `@tailwindcss/vite` tienen que estar en el `package.json` **del consumidor**: la capa
los importa en su `nuxt.config.ts` pero no los arrastra. Sin ellos, la configuración del consumidor
falla al cargar el plugin.

### El alias `#itsg`

Dentro de la capa, los tipos y composables se referencian con `#itsg/...`, **nunca con `~/`**. En
una Nuxt Layer, `~/` y `@/` se resuelven contra el proyecto _consumidor_, así que un
`~/types/form` funcionaría en el playground y explotaría en cualquier app que consuma la capa.

El alias se define en `nuxt.config.ts` con ruta absoluta derivada de `import.meta.url`, por el mismo
motivo: en el `nuxt.config` de una capa, tanto los alias como las rutas relativas se resuelven contra
el consumidor.

## Estructura de la capa

| Carpeta                   | Qué hay                                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| `app/components/`         | 60 componentes. Los `App*` son la API pública; el resto, piezas auxiliares                      |
| `app/composables/`        | `useToast`, `useConfirm`, `useTheme`, `useFocusTrap`, `useFormField`, `useTree`, `useScrollSpy` |
| `app/types/`              | `sidenav`, `table`, `form`, `tree`, `calendar`, `files`                                         |
| `app/utils/`              | `format` (es-CL / CLP), `sanitizeHtml`                                                          |
| `app/assets/css/main.css` | Tokens `@theme` y las clases de identidad (`.cartela`, `.frame`, `.input`…)                     |
| `app/assets/fonts/`       | Roboto e IBM Plex Mono auto-hospedadas (sin CDN)                                                |
| `app/layouts/default.vue` | Shell: navbar + sidebar + `ToastStack` + `ConfirmDialog`                                        |
| `app/plugins/`            | `theme.client.ts` (aplica el tema guardado), `enlaces.ts` (registra `NuxtLink`)                 |

## Tokens y tema

La paleta y las medidas viven en un bloque `@theme` de `main.css` — Tailwind v4, sin
`tailwind.config`. Los componentes usan **solo utilidades derivadas de tokens** (`bg-calipso`,
`text-ink`, `border-line`…), nunca un color literal. Es lo que permite re-tematizar toda una
aplicación cambiando ese bloque.

El modo oscuro re-declara los tokens neutrales bajo `.dark` en el mismo archivo. `useTheme()` guarda
la elección y `plugins/theme.client.ts` la aplica al arrancar; por eso la capa fija `ssr: false`,
porque el tema se resuelve en el navegador.

Tailwind v4 descubre las clases escaneando archivos, y los de la capa están fuera del proyecto que
compila: se le indican con `@source` en `main.css`. Sin eso el consumidor recibe los componentes sin
estilos.

## Componentes: la trampa del tiempo de compilación

Los componentes de Nuxt —los propios y los suyos, como `NuxtLink`— **se resuelven al compilar**. Eso
basta mientras se escriban como etiqueta:

```vue
<NuxtLink to="/algo">…</NuxtLink>
```

Pero no cuando el nombre llega como cadena a `<component :is="…">`, que es justo lo que hace
`AppButton` con `as="NuxtLink"`. Vue no lo encuentra, y como trata una cadena desconocida como
etiqueta nativa, **no avisa**: deja en el DOM un `<nuxtlink>` sin `href` ni navegación. El botón se ve
idéntico a uno que funciona y no hace nada; no falla en `build`, ni en `typecheck`, ni en `lint`, ni
en consola.

Por eso existe `app/plugins/enlaces.ts`, que registra `NuxtLink` como componente global. Va en un
plugin y no dentro de `AppButton` para no importar `#components` desde un componente: sería un ciclo
con el barril que lo exporta, y arrastraría toda la librería al chunk del botón.

**Regla que se deriva:** cualquier componente que acepte el nombre de otro por cadena depende de que
ese otro esté registrado globalmente. Si mañana se acepta `as="RouterLink"`, hay que registrarlo
igual.

## Lo que la capa deliberadamente no trae

Autenticación, middleware, `pages/`, cliente HTTP, capa de datos, `runtimeConfig`, gestor de estado
e i18n. **No es un framework de aplicación, es un design system.**

La consecuencia práctica: ningún componente sabe de dominio. `DataTable` no sabe qué es una
iniciativa; recibe filas y columnas. Un componente que necesite conocer el negocio del consumidor
está mal colocado y va en el consumidor.

`sanitizeHtml.ts` es la excepción incómoda: viene del proyecto origen, donde había un backend .NET
haciendo de barrera real. Aquí no lo hay, así que quien use `AppRichEditor` tiene que sanitizar
también del lado del servidor o restringirse a texto plano.

## Verificación

**No hay pruebas automáticas.** Es una decisión asumida, no un olvido, y tiene un coste conocido: los
dos fallos de `AppButton` de agosto pasaron `lint`, `typecheck` y `build` en verde.

Lo que hay en su lugar es el playground, y por eso [`../CONTRIBUTING.md`](../CONTRIBUTING.md) exige
demostrar ahí todo componente tocado **con el caso que puede fallar**, no solo con el feliz. Los dos
fallos sobrevivieron porque la demo solo usaba `as` con etiquetas nativas: ningún ejemplo lo usaba
como enlace.

Si algún proyecto consumidor tiene pruebas de humo (p. ej. Playwright), esas sí pueden atrapar este
tipo de fallo. Es una red útil, pero llega tarde y desde otro repositorio.

## Distribución

Hoy: repositorio de GitHub fijado por tag. Es lo más barato y no necesita infraestructura.

La alternativa es publicar la capa como paquete privado (npm o Azure Artifacts) y extender con
`extends: ['@itsg/design-system']`. Aporta semver real y resolución de dependencias a costa de un paso
de publicación; recomendable solo cuando varios equipos la consuman de verdad.

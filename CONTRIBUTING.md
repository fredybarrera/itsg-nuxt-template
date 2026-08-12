# Guía de contribución

Cómo trabajamos el código del **ITSG DS**. Para qué trae la capa y cómo se consume, ver
[`README.md`](README.md); para cómo está construida y qué reglas obedece, `docs/` (empezar por
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) y
[`docs/BUSINESS_RULES.md`](docs/BUSINESS_RULES.md)).

Esto no es una aplicación: es una **librería que otros proyectos fijan por tag**
(los distintos productos de ITSG que la consuman). Eso cambia dos cosas respecto a un repo de app
y explica todo lo demás:

- **No hay QA ni PRD.** Lo que hay son versiones. Un cambio no «sale a producción»: se etiqueta, y
  cada consumidor decide cuándo subir.
- **Un cambio malo no rompe una app, rompe todas** — pero solo cuando suben de tag. El tag es el
  cortafuegos.

## Modelo de ramas

| Rama          | Rol                        | Regla                                                                                                                            |
| ------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `master`      | Línea principal            | Rama por defecto y **única de larga vida**. **Protegida**: solo entra por PR. Lo que hay aquí es «lo próximo que se etiquetará». |
| `feat/<tema>` | Componente o funcionalidad | Sale de `master` **al día**, PR de vuelta a `master`. Efímera: **GitHub la borra sola al mergear**.                              |
| `fix/<tema>`  | Corrección                 | Igual que `feat/*`.                                                                                                              |

No hay `develop`: sobraría. En una app, `develop` es «lo que está en QA»; aquí ese papel lo hace el
tag, porque los consumidores no siguen una rama, siguen una versión.

> Nombra por tema: `fix/boton-enlace-deshabilitado`, no `fix/varios`. Otros prefijos (`docs/`,
> `chore/`, `refactor/`) siguen la misma regla; lo que importa es que la rama sea efímera y que
> el tema se lea en el nombre.

La protección de `master` no exige revisores —aquí no siempre hay otra persona— pero **no admite
push directo, ni siquiera del dueño del repositorio**. Un cambio de una línea también pasa por
rama y PR; se puede mergear uno mismo en el momento.

```bash
git switch master && git pull
git switch -c fix/mi-arreglo
# ... commits ...
git push -u origin fix/mi-arreglo
gh pr create --base master
gh pr merge --squash          # la rama se borra sola
```

## Publicar una versión

Los consumidores extienden la capa con `extends: ['github:ITSolutionsGroup/itsg-nuxt-template#vX.Y.Z']`,
así que **mientras no haya tag, el cambio no le llega a nadie**. Publicar es etiquetar:

```bash
git switch master && git pull
# 1. anotar la versión en docs/CHANGELOG.md (por PR, como todo lo demás)
git tag -a v1.0.8 -m "v1.0.8 — <resumen>"
git push origin v1.0.8
```

El paso 1 no es burocracia: [`docs/CHANGELOG.md`](docs/CHANGELOG.md) es donde un consumidor mira
antes de subir de versión, y donde tiene que estar escrito **qué le va a doler**. Un cambio que
obliga a tocar código del consumidor se avisa ahí y en el README, no solo en el mensaje del tag.

**SemVer (`MAJOR.MINOR.PATCH`)** leído desde el consumidor, que es quien sufre:

| Cambio                                                               | Versión |
| -------------------------------------------------------------------- | ------- |
| Arreglo que no cambia la API ni el DOM que ya renderizaba            | `PATCH` |
| Componente o prop nueva, con el comportamiento anterior intacto      | `MINOR` |
| Prop que desaparece o cambia de significado; DOM distinto al que era | `MAJOR` |

Ojo con la tercera fila: en un design system, **el DOM es parte de la API**. Si un componente pasa
a renderizar otra etiqueta, las pruebas de los consumidores que lo buscan por rol o por selector
dejan de encontrarlo, aunque ninguna prop haya cambiado. Eso se avisa en el mensaje del tag y en la
tabla del README.

## Convención de commits

[Conventional Commits](https://www.conventionalcommits.org): `tipo(scope): descripción`, en
**español** como todo lo demás.

- **Tipos:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
- **Scope:** el componente o la pieza tocada, en minúsculas (`button`, `datatable`, `toast`,
  `skeleton`, `css`, `layout`).
- **Ejemplos:** `feat(datatable): modo server-side (manualSort + manualPagination)` ·
  `fix(button): disabled también apaga un enlace`.
- Un `!` marca el cambio incompatible, que además obliga a subir `MAJOR`.

El cuerpo se escribe para quien lo lea dentro de un año: **por qué**, no qué. El diff ya cuenta el
qué.

## Antes de abrir el PR

```bash
npm run lint
npm run typecheck
npm run format:check
npm run build            # nuxt build .playground
```

Y lo que ninguna de esas cuatro cosas cubre: **abrir el componente en el playground y mirarlo**.

```bash
npm run dev              # → /componentes
```

No es un trámite. Aquí no hay pruebas automáticas, y las trampas de este repo no las ve el
compilador: un `<component :is>` que no resuelve deja una etiqueta muda en el DOM sin avisar, y un
`disabled` puede quedarse pintado sin apagar nada. `lint`, `typecheck` y `build` pasaron en verde
con las dos.

**Todo componente nuevo o modificado se demuestra en `.playground/app/pages/componentes.vue`**, y
con el caso que puede fallar, no solo con el feliz. Los dos fallos de `AppButton` sobrevivieron
porque la demo solo usaba `as` con etiquetas nativas: ningún ejemplo lo usaba como enlace.

## Al añadir un componente

1. Va en `app/components/`, con `<script setup lang="ts">` y props tipadas.
2. Las props opcionales llevan **default explícito** en `withDefaults`, y las obligatorias se piensan
   dos veces: `vue-tsc` **no** exige una prop requerida en la plantilla del consumidor. Omitirla no
   rompe el typecheck, y a veces tampoco se nota. `KpiTile` declara `trend` y `trendLabel`
   requeridas; sin ellas pinta una flecha roja hacia abajo, afirmando una caída que los datos no
   dicen.
3. Dentro de la capa, los imports propios van con `#itsg/...`, nunca con `~/` — en una Nuxt Layer
   `~/` apunta al consumidor.
4. Solo utilidades derivadas de tokens (`bg-calipso`, `text-ink`, `border-line`…), nada de colores a
   mano: es lo que permite re-tematizar cambiando `@theme`.
5. Fila en la tabla del catálogo del [`README.md`](README.md), y demo en el playground.
6. Si el componente tiene una trampa que no se ve leyéndolo, va en «Notas y limitaciones» del README.
   Ahí está, por ejemplo, por qué existe `plugins/enlaces.ts`.

## Estilo

Prettier es la única autoridad de formato (`semi: false`, `singleQuote: true`, `printWidth: 110`).
No se discute con él: `npm run format` y a otra cosa.

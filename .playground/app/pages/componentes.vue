<script setup lang="ts">
import type { DataTableColumn, FilterDef } from '#itsg/types/table'
import type { ComboboxModel, ComboboxValue, SelectOption } from '#itsg/types/form'
import type { TreeNode } from '#itsg/types/tree'
import type { CalendarEvent } from '#itsg/types/calendar'
import type { FileItem } from '#itsg/types/files'

const { showToast } = useToast()
const { confirmar } = useConfirm()

const nombre = ref('')
const correo = ref('correo-invalido')
const area = ref<string | number>('')
const descripcion = ref('')
const areaOptions: SelectOption[] = [
  { label: 'Forestal', value: 'Forestal' },
  { label: 'Celulosa', value: 'Celulosa' },
  { label: 'Maderas', value: 'Maderas' },
]
const errorCorreo = computed(() =>
  correo.value && !correo.value.includes('@') ? 'Ingresa un correo válido.' : undefined
)

const responsable = ref<ComboboxModel>(null)
const areasVisibles = ref<ComboboxModel>(['Forestal'])
const produccion = ref<number | null>(12480.5)
const responsables: SelectOption[] = [
  { label: 'Ana Pérez', value: 'aperez' },
  { label: 'Luis Soto', value: 'lsoto' },
  { label: 'Rosa Díaz', value: 'rdiaz' },
  { label: 'Marcelo Fuentes', value: 'mfuentes' },
  { label: 'Carla Muñoz (licencia)', value: 'cmunoz', disabled: true },
  { label: 'Jorge Riquelme', value: 'jriquelme' },
]
const grupoAsignados = ref<ComboboxValue[]>(['lsoto', 'rdiaz'])

const hoy = new Date()
const eventos: CalendarEvent[] = [
  { date: new Date(hoy.getFullYear(), hoy.getMonth(), 3), label: 'Mantención Línea 1', tone: 'warning' },
  { date: hoy, label: 'Reunión mensual', tone: 'primary' },
  { date: new Date(hoy.getFullYear(), hoy.getMonth(), 12), label: 'Auditoría interna', tone: 'danger' },
  { date: new Date(hoy.getFullYear(), hoy.getMonth(), 12), label: 'Entrega de reporte', tone: 'success' },
  { date: new Date(hoy.getFullYear(), hoy.getMonth(), 12), label: 'Corte programado', tone: 'warning' },
  { date: new Date(hoy.getFullYear(), hoy.getMonth(), 12), label: 'Visita gerencia', tone: 'primary' },
  { date: new Date(hoy.getFullYear(), hoy.getMonth(), 24), label: 'Cierre de mes', tone: 'success' },
]

const archivos = ref<FileItem[]>([
  { name: 'informe-produccion.pdf', size: 1_482_000, url: '#' },
  { name: 'fotos-linea1.zip', size: 48_210_000, progress: 62 },
  { name: 'datos.xlsx', size: 89_500, error: 'Formato no permitido' },
])
function quitarArchivo(_file: FileItem, i: number) {
  archivos.value.splice(i, 1)
}

const archivosSubidos = ref<{ id: number; name: string; size: number }[]>([])

const nodoSeleccionado = ref<string | null>('mdf-l1')
const jerarquia: TreeNode[] = [
  {
    key: 'celulosa',
    label: 'Celulosa',
    icon: 'box',
    children: [
      {
        key: 'planta-central',
        label: 'Planta Central',
        children: [
          { key: 'central-l1', label: 'Línea 1', icon: 'chart' },
          { key: 'central-l2', label: 'Línea 2', icon: 'chart' },
        ],
      },
      { key: 'planta-valdivia', label: 'Planta Valdivia' },
    ],
  },
  {
    key: 'maderas',
    label: 'Maderas',
    icon: 'box',
    children: [
      {
        key: 'planta-mdf',
        label: 'Planta MDF',
        children: [
          { key: 'mdf-l1', label: 'Línea MDF 1', icon: 'chart' },
          { key: 'mdf-l2', label: 'Línea MDF 2 (detenida)', icon: 'chart', disabled: true },
        ],
      },
    ],
  },
]

const modalOpen = ref(false)
const drawerOpen = ref(false)
const drawerTitulo = ref('Mantención Línea 1')
const drawerPrioridad = ref<string | number>('Media')
const prioridadOptions: SelectOption[] = [
  { label: 'Alta', value: 'Alta' },
  { label: 'Media', value: 'Media' },
  { label: 'Baja', value: 'Baja' },
]
const botonCargando = ref(false)
const progreso = ref(64)
const paginaDemo = ref(3)

function guardarDrawer() {
  drawerOpen.value = false
  showToast('Cambios guardados', 'success')
}

function guardarModal() {
  modalOpen.value = false
  showToast('Guardado desde el modal')
}

function simularCarga() {
  botonCargando.value = true
  setTimeout(() => {
    botonCargando.value = false
  }, 1500)
}

const check = ref(true)
const switchOn = ref(false)
const radio = ref('a')
const chips = ref(['nuxt', 'tailwind'])
const color = ref('#3fae9a')
const fecha = ref<Date | null>(null)
const segmento = ref('lista')
const tab = ref('uno')
const rating = ref(4)

const columns: DataTableColumn[] = [
  { key: 'nombre', label: 'Nombre', sortable: true },
  { key: 'area', label: 'Área', sortable: true },
  { key: 'estado', label: 'Estado' },
]
const rows = [
  { nombre: 'Proyecto Alfa', area: 'Forestal', estado: 'Activo' },
  { nombre: 'Proyecto Beta', area: 'Celulosa', estado: 'Pausado' },
  { nombre: 'Proyecto Gamma', area: 'Maderas', estado: 'Activo' },
]
const filters: FilterDef[] = [
  {
    key: 'area',
    label: 'Área',
    placeholder: 'Filtrar por área',
    options: [
      { label: 'Forestal', value: 'Forestal' },
      { label: 'Celulosa', value: 'Celulosa' },
      { label: 'Maderas', value: 'Maderas' },
    ],
  },
]

async function probarConfirm() {
  const ok = await confirmar({
    title: 'Confirmar acción',
    message: '¿Deseas continuar con la acción de ejemplo?',
  })
  showToast(ok ? 'Confirmado' : 'Cancelado', ok ? 'success' : 'warning')
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <header>
      <h1 class="font-display text-2xl font-bold tracking-wide uppercase">Librería de componentes</h1>
      <p class="mt-1 text-sm text-ink-soft">Muestrario de los componentes del design system ITSG.</p>
    </header>

    <!-- Botones y badges -->
    <section class="frame">
      <h2 class="mb-4 font-display text-lg font-bold">Botones y badges</h2>
      <div class="flex flex-wrap items-center gap-2">
        <AppButton variant="primary">Primario</AppButton>
        <AppButton variant="secondary">Secundario</AppButton>
        <AppButton variant="outline">Outline</AppButton>
        <AppButton variant="ghost">Ghost</AppButton>
        <AppButton variant="danger">Peligro</AppButton>
        <AppButton variant="primary" size="sm">Pequeño</AppButton>
        <AppButton variant="primary" disabled>Deshabilitado</AppButton>
      </div>
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <!-- `as` con el nombre de un componente. Tiene que salir un <a> con
             href: si sale un <nuxtlink> mudo, falta plugins/enlaces.ts. -->
        <AppButton as="NuxtLink" to="/" variant="outline" size="sm">Enlace (NuxtLink)</AppButton>
        <AppButton as="a" href="https://itsolutionsgroup.com" target="_blank" variant="ghost" size="sm">
          Enlace externo
        </AppButton>
        <!-- Un enlace apagado no se queda «gris pero navegable»: sin foco,
             sin clic y con aria-disabled. -->
        <AppButton as="NuxtLink" to="/" variant="outline" size="sm" disabled>
          Enlace deshabilitado
        </AppButton>
        <AppButton as="NuxtLink" to="/" variant="primary" size="sm" loading>Enlace cargando</AppButton>
      </div>
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <AppBadge>Neutral</AppBadge>
        <AppBadge tone="success">Éxito</AppBadge>
        <AppBadge tone="warning">Alerta</AppBadge>
        <AppBadge tone="danger">Peligro</AppBadge>
        <AppBadge tone="info">Info</AppBadge>
      </div>
    </section>

    <!-- Heroes -->
    <section class="frame">
      <h2 class="mb-4 font-display text-lg font-bold">Secciones hero</h2>
      <div class="flex flex-col gap-4">
        <AppHero
          as="h3"
          size="sm"
          title="Hero compacto (sm)"
          subtitle="Para encabezar sub-secciones o páginas secundarias."
        >
          <template #actions>
            <AppButton variant="outline" size="sm">Acción</AppButton>
          </template>
        </AppHero>
        <AppHero
          as="h3"
          size="md"
          eyebrow="Eyebrow opcional"
          title="Hero estándar (md)"
          subtitle="El tamaño por defecto para encabezar la mayoría de las páginas."
        >
          <template #actions>
            <AppButton variant="outline" size="sm">Secundaria</AppButton>
            <AppButton variant="primary" size="sm">Principal</AppButton>
          </template>
        </AppHero>
        <AppHero
          as="h3"
          size="lg"
          eyebrow="ITSG · Design System"
          title="Hero destacado (lg)"
          subtitle="Para portadas y dashboards. El slot por defecto acepta contenido extra, como una fila de KPIs (ver la página de inicio)."
        >
          <template #actions>
            <AppButton variant="primary">Comenzar</AppButton>
          </template>
        </AppHero>
      </div>
    </section>

    <!-- Formularios -->
    <section class="frame">
      <h2 class="mb-4 font-display text-lg font-bold">Formularios</h2>
      <div class="grid gap-5 md:grid-cols-2">
        <AppFormField label="Nombre del proyecto" hint="Como aparecerá en los reportes." required>
          <AppInput v-model="nombre" icon="search" clearable placeholder="Escribe algo…" />
        </AppFormField>
        <AppFormField label="Correo de contacto" :error="errorCorreo" required>
          <AppInput v-model="correo" type="email" placeholder="nombre@itsolutionsgroup.com" />
        </AppFormField>
        <AppFormField label="Área">
          <AppSelect v-model="area" :options="areaOptions" placeholder="Selecciona un área…" />
        </AppFormField>
        <AppFormField label="Descripción" hint="Máximo 200 caracteres.">
          <AppTextarea
            v-model="descripcion"
            :rows="3"
            :maxlength="200"
            show-count
            placeholder="Describe el proyecto…"
          />
        </AppFormField>
        <AppFormField label="Responsable" hint="Combobox con búsqueda.">
          <AppCombobox
            v-model="responsable"
            :options="responsables"
            placeholder="Busca una persona…"
            clearable
          />
        </AppFormField>
        <AppFormField label="Áreas visibles" hint="Selección múltiple con chips.">
          <AppCombobox
            v-model="areasVisibles"
            :options="areaOptions"
            multiple
            placeholder="Selecciona áreas…"
          />
        </AppFormField>
        <AppFormField label="Producción mensual" hint="Formato es-CL al salir del campo.">
          <AppNumberInput v-model="produccion" :decimals="1" :min="0" suffix="m³" placeholder="0,0" />
        </AppFormField>
        <AppDatePicker v-model="fecha" />
        <AppChipInput v-model="chips" />
        <AppColorPicker v-model="color" />
        <div class="flex flex-wrap items-center gap-6">
          <label class="flex cursor-pointer items-center gap-2 text-sm">
            <AppCheck v-model="check" /> Checkbox
          </label>
          <label class="flex cursor-pointer items-center gap-2 text-sm">
            <AppSwitch v-model="switchOn" /> Switch
          </label>
          <AppRating v-model="rating" />
        </div>
        <div class="flex items-center gap-6">
          <label class="flex cursor-pointer items-center gap-2 text-sm">
            <AppRadio v-model="radio" value="a" /> Opción A
          </label>
          <label class="flex cursor-pointer items-center gap-2 text-sm">
            <AppRadio v-model="radio" value="b" /> Opción B
          </label>
        </div>
      </div>
      <div class="mt-5">
        <p class="mb-2 text-[13px] font-semibold text-ink">Carga de archivos (AppDropzone)</p>
        <AppDropzone v-model="archivosSubidos" />
      </div>
      <div class="mt-5">
        <p class="mb-2 text-[13px] font-semibold text-ink">Archivos (AppFileList)</p>
        <AppFileList :files="archivos" @remove="quitarArchivo" />
      </div>
    </section>

    <!-- Organización -->
    <section class="frame">
      <h2 class="mb-4 font-display text-lg font-bold">Organización</h2>
      <div class="flex flex-col gap-5">
        <SegmentedControl
          v-model="segmento"
          :options="[
            { label: 'Lista', value: 'lista' },
            { label: 'Tablero', value: 'tablero' },
            { label: 'Calendario', value: 'calendario' },
          ]"
        />
        <AppTabs
          v-model="tab"
          :tabs="[
            { key: 'uno', label: 'Resumen' },
            { key: 'dos', label: 'Detalle', count: 3 },
          ]"
        />
        <AppWizard
          :steps="[{ label: 'Datos' }, { label: 'Revisión' }, { label: 'Confirmación' }]"
          @finish="showToast('Wizard finalizado', 'success')"
        >
          <template #panel-0>
            <p class="text-sm text-ink-soft">Contenido del paso 1.</p>
          </template>
          <template #panel-1>
            <p class="text-sm text-ink-soft">Contenido del paso 2.</p>
          </template>
          <template #panel-2>
            <p class="text-sm text-ink-soft">Contenido del paso 3.</p>
          </template>
        </AppWizard>
        <AppAccordion
          :items="[
            {
              question: '¿Qué es esta plantilla?',
              answer: 'Una base limpia del design system ITSG para nuevos proyectos.',
            },
            {
              question: '¿Cómo cambio los colores?',
              answer: 'Edita el bloque @theme en app/assets/css/main.css.',
            },
          ]"
        />
        <AppTimeline
          :events="[
            { time: '09:00', title: 'Proyecto creado', desc: 'Se inicializó la plantilla base.' },
            {
              time: '10:30',
              title: 'Tokens ajustados',
              desc: 'Paleta corporativa aplicada.',
              tone: 'warning',
            },
          ]"
        />
        <StatusBar
          label="Distribución por estado"
          :segments="[
            { label: 'Activo', percent: 55, color: 'var(--color-verde)', icon: 'check' },
            { label: 'Pausado', percent: 30, color: 'var(--color-amarillo)', icon: 'clock' },
            { label: 'Cerrado', percent: 15, color: 'var(--color-rojo)', icon: 'close' },
          ]"
        />
        <div>
          <p class="mb-2 text-[13px] font-semibold text-ink">Asignación (AppTransferList)</p>
          <AppTransferList
            v-model="grupoAsignados"
            :options="responsables"
            searchable
            title-available="Usuarios disponibles"
            title-assigned="En el grupo"
          />
          <p class="mt-2 font-mono text-[12px] text-ink-soft">
            Asignados: {{ grupoAsignados.join(', ') || '—' }}
          </p>
        </div>
      </div>
    </section>

    <!-- Tabla -->
    <section class="frame">
      <h2 class="mb-4 font-display text-lg font-bold">Tabla con filtros</h2>
      <FilteredTable
        :columns="columns"
        :rows="rows"
        :filters="filters"
        :search-keys="['nombre', 'area']"
        search-placeholder="Buscar proyecto…"
      />
    </section>

    <!-- Gráficos -->
    <section class="frame">
      <h2 class="mb-4 font-display text-lg font-bold">Gráficos y KPIs</h2>
      <div class="mb-4 grid items-start gap-4 md:grid-cols-3">
        <KpiTile
          size="sm"
          label="KPI compacto (sm)"
          value="87"
          unit="%"
          trend="up"
          trend-label="+4% vs mes anterior"
        />
        <KpiTile label="KPI estándar (md)" value="87" unit="%" trend="up" trend-label="+4% vs mes anterior" />
        <KpiTile
          size="lg"
          label="KPI destacado (lg)"
          value="87"
          unit="%"
          trend="down"
          trend-label="-2% vs mes anterior"
        />
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <!-- Dirección ≠ sentido: la flecha baja pero es positivo (menos mermas es mejor) -->
        <KpiTile
          label="Mermas de proceso"
          value="3.2"
          unit="%"
          trend="down"
          sentiment="positive"
          trend-label="−8% vs mes anterior · mejor"
        />
        <TrendSparkline :data="[4, 6, 5, 8, 9, 7, 11]" label="Tendencia" />
        <BarChart
          :data="[
            { label: 'Forestal', value: 42 },
            { label: 'Celulosa', value: 31 },
            { label: 'Maderas', value: 18 },
          ]"
          label="Por área"
        />
      </div>
    </section>

    <!-- Calendario -->
    <section class="frame">
      <h2 class="mb-4 font-display text-lg font-bold">Calendario</h2>
      <AppCalendar
        :events="eventos"
        @select-event="(ev) => showToast(ev.label, 'info')"
        @select-day="(d, evs) => showToast(`${formatDate(d)}: ${evs.length} evento(s)`, 'info')"
      />
    </section>

    <!-- Feedback -->
    <section class="frame">
      <h2 class="mb-4 font-display text-lg font-bold">Feedback</h2>
      <div class="flex flex-col gap-4">
        <AppAlert tone="info" title="Alerta informativa"
          >Contenido de la alerta con tono informativo.</AppAlert
        >
        <AppAlert tone="warning" title="Atención" dismissible>Alerta descartable de advertencia.</AppAlert>
        <div class="flex flex-wrap gap-2">
          <AppButton variant="primary" @click="showToast('Toast de éxito', 'success')">Toast éxito</AppButton>
          <AppButton variant="danger" @click="showToast('Toast de error', 'error')">Toast error</AppButton>
          <AppButton variant="outline" @click="probarConfirm">Confirm dialog</AppButton>
          <AppButton variant="secondary" @click="modalOpen = true">Abrir modal</AppButton>
          <AppButton variant="outline" @click="drawerOpen = true">Panel de edición (drawer)</AppButton>
          <AppButton variant="primary" :loading="botonCargando" @click="simularCarga"
            >Guardar (loading)</AppButton
          >
        </div>
        <div class="flex items-center gap-6">
          <span class="tooltip" data-tooltip="Tooltip CSS-only" data-placement="top">
            <AppBadge tone="info">Hover: tooltip</AppBadge>
          </span>
          <AppAvatarGroup>
            <AppAvatar initials="AP" size="sm" color="var(--color-calipso)" />
            <AppAvatar initials="LS" size="sm" color="var(--color-verde)" />
            <AppAvatar initials="RD" size="sm" color="var(--color-naranja)" />
          </AppAvatarGroup>
        </div>
        <div class="flex flex-col gap-2">
          <AppSkeleton width="60%" />
          <AppSkeleton width="40%" />
        </div>
        <AppEmptyState icon="box" title="Sin resultados" description="Ejemplo de estado vacío." />
      </div>
    </section>

    <!-- Indicadores y navegación -->
    <section class="frame">
      <h2 class="mb-4 font-display text-lg font-bold">Indicadores y navegación</h2>
      <div class="flex flex-col gap-5">
        <AppBreadcrumbs
          :items="[
            { label: 'Inicio', to: '/' },
            { label: 'Componentes', to: '/componentes' },
            { label: 'Indicadores' },
          ]"
        />
        <div class="flex items-center gap-4 text-calipso-deep">
          <AppSpinner :size="16" />
          <AppSpinner :size="24" />
          <span class="text-ink-soft"><AppSpinner :size="20" /></span>
        </div>
        <AppProgress label="Avance del proyecto" :value="progreso" show-value />
        <AppProgress label="Cargando (indeterminado)" tone="warning" />
        <AppPagination v-model="paginaDemo" :total-pages="12" />
        <div>
          <p class="mb-2 text-[13px] font-semibold text-ink">Popover con detección de bordes</p>
          <AppPopover panel-class="w-64">
            <template #trigger="{ open }">
              <AppButton variant="outline" size="sm">Abrir popover {{ open ? '▴' : '▾' }}</AppButton>
            </template>
            <template #default="{ close }">
              <p class="m-0 text-[13px] text-ink-soft">
                Contenido libre. El panel se voltea hacia arriba o se alinea a la derecha si no cabe en el
                viewport.
              </p>
              <AppButton variant="ghost" size="sm" class="mt-2" @click="close">Cerrar</AppButton>
            </template>
          </AppPopover>
        </div>
        <div>
          <p class="mb-2 text-[13px] font-semibold text-ink">Vista jerárquica (AppTree)</p>
          <div class="max-w-sm rounded-(--radius-md) border border-line bg-card p-2.5">
            <AppTree v-model="nodoSeleccionado" :nodes="jerarquia" default-expand-all />
          </div>
          <p class="mt-2 font-mono text-[12px] text-ink-soft">Seleccionado: {{ nodoSeleccionado ?? '—' }}</p>
        </div>
      </div>
    </section>

    <!-- Overlays -->
    <AppModal v-model:open="modalOpen" title="Modal de ejemplo" size="md">
      <p class="m-0 text-sm text-ink-soft">
        Modal genérico con focus trap, bloqueo de scroll y cierre con Escape o clic fuera. Usa
        <code>size</code> (sm/md/lg) y el slot <code>#footer</code> para acciones.
      </p>
      <template #footer>
        <AppButton variant="outline" size="sm" @click="modalOpen = false">Cancelar</AppButton>
        <AppButton variant="primary" size="sm" @click="guardarModal">Guardar</AppButton>
      </template>
    </AppModal>

    <!-- AppDrawer también sirve como panel lateral de edición: título + formulario +
         acciones en #footer. No hace falta un componente aparte para ese caso. -->
    <AppDrawer v-model:open="drawerOpen" title="Editar mantención">
      <div class="flex flex-col gap-4">
        <AppFormField label="Título">
          <AppInput v-model="drawerTitulo" />
        </AppFormField>
        <AppFormField label="Prioridad">
          <AppSelect v-model="drawerPrioridad" :options="prioridadOptions" />
        </AppFormField>
      </div>
      <template #footer>
        <AppButton variant="outline" size="sm" @click="drawerOpen = false">Cancelar</AppButton>
        <AppButton variant="primary" size="sm" @click="guardarDrawer">Guardar</AppButton>
      </template>
    </AppDrawer>
  </div>
</template>

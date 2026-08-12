<script setup lang="ts">
const { showToast } = useToast()
</script>

<template>
  <div class="flex flex-col gap-6">
    <AppHero
      size="lg"
      eyebrow="ITSG · Design System"
      title="Plantilla base"
      subtitle="Base limpia con tokens Tailwind v4, layout corporativo y componentes del design system, sin lógica de negocio. Revisa la página Componentes para ver la librería en acción."
    >
      <template #actions>
        <AppButton variant="primary" @click="navigateTo('/componentes')">Ver componentes</AppButton>
      </template>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile label="Tokens de color" value="14" trend="up" trend-label="paleta corporativa" />
        <KpiTile label="Componentes" value="60" trend="up" trend-label="auto-importados" />
        <KpiTile label="Composables" value="7" trend="up" trend-label="toast · confirm · theme…" />
        <KpiTile
          label="Dependencias"
          value="5"
          trend="down"
          sentiment="positive"
          trend-label="sin Pinia ni Axios"
        />
      </div>
    </AppHero>

    <section class="frame">
      <h2 class="mb-3 font-display text-lg font-bold">Primeros pasos</h2>
      <ol class="list-decimal space-y-1.5 pl-5 text-sm text-ink-soft">
        <li>
          Cambia título y navegación en <code class="font-semibold text-ink">app/layouts/default.vue</code>.
        </li>
        <li>
          Ajusta los tokens (colores, radios, sombras) en
          <code class="font-semibold text-ink">app/assets/css/main.css</code> (bloque <code>@theme</code>).
        </li>
        <li>
          Crea tus páginas en <code class="font-semibold text-ink">app/pages/</code> — el layout y los
          componentes se auto-importan.
        </li>
        <li>Elimina las páginas demo cuando ya no las necesites.</li>
      </ol>
      <div class="mt-4 flex gap-2">
        <AppButton variant="primary" @click="showToast('La plantilla funciona ✔', 'success')">
          Probar toast
        </AppButton>
        <AppButton variant="outline" @click="navigateTo('/componentes')">Ver componentes</AppButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Datos de ejemplo: cuando el proyecto tenga auth (MSAL/Azure AD, ver README),
// reemplazar por la sesión real vía useAuth.
const usuario = {
  nombre: 'Nombre Apellido',
  correo: 'nombre.apellido@itsolutionsgroup.com',
  rol: 'Administrador',
  area: 'Tecnología',
  cargo: 'Analista de Sistemas',
  ingreso: new Date(2022, 2, 14),
  ultimoAcceso: new Date(),
}

const iniciales = usuario.nombre
  .split(' ')
  .slice(0, 2)
  .map((p) => p.charAt(0).toUpperCase())
  .join('')

const campos = [
  { label: 'Correo', valor: usuario.correo },
  { label: 'Área', valor: usuario.area },
  { label: 'Cargo', valor: usuario.cargo },
  { label: 'Rol de aplicación', valor: usuario.rol },
  { label: 'Fecha de ingreso', valor: formatDate(usuario.ingreso) },
  { label: 'Último acceso', valor: formatDateTime(usuario.ultimoAcceso) },
]
</script>

<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-6">
    <section class="frame flex items-center gap-5">
      <AppAvatar :initials="iniciales" size="lg" color="var(--color-calipso)" />
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="m-0 font-display text-xl font-bold">{{ usuario.nombre }}</h1>
          <AppBadge tone="info">{{ usuario.rol }}</AppBadge>
        </div>
        <p class="m-0 mt-1 text-sm text-ink-soft">{{ usuario.correo }}</p>
      </div>
    </section>

    <section class="frame">
      <h2 class="mb-4 font-display text-lg font-bold">Datos de la cuenta</h2>
      <dl class="m-0 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <div v-for="campo in campos" :key="campo.label">
          <dt class="text-[11px] font-semibold tracking-[.08em] text-ink-soft uppercase">
            {{ campo.label }}
          </dt>
          <dd class="m-0 mt-0.5 text-sm text-ink">{{ campo.valor }}</dd>
        </div>
      </dl>
    </section>

    <AppAlert tone="info" title="Datos de ejemplo">
      Esta página muestra datos ficticios. Conecta <code>useAuth</code> (MSAL/Azure AD, ver README) para
      mostrar la sesión real.
    </AppAlert>
  </div>
</template>

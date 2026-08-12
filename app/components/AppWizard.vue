<script setup lang="ts">
export interface WizardStep {
  label: string
}

const props = defineProps<{ steps: WizardStep[] }>()
const emit = defineEmits<{ finish: [] }>()

const current = ref(0)

function goTo(i: number) {
  current.value = i
}
function back() {
  if (current.value > 0) current.value--
}
function next() {
  if (current.value < props.steps.length - 1) current.value++
  else emit('finish')
}

defineExpose({ current })
</script>

<template>
  <div>
    <div class="flex items-center">
      <template v-for="(step, i) in steps" :key="i">
        <button
          class="flex items-center gap-2.5 shrink-0 bg-transparent border-none cursor-pointer font-body p-0"
          @click="goTo(i)"
        >
          <span
            :class="[
              'w-7 h-7 rounded-full border-[1.6px] flex items-center justify-center font-mono text-[12.5px] shrink-0 bg-card',
              i < current
                ? 'bg-calipso text-primary-ink border-calipso'
                : i === current
                  ? 'border-calipso text-primary-ink font-bold'
                  : 'border-line-strong text-ink-soft',
            ]"
          >
            <AppIcon v-if="i < current" name="check" :size="13" />
            <template v-else>{{ i + 1 }}</template>
          </span>
          <span
            :class="[
              'text-[13px] whitespace-nowrap',
              i <= current ? 'text-ink font-semibold' : 'text-ink-soft',
            ]"
          >
            {{ step.label }}
          </span>
        </button>
        <span
          v-if="i < steps.length - 1"
          :class="['flex-1 h-px mx-2.5 min-w-[20px]', i < current ? 'bg-calipso' : 'bg-line-strong']"
        />
      </template>
    </div>

    <div class="my-6">
      <slot :name="`panel-${current}`" />
    </div>

    <div class="flex justify-between pt-5 border-t border-line">
      <AppButton variant="ghost" :disabled="current === 0" @click="back">Atrás</AppButton>
      <AppButton @click="next">{{ current === steps.length - 1 ? 'Finalizar' : 'Siguiente' }}</AppButton>
    </div>
  </div>
</template>

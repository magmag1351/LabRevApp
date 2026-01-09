<script setup lang="ts">
const props = defineProps<{
  count: number | undefined
}>()

const emit = defineEmits(['confirm'])
const open = ref(false)
</script>

<template>
  <UModal v-model:open="open" title="Delete books" description="Are you sure you want to delete the selected books?">
    <slot />

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancel"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />
        <UButton
          label="Delete"
          color="error"
          variant="solid"
          icon="i-lucide-trash"
          @click="emit('confirm'); open = false"
        />
      </div>
    </template>
  </UModal>
</template>

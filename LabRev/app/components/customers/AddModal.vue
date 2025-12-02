<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email'),
  id: z.number().int().positive(),
  grade: z.enum(['Admin', 'M2', 'M1', 'B4', 'B3'])
})
const open = ref(false)
const loading = ref(false)
const emit = defineEmits(['success'])

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  id: undefined,
  grade: undefined
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await $fetch('/api/members', {
      method: 'POST',
      body: event.data
    })
    
    toast.add({ title: 'Success', description: `New customer ${event.data.name} added`, color: 'success' })
    open.value = false
    emit('success')
    
    // Reset form
    state.name = undefined
    state.email = undefined
    state.id = undefined
    state.grade = undefined
    
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to add member', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal v-model:open="open" title="New member" description="Add a new member to the database">
    <UButton label="New member" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Name" name="name">
          <UInput v-model="state.name" class="w-full" placeholder="John Doe" />
        </UFormField>
        
        <UFormField label="ID" name="id">
          <UInput v-model.number="state.id" type="number" class="w-full" placeholder="123456" />
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput v-model="state.email" class="w-full" placeholder="john.doe@example.com" />
        </UFormField>

        <UFormField label="Grade" name="grade">
           <USelect v-model="state.grade" :items="['Admin', 'M2', 'M1', 'B4', 'B3']" class="w-full" />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            label="Create"
            color="primary"
            variant="solid"
            type="submit"
            :loading="loading"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

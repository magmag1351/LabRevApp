<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { LabMember } from '~/types'

const props = defineProps<{
  member?: LabMember
}>()

const schema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email'),
  id: z.number().int().positive(),
  grade: z.enum(['Admin', 'M2', 'M1', 'B4', 'B3'])
})

const open = defineModel<boolean>('open')
const loading = ref(false)
const emit = defineEmits(['success'])

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  id: undefined,
  grade: undefined
})

watch(() => props.member, (newMember) => {
  if (newMember) {
    state.name = newMember.name
    state.email = newMember.email
    state.id = newMember.id
    state.grade = newMember.grade
  }
}, { immediate: true })

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await $fetch('/api/members', {
      method: 'PUT',
      body: event.data
    })
    
    toast.add({ title: 'Success', description: `Member ${event.data.name} updated`, color: 'success' })
    open.value = false
    emit('success')
    
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to update member', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal v-model:open="open" title="Edit member" description="Edit member details">
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
          <UInput v-model.number="state.id" type="number" class="w-full" placeholder="123456" disabled />
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
            label="Save"
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

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  id: z.number().int().positive(),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['室内', '貸出', '不明']),
  renter: z.string().optional(),
  rentDate: z.string().optional()
})
const open = ref(false)
const loading = ref(false)
const emit = defineEmits(['success'])

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: undefined,
  id: undefined,
  category: undefined,
  status: '室内',
  renter: '',
  rentDate: ''
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await $fetch('/api/books', {
      method: 'POST',
      body: event.data
    })
    
    toast.add({ title: 'Success', description: `New book ${event.data.title} added`, color: 'success' })
    open.value = false
    emit('success')
    
    // Reset form
    state.title = undefined
    state.id = undefined
    state.category = undefined
    state.status = '室内'
    state.renter = ''
    state.rentDate = ''
    
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to add book', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal v-model:open="open" title="New book" description="Add a new book to the database">
    <UButton label="New book" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Title" name="title">
          <UInput v-model="state.title" class="w-full" placeholder="Book Title" />
        </UFormField>
        
        <UFormField label="ID (Barcode)" name="id">
          <UInput v-model.number="state.id" type="number" class="w-full" placeholder="123456" />
        </UFormField>

        <UFormField label="Category" name="category">
          <UInput v-model="state.category" class="w-full" placeholder="Textbook, etc." />
        </UFormField>

        <UFormField label="Status" name="status">
           <USelect v-model="state.status" :items="['室内', '貸出', '不明']" class="w-full" />
        </UFormField>

        <UFormField label="Renter" name="renter">
          <UInput v-model="state.renter" class="w-full" placeholder="Name" />
        </UFormField>

        <UFormField label="Rent Date" name="rentDate">
          <UInput v-model="state.rentDate" type="date" class="w-full" />
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

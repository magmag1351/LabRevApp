<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Book } from '~/types'

const schema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['室内', '貸出', '不明']),
  renter: z.string().optional(),
  rentDate: z.string().optional()
})

const props = defineProps<{
  book: Book | undefined
}>()

const open = defineModel<boolean>('open', { default: false })
const loading = ref(false)
const emit = defineEmits(['success'])

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  id: undefined,
  title: undefined,
  category: undefined,
  status: undefined,
  renter: undefined,
  rentDate: undefined
})

watch(() => props.book, (newBook) => {
  if (newBook) {
    state.id = newBook.id
    state.title = newBook.title
    state.category = newBook.category
    state.status = newBook.status
    state.renter = newBook.renter
    state.rentDate = newBook.rentDate
  }
}, { immediate: true })

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await $fetch('/api/books', {
      method: 'PUT',
      body: event.data
    })
    
    toast.add({ title: 'Success', description: `Book ${event.data.title} updated`, color: 'success' })
    open.value = false
    emit('success')
    
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to update book', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal v-model:open="open" title="Edit book" description="Update book details">
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Title" name="title">
          <UInput v-model="state.title" class="w-full" />
        </UFormField>
        
        <UFormField label="ID (Barcode)" name="id">
          <UInput v-model.number="state.id" type="number" class="w-full" disabled />
        </UFormField>

        <UFormField label="Category" name="category">
          <UInput v-model="state.category" class="w-full" />
        </UFormField>

        <UFormField label="Status" name="status">
           <USelect v-model="state.status" :items="['室内', '貸出', '不明']" class="w-full" />
        </UFormField>

        <UFormField label="Renter" name="renter">
          <UInput v-model="state.renter" class="w-full" />
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
            label="Update"
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

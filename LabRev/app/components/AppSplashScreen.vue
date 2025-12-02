<script setup lang="ts">
const emit = defineEmits(['finished'])

const imageOpacity = ref(0)
const containerOpacity = ref(1)
const show = ref(true)

onMounted(() => {
  // Start image fade in
  setTimeout(() => {
    imageOpacity.value = 1
  }, 100)

  // Wait then fade out the entire container
  setTimeout(() => {
    containerOpacity.value = 0
  }, 2500) // 100ms + 2400ms visible

  // Emit finished after container fade out
  setTimeout(() => {
    show.value = false
    emit('finished')
  }, 3500) // 2500ms + 1000ms transition
})
</script>

<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-1000" 
    :style="{ opacity: containerOpacity }"
  >
    <img 
      src="/hatsukadeLab.png" 
      alt="Hatsukade Lab" 
      class="w-64 h-auto transition-opacity duration-1000"
      :style="{ opacity: imageOpacity }"
    />
  </div>
</template>

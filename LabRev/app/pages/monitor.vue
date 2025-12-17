<script setup lang="ts">
const { data: members, refresh } = await useFetch('/api/attendance')


const columns = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'firstEntry',
    header: 'First Entry',
    class: 'hidden sm:table-cell' 
  },
  {
    accessorKey: 'lastExit',
    header: 'Last Exit',
    class: 'hidden sm:table-cell'
  },
  {
      id: 'timeline',
      header: () => h('div', { class: 'w-full flex justify-between text-xs text-gray-500' }, [
          h('span', '06:00'),
          h('span', '12:00'),
          h('span', '18:00'),
          h('span', '24:00')
      ]),
      cell: ({ row }: { row: any }) => {
          const m = row.original
          if (!m.firstEntry) return h('div', { class: 'text-gray-400 text-xs' }, '-')

          const start = new Date(m.firstEntry).getTime()
          const end = m.lastExit ? new Date(m.lastExit).getTime() : new Date().getTime() 

          const entryDate = new Date(start)
          
          // Logic: 06:00 start (per request), 24:00 end (18 hours)
          // Calc base time (06:00 of the entry day)
          const baseDate = new Date(entryDate)
          if (baseDate.getHours() < 5) baseDate.setDate(baseDate.getDate() - 1)
          baseDate.setHours(6, 0, 0, 0)
          const baseTime = baseDate.getTime()
          
          // 18 hours duration (6:00 to 24:00)
          const totalDuration = 18 * 60 * 60 * 1000
          
          let left = ((start - baseTime) / totalDuration) * 100
          let width = ((end - start) / totalDuration) * 100
          
          // Clamping
          if (left < 0) {
              width += left // reduce width if starting before
              left = 0
          }
          if ((left + width) > 100) width = 100 - left
          if (width < 0) width = 0 // basic safety
          
          // Add Grid lines for visual aid roughly matching header
          return h('div', { class: 'w-full h-4 bg-gray-100 dark:bg-gray-800 rounded relative overflow-hidden' }, [
              // Grid lines at 33% (12:00) and 66% (18:00)
              h('div', { class: 'absolute top-0 bottom-0 border-l border-white/50 dark:border-black/50', style: { left: '33.3%' } }),
              h('div', { class: 'absolute top-0 bottom-0 border-l border-white/50 dark:border-black/50', style: { left: '66.6%' } }),
              
              h('div', { 
                  class: 'absolute top-0 h-full bg-lime-500 rounded-sm', 
                  style: { left: `${left}%`, width: `${width}%` } 
              })
          ])
      }
  }
]

const rows = computed(() => {
  if (!members.value) return []
  return members.value.map(m => ({
    name: m.name,
    firstEntry: m.firstEntry ? new Date(m.firstEntry).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
    lastExit: m.lastExit ? new Date(m.lastExit).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
    // Pass raw timestamps for timeline rendering
    original: m 
  }))
})

// Auto refresh every minute
useIntervalFn(() => {
  refresh()
}, 60000)
</script>

<template>
  <UDashboardPanel grow>
    <template #header>
      <UDashboardNavbar title="Monitor">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton
            icon="i-lucide-rotate-cw"
            color="neutral"
            variant="ghost"
            @click="refresh"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UDashboardToolbar>
        <template #left>
            <div class="text-sm text-gray-500">
                Today's attendance (Switching at 05:00 AM)
            </div>
        </template>
      </UDashboardToolbar>

      <UTable
        :data="rows"
        :columns="columns"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      />
    </template>
  </UDashboardPanel>
</template>

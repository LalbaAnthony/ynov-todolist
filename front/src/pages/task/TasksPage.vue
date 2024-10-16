<template>
  <div>
    <SortFilter :sortItems="[
      { value: 'name-asc', label: 'Name (A-Z)' },
      { value: 'name-desc', label: 'Name (Z-A)' },
      { value: 'startAt-asc', label: 'Date (Oldest)' },
      { value: 'startAt-desc', label: 'Date (Newest)' }
    ]" />
    <Loader v-if="taskStore.tasks.loading" />
    <Grid v-else :items="taskStore.tasks.data">
      <template #item="{ item }">
        <Task :task="item" @update-done="(done) => taskStore.updateTaskDone(item.taskId, done)" />
      </template>
    </Grid>
    <Pagination :total="taskStore.tasks.pagination.total" :page="taskStore.tasks.pagination.page"
      :perPage="taskStore.tasks.pagination.perPage" @update-page="(page) => taskStore.changePage(page)" />

    <BottomActions @trigger-adjustments="console.log('trigger adjustments')" />
  </div>
</template>

<script setup>
import SortFilter from '@/components/SortFilterComponent.vue'
import Grid from '@/components/GridComponent.vue'
import Task from '@/components/task/TaskItem.vue'
import Loader from '@/components/LoaderComponent.vue'
import BottomActions from '@/components/BottomActionsComponent.vue'
import Pagination from '@/components/PaginationComponent.vue'

import { useRoute } from 'vue-router'
import { useTaskStore } from '@/stores/task'
import { onMounted, watch } from 'vue'

const route = useRoute()
const taskStore = useTaskStore()

async function loadTasks() {
  taskStore.fetchTasks({
    sort: route.query.sort ? [{
      orderBy: route.query.sort?.split('-')[0] || null,
      order: route.query.sort?.split('-')[1] || null
    }] : [
      { order: 'ASC', orderBy: 'createdAt' },
    ]
  })
}

// Fetch tasks on mount
onMounted(() => {
  loadTasks()
})

// Watch route for changes
watch(() => route.query, loadTasks)

</script>
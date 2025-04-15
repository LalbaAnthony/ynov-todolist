<template>
  <div>
    <section>
      <h2 class="text-xl font-bold">Welcome!</h2>
      <p class="py-4">Voici la meilleure application de gestion de tâches que vous n'ayez jamais vu! <br>(c'est pas
        vrai j'ai menti)</p>
    </section>

    <section v-if="taskStore?.tasks?.data?.length > 0">
      <h2 class="text-xl font-bold">Lasts tasks added</h2>
      <div class="my-4">
        <Loader v-if="taskStore.tasks.loading" />
        <Grid v-else :items="taskStore.tasks.data">
          <template #item="{ item }">
            <Task :task="item" @update-done="(done) => taskStore.updateTaskDone(item.taskId, done)" />
          </template>
        </Grid>
      </div>
    </section>
  </div>
</template>

<script setup>
import Grid from '@/components/GridComponent.vue'
import Task from '@/components/task/TaskItem.vue'
import Loader from '@/components/LoaderComponent.vue'
import { useTaskStore } from '@/stores/task'
import { onMounted } from 'vue'

const taskStore = useTaskStore()

async function loadTasks() {
  taskStore.fetchTasks({
    sort: [{ order: 'ASC', orderBy: 'createdAt' }],
    perPage: 3
  })
}

// Fetch data on mount
onMounted(() => {
  loadTasks()
})


</script>

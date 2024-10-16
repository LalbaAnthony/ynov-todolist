<template>
  <div>
    <Loader v-if="taskStore.task?.loading" />
    <div v-else>
      <!-- Title and date section -->
      <section>
        <div v-if="taskStore.task?.data?.updatedAt">
          <span class="text-gray">Updated the {{ dateToNiceDate(taskStore.task?.data?.updatedAt) }}</span>
        </div>
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <input v-model="taskStore.task.data.name" type="text" class="rounded-lg bg-dark text-light text-2xl"
            placeholder="Task title" />
          <input v-model="taskStore.task.data.done" type="checkbox" class="rounded-lg bg-dark text-light text-2xl" />
        </div>
      </section>

      <!-- Description & Category section -->
      <section>
        <textarea v-model="taskStore.task.data.description" class="w-full p-2 rounded-lg bg-gray-dark text-light"
          rows="10" placeholder="..."> </textarea>
        <div class="flex items-center justify-start ">
          <CategoryPicker :value="taskStore.task.data.categoryId"
            @update="(v) => { taskStore.task.data.category = v }" />
        </div>
      </section>

      <!-- Dates section -->
      <section>
        <div class="flex flex-wrap items-center justify-start gap-4">
          <div class="flex items-center gap-2">
            <span>From</span>
            <DatePicker class="max-w-48" :value="taskStore.task?.data?.dateStart"
              @update="(v) => { taskStore.task.data.dateStart = v }" />
          </div>
          <div class="flex items-center gap-2">
            <span>To</span>
            <DatePicker class="max-w-48" :value="taskStore.task?.data?.dateEnd"
              @update="(v) => { taskStore.task.data.dateEnd = v }" />
          </div>
        </div>
      </section>

      <!-- Actions section -->
      <section>
        <div v-if="route.params.taskId" class="gap-4 flex items-center justify-between">
          <button
            class="text-light p-2 rounded-lg cursor-pointer bg-danger hover:bg-danger-dark transition-colors duration-200"
            @click="manualDeletion()">
            <span class="mx-2 my-0.5">Delete</span>
          </button>
          <button
            class="text-light p-2 rounded-lg cursor-pointer bg-primary hover:bg-primary-dark transition-colors duration-200"
            @click="manualUpdate()">
            <span class="mx-4 my-0.5">Update</span>
          </button>
        </div>
        <div v-else class="gap-4 flex items-center justify-end">
          <button
            class="text-light p-2 rounded-lg cursor-pointer bg-primary hover:bg-primary-dark transition-colors duration-200"
            @click="manualCreation()">
            <span class="mx-4 my-0.5">Create</span>
          </button>
        </div>
      </section>
    </div>
    <BottomActions />
  </div>
</template>

<script setup>
import DatePicker from '@/components/DatePickerComponent.vue'
import Loader from '@/components/LoaderComponent.vue'
import CategoryPicker from '@/components/CategoryPickerComponent.vue'
import BottomActions from '@/components/BottomActionsComponent.vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/task'
import { notify } from '@/helpers/notif.js'
import { dateToNiceDate } from '@/helpers/functions.js'
import { ref, watch, onBeforeUnmount, onMounted } from 'vue'
import debounce from 'lodash/debounce'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

const isInitialLoad = ref(true)

function loadOrInitTask() {
  if (route.params.taskId) {
    taskStore.fetchTask(route.params.taskId)
  } else {
    taskStore.initTask()
  }
  isInitialLoad.value = false
}

function valid() {
  if (!taskStore.task.data.userId) return 'User is required, please reload the page'
  if (!taskStore.task.data.name) return 'Title is required'
  return false
}

function manualDeletion() {
  taskStore.deleteTask(taskStore.task.data.taskId)
  router.push('/events')
}

function manualCreation() {
  const error = valid()
  if (error) {
    notify(error, 'error')
  } else {
    taskStore.createTask(taskStore.task.data)
  }
}

function manualUpdate() {
  debouncedUpdate.cancel()

  const error = valid()
  if (error) {
    notify(error, 'error')
  } else {
    taskStore.updateTask(taskStore.task.data)
    router.push('/tasks')
  }
}

const debouncedUpdate = debounce(() => {
  if (route.params.taskId) {
    const error = valid()
    if (!error) {
      taskStore.updateTask(taskStore.task.data)
    }
  }
}, 3000)

onMounted(() => {
  loadOrInitTask()
})

onBeforeUnmount(() => {
  if (route.params.taskId) taskStore.updateTask(taskStore.task.data)
});

watch(() => route.params.taskId, () => {
  loadOrInitTask()
})

watch(() => taskStore.task.data,
  () => {
    if (isInitialLoad.value) return // Skip the debounce on initial load
    debouncedUpdate();
  },
  { deep: true }
);
</script>

<style scoped>
input[type="checkbox"] {
  transform: scale(1.5);
}
</style>
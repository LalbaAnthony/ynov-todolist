<template>
  <div>
    <!-- Search bar -->
    <div class="py-2 px-4">
      <form action="" @submit.prevent="loadSearch()">
        <input v-model="search" id="search" type="search" class="w-full px-4 p-2 rounded-lg bg-gray-dark text-light"
          placeholder="Search">
      </form>
    </div>

    <!-- Nb of results -->
    <div v-if="search && results.length > 0">
      <p class="text-center text-gray-light text-sm p-4 pt-8">
        {{ results.length }} {{ results.length > 1 ? 'results' : 'result' }}
      </p>
    </div>

    <!-- Results -->
    <Grid v-if="search" :items="results" :enable-no-item="!searching">
      <template #item="{ item }">
        <Result :item="item" />
      </template>
    </Grid>
  </div>
</template>

<script setup>
import { watch, onMounted, ref } from 'vue'
import debounce from 'lodash/debounce'
import { useRoute, useRouter } from 'vue-router'
import Grid from '@/components/GridComponent.vue'
import Result from '@/components/ResultItem.vue'
import { useTaskStore } from '@/stores/task'

const route = useRoute()
const router = useRouter()

const taskStore = useTaskStore()

const PER_PAGE = 2

const searching = ref(false)
const search = ref(route.query.search || '')
const results = ref([])

const loadSearch = debounce(async () => {
  if (!search.value) return

  searching.value = true

  results.value = []

  let promises = []

  // Tasks
  promises.push(async function () {
    return taskStore.fetchTasks({ search: search.value, perPage: PER_PAGE }).then(() => {
      results.value.push(...taskStore.tasks.data.map((task) => ({
        title: task.name,
        type: 'task',
        action: () => router.push(`/task/${task.taskId}`)
      })))
    })
  })

  await Promise.all(promises.map(p => p()))

  // Pages
  router.options.routes.forEach((route) => {
    if (
      route.meta &&
      route.meta.displayInSearch &&
      route.path &&
      (route.meta.title || route.meta.name) &&
      (
        (route.path && route.path.toLowerCase().includes(search.value.toLowerCase())) ||
        (route.name && route.name.toLowerCase().includes(search.value.toLowerCase())) ||
        (route.meta.name && route.meta.name.toLowerCase().includes(search.value.toLowerCase())) ||
        (route.meta.tags && route.meta.tags.includes(search.value.toLowerCase()))
      )
    ) {
      results.value.push({
        title: route.meta.title || route.name,
        type: 'page',
        action: () => router.push(route.path)
      })
    }
  })

  searching.value = false
}, 1000)

onMounted(() => {
  setTimeout(() => {
    const input = document.getElementById('search')
    input.focus()
  }, 200)
  if (route.query.search) loadSearch()
})

// Watch search for changes
watch(() => search.value, loadSearch)

</script>

<style scoped>
.btn-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 1rem;
}
</style>
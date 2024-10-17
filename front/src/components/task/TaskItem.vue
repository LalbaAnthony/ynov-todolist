<template>
  <router-link :to="{ path: `/task/${props?.task?.taskId}` }"
    class="flex flex-row justify-between border-2 border-gray rounded-[8px] bg-dark-light h-full">
    <!-- Button -->
    <div class="flex justify-center items-center p-4 bg-gray-light cursor-pointer rounded-l-[6px]"
      @click="goToEditTask()">
      <PencilSquareIcon class="size-6" />
    </div>
    <!-- Card -->
    <div class="flex-1 flex justify-between rounded-l-[6px] p-5 cursor-pointer transition-colors duration-200">
      <!-- Infos -->
      <div class="flex flex-col justify-center items-start">
        <h4 :class="['text-lg font-bold', props?.task?.done ? 'line-through' : '']">{{ props?.task?.name }}</h4>
        <p :class="['text-gray-light', props?.task?.done ? 'line-through' : '']">{{
          threeDotString(props?.task?.description) }}</p>
        <p :class="['text-gray-light', props?.task?.done ? 'line-through' : '']">The {{
          dateToNiceDate(props?.task?.createdAt) }}</p>
      </div>
      <!-- None -->
      <div class="flex flex-col justify-center items-end">
        <input @click.stop="$emit('updateDone', !checked)" type="checkbox" v-model="checked"
          class="rounded-lg bg-dark text-light text-2xl" />
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { PencilSquareIcon } from '@heroicons/vue/24/solid'
import { threeDotString } from '@/helpers/functions'
import { dateToNiceDate } from '@/helpers/functions.js'
import { useTaskStore } from '@/stores/task'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const taskStore = useTaskStore()

const checked = ref(false)

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

function goToEditTask() {
  router.push({ path: `/task/${props.task.taskId}` })
}

onMounted(() => {
  checked.value = props.task.done
})

</script>

<style scoped>
input[type="checkbox"] {
  transform: scale(1.5);
}
</style>

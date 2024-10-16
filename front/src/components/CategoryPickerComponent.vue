<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <button
        class="inline-flex w-full justify-center items-center rounded-lg px-4 py-2 text-md font-medium text-light bg-gray-dark"
        :style="category && props.enableColor ? `background-color: ${category?.color} !important;` : ''" @click.stop="show = !show">
        {{ category?.name || 'Category' }}
        <ChevronDownIcon
          :class="['ml-2 h-5 w-5 text-light transform transition-transform duration-200', show ? 'rotate-180' : '']"
          aria-hidden="true" />
      </button>
    </div>
    <TransitionRoot :show="show">
      <!-- Hide at click outside -->
      <TransitionChild v-click-outside="() => show = false" as="div" enter="transition ease-out duration-100 transform"
        enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform" leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
        class="origin-top-right absolute mt-2 w-48 rounded-lg bg-gray z-10 overflow-auto py-2">
        <div class="flex flex-col gap-2 px-4 py-2">
          <button v-for="category in categoryStore.categories.data" :key="category.categoryId"
            class="flex items-center justify-between rounded-md w-full px-2 py-1 text-light hover:bg-gray-light"
            @click="setCategory(category.categoryId)">
            <span>{{ category.name }}</span>
          </button>
        </div>
      </TransitionChild>
    </TransitionRoot>
  </Menu>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { Menu, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import vClickOutside from '@/directives/clickOutside.js'
import { useCategoryStore } from '@/stores/category'

const props = defineProps({
  value: {
    type: Number,
    required: false,
  },
  enableColor: {
    type: Boolean,
    default: false,
  },
})

const categoryStore = useCategoryStore()

const show = ref(false)
const categoryId = ref(props.value)
const category = ref({})

const emit = defineEmits(['update'])

function setCategory(id) {
  categoryId.value = id
  show.value = false
  category.value = categoryStore.categories.data.find((category) => category.categoryId === categoryId.value)
}

onMounted(() => {
  if (!categoryStore.categories.data || categoryStore.categories.data.length === 0) {
    categoryStore.fetchCategories().then(() => {
      setCategory(categoryId.value)
    })
  }
  else {
    setCategory(categoryId.value)
  }
})

watch(() => categoryId.value, () => {
  emit('update', categoryId.value)
})

</script>

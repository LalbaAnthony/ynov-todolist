<template>
  <div :class="['flex items-center gap-2 rounded-full px-3 py-1 bg-gray', props.clickable ? 'cursor-pointer' : '']">
    <NewspaperIcon v-if="props.type === 'task'" class="size-6 text-primary-light" />
    <span class="text-sm text-light">{{ props.text }}</span>
    <XMarkIcon v-if="props.deleteable" class="size-6 text-gray-light hover:text-light cursor-pointer"
      @click.stop="$emit('delete', true)" />
  </div>
</template>

<script setup>
import { NewspaperIcon } from '@heroicons/vue/24/solid'
import { XMarkIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    possibleValues: ['category', 'task'],
    default: '',
    required: false,
  },
  deleteable: {
    type: Boolean,
    default: false,
    required: false,
  },
  clickable: {
    type: Boolean,
    default: false,
    required: false,
  },
})

</script>

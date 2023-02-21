<script setup>
import defaultAvatar from '../../assets/noAvatar.svg'

const props = defineProps({
  image: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    required: false,
  },
  subtitle: {
    type: String,
    required: false,
  },
  detail: {
    type: Boolean,
    required: false,
    default: true,
  },
  worker: {
    type: Boolean,
    default: false,
  },

  action: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="flex-shrink-0 group block">
    <div class="flex items-center">
      <div>
        <img
          :class="['object-cover inline-block  rounded-full', props.worker ? 'w-16 h-16' : 'h-9 w-9']"
          :src="props.image ?? defaultAvatar"
          style="min-width: 40px; min-height: 40px"
        />
      </div>

      <slot name="detail">
        <div class="ml-3" v-if="detail">
          <p v-if="label" class="text-xs text-gray-500">{{ label }}</p>

          <slot name="title">
            <p
              :class="[props.worker ? 'text-2xl font-bold' : 'text-sm font-medium', 'text-gray-700 ', action ? 'cursor-pointer' : 'cursor-default']"
              v-if="props.title"
            >
              {{ props.title }}
            </p>
          </slot>

          <p :class="[props.worker ? 'text-sm' : 'text-xs', 'font-medium text-gray-500 ', action ? 'cursor-pointer' : 'cursor-default']" >
            <slot name="subtitle"> {{ props.subtitle }} </slot>
          </p>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue';

const props = defineProps({
  label: {
    type: String,
    required: false,
    default: '',
  },

  modelValue: {
    type: Boolean,
    default: false,
  },

  disabled: {
    type: [Boolean, String, Number],
    default: false,
  },
});
</script>

<template>
  <SwitchGroup as="div" class="flex items-center my-1">
    <Switch
        :value="props.modelValue"
        @update:modelValue="() => $emit('update:modelValue', props.disabled ? props.modelValue : !props.modelValue)"
        :class="[props.modelValue ? `bg-blue-${props?.disabled ? '400' : '600'}` : `bg-gray-${props?.disabled ? '100' : '200'}`, props.disabled ? '' : 'focus:ring-2 focus:ring-offset-2 focus:ring-blue-500']"
        class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none"
    >
      <span aria-hidden="true" :class="[props.modelValue ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200']" />
    </Switch>

    <SwitchLabel as="span" class="ml-3">
      <span class="text-sm font-medium text-gray-900"> {{ props.label }} </span>
    </SwitchLabel>
  </SwitchGroup>
</template>

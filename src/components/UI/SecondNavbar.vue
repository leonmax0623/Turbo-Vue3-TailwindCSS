<script setup>
const props = defineProps({
  title: {
    type: String,
    required: false,
  },
  items: {
    type: Array,
    required: true,
  },
});

// for prod parser
const colors = ['indigo', 'blue', 'red', 'yellow', 'green', 'purple', 'gray'];
</script>

<template>
  <div class="px-2">
    <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {{ props.title }}
    </h3>

    <div class="mt-1 space-y-1" role="group">
      <button
        v-for="(item, i) in items"
        :key="item.label"
        @click="$emit('switch', item.id)"
        :class="[
          'w-full',
          item.current ? 'bg-green-700 text-gray-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800',
          'group flex items-center px-3 py-2 text-sm leading-5 font-medium rounded-md'
        ]"
      >
        <span :class="[`bg-${colors[i % colors.length]}-500`, 'w-2.5 h-2.5 mr-2 rounded-full']" aria-hidden="true" />
        <span class="truncate">{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

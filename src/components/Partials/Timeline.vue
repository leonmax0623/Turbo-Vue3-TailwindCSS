<script setup>
import Feeds from '@/UI/Feeds.vue';
import Button from '@/UI/Button.vue';

defineEmits(['ping']);

const props = defineProps({
  timeline: {
    type: Array,
    default: [],
  },
  canStart: {
    type: Boolean,
    default: false,
  },
  canPause: {
    type: Boolean,
    default: false,
  },
  canEnd: {
    type: Boolean,
    default: false,
  }
});

const randomStr = Math.random().toString(36).substring(2, 15)

</script>

<template>
  <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6 sticky top-3">
    <h2 id="timeline-title" class="text-lg font-medium text-gray-900">Выполнено по текущему процессу</h2>

    <Feeds :items="props.timeline" class="mt-5 max-h-vh overflow-y-scroll" />

    <div class="mt-6 flex justify-center gap-3" :key="randomStr">
      <Button
        blur
        class="flex justify-center"
        color="purple"
        @click="() => $emit('ping','process')"
        v-if="props.canStart"
        :disabled="!props.canStart"
      >
        <!-- <ClockIcon class="w-5 h-5 mr-1"/> -->
        Начать
      </Button>

      <Button
        blur
        class="flex justify-center"
        @click="() => $emit('ping', 'pause')"
        color="yellow"
        v-if="props.canPause"
        :disabled="!props.canPause"
      >
        На паузу
      </Button>

      <Button
        blur
        class="flex justify-center"
        color="green"
        @click="() => $emit('ping', 'done')"
        v-if="props.canEnd"
        :disabled="!props.canEnd"
      >
        Завершить
      </Button>
    </div>
  </div>
</template>

<style scoped>
.max-h-vh {
  max-height: 50vh;
}

.max-h-vh::-webkit-scrollbar {
  display: none;
}
</style>

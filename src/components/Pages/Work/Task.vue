<script setup>
import { onScopeDispose } from 'vue';
import { ArrowLeftIcon, ClockIcon } from '@heroicons/vue/outline';
import Layout from '@/Layout/Work.vue';
import Button from '@/UI/Button.vue';
import service from '~/services/tasks/worker-preview';
import WorkerPreview from '~/components/Partials/tasks/WorkerPreview.vue';
import Timeline from '~/components/Partials/tasks/Timeline.vue';
import useSuspense from '~/composables/useSuspense';
import useAppRouter from '~/composables/useAppRouter';

const { query } = useAppRouter();
const SuspenseArea = useSuspense(WorkerPreview);
const { task, clearMemo } = service();

onScopeDispose(clearMemo);

</script>

<template>
  <Layout :title="task?.name">
    <template #actions>
      <Button v-if="query.from === 'tasks'" type="secondary" :link="{ name: 'WorkerTasks' }">
        <ArrowLeftIcon class="w-5 h-5 mr-1"/>К задачам
      </Button>
    </template>

    <div class="grid grid-cols-1 gap-6 lg:grid-flow-col-dense lg:grid-cols-6 ">
      <div class="space-y-6 lg:col-start-1 lg:col-span-4">
        <suspense-area />
      </div>

      <section aria-labelledby="timeline-title" class="lg:col-start-5 lg:col-span-2 relative">
        <Timeline
          :service="service"
        />
      </section>
    </div>
  </Layout>
</template>

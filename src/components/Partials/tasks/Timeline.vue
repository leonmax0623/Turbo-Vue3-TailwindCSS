<script setup>
import Timeline from '~/components/Partials/Timeline.vue';
import { computed } from 'vue';
import { ruMonths, tasksColorMap } from '~/helpers';
import { CheckIcon, ThumbUpIcon, UserIcon } from '@heroicons/vue/solid';

const props = defineProps({
  service: {
    type: Function,
    required: true,
  },
});

const { task, canTasks, ping } = props.service();

const EVENTS = {
  TASK_CREATED: { iconBackground: 'bg-gray-400', icon: UserIcon },
  TASK_STATUS: { iconBackground: 'bg-green-500', icon: CheckIcon },
  TASK_UPDATED: { iconBackground: 'bg-blue-500', icon: ThumbUpIcon },
};

const createContent = ({ type, status }) => {
  const r = {};
  if (type === 'task_created') { r.ev = 'TASK_CREATED'; r.content = 'Задачу поставил'; }
  if (type === 'task_updated') { r.ev = 'TASK_UPDATED'; r.content = 'Задача обновлена'; }
  if (type === 'task_status') { r.ev = 'TASK_STATUS'; r.content = `Статус изменен (${tasksColorMap[status].label})`; }
  return r;
};

const canStart = computed(() => {
  if (((task.value?.status === 'wait') || (task.value?.status === 'done') || (task.value?.status === 'pause'))) {
    // return engagedIn.value || canTasks(task.value, 'update_status');
    return canTasks(task.value, 'update_status');
  }

  return false;
});

const canPause = computed(() => {
  if ((task.value?.status === 'process') || (task.value?.status === 'wait')) {
    // return engagedIn.value || canTasks(task.value, 'update_status');
    return canTasks(task.value, 'update_status');
  }
  return false;
});

const canEnd = computed(() => {
  if ((task.value?.status === 'process') || (task.value?.status === 'pause')) {
    // return engagedIn.value || canTasks(task.value, 'update_status');
    return canTasks(task.value, 'update_status');
  }

  return false;
});

const timeline = computed(() => {
  // console.log(task?.value?.logs?.map(({ type, data, created_at }) => ({ type, details: { ...data }, created_at })));
  const v = [];

  task?.value?.logs?.forEach(({ created_at, created_user, data, type }, id) => {
    if (type === 'task_updated' && 'status' in data) return; // handel duplication from server

    const { ev, content } = createContent({ type, ...data });

    if (!ev || !content) return;

    const d = new Date(created_at.split(' ')[0]);

    const date = `${d.getDate()} ${ruMonths[d.getMonth()]} ${created_at.split(' ')[1].substr(0, 5)}`;

    //if (type === 'task_created') created_user = task.value.user;

    const dot = {
      id,
      content,
      target: `${created_user?.name ?? ''} ${created_user?.middle_name ?? ''}`,
      // target: `${created_user.name ?? ''} ${created_user.middle_name ?? ''} ${created_user.username ?? ''}`,
      date,
      datetime: created_at,
      data: { ...data },
      icon: EVENTS[ev].icon,
      iconBackground: EVENTS[ev].iconBackground,
    };

    v.push(dot);
  });

  return v;
});
</script>

<template>
  <Timeline
    :timeline="timeline"
    :canStart="canStart"
    :canPause="canPause"
    :canEnd="canEnd"
    @ping="ping"
  />
</template>

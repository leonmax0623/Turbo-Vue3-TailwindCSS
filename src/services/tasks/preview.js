import { ref, effectScope } from 'vue';
import useAppRouter from '~/composables/useAppRouter.js';
import { debounce, hyphenatedDateFormat } from '~/helpers';
import $ from '~/helpers/fetch.js';
import save from '~/helpers/save';
import useToast from '~/composables/useToast';
import { canTasks } from '~/lib/permissions';

const toaster = useToast();

// ********** Fix : Rate limiter not needed in fact debouncer is needed
/*
const last = ref(Date.now());

const notify = async () => {
  const now = Date.now();
  if (now - last.value > 5000) { // 5 seconds
    last.value = now;
    await checkBox()
  }
};
*/

let task;

export default () => effectScope().run(() => {
  const { route, back } = useAppRouter();

  if (!task) { task = ref({}); }

  const atMounted = async () => {
    const { id } = route.params;

    task.value = await $.task(id);

    if (!task.value.id) back();
  };

  const checkBox = debounce(async (_id, is_checked, i) => {
    const { success, message } = await save({ path: `tasks/checkboxes/${_id}/status`, data: { is_checked } });
    if (!success) {
      toaster.danger(message ?? 'Не удалось изменить статус флажка');
      task.value.checkboxes[i].is_checked = !is_checked;
    }
  });

  const task_id = route.params.id;

  const ping = async (status) => {
    if (status === task.value.status) {
      return;
    }

    const availableStatuses = [
      'wait',
      'process',
      'pause',
      'done',
    ]

    if(availableStatuses.indexOf(status) < 0) {
      toaster.danger(`Статус задачи не может быть ${status}`)
    }

    const path = `tasks/${task_id}/to/${status}`;
    const { success, message, data } = await save({
      path,
      data: {
        [`${status ? 'start' : 'end'}_at`]: hyphenatedDateFormat(new Date())
      }
    });
    if (success) {
      task.value = data?.task;
    }
    const msg = message ?? (success ? 'Статус успешно изменен' : 'Не удалось изменить статус задачи');
    toaster[success ? 'success' : 'danger'](msg);
  };

  return {
    canTasks,
    task,
    atMounted,
    checkBox,
    back,
    route,
    ping,
    task_id,
    clearMemo: () => { task = undefined; },
  };
});

import { effectScope, ref, reactive, computed, shallowRef } from 'vue';
import save from '~/helpers/save';
import store from '~/store/orders/orders';
import orderStagesStore from '~/store/orders/stages';
import departmentStore from '~/store/departments';
import { objectSignature } from '~/helpers';
import useToast from '~/composables/useToast';
import tasksStore from '~/store/tasks';

const toaster = useToast();

const { load, state, setOrderStage } = store;
const { current } = departmentStore;
const { state: stagesState, load: loadStages } = orderStagesStore;
const { load: loadTasks, reset, state: tasksState, getTaskById, options: taskOptions } = tasksStore;

let columns;
let filter;
let showModal;

const getKanBanPayload = () => {

  const kanban = [...stagesState.raw].map((stage) => {
    const cloned = {...stage}
    cloned.orders = []
    return cloned
  });

  state.raw.forEach((order) => {
    if (order.stage) {
      const index = kanban.findIndex(({ id }) => id === order.stage.id)

      if (index !== -1) {
        kanban[index].orders.push(order)
      }
    }
  })

  return kanban;
};

const fillColumns = () => {
  columns.value = getKanBanPayload();
};

const log = async (e, cb) => {
  const d = new Date();
  const { item: { id: order_id }, to: { id: order_stage_id } } = e;

  const target_stage = state.raw.find(({ id }) => id == order_id)?.stage?.id;
  if (target_stage == order_stage_id) return;

  const { message, success } = await save({ data: { order_stage_id }, path: `orders/${order_id}/stage` });

  if (!success) {
    toaster.danger(message ?? 'Что-то пошло не так');
    return fillColumns();
  }

  setOrderStage(order_id, stagesState.raw.find(({ id }) => id == order_stage_id));

  toaster.success('Стадия заказа успешно обновлена');

  await cb(d, order_id);
};

const atMounted = async () => {
  await Promise.all([async () => reset(), load({ ...filter, department_id: current.value }), loadStages()]).then(fillColumns);
};

export default () => effectScope().run(() => {
  if (!columns) {
    columns = ref({});
    filter = reactive({});
    showModal = shallowRef(false);
  }

  return {
    atMounted,
    columns,
    filter,
    log,
    toaster,
    current,
    tasksState,
    showModal,
    loadTasks,
    getTaskById,
    state,
    reset,
    taskOptions,
    sig: computed(() => objectSignature(filter)),
    clearMemo: () => {
      columns = undefined;
      filter = undefined;
    },
    resetFilter: () => {
      filter.client_id = '';
      filter.car_id = '';
      filter.created_before = '';
      filter.created_after = '';
    },
  };
});

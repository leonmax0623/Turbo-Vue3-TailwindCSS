import { computed, reactive, readonly } from 'vue';
import $ from '~/helpers/fetch.js';
import _$ from '~/helpers/drop';
import { userHasPermission } from '~/lib/permissions';
import useApi from '~/composables/useApi'

const { apiRequest } = useApi()

const hasCrud = userHasPermission('crud pipelines');

const state = reactive({
  raw: [],
  order_funnel: {},
  types: {},
});

const add = (v) => {
  const i = state.raw.findIndex(({ id }) => v?.id == id);
  if (i < 0) {
    state.raw.push(v);
  } else {
    state.raw[i] = v;
  }
};

const reset = () => {
  state.raw = [];
};

const load_orders_funnel = async () => {
  if (state.order_funnel.id) return state.order_funnel.id;

  // We suppose that there is only one funnel for orders
  const pipelines = await $.pipelines({ type: 'order' });

  const theFunnel = pipelines[0];

  if (theFunnel) {
    state.order_funnel = theFunnel;
    return theFunnel.id;
  }
};

const load = async (payload = {}) => {
  if (!hasCrud) return;
  state.raw = await $.pipelines(payload);
};

const loadTypes = async () => {
  state.types = (await $({ toast: true, key: 'pipelines/get-types' })).types;
};

const drop = async (id) => _$.pipeline(id, (v) => {
  state.raw.deleteById(v);
});

const funnelById = (_id) => state.raw.find(({ id }) => _id == id);

const updateOrders = async (ids) => {
  const { call } = apiRequest()

  const data = { ids }

  return await call('pipelines/orders', {
    method: 'post',
    data: data,
  })
}

export default {
  state: readonly(state),

  funnelById,

  options: computed(() => state.raw.map(({ id, name, type }) => ({ label: name, value: id, type: type }))),
  typesOptions: computed(() => Object.entries(state.types).map(([value, label]) => ({ value, label }))),

  orderFunnelOption: computed(() => [{ value: state.order_funnel?.id, label: state.order_funnel?.name }]),

  load_orders_funnel,
  load,
  reset,
  drop,
  add,
  loadTypes,
  updateOrders,
};

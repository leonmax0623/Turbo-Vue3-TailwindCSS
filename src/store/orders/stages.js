import { computed, reactive, readonly } from 'vue'
import $ from '~/helpers/fetch.js'
import _$ from '~/helpers/drop'
import { userHasAtLeastOnePermission } from '~/lib/permissions'
import useApi from '~/composables/useApi'

const { apiRequest } = useApi()

const state = reactive({ raw: [] })

const add = (v) => {
  const i = state.raw.findIndex(({ id }) => v?.id == id)
  if (i < 0) {
    state.raw.push(v)
  } else {
    state.raw[i] = v
  }
}

const reset = () => {
  state.raw = []
}

const load = async () => {
  if (userHasAtLeastOnePermission(['crud orders', 'read orders'])) {
    state.raw = await $.order_stages()
  }
}

const drop = async (id) => _$.order_stage(id, (v) => {
  state.raw.deleteById(v)
})

const updateOrders = async (ids) => {
  const { call } = apiRequest()

  const data = { ids }

  await call('order-stages/orders', {
    method: 'post',
    data: data,
  }).then(() => {
    load()
  })
}

export default {
  state: readonly(state),

  options: computed(() => state.raw.map(({ id, name }) => ({ label: name, value: id }))),

  load,
  add,
  reset,
  drop,
  updateOrders,
}

import { reactive, readonly } from 'vue'
import useApi from '~/composables/useApi'

const { apiRequest } = useApi()

const state = reactive({
  users: [],
})

const reset = () => {
  state.users = []
}

const add = async (pipeline_id, user_id) => {
  const { call } = apiRequest()

  await call('pipeline-users', {
    method: 'post',
    params: { pipeline_id, user_id },
  })

  await load(pipeline_id)
}

const remove = async (pipeline_id, user_id) => {
  const { call } = apiRequest()

  await call('pipeline-users', {
    method: 'delete',
    params: { pipeline_id, user_id },
  })

  await load(pipeline_id)
}

const load = async (pipeline_id) => {
  const { call, data } = apiRequest()

  await call('pipeline-users', {
    method: 'get',
    params: { pipeline_id },
  })

  const { users } = data.value

  state.users = users
}

export default {
  state: readonly(state),
  reset,
  load,
  add,
  remove,
}

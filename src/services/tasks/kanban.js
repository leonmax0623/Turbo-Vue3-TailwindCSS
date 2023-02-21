import { computed, effectScope, ref, watch } from 'vue'
import save from '~/helpers/save'
import pipelinesStore from '~/store/pipelines'
import pipelineUsers from '~/store/pipelines/users'
import { cleanUp, objectSignature } from '~/helpers'
import useToast from '~/composables/useToast'
import service from '~/services/tasks/worker'
import store from '~/store/tasks'

const toaster = useToast()

const {
  state: funnelsState,
  load: loadFunnels,
  options,
  funnelById,
} = pipelinesStore
const { tasksInFunnel, state, setTaskFunnelStage, reset, fill } = store

const { state: pipelineUsersState, load: loadUsers, reset: resetUsers } = pipelineUsers

const users = computed(() => pipelineUsersState.users)

let filter

const selectedFunnelStorageKey = 'SelectedFunnel'
const theSelectedFunnel = ref(localStorage.getItem(selectedFunnelStorageKey))

let columns

let getTasks

const selectedPipeline = computed(() => {
  return theSelectedFunnel.value ? options.value.find(({ value }) => parseInt(value) === parseInt(theSelectedFunnel.value)) : null
})

watch(theSelectedFunnel, (v) => {
  localStorage.setItem(selectedFunnelStorageKey, v)
  if (v) {
    loadUsers(v)
  } else {
    resetUsers()
  }
})

const getKanBanPayload = (v) => {
  // funnel as an argument

  if (!v) return {}

  const funnel = funnelById(v)

  const tasks_in_this_funnel = tasksInFunnel(v)

  const kanban = funnel?.stages.reduce((payload, curr) => {
    const { id, color, name } = curr

    const tasks = tasks_in_this_funnel.filter(({ pipelines }) => pipelines.some(
      ({ pipeline, stage }) => pipeline?.id == v && stage?.id == id,
    ))

    payload[id] = {
      tasks,
      name,
      color,
    }

    return payload
  }, {})

  return kanban
}

const fillColumns = (v) => {
  columns.value = getKanBanPayload(v)
}

const log = async (e) => {
  const { item: { id: task_id }, to: { id: stage_id } } = e

  const funnel_id = theSelectedFunnel.value

  const maybeTask = state.raw.find(({ id }) => id == task_id)

  if (!maybeTask) return fillColumns(funnel_id)

  if (maybeTask?.status === 'process') {
    toaster.warn('Вы не можете изменить этап, пока задача активна', '')
    return fillColumns(funnel_id)
  }

  // eslint-disable-next-line
  const task_stage = maybeTask?.pipelines.find(({ pipeline }) => pipeline.id == funnel_id)?.stage?.id
  // eslint-disable-next-line
  if (task_stage == stage_id) return

  const { message, success } = await save({
    data: { stage_id },
    path: `tasks/${ task_id }/pipelines/${ funnel_id }/stage`,
  })

  if (!success) {
    toaster.danger(message ?? 'Что-то пошло не так')
    return fillColumns(funnel_id)
  }

  const funnel = funnelById(funnel_id)

  const stage = funnel.stages.find(({ id }) => id == stage_id)

  setTaskFunnelStage(task_id, funnel_id, stage)

  return toaster.success('Этап изменен')
}

const atMounted = async () => {
  await getTasks(true, { pipeline_id: theSelectedFunnel.value })
  fillColumns(theSelectedFunnel.value)
}

export default () => effectScope().run(() => {
  const { filter: _filter, resetFilter } = service()

  if (!columns) {
    columns = ref({})
    filter = _filter
    getTasks = async (bool = true, payload) => {
      if (bool) reset()
      await fill({ ...cleanUp(filter), ...payload }, false)
    }
  }

  return {
    getKanBanPayload,
    atMounted,
    filter,
    log,
    users,
    columns,
    state,
    options,
    theSelectedFunnel,
    selectedPipeline,
    sig: computed(() => objectSignature(filter)),
    resetFilter,
    loadFunnels,
    clearMemo: () => {
      filter = undefined
      getTasks = undefined
      columns = undefined
    },
  }
});

<script setup>
import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'
import { ArrowLeftIcon, DotsVerticalIcon, DotsHorizontalIcon } from '@heroicons/vue/solid'
import OfficeLayout from '@/Layout/Office.vue'
import Select from '@/UI/Select.vue'
import useSuspense from '~/composables/useSuspense'
import RawKanBan from '@/Pages/Work/RawKanban.vue'
import ColumnKanBan from '@/Pages/Work/ColumnKanban.vue'
import KanbanUser from '@/Partials/kanban/User.vue'
import service from '~/services/tasks/kanban'
import departmentStore from '~/store/departments'
import Button from '@/UI/Button.vue'
import { PlusCircleIcon } from '@heroicons/vue/outline'
import DialogModal from '../../UI/DialogModal.vue'
import store from '~/store/employees'
import UserSetting from '@/Partials/kanban/UserSetting.vue'
import { userHasPermission } from '~/lib/permissions'
import useAppRouter from '~/composables/useAppRouter'

const { state: stateEmployees, count, selected, select, directory, load: loadEmployees } = store

const { current } = departmentStore

const { route } = useAppRouter()

const {
  clearMemo,
  options,
  theSelectedFunnel,
  loadFunnels,
  users,
  selectedPipeline,
} = service()

const kanBanView = ref(route?.params?.view || 'raw')

let SuspenseArea = useSuspense(kanBanView.value === 'column' ? ColumnKanBan : RawKanBan)

onScopeDispose(clearMemo)

const modalIsOpen = ref(false)

const setIsOpen = (v) => {
  modalIsOpen.value = v
}

const employees = computed(() => {
  return [...stateEmployees.employees].map((u) => {
    u = {...u}
    u.selected = !!(users.value.find(({ id }) => id === u.id))
    return u
  })
})

const hasCrud = userHasPermission('crud users');

const canManageUsers = computed(() => {
  return hasCrud && selectedPipeline.value?.type === 'task'
})

watch(current, async (v) => {
  await loadFunnels({ department_id: current.value })
  loadEmployees({ department_id: current.value })
})

watch(() => route?.params, (params) => {
  if(params?.view) {
    kanBanView.value = params.view || 'raw'
  }
})

watch(kanBanView, () => {
  SuspenseArea = useSuspense(kanBanView.value === 'column' ? ColumnKanBan : RawKanBan)
  rerenderSuspenseArea()
})

const rerenderSuspenseArea = () => {
  // We can rerender vue components when we change key of them
  const suspenseAreaCurrentKey = theSelectedFunnel.value
  theSelectedFunnel.value = null
  setTimeout(() => {
    theSelectedFunnel.value = suspenseAreaCurrentKey
  }, 0)
}

onMounted(async () => {
  if (!theSelectedFunnel.value && options.value[0] && options.value[0]?.value) {
    theSelectedFunnel.value = options.value[0]?.value
  }
})

</script>

<template>
  <OfficeLayout title="Канбан">

    <template #actions>
      <Button type="secondary" :link="{ name: 'Tasks' }">
        <ArrowLeftIcon class="w-5 h-5 mr-1"/>
        Назад
      </Button>

      <Button
        v-if="kanBanView === 'raw'"
        type="secondary"
        :link="{ name: 'KanbanView', params: { view: 'column' } }"
      >
        <DotsVerticalIcon class="w-5 h-5 mr-1"/>
        Вертикальный вид
      </Button>

      <Button
        v-if="kanBanView === 'column'"
        type="secondary"
        :link="{ name: 'KanbanView', params: { view: 'raw' } }"
      >
        <DotsHorizontalIcon class="w-5 h-5 mr-1"/>
        Горизонтальный вид
      </Button>

      <v-can ability="create tasks">
        <Button color="blue" :link="{ name: 'TaskCreate', params: { pipelineId: theSelectedFunnel } }">
          <PlusCircleIcon class="w-5 h-5 mr-1"/>
          Создать
        </Button>
      </v-can>
    </template>

    <div class="justify-between md:flex">
      <Select
        v-if="options.length"
        :options="options"
        v-model="theSelectedFunnel"
        class="max-w-sm"
      />
      <div class="flex gap-2 mb-3">
        <KanbanUser v-for="user in users" :key="user.id" :user="user"/>
        <Button v-if="canManageUsers" @click="setIsOpen(true)" type="secondary" class="h-10" circle>
          <PlusCircleIcon class="w-5 h-5"/>
        </Button>

        <DialogModal
          title="Настройка доступа к доске"
          :open="modalIsOpen"
          @close="() => modalIsOpen = false"
        >
          <template v-slot:dialog-inner>
            <div class="mt-7">
              <UserSetting
                v-for="user in employees"
                :key="user.id"
                :user="user"
                :pipelineId="theSelectedFunnel"
              />
            </div>
          </template>
        </DialogModal>

      </div>
    </div>

    <suspense-area v-if="theSelectedFunnel && options.length" :key="theSelectedFunnel"/>
  </OfficeLayout>
</template>

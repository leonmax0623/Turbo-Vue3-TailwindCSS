<script setup>
import { computed, onMounted, watch } from 'vue'
import Button from '@/UI/Button.vue'
import Wysiwyg from '@/UI/Wysiwyg.vue'
import StoFiles from '@/Partials/Files.vue'
import Input from '@/UI/Input.vue'
import Select from '@/UI/Select.vue'
import service from '~/services/tasks/form'
import { hyphenatedDateFormat, maybeRun, tasksColorMap } from '~/helpers'
import userStore from '~/store/employees'
import pipelineUserStore from '~/store/pipelines/users'
import departmentStore from '~/store/departments'
import pipelineStore from '~/store/pipelines'
import stagesStore from '~/store/pipelines/stages'
import orderStore from '~/store/orders/orders'
import useConfirmDialog from '~/composables/useConfirmDialog'
import proxiedSelect from '@/StoSelect'
import useAppRouter from '~/composables/useAppRouter.js'
import dcTemplatesStore from '~/store/processes/diagnostic-card'
import StoSelect from '@/UI/StoSelect.vue'

const { route } = useAppRouter()
const { simple } = useConfirmDialog()

const { current } = departmentStore
const { load, options: departmentUsersOptions } = userStore
const { load: loadUsers, state: userStoreState } = pipelineUserStore
const { options: orderOptions, load: loadOrders } = orderStore
const { load: loadStages, options: stagesOptions } = stagesStore
const { state, load: loadFunnels, options: pipelinesOptions } = pipelineStore
const { options: t_options, load: loadTemplates } = dcTemplatesStore

const { fields, atMounted, log, isEditPage } = service(route.query.order_id)

const statusOptions = Object.entries(tasksColorMap).map(([value, { label }]) => ({ label, value }))

watch(fields.pipelines, (v) => {
  if (v[0]?.pipeline_id) {
    loadUsers(v[0]?.pipeline_id)
  }
})

const usersOptions = computed(() => {
  const selectedPipeline = pipelinesOptions.value.find(({ value }) => value === fields.pipelines[0]?.pipeline_id)

  if (!selectedPipeline) {
    return []
  }

  if (selectedPipeline.type === 'personal') {
    return departmentUsersOptions.value
  } else {
    return userStoreState.users.map((user) => ({
      value: user.id,
      label: `${ user.name } ${ user.middle_name }`,
    }))
  }
})

const removeItem = (resource) => maybeRun((i) => resource.splice(i, 1), computed(() => resource.length > 1))
let removeCheckbox
let removeFunnel

watch(() => fields.is_map, (v) => {
    fields.checkboxes = [{ description: '' }]
  //   fields.pipelines = [{}];
  fields.temp_file_ids = []
  fields.delete_file_ids = []
  fields.files = []
  fields.description = ''
})

const StagesSelection = proxiedSelect(state, fields)

// const cannotAdd = computed(() => pipelinesOptions.value.map(({ value }) => value).length === (new Set(selectedFunnelsIds.value)).size);
// const notSelectedFunnels = computed(() => pipelinesOptions.value.filter(({ value }) => !selectedFunnelsIds.value.includes(Number(value))));

const handelBlackListedFile = (id) => {
  fields.delete_file_ids.push(id)
  fields.files.deleteById(id)
}

const taskTypeOptions = [{ label: 'Задача', value: 'false' }, { label: 'Диагностическая карта', value: 'true' }]

onMounted(async () => {
  await Promise.all([
    loadOrders({ department_id: current.value ?? '' }),
    load({ department_id: current.value ?? '' }),
    loadFunnels({ department_id: current.value }),
    loadTemplates(),
    atMounted(),
  ]).then(() => {
    removeCheckbox = removeItem(fields.checkboxes)
    removeFunnel = removeItem(fields.pipelines)

    if (route.params.pipelineId) {
      fields.pipelines[0].pipeline_id = parseInt(route.params.pipelineId)
      loadUsers(fields.pipelines[0].pipeline_id)
    }
  })
})

</script>

<template>
  <div>

    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12 sm:col-span-3">
        <sto-select
          @bottom-touched="() => {}"
          :label="`Воронка`"
          :options="pipelinesOptions"
          v-model="fields.pipelines[0].pipeline_id"
        />
      </div>

      <div class="col-span-12 sm:col-span-3">
        <StagesSelection
          :index="0"
          :pipeline_id="fields.pipelines[0].pipeline_id"
          v-model="fields.pipelines[0].stage_id"
        />
      </div>

      <div class="col-span-12 sm:col-span-3">
        <sto-select
          @bottom-touched="() => {}"
          label="Исполнитель"
          :options="usersOptions"
          v-model="fields.user_id"
          :disabled="!fields.pipelines[0]?.pipeline_id"
        />
      </div>

    </div>

    <div class="grid grid-cols-12 gap-6">

      <div class="col-span-12 sm:col-span-3">
        <Select
          :hide-text="true"
          label="Тип"
          v-model="fields.is_map"
          :options="taskTypeOptions"
        />
      </div>

      <div class="col-span-12 sm:col-span-3">
        <Input label="Название задачи" v-model="fields.name"/>
      </div>

      <div class="col-span-12 sm:col-span-3">
        <Input label="Крайний срок" type="date" v-model="fields.deadline_at" :min="hyphenatedDateFormat(new Date())"/>
      </div>

      <div class="col-span-12 sm:col-span-3">
        <sto-select
          @bottom-touched="() => {}"
          label="Заказ наряд"
          :options="orderOptions"
          v-model="fields.order_id"
          :disabled="route.query.order_id"
        />
      </div>

      <div class="col-span-12 sm:col-span-3">
        <Input label="Позиция" type="number" :step="1" v-model="fields.position"/>
      </div>

      <div class="col-span-12 sm:col-span-3" v-if="isEditPage">
        <Select label="Статус" :options="statusOptions" v-model="fields.status"/>
      </div>

      <div class="col-span-12 sm:col-span-3">
        <Input
          label="Начать с"
          type="date"
          v-model="fields.start_at"
          :min="hyphenatedDateFormat(new Date())"
        />
      </div>

      <div class="col-span-12 sm:col-span-3">
        <Input
          label="Конец в"
          type="date"
          v-model="fields.end_at"
          :min="hyphenatedDateFormat(new Date())"
        />
      </div>

      <div class="col-span-12 sm:col-span-4" v-if="fields.is_map == 'true'">
        <Select label="Шаблон диагностической карты" :options="t_options" v-model="fields.map_id"/>
      </div>

      <div class="grid grid-cols-12 gap-6 col-span-12" v-if="fields.is_map == 'false'">
        <hr class="col-span-12"/>

        <div class="col-span-12 sm:col-span-12">
          <Wysiwyg label="Текст задачи" v-model="fields.description"/>
        </div>

        <hr class="col-span-12"/>

        <div class="col-span-12 sm:col-span-12">
          <label class="block text-sm font-medium text-gray-700 mb-2">Чек лист</label>
          <ul>
            <li v-for="(c, i) in fields.checkboxes" :key="'input-'+i" class="flex items-start mb-2">
              <span class="w-5 pt-2">{{ i + 1 }}</span>
              <Input
                rows="1"
                class="flex-grow mx-2"
                placeholder="Текст задачи"
                v-model="fields.checkboxes[i].description"
              />
              <Button color="red" size="sm" @click="removeCheckbox(i)">Удалить</Button>
            </li>
          </ul>
          <Button size="xs" class="mt-4" @click="fields.checkboxes.push({ description: '' })">Добавить</Button>
        </div>

        <hr class="col-span-12"/>

        <sto-files :log="log" :files="fields.files" @file-dropped="(id) => simple(() => handelBlackListedFile(id))"/>
      </div>

    </div>
  </div>
</template>

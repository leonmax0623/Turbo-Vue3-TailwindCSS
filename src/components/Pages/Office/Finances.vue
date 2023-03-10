<script setup>
import { PlusCircleIcon, CollectionIcon, RefreshIcon, CheckCircleIcon, CurrencyDollarIcon } from '@heroicons/vue/outline';
import { ref, watch, onScopeDispose } from 'vue';
import OfficeLayout from '@/Layout/Office.vue';
import Header from '@/UI/Header.vue';
import Button from '@/UI/Button.vue';
import ButtonGroup from '@/UI/ButtonGroup.vue';
import Select from '@/UI/Select.vue';
import Input from '@/UI/Input.vue';
import Label from '@/UI/Label.vue';
import useSuspense from '~/composables/useSuspense.js';
import Table from '@/Partials/finances/Table.vue';
import form from '~/services/finances/form';
import service from '~/services/finances/index';
import { debounce, objectSignature, tasksColorMap } from '~/helpers';
import $ from '~/helpers/fetch.js';

let { render, types, typesMapper, finance_color_map, payment_types } = form();

const { filter, order, resetFilter, cleanUp, current, state } = service();

const { criteriaOptions } = order;

const SuspenseArea = useSuspense(Table);

const filterSignature = ref('');

watch(filter, debounce(() => {
  if (current.value) { filterSignature.value = objectSignature(filter); }
}), { deep: true }); // will work without deep because values are primary

const summary = ref({});

watch(() => state.raw.length, debounce(async () => {
  const data = await $({ key: 'finances/summaries' });

  summary.value = {
    balance: data?.balance || 0,
    expected: data?.expected || 0,
    expense: data?.expense || 0,
  };
}));

onScopeDispose(() => {
  types = undefined;
  typesMapper = undefined;
  payment_types = undefined;
  cleanUp();
});

</script>

<template>
    <OfficeLayout title="Финансы">
      <template #actions>
        <Button type="secondary" :link="{name: 'FinanceGroups'}">
          <CollectionIcon class="w-5 h-5 mr-1"/>Группы
        </Button>

        <Button color="blue" @click="() => render()">
          <PlusCircleIcon class="w-5 h-5 mr-1"/>Добавить операцию
        </Button>
      </template>

      <!-- Summary -->
      <Header>сводка</Header>

      <div class="flex flex-wrap items-stretch" :key="state.raw.length" >
        <div class="flex justify-start items-center rounded shadow p-4 flex-grow bg-gray-50">
          <div><CurrencyDollarIcon class="w-7 h-7 mr-4 text-gray-500" /></div>
          <div>
            <h5 class="text-gray-500 font-semibold">Баланс</h5>
            <h2 class="font-bold text-lg transactions">{{ summary?.balance ?? 0 }} &#8381;</h2>
          </div>
        </div>
        <div class="md:mx-6 flex justify-start items-center rounded shadow p-4 flex-grow bg-gray-50">
          <div><RefreshIcon class="w-7 h-7 mr-4 text-gray-500" /></div>
          <div>
            <h5 class="text-gray-500 font-semibold">Траты</h5>
            <h2 class="font-bold text-lg transactions">{{ summary?.expense ?? 0 }} &#8381;</h2>
          </div>
        </div>
        <div class="flex justify-start items-center rounded shadow p-4 flex-grow bg-gray-50">
          <div><CheckCircleIcon class="w-7 h-7 mr-4 text-gray-500" /></div>
          <div>
            <h5 class="text-gray-500 font-semibold">Ожидается</h5>
            <h2 class="font-bold text-lg transactions">{{ summary?.expected ?? 0 }} &#8381;</h2>
          </div>
        </div>
      </div>

      <!-- Filter -->
      <Header>Фильтр</Header>

      <div class="flex flex-wrap gap-2 items-start">
        <Input label="Название" v-model="filter.name"/>

        <div>
          <Label >Статус</Label>

          <ButtonGroup>
            <Button v-for="(operation_type, i) in types"
              :key="operation_type.value"
              type="secondary"
              :class="['whitespace-nowrap', filter.operation_type === operation_type.value ? `bg-${tasksColorMap[finance_color_map[operation_type.value]]?.color}-100` : '']"
              :group="i === 0 ? 'left' : (i === (types.length - 1) ? 'right' : undefined)"
              @click="filter.operation_type = operation_type.value"
            >
              {{ operation_type.label }}
              <!-- <pre>{{ operation_type }}</pre> -->
            </Button>
          </ButtonGroup>
        </div>

        <Input label="Дата от" type="date" v-model="filter.start_date" />
        <Input label="Дата до" type="date" v-model="filter.end_date" />

        <div>
          <Select
            label="Сортировать"
            :options="criteriaOptions"
            v-model="filter.order"
            class="w-44"
          />
        </div>

        <div class="text-center ml-5">
          <Label>сбросить</Label>
          <Button type="secondary" class="rounded-full" @click="()=>resetFilter()">
            <RefreshIcon class="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      <suspense-area :key="`${filterSignature}-${current}`" v-if="current != null" />

    </OfficeLayout>
</template>

<style scoped>
.transactions{
  min-width: 150px;
}

</style>

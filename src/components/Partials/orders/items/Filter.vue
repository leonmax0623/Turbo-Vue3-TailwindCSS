<script setup>
import { RefreshIcon } from '@heroicons/vue/outline';
import { onMounted, watch } from 'vue';
import Input from '@/UI/Input.vue';
import Button from '@/UI/Button.vue';
// import Select from '@/UI/Select.vue';
import StoSelect from '@/UI/StoSelect.vue';
import service from '~/services/orders';
import clientStore from '~/store/clients';
import carStore from '~/store/cars/cars';
import { hyphenatedDateFormat } from '~/helpers';

const { options, fill, reset: resetClients } = clientStore;
const { options: carOptions, fill: loadCars, reset } = carStore;

const { filter, current, resetFilter } = service();

watch(current, (department_id) => { resetClients(); fill({ department_id }); }, { immediate: true });

onMounted(async () => {
  reset();
  await loadCars();
});

</script>

<template>
    <!-- Filter -->
    <div class="flex flex-wrap gap-2 items-start" v-if="filter">

      <Input label="Дата от" type="date" v-model="filter.created_after" :max="hyphenatedDateFormat(new Date())" />
      <Input label="Дата до" type="date" v-model="filter.created_before" :max="hyphenatedDateFormat(new Date())" />

      <div class="w-full user">
        <sto-select
          label="Клиент"
          v-model="filter.client_id"
          :options="options"
          class="w-full"
          @bottom-touched="() => fill({ department_id: current })"
          search
        />
      </div>

      <div class="w-full user">
        <sto-select
          label="Автомобиль"
          v-model="filter.car_id"
          :options="carOptions"
          class="w-full"
          @bottom-touched="() => loadCars()"
          search
        />
      </div>

      <div class="text-center ml-3 flex flex-col items-center">
        <Label>сбросить</Label>
        <Button type="secondary" class="rounded-full" @click="()=>resetFilter()">
          <RefreshIcon class="h-4 w-4 text-gray-600" />
        </Button>
      </div>

    </div>
</template>

<style>
.user { max-width: 300px; }
</style>

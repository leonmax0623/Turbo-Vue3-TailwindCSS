<script setup>
import { computed, watch } from 'vue';
import Input from '@/UI/Input.vue';
import Select from '@/UI/Select.vue';
import TextArea from '@/UI/TextArea.vue';
import store from '~/store/storage/products';
import storageStore from '~/store/storage';
import storageRequestsStore from '~/store/orders/storage-requests';
import departmentStore from '~/store/departments';
import service from '~/services/orders/storage-requests';
import StoSelect from '@/UI/StoSelect.vue';
import { tasksColorMap } from '~/helpers';

const { items, atMounted, products_request } = service();
const { current } = departmentStore;
const { load, options, findProduct } = store;
const { load: loadStorages, options: storageOptions } = storageStore;
const { loadStatuses, state } = storageRequestsStore;

let statusOptions;

await Promise.all([loadStorages({ department_id: current.value }), loadStatuses(), atMounted()]).then(()=>{
  statusOptions = state.statuses.map((value) => ({ label: tasksColorMap[value].label, value }));
})

// await Promise.all([load({ storage_id: products_request.storage_id }), loadStorages({ department_id: current.value }), atMounted()]);

// const statusOptions = Object.entries(tasksColorMap).map(([value, { label }]) => ({ label, value }));

watch(() => products_request.storage_id, async (storage_id) => { await load({ storage_id }); });

const selectedProduct = computed(() => findProduct(products_request.product_id))

watch(selectedProduct, (v) => { products_request.sum = v?.output_sum });

</script>

<template>
    <div>
        <Select
          label="Склад"
          :options="storageOptions"
          :required="true"
          v-model="products_request.storage_id"
          class="mb-3 sm:col-span-6 col-span-12"
        />

        <sto-select
          :disabled="!products_request.storage_id"
          label="Товар"
          :search="true"
          :options="options"
          :required="true"
          v-model="products_request.product_id"
          class="mb-3 sm:col-span-6 col-span-12"
          @bottom-touched="() => fill({ client_id: fields.client_id })"
        />

        <Input
          :disabled="!products_request.product_id"
          label="Цена продажи"
          type="number"
          :required="true"
          v-model="products_request.sum"
          class="mb-3 sm:col-span-6 col-span-12"
        />


        <Input
          label="Количество"
          type="number"
          :required="true"
          v-model="products_request.count"
          class="mb-3 sm:col-span-6 col-span-12"
        />

        <Select
          label="Статус"
          :options="statusOptions"
          :required="true"
          v-model="products_request.status"
          class="mb-3 sm:col-span-6 col-span-12"
        />

        <!--
          <TextArea
            label="Комментарий"
            :required="true"
            v-model="products_request.comment"
            class="mb-3 sm:col-span-6 col-span-12"
          />
        -->

    </div>
</template>

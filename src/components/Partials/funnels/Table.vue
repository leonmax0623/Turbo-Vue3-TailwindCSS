<script setup>
import { watch } from 'vue';
import Link from '@/UI/Link.vue';
import useConfirmDialog from '~/composables/useConfirmDialog.js';
import store from '~/store/pipelines/index';
import Table from '@/Layout/TableDraggable.vue';
import form from '~/services/funnels';
import departmentStore from '~/store/departments';

const { current } = departmentStore;

const fields = [
  { label: 'Название', key: 'name' },
  { label: 'Дата создания', key: 'created_at' },
];

const { drop } = useConfirmDialog();

const { render } = form();

const { state, load, drop: dropFunnel, updateOrders } = store;

watch(current, (v) => {
  if (v) {
    load({ department_id: v })
  }
})

load({ department_id: current.value })

const onMoved = async (e) => {
  await updateOrders(e).then(() => {
    load({ department_id: current.value })
  })
}
</script>

<template>
    <Table
        :fields="fields"
        :items="state.raw"
        @delete="(id) => drop(() => dropFunnel(id))"
        @edit="(id) => render(id)"
        @moved="onMoved"
    >
        <!-- Body -->
        <template #td-name="{ value, item: {id} }" >
            <Link :href="{name: 'Stages', params: { id }}" >{{ value }}</Link>
        </template>

        <template #td-created_at="{ value }" >
            {{ value?.split(' ')[0] ?? '_' }}
        </template>
        <!-- ****** -->
    </Table>
</template>

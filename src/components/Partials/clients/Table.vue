<script setup>
import { computed } from 'vue';
import Badge from '@/UI/Badge.vue';
import Link from '@/UI/Link.vue';
import useConfirmDialog from '~/composables/useConfirmDialog.js';
import store from '~/store/clients';
import service from '~/services/clients/clients';
import useIntersectionObserver from '~/composables/useIntersectionObserver';
import Table from '@/Layout/Table.vue';

const { fetchClients, edit } = service();

const { state, drop: dropClient } = store;

const { drop } = useConfirmDialog();

const fields = [
  { label: 'ФИО', key: 'name' },
  { label: 'Паспорт', key: 'passport' },
  { label: 'телефон', key: 'phones' },
  { label: 'Эл. адрес', key: 'emails' },
];

const emit = defineEmits(['bottomTouched']);

const { pixel, container } = useIntersectionObserver(() => {
  emit('bottomTouched');
}, computed(() => state.raw.length > 0));

await fetchClients(true);

</script>

<template>
    <div :ref="(v)=>container = v">
        <Table
            @bottom-touched="()=>fetchClients()"
            :fields="fields"
            :items="state.raw"
            @delete="(id) => drop(() => dropClient(id))"
            @edit="(id) => edit(id)"
        >
            <!-- Body -->
            <template #td-name="{ item }" >
                <Link @click="() => edit(item.id)">{{ `${item.surname} ${item.name} ${item.middle_name ?? ''}` }} </Link>
            </template>

            <template #td-phones="{ value }" >
                {{ value[0] ?? '_' }}
            </template>
            
            <template #td-emails="{ value }" >
                {{ value[0] ?? '_' }}
            </template>
            <!-- ****** -->
        </Table>

        <pixel />
    </div>
</template>

<script setup>
import { PlusCircleIcon, ArrowLeftIcon } from '@heroicons/vue/outline';
import { onMounted, onScopeDispose, ref } from 'vue';
import OfficeLayout from '@/Layout/Office.vue';
import Button from '@/UI/Button.vue';
import Table from '@/Partials/processes/Table.vue';
import useSuspense from '~/composables/useSuspense';
import service from '~/services/processes/form';
import useAppRouter from '~/composables/useAppRouter';
import $ from '~/helpers/fetch';

const { params } = useAppRouter();

const { render, clearAppealReason } = service(params.value.why);

const SuspenseArea = useSuspense(Table);

onScopeDispose(clearAppealReason);

const appeal_reason = ref();

onMounted(async () => {
  appeal_reason.value = (await $.appeal_reason(params.value.why)).name;
});

</script>

<template>
  <OfficeLayout :title="`${appeal_reason ? `${appeal_reason} /` : ''} Рабочие процессы`">
    <template #actions>
      <Button type="secondary" :link="{name: 'Why'}">
        <ArrowLeftIcon class="w-5 h-5 mr-1"/>К причинам обращения
      </Button>

      <Button color="blue" @click="() => render()">
        <PlusCircleIcon class="w-5 h-5 mr-1"/>Создать
      </Button>
    </template>

    <!-- Table -->

    <suspense-area loadingMsg="Получение рабочих процессов..." />

  </OfficeLayout>
</template>

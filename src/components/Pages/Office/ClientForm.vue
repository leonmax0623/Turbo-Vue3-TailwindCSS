<script setup>
import {
  CheckIcon,
  ArrowLeftIcon,
} from '@heroicons/vue/outline';
import OfficeLayout from '@/Layout/Office.vue';
import Button from '@/UI/Button.vue';
import ClientFormFields from '~/components/Partials/clients/ClientFormFields.vue';
import useSuspense from '~/composables/useSuspense.js';
import form from '~/services/clients/clientForm.js';

const SuspenseArea = useSuspense(ClientFormFields);

const { isEditClientPage, saveClient, redirectBack } = form(false);

</script>

<template>
  <OfficeLayout :title="isEditClientPage ? 'Обновить клиента' : 'Добавление нового клиента'">

    <template #actions>
      <Button type="secondary" @click="redirectBack" >
        <ArrowLeftIcon class="w-5 h-5 mr-1"/>Вернуться
      </Button>

      <Button color="green" @click="saveClient">
        <CheckIcon class="w-5 h-5 mr-1"/>Сохранить
      </Button>
    </template>

    <suspense-area>
      <client-form-fields :inModal="false" />
    </suspense-area>

  </OfficeLayout>
</template>

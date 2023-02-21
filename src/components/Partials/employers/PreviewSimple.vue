<script setup>
import LPreview from '@/Layout/users/Preview.vue'
import { DescriptionListItem } from '@/UI/DescriptionList'
import useConfirmDialog from '~/composables/useConfirmDialog.js'
import store from '~/store/employees'
import Template from '@/Partials/orders/form/Raw/Template.vue'

const { drop } = useConfirmDialog()

const { selectedUser } = store

</script>

<template>
  <l-preview
    :phone="selectedUser.phone"
    :avatar="selectedUser.avatar"
    :full_name="`${selectedUser.middle_name} ${selectedUser.name} ${selectedUser.surname ?? ''}`"
  >
    <template #description-list>
      <DescriptionListItem label="Телефон" :value="selectedUser.phone" type="columns"/>
      <DescriptionListItem label="Почта" :value="selectedUser.email" type="columns"/>
      <DescriptionListItem label="Филиал" :value="selectedUser.department?.name" type="columns"/>
      <DescriptionListItem label="Должность" :value="selectedUser.office_position" type="columns"/>
      <v-can ability="crud users" :orIf="!selectedUser.is_born_at_visible">
        <DescriptionListItem label="Дата рождения" :value="selectedUser.born_at" type="columns" />
      </v-can>
      <v-can ability="crud users" :orIf="!selectedUser.is_about_visible">
        <DescriptionListItem label="О сотруднике" type="columns" columns="2" :value="selectedUser.about" />
      </v-can>
    </template>
  </l-preview>
</template>

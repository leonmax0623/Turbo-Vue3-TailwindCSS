<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { UserGroupIcon } from '@heroicons/vue/solid'
import { PlusCircleIcon } from '@heroicons/vue/outline'
import { debounce } from '~/helpers'
import OfficeLayout from '@/Layout/Office.vue'
import Button from '@/UI/Button.vue'
import StackedListWithHeadings from '@/UI/StackedListWithHeadings.vue'
import EmployerPreview from '@/Partials/employers/Preview.vue'
import employers from '~/services/employers/employers.js'
import UEmployers from '@/Layout/users/Users.vue'
import store from '~/store/employees.js'
import useAppRouter from '~/composables/useAppRouter'

const { route, router } = useAppRouter()

const { state, count, selected, select, directory, canRead } = store

const { order, fetchEmployers } = employers()

const EmployersFilter = order.comp()

const headingMessage = computed(() => {
  if (count.value > 1) return `Искать среди ${ count.value } сотрудников`
  if (count.value === 1) return 'Oдин пользователь!'
  return 'нет пользователей!'
})

onMounted(async () => {
  if (!canRead) {
    return await router.push(`/`)
  }

  if (route.params.id) {
    select(route.params.id)
  }
})

const selectUser = async (id) => {
  await router.push(`/employers/${ id }`)
  select(route.params.id)
}

const search = ref('')

watch(search, debounce(fetchEmployers), { /* 'immediate: true' <- we can't use immediate because of debounce it little slow */ })

</script>

<template>
  <OfficeLayout title="Сотрудники" main-classes="flex flex-col min-w-0 flex-1 md:overflow-hidden overflow-auto">
    <template #actions>
      <v-can ability="crud roles">
        <Button type="secondary" :link="{name: 'Roles'}">
          <UserGroupIcon class="w-5 h-5 mr-1"/>
          Роли
        </Button>
      </v-can>

      <v-can ability="crud users">
        <Button color="blue" :link="{name: 'EmployerForm'}">
          <PlusCircleIcon class="w-5 h-5 mr-1"/>
          Создать
        </Button>
      </v-can>
    </template>

    <template #content>

      <u-employers
        @toggle-filter="order.active.value = count > 1 && !order.active.value"
        selectText="Выберите сотрудника"
        :loading="state.loading"
        :message="headingMessage"
        :selected="selected"
        v-model="search"
      >

        <template #filter>
          <employers-filter/>
        </template>

        <template #list>
          <StackedListWithHeadings
            class="flex-1 min-h-0 overflow-y-auto"
            :items="directory"
            @select="selectUser"
            :key="order.key.value"
            :selected="state.selectedId"
          />
        </template>

        <template #preview>
          <employer-preview/>
        </template>

      </u-employers>
    </template>
  </OfficeLayout>
</template>

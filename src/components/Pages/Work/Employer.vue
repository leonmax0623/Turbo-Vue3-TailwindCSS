<script setup>
import { onMounted } from 'vue'
import EmployerPreview from '@/Partials/employers/PreviewSimple.vue'
import employers from '~/services/employers/employers.js'
import store from '~/store/employees.js'
import useAppRouter from '~/composables/useAppRouter'
import Layout from '@/Layout/Work.vue'
import Card from '@/UI/Card.vue'

const { route, router } = useAppRouter()

const { state, count, selected, select, directory, canRead } = store

const { order } = employers()
onMounted(async () => {
  if (!canRead) {
    return await router.push(`/`)
  }

  select(route.params.id)
})
</script>

<template>
  <Layout title="Профиль сотрудника" main-classes="flex flex-col min-w-0 flex-1 md:overflow-hidden overflow-auto">
    <Card css_style="p-0">
      <template #inner>
        <employer-preview/>
      </template>
    </Card>
  </Layout>
</template>

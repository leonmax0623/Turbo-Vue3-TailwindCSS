<script setup>
import Toggle from '@/UI/Toggle.vue'
import service from '~/services/roles/roleForm.js'
import useToast from '~/composables/useToast'
import StoSelect from '@/UI/StoSelect.vue'

const { warn } = useToast()

const { rawRolePermissions, permissions, atMountedRoleForm, role, permissionsByGroup, groupedPermissions } = service()

await atMountedRoleForm()

const isDisabled = ({ id }) => {
  if (role.name === 'admin') return true

  if (id === 'crud orders') {
    const grouped = Object.values(groupedPermissions.value);
    return !permissions.value['read department tasks']
      && !permissions.value['read department own tasks']
      && !grouped.includes('read department tasks')
      && !grouped.includes('read department own tasks')
  }

  return false
}

const foo = (state, { id }) => {
  if (id === 'read department tasks' && !state) {
    if (permissions.value['crud orders']) {
      permissions.value['crud orders'] = false
    }
  }

  if (id === 'crud orders') {
    const grouped = Object.values(groupedPermissions.value);
    if (!permissions.value['read department tasks']
      && !permissions.value['read department own tasks']
      && !grouped.includes('read department tasks')
      && !grouped.includes('read department own tasks')) {
      warn(" Для включения, необходимо добавить просмотр задач своего филиала", '')
    }
  }
}

</script>

<template>
  <div class="col-span-12 sm:col-span-12 divide-y">
    <div v-for="(field, i) in rawRolePermissions" :key="i" class="my-6">
      <div class="my-3">{{ field.title }}</div>
      <div class="grid auto-rows-max grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pl-16">
        <sto-select
          v-if="field.groups" v-for="(group, key) in field.groups" :key="group"
          @bottom-touched="() => {}"
          :placeholder="group.title"
          :options="permissionsByGroup(field.permissions, group)"
          v-model="groupedPermissions[key]"
          type-value="string"
        />
        <div
          v-for="perm in field.permissions.filter((p) => !p.group)"
          :key="`${perm.id}-${permissions[perm.id] ? 'on' : 'off'}`"
        >
          <Toggle
            :label="perm.title"
            :disabled="isDisabled(perm)"
            v-model="permissions[perm.id]"
            @update:modelValue="e => foo(e, perm)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

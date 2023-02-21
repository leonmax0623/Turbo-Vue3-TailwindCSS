import { computed, effectScope, reactive, ref, shallowRef, watch } from 'vue'
import useVuelidate from '@vuelidate/core'
import { helpers, minLength, required } from '@vuelidate/validators'
import useAppRouter from '~/composables/useAppRouter.js'
import useToggles from '~/composables/useToggles.js'
import $ from '~/helpers/fetch.js'
import save from '~/helpers/save'
import useAuth from '~/composables/useAuth'

let rawRolePermissions
let role
let groupedPermissions = ref({})

const { userRole, user } = useAuth()

const permissionsByGroup = (permissions, group) => {
  return permissions
    .filter((p) => group.permissions.includes(p.id))
    .map(({ id, title }) => ({ value: id, label: title }))
}

/* ************ Role Raw Permissions ************ */
const fetchRawRolePermissions = async () => {
  const arr = await $.permissions()

  rawRolePermissions.value = arr.sort((a, b) => b.permissions?.length - a.permissions?.length)
}

export default () => effectScope().run(() => {
  const { route, isThePage, redirectTo, router } = useAppRouter('EditRole')

  const { toggles: permissions, setToggles, truthyTogglesArray } = useToggles()

  const setRoleForm = async (payload) => {
    role.name = payload?.name
    role.title = payload?.title
    role.id = payload?.id

    setToggles(payload?.permissions, true, 'name')
  }

  const atMountedRoleForm = async () => {
    const payload = (isThePage.value && route.params.id) && await $.role(route.params.id)

    await setRoleForm(payload || {})

    await fetchRawRolePermissions()
  }

  if (!role) {
    role = reactive({
      id: '',
      title: '',
      name: '',
    })

    rawRolePermissions = shallowRef([])
  }

  /* ************ Role[Title + Permissions] (create & update) ************ */

  const rules = computed(() => ({
    title: {
      required: helpers.withMessage('Укажите Название', required),
      minLength: helpers.withMessage('не менее 5 символов', minLength(5)),
    },
  }))

  const v$ = useVuelidate(rules, role, { $lazy: true })

  watch(rawRolePermissions, (allPermissions) => {
    Object.entries(permissions.value).forEach((permission) => {
      const permissionCode = permission[0]
      if (permission[1]) {
        for (let i in allPermissions) {
          if (!allPermissions[i].groups) {
            continue
          }
          for (let key in allPermissions[i].groups) {
            if (allPermissions[i].groups[key].permissions.includes(permissionCode)) {
              groupedPermissions.value[key] = permissionCode

              allPermissions[i].groups[key].permissions.forEach((key) => {
                delete permissions.value[key]
              })

              break
            }
          }
        }
      }
    })
  })

  const saveRole = async () => {
    const isValideRoleName = await v$.value.$validate()

    if (!isValideRoleName) return

    v$.value.$reset()

    const permissions = [...truthyTogglesArray.value, ...Object.values(groupedPermissions.value)]

    const { success } = await save.role({ ...role, permissions }, null, true)

    if (isThePage.value && userRole.value.id == role.id) {
      // router.go({ name: 'Roles' });
      window.location = '/roles'
    } else {
      success && await redirectTo({ name: 'Roles' })
    }

    return success
  }

  return {
    isEditRolePage: isThePage,
    v$,
    saveRole,
    setRoleForm,
    permissions,
    rawRolePermissions,
    fetchRawRolePermissions,
    role,
    atMountedRoleForm,
    permissionsByGroup,
    groupedPermissions,
  }
});

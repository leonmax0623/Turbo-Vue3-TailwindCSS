<script setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { Float } from '@headlessui-float/vue'
import { userHasAtLeastOnePermission } from '~/lib/permissions'
import useAppRouter from '~/composables/useAppRouter'
import defaultAvatar from '../../../assets/noAvatar.svg'

const { route } = useAppRouter()

const canViewProfile = userHasAtLeastOnePermission(['read users', 'crud users'])

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const isWorker = route.path.startsWith('/w/')

const profileUrl = isWorker ?  `/w/employers/${props.user?.id}` : `/employers/${props.user?.id}`

</script>

<template>
  <Popover>
    <Float
      placement="bottom-start"
      :offset="5"
      :shift="6"
      :flip="10"
      arrow
      portal
      enter="transition duration-200 ease-out"
      enter-from="opacity-0 -translate-y-1"
      enter-to="opacity-100 translate-y-0"
      leave="transition duration-150 ease-in"
      leave-from="opacity-100 translate-y-0"
      leave-to="opacity-0 -translate-y-1"
    >
      <PopoverButton class="w-10">
        <img
          class="object-cover inline-block w-10 h-10 rounded-full"
          :src="user?.avatar ?? defaultAvatar"
          :title="`${user?.name} ${user?.middle_name}`"
        />
      </PopoverButton>
      <PopoverPanel
        class="w-72 bg-white rounded shadow-lg focus:outline-none"
      >
        <div class="relative h-full bg-white text-rose-500 rounded-md">
          <div class="h-20 bg-blue-600 relative rounded-t">
            <img
              v-if="user?.id"
              class="w-20 h-20 rounded-full absolute top-6 left-4 object-cover inline-block"
              :src="user?.avatar ?? defaultAvatar"
              :title="`${user?.name} ${user?.middle_name}`"
            />
            <div class="pl-28 pb-1 absolute bottom-0 text-white leading-4">
              <p class="font-medium">{{ user?.name }} {{ user?.middle_name }}</p>
              <p class="text-sm">{{ user?.office_position }}</p>
            </div>
          </div>
          <div class="pt-10">
            <router-link
              v-if="canViewProfile"
              :to="profileUrl"
              class="block text-sm hover:bg-gray-100 px-3 py-3"
            >Перейти в профиль
            </router-link>
          </div>
        </div>
      </PopoverPanel>
    </Float>
  </Popover>
</template>

<style scoped>

</style>

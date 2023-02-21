<script setup>
import { PhoneIcon } from '@heroicons/vue/solid'
import Button from '@/UI/Button.vue'
import { DescriptionList, DescriptionListItems } from '@/UI/DescriptionList'

defineProps({
  phone: {
    type: String,
  },

  avatar: {
    type: String,
    default: '',
  },

  full_name: {
    type: String,
    default: 'Full name',
  },
})

</script>

<template>
  <div class="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
    <!-- Profile header -->
    <article>
      <div class="border-b border-gray-200 px-4 sm:px-6 py-3 lg:flex-row flex-col gap-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center items-end">
          <img
            v-if="avatar"
            class="w-32 h-32 rounded-full mr-4 bg-center bg-no-repeat bg-cover shadow-sm object-cover inline-block"
            :src="avatar"
          />
          <h1 class="text-2xl font-bold mr-4">{{ full_name ?? '' }}</h1>
          </div>
          <Button type="secondary" size="sm">
            <a :href="`tel:${phone ?? ''}`" class="flex items-center">
              <PhoneIcon class="h-5 w-5 text-gray-400"/>
              <span class="ml-2 hidden md:block">Позвонить</span>
            </a>
          </Button>
        </div>


      </div>

      <!-- Description list -->
      <DescriptionList :bordered="false" class="mt-5 mb-10" type="columns">
        <DescriptionListItems type="columns">
          <slot name="description-list"></slot>
        </DescriptionListItems>
      </DescriptionList>

      <!-- Actions -->
      <slot name="actions"></slot>
    </article>
  </div>
</template>

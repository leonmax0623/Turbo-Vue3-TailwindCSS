<script setup>
import { ref, watch } from 'vue'
import Avatar from '../../UI/Avatar.vue'
import Toggle from '../../UI/Toggle.vue'
import pipelineUsers from '~/store/pipelines/users'

const { add, remove } = pipelineUsers

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  pipelineId: {
    type: Number,
    required: true,
  },
})

const selected = ref(props.user.selected)

watch(selected, (v) => {
  if (v) {
    add(props.pipelineId, props.user.id)
  } else {
    remove(props.pipelineId, props.user.id)
  }
})

</script>

<template>
  <div class="flex mb-3 justify-between">
    <Avatar
      :image="user.avatar"
      :subtitle="user.office_position"
      :title="`${user.name} ${user.middle_name}`"
    />
    <Toggle v-model="selected"/>
  </div>
</template>

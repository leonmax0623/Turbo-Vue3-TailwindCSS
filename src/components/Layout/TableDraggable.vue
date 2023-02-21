<script setup>
import { DotsHorizontalIcon, PencilIcon, XIcon } from '@heroicons/vue/outline'
import { MenuButton } from '@headlessui/vue'
import { computed, ref, watchEffect } from 'vue'
import Button from '@/UI/Button.vue'
import Dropdown from '@/UI/Dropdown.vue'
import { Table, Td, Th, THead, Tr } from '@/UI/Table'
import useIntersectionObserver from '~/composables/useIntersectionObserver'
import Draggable from 'vuedraggable'

const props = defineProps({
  fields: {
    type: Array,
    default: [],
  },

  items: {
    type: Array,
    default: [],
  },

  actions: {
    type: Boolean,
    default: true,
  },

  last: {
    type: Boolean,
    default: false,
  },

  noDelete: {
    type: Function,
    default: () => false,
  },

  noEdit: {
    type: Function,
    default: () => false,
  },
})

const emit = defineEmits(['delete', 'edit', 'bottomTouched', 'moved'])

const { pixel, container } = useIntersectionObserver(() => {
  emit('bottomTouched')
}, computed(() => props.items.length > 0))

const noActions = (item) => props.noDelete(item) && props.noEdit(item)

const onEnd = () => {
  emit('moved', items.value.map((item) => item.id))
}

const items = ref([...props.items])

watchEffect(() => {
  items.value = [...props.items]
})

</script>

<template>
  <div :ref="(v)=>container = v">
    <Table :class="[$attrs.class, 'mt-5']">
      <THead>
      <Tr>
        <Th v-for="field in props.fields" :key="field.key">
          <slot :name="`th-${field.key}`" :label="field.label" :field="field"> {{ field.label }}</slot>
        </Th>

        <Th v-if="props.actions" class="text-center">Действия</Th>
      </Tr>
      </THead>
      <Draggable v-model="items" tag="tbody" item-key="id" @end="onEnd">
        <template #item="{element, index}">
          <Tr :class="(index & 1) ? 'bg-white' : 'bg-gray-100'">
            <Td v-for="field in props.fields" :key="`${field.key}-${index}`">
              <slot
                :name="`td-${field?.key}`"
                :value="element[field?.key]"
                :item="element"
                :index="index"
              >
                {{ element[field.key] }}
              </slot>
            </Td>

            <Td v-if="props.actions" class="text-center py-5">
              <Dropdown
                v-if="!noActions(element)"
                direction="right"
                position="center"
                :items="[[
                                  { label: 'Изменить', click: () => $emit('edit', element.id, element), icon: PencilIcon, hide: props.noEdit(element) },
                                  { label: 'Удалить', click: () => $emit('delete', element.id, element), icon: XIcon, hide: props.noDelete(element) },
                              ]]"
              >
                <MenuButton>
                  <Button type="secondary" :circle="true">
                    <DotsHorizontalIcon class="w-4 h-4"/>
                  </Button>
                </MenuButton>
              </Dropdown>
            </Td>
          </Tr>
        </template>
      </Draggable>
      <Tr :class="(props.items.length & 1) ? 'bg-white' : 'bg-gray-100'" v-if="props.last">
        <Td v-for="field in props.fields" :key="`las-${field.key}-${i}`">
          <slot :name="`td-last-${field.key}`" :items="items"></slot>
        </Td>
        <Td v-if="props.actions" class="text-center py-5"></Td>
      </Tr>
    </Table>
    <pixel/>
  </div>
</template>

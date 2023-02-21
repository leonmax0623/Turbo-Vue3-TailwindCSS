<script setup>
import { ref } from 'vue';
import Draggable from "vuedraggable"
import Badge from "@/UI/Badge.vue"
import Link from "@/UI/Link.vue"
import MemberAvatar from "@/Partials/MemberAvatar.vue"
import service from "~/services/tasks/kanban"
import { generateShapedIdfromId, tasksColorMap } from "~/helpers"
import { canTasks, userHasAtLeastOnePermission } from "~/lib/permissions"
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/solid'

const { log, atMounted, state, columns } = service()

await atMounted()

const canDragAndDrop = userHasAtLeastOnePermission([
  "update stage tasks",
  "update department stage tasks",
  "update own stage tasks",
])

let timer

const clearTimer = () => {
  if (timer != null) {
    clearInterval(timer)
    timer = undefined
  }
}

const kanbanRef = ref()
const show = ref(0)

const scrollTo = (direction = 'right') => {
  const right = direction === 'right'
  clearTimer()
  timer = setInterval(() => {
    let target = kanbanRef.value ?? document.getElementById('tasks-kanban')
    let step = 70
    let left = right ? target.scrollLeft + step : target.scrollLeft - step

    requestAnimationFrame(() => {
      target.scroll({
        left,
        behavior: 'smooth',
      })
    })
  }, 60)
}

const onScrollKanbanWrapper = () => {
  let target = kanbanRef.value ?? document.getElementById('tasks-kanban')
  if (target.scrollLeft === 0) {
    clearTimer()
    show.value = 0
    return
  }

  if (target.scrollLeft + target.clientWidth >= target.scrollWidth - 1) {
    clearTimer()
    show.value = 1
    return
  }

  show.value = 2
}

const canDrag = (task) => {
  return canTasks(task, "update_stage")
}
</script>

<template>
  <div class="mb-16 relative">
    <div
      @scroll="() => onScrollKanbanWrapper()"
      id="tasks-kanban"
      :ref="el => kanbanRef = el"
      class="flex gap-5 items-stretch overflow-x-scroll pb-5"
    >
      <div
        v-for="[id, { name, color }] in Object.entries(columns)"
        :key="id"
        class="rounded-lg p-3 stage overflow-y-scroll no-scrol-scroll-thum"
        :style="{ background: color }"
      >
        <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">
          {{ name }}
        </p>
        <Draggable
          item-key="id"
          v-model="columns[id].tasks"
          group="tasks"
          ghost-class="ghost"
          class="tasks-container"
          :id="id"
          @end="log"
          :disabled="/* !userHasPermission('update tasks') */ !canDragAndDrop"
          draggable=".draggable"
        >
          <template #item="{ element }">
            <div
              class="bg-white shadow rounded px-3 pt-3 my-2 pb-5 border w-full"
              :class="{'draggable': canDrag(element)}"
              :key="element.id"
              :id="element.id"
            >
              <div class="flex justify-between">
                <div>
                  <Link
                    :disabled="!canDrag(element)"
                    class="font-semibold font-sans tracking-wide text-sm"
                    :href="{
                      name: 'Task',
                      params: { id: element.id }
                    }"
                  >
                    {{ element.name }}
                  </Link>
                </div>
                <MemberAvatar v-if="element.user" :user="element.user" />
              </div>

              <div class="mb-2" v-if="element.order?.id">
                <span
                  class="text-sm text-gray-600"
                >Заказ-наряд #{{
                    generateShapedIdfromId(element.order?.id)
                  }}</span
                >
              </div>

              <div v-if="element?.order?.car?.car_model">
                <Badge color="blue" :point="true">
                  {{
                    `${ element?.order?.car?.car_model?.car_mark?.name ?? "" } ${
                      element?.order?.car?.car_model?.name ?? "_"
                    }`
                  }}
                </Badge>
              </div>

              <div class="flex mt-2 justify-between items-center">
                <span class="text-sm text-gray-600">{{
                    element.created_at.split(" ")[0]
                  }}</span>
                <Badge
                  :point="true"
                  :color="tasksColorMap[element.status].color"
                >{{ tasksColorMap[element.status].label }}
                </Badge
                >
              </div>
            </div>
          </template>
        </Draggable>
      </div>
    </div>

    <div class="overflow-hidden overlay absolute my-auto z-50 right-0 left-0 bottom-0 top-0 flex items-center opacity-30">
      <Transition tag="div" name="slide-fade-left">
        <span
          v-if="show !== 0"
          @mouseenter.prevent="() => scrollTo('left')"
          @mouseleave="clearTimer"
          class="chevron chevron-left bg-gray-900 opacity-75 py-5 rounded-r-full top-1/4 left-0 flex items-center"
        >
          <ChevronLeftIcon class="text-white w-16"/>
        </span>
      </Transition>

      <Transition tag="div" name="slide-fade-right">
        <span
          v-if="show !== 1"
          @mouseenter="() => scrollTo('right')"
          @mouseleave="clearTimer"
          class="ml-auto chevron chevron-right bg-gray-900 opacity-75 py-5 rounded-l-full top-1/4 right-0 flex items-center"
        >
          <ChevronRightIcon class="text-white w-16"/>
        </span>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
#tasks-kanban::-webkit-scrollbar {
  width: 1em;
  height: 1em;
}

#tasks-kanban::-webkit-scrollbar-track {
  box-shadow: none;
}

#tasks-kanban::-webkit-scrollbar-track:hover {
  box-shadow: inset 0 0 7px 3px rgba(0, 0, 0, 0.1);
}

#tasks-kanban::-webkit-scrollbar-thumb {
  background-color: darkgray;
}

#tasks-kanban::-webkit-scrollbar-thumb:hover {
  background-color: #2563EB;
}

.max-h-vw {
  max-height: 80vh;
}

.overlay {
  pointer-events: none;
}

.overlay span {
  pointer-events: all;
}

.chevron {
  min-height: 200px;
}

.stage {
  min-width: 300px;
  min-height: 300px;
  max-height: 590px;
}

.ghost {
  opacity: 0.1;
}

.tasks-container {
  height: calc(100% - 30px);
}

/* **************************************** */
.slide-fade-left-enter-active {
  transition: all .3s ease-in;
}

.slide-fade-left-leave-active {
  transition: all .3s ease-in;
}

.slide-fade-left-leave-to {
  transform: translateX(-100px);
}

.slide-fade-left-enter-from {
  transform: translateX(-100px);
}

/* Right */

.slide-fade-right-enter-active {
  transition: all .3s ease-in;
}

.slide-fade-right-leave-active {
  transition: all .3s ease-in;
}

.slide-fade-right-leave-to {
  transform: translateX(100px);
}

.slide-fade-right-enter-from {
  transform: translateX(100px);
}
</style>

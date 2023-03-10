<script setup>
import { ref, computed, onScopeDispose, watch } from 'vue';
import Link from '@/UI/Link.vue';
import Table from '@/Layout/Table.vue';
import store from '~/store/storage/products';
import Badge from '~/components/UI/Badge.vue';
import service from '~/services/storage/products';
import form from '~/services/storage/products/form';
import useIntersectionObserver from '~/composables/useIntersectionObserver';

const props = defineProps({ grid: Boolean, search: String });

const emit = defineEmits(['bottomTouched']);

const { select, reset } = store;

const { dropProduct, defaults } = form();

const { fetchProducts, redirectToForm, isThePage, products } = service();

const filteredProducts = ref([]);

watch([products, () => props.search], ([_, v]) => {
    if (v) {
        const _search = v.toLowerCase()

        filteredProducts.value = products.value.filter(({name, description}) => {
            return name.toLowerCase().includes(_search) || description.toLowerCase().includes(_search)
        })
    } else {
        filteredProducts.value = products.value;
    }

}, {immediate: true})

const { pixel, container } = useIntersectionObserver(() => emit('bottomTouched'), ref, computed(() => products?.value?.length > 0));

const fields = [
  { label: 'Название', key: 'name' },
  { label: 'Количество', key: 'count' },
  { label: 'Артикул', key: 'sku' },
  { label: 'Место', key: 'place' },
];

await fetchProducts(true);

onScopeDispose(() => reset(true));

</script>

<template>
    <div class="pt-5 pb-1 px-3 lg:px-5" :ref="v => (container = v)">

 

        <div class="flex" v-if="grid">
            <ul role="list" class="w-full grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                <li v-for="item in filteredProducts" :key="`${item.id}-${item.count}`" class="relative shadow-md">
                    <div class="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
                        <div
                            :style="`background-image: url(${item.photo ?? defaults.photo});`"
                            class="w-full h-full bg-center bg-no-repeat bg-cover shadow-sm cursor-pointer group-hover:opacity-75 transition-opacity duration-300 ease-in"
                        />
                        <button type="button" class="absolute inset-0 focus:outline-none" @click="() => select(item.id)">
                            <span class="sr-only">Посмотреть {{ item.name }}</span>
                        </button>
                    </div>

                    <div class="p-4">
                        <Badge v-if="isThePage" :point="true" color="yellow">Запрошено</Badge>
                        <div class="flex items-center justify-between flex-wrap" >
                            <p class="mb-1 mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">{{ item.name }}</p>
                            <p class="mb-1 text-sm font-medium text-gray-500 pointer-events-none" >Артикул: {{ item?.sku }}</p>
                        </div>
                        <p :key="item.count" class="mb-1 block text-sm font-medium text-gray-500 pointer-events-none">В наличии: {{ item.count }}</p>
                        <p class="mb-1 block text-sm font-medium text-gray-500 pointer-events-none">Место: {{ item.place }}</p>
                    </div>
                </li>
            </ul>
        </div>

        <Table
            v-else
            :fields="fields"
            :items="filteredProducts"
            @delete="(id) => dropProduct(id)"
            @edit="(id) => redirectToForm(id)"
        >
            <template #td-name="{ value, item: {id} }" >
                <Link @click="() => select(id)">{{ value }} </Link>
            </template>

            <template #td-count="{ value }" >
                <p>{{ value }}</p>
            </template>

            <template #td-sku="{ value }" >
                <p>{{ value }}</p>
            </template>

            <template #td-place="{ value }" >
                {{ value }}
            </template>

        </Table>

        <pixel />
    </div>
</template>

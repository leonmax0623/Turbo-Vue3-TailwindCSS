<script setup>
import service from '~/services/orders/payment';
import { generateShapedIdfromId } from '~/helpers';

const { invoice, atMounted, typesMapper } = service();

await atMounted();

</script>

<template>
    <div>
      <h3 class="flex justify-between mb-3" >
        <span>Заказ наряд: </span>
        <span>№{{ generateShapedIdfromId(invoice?.order_id) }}</span>
      </h3>
      <h3 class="flex justify-between mb-3" >
        <span>Сумма к оплате: </span>
        <span>{{ invoice?.sum }}₽</span>
      </h3>
      <h3 class="flex justify-between mb-3" >
        <span>Вид оплаты: </span>
        <span>{{ typesMapper.payments[invoice?.payment_type] ?? '_' }}</span>
      </h3>
    </div>
</template>

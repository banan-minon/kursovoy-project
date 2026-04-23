<template>
  <div class="cart-container">
    <h1>Корзина</h1>
    <div v-if="cart.items.length === 0">Ваша корзина пуста 🛒</div>

    <div v-else>
      <div v-for="item in cart.items" :key="item.id" class="cart-item">
        <div>
          <h2>{{ item.name }}</h2>
          <p>Цена: {{ item.price }} ₽</p>
          <p>Количество: {{ item.quantity }}</p>
        </div>
        <div>
          <button class="decrease" @click="decrease(item)">–</button>
          <button class="increase" @click="increase(item)">+</button>
        </div>
      </div>

      <div class="cart-total">Итого: {{ total }} ₽</div>
      <button class="checkout-btn" @click="checkout">
  Оформить заказ
</button>
    </div>
  </div>
</template>

<script>
import api from "../api";
import { computed } from "vue";
import { useCartStore } from "../store/cart";

export default {
  name: "CartPage",
  setup() {
  const cart = useCartStore();

  const increase = (item) => cart.addToCart(item);

  const decrease = (item) => {
    const existing = cart.items.find((i) => i.id === item.id);
    if (existing) {
      if (existing.quantity > 1) existing.quantity--;
      else cart.items = cart.items.filter((i) => i.id !== item.id);
    }
  };

  const total = computed(() =>
    cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );

  const checkout = async () => {
    const items = cart.items.map(i => ({
      product_id: i.id,
      quantity: i.quantity
    }));

    try {
      const res = await api.post("/orders", { items });

      alert("Заказ оформлен 🎉");

      cart.items = [];

      console.log(res.data);

    } catch (err) {
      console.error(err);
      alert("Ошибка оформления заказа");
    }
  };

  return { cart, increase, decrease, total, checkout };
}
};
</script>
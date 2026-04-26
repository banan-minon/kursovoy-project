<template>
  <div class="cart-container">
    <h1>Корзина</h1>
    <div v-if="cart.items.length === 0" class="empty-state">
      Ваша корзина пуста 🛒
      <br>
      <router-link to="/" class="back-link">Вернуться в магазин</router-link>
    </div>

    <div v-else>
      <div v-for="item in cart.items" :key="item.id" class="cart-item">
        <div class="cart-item-info">
          <h2 class="cart-item-title">{{ item.name }}</h2>
          <p class="cart-item-price">Цена: {{ item.price }} ₽</p>
        </div>
        <div class="cart-item-controls">
          <button class="decrease" @click="decrease(item)">–</button>
          <span>{{ item.quantity }}</span>
          <button class="increase" @click="increase(item)">+</button>
        </div>
      </div>

      <div class="cart-total">Итого: {{ total }} ₽</div>
      <button class="checkout-btn" @click="checkout">Оформить заказ</button>
    </div>
  </div>
</template>

<script>
import API from "../api";
import { computed } from "vue";
import { useCartStore } from "../store/cart";
import { useRouter } from "vue-router"; 

export default {
  name: "CartPage",
  setup() {
    const cart = useCartStore();
    const router = useRouter(); 

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
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Сначала войдите в аккаунт!");
        router.push('/login'); 
        return;
      }

      const items = cart.items.map(i => ({
        product_id: i.id,
        quantity: i.quantity
      }));

      try {
        await API.post("/orders", { items });
        alert("Заказ оформлен 🎉");
        
        cart.clearCart(); 
        
        router.push('/orders'); 
      } catch (err) {
        console.error(err);
        alert("Ошибка оформления заказа. Проверьте соединение с сервером.");
      }
    };

    return { cart, increase, decrease, total, checkout };
  }
};
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 50px 0;
  font-size: 1.2rem;
}
.back-link {
  display: inline-block;
  margin-top: 20px;
  font-size: 0.9rem;
  text-decoration: underline;
  color: #666;
}
</style>
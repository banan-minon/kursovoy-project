<template>
  <div id="app">
    
    <!-- 🔝 HEADER -->
    <header>
      <h1 class="header-logo">CLOTHINGSTORE</h1>

      <div class="header-links">
        <router-link to="/login">Вход</router-link>
        <router-link to="/register">Регистрация</router-link>

        <router-link to="/cart" class="cart-button">
          🛒
          <span v-if="cart.totalQuantity > 0">
            {{ cart.totalQuantity }}
          </span>
        </router-link>
      </div>
    </header>

    <router-view />

    <AppFooter />

  </div>
</template>

<script>
import { useCartStore } from "./store/cart";
import AppFooter from "./components/AppFooter.vue";

export default {
  name: "App",

  components: {
    AppFooter
  },

  computed: {
    cart() {
      const cart = useCartStore();
      return {
        items: cart.items,
        totalQuantity: cart.items.reduce((sum, i) => sum + i.quantity, 0)
      };
    }
  }
};
</script>
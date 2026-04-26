<template>
  <div id="app">
    <header>
      <h1 class="header-logo" @click="$router.push('/')" style="cursor:pointer">CLOTHINGSTORE</h1>
      <div class="header-links">
        <router-link to="/">Магазин</router-link>

        <template v-if="!isAuth">
          <router-link to="/login">Вход</router-link>
          <router-link to="/register">Регистрация</router-link>
        </template>

        <template v-else>
          <router-link to="/orders">Заказы</router-link>
          <router-link v-if="isAdmin" to="/admin" class="admin-link">АДМИН-ПАНЕЛЬ</router-link>
          <a href="#" @click.prevent="logout">Выйти</a>
        </template>

        <router-link to="/cart" class="cart-button">
          🛒 <span v-if="totalQty > 0">{{ totalQty }}</span>
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
  components: { AppFooter },
  computed: {
    isAuth() { return !!localStorage.getItem("token"); },
    isAdmin() {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.role === 'admin';
    },
    totalQty() { return useCartStore().items.reduce((sum, i) => sum + i.quantity, 0); }
  },
  methods: {
    logout() {
      localStorage.clear();
      window.location.href = "/";
    }
  }
};
</script>

<style>
.admin-link { color: #ff0000 !important; font-weight: bold; }
</style>
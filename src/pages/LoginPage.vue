<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2 class="auth-title">Вход</h2>

      <input 
        v-model="email" 
        placeholder="Email" 
        class="auth-input"
      />

      <input 
        v-model="password" 
        type="password" 
        placeholder="Пароль" 
        class="auth-input"
      />

      <button @click="login" class="auth-button">
        Войти
      </button>

      <router-link to="/register" class="auth-link">
        Нет аккаунта? Регистрация
      </router-link>
    </div>
  </div>
</template>

<script>
import { authAPI } from "../api";

export default {
  data() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    async login() {
      try {
        const res = await authAPI.login({
          email: this.email,
          password: this.password
        });

        localStorage.setItem("token", res.data.token);

        alert("Вход выполнен!");
        this.$router.push("/");
      } catch (e) {
        console.error(e);
        alert("Ошибка входа");
      }
    }
  }
}
</script>
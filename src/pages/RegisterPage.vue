<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2 class="auth-title">Регистрация</h2>

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

      <button @click="register" class="auth-button">
        Зарегистрироваться
      </button>

      <router-link to="/login" class="auth-link">
        Уже есть аккаунт? Войти
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
    async register() {
      try {
        await authAPI.register({
          email: this.email,
          password: this.password
        });
        alert("Успешная регистрация!");
      } catch (e) {
        console.error(e);
        alert("Ошибка регистрации");
      }
    }
  }
}
</script>
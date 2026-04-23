import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import CartPage from "../pages/CartPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
const routes = [
  { path: "/", component: HomePage },
  { path: "/cart", component: CartPage },
   { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
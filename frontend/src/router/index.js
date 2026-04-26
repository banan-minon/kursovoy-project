import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import CartPage from '../pages/CartPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import OrdersPage from '../pages/OrdersPage.vue';
import AdminPage from '../pages/AdminPage.vue'; 

const routes = [
  { path: '/', component: HomePage },
  { path: '/cart', component: CartPage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/orders', component: OrdersPage },
  { path: '/admin', component: AdminPage }, 
];

export default createRouter({
  history: createWebHistory(),
  routes
});
<template>
  <div class="cart-container">
    <h1>Мои заказы</h1>
    <div v-if="orders.length === 0" class="empty-state">У вас пока нет оформленных заказов</div>
    
    <div v-for="order in orders" :key="order.id" class="order-card">
      <div class="order-header">
        <span class="order-number">Заказ №{{ order.id }}</span>
        <span class="order-date">{{ formatDate(order.created_at) }}</span>
      </div>
      
      <div class="order-body">
        <div v-for="item in order.items" :key="item.name" class="order-item-line">
          {{ item.name }} — {{ item.quantity }} шт.
        </div>
      </div>
      
      <div class="order-footer">
        <span class="order-status">Статус: <b>{{ order.status }}</b></span>
        <span class="order-total">Итого: {{ order.total_price }} ₽</span>
      </div>
    </div>
  </div>
</template>

<script>
import API from "../api";
export default {
  data() { return { orders: [] } },
  async mounted() {
    try {
      const res = await API.get("/orders");
      this.orders = res.data;
    } catch (e) {
      console.error("Ошибка при загрузке заказов", e);
    }
  },
  methods: {
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('ru-RU', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
    }
  }
}
</script>

<style scoped>
.order-card {
  border: 1px solid #000;
  margin-bottom: 30px;
  padding: 20px;
}
.order-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
  font-weight: 900;
  text-transform: uppercase;
}
.order-item-line {
  margin-bottom: 5px;
  font-size: 0.9rem;
}
.order-footer {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order-total { font-weight: 900; font-size: 1.2rem; }
.order-status { font-size: 0.8rem; text-transform: uppercase; }
.empty-state { text-align: center; margin-top: 50px; opacity: 0.5; }
.order-status b {
  display: inline-block;
  padding: 2px 10px;
  border: 1px solid #000;
  animation: blink 2s infinite;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>
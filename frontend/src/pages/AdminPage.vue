<template>
  <div class="cart-container">
    <h1>Панель администратора</h1>
    
    <div class="auth-box" style="max-width: 100%; border: 2px solid #000; padding: 30px; margin-bottom: 50px;">
      <h3>Добавить новый товар</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <input v-model="form.name" placeholder="Название товара" class="auth-input">
        
        <select v-model="form.category" class="auth-input">
          <option value="">Выбери категорию</option>
          <option value="Shirts">Футболки (Shirts)</option>
          <option value="Pants">Штаны (Pants)</option>
          <option value="Jacket">Куртки (Jacket)</option>
          <option value="Dress">Платья (Dress)</option>
          <option value="Sweater">Свитеры (Sweater)</option>
          <option value="Hoodie">Худи (Hoodie)</option>
          <option value="Shoes">Обувь (Shoes)</option>
        </select>

        <input v-model.number="form.price" type="number" placeholder="Цена (₽)" class="auth-input">
        <input v-model="form.size" placeholder="Размер (например S-XL)" class="auth-input">
      </div>
      
      <input v-model="form.image" placeholder="Прямая ссылка на картинку (URL)" class="auth-input">
      
      <textarea v-model="form.description" placeholder="Описание" class="auth-input" style="height: 100px;"></textarea>
      
      <button @click="addProduct" class="btn">Опубликовать товар</button>
    </div>

    <h3>Товары в базе ({{ products.length }})</h3>
    <div v-for="p in products" :key="p.id" class="cart-item">
      <img :src="getFirstImage(p)" style="width: 50px; height: 50px; object-fit: cover; border: 1px solid #eee;">
      <div style="flex: 1; margin-left: 20px;">
        <strong>{{ p.name }}</strong> — {{ p.price }} ₽ <br>
        <small>{{ p.category }} | {{ p.size }}</small>
      </div>
      <button @click="deleteProduct(p.id)" style="color: red; border: 1px solid red; background: none; padding: 5px 10px; cursor: pointer;">Удалить</button>
    </div>
  </div>
</template>

<script>
import { productsAPI } from "../api";

export default {
  data() {
    return {
      products: [],
      form: { 
        name: '', 
        description: '', 
        price: null, 
        category: '', 
        size: 'S-XL', 
        image: '' 
      }
    }
  },
  async mounted() { 
    this.load(); 
  },
  methods: {
    async load() {
      try {
        const res = await productsAPI.getAll();
        this.products = res.data;
      } catch (e) {
        console.error("Ошибка загрузки товаров", e);
      }
    },

    async addProduct() {
      if (!this.form.name || !this.form.price || !this.form.category) {
        return alert("Заполните название, цену и категорию!");
      }

      try {
        await productsAPI.create(this.form);
        alert("Товар успешно добавлен! 🎉");
        
        this.form = { name: '', description: '', price: null, category: '', size: 'S-XL', image: '' };
        
        await this.load();
      } catch (e) {
        console.error(e);
        const errorMsg = e.response?.data?.message || "Ошибка при связи с сервером";
        alert("Ошибка: " + errorMsg);
      }
    },

    async deleteProduct(id) {
      if (confirm("Удалить этот товар навсегда?")) {
        try {
          await productsAPI.delete(id);
          this.load();
        } catch (e) {
          alert("Не удалось удалить товар");
        }
      }
    },

    getFirstImage(product) {
      if (product.images && typeof product.images === 'string') {
        const clean = product.images.replace(/[{}]/g, '');
        const urls = clean.split(';').filter(u => u.trim() !== '');
        return urls.length > 0 ? urls[0].trim() : 'https://via.placeholder.com/50';
      }
      return 'https://via.placeholder.com/50';
    }
  }
}
</script>
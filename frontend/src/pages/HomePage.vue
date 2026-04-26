<template>
  <div>
    <div class="filters-bar">
      <div class="category-list">
        <button 
          v-for="cat in categories" 
          :key="cat.value"
          @click="setCategory(cat.value)"
          :class="{ active: filter.category === cat.value }"
        >
          {{ cat.name }}
        </button>
      </div>
      <input 
        v-model="filter.search" 
        @input="fetchProducts" 
        placeholder="ПОИСК..." 
        class="search-input" 
      />
    </div>

    <div class="product-grid">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="product-card"
        @click="selectedProduct = product"
      >
        <div class="image-wrapper">
          <img 
            :src="getFirstImage(product)" 
            class="product-image" 
            @error="handleImgError"
          />
        </div>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="price">{{ product.price }} ₽</p>
        </div>
        <button @click.stop="addToCart(product)">В КОРЗИНУ</button>
      </div>
    </div>

    <div v-if="selectedProduct" class="modal-overlay" @click="selectedProduct = null">
      <div class="modal" @click.stop>
        <img 
          :src="getFirstImage(selectedProduct)" 
          class="modal-image" 
        />
        <h2>{{ selectedProduct.name }}</h2>
        <p>{{ selectedProduct.description }}</p>
        <p style="font-size: 0.8rem; color: #999;">Размер: {{ selectedProduct.size }}</p>
        <p class="price">{{ selectedProduct.price }} ₽</p>
        <button class="btn" @click="addToCart(selectedProduct)">В КОРЗИНУ</button>
        <button class="close-btn" @click="selectedProduct = null">✕</button>
      </div>
    </div>
  </div>
</template>

<script>
import { productsAPI } from "../api";
import { useCartStore } from "../store/cart";

export default {
  name: "HomePage",
  data() {
    return {
      products: [],
      filter: { category: '', search: '' },
      selectedProduct: null,
      categories: [
        { name: 'ВСЕ', value: '' },
        { name: 'ФУТБОЛКИ', value: 'Shirts' },
        { name: 'ШТАНЫ', value: 'Pants' },
        { name: 'КУРТКИ', value: 'Jacket' },
        { name: 'ПЛАТЬЯ', value: 'Dress' },
        { name: 'СВИТЕРЫ', value: 'Sweater' },
        { name: 'ХУДИ', value: 'Hoodie' },
        { name: 'ОБУВЬ', value: 'Shoes' }
      ]
    };
  },
  async mounted() {
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await productsAPI.getAll(this.filter);
        this.products = res.data;
      } catch (e) {
        console.error("Ошибка загрузки товаров", e);
      }
    },

    setCategory(c) {
      this.filter.category = c;
      this.fetchProducts();
    },

    addToCart(product) {
      useCartStore().addToCart(product);
    },

    getFirstImage(product) {
      if (product.images && typeof product.images === 'string') {
        const clean = product.images.replace(/[{}]/g, '');
        const urls = clean.split(';').filter(u => u.trim() !== '');
        if (urls.length > 0) return urls[0].trim();
      }
      if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images[0];
      }
      return 'https://via.placeholder.com/400x500?text=No+Photo';
    },

    handleImgError(e) {
      e.target.src = 'https://via.placeholder.com/400x500?text=No+Photo';
    }
  }
};
</script>

<style scoped>
.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  border-bottom: 1px solid #e5e5e5;
  flex-wrap: wrap;
  gap: 15px;
}
.category-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.category-list button {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: #888;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}
.category-list button.active {
  color: #000;
  border-bottom: 2px solid #000;
}
.search-input {
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  font-size: 0.9rem;
  padding: 5px 0;
  width: 200px;
}
.product-card {
  position: relative;
  overflow: hidden; 
  cursor: pointer;
}

.image-wrapper {
  overflow: hidden;
  background: #fcfcfc;
}

.product-image {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.product-info {
  padding: 15px 0;
}

.product-title {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 5px;
  transition: color 0.3s ease;
}

.product-card:hover .product-title {
  color: #666; 
}

.product-card button {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s ease;
}

.product-card:hover button {
  opacity: 1;
  transform: translateY(0);
}
.modal-overlay {
  backdrop-filter: blur(5px); /* Размытие фона */
  transition: all 0.4s ease;
}

.modal {
  animation: modalSlide 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

@keyframes modalSlide {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
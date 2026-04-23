<template>
  <div>
    <div class="product-grid">
      <div 
  v-for="product in products" 
  :key="product.id" 
  class="product-card"
  @click="openProduct(product)"
>

        <!-- 📸 СЛАЙДЕР -->
        <div class="image-wrapper">
  
  <transition name="fade-slide" mode="out-in">
    <img
      :key="product.id + '-' + (currentIndex[product.id] || 0)"
      v-if="product.images && product.images.length"
      :src="product.images[currentIndex[product.id] || 0]"
      class="product-image"
    />
  </transition>

  <div class="slider-controls">
    <button @click.stop="prevImage(product.id)" class="slider-btn left">‹</button>
    <button @click.stop="nextImage(product.id)" class="slider-btn right">›</button>
  </div>

</div>

        <!-- 🧾 ТЕКСТ -->
        <h2>{{ product.name }}</h2>
        <p>{{ product.description }}</p>
        <p class="price">Цена: {{ product.price }} ₽</p>

        <button @click.stop="addToCart(product)">
          В корзину
        </button>

      </div>
    </div>
  </div>
  <div v-if="selectedProduct" class="modal-overlay" @click="closeModal">
  
  <div class="modal" @click.stop>

    <img 
      :src="selectedProduct.images?.[0]" 
      class="modal-image"
    />

    <h2>{{ selectedProduct.name }}</h2>
    <p>{{ selectedProduct.description }}</p>
    <p class="price">{{ selectedProduct.price }} ₽</p>

   <button class="btn" @click="addToCart(selectedProduct)">
  В корзину
</button>

    <button class="btn btn-outline" @click="buyNow(selectedProduct)">
  Купить сейчас
</button>

    <button class="close-btn" @click="closeModal">
      ✕
    </button>

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
    currentIndex: {},
    selectedProduct: null
  };
  },
  computed: {
    cart() {
      const cart = useCartStore();
      return {
        items: cart.items,
        totalQuantity: cart.items.reduce((sum, i) => sum + i.quantity, 0)
      };
    }
  },
  
  async mounted() {
    try {
      const res = await productsAPI.getAll();
      this.products = res.data;
    } catch (e) {
      console.error("Ошибка загрузки товаров", e);
    }
  },
  methods: {
  addToCart(product) {
    const cart = useCartStore();
    cart.addToCart(product);
  },

  nextImage(id) {
    const product = this.products.find(p => p.id === id);
    if (!product || !product.images || product.images.length === 0) return;

    const max = product.images.length;
    this.currentIndex[id] = ((this.currentIndex[id] || 0) + 1) % max;
  },

  prevImage(id) {
    const product = this.products.find(p => p.id === id);
    if (!product || !product.images || product.images.length === 0) return;

    const max = product.images.length;
    this.currentIndex[id] =
      ((this.currentIndex[id] || 0) - 1 + max) % max;
  },
  openProduct(product) {
  this.selectedProduct = product;
},

closeModal() {
  this.selectedProduct = null;
},

buyNow(product) {
  const cart = useCartStore();
  cart.addToCart(product);
  alert("Товар добавлен, переход к оформлению 🚀");
}
}
};

</script>


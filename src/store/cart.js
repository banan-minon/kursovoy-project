import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: []
  }),

  getters: {
    totalQuantity: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0)
  },

  actions: {
    addToCart(product) {
      const existing = this.items.find(i => i.id === product.id);

      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
    },

    removeFromCart(productId) {
      this.items = this.items.filter(i => i.id !== productId);
    },

    clearCart() {
      this.items = [];
    }
  }
});
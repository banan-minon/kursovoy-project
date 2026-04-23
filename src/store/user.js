import { defineStore } from "pinia";
import { authAPI } from "../api";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    email: "",
  }),
  actions: {
    async login(email, password) {
      const res = await authAPI.login(email, password);
      this.token = res.data.token;
      this.email = email;
      localStorage.setItem("token", this.token);
    },
    async register(email, password) {
      await authAPI.register(email, password);
    },
    logout() {
      this.token = null;
      this.email = "";
      localStorage.removeItem("token");
    }
  }
});
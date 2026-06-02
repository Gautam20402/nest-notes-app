<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/api";

const router = useRouter();

const username = ref("");
const password = ref("");
const error = ref("");

const login = async () => {
  error.value = "";

  try {
    const res = await api.post("/user/login", {
      username: username.value,
      password: password.value,
    });

    localStorage.setItem("token", res.data.token);

    router.push("/notes");
  } catch (err) {
    error.value = err.response?.data?.message || "Login failed";
  }
};
</script>

<template>
  <div class="container">
    <h2>Login</h2>

    <input v-model="username" placeholder="Username" />

    <input v-model="password" type="password" placeholder="Password" />

    <button @click="login">Login</button>

    <p class="error">
      {{ error }}
    </p>

    <router-link to="/signup"> Create Account </router-link>
  </div>
</template>

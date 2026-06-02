<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import api from "../api/api";

const router = useRouter();

const name = ref("");
const username = ref("");
const password = ref("");
const error = ref("");

const signup = async () => {
  error.value = "";

  try {
    await api.post("/user/signup", {
      name: name.value,
      username: username.value,
      password: password.value,
    });

    router.push("/login");
  } catch (err) {
    error.value = err.response?.data?.message || "Signup failed";
  }
};
</script>

<template>
  <div class="container">
    <h2>Signup</h2>

    <input v-model="name" placeholder="Name" />

    <input v-model="username" placeholder="Username" />

    <input v-model="password" type="password" placeholder="Password" />

    <button @click="signup">Signup</button>

    <p class="error">
      {{ error }}
    </p>

    <router-link to="/login"> Already have account? </router-link>
  </div>
</template>

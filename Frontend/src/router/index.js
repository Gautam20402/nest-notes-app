import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import NotesView from "../views/NotesView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },

  {
    path: "/login",
    component: LoginView,
  },

  {
    path: "/signup",
    component: SignupView,
  },

  {
    path: "/notes",
    component: NotesView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  next();
});

export default router;

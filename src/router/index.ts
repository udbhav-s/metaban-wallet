import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/new-seed",
    name: "NewSeed",
    component: Home,
  },
  {
    path: "/import-seed",
    name: "ImportSeed",
    component: Home,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

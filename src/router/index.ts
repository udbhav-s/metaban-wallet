import { storeUtil } from "@/store";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import RemoteSign from "@/views/RemoteSign.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: (route) => ({
      redirect: route.query.redirect,
    }),
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
    meta: {
      requiresAuth: true,
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue"),
    children: [
      {
        path: "/account/:banAddress",
        name: "Account",
        component: () =>
          import(/* webpackChunkName: "account" */ "../components/Account.vue"),
        props: (route) => ({
          address: route.params.banAddress,
        }),
      },
    ],
  },
  {
    path: "/sign",
    name: "Sign",
    component: RemoteSign,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth) {
    if (storeUtil.getters.seed()) next();
    else {
      next({
        name: "Home",
        query: {
          redirect: to.fullPath,
        },
      });
    }
  } else next();
});

export default router;

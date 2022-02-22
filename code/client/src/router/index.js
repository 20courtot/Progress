// import { createRouter, createWebHashHistory } from 'vue-router'
import Login from "../views/Login.vue";
import Progress from "../views/progression.vue";
import Add_projects from "../views/add_projects.vue";
import Admin from "../views/admin.vue"
import * as VueRouter from "vue-router";
// import * as Vue from 'vue'
// Vue.use(VueRouter)

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
    },
    {
      path: "/progress",
      name: "Progress",
      component: Progress,
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
    },
    {
      path: "/add_projects",
      name: "Add_projects",
      component: Add_projects,
    },
  ],
});

export default router;

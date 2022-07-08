import { createApp } from "vue";
import App from "./App.vue";
import MiniMicroApp from "../../../src/index";
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import Title from "./components/Title.vue";

const routes = [
  { path: "/", component: HelloWorld },
  { path: "/title", component: Title },
];

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
});

const app = createApp(App);
app.use(router);
app.mount("#app");

MiniMicroApp.start();

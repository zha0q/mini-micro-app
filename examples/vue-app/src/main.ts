import { createApp } from "vue";
import App from "./App.vue";
import MiniMicroApp from "../../../src/index";

createApp(App).mount("#app");

MiniMicroApp.start();

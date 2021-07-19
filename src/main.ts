import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

// add icon library
import "@/util/fa";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// bananojs
import * as bananojs from "@bananocoin/bananojs";
bananojs.setBananodeApiUrl("https://kaliumapi.appditto.com/api");

createApp(App).use(router).component("fa-icon", FontAwesomeIcon).mount("#app");

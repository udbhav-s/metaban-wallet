import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

// add icon library
import "@/util/fa";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

createApp(App).use(router).component("fa-icon", FontAwesomeIcon).mount("#app");

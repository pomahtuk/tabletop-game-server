import Vue from "vue";
import VModal from "vue-js-modal";

import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { Promised } from "vue-promised";

Vue.config.productionTip = false;

Vue.use(VModal);

Vue.component("Promised", Promised);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

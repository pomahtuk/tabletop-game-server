import Vue from "vue";
import VModal from "vue-js-modal";

import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { Promised } from "vue-promised";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

Vue.use(VModal);

Vue.component("Promised", Promised);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

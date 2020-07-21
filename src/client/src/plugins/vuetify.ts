import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#000",
        secondary: "#65F6FF",
        accent: "#F1338B",
        error: "#F1338B",
        info: "#F1338B",
        success: "#65F6FF",
        warning: "#F1338B",
      },
    },
  },
});

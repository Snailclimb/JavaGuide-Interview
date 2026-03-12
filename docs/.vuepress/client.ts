import { defineClientConfig } from "vuepress/client";
import { h } from "vue";
import LayoutToggle from "./components/LayoutToggle.vue";

export default defineClientConfig({
  rootComponents: [() => h(LayoutToggle)],
});

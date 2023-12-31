import { createApp } from "vue";
import App from "./components/App.vue";

import '@unocss/reset/tailwind.css'
import 'uno.css'

const app = createApp(App);
app.mount("#app");

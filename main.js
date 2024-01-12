import { createApp } from "vue";
import App from "./components/App.vue";

import '@unocss/reset/tailwind.css'
import 'uno.css'

import { createRouter, createWebHashHistory } from 'vue-router'

import PageNode from "./pages/PageNode.vue";
import PageMain from "./pages/PageMain.vue";
import PageDebug from "./pages/PageDebug.vue";

const routes = [
  { path: '/', component: PageMain },
  { path: '/nodes/', component: PageNode },
  { path: '/debug/', component: PageDebug },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App);
app.use(router)
app.mount("#app");

import "babel-polyfill"
import Vue from "vue"
import Vuetify from "vuetify"
import VueResource from "vue-resource"
import Main from "./pages/Main.vue"
import VueRouter from "vue-router"

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vuetify)

const routes = [
  { path: "/", component: Main }
]

const router = new VueRouter({ routes })

new Vue({
  el: "#app",
  router
})


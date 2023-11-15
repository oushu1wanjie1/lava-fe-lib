import { createApp } from 'vue'
import 'tdesign-vue-next/es/style/index.css';
import './index.css'
import App from './App.vue'
import TDesign from 'tdesign-vue-next';
import { createRouter, createWebHistory } from 'vue-router'
import Home from './Home.vue'
import Auth from './Auth.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/auth', component: Auth },
  { path: '/coding', name: 'Coding', component: () => import('./Coding.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).use(TDesign).mount('#app')

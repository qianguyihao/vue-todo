import Vue from 'vue'
import App from './app.vue'

import './assets/styles/test.css'
import './assets/images/bg.jpeg'
import './assets/styles/test-stylus.styl'


const root = document.createElement('div');
document.body.appendChild(root)

new Vue({
    render: (h) => h(App)
}).$mount(root); //挂在到 root 节点



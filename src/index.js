import Vue from 'vue'
import App from './app.vue'

import './assets/styles/test.css'
import './assets/images/bg.jpeg'
import './assets/styles/test-stylus.styl'


const root = document.createElement('div');

new Vue({
    render: (h) => h(app)
}).$mount(root); //挂在到 root 节点
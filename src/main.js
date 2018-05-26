// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'normalize.css/normalize.css'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import router from './router'
import store from './store'
import './assets/css/app.css'
Vue.use(MintUI)
Vue.prototype.$toast = MintUI.Toast
Vue.prototype.$message = MintUI.MessageBox
Vue.prototype.$alert = MintUI.MessageBox.alert
Vue.prototype.$confirm = MintUI.MessageBox.alert
Vue.prototype.$prompt = MintUI.MessageBox.prompt
Vue.config.productionTip = false
Vue.directive('has', {
    bind(el, binding) {
        if (!Vue.prototype.$_has(binding.value)) {
            el.parentNode.removeChild(el)
        }
    }
})
Vue.directive('blur', {
    bind(el, binding) {
        const input = el.querySelector('input')
        // let time = null;
        input.onblur = () => {
            binding.value.rules(binding.value.label)
            // if (time !== null) {
            //     window.clearTimeout(time);
            // }
            // time = setTimeout(() => binding.value.rules(binding.value.label), 1000);
        }
    }
})
Vue.directive('focus', {
    bind(el, binding) {
        const input = el.querySelector('input')
        let time = null
        input.oninput = () => {
            if (time !== null) {
                window.clearTimeout(time)
            }
            time = setTimeout(() => binding.value.rules(binding.value.label), 1000)
        }
    }
})
Vue.directive('input', {
    bind(el, binding) {
        const input = el.querySelector('input')
        let time = null
        input.oninput = () => {
            if (time !== null) {
                window.clearTimeout(time)
            }
            time = setTimeout(() => binding.value.rules(binding.value.label), 1000)
        }
    }
})
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})

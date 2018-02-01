// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import router from './router';
import store from './store';
Vue.use(MintUI);
Vue.config.productionTip = false;
Vue.directive('has', {
    bind: function(el, binding) {
        if (!Vue.prototype.$_has(binding.value)) {
            el.parentNode.removeChild(el);
        }
    }
});
Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import 'normalize.css/normalize.css';
import './assets/css/app.css';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import router from './router';
import store from './store';
Vue.use(MintUI);
Vue.prototype.$toast = MintUI.Toast;
Vue.prototype.$message = MintUI.MessageBox;
Vue.prototype.$alert = MintUI.MessageBox.alert;
Vue.prototype.$confirm = MintUI.MessageBox.alert;
Vue.prototype.$prompt = MintUI.MessageBox.prompt;
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

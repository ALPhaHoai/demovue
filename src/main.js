import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import * as VueGoogleMaps from "vue2-google-maps";

import App from './App.vue'

Vue.use(Element)
Vue.use(VXETable)

Vue.use(VueGoogleMaps, {
    load: {
        key: "AIzaSyCjQvIh3y9_svxMWIX-DetxqOz3-qMbqxY",
    },
    installComponents: true,
});

Vue.config.productionTip = false


new Vue({
    render: h => h(App),
}).$mount('#app')

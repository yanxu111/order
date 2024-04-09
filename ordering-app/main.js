import Vue from 'vue'
import App from './App'
import store from './stroe/index.js'
//* as fillters 结果显示为一个对象，key：函数名称，value：函数体
import * as fillters from './fillters/index.js'
//会员token认证 全局加载使用
import token from './static/js/utils/user_token.js'
import config from "./static/js/config/index.js"
// console.log(Object.keys(fillters)) //过滤器文件fillters里面所有的函数名
Object.keys(fillters).forEach(key=>{
	// key:函数名,fillters[key]:函数体
	Vue.filter(key,fillters[key])
})
Vue.config.productionTip = false
//注册
Vue.prototype.$token=token
Vue.prototype.$config=config
App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()

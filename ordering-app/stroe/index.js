import Vue from 'vue'
import Vuex from 'vuex'
import system from '../stroe/system/index.js'
import business from '../stroe/business/index.js'
import search from '../stroe/search/index.js'
import goods from '../stroe/goods/index.js'
import login from '../stroe/login/index.js'
import cart from '../stroe/cart/index.js'
import order from '../stroe/order/index.js'
Vue.use(Vuex)

const store=new Vuex.Store({
	modules:{
		system,
		business,
		search,
		goods,
		login,
		cart,
		order
	}
})

export default store
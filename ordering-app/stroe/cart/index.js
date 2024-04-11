import Vue from "vue"
import {
	saveCartData,
	getCartData,
	deleteCartData,
	setCartAmountData,
	clearCartAmountData
} from '../../api/cart/index.js'

export default {
	namespaced: true,
	state: {
		cartData: [], //显示在客户端购物车页面的数据,是个集合，包含多个菜品数组信息
		cartAmount: 0, //购物车数量显示
		isTableCode: false //根据桌号是否存在判断是自提还是堂内
	},
	mutations: {
		//显示在客户端购物车页面的数据
		["SET_CART_DATA"](state, payload) {
			let newMealInfo = (payload.cartData.new_meal_items && payload.cartData.new_meal_items.length > 0) ? JSON
				.stringify(payload.cartData.new_meal_items) : ""
			//去重开关 true:增加数量不增加菜品，false:增加菜品
			let amounStatus = false
			for (let i = 0; i < state.cartData.length; i++) {
				//判断新增加的菜品是否为已添加过的菜品，如果是，该菜品的数量+1，若不是，新增菜品
				let newMealListInfo = (state.cartData[i].new_meal_items && state.cartData[i].new_meal_items.length >
					0) ? JSON.stringify(state.cartData[i]
					.new_meal_items) : ""
				if (payload.cartData.gid === state.cartData[i].gid && newMealInfo === newMealListInfo) {
					amounStatus = true
					// state.cartData[i].amount=parseInt(state.cartData[i].amount)+1
					state.cartData[i].amount++
					//如果存在相同套餐 套餐中的菜品数量翻倍
					if (state.cartData[i].meal_items && state.cartData[i].meal_items.length > 0) {
						for (let j = 0; j < state.cartData[i].meal_items.length; j++) {
							state.cartData[i].meal_items[j].amount = state.cartData[i].meal_items[j].dis_amount * state
								.cartData[i].amount
						}
					}
					// 点击添加菜品/套餐,购物车数量+1				
					break
				}
			}

			if (!amounStatus) {
				// 将点击的菜品加入到购物车集合中,用unshift添加数据，新添加的排在最前面,显示在页面最上方
				state.cartData.unshift(payload.cartData)
			}
			state.cartAmount += parseInt(payload.cartData.amount)
		},
		//从数据库中获取当前分店添加购物车的菜品
		["GET_CART"](state, payload) {
  			// 循环菜品相加显示在购物车中
			state.cartAmount = 0
			state.cartData=payload.cartData
 			if (state.cartData.length > 0) {
				for (let i = 0; i < state.cartData.length; i++) {
					state.cartAmount += state.cartData[i].amount
				}
			}
		},
		// 清空客户端页面购物车数据
		["DELETE_CART_DATA"](state, payload) {
			state.cartData = []
			state.cartAmount = 0

		},
		// 判断桌号是否存在，决定是否计算包装费
		["SET_TABLE_CODE"](state, payload) {
			state.isTableCode = payload.isTableCode
		},
		// 菜品详情和购物车菜品对比
		["SET_GOODS_AMOUNT"](state, payload) {
			if (state.cartData.length > 0) {
				for (let i = 0; i < state.cartData.length; i++) {
					let cartMealItems = (state.cartData[i].new_meal_items && state.cartData[i].new_meal_items.length >
						0) ? JSON.stringify(state.cartData[i].new_meal_items) : ""
					//循环菜品详情第一层数据
					for (let j = 0; j < payload.goodsItems.length; j++) {
						// 循环菜品详情第二层数据拿到菜品详情
						for (let k = 0; k < payload.goodsItems[j].goods.length; k++) {
							let goodsMealItems = (payload.goodsItems[j].goods[k].new_meal_items && payload.goodsItems[j]
								.goods[k].new_meal_items.length > 0) ? JSON.stringify(payload.goodsItems[j].goods[k]
								.new_meal_items) : ""
							// 如果菜品存在
							if (state.cartData[i].gid === payload.goodsItems[j].goods[k].gid && goodsMealItems ===
								cartMealItems) {
								// 将购物车中数量赋值给菜品数据中的数量
								payload.goodsItems[j].goods[k].amount = state.cartData[i].amount
								break
							}
						}
					}
				}
			} else {
				//购物车里没有数据 将菜品数量全部设置为0
				for (let i = 0; i < payload.goodsItems.length; i++) {
					for (let j = 0; j < payload.goodsItems[i].goods.length; j++) {
						payload.goodsItems[i].goods[j].amount = 0
					}
				}
			}
		},
		// 减少/清空购物车中菜品数量
		["SET_CART_GOODS_AMOUNT"](state, payload) {
 			if (state.cartData.length > 0) {
				state.cartAmount = 0
				let newMeal = (payload.cartData.new_meal_items && payload.cartData.new_meal_items.length > 0) ? JSON
					.stringify(payload.cartData.new_meal_items) : ""
				console.log(11223)
				for (let i = 0; i < state.cartData.length; i++) {
					let cartNewMeal = (state.cartData[i].new_meal_items && state.cartData[i].new_meal_items.length >
						0) ? JSON.stringify(state.cartData[i].new_meal_items) : ""
					// 判断当前是否为相同菜品或套餐,若是相同则判断套餐中菜品是否相同

					if (state.cartData[i].gid === payload.cartData.gid && newMeal === cartNewMeal) {

						state.cartData[i].amount = parseInt(state.cartData[i].amount) > 0 ? parseInt(state.cartData[i]
							.amount) - 1 : 0
						if (state.cartData[i].amount <= 0) {
							//当菜品数量小于1时，删除该菜品
							state.cartData.splice(i--, 1)
						}						
						if (state.cartData[i] && state.cartData[i].meal_items && state.cartData[i].meal_items.length > 0) {
							// 如果是套餐
							for (let j = 0; j < state.cartData[i].meal_items.length; j++) {
								state.cartData[i].meal_items[j].amount = state.cartData[i].meal_items[j].dis_amount *
									state
									.cartData[i].amount
							}
						}
					}
				}
				// 重新赋值购物车数量显示
				for (let k = 0; k < state.cartData.length; k++) {
					state.cartAmount += state.cartData[k].amount
				}
			}
		},
		//显示数量文本框
		["SHOW_AMOUNT_INPUT"](state, payload) {
			state.cartData[payload.index].amountInput = true
			state.cartData[payload.index].amountInputFocus = true
			// 解决视图不更新问题
			Vue.set(state.cartData, payload.index, state.cartData[payload.index])
		},
		//隐藏数量文本框
		["HIDE_AMOUNT_INPUT"](state, payload) {
			state.cartData[payload.index].amountInput = false
			state.cartData[payload.index].amountInputFocus = false
			// 解决视图不更新问题
			Vue.set(state.cartData, payload.index, state.cartData[payload.index])
		},
		//输入数量更新购物车中的的菜品数量
		["SET_AMOUNT"](state,payload){
			state.cartAmount=0
			let amount=payload.cartData.amount
			// 拿到输入的数量先做判断 1:如果输入非法字符强制为空,如果输入0或者空格 强制为1
			amount=amount.toString().replace(/[^\d]/g,"")
			if(!amount || amount==="0"){
				amount=1
			}
			if(state.cartData.length>0){
				let newMeal=(payload.cartData.new_meal_items && payload.cartData.new_meal_items.length>0)?JSON.stringify(payload.cartData.new_meal_items):""
				for(let i=0;i<state.cartData.length;i++){
					let cartNewMeal=(state.cartData[i].new_meal_items && state.cartData[i].new_meal_items.length>0)? JSON.stringify(state.cartData[i].new_meal_items):""
					if(payload.cartData.gid===state.cartData[i].gid && newMeal===cartNewMeal){
						state.cartData[i].amount=parseInt(amount)
						if(state.cartData[i].meal_items.length>0){
							for(let j=0;j<state.cartData[i].meal_items.length;j++){
								state.cartData[i].meal_items[j].amount=state.cartData[i].meal_items[j].dis_amount*state.cartData[i].amount
							}
						}
					}
				}
			}
			// 重新赋值购物车数量显示
			for (let k = 0; k < state.cartData.length; k++) {
				state.cartAmount += state.cartData[k].amount
			}
		}
	},
	actions: {
		// 添加菜品提交购物车
		saveCart(context, payload) {
			// 添加购物车菜品详细组成数据,交给服务端的数据
			let data = {
				uid: context.rootState.login.uid,
				token: context.rootState.login.token,
				platform: "1", //登录平台类型 1：微信登陆
				branch_shop_id: payload.cartData.branch_shop_id, //分店id
				table_code: payload.cartData.table_code, //桌号
				meal_items: (payload.cartData.meal_items && payload.cartData.meal_items.length > 0) ? JSON
					.stringify(payload.cartData.meal_items) : "", //套餐里菜品的明细
				gid: payload.cartData.gid, //菜品id
				place_type: payload.cartData.place_type, //购物类型 0：普通订购
				is_meal: payload.cartData.is_meal, //是否为套餐 1：套餐 0：非套餐
				meal_type: payload.cartData.meal_type, //套餐类型 1：固定套餐
				new_meal_items: (payload.cartData.new_meal_items && payload.cartData.new_meal_items.length > 0) ?
					JSON.stringify(payload.cartData.new_meal_items) : "" //套餐里菜品的gid
			}
			saveCartData(data).then(res => {
				//显示在客户端页面上的购物车数据
				if (res.code === 200) {
					context.commit("SET_CART_DATA", {
						cartData: payload.cartData
					})
					//拿到vuex中菜品详情数据去和购物车的数据做对比
					context.commit("SET_GOODS_AMOUNT", {
						goodsItems: context.rootState.goods.goodsItems
					})
					if (payload.success) {
						payload.success()
					}
				}
			})
		},
		//获取购物车数据
		getCart(context, payload) {
			getCartData({
				uid: context.rootState.login.uid,
				token: context.rootState.login.token,
				platform: context.rootState.system.plateform,
				...payload
			}).then(res => {
					context.state.cartData=[]
					context.state.cartAmount=0
				if (res.code === 200) {
					// 为获取到的数据添加是否显示文本框和文本框获取焦点的属性
					for (let i = 0; i < res.data.length; i++) {
						res.data[i].amountInput = false //是否显示input 默认：return false;
						res.data[i].amountInputFocus = false //input是否获取焦点 默认：return false;
					}
					context.commit("GET_CART", {
						cartData: res.data
					})
					
				}
				if (payload.success) {
					payload.success()
				}
			})
		},
		// 清空购物车数据
		deleteCart(context, payload) {
			deleteCartData({
				uid: context.rootState.login.uid,
				token: context.rootState.login.token,
				platform: context.rootState.system.plateform,
				...payload
			}).then(res => {
				if (res.code === 200) {
					context.commit("DELETE_CART_DATA", {
						cartData: []
					})
					// 删除成功重新执行计算菜品数量显示
					context.commit("SET_GOODS_AMOUNT", {
						goodsItems: context.rootState.goods.goodsItems
					})
					if (payload.success) {
						payload.success()
					}
				}
			})
		},
		//减少/更新购物车中的数量，如若当数量为0时，清空该菜品
		setCartAmount(context, payload) {

			let goodsAmount = 0
			let mealType = payload.cartData.meal_type
			if (mealType != "1") {
				//如果是默认套餐/单品菜品 数量直接传值
				goodsAmount = payload.cartData.amount
			} else {
				let cartData = JSON.parse(JSON.stringify(context.state
					.cartData)) //将数组转换成字符串后重新转换为数组，从而解决与mutataions中的数组为同一个缓存，数据出现公用的问题
				let newMeal = (payload.cartData.new_meal_items && payload.cartData.new_meal_items > 0) ? JSON.stringify(
					payload.cartData.new_meal_items) : ""
				if (cartData.length > 0) {
					for (let i = 0; i < cartData.length; i++) {
						let cartNewMeal = (cartData[i].new_meal_items && cartData[i].new_meal_items > 0) ? JSON
							.stringify(cartData[i].new_meal_items) : ""
						if (cartData[i].gid === payload.cartData.gid && newMeal === cartNewMeal) {
							console.log(cartData[i])
							cartData[i].amount = (parseInt(cartData[i].amount) > 0) ? (parseInt(cartData[i].amount) -
								1) : 0
							goodsAmount = parseInt(cartData[i].amount)
							break
						}
					}
				}
			}

			// 接口所需数据
			let data = {
				uid: context.rootState.login.uid,
				token: context.rootState.login.token,
				platform: context.rootState.system.plateform,
				gid: payload.cartData.gid,
				branch_shop_id: payload.branch_shop_id,
				new_meal_items: (payload.cartData.new_meal_items && payload.cartData.new_meal_items.length > 0) ?
					JSON.stringify(payload.cartData.new_meal_items) : "",
				amount: goodsAmount
			}
			//如果菜品数量>0 :减少/更新菜品数量
			if (goodsAmount > 0) {
				setCartAmountData(data).then(res => {

					if (res.code === 200) {
						context.commit("SET_CART_GOODS_AMOUNT", {
							cartData: payload.cartData
						})
					}
				})
			} else {
				// 清空该菜品
				clearCartAmountData(data).then(res => {
					if (res.code === 200) {
						context.commit("SET_CART_GOODS_AMOUNT", {
							cartData: payload.cartData
						})
					}
				})
			}
		},
		// 输入数量更新购物车
		setAmount(context, payload) {
			let data = {
				uid: context.rootState.login.uid,
				token: context.rootState.login.token,
				platform: context.rootState.system.plateform,
				gid: payload.cartData.gid,
				branch_shop_id: payload.branch_shop_id,
				new_meal_items: (payload.cartData.new_meal_items && payload.cartData.new_meal_items.length > 0) ?
					JSON.stringify(payload.cartData.new_meal_items) : "",
				amount: payload.cartData.amount
			}
			setCartAmountData(data).then(res => {
				if (res.code === 200) {
					context.commit("SET_AMOUNT", {
						cartData: payload.cartData
					})
				}
			})
		}
	},
	// 计算购物车总价格
	getters: {
		total(state) {
			let isTotal = 0 //购物车菜品和套餐的总价格
			let goodsTotal = 0 //菜品单品的总价格
			let mealTotal = 0 //套餐的总价格
			let goodsPackPriceTotal = 0 //菜品单品打包费的总价格
			let mealPackPricetotal = 0 //套餐打包费的总价格
			if (state.cartData.length > 0) {
				for (let i = 0; i < state.cartData.length; i++) {
					if (state.cartData[i].is_meal === '0') { //非套餐，直接算总价
						goodsTotal += parseFloat(state.cartData[i].amount * state.cartData[i].price)
						// 如果桌号不存在则说明是外卖,需要计算包装费 否则不需要
						if (state.isTableCode) {
							goodsPackPriceTotal += parseFloat(state.cartData[i].amount * state.cartData[i].pack_price)
						}
					}
					if (state.cartData[i].is_meal === '1') { //套餐：算套餐里菜品的总价
						for (let j = 0; j < state.cartData[i].meal_items.length; j++) {
							if(state.cartData[i].meal_items[j].meal_price){
								mealTotal += parseFloat(state.cartData[i].meal_items[j].meal_price * state.cartData[i]
									.meal_items[j].amount)
							}else{
								mealTotal += parseFloat(state.cartData[i].meal_items[j].price * state.cartData[i]
									.meal_items[j].amount)
							}
							// 如果桌号不存在则说明是外卖,需要计算包装费 否则不需要
							if (state.isTableCode) {
								mealPackPricetotal += parseFloat(state.cartData[i].meal_items[j].amount * state
									.cartData[i].meal_items[j].pack_price)
							}
						}
					}
				}
				isTotal = goodsTotal + mealTotal + goodsPackPriceTotal + mealPackPricetotal
				isTotal = parseFloat(isTotal.toFixed(2))
			}
			return isTotal
		},
		// 包装费总价格
		packTotal(state){
			let packTotal=0;//包装费总价格
			let goodsPackPriceTotal = 0 //菜品单品打包费的总价格
			let mealPackPricetotal = 0 //套餐打包费的总价格
			if (state.cartData.length > 0) {
				// console.log(state.isTableCode)
				for (let i = 0; i < state.cartData.length; i++) {
					if (state.cartData[i].is_meal === '0') { 
						// 如果桌号不存在则说明是外卖,需要计算包装费 否则不需要
						if (state.isTableCode) {
							goodsPackPriceTotal += parseFloat(state.cartData[i].amount * state.cartData[i].pack_price)
						}
					}
					if (state.cartData[i].is_meal === '1') { //套餐：算套餐里菜品的总价
						for (let j = 0; j < state.cartData[i].meal_items.length; j++) {
							// 如果桌号不存在则说明是外卖,需要计算包装费 否则不需要
							if (state.isTableCode) {
								mealPackPricetotal += parseFloat(state.cartData[i].meal_items[j].amount * state
									.cartData[i].meal_items[j].pack_price)
							}
						}
					}
				}
				packTotal = goodsPackPriceTotal + mealPackPricetotal
				packTotal = parseFloat(packTotal.toFixed(2))
			}
			return packTotal
		}
	}
}

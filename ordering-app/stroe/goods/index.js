import Vue from "vue"
import {
	getShopGoodsData,
	getShopInfoData,
	getGoodsItemsInfoData,
	getGoodsDetailsDta,
	getGoodsMealData,
	getGoodsMealTitleData
} from '../../api/goods/index.js'

export default {
	namespaced: true,
	state: {
		shopInfo: {},
		shopGoods: [],
		goodsItems: [],
		goodsDetails: {},
		goodsMeal: [],
		goodsMealTitle: ""
	},
	mutations: {
		["SET_SHOP_INFO"](state, payload) {
			state.shopInfo = payload.shopInfo
			// console.log(state.shopInfo)
		},
		["SET_SHOP_GOODS"](state, payload) {
			state.shopGoods = payload.shopGoods
			// console.log(state.shopGoods)
		},
		["SET_GOODS_ITEMS"](state, payload) {
			state.goodsItems = payload.goodsItems
		},
		//菜品详情组件获取菜品详情数据
		["SET_GOODS_DETAILS"](state, payload) {
			state.goodsDetails = payload.goodsDetails
		},
		//菜品套餐详情
		["SET_GOODS_MEAL"](state, payload) {
			state.goodsMeal = payload.goodsMeal
			// console.log(payload)
		},
		["SET_GOODS_MEAL_TITLE"](state, payload) {
			state.goodsMealTitle = payload.goodsMealTitle
			// console.log(state.goodsMealTitle)
		},
		["SET_GOODS_MEAL_ACTIVE"](state, payload) {
			// console.log(state.goodsMeal)
			if (state.goodsMeal && state.goodsMeal.length > 0) {
				// for (let i = 0; i < state.goodsMeal.length; i++) {
				for (let j = 0; j < state.goodsMeal[payload.index].goods.length; j++) {
					if (state.goodsMeal[payload.index].goods[j].active) {
						state.goodsMeal[payload.index].goods[j].active = false
						break
					}
				}
				// }
				state.goodsMeal[payload.index].goods[payload.index2].active = true
			}
		},
		["SET_GOODS_POSITION"](state, payload) {
			state.goodsItems[payload.index].top = payload.top
			state.goodsItems[payload.index].left = payload.left
			state.goodsItems[payload.index].position = payload.position
		},
		//显示数量文本框
		["SHOW_AMOUNT_INPUT"](state, payload) {

			state.goodsItems[payload.index].goods[payload.index2].amountInput = true
			state.goodsItems[payload.index].goods[payload.index2].amountInputForcus = true
			// 解决视图不更新问题

			// console.log(state.goodsItems[payload.index].goods[payload.index2])
			Vue.set(state.goodsItems[payload.index].goods, payload.index2, state.goodsItems[payload.index].goods[payload
				.index2])
		},
		//隐藏数量文本框
		["HIDE_AMOUNT_INPUT"](state, payload) {
			// console.log(state.goodsItems[payload.index].goods[payload.index2])
			state.goodsItems[payload.index].goods[payload.index2].amountInput = false
			state.goodsItems[payload.index].goods[payload.index2].amountInputForcus = false
			// 解决视图不更新问题

			Vue.set(state.goodsItems[payload.index].goods, payload.index2, state.goodsItems[payload.index].goods[payload
				.index2])
		},
		//输入数量即使更新菜品数量
		["SET_GOODS_AMOUNT"](state, payload) {
			let newMeal = (payload.new_meal_items && payload.new_meal_items.length > 0) ? JSON.stringify(payload
				.new_meal_items) : ""
			level1: for (let i = 0; i < state.goodsItems.length; i++) {
				level2: for (let j = 0; j < state.goodsItems[i].goods.length; j++) {
					let goodsNewMeal = (state.goodsItems[i].goods[j].new_meal_items && state.goodsItems[i]
						.goods[j].new_meal_items.length > 0) ? JSON.stringify(state.goodsItems[i].goods[j]
						.new_meal_items) : ""
 						if(state.goodsItems[i].goods[j].gid===payload.gid && newMeal===goodsNewMeal){
							state.goodsItems[i].goods[j].amount=payload.amount
							//检测到非法输入替换成空
							setTimeout(()=>{
								state.goodsItems[i].goods[j].amount=state.goodsItems[i].goods[j].amount.toString().replace(/[^\d]/g,"")
							},30)
							if(!state.goodsItems[i].goods[j].amount && state.goodsItems[i].goods[j].amount===0){
								state.goodsItems[i].goods[j].amount=1
							}
							break level1
						}					
				}
			}
		}
	},
	actions: {
		//获取商家信息
		getShopInfo(context, payload) {
			getShopInfoData(payload).then(res => {
				if (res.code === 200) {
					context.commit("SET_SHOP_INFO", {
						shopInfo: res.data
					})
				}
			})
		},
		// 获取商家菜品分类信息
		getShopGoods(context, payload) {
			getShopGoodsData(payload).then(res => {
				if (res.code === 200) {
					for (let i = 0; i < res.data.length; i++) {
						if (i === 0) {
							res.data[i].active = true
						} else {
							res.data[i].active = false
						}
						//后续做左右分类详情滚动显示的参数初始化，防止出现undefined
						res.data[i].goodsTop = 0 //菜品距离顶部距离
						res.data[i].goodsHeight = 0 //对应菜品的高
						res.data[i].top = 0 //菜品分类的距离
					}
					context.commit("SET_SHOP_GOODS", {
						shopGoods: res.data
					})
				}
				if (payload.complete) {
					payload.complete()
				}
			})
		},
		//获取商家菜品详情
		getGoodsItemsInfo(context, payload) {
			getGoodsItemsInfoData(payload).then(res => {

				if (res.code === 200) {
					//由于接口返回数据优先，部分功能受限，这里需要自组一些初始化数据对后续开发进行使用
					// 添加菜品top,left,position用于定位菜品信息上方分类内容
					for (let i = 0; i < res.data.length; i++) {
						res.data[i].left = 0;
						res.data[i].top = 0;
						res.data[i].position = "static"
						// 循环每一个分类下的每一个菜品信息设置初始值
						for (let j = 0; j < res.data[i].goods.length; j++) {
							res.data[i].goods[j].top = 0 //每个菜品的top 用于复制给相应分类信息 进行双向绑定滚动效果
							res.data[i].goods[j].amount = 0 //菜品数量，用于添加减少是踢显示的菜品数量
							res.data[i].goods[j].amountInput =
								false //用于解决scroll-view中存在多个input页面卡顿，用时切换input不用是销毁用text替换
							res.data[i].goods[j].amountInputForcus = false //显示input时获取焦点，切换text时失去焦点
							res.data[i].goods[j]
								.new_meal_items = [] //套餐规格，用于下面循环套餐重组套餐的gid判断当相同套餐时不同套餐内容，购物车中需分开显示
							// 循环套餐内容,获取套餐gid用于判断
							for (let k = 0; k < res.data[i].goods[j].meal_items.length; k++) {
								if (res.data[i].goods[j].new_meal_items) {
									// 重组套餐的gid,因为相同套餐套餐内容不同,套餐gid也会改变
									res.data[i].goods[j].new_meal_items.push({
										"gid": res.data[i].goods[j].meal_items[k].gid
									})
								}
							}
						}
					}
					context.commit("SET_GOODS_ITEMS", {
						goodsItems: res.data
					})
					//页面一家在跨模块执行cart：vuex中的数量赋值，实现页面已加载就把购物车中的数量赋值给页面
					context.commit("cart/SET_GOODS_AMOUNT", {
						goodsItems: res.data
					}, {
						root: true
					}) //root:return true; 跨模块执行方法
				} else {
					context.commit("SET_GOODS_ITEMS", {
						goodsItems: []
					})
				}
			})
		},
		// 重新获取菜品信息,用于当菜品信息有变动时更新菜品
		getReachGoodsInfo(context, payload) {
			getGoodsItemsInfoData(payload).then(res => {
				if (payload.success) {
					payload.success(res.data)
				}
			})
		},
		//菜品详情组件获取菜品详情数据
		getGoodsDetails(context, payload) {
			getGoodsDetailsDta(payload).then(res => {
				if (res.code === 200) {
					context.commit("SET_GOODS_DETAILS", {
						goodsDetails: res.data
					})
				}
			})
		},
		// 菜品套餐详情获取
		getGoodsMeal(context, payload) {
			getGoodsMealData(payload).then(res => {
				if (res.code === 200) {
					context.commit("SET_GOODS_MEAL", {
						goodsMeal: res.data
					})
					if (payload.success) {
						payload.success(res.data)
					}
				}
			})
		},
		// 动态设置套餐标头
		getGoodsMealTitle(context, payload) {
			getGoodsMealTitleData(payload).then(res => {
				if (res.code === 200) {
					context.commit("SET_GOODS_MEAL_TITLE", {
						goodsMealTitle: res.data
					})
					if (payload.success) {
						payload.success()
					}
				}
			})
		}
	}
}

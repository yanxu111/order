import {
	submitOrderData,
	wechatPayOrderData,
	myOrderData,
	orderItemsData
} from "../../api/order/index.js"

export default {
	namespaced: true,
	state: {
		myOrderInfo:[], //我的已支付/待支付订单
		orderItemsInfo:{} //订单详情页面
	},
	mutations: {
		["MY_ORDER"](state,payload){
			state.myOrderInfo=payload.myOrderInfo
  		},
		// 我的订单分页加载数据
		["MY_ORDER_PAGE"](state,payload){
			state.myOrderInfo.push(...payload.myOrderInfo)
		},
		["ORDER_ITEMS"](state,payload){
			state.orderItemsInfo=payload.orderItemsInfo
 		}
	},
	actions: {
		submitOrder(context, payload) {
			let data = {
				uid: context.rootState.login.uid, //用户id
				token: context.rootState.login.token, //用户验证token
				platform: context.rootState.system.plateform, //用户登录平台 1：微信小程序
				branch_shop_id: payload.orderData.branch_shop_id, //分店id
				table_code: payload.orderData.table_code, //桌号
				remarks: payload.orderData.remarks, //备注
				is_pack: payload.orderData.is_pack, //是否包 1：打包；0：不打包
				distribution_type: payload.orderData.distribution_type //配送方式 2：自提；0：堂内
			}
			submitOrderData(data).then(res => {
				if (payload.completed) {
					payload.completed(res)
				}
			})
		},
		 wechatPayOrder(context, payload) {
			let data = {
				uid: context.rootState.login.uid, //用户id
				token: context.rootState.login.token, //用户验证token
				platform: context.rootState.system.plateform, //用户登录平台 1：微信小程序
				// open_id: context.rootState.login.openId, //用户登录验证ID  
				open_id:"oZU0G5l_PRbTHp7gPlkXW-kDFDVo",
				body: context.rootState.business.shopInfo.branch_shop_name + "订单详情",
				...payload
			}
			return wechatPayOrderData(data).then(res => {
				 return res
			})
		},
		// 我的订单页面
		myOrder(context,payload){
			let data = {
				uid: context.rootState.login.uid, //用户id
				token: context.rootState.login.token, //用户验证token
				platform: context.rootState.system.plateform, //用户登录平台 1：微信小程序
   				...payload
			}
			myOrderData(data).then(res=>{
				// console.log(res)
 				if(res.code===200){
					context.commit("MY_ORDER",{myOrderInfo:res.data})
					if(payload.completed){
						payload.completed(res.pageinfo)
					}
					if(payload.success){
						payload.success()
					}
				}
			})
		},
		// 我的订单页面分页数据
		myOrderPage(context,payload){
			let data = {
				uid: context.rootState.login.uid, //用户id
				token: context.rootState.login.token, //用户验证token
				platform: context.rootState.system.plateform, //用户登录平台 1：微信小程序
				...payload
			}
			myOrderData(data).then(res=>{
 				if(res.code===200){
					context.commit("MY_ORDER_PAGE",{myOrderInfo:res.data})	
				}
			})
		},
		//订单详情页面
		orderItems(context,payload){
			let data = {
				uid: context.rootState.login.uid, //用户id
				token: context.rootState.login.token, //用户验证token
				platform: context.rootState.system.plateform, //用户登录平台 1：微信小程序
				...payload
			}
 			orderItemsData(data).then(res=>{
 				if(res.code===200){
					context.commit("ORDER_ITEMS",{orderItemsInfo:res.data})
					if(payload.success){
						payload.success()
					}
				}
			})
		}
	}
}

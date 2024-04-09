import {
	submitOrderData,
	wechatPayOrderData
} from "../../api/order/index.js"

export default {
	namespaced: true,
	state: {

	},
	mutations: {

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
			console.log(data)
			wechatPayOrderData(data).then(res => {
				console.log(res)
			})
		}
	}
}

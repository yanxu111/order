import config from "../../static/js/config/index.js"
import {request} from "../../static/js/utils/request.js"

//提交订单
export function submitOrderData(data){
	return request(config.baseApi+"/api/v1/user/order/add","post",data)
}

//微信小程序支付订单
export function wechatPayOrderData(data){
	return request(config.baseApi+"/api/v1/wxpay/wechat_unifiedorder","post",data)
}

//我的订单
export function myOrderData(data){
	return request(config.baseApi+"/api/v1/user/order/show","post",data)
}
//订单详情
export function orderItemsData(data){
	return request(config.baseApi+"/api/v1/user/order/details","post",data)
}

//订单申请退款
export function refundOrderData(data){
	return request(config.baseApi+"/api/v1/user/order/refund","post",data)
}

//退款订单
export function refundOrderInfoData(data){
	return request(config.baseApi+"/api/v1/user/order/show_refund","post",data)
}
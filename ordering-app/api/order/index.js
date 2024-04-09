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
import config from "../../static/js/config/index.js"
import {request} from "../../static/js/utils/request.js"

// 获取会员用户信息
export function getUserInfoData(data){
	return request(config.baseApi+"/api/v1/user/userinfo","post",data)
}

//安全退出
export function safaOutLoginData(data){
	return request(config.baseApi+"/api/v1/outlogin","post",data)
}
//保存修改用户信息
export function saveUserInfoData(data){
	return request(config.baseApi+"/api/v1/user/update","post",data)
}

//检测手机号是否存在
export function userCellphoneData(data){
 	return request(config.baseApi+"/api/v1/exist_cellphone","post",data)
}
//获取验证码

export function getMsgCodeData(data){
	return request(config.baseApi+"/api/v1/vcode/send_code","post",data)
}

//重新绑定手机号
export function resetUserCellphoneData(data){
	return request(config.baseApi+"/api/v1/user/wechat_bind_mobile","post",data)
}
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
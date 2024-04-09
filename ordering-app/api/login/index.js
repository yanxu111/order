import config from '../../static/js/config/index.js'
import {request} from '../../static/js/utils/request.js'
//微信小程序获取登录的openid或uniid
export function getwechatOpenIdData(data){
	return request(config.baseApi+"/api/v1/wechat_openid","post",data)
}
//微信小程序会员登陆后数据保存到数据库
export function getWechatSaveUserInfoData(data){
 	return request(config.baseApi+"/api/v1/wechat_login_save","post",data)
}

//获取用户手机号
export function getWechatUserPhoneData(data){
	return request(config.baseApi+"/api/v1/dewxbizdata","post",data)
}
//保存手机号到数据库中
export function getPhoneSaveData(data){
	return request(config.baseApi+"/api/v1/user/wechat_login_bindcellphone","post",data)
}

//使用动态tonken检验登录是否合法
export function saveSafeUserData(data){
	return request(config.baseApi+"/api/v1/safe_user","post",data)
}
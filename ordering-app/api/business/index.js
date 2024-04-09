//商家接口api
//公共域名
import config from "../../static/js/config/index.js"
//封装request请求
import {request} from "../../static/js/utils/request.js"
// 显商家列表
export function getShopData(data){

	return request(config.baseApi+"/api/v1/business/shop","get",data)
}
//获取商家详细详情
export function getShopInfoData(data){
	return request(config.baseApi+"/api/v1/business/info","get",data)
}
//获取商家公告内容
export function getShopContentData(data){
	return request(config.baseApi+"/api/v1/business/notice","get",data)
}

//获取点菜区域(堂内点餐)
export function getShopAreaData(data){
	return request(config.baseApi+"/api/v1/business/hotel_area","get",data)
}
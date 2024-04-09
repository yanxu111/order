import config from '../../static/js/config/index.js'
import {request} from '../../static/js/utils/request.js'
//获取商家信息
export function getShopInfoData(data){
	return request(config.baseApi+"/api/v1/business/info","get",data)
}

//获取商家菜品分类
export function getShopGoodsData(data){
	return request(config.baseApi+"/api/v1/goods/classify","post",data)
}

//获取商家菜品详情
export function getGoodsItemsInfoData(data){
	return request(config.baseApi+"/api/v1/goods/show","post",data)
}

//获取菜品详情显示在菜品详情组件
export  function getGoodsDetailsDta(data){
	return  request(config.baseApi+"/api/v1/goods/details","post",data)
}
//套餐详情
export function getGoodsMealData(data){
	return request(config.baseApi+"/api/v1/meal/replace","post",data)
}
//套餐标题设置动态标头
export function getGoodsMealTitleData(data){
	return request(config.baseApi+"/api/v1/meal/details","post",data)
}
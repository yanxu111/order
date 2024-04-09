import config from '../../static/js/config/index.js'
import {request} from '../../static/js/utils/request.js'

// 保存选中的菜品/套餐到数据库
export function saveCartData(data){
	return request(config.baseApi+"/api/v1/user/cart/add","post",data)
}

//从数据库中获取购物车菜品/套餐数据
export function getCartData(data){
	return request(config.baseApi+"/api/v1/user/cart/show","post",data)
}
//清空数据库中购物车数据
export function deleteCartData(data){
	return request(config.baseApi+"/api/v1/user/cart/clear","post",data)
}
//减少/更新购物车中菜品的数量
export function setCartAmountData(data){
	return request(config.baseApi+"/api/v1/user/cart/set_amount","post",data)
}

//当菜品数量为0时，清空该菜品
export function clearCartAmountData(data){
	return request(config.baseApi+"/api/v1/user/cart/del","post",data)
}
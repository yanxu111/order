import config from '../../static/js/config/index.js'
import {request} from '../../static/js/utils/request.js'
//热门搜索
export function getPopularSearchData(){
	return	request(config.baseApi+"/api/v1/search/hotkeywords")
	}
	//商品搜索
	export function getShopSearchData(data){
		// console.log(data)
		return request(config.baseApi+"/api/v1/search/goods","get",data)
	}

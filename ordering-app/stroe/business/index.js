import {getShopData,getShopInfoData,getShopContentData,getShopAreaData} from "../../api/business/index.js"
export default{
	namespaced:true,
	state:{
		shops:[], //商家列表
		shopInfo:{},//商家详情
		shopContent:"",//商家公告
		shopArea:""//商家点餐区域（堂内扫码点餐时使用
	},
	mutations:{
		["SET_SHOP"](state,payload){
			// console.log(payload.shops)
			state.shops=payload.shops
		},
		["SET_SHOP_PAGE"](state,payload){
			state.shops.push(...payload.shops)
			// console.log(...payload.shops)
		},
		["SET_SHOP_INFO"](state,payload){
			state.shopInfo=payload.shopInfo
			// console.log(state.shopInfo)
 		},
		["SET_SHOP_CONTENT"](state,payload){
			state.shopContent=payload.shopContent
 		},
		//获取商家点餐区域
		["SHOP_AREA"](state,payload){
			state.shopArea=payload.shopArea.title
		}
	},
	actions:{
		getShop(context,payload){
 			getShopData(payload).then(res=>{
				if(res.code===200){
					context.commit("SET_SHOP",{shops:res.data})
					 if(payload.success){
						 payload.success()
					 }
				}
				//使用回调函数单独获取页码数据
				if(payload.complete){
					payload.complete(res.pageinfo)
				}
			})
		},
		getShopPage(context,payload){
			getShopData(payload).then(res=>{
			if(res.code===200){
				context.commit("SET_SHOP_PAGE",{shops:res.data})
			}
			})

		},
		// 获取商家详情信息
		getShopInfo(context,payload){
			getShopInfoData(payload).then(res=>{
 				if(res.code===200){
					context.commit("SET_SHOP_INFO",{shopInfo:res.data})
				}
			})
		},
		//获取商家公告
		getShopContent(context,payload){
			getShopContentData(payload).then(res=>{
		
				if(res.code===200){
					context.commit("SET_SHOP_CONTENT",{shopContent:res.data})
				}
			})
		},
		//获取点菜区域
		getShopArea(context,payload){
			getShopAreaData(payload).then(res=>{
				if(res.code===200){
					context.commit("SHOP_AREA",{shopArea:res.data})
				}
			})
		}
	}
}

import {getPopularSearchData,getShopSearchData} from '../../api/search/index.js'
export default{
	namespaced:true,
	state:{
		//设置搜索关键词
		keyWords:"",
		historyKeyWords:uni.getStorageSync("SET_HISTORY_KEYWORDS")?JSON.parse(uni.getStorageSync("SET_HISTORY_KEYWORDS")):[],
		popularSearch:[],
		shopSearch:[]
	},
	mutations:{
		["SET_KEYWORDS"](state,payload){
			state.keyWords=payload.keyWords
		},
		["SET_HISTORY_KEYWORDS"](state,payload){
			// 去除重复的历史搜索
			for(let i=0;i<state.historyKeyWords.length;i++){
				// console.log(state.historyKeyWords[i],payload.historyKeywords)
				if(state.historyKeyWords[i]===payload.historyKeyWords){
					// 删除数组中已存在的重复数据
					state.historyKeyWords.splice(i--,1)
				}
			}
				state.historyKeyWords.push(payload.historyKeyWords)
				// console.log(state.historyKeyWords)
				// 历史搜索记录应永久保存显示,所以存到本地缓存去获取,只能存储字符串
				uni.setStorageSync("SET_HISTORY_KEYWORDS",JSON.stringify(state.historyKeyWords))

		},
		//清空历史记录
		["DELETE_HISTORY_KEYWORDS"](state,payload){
			state.historyKeyWords=[]
			//删除本地缓存key
			uni.removeStorageSync("SET_HISTORY_KEYWORDS")
		},
		// 热门搜索
		["SET_POPULAR_SEARCH"](state,payload){
			state.popularSearch=payload.popularSearch
			// console.log(state.popularSearch)
		},
		//搜索菜品结果
		["SET_SEARCH_SHOP"](state,payload){
			state.shopSearch=payload.shopSearch
		},
		//搜索菜品结果上拉加载
		["SET_SEARCH_SHOP_REACH"](state,payload){
			state.shopSearch.push(...payload.shopSearch)
			// console.log(...payload.shopSearch)
		}
	},
	actions:{
		// 显示热门搜索
		getPopularSearch(context,payload){
			getPopularSearchData(payload).then(res=>{
				if(res.code===200){
					// console.log(res.data)
					 context.commit("SET_POPULAR_SEARCH",{popularSearch:res.data.splice(0,10)})
				}else{
					 context.commit("SET_POPULAR_SEARCH",{popularSearch:[]})
				}
				
			})
		},
		//显示搜索菜单结果
		getSearchShop(context,payload){
			getShopSearchData(payload).then(res=>{
				if(res.code===200){
					
					context.commit("SET_SEARCH_SHOP",{shopSearch:res.data})
					if(payload.success){
						payload.success(res.pageinfo.pagenum)
					}
				}else{
					context.commit("SET_SEARCH_SHOP",{shopSearch:[]})
				}
			})
		},
		// 搜索菜单结果上拉加载
		getSearchShopReach(context,payload){
			getShopSearchData(payload).then(res=>{
				if(res.code===200){
					context.commit("SET_SEARCH_SHOP_REACH",{shopSearch:res.data})
				}
			})
		}
	}
}
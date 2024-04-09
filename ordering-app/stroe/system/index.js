export default{
	namespaced:true, //命名空间
	state:{
		isIpx:false, //是否刘海屏
		plateform:1 //1：微信小程序 2：微信公众号
	},
	mutations:{
		// 设置isIpx
		["SET_ISIPX"](state,payload){
			// console.log(payload.isIpx)
			state.isIpx=payload.isIpx
		}
	}
	
}
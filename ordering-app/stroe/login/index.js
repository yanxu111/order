import {
	getwechatOpenIdData,
	getWechatSaveUserInfoData,
	getWechatUserPhoneData,
	getPhoneSaveData,
	saveSafeUserData
} from '../../api/login/index.js'
export default {
	namespaced: true,
	state: {
		openId: uni.getStorageSync("openId") ? uni.getStorageSync("openId") : "", //微信用户登录唯一标识
		token: uni.getStorageSync("token") ? uni.getStorageSync("token") : "", //会员认证唯一标识，后续用于做微信支付使用
		uid: uni.getStorageSync("uid") ? uni.getStorageSync("uid") : "", //会员唯一标识
		isLogin: uni.getStorageSync("openId") ? Boolean(uni.getStorageSync("openId")) : false //是否为登录状态
	},
	mutations: {
		//会员登陆
		["ISLOGIN"](state, payload) {
			state.openId=payload.openId
			state.token=payload.token
			state.uid=payload.uid
			state.isLogin=true
			uni.setStorageSync("openId", payload.openId)
			uni.setStorageSync("token", payload.token)
			uni.setStorageSync("uid", payload.uid)
			uni.setStorageSync("isLogin", true)
		},
		["OUT_LOGIN"](state,payload){
			state.openId=""
			state.token=""
			state.uid=""
			state.isLogin=false
			//清空缓存退出会员登陆
			uni.removeStorageSync("openId")
			uni.removeStorageSync("token")
			uni.removeStorageSync("uid")
			uni.removeStorageSync("isLogin")
		}
	},
	actions: {
		//微信小程序获取登录的openid或uniid
		getwechatOpenId(context, payload) {
			return getwechatOpenIdData(payload).then(res => {
				return res
			})
		},
		//微信小程序会员登陆后数据保存到数据库
		getWechatSaveUserInfo(contxt, payload) {
			return getWechatSaveUserInfoData(payload).then(res => {
 				return res
			})
		},
		//获取用户手机号
		getWechatUserPhone(context, payload) {
			return getWechatUserPhoneData(payload).then(res => {
				return res
			})
		},
		//保存手机号到数据库
		getPhoneSave(context, payload) {
			return getPhoneSaveData(payload).then(res => {
				return res
			})
		},
		saveSafeUser(context, payload) {
			saveSafeUserData({uid:context.rootState.login.uid,token:context.rootState.login.token,platform:context.rootState.system.plateform,...payload}).then(res => {
					if(payload.success){
						payload.success(res)
					}
			})
		}

	}
}

import {
	getUserInfoData,
	safaOutLoginData,
	saveUserInfoData
} from "../../api/my/index.js"

export default {
	namespaced: true,
	state: {
		userInfo: {} //会员用户信息
	},
	mutations: {
		//获取会员用户信息
		["GET_USER"](state, payload) {
			state.userInfo = payload.userInfo
		}
	},
	actions: {
		//获取会员用户信息
		getUserInfo(context, payload) {
			getUserInfoData({
				uid: context.rootState.login.uid,
				token: context.rootState.login.token,
				platform: context.rootState.system.plateform,
				...payload
			}).then(res => {
				if (res.code === 200) {
					context.commit("GET_USER", {
						userInfo: res.data
					})
				}
			})
		},
		//安全退出
		safaOutLogin(context, payload) {
			safaOutLoginData({
				uid: context.rootState.login.uid,
				platform: context.rootState.system.plateform
			}).then(res => {
				if (payload.success) {
					payload.success(res)
				}
			})
		},
		//保存修改用户信息
		saveUserInfo(context, payload) {
			saveUserInfoData({
				uid: context.rootState.login.uid,
				token: context.rootState.login.token,
				platform: context.rootState.system.plateform,
				...payload
			}).then(res => {
				 if(payload.success){
					 payload.success(res)
				 }
			})
		}
	}
}

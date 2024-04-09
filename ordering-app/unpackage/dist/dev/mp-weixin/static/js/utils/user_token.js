// 单独封装会员token认证,方便后续多场景调用
function safeUser(vThis, branchShopId, tableCode, callBack) {
	// console.log(branchShopId)
	//vThis.$store.dispatch调用vuex中actions方法
	vThis.$store.dispatch("login/saveSafeUser", {
		branchShopId,
		tableCode,
		success: (res) => {
 			if (res.code !== 200) {
				uni.showToast({
					title: "登录失效",
					icon: "error",
					duration: 2000,
					success: () => {
						setTimeout(() => {
							//清空缓存跳转登录页面
							vThis.$store.commit("login/OUT_LOGIN")
							uni.navigateTo({
								url: `/pages/login/index?branch_shop_id=${branchShopId}&table_code=${tableCode}`
							})
						}, 2000)
					}
				})
			} else {
				if (callBack) {
					callBack()
				}
			}
		}
	})
}
export default {
	safeUser
}

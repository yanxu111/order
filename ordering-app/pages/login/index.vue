<template>
	<view class="page">
		<view class="other-login-text">
			<view class="line"></view>
			<view class="text">推荐以下方式登录</view>
			<view class="line"></view>
		</view>
		<view class="user-info">
			<view class="user-header">
				<view style="width:90%;">用户头像</view>
				<button class="button"  open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<image class="img" :src="userheadImageUrl"></image>
				</button>
			</view>
			<view class="user-header">
				<view>用户昵称</view>
				<input type="nickname" class="text" placeholder="点击此处获取微信昵称" @change="inputInfo" />
			</view>
		</view>
		<view class="other-login">
			<button class="wx-login" @click="wxLogin()">微信授权登录</button>
		</view>
		<bind_mobile :show="isBind" :sessionKey="sessionKey" @close="isBind=false"></bind_mobile>
	</view>
</template>

<script>
	import {
		mapActions,
		mapMutations
	} from 'vuex'
	import mapInfo from '../../static/js/utils/qqmap-wx-jssdk.js'
	export default {
		name: "login",
		data() {
			return {
				sessionKey: "", //获取手机号所需的key
				userInfoName: "",
				userheadImageUrl: "../../static/images/main/my.png", //用户临时头像，用于保存个人信息
				isBind: false //是否显示绑定手机号组件
			}
		},
		onLoad(opts) {
			this.province = "" //省份
			this.city = "" //城市
			this.branch_shop_id = opts.branch_shop_id ? opts.branch_shop_id : ""
			this.table_code = opts.table_code ? opts.table_code : ""
			// 实例化
			this.map = new mapInfo({
				key: "OG4BZ-DEPHF-36FJE-NLIJP-H3JV3-2EFWR"
			})
			// 如果获取失败 再minafest.json中的mp-weixin添加"requiredPrivateInfos": [
			//    "getLocation"
			//  ]
			uni.getLocation({
				type: 'gcj02',
				success: (res) => {
					this.latitude = res.latitude
					this.longitude = res.longitude
					// 调用脚本获取地理位置信息方法
					this.map.reverseGeocoder({
						location: {
							longitude: this.longitude,
							latitude: this.latitude
						},
						success: (res) => {
							// console.log(res)
							this.province = res.result.address_component.province
							this.city = res.result.address_component.city
						}
					})
				},
				fail: (ex) => {
					console.log(ex)
				}
			});
		},
		methods: {
			wxLogin() {
				if (this.userInfoName === "" || this.userheadImageUrl === "") {
					uni.showToast({
						title: "请手动获取用户信息",
						icon: "none"
					})
				} else {
					uni.login({
						provider: 'weixin', //使用微信登录
						success: async (loginRes) => {
							// console.log(loginRes)
							let openData = await this.getwechatOpenId({
								code: loginRes.code,
								appid: "wx962cfb365198760f",
								secret: "6f00d68114150b3db7e09d531fe44b4d"
							})
							this.sessionKey = openData.data.session_key
							// 获取用户信息
							let userInfo = {
								"nickname": this.userInfoName,
								"sex": 1,
								"openid": openData.data.openid,
								"province": this.province,
								"city": this.city,
								"headimgurl": this.avatarUrl
							};
							// 保存数据
							let userInfoData = await this.getWechatSaveUserInfo({
								branch_shop_id: this.branch_shop_id,
								table_code: this.table_code,
								userinfo: JSON.stringify(userInfo)
							})
							
							if (userInfoData.code === 200) {
								// 保存成功，获取相关信息保存到本地缓存
								this.ISLOGIN({
									openId: userInfoData.data.open_id,
									token: userInfoData.data.token,
									uid: userInfoData.data.uid
								})
								if (userInfoData.data.isbind === '1') {
									// 如果绑定了手机则登陆成功直接返回上一页
									uni.showToast({
										title: "登陆成功",
										icon: 'success',
										duration: 2000,
										success: () => {
											setTimeout(() => {
												uni.redirectTo({
													url:"/pages/main/main"
												})
											}, 2000)

										}
									})

								} else {
									//没有绑定手机，显示绑定手机组件进行绑定手机号
									this.isBind = true
								}

							} else {
								uni.showToast({
									title: userInfoData,
									icon: 'none',
									duration: 2000
								})
							}
						}
					});
				}

			},
			// 获取头像临时路径
			onChooseAvatar(e) {
				// console.log(e)
				this.userheadImageUrl = e.detail.avatarUrl
			},
			//获取用户微信昵称
			inputInfo(e) {
				this.userInfoName = e.detail.value
			},
			...mapMutations({
				"ISLOGIN": "login/ISLOGIN"
			}),
			...mapActions({
				getwechatOpenId: 'login/getwechatOpenId', //微信小程序获取登录的openid或uniid
				getWechatSaveUserInfo: "login/getWechatSaveUserInfo" //微信小程序保存用户登陆信息到数据库
			})
		}

	}
</script>

<style scoped>
	.page {
		width: 100%;
		min-height: 100vh;
		overflow: hidden;
		background-color: #FFFFFF;
	}

	.other-login-text {
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.other-login-text .line {
		width: 30%;
		height: 1px;
		background-color: #CCCCCC;
	}

	.other-login-text .text {
		font-size: 28rpx;
		color: #333333
	}

	.other-login {
		width: 100%;
		display: flex;
		justify-content: center;
	}


	.user-info {
		width: 100%;
		height: 500rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.user-info .user-header {
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #CCCCCC;

	}
	.user-info .user-header .button{
		width: 130rpx;
		height: 80rpx;
		text-align: center;
  	}
	.user-info .user-header .button .img {
		width: 100%;
		height: 80rpx;
		background-position: initial;
 		background-repeat: no-repeat;
 	}

	.user-info .user-header .text {
		width: 60%;
		height: 80rpx;
		text-align: right;
		padding: 0 30rpx;
	}


	.weui-input {
		width: 80%;
		height: 80rpx;
		margin: 0 auto;
		border-radius: 5rpx;
		font-size: 32rpx;
		text-align: center;
		line-height: 80rpx;
		top: 20rpx;
	}

	.other-login .wx-login {
		width: 80%;
		height: 80rpx;
		background-color: #21B319;
		margin: 0 auto;
		border-radius: 5px;
		color: #FFFFFF;
		font-size: 32rpx;
		text-align: center;
		line-height: 80rpx;
	}
</style>

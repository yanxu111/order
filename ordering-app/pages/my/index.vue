<template>
	<view class="page">
		<view class="status_bar bg-color"></view>
		<view :class="{header:true,ipx:false}">
			<!-- <view class="back">
				<view class="back-icon" @click="goBack()"></view>
			</view> -->
			<!-- <view class="title">我的</view> -->
			<view :class="{'user-info':true,ipx:false}">
				<view class="head">
					<image
						:src="isLogin?'https://diancan.glbuys.com/userfiles/head/708879407.png':'../../static/images/main/my.png'">
					</image>
				</view>
				<view class="nickname">{{isLogin?userInfo.nickname:"昵称"}}</view>
				<view class="show-total">
					<view class="text">积分：{{isLogin?userInfo.points:0}}</view>
				</view>
				<view class="show-balance">
					<view class="text">余额：{{isLogin?userInfo.balance:0}}</view>
				</view>
			</view>
		</view>
		<view class="pannel-main">
			<view class="list"
				@click="userPush(`/pages/myorder/index?branch_shop_id=${branch_shop_id}&table_code=${table_code}`)">
				<view class="text">
					我的订单</view>
				<view class="arrow"></view>
			</view>
			<view class="list"
				@click="userPush(`/user_pages/order/index?branch_shop_id=${branch_shop_id}&table_code=${table_code}`)">
				<view class="text">个人资料</view>
				<view class="arrow"></view>
			</view>
			<view class="list"
				@click="userPush(`/user_pages/order/index?branch_shop_id=${branch_shop_id}&table_code=${table_code}`)">
				<view class="text">绑定手机</view>
				<view class="arrow"></view>
			</view>
			<button type="button" class="out-btn" @click="outLogin()">{{isLogin?'安全退出':'登录'}}</button>
		</view>
	</view>
</template>

<script>
	import {
		mapActions,
		mapState,
		mapMutations
	} from "vuex"
	export default {
		name: "my",
		data() {
			return {
				branch_shop_id: "",
				table_code: ""
			}
		},
		onLoad(opts) {
			this.branch_shop_id = opts.branch_shop_id ? opts.branch_shop_id : ""
			this.table_code = opts.table_code ? opts.table_code : ""
			this.getUserInfo({
				branch_shop_id: this.branch_shop_id,
				table_code: this.table_code
			})
		},
		methods: {
			...mapActions({
				getUserInfo: "my/getUserInfo", //获取用户会员信息
				safaOutLogin: "my/safaOutLogin" //安全退出
			}),
			...mapMutations({
				"OUT_LOGIN": "login/OUT_LOGIN" //退出登录，清空本地缓存用户信息
			}),
			//跳转订单页面/个人资料页面/绑定手机号页面
			userPush(url) {
				// 如果登录了跳转,否则跳转到登陆页面
				if (this.isLogin) {
					uni.navigateTo({
						url
					})
				} else {
					uni.showToast({
						title: "请先登录",
						duration: 2000,
						icon: "none"
					})
				}
			},
			// 安全推出/登录
			outLogin() {
				if (this.isLogin) {
					// 如果登陆了:安全退出
					// 清空本地缓存
					this.safaOutLogin({
						success: (res) => {
							if (res.code === 200) {
								uni.showToast({
									title: res.data,
									icon: "success",
									duration: 2000,
									success: () => {
										this.OUT_LOGIN()
										uni.redirectTo({
											url:"/pages/main/main"
										})
									}
								})
							}else{
								uni.showToast({
									title:res.data,
									icon:"error",
									duration:2000
								})
							}
						}
					})
				} else {
					// 否则:登录
					uni.navigateTo({
						url: `/pages/login/index?branch_shop_id=${this.branch_shop_id}&table_code=${this.table_code}`
					})
				}
			},
		},
		computed: {
			...mapState({
				userInfo: state => state.my.userInfo, //会员用户信息
				isLogin: state => state.login.isLogin, //会员是否登录
			})
		}
	}
</script>

<style scoped>
	.page {
		width: 100%;
		height: 100vh;
		overflow: hidden;
		background-color: #EFEFEF;
	}

	.status_bar.bg-color {
		background-color: #880000;
	}

	.header {
		width: 100%;
		height: 320rpx;
		background-color: #880000;
		position: relative;
		z-index: 1;
		overflow: hidden;
	}

	.header .back {
		width: 80rpx;
		height: 80rpx;
		position: absolute;
		z-index: 1;
		left: 20rpx;
		top: 55rpx;
	}

	.header .back .back-icon {
		width: 40rpx;
		height: 40rpx;
		background-image: url("~@/static/images/common/back.png");
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center;
	}

	.header.ipx .back {
		top: 100rpx;
	}

	.header.ipx {
		height: 425rpx;
	}

	.header .title {
		width: 100%;
		height: auto;
		text-align: center;
		font-size: 32rpx;
		color: #FFFFFF;
		margin-top: 60rpx;
	}

	.header.ipx .title {
		margin-top: 105rpx;
	}

	.header .user-info {
		width: 100%;
		height: 180rpx;
		position: relative;
		z-index: 1;
		margin-top: 20rpx;
	}

	.header.ipx .user-info {
		margin-top: 40rpx;
	}

	.header .head {
		width: 125rpx;
		height: 125rpx;
		position: absolute;
		z-index: 1;
		left: 30rpx;
		top: 0rpx;
	}

	.header .head image {
		width: 100%;
		height: 100%;
		border-radius: 100%;
	}

	.header .nickname {
		width: auto;
		height: auto;
		position: absolute;
		z-index: 1;
		left: 200rpx;
		top: 0rpx;
		font-size: 28rpx;
		color: #FFFFFF
	}

	.header .show-total {
		width: auto;
		height: auto;
		position: absolute;
		z-index: 1;
		left: 200rpx;
		top: 55rpx;
		display: flex;
	}

	.header .show-total .text {
		font-size: 28rpx;
		color: #FFFFFF;
		margin-right: 20rpx;
	}

	.header .show-balance {
		width: auto;
		height: auto;
		position: absolute;
		z-index: 1;
		left: 200rpx;
		top: 105rpx;
		display: flex;
	}

	.header .show-balance .text {
		font-size: 28rpx;
		color: #FFFFFF;
		margin-right: 20rpx;
	}

	.pannel-main {
		width: 100%;
		height: auto;
		background-color: #FFFFFF;
		margin-top: 40rpx;
		background-color: #FFFFFF;
		padding-bottom: 40rpx;
	}

	.pannel-main .list {
		width: 100%;
		height: 80rpx;
		border-bottom: 1px solid #EFEFEF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		padding-left: 60rpx;
		padding-right: 20rpx;
	}

	.pannel-main .list .text {
		font-size: 28rpx;
		color: #333333
	}

	.pannel-main .list .arrow {
		width: 40rpx;
		height: 40rpx;
		background-image: url("~@/static/images/user/right_arrow.png");
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center;
	}

	.out-btn {
		width: 526rpx;
		height: 80rpx;
		margin: 0 auto;
		background-color: #880000;
		color: #FFFFFF;
		font-size: 32rpx;
		margin-top: 40rpx;
	}
</style>

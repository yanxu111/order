<template>
	<view class="page">
		<view class="head-wrap">
			<view class="text">头像</view>
			<view class="head">
				<button open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<image :src="userheadImageUrl"></image>
				</button>
			</view>
		</view>
		<view class="list">
			<view class="text">昵称</view>
			<view class="input-wrap">
				<input type="nickname" class="input" placeholder="请输入昵称" @change="inputInfo" v-model="nickName" />
			</view>
		</view>
		<view class="list">
			<view class="text">姓名</view>
			<view class="input-wrap">
				<input type="text" class="input" placeholder="请输入姓名" v-model="proName" />
			</view>
		</view>
		<view class="list" @click="changeGender">
			<view class="text">性别</view>
			<view class="input-wrap">
				<view class="text-tip">{{userGender==='1'?'男':userGender==='2'?'女':''}} </view>
				<view class="arrow"></view>
			</view>
		</view>
		<button type="button" class="submit-btn" @click="submitUserInfo()">保存</button>
	</view>
</template>

<script>
	import {
		mapActions,
		mapState
	} from 'vuex'
	export default {
		name: "profile",
		data() {
			return {
				nickName: "", //昵称
				proName: "", //用户姓名
				userheadImageUrl: "", //头像图片路径
				userGender: "", //用户性别
				saveImage: "", //保存数据库的头像
				isSubmit: true //防止重复提交
			}
		},
		onLoad(opts) {
			this.branch_shop_id = opts.branch_shop_id ? opts.branch_shop_id : ""
			this.table_code = opts.table_code ? opts.table_code : ""
			this.getUserInfo({
				branch_shop_id: this.branch_shop_id
			})

		},
		methods: {
			...mapActions({
				getUserInfo: "my/getUserInfo", //获取用户会员信息
				saveUserInfo: "my/saveUserInfo" //保存修改用户信息
			}),
			// 获取头像临时路径
			onChooseAvatar(e) {
				this.userheadImageUrl = e.detail.avatarUrl
				uni.uploadFile({
					url: this.$config.baseApi + "/api/v1/user/uploadhead", //仅为示例，非真实的接口地址
					filePath: this.userheadImageUrl,
					name: 'head',
					formData: { //数据
						"uid": this.uid, //用户uid
						"token": this.token, //用户认证token
						"platform": this.platform //用户登录平台
					},
					success: (uploadFileRes) => {
						this.saveImage = JSON.parse(uploadFileRes.data).data.msbox
					}
				});
			},
			//获取用户微信昵称
			inputInfo(e) {
				this.nickName = e.detail.value
			},
			//选择性别
			changeGender() {
				uni.showActionSheet({
					itemList: ['男', '女'],
					success: (res) => {
						this.userGender = (res.tapIndex + 1).toString()
						console.log(this.userGender)
					},
					fail: (res) => {
						console.log(res.errMsg);
					}
				});
			},
			//保存用户信息
			submitUserInfo() {
				if (isSubmit) {
					this.isSubmit = false
					if (this.proName === "" || this.nickname === "" || this.userGender === "" || this.saveImage === "") {
						uni.showToast({
							title: "请完善必填信息",
							icon: 'none',
							duration: 2000
						})
					} else {
						this.saveUserInfo({
							branch_shop_id: this.branch_shop_id,
							head: this.saveImage,
							name: this.proName,
							nickname: this.nickName,
							gender: this.userGender,
							success: (res) => {
								if (res.code === 200) {
									this.isSubmit = true
									uni.showToast({
										title: "提交成功",
										icon: 'success',
										duration: 2000,
										success: () => {
											setTimeout(() => {
												uni.navigateBack({
													delta: 1
												})
											}, 2000)
										}
									})
								} else {
									this.isSubmit = true
									uni.showToast({
										title: res.data,
										icon: 'error',
										duration: 2000
									})
								}
							}
						})
					}
				}


			}
		},
		computed: {
			...mapState({
				userInfo: state => state.my.userInfo, //用户会员信息
				uid: state => state.login.uid, //用户uid
				token: state => state.login.token, //用户认证token
				platform: state => state.system.plateform //用户登录平台
			})
		},
		watch: {
			userInfo(e) {
				this.nickName = e.nickname
				this.proName = e.name
				this.userheadImageUrl = e.head
				this.userGender = e.gender
			}
		}

	}
</script>

<style scoped>
	.page {
		width: 100%;
		height: 100vh;
		overflow: hidden;
		background-color: #FFFFFF;
	}

	.head-wrap {
		width: 100%;
		height: 120rpx;
		border-bottom: 1px solid #EFEFEF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		padding: 0px 30rpx;
	}

	.head-wrap .text,
	.list .text {
		font-size: 28rpx;
		color: #333333;
	}

	.head-wrap .head {
		width: 100rpx;
		height: 100rpx;
	}

	.head-wrap .head button {
		width: 100%;
		height: 100%;
		border-radius: 100%;
		padding: 0;
		/* 移除内边距 */
		outline: none;
		/* 移除点击按钮时出现的轮廓 */
		background-size: cover;
		/* 背景图片覆盖整个按钮 */
		background-position: center;
		/* 图片居中显示 */
		border: none;
		/* 移除边框 */
	}

	.head-wrap .head button image {
		width: 100%;
		height: 100%;

	}

	.list {
		width: 100%;
		height: 80rpx;
		border-bottom: 1px solid #EFEFEF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		padding: 0px 30rpx;
	}

	.list .input-wrap {
		width: auto;
		height: 100%;
		display: flex;
		align-items: center;
	}

	.list .input-wrap .input {
		width: 380rpx;
		height: 66rpx;
		font-size: 28rpx;
		text-align: right;
	}

	.list .arrow {
		width: 40rpx;
		height: 40rpx;
		background-image: url("~@/static/images/user/right_arrow.png");
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center;
		margin-left: 20rpx;
	}

	.list .text-tip {
		font-size: 28rpx;
		color: #333333;
	}

	.submit-btn {
		width: 200rpx;
		height: 60rpx;
		margin: 0 auto;
		background-color: darkred;
		color: #FFFFFF;
		font-size: 28rpx;
		margin-top: 40rpx;
		line-height: 60rpx;
		border-radius: 4px;
	}
</style>

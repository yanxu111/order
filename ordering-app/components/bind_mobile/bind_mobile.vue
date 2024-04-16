<template>
	<view class="mobile-mask" v-show="show">
		<button class="bind-mobile-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">绑定手机</button>
	</view>
</template>

<script>
	import {
		mapActions
	} from 'vuex'
	export default {
		name: "bind-mobile",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			sessionKey: {
				type: String,
				default: ""
			}
		},
		methods: {
			// 获取手机号
			async getPhoneNumber(e) {
				let encryptedData = e.detail.encryptedData
				let iv = e.detail.iv
				//解密手机号
				let userPhone = await this.getWechatUserPhone({
					encrypteddata: encryptedData,
					iv: iv,
					session_key: this.sessionKey
				})
				// if(userPhone.code===200){
				// 拿到手机号保存数据库中					
				// 保存手机号
				let phoneNumer = await this.getPhoneSave({
					uid: uni.getStorageSync("uid"),
					token: uni.getStorageSync("token"),
					// cellphone:userPhone.data.phoneNumber,
					cellphone: "18604433515",
					platform: "1"
				})
				if (phoneNumer.code === 200) {
					//关闭组件
					this.$emit("close")
					uni.showToast({
						title: "绑定成功，正在返回上一页......",
						icon: 'none',
						duration: 3000,
						success: () => {
							setTimeout(() => {
								uni.redirectTo({
									url:'/pages/main/main'
								})
							}, 3000)

						}
					})
				} else {
					uni.showToast({
						title: phoneNumer.data,
						icon: 'none',
						duration: 3000
					})
				}
				// }else{
				// 	uni.showToast({
				// 		title:userPhone.data,
				// 		icon:'none',
				// 		duration:3000
				// 	})
				// }
			},
			...mapActions({
				getWechatUserPhone: "login/getWechatUserPhone", //解密获取手机号
				getPhoneSave: "login/getPhoneSave" //保存手机号到数据库
			})
		}
	}
</script>

<style scoped>
	.mobile-mask {
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 99;
		left: 0;
		top: 0;
		background-color: rgba(0, 0, 0, 0.8)
	}

	.bind-mobile-btn {
		width: 70%;
		height: 80rpx;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: #28A622;
		text-align: center;
		line-height: 80rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		border-radius: 5px;
	}
</style>

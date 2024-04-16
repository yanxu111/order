<template>
	<view class="page">
		<view class="tip-wrap">
			<view class="tip-icon"></view>
			<view class="text">新手机号验证后，即可绑定成功！</view>
		</view>
		<view class="input-wrap">
			<input type="text" placeholder="手机号" class="cellphone" v-model="cellPhone" />
		</view>
		<view class="input-wrap">
			<view class="msg-code">
				<input type="text" placeholder="请输入短信验证码" v-model="msgCode" />
			</view>
			<view :class="{'msg-code-btn':true, active:isActive}" @click="sendMsgCode()">{{msgText}}</view>
		</view>
		<button type="button" class="submit-btn" @click="saveCellphone()">确认绑定</button>
	</view>
</template>

<script>
	import {
		mapActions
	} from 'vuex'
	export default {
		name: "bind-cellphone",
		data() {
			return {
				cellPhone: "", //绑定手机号
				msgCode: "", //短信验证码
				isSubmit: true, //防止重复提交
				isActive: false, //验证码按钮点击状态
				msgText: "获取验证码" //动态设置验证码文字

			}
		},
		onLoad() {
			this.timer = null //全局定义一个定时器
		},
		onUnload() {
			// 离开此页面,清除定时器
			clearInterval(this.timer)
		},
		methods: {
			...mapActions({
				userCellphone: "my/userCellphone", //检测手机号是否存在
				getMsgCode: "my/getMsgCode", //获取验证码
				resetUserCellphone: "my/resetUserCellphone" //重新绑定手机号
			}),
			//点击获取验证码
			async sendMsgCode() {
				if (this.cellPhone.trim() === "") {
					uni.showToast({
						title: '请填写手机号',
						icon: 'none',
						duration: 2000
					})
					return
				} else if (!this.cellPhone.match(/^1[0-9][0-9]\d{8}$/)) {
					uni.showToast({
						title: "请输入正确的手机号",
						icon: 'none',
						duration: 2000
					})
					return
				} else {
						// 检测手机号是否存在
						let cellState = await this.userCellphone({
							cellphone: this.cellPhone
						})
						if (cellState.code === 200) {
 							if (cellState.data.exist === 1) {
								uni.showToast({
									title: '当前输入的手机号已存在',
									icon: 'none',
									duration: 2000
								})
							} else {
								let msg = await this.getMsgCode({
									cellphone: this.cellPhone
								})
								if (msg.code === 200) {
									this.isActive = true
									uni.showModal({
										title: '验证码',
										content: msg.data.sms_code.toString(),
										showCancel: false,
										success: (res) => {
											if (res.confirm) {
												this.msgCode = msg.data.sms_code.toString()
											}
										}
									});
									let time = 10
									// 创建一个timer定时器 总时长为10s
									this.timer = setInterval(() => {
										if (time <= 0) {
											clearInterval(this.timer) //清空定时器
											this.msgText = "获取验证码"
											this.isActive = false
										} else {
											this.msgText = time + "s"
											time--
										}
									}, 1000)
								} else {
									uni.showToast({
										title: msg.data,
										icon: 'none',
										duration: 2000
									})
								}
							}
						} else {
 							uni.showToast({
								title: cellState.data,
								icon: 'none',
								duration: 2000
							})
						}
					 
				}
			},
			// 提交绑定手机号
			saveCellphone() {
				if (this.msgCode.trim() === "") {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none',
						duration: 2000
					})
				} else {
					this.isSubmit=false
					this.resetUserCellphone({
						cellphone: this.cellPhone,
						sms_code: this.msgCode,
						completed: (res) => {
							if (res.code === 200) {
								uni.showToast({
									title: res.data,
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
							}else{
							uni.showToast({
								title:res.data,
								icon:'error',
								duration:2000
							})	
							}
							this.isSubmit=true
						}
					})
				}
			}
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

	.tip-wrap {
		width: 100%;
		height: 100rpx;
		background-color: #f3f5c4;
		display: flex;
		box-sizing: border-box;
		align-items: center;
		padding-left: 40rpx;
		margin-bottom: 40rpx;
	}

	.tip-wrap .tip-icon {
		width: 40rpx;
		height: 40rpx;
		background-image: url("~@/static/images/user/tip.png");
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
		margin-right: 20rpx;
	}

	.tip-wrap .text {
		font-size: 28rpx;
		color: #ac7700;
	}

	.input-wrap {
		width: 90%;
		height: 80rpx;
		background-color: #FFFFFF;
		border: 1px solid #EFEFEF;
		margin: 0 auto;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding-left: 20rpx;
		border-radius: 5px;
		margin-bottom: 20rpx;
	}

	.input-wrap .cellphone {
		width: 90%;
		height: 80%;
		font-size: 28rpx;
	}

	.input-wrap .msg-code {
		width: 70%;
		height: 100%;
		border-right: 1px solid #EFEFEF
	}

	.input-wrap .msg-code input {
		width: 100%;
		height: 100%;
		font-size: 28rpx;
	}

	.input-wrap .msg-code-btn {
		width: 29%;
		height: 100%;
		text-align: center;
		line-height: 80rpx;
		font-size: 28rpx;
		color: darkred
	}

	.input-wrap .msg-code-btn.active {
		color: #717376;
		/* //view禁止点击事件 */
		pointer-events: none;
	}

	.input-wrap .msg-code-btn image {
		width: 80%;
		height: 80%;
		margin-top: 9rpx;
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

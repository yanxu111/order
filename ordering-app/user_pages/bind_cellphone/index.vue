<template>
	<view class="page">
		<view class="tip-wrap">
			<view class="tip-icon"></view>
			<view class="text">新手机号验证后，即可绑定成功！</view>
		</view>
		<view class="input-wrap">
			<input type="text" placeholder="手机号" class="cellphone" />
		</view>
		<view class="input-wrap">
			<view class="msg-code">
				<input type="text" placeholder="请输入短信验证码" />
			</view>
			<view :class="{'msg-code-btn':true, active:false}">点击获取验证码</view>
		</view>
		<button type="button" class="submit-btn">确认绑定</button>
	</view>
</template>

<script>
	export default {
		name: "bind-cellphone",

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
		color: #717376;
	}

	.input-wrap .msg-code-btn.active {
		color: darkred
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

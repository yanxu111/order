<template>
	<view class="page">
		<view class="status_bar bg-color"></view>
		<view :class="{header:true,ipx:false}">
			<!-- <view class="back">
				<view class="back-icon" @click="goBack()"></view>
			</view> -->
			<view class="title">我的</view>
			<view :class="{'user-info':true,ipx:false}">
				<view class="head">
					<image src="../../static/images/main/kfc.jpg"></image>
				</view>
				<view class="nickname">熬熬熬</view>
				<view class="show-total">
					<view class="text">积分：22</view>
				</view>
				<view class="show-balance">
					<view class="text">余额：22</view>
				</view>
			</view>
		</view>
		<view class="pannel-main">
			<view class="list">
				<view class="text">我的订单</view>
				<view class="arrow"></view>
			</view>
			<view class="list">
				<view class="text">个人资料</view>
				<view class="arrow"></view>
			</view>
			<view class="list">
				<view class="text">绑定手机</view>
				<view class="arrow"></view>
			</view>
			<button type="button" class="out-btn">安全退出</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my",
 
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

<template>
	<view class="tags">
		<view :class="{item:true, active:true}">已付款</view>
		<view :class="{item:true, active:false}">退款</view>
	</view>
</template>

<script>
	export default {
		name: "tags"
	}
</script>

<style scoped>
	/* #ifdef H5 */
	.tags {
		width: 100%;
		height: 80rpx;
		background-color: #FFFFFF;
		border-bottom: 1px solid #EFEFEF;
		display: flex;
		position: fixed;
		z-index: 10;
		left: 0px;
		top: 85rpx;
	}

	/* #endif */
	/* #ifndef H5 */
	.tags {
		width: 100%;
		height: 80rpx;
		background-color: #FFFFFF;
		border-bottom: 1px solid #EFEFEF;
		display: flex;
		position: fixed;
		z-index: 10;
		left: 0px;
		top: 0px;
	}

	/* #endif */
	.tags .item {
		flex: 1;
		height: 100%;
		font-size: 28rpx;
		color: #333333;
		text-align: center;
		line-height: 80rpx;
	}

	.tags .item.active {
		border-bottom: 1px solid #E30019;
	}
</style>

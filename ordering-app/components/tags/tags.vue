<template>
	<view class="tags">
		<view :class="{item:true, active:state==='0'?true:false}"
			@click="goPage(`/pages/myorder/index?branch_shop_id=${branch_shop_id}&table_code=${table_code}&status=0`)">
			已付款</view>
		<view :class="{item:true, active:state==='-2'?true:false}"
			@click="goPage(`/pages/myorder/refund?branch_shop_id=${branch_shop_id}&table_code=${table_code}&status=-2`)">
			退款</view>
	</view>
</template>

<script>
	export default {
		name: "tags",
		props: {
			branch_shop_id: {
				type: String,
				default: ""
			},
			table_code: {
				type: String,
				default: ""
			},
			state: {
				type: String,
				default: ""
			}
		},
		methods:{
			goPage(url){
				uni.redirectTo({
					url
				})
			}
		}
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
		background-color: #EFEFEF;
	}
</style>

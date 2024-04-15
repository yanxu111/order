<template>
	<view class="page">
		<tags :branch_shop_id="branch_shop_id" :table_code="table_code" :state="-2"></tags>
		<view class="order-main" v-if="refundData.length>0">
			<view class="order-list" v-for="(item,index) in refundData" :key="index">
				<view class="order-info">
					<view class="shop-name">{{item.title}}</view>
					<view class="order-time">下单时间：{{item.order_time}}</view>
					<view class="ordernum-status">
						<view class="ordernum">订单编号：{{item.ordernum}}</view>
					</view>
					<view class="area-table" v-if="table_code">
						<view class="area">区域：{{item.hotel_area_title}}</view>
						<view class="table-code">桌号：{{item.table_code}}</view>
					</view>
					<view class="pick-code">取餐码：{{item.pick_code}}</view>
					<view class="remarks">备注：{{item.refund_content?item.refund_content:'无'}}</view>
				</view>
				<view class="order-desc">
					<view class="goods-list-main">
						<view class="goods-list">
							<view class="image">
								<image :src="item.image"></image>
							</view>
							<view class="goods-info">
								<view class="title">{{item.title}}</view>
								<view class="info-text">x{{item.refund_amount}}</view>
								<view class="info-text">￥{{item.price}}</view>
								<view class="info-text">包装费：￥{{item.pack_price}}</view>
								<view class="is-meal">套餐单品：{{item.is_meal==='1'?'是':'否'}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="price-status">
					<view class="price">退款：￥{{item.refund_total}}</view>
				</view>
			</view>
		</view>
		<view class="no-data" v-else>没有退款订单！</view>
	</view>
</template>

<script>
import { mapActions,mapState } from 'vuex'
 	export default {
		name: "refund-order",
		data() {
			return {
				branch_shop_id: "",
				table_code: "",
 			}
		},
		onLoad(opts) {
			this.branch_shop_id = opts.branch_shop_id ? opts.branch_shop_id : ""
			this.table_code = opts.table_code ? opts.table_code : ""
		},
		onShow() {
			this.pageNum = 1 //当前页码
			this.pageMax = 0 //最大页码数
			this.refundOrderInfo({
				page: 1,
				completed: (res) => {
					this.pageMax = res.pagenum
				}
			})
		},
		methods:{
			...mapActions({
				refundOrderInfo:"order/refundOrderInfo", //查看退款订单
				refundOrderPage:"order/refundOrderPage" //退款订单分页数据
			})
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.pageNum = 1
			this.refundOrderInfo({
				"page": this.pageNum,
				success: () => {
					uni.stopPullDownRefresh();
				}
			})
		},
		// 上拉加载更多数据
		onReachBottom() {
			if (this.pageNum < this.pageMax) {
				this.pageNum++
				this.refundOrderPage({
					"page": this.pageNum,
 				})
			}
		},
		computed:{
			...mapState({
				refundData:state=>state.order.refundData //退款订单
			})
		}
	}
</script>

<style scoped>
	.page {
		width: 100%;
		min-height: 100vh;
		background-color: #FFFFFF;
		margin-top: 80rpx;
		overflow: hidden;
	}

	.order-main {
		width: 100%;
	}

	.order-main .order-list {
		width: 100%;
		border-bottom: 1px solid #f17f1f;
	}

	.order-main .order-list .order-info {
		width: 100%;
		border-bottom: 1px solid #EFEFEF;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.order-main .order-list .ordernum-status {
		width: 100%;
		display: flex;
		font-size: 28rpx;
		justify-content: space-between;
		margin-top: 20rpx;
	}

	.order-main .order-list .area-table {
		width: 100%;
		display: flex;
		font-size: 28rpx;
		margin-top: 20rpx;
	}

	.order-main .order-list .area-table .area {
		margin-right: 40rpx;
	}

	.order-main .order-list .order-time {
		font-size: 28rpx;
	}

	.order-main .order-list .pick-code {
		font-size: 28rpx;
		color: #E30019;
		margin-top: 20rpx;
	}

	.order-main .order-list .remarks {
		font-size: 28rpx;
		margin-top: 20rpx;
	}

	.order-main .order-list .shop-name {
		width: 100%;
		font-size: 28rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		font-weight: bold;
		color: #E30019
	}

	.order-main .order-desc {
		width: 100%;
	}

	.order-main .goods-list-main {
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		border-bottom: 1px solid #EFEFEF;
	}

	.order-main .order-desc .goods-list {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.order-main .order-desc .goods-list .image {
		width: 120rpx;
		height: 120rpx;
	}

	.order-main .order-desc .goods-list .image image {
		width: 100%;
		height: 100%;
		border-radius: 5px;
	}

	.order-main .order-desc .goods-list .goods-info {
		width: 80%;
		height: auto;
		font-size: 28rpx;
		overflow: hidden;
		position: relative;
	}

	.order-main .order-desc .goods-list .goods-info .title {
		width: 100%;
		height: 45rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.order-main .order-desc .goods-list .goods-info .info-text {
		width: auto;
		height: auto;
		color: #909090;
		margin-bottom: 10rpx;
	}

	.order-main .order-desc .goods-list .goods-info .is-meal {
		width: auto;
		height: auto;
		color: #909090;
	}

	.order-main .order-list .price-status {
		width: 100%;
		height: auto;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.order-main .order-list .price-status .price {
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 10rpx;
	}

	.order-main .order-list .price-status .price.active {
		color: #E30019;
	}
</style>

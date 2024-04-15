<template>
	<view class="page">
		<tags :branch_shop_id="branch_shop_id" :table_code="table_code" :state="0"></tags>
		<view class="order-main" v-if="myOrderInfo.length>0">
			<view class="order-list" v-for="(item,index) in myOrderInfo" :key="index">
				<view class="order-info">
					<view class="shop-name">{{item.branch_shop_name}}</view>
					<view class="order-time">下单时间：{{item.order_time}}</view>
					<view class="ordernum-status">
						<view class="ordernum">订单编号：{{item.ordernum}}</view>
						<view class="status">{{item.status==='0'?'已付款':item.status==='1'?'待支付':'已退款'}}</view>
					</view>
					<view class="area-table" v-if="item.table_code">
						<view class="area">区域：{{item.hotel_area_title}}</view>
						<view class="table-code">桌号：{{item.table_code}}</view>
					</view>
					<view class="remarks">是否打包:{{item.is_pack==='1'?'是':'否'}}</view>
					<view class="remarks">配送方式：自提</view>
					<view class="pick-code">取餐码：{{item.pick_code}}</view>
					<view class="remarks">备注：{{item.remark?item.remark:"无"}}</view>
				</view>
				<view class="order-desc" v-for="(item2,index2) in item.order_desc" :key="index2">
					<view class="goods-list-main">
						<view class="goods-list">
							<view class="image">
								<image :src="item2.image"></image>
							</view>
							<view class="goods-info">
								<view class="title">{{item2.title}}</view>
								<view class="info-text">x{{item2.amount}}</view>
								<view class="info-text">￥{{item2.price}}</view>
								<view class="info-text" v-if="item2.pack_price>0">包装费：￥{{item2.pack_price}}</view>
								<view class="is-meal">是否套餐：{{item2.is_meal==='1'?'是':'否'}}</view>
							</view>
						</view>
						<!-- 退款成功的菜品 -->
						<view class="refund-content" v-if="item2.refund_state==='-2'">
							退款原因：{{item2.refund_failed}}
						</view>
						<view class="meal-items" v-if="item2.is_meal==='1'">
							<block v-for="(item3,index3) in item2.omi_data" :key="index3">
								<view class="item-list">
									<view class="item">
										<view>- {{item3.title}}</view>
										<view>x{{item3.amount}}</view>
										<view>￥{{item3.price}}</view>
									</view>
								</view>
								<view class="pack-price">包装费：￥{{item3.pack_price}}</view>
								<view class="refund-content" v-if="item3.refund_state==='-2'">
									退款原因：{{item3.refund_failed}}
								</view>
							</block>
						</view>
					</view>
				</view>
				<view class="price-status">
					<view class="price">实付金额：￥{{item.true_total}}</view>
					<view class="status">
						<view class="status-btn"
							@click="goOrderDetails(`/pages/myorder/details?ordernum=${item.ordernum}&pay_uid=${item.rpu_uid}&branch_shop_id=${branch_shop_id}&table_code=${table_code}`)">
							订单详情</view>
					</view>
				</view>
			</view>
		</view>
		<view class="no-data" v-else>没有订单！</view>
	</view>
</template>

<script>
	import {
		mapActions,
		mapState
	} from 'vuex'
	export default {
		name: "order",
		data() {
			return {
				branch_shop_id: "",
				table_code: "",
				status:""

			}
		},
		onLoad(opts) {
			this.branch_shop_id = opts.branch_shop_id ? opts.branch_shop_id : ""
			this.table_code = opts.table_code ? opts.table_code : ""
			this.status = opts.status ? opts.status : 0 //0:待支付 1：已付款 2：已退款
			// this.pageNum = 1 //当前页码
			// this.pageMax = 0 //最大页码数
			// this.myOrder({
			// 	page: 1,
			// 	status: this.status,
			// 	completed: (res) => {
			// 		this.pageMax = res.pagenum
			// 	}
			// })
		},
		onShow() {
 			this.pageNum = 1 //当前页码
			this.pageMax = 0 //最大页码数
			this.myOrder({
				page: 1,
				status: this.status,
				completed: (res) => {
					this.pageMax = res.pagenum
				}
			})
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.pageNum = 1
			this.myOrder({
				"page": this.pageNum,
				"status": this.status,
				success: () => {
					uni.stopPullDownRefresh();
				}
			})
		},
		// 上拉加载更多数据
		onReachBottom() {
			console.log(this.pageMax)
			if (this.pageNum < this.pageMax) {
				this.pageNum++
				this.myOrderPage({
					"page": this.pageNum,
					"status": this.status
				})
			}
		},
		methods: {
			...mapActions({
				myOrder: "order/myOrder", //我的订单详情
				myOrderPage: "order/myOrderPage" //我的订单详情分页加载数据
			}),
			goOrderDetails(url) {
				uni.navigateTo({
					url
				})
			}
		},

		computed: {
			...mapState({
				myOrderInfo: state => state.order.myOrderInfo //我的订单详情
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
		font-size: 22rpx;
	}

	.order-main .order-desc .goods-list .goods-info .is-meal {
		width: auto;
		height: auto;
		color: #909090;
		font-size: 22rpx;
	}

	.order-main .order-desc .goods-list .goods-info .handle-status {}

	.order-main .order-desc .goods-list .goods-info .refund-btn {
		width: auto;
		height: auto;
		position: absolute;
		right: 0rpx;
		bottom: 0rpx;
		padding: 8rpx 15rpx;
		color: #FFFFFF;
		font-size: 28rpx;
		background-color: #f17f1f;
		border-radius: 4px;
	}

	.order-main .order-desc .meal-items {
		width: 100%;
		margin-top: 20rpx;
	}

	.order-main .order-desc .meal-items .item-list {
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28rpx;
		color: #909090
	}

	.order-main .order-desc .meal-items .item-list .item {
		display: flex;
	}

	.order-main .order-desc .meal-items .item-list .item view {
		margin-right: 20rpx;
	}

	.order-main .order-desc .goods-list-main .refund-content {
		width: 100%;
		font-size: 28rpx;
		color: #E30019;
	}

	.order-main .order-list .price-status {
		width: 100%;
		height: 80rpx;
		box-sizing: border-box;
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.order-main .order-list .price-status .price {
		font-size: 28rpx;
		color: #333333
	}

	.order-main .order-list .price-status .status {
		width: auto;
		height: auto;
		display: flex;
		justify-content: flex-end;
	}

	.order-main .order-list .price-status .status .status-btn {
		width: auto;
		height: auto;
		padding: 8rpx 15rpx;
		border-radius: 4px;
		background-color: #E30019;
		font-size: 28rpx;
		color: #FFFFFF;
		margin-left: 20rpx;
	}

	.order-main .pack-price {
		font-size: 28rpx;
		color: #909090;
		margin-left: 24rpx;
	}
</style>

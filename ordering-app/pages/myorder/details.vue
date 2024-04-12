<template>
	<view class="page">
		<view class="shop-title">{{orderItemsInfo.branch_shop_name}}</view>
		<view class="order-main">
			<view class="order-list">
				<view class="order-info">
					<view class="order-time">下单时间：{{orderItemsInfo.order_time}}</view>
					<view class="ordernum-status">
						<view class="ordernum">订单编号：{{orderItemsInfo.ordernum}}</view>
						<view class="status">
							{{orderItemsInfo.status==='0'?'已付款':orderItemsInfo.status==='1'?'待支付':'已退款'}}
						</view>
					</view>
					<!--如果是堂内订单-->
					<view class="area-table" v-if="orderItemsInfo.table_code">
						<view class="area">区域：{{orderItemsInfo.hotel_area_title}}</view>
						<view class="table-code">桌号：{{orderItemsInfo.table_code}}</view>
					</view>
					<view class="pick-code">取餐码：{{orderItemsInfo.pick_code}}</view>
					<view class="remarks">是否打包：{{orderItemsInfo.is_pack==='0'?'否':'是'}}</view>
					<view class="remarks">配送方式：自提</view>
					<view class="remarks">备注：{{orderItemsInfo.remarks?orderItemsInfo.remarks:"无"}}</view>
				</view>
				<view class="order-desc">
					<!--订单明细-->
					<view class="goods-list-main" v-for="(item,index) in orderItemsInfo.order_desc" :key="index">
						<view class="goods-list">
							<view class="image">
								<image :src="item.image"></image>
							</view>
							<view class="goods-info">
								<view class="title">{{item.title}}</view>
								<view class="info-text">x{{item.amount}}</view>
								<view class="info-text">￥{{item.price}}</view>
								<view class="info-text">包装费：￥{{item.pack_price}}</view>
								<view class="is-meal">是否套餐：{{item.is_meal==='0'?'否':'是'}}</view>
								<view v-if="orderItemsInfo.status==='0' && item.is_meal==='0'"
									:class="{'refund-btn':true,success:item.refund_state==='1',fail:item.refund_state==='-2',handle:item.refund_state==='-1'}"
									@click=showRefundCommponents(item)>
									{{item.refund_state==='1'?'退款成功':item.refund_state==='-1'?'处理中':item.refund_state==='-2'?'退款失败':'申请退款'}}
								</view>
							</view>
						</view>
						<!--退款失败原因-->
						<view class="refund-content" v-if="item.refund_state==='-2'">
							失败原因：{{item.refund_failed}}
						</view>
						<!--套餐里菜品的明细-->
						<view class="meal-items" v-if="item.is_meal==='1'">
							<block v-for="(item2,index2) in item.omi_data" :key="index2">
								<view class="item-list">
									<view class="item">
										<view>- {{item2.title}}</view>
										<view>x{{item2.price}}</view>
										<view>￥{{item2.amount}}</view>
									</view>
									<view v-if="orderItemsInfo.status==='0'"
										:class="{'refund-btn':true,success:item2.refund_state==='1',fail:item2.refund_state==='-2',handle:item2.refund_state==='-1'}"
										@click=showRefundCommponents(item2)>
										{{item2.refund_state==='1'?'退款成功':item2.refund_state==='-1'?'处理中':item2.refund_state==='-2'?'退款失败':'申请退款'}}
									</view>
								</view>
								<view class="pack-price">包装费：￥{{item2.pack_price}}</view>
								<view class="refund-content" v-if="item2.refund_state==='-2'">
									失败原因：{{item2.refund_failed}}
								</view>
							</block>
						</view>
					</view>
				</view>
				<view class="price-status">
					<view class="price">菜品金额：￥{{orderItemsInfo.true_total-orderItemsInfo.pack_total}}</view>
					<view class="price active">包装费：￥{{orderItemsInfo.pack_total}}</view>
					<view class="price active">实付金额：￥{{orderItemsInfo.true_total}}</view>
				</view>
			</view>
		</view>
		<view class="again-order" @click="pushGoods()">再来一单</view>
		<refund_order :isRefundCommponents="isRefundCommponents" :refundData="refundData"  @close="isRefundCommponents=false"></refund_order>
	</view>
</template>

<script>
	import {
		mapActions,
		mapState
	} from 'vuex'
	export default {
		name: "order-details",
		data() {
			return {
				isRefundCommponents: false, //退款组件显示与隐藏
				refundData:[] //子组件接受数据
			}
		},
		onLoad(opts) {
			this.branch_shop_id = opts.branch_shop_id ? opts.branch_shop_id : ""
			this.table_code = opts.table_code ? opts.table_code : ""
			this.ordernum = opts.ordernum ? opts.ordernum : "" //订单编号
			this.pay_uid = opts.pay_uid ? opts.pay_uid : "" //替付款人uid
			this.orderItems({
				ordernum: this.ordernum,
				pay_uid: this.pay_uid
			})
		},
		methods: {
			...mapActions({
				orderItems: "order/orderItems" //订单详情
			}),
			// 再来一单(跳转到商家商品详情页面)
			pushGoods() {
				uni.redirectTo({
					url: `/pages/goods/index?branch_shop_id=${this.branch_shop_id}&table_code=${this.table_code}`
				})
			},
			//显示隐藏退款组件
			showRefundCommponents(item) {
				if(item.is_meal==='0'){
					this.refundData=[{
						refund_state:item.refund_state,
						order_item_id:item.order_item_id,
						refund_amount:item.amount,
						title:item.title,
						is_meal:item.is_meal
					}]
				}else{
					this.refundData=[{
						refund_state:item.refund_state,
						order_item_id:item.order_item_id,
						refund_amount:item.amount,
						title:item.title,
						is_meal:'1'
					}]
				}
				
 
				if(item.refund_state==='1'){
					uni.showToast({
						title:"当前餐品已完成退款，请勿重新提交",
						icon:'none'
					})
					return
				}
				if(item.refund_state==='-1'){
					uni.showToast({
						title:"当前退款正在处理中",
						icon:'none'
					})
					return
				}
				if(item.refund_state==='-2'){
					uni.showToast({
						title:"当前菜品申请退款失败，请查看失败原因",
						icon:'none'
					})
					return
				}
  				this.isRefundCommponents = true
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.orderItems({
				ordernum: this.ordernum,
				pay_uid: this.pay_uid,
				success: () => {
					uni.stopPullDownRefresh();
				}
			})
		},
		computed: {
			...mapState({
				orderItemsInfo: state => state.order.orderItemsInfo //订单详情
			})
		}
	}
</script>

<style scoped>
	.page {
		width: 100%;
		min-height: 100vh;
		background-color: #FFFFFF;
		overflow: hidden;
	}

	.shop-title {
		width: 100%;
		height: 80rpx;
		background-color: #FFFFFF;
		border-bottom: 1px solid #EFEFEF;
		font-size: 28rpx;
		text-align: center;
		line-height: 80rpx;
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

	.order-main .order-desc .goods-list .goods-info .refund-btn {
		width: auto;
		height: auto;
		position: absolute;
		right: 0rpx;
		bottom: 0rpx;
		padding: 8rpx 15rpx;
		color: #FFFFFF;
		font-size: 28rpx;
		color: #f17f1f;
 	}

	.order-main .order-desc .goods-list .goods-info .refund-btn.success {
		color: #007aff;
	}

	.order-main .order-desc .goods-list .goods-info .refund-btn.fail {
		color: #E30019;
	}

	.order-main .order-desc .goods-list .goods-info .refund-btn.handle {
		color: #CCCCCC;
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

	.order-main .order-desc .meal-items .item-list .refund-btn {
		width: auto;
		height: auto;
		padding: 8rpx 15rpx;
		color: #FFFFFF;
		font-size: 28rpx;
		color: #f17f1f;
 	}

	.order-main .order-desc .meal-items .item-list .refund-btn.success {
		color: #007aff;
	}

	.order-main .order-desc .meal-items .item-list .refund-btn.fail {
		color: #E30019;
	}

	.order-main .order-desc .meal-items .item-list .refund-btn.handle {
		color: #CCCCCC
	}

	.order-main .order-desc .goods-list-main .refund-content {
		width: 100%;
		font-size: 28rpx;
		color: #E30019;
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

	.again-order {
		width: 200rpx;
		height: 60rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		background-color: #E30019;
		margin: 0 auto;
		text-align: center;
		line-height: 60rpx;
		border-radius: 4px;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
	}

	.order-main .pack-price {
		font-size: 28rpx;
		color: #909090;
		margin-left: 24rpx;
	}
</style>

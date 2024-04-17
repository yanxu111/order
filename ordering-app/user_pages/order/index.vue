<template>
	<view class="page">
		<view class="shop-title">{{shopInfo.branch_shop_name}}</view>
		<view class="order-main">
			<view class="order-list">
				<view class="order-info" v-if="table_code">
					<view class="area-table">
						<view class="area">区域：{{shopArea}}</view>
						<view class="table-code">桌号：{{table_code}}</view>
					</view>
				</view>
				<view class="order-desc">
					<view class="goods-list-main" v-for="(items,index) in cartData" :key="index">
						<view class="goods-list">
							<view class="image">
								<image :src="items.image"></image>
							</view>
							<view class="goods-info">
								<view class="title"><text selectable="true">{{items.title}}</text></view>
								<view class="info-text">x{{items.amount}}</view>
								<view class="info-text">￥{{items.price}}</view>
								<template>
									<view class="info-text" v-if="items.is_meal==='0'">
										包装费：￥{{items.price}}</view>
									<view class="is-meal">是否套餐：{{items.is_meal==='0'?'否':'是'}}</view>
								</template>
							</view>
						</view>
						<!--如果是套餐，显示套餐里菜品的明细-->
						<view class="meal-items" v-if="items.is_meal==='1'">
							<view class="item-list" v-for="(items2,index2) in items.meal_items" :key="index2">
								<view class="item">
									<view>- <text selectable="true">{{items2.title}}</text></view>
									<view>x{{items2.dis_amount*items.amount}}</view>
									<view>￥{{items2.price}}</view>
								</view>
								<view>包装费：￥{{items2.pack_price}}</view>
							</view>
						</view>
					</view>
				</view>

				<view class="order-row">
					<view class="order-col-1">
						<view>是否打包</view>
					</view>
					<view class="order-col-2">
						<switch :disabled="isDisablePack" color="#E30019" :checked="isTableCode"
							@change="chackedPack($event)" />
					</view>
				</view>
				<view class="price-status">
					<view class="price">包装费：￥{{packTotal}}，总价：￥{{total}}</view>
				</view>
			</view>
			<view class="remarks">
				备注：<br />
				<view class="content">
					<textarea placeholder="比如：xxx不加辣" v-model="remarks" />
				</view>
			</view>
		</view>
		<view class="pay-wrap">
			<view class="price-color">￥{{total}}</view>
			<view class="price"></view>
			<view class="pay-color" @click="gopay()">结算</view>
			<cover-view class="pay"></cover-view>

		</view>
	</view>
</template>

<script>
	import {
		mapActions,
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'
	export default {
		name: "order-index",
		data() {
			return {
				branch_shop_name: "",
				table_code: "",
				isDisablePack: false, //是否为自提
				remarks: ""
			}
		},
		onLoad(opts) {
			// console.log(opts)
 			this.branch_shop_id = opts.branch_shop_id ? opts.branch_shop_id : ""
			this.table_code = opts.table_code ? opts.table_code : ""
			this.getShopArea({
				branch_shop_id: this.branch_shop_id,
				table_code: this.table_code
			})
			//根据是否有桌号判断是否允许自提
			this.isDisablePack = this.table_code ? true : false
			//提交购物车是否自提
			this.isPack = false
		},
		methods: {
			...mapActions({
				getShopArea: "business/getShopArea", //获取商家点菜区域
				submitOrder: "order/submitOrder", //提交订单信息获取返回数据进行支付
				wechatPayOrder: "order/wechatPayOrder", //微信小程序支付订单接口
				getShopInfo:"business/getShopInfo" //获取商家详细信息
			}),
			...mapMutations({
				"SET_TABLE_CODE": "cart/SET_TABLE_CODE" //设置isTableCode是否自提
			}),
			// 是否计算打包费
			chackedPack(e) {
				this.isPack = e.target.value
				this.SET_TABLE_CODE({
					isTableCode: e.target.value
				})
			},
			//提交订单
			gopay() {
				let orderData = {
					branch_shop_id: this.branch_shop_id,
					table_code: this.table_code,
					remarks: this.remarks,
					is_pack: this.isPack ? "1" : "0",
					distribution_type: this.table_code ? "0" : "2"
				}
				this.submitOrder({
					orderData: orderData,
					completed: async (res) => {
 						if (res.code === 200) {
							// 如果成功判断前后台金额是否相同,相同则跳转支付页面,否则给出提示
							if (res.data.true_total === this.total) {
								let trueTotal = res.data.true_total
								let orderNum = res.data.ordernum
								// 只有是微信小程序平台的时候才会执行此段程序,调用微信小程序接口
								//#ifdef MP-WEIXIN							
								let unideOrder = await this.wechatPayOrder({
									notify_url: this.$config.baseApi +
										"/api/home/wxpay/wechat_notify", //服务端微信小程序支付回调接口
									ordernum: orderNum, //订单编号
									price: trueTotal, //金额
									// 微信支付平台对接接口									
								})
 								if (unideOrder.code === 200) {
									//支付失败 因为个人appid 没有开通微信支付，但支付六流程如下
									uni.requestPayment({
										provider: 'wxpay',
										timeStamp: String(unideOrder.timeStamp), //时间戳
										nonceStr: unideOrder.nonceStr, //随机字符串
										package: unideOrder.package, //接口返回的prepay_id
										signType: 'MD5',
										paySign: unideOrder.paySign, //支付签名
										success: (res) => {
											// 因appid支付没有开通无法使用,顾在失败回调中写逻辑
											uni.showToast({
												title: "支付成功",
												icon: 'success',
												duration: 2000,
												success: () => {
													setTimeout(() => {
														uni.navigateTo({
															url: `/user_pages/order/pay_success?branch_shop_id=${this.branch_shop_id}&table_code=${this.table_code}`
														})
													}, 2000)
												}
											})
										},
										fail: (e) => {
											uni.showToast({
												title: "支付成功",
												icon: 'success',
												duration: 2000,
												success: () => {
													setTimeout(() => {
														uni.navigateTo({
															url: `/user_pages/order/pay_success?branch_shop_id=${this.branch_shop_id}&table_code=${this.table_code}`
														})
													}, 2000)

												}
											})
										}
									})
								} else {
									uni.showToast({
										title: "请求支付失败",
										icon: "error",
										duration: 2000
									})
								}
								//#endif
							} else {
								uni.showToast({
									title: "当前金额存在异议，请重新进入程序点餐",
									icon: 'error',
									duration: 2000
								})
							}
						} else {
							uni.showToast({
								title: res.data,
								icon: 'error',
								duration: 2000
							})
						}
					}
				})
			}
		},
		computed: {
			...mapState({
				shopArea: state => state.business.shopArea,
				cartData: state => state.cart.cartData,
				isTableCode: state => state.cart.isTableCode, //判断是否为自提，若是需要一直开启switch开关并计算打包费
				shopInfo:state=>state.business.shopInfo //商家详情信息
			}),
			...mapGetters({
				total: "cart/total", //计算总价
				packTotal: "cart/packTotal" //包装费总价格
			})
		}
	}
</script>

<style scoped>
	.page {
		width: 100%;
		min-height: 100vh;
		background-color: #EFEFEF;
		overflow: hidden;
		margin-bottom: 160rpx;
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
		padding: 10rpx 20rpx;
		background-color: #FFFFFF;
		border-radius: 5%;
		box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.2);
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

	.order-main .order-desc {
		width: 100%;
	}

	.order-main .goods-list-main {
		width: 100%;
		box-sizing: border-box;
		padding: 10rpx 20rpx;
		border-bottom: 1px solid #EFEFEF;
	}

	.order-main .order-desc .goods-list {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		/* 		border-radius: 5%;
 */
		box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.2);
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

	.order-main .order-desc .meal-items {
		width: 100%;
		/* margin-top: 20rpx; */
		background-color: #ffffff;
		box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.2);
		/* border-radius: 0 0 5% 5%; */
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
		background-color: #007aff;
		border-radius: 4px;
	}

	.order-main .order-list .price-status {
		width: 100%;
		height: auto;
		box-sizing: border-box;
		padding: 20rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		background-color: #ffffff;
		box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.2);
	}

	.order-main .order-list .price-status .price {
		font-size: 28rpx;
		color: #333333
	}

	.order-main .order-row {
		width: 100%;
		height: auto;
		border-bottom: 1px solid #EFEFEF;
		justify-content: space-between;
		align-items: center;
		display: flex;
		box-sizing: border-box;
		padding: 20rpx 20rpx;
		background-color: #ffffff;
	}

	.order-main .order-row .order-col-1 {
		font-size: 28rpx;
		display: flex;
	}

	.order-main .order-row .order-col-2 {
		display: flex;
		font-size: 28rpx;
		color: #909090;
		height: 40rpx;
		align-items: center;
	}

	.order-main .order-row .order-col-2.active {
		color: #000000
	}

	.order-main .order-row .radio-style {
		transform: scale(.8)
	}

	.order-main .order-row .order-col-2 label {
		margin-left: 30rpx;
	}

	.order-main .remarks {
		font-size: 28rpx;
		width: 100%;
		margin-top: 20rpx;
		box-sizing: border-box;
		padding: 0px 20rpx;
		background-color: #ffffff;
		box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.2);
	}

	.order-main .remarks .content {
		width: 100%;
		height: 300rpx;
		/* overflow: hidden; */
		margin-top: 20rpx;
		border-radius: 5px;
		border: 1px solid #EFEFEF;
	}

	.order-main .remarks .content textarea {
		width: 100%;
		height: 100%;
		padding: 20rpx;
	}

	.order-main .remarks .address {
		width: 100%;
		height: 70rpx;
		overflow: hidden;
		margin-top: 20rpx;
		border-radius: 5px;
		border: 1px solid #EFEFEF;
		box-sizing: border-box;
		color: #717171;
		padding: 13rpx;
		background-color: #ffffff;
	}

	.pay-wrap {
		width: 90%;
		height: 90rpx;
		position: fixed;
		bottom: 20rpx;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		z-index: 2;
	}

	.pay-wrap .price-color {
		width: 450rpx;
		height: 90rpx;
		box-sizing: border-box;
		background-color: #000000;
		position: fixed;
		font-size: 40rpx;
		color: #FFFFFF;
		z-index: 10;
		text-align: left;
		line-height: 90rpx;
		left: 10%;
	}

	.pay-wrap .price {
		width: 90rpx;
		height: 90rpx;
		background-color: #000000;
		position: fixed;
		z-index: 3;
		border-radius: 50% 0 0 50%;

	}

	.pay-wrap .pay-color {
		width: 150rpx;
		height: 90rpx;
		background-color: #f17f1f;
		text-align: center;
		line-height: 90rpx;
		font-size: 35rpx;
		color: #FFFFFF;
		position: fixed;
		z-index: 99;
		right: 7%;
		bottom: 0rpx;
	}

	.pay-wrap .pay {
		width: 90rpx;
		height: 90rpx;
		background-color: #f17f1f;
		/* color: #FFFFFF; */
		position: fixed;
		z-index: -99;
		right: 0%;
		border-radius: 100%;
	}
</style>

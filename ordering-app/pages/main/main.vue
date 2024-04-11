<template>
	<view class="page">
		<view class="status_bar"></view>
		<view class="header">
			<view :class="{'search-header':true,ipx:isIpx}">
				<view class="search-wrap" @click="isShow=true">
					<view class="icon"></view>
					<view class="text">请输入商家名或菜品</view>
				</view>
			</view>
		</view>
		<view class="shop-main">
			<view class="shop-list" v-for="(item,index) in shops" :key="idnex"
				@click="goPage('/pages/goods/index?branch_shop_id='+item.branch_shop_id)">
				<view class="shop-wrap">
					<view class="image">
						<image :src="item.logo"></image>
					</view>
					<view class="shop-info">
						<view class="shop-name">{{item.branch_shop_name}}</view>
						<view class="distance">{{item.distance}}</view>
						<view class="address">{{item.address}}</view>
						<view class="pack-btn">自提</view>
					</view>
				</view>
			</view>
		</view>
		<search :show="isShow" @close="isShow=false" :isLocal="false"></search>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	import system from '../../stroe/system'
	export default {
		data() {
			return {
				isShow: false
			}
		},
		onLoad() {
			this.lng = 0; //经度
			this.lat = 0; //纬度
			// 当前页码默认为1
			this.pageNum = 1;
			// 总页码
			this.maxPage = 0
		},
		//页面每次加载执行
		onShow() {
			// 获取用户是否开启地理位置
			uni.getSetting({
				success: (res) => {
					// console.log(res.authSetting)
					if (res.authSetting['scope.address']) {
						//获取个人位置信息优先显示最近的商铺
						uni.getLocation({
							type: 'gcj02',
							success: function(res) {
								this.lng = res.longitude
								this.lat = res.latitude

							},
							fail: (ex) => {
								console.log(ex)
							}
						});
						this.getShop({
							"page": 1,
							"lng": this.lng,
							"lat": this.lat,
							complete: (res) => {
								// console.log(res)
								this.pageNum = res.page
								this.maxPage = res.pagenum
							}
						})
					} else {
						uni.showModal({
							title: "系统提示",
							content: "当前设备未开启地理位置权限，是否开通？",
							success: (res) => {
								if (res.confirm) {
									//打开位置权限界面
									uni.openSetting({
										success: (settingRes) => {
											//获取个人位置信息优先显示最近的商铺
											uni.getLocation({
												type: 'gcj02',
												success: function(res) {
													this.lng = res
														.longitude
													this.lat = res.latitude

												},
												fail: (ex) => {
													console.log(ex)
												}
											});
											this.getShop({
												"page": 1,
												"lng": this.lng,
												"lat": this.lat,
												complete: (res) => {
													// console.log(res)
													this.pageNum = res.page
													this.maxPage = res
														.pagenum
												}
											})
										}
									})

								}
							}
						})
					}
				}
			})

		},
		methods: {
			...mapActions({
				getShop: "business/getShop",
				getShopPage: "business/getShopPage"
			}),
			goPage(url) {
				uni.redirectTo({
					url
				})
			}
		},
		//分享小程序
		onShareAppMessage() {
			return {
				title: '点餐小程序',
				path: '/pages/main/main',
				imageUrl: "../../static/images/main/hanbao.jpg"
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.pageNum = 1
			this.getShop({
				"page": this.pageNum,
				"lng": this.lng,
				"lat": this.lat,
				success: () => {
					uni.stopPullDownRefresh();
				}
			})
		},
		// 上拉加载更多数据
		onReachBottom() {
			if (this.pageNum < this.maxPage) {
				this.pageNum++
				this.getShopPage({
					"page": this.pageNum,
					"lng": this.lng,
					"lat": this.lat
				})
			}
		},
		computed: {
			...mapState({
				isIpx: state => state.system.isIpx,
				shops: state => state.business.shops
			})
		}
	}
</script>

<style scoped>
	.page {
		width: 100%;
		min-height: 100vh;
		orverflow: hidden;
	}

	.header {
		width: 100%;
		background-color: darkred;
		overflow: hidden;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 90;
	}

	.header .search-header {
		width: 100%;
		height: 170rpx;
		margin-top: 40rpx;
		padding-bottom: 20rpx;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}

	.header .search-header.ipx {
		height: 220rpx;
	}

	.header .search-wrap {
		width: 80%;
		height: 52rpx;
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 5px;
		display: flex;
		align-items: center;
	}

	.header .icon {
		width: 44rpx;
		height: 44rpx;
		background-image: url("@/static/images/main/search_icon.png");
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
		margin: 0 20rpx;
	}

	.header .text {
		color: #999999;
		font-size: 28rpx;
	}

	.shop-main {
		width: 100%;
		margin-top: 220rpx;
	}

	.shop-main .shop-list {
		width: 100%;
		border-bottom: 1px solid #EFEFEF;
		box-sizing: border-box;
		padding: 20rpx 0;
	}

	.shop-main .shop-list .shop-wrap {
		width: 92%;
		margin: 0 auto;
		display: flex;
	}

	.shop-main .shop-list .shop-wrap .image {
		width: 160rpx;
		height: 160rpx;
		margin-right: 20rpx;
	}

	.shop-main .shop-list .shop-wrap .image image {
		width: 100%;
		height: 100%;
		border-radius: 5px;
	}

	.shop-main .shop-list .shop-info {
		width: 72%;
		clear: both;
	}

	.shop-main .shop-list .shop-info .shop-name {
		width: 100%;
		height: 44rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 32rpx;
		font-weight: bold;
	}

	.shop-main .shop-list .shop-info .distance {
		font-size: 28rpx;
		margin-top: 10rpx;
		color: #666666
	}

	.shop-main .shop-list .shop-info .address {
		font-size: 28rpx;
		margin-top: 10rpx;
		color: #666666;
		width: 100%;
		height: 44rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.shop-main .shop-list .shop-info .pack-btn {
		padding: 10rpx 20rpx;
		background-color: darkred;
		font-size: 28rpx;
		color: #FFFFFF;
		display: table;
		border-radius: 5px;
		float: right;
		margin-top: 10rpx;
	}
</style>

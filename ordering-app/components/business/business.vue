<template>
	<scroll-view scroll-y="true" class="business-info-main" v-show="show">
		<view class="row-area">
			<view class="col1 cellphone-icon"></view>
			<view class="col2" @click="goPhone"><text>{{shopInfo.phone}}</text></view>
		</view>
		<view class="row-area">
			<view class="col1 address-icon"></view>
			<view class="col2"><text selectable="true" @click="goAddress">{{shopInfo.address}}</text></view>
		</view>
		<view class="row-area">
			<view class="col1 notice-icon"></view>
			<view class="col2">
				<rich-text :nodes="shopContent.notice|contentFillter"></rich-text>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import {mapActions,mapState} from 'vuex'
	export default {
		name: "business",
		mounted() {
			this.getShopInfo({branch_shop_id:this.branchShopId})
			this.getShopContent({branch_shop_id:this.branchShopId})
		},
		props:{
			show:{
				type:Boolean,
				default:false
			},
			branchShopId:{
				type:String,
				default:""
			}
		},
		computed:{
			...mapState({
				shopInfo:state=>state.business.shopInfo,
				shopContent:state=>state.business.shopContent
			})
		},
		methods:{
			...mapActions({
				getShopInfo:"business/getShopInfo",
				getShopContent:"business/getShopContent"
			}),
			//拨打电话
			goPhone(){
				uni.makePhoneCall({
					phoneNumber:this.shopInfo.phone
				})
			},
			// 跳转地图页面获取商家位置
			goAddress(){
				if(this.shopInfo.lng && this.shopInfo.lat){
					uni.navigateTo({
						url:`/pages/business/address-map?branch_shop_id=${this.branchShopId}&lng=${this.shopInfo.lng}&lat=${this.shopInfo.lat}`
					})
				}
			}
		},
		watch:{
			shopInfo(val){
				// console.log(val)
			}
		}
	}
</script>

<style scoped>
	.business-info-main {
		width: 100%;
		height: 55vh;
		font-size: 28rpx;
	}

	.business-info-main .row-area {
		width: 100%;
		height: auto;
		display: flex;
		box-sizing: border-box;
		padding: 10rpx 22rpx;
	}

	.business-info-main .col1 {
		width: 35rpx;
		height: 35rpx;
	}

	.business-info-main .col2 {
		width: 700rpx;
		overflow: hidden;
	}

	.business-info-main .col1.cellphone-icon {
		background-image: url("~@/static/images/goods/cellphone.png");
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center;
		margin-right: 10rpx;
	}

	.business-info-main .col1.address-icon {
		background-image: url("~@/static/images/goods/address.png");
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center;
		margin-right: 10rpx;
	}

	.business-info-main .col1.notice-icon {
		background-image: url("~@/static/images/goods/notice.png");
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center;
		margin-right: 10rpx;
	}

	.points-tip {
		width: 75%;
		height: 25px;
		position: fixed;
		z-index: 1;
		left: 23%;
		bottom: 95rpx;
		background-color: #FFFFFF;
		text-align: center;
		line-height: 25px;
		font-size: 28rpx;
		color: #E30019;
		border-radius: 5px;
		border: 1px solid #f6ab00;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>

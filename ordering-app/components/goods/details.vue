<template>
	<view>
		<view class="mask" v-show="show" @click="close()"></view>
		<view :class="{details:true, show:show}">
			<view class="goods">
				<view class="image">
					<image :src="goodsDetails.image"></image>
				</view>
				<view class="text">{{goodsDetails.title}}</view>
			</view>
			<view class="goods-info">
				<view class="price-amount">
					<view class="price">价格：￥{{goodsDetails.price}}</view>
					<view class="handle-amount">
						<view class="dec" @click="decAmount()" v-show="goodsAmount>0"></view>
						<input type="number" :value="goodsAmount" v-show="goodsAmount>0" @blur="setAmount"/>
						<view class="inc" @click="incAmount()"></view>
					</view>
				</view>
				<scroll-view scroll-y="true" class="content">
					<!-- nodes字节列表 取消br换行代码 -->
					<!-- 封装全局过滤器，使用过滤器解调用脚本决富文本数组性能问题。 -->
					<!-- 好处：多个页面可用 且只需要配置一个文件即可 -->
					<!-- 使用过滤器 变量|过滤器 -->
					<rich-text :nodes="goodsDetails.content|contentFillter"></rich-text>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapActions,
		mapState
	} from 'vuex'
	import parseHTML from '../../static/js/utils/html-parser.js'
	export default {
		name: "goods-details",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			detailsGid: {
				type: String,
				default: ""
			},
			branchShopId: {
				type: String,
				default: ""
			},
			goodsAmount:{
				type:Number,
				default:0
			}
		},
		methods: {
			...mapActions({
				getGoodsDetails: "goods/getGoodsDetails"
			}),
			//增加数量
			incAmount(){
				this.$emit("incAmount",this.detailsGid,"","")
			},
			// 减少数量
			decAmount(){
				this.$emit("decAmount",this.detailsGid,"","")
			},
			// 修改数量
			setAmount(e){
				this.$emit("setAmount",e,this.detailsGid)
			},
			close() {
				this.$emit("close")
			}
		},
		computed: {
		...mapState({
			goodsDetails:state=>state.goods.goodsDetails
		})
		},
		watch:{
			// 利用watch监听gid异步请求数据变化
			detailsGid(val){
				// console.log(t)
				this.getGoodsDetails({
					"branch_shop_id": this.branchShopId,
					"gid": this.detailsGid
				})
			}
		}
	}
</script>

<style scoped>
	.mask {
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 88;
		bottom: 0px;
		left: 0px;
		background-color: rgba(0, 0, 0, 0.6)
	}

	/* transform: translateY:100降下去 隐藏到底部 */
	.details {
		width: 100%;
		height: 795rpx;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0px;
		left: 0px;
		z-index: 89;
		transform: translateY(100%);
		transition: all 0.3s;
	}

	.details .goods {
		width: 100%;
		height: 330rpx;
		border-bottom: 1px solid #EFEFEF
	}

	.details .image {
		width: 260rpx;
		height: 260rpx;
		margin: 0 auto;
		margin-top: 20rpx;
	}

	.details .image image {
		width: 100%;
		height: 100%;
		border-radius: 6px;
	}

	.details .goods .text {
		width: auto;
		height: auto;
		margin: 0 auto;
		margin-top: 20rpx;
		white-space: nowrap;
		font-size: 28rpx;
		color: #333333;
		text-align: center;
		font-weight: bold;
	}

	.details .goods-info {
		width: 85%;
		margin: 0 auto;
		font-size: 28rpx;
		color: #333333;
		font-weight: bold;
	}

	.details .goods-info .price-amount {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
	}

	.details .goods-info .handle-amount {
		width: auto;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end
	}

	.details .goods-info .handle-amount .dec {
		width: 55rpx;
		height: 55rpx;
		background-image: url("~@/static/images/main/dec.png");
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
	}

	.details .goods-info .handle-amount .inc {
		width: 55rpx;
		height: 55rpx;
		background-image: url("~@/static/images/main/inc.png");
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
	}

	.details .goods-info .handle-amount input {
		width: 50rpx;
		height: 100%;
		text-align: center;
		margin-right: 10rpx;
		margin-left: 10rpx;
	}

	.details .goods-info .handle-amount .text {
		font-size: 28rpx;
		color: #333333;
		margin-right: 10rpx;
		margin-left: 10rpx;
		width: 50rpx;
		text-align: center;
	}

	.details .goods-info .content {
		width: 100%;
		height: 200rpx;
		margin-top: 20rpx;
		overflow: hidden;
	}

	/* 0:升起来全部显示 */
	.details.show {
		transform: translateY(0%)
	}
</style>

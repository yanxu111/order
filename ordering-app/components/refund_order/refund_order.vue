<template>
	<view class="mask" v-show="isRefundCommponents">
		<view class="refund-win">
			<view class="title">菜品名称：{{refundGoods.title}}</view>
			<view class="amount-wrap">
				<view class="text">数量：{{refundGoods.refund_amount}}</view>
				<view class="handle-amount">
					<view class="dec" @click="refundAmount>1?--refundAmount:1"></view>
					<text>{{refundAmount}}</text>
					<view class="inc" @click="incRefundAmount()"></view>
				</view>
			</view>
			<!-- :fixed="true",为了更好的兼容性，当textarea在fixed布局中 加上该属性 -->
			<view class="refund-content"><textarea :fixed="true" placeholder="请输入退款原因" v-model="refundContent"></textarea>
			</view>
			<view class="handle-btn">
				<button class="cancel" @click=resetSubmit()>取消</button>
				<button class="submit" @click="submitRefundOrder()">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapActions} from 'vuex'
	export default {
		name: "refund-order",
		data(){
			return{
				refundGoods:[] ,//退款菜品数据
				refundAmount:1, //退款菜品数量
				refundContent:"" //退款说明
			}
		},
		props:{
			isRefundCommponents:{
				type:Boolean,
				default:false
			},
			refundData:{
				type:Array,
				default:()=>[]
			},
 
		},
		mounted() {
			this.isSubmitRefund=true  //控制开关防止重复提交
		},
		methods:{
			//隐藏组件
			resetSubmit(){
				this.refundContent=""
				this.refundAmount=1
				this.$emit("close")
			},
			incRefundAmount(){
				if(this.refundAmount<this.refundGoods.refund_amount){
					this.refundAmount++
				}else{
					uni.showToast({
						title:"退款菜品数量不能超过订单中菜品的数量",
						icon:'none',
						duration:2000
					})
				}
			},
			...mapActions({
				refundOrder:"order/refundOrder"
			}),
			//提交退款订单
			submitRefundOrder(){
				if(this.isSubmitRefund){
					this.isSubmitRefund=false
					this.refundOrder({
						is_meal:this.refundGoods.is_meal,
						order_item_id:this.refundGoods.order_item_id,
						refund_content:this.refundContent,
						refund_amount:this.refundAmount,
						success:(res)=>{
							if(res.code===200){
								this.isSubmitRefund=true
								uni.showToast({
									title:"退款申请提交成功，我们会尽快处理，请稍后...",
									icon:'success',
									duration:2000,
									success: () => {
										setTimeout(()=>{
											//隐藏组件
											this.resetSubmit()
										},2000)
									}
								})
							}else{
								this.isSubmitRefund=true
								uni.showToast({
									title:res.data,
									icon:'error',
									duration:2000
								})
							}
						}
					})
				}
			}
		},
		watch:{
			// 监听选择菜品的数据变动
			refundData(e){
				this.refundGoods=e[0]
 				this.refundAmount=e[0].refund_amount
 			}
		}
	}
</script>

<style scoped>
	.mask {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0px;
		top: 0px;
		z-index: 90;
		background-color: rgba(0, 0, 0, 0.6)
	}

	.refund-win {
		width: 80%;
		height: 600rpx;
		background-color: #FFFFFF;
		position: absolute;
		left: 0px;
		top: 0px;
		bottom: 0px;
		right: 0px;
		margin: auto;
		z-index: 1;
		border-radius: 5px;
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 28rpx;
	}

	.amount-wrap {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
	}

	.handle-amount {
		width: auto;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-left: 300rpx
	}

	.handle-amount .dec {
		width: 55rpx;
		height: 55rpx;
		background-image: url("~@/static/images/main/dec.png");
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
		margin-right: 20rpx
	}

	.handle-amount .inc {
		width: 55rpx;
		height: 55rpx;
		background-image: url("~@/static/images/main/inc.png");
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
	}

	.handle-amount text {
		font-size: 28rpx;
		color: #333333;
		margin-right: 20rpx;
	}

	.refund-content {
		width: 100%;
		height: 300rpx;
		border: 1px solid #EFEFEF;
		border-radius: 4px;
		margin-top: 10rpx;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.refund-content textarea {
		width: 100%;
		height: 100%;
		font-size: 28rpx;
	}

	.handle-btn {
		width: 350rpx;
		height: auto;
		margin: 0 auto;
		margin-top: 40rpx;
		display: flex;
	}

	.handle-btn .submit {
		width: 160rpx;
		height: 70rpx;
		background-color: #E30019;
		font-size: 28rpx;
		color: #FFFFFF;
	}

	.handle-btn .cancel {
		width: 160rpx;
		height: 70rpx;
		background-color: #007aff;
		font-size: 28rpx;
		color: #FFFFFF;
	}
</style>

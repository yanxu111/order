<template>
    <view>
		<!-- //遮罩层 -->
        <view class="mask" v-show="show" @click="close()"></view>
        <view :class="{'cart-main':true, show:show}">
            <view class="nav">
                <view class="nav-title">
                    <view class="icon"></view>
                    <view class="text">已选菜品</view>
                </view>
                <view class="clear-main">
                    <view class="icon"></view>
                    <view class="text" @click="delCartInfo()">清空</view>
                </view>
            </view>
            <scroll-view scroll-y="true" class="goods-main">
                <view class="scroll-wrap">
                    <view class="goods-list" v-for="(item,index) in cartInfo" :key="index">
                        <view class="title-area">
                            <view class="title">{{item.title}}</view>
                            <view class="price-amount">
                                <view class="price">￥{{item.price}}</view>
                                <view class="handle-amount">
                                    <!--如果数量大于0显示减号按钮-->
                                    <view class="dec" v-if="item.amount>0" @click="decAmount(item.gid,item.new_meal_items,item.meal_items)"></view>
                                    <!--如果数量大于0并且amountInput的值为false显示文本数量-->
                                    <view class="text" v-if="!item.amountInput && item.amount>0" @click="showAmountInput(index)">{{item.amount}}</view>
                                    <!--如果amountInput的值为true显示input输入框，这里可以修改数量 监听输入框数量变化-->
                                    <input :value="item.amount" type="number" v-if="item.amountInput" :focus="item.amountInputFocus" @blur="hideAmountInput($event,item.gid,item.new_meal_items,item.meal_items,index)"/>
                                    <!--添加购物车按钮-->
                                    <view class="inc"  @click="incAmount(item.gid,item.new_meal_items,item.meal_items)"></view>
                                </view>
                            </view>
                        </view>
                        <!-- 如果非套餐并且包装费大于0，显示包装费 -->
                        <view class="pack-price" v-if="item.is_meal==='0' && item.pack_price>0">包装费：￥{{item.pack_price}}</view>
                        <!--如果是套餐，显示套餐里菜品的明细-->
                        <view class="goods-desc" v-if="item.is_meal==='1'">
                            <view class="goods-desc-list" v-for="(item2,index2) in item.meal_items" :key="index2">
                                <view class="goods-title">- {{item2.title}} x{{item2.amount}}</view>
                                <view v-if="item2.pack_price>0">&nbsp;&nbsp;包装费：￥{{item2.pack_price}}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
	import {mapMutations} from 'vuex'
     export default {
        name: "cart",
       props:{
		   show:{
			   type:Boolean,
			   default:false
		   },
		   cartInfo:{
			   type:Array,
			   default:()=>[]
		   }
	   },
	   mounted() {
	   	// console.log(this.cartInfo)
	   },
	   methods:{
		   ...mapMutations({
			  "SHOW_AMOUNT_INPUT":"cart/SHOW_AMOUNT_INPUT" ,//显示输入框
			  "HIDE_AMOUNT_INPUT":"cart/HIDE_AMOUNT_INPUT" //隐藏输入框
		   }),
		   // 购物车中点击加号增加购物车中相应菜品的数量
		   incAmount(gid,newMeal,mealItems){
  			   this.$emit("incAmount",gid,newMeal,mealItems)
		   },
		   // 点击购物车中减号减号菜品数量或清空该菜品
		   decAmount(gid,newMeal,mealItems){
			   this.$emit("decAmount",gid,newMeal,mealItems)
		   },
		   // 显示数量输入框
		   showAmountInput(index){
			   this.SHOW_AMOUNT_INPUT({index:index})
		   },
		   // 监听购物车数量发生变化时
		   hideAmountInput(e,gid,newMeal,mealItems,index){
			   // 返回父组件接受数据
			   this.$emit("setAmountInput",e,gid,newMeal,mealItems,index)
			   //同时隐藏input 失去焦点
			   this.HIDE_AMOUNT_INPUT({index:index})
		   },
		   //清空购物车
		   delCartInfo(){
			  uni.showModal({
			  	title:"提示",
				content:"确认要清空购物车么",
				success: (res) => {
					if(res.confirm){
						this.$emit("delCartInfo")
					}
				}
			  }) 
		   },
		   // 点击遮罩层,关闭购物车组件
		   close(){
			   this.$emit("close")
		   }
	   }
    }
</script>

<style scoped>
    .mask{width:100%;height:100%;position: fixed;z-index:88;bottom:0px;left:0px;background-color:rgba(0,0,0,0.6)}
    .cart-main{width:100%;height:994rpx;background-color:#FFFFFF;position:absolute;bottom:0px;left:0px;z-index:89;transform: translateY(100%);transition:transform 0.3s;}
    .cart-main .nav{width:100%;height:100rpx;border-bottom: 1px solid #EFEFEF;display: flex;justify-content: space-between;align-items: center;box-sizing: border-box;padding:0px 20rpx;}
    .cart-main .nav-title{width:auto;height:auto;display:flex;}
    .cart-main .nav-title .icon{width:45rpx;height:45rpx;background-image:url("~@/static/images/goods/cart.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin-right:10rpx;}
    .cart-main .text{font-size:28rpx;color:#333333;}
    .cart-main .clear-main{width:auto;height:auto;display:flex;}
    .cart-main .clear-main .icon{width:36rpx;height:36rpx;background-image:url("~@/static/images/goods/clear.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin-right:10rpx;}
    .cart-main .goods-main{width:100%;height:730rpx;overflow:hidden;}
    .cart-main .goods-main .goods-list{width:94%;margin:0 auto;}
    .cart-main .goods-list .title-area{width:100%;height:90rpx;display:flex;justify-content: space-between;align-items: center;}
    .cart-main .goods-list .title-area .title{font-size:28rpx;color:#333333;}
    .cart-main .goods-list .goods-desc{width:94%;margin:0 auto;}
    .cart-main .goods-list .goods-desc-list{width:100%;height:auto;font-size:24rpx;color:#929292;display: flex;justify-content: space-between;margin-bottom:20rpx;}
    .cart-main .goods-list .pack-price{font-size:24rpx;color:#333333;}

    .price-amount{width:auto;height:100%;display:flex;justify-content: space-between;align-items: center;}
    .price-amount.points{font-size:28rpx;color:#333333;}
    .price-amount .price{width:auto;height:auto;font-size:28rpx;color:#333333;margin-right:20rpx;}
    .price-amount image{width:30rpx;height:30rpx;margin-right:10rpx;}
    .handle-amount{width:auto;height:60rpx;display:flex;align-items: center;justify-content:flex-end}
    .handle-amount .dec{width:55rpx;height:55rpx;background-image:url("~@/static/images/main/dec.png");background-size:100%;background-position: center;background-repeat: no-repeat;}
   .handle-amount .inc{width:55rpx;height:55rpx;background-image:url("~@/static/images/main/inc.png");background-size:100%;background-position: center;background-repeat: no-repeat;}
    .handle-amount .text{font-size:28rpx;color:#000000;margin-right:10rpx;margin-left:10rpx;width:50rpx;text-align:center;}
    .handle-amount .text.disabled{color:#9d9d9d}
    .handle-amount input{width:50rpx;height:100%;text-align: center;margin-right:10rpx;margin-left:10rpx;}
    .cart-main.show{transform: translateY(0%);}
    .goods-main .tip{width:100%;font-size:24rpx;color:#E30019;text-align:center;margin-top:30rpx;}
    .goods-main .scroll-wrap{
         width:100%;
         min-height:120%;
     }
</style>

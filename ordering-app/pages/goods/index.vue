<template>
	<view class="page">
		<view class="status_bar">
			<view class="bar-bg"></view>
		</view>
		<view :class="{header:true,ipx:true}">
			<view :class="{'mp-wrap':true,ipx:true}">
				<view class="mp-logo">
					<image src="../../static/images/common/logo.jpg"></image>
				</view>
				<view class="info">
					<view class="name">点餐小程序</view>
					<view class="desc">关注公众号，下次可在公众号中"点餐"！</view>
					<view class="focus" @click="focusWeixin()">关注</view>
				</view>
			</view>
		</view>
		<!-- 微信小程序开发组件：关注公众号 使用前需要进入小程序后台管理打开关注公众号设置 -->
		<official-account></official-account>
		<view class="business-wrap">
			<view class="business-info">
				<view class="business-logo">
					<image :src="shopInfo.logo"></image>
				</view>
				<view class="business-name">{{shopInfo.branch_shop_name}}</view>
				<view class="promotion">{{shopInfo.address}}</view>
				<view class="notice">{{shopInfo.full_notice}}</view>
				<view class="home" @click="goBack('/pages/main/main')"></view>
			</view>
		</view>
		<view class="tags">
			<view class="item-wrap">
				<view :class="{item:true,active:goodsAction}" @click="changeTag(true,false)">点餐</view>
				<view :class="{item:true, active:businessAction}" @click="changeTag(false,true)">商家</view>
			</view>
			<view class="tags-handle">
				<view class="myorder">
					<view class="myorder-icon"></view>
					<view class="text">订单</view>
				</view>
				<view class="line"></view>
				<view class="my"></view>
			</view>
		</view>
		<!-- 菜品组件 -->
		<goods :show="goodsAction" :branchShopId="branchShopId" :goodsId="goodsId" :shopGoods="shopGoods"
			:goodsItems="goodsItems" :goodsAmount="goodsAmount" @showGoodsDetails="showGoodsDetails"
			@incAmount="incAmount" @decAmount="setCartGoodsAmount" @setGoodsAmountInput="setAmountInput"></goods>
<<<<<<< HEAD
 		<!-- 商家组件 -->
=======
		<!-- 商家组件 -->
>>>>>>> c33a89b (点餐)
		<business :show="businessAction" :branchShopId="branchShopId"></business>
		<!--只有在菜品展示组件显示的情况下，才显示购物车导航-->
		<view class="cart-main" v-show="goodsAction" @click="CartShow()">
			<view class="handle-cart">
				<view class="cart-cle">
					<view class="cart-cle-2">
						<view class="cart-icon" id="cart-icon">
							<view class="badge" v-show="amountCount>0">{{amountCount}}</view>
						</view>
					</view>
				</view>
				<view class="total">￥{{isTotal}}</view>
			</view>
			<view class="line"></view>
			<view class="submit" @click.stop="submitPayInfo()">
<<<<<<< HEAD
				<template v-if="goodsAmount>0">提交订单 &gt;</template>
=======
				<template v-if="amountCount>0">提交订单 &gt;</template>
>>>>>>> c33a89b (点餐)
				<template v-else>未选购商品</template>
			</view>
		</view>
		<!-- 购物车组件 -->
		<cart :show="cartShowStatus" @close="isCartShow=false" :cartInfo="cartData" @incAmount="incAmount"
			@delCartInfo="delCartInfo" @decAmount="setCartGoodsAmount" @setAmountInput="setAmountInput"></cart>
	</view>
</template>

<script>
	import {
		mapActions,
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		name: "goods",
		data() {
			return {
				goodsAction: true, //是否显示菜品展示组件
				businessAction: false, //是否显示商家信息组件
				branchShopId: "", //商家ID
				goodsId: "", //菜品ID
				tableCode: "", //桌号（用于堂内扫码点餐）
				goodsAmount: 0, //点餐的数量（菜品展示显示、菜品详情显示、购物车显示
				isCartShow: false //购物车组件显示隐藏
			}
		},
		onLoad(opts) {
			this.branchShopId = opts.branch_shop_id ? opts.branch_shop_id : ""
			this.goodsId = opts.gid ? opts.gid : ""
			this.tableCode = opts.table_code ? opts.table_code : ""
			// console.log(this.goodsId)
			//商家信息
			this.getShopInfo({
				branch_shop_id: this.branchShopId
			})
			// 会员登录认证成功后获取购物车数量显示在界面
			this.$token.safeUser(this, this.branchShopId, this.tableCode, () => {
					this.getCart({
						branch_shop_id: this.branchShopId,
						table_code: this.tableCode,
						success:()=>{
							//商家菜品分类
							this.getShopGoods({
								branch_shop_id: this.branchShopId,
								complete: (res) => {
									//商家菜品信息
									this.getGoodsItemsInfo({
										branch_shop_id: this.branchShopId
									})
								}
							})
						}
					})
				}),
				//判断桌号是否存在
				this.SET_TABLE_CODE({
					isTableCode: this.tableCode
				})
		},
		methods: {
			// 菜品商家切换
			changeTag(goodsAction, businessAction) {
				this.goodsAction = goodsAction
				this.businessAction = businessAction
				// console.log(this.goodsAction, this.businessAction)
			},
			...mapMutations({
				"SET_TABLE_CODE": "cart/SET_TABLE_CODE", //判断桌号是否存在
				"SET_GOODS_AMOUNT":"goods/SET_GOODS_AMOUNT" //更新菜品数量
			}),
			...mapActions({
				getShopInfo: 'goods/getShopInfo', ////获取商家信息
				getShopGoods: 'goods/getShopGoods', //获取商家菜品分类
				getGoodsItemsInfo: "goods/getGoodsItemsInfo", //搜索菜品详情
				saveCart: "cart/saveCart", //提交购物车
				getCart: "cart/getCart", //获取购物车数据显示在购物车组件上
				deleteCart: "cart/deleteCart", //清空购物车
				setCartAmount: "cart/setCartAmount", //减少/删除购物车中菜品数量
				setAmount: "cart/setAmount" //输入数量更新购物车中菜品数量
			}),
			goBack(url) {
				uni.redirectTo({
					url
				})
			},
			// 接受子组件传来的菜品详情
			showGoodsDetails(val) {
				// 如果是套餐菜品
				if (val.is_meal === "1") {
					uni.navigateTo({
						url: `/pages/goods/meal?branch_shop_id=${this.branchShopId}&gid=${val.gid}&table_code=${this.tableCode}`
					})
				} else {
					this.goodsId = val.gid
					this.goodsAmount = val.amount
				}
			},
			//判断会员是否登录；gid,newMeal,mealItems：用于开发购物车所需参数
			incAmount(gid, newMeal, mealItems) {
				if (uni.getStorageSync("isLogin")) {
					// 已经登录,认证是否存在token，是否合法登录，合法登录商品加入购物车，否则强制退出重新登录
					//this:vuex
					this.$token.safeUser(this, this.branchShopId, this.tableCode, () => {
						//认证成功后组合数据添加购物车
						//循环菜品数据
						let isCartItems = false //判断是否为自定义套餐
						let newMealResult = (newMeal && newMeal.length > 0) ? JSON.stringify(newMeal) : ""
						for (let i = 0; i < this.goodsItems.length; i++) {
							//循环菜品详情数据
							for (let j = 0; j < this.goodsItems[i].goods.length; j++) {
								let newMealList = (this.goodsItems[i].goods[j].new_meal_items && this.goodsItems[i]
									.goods[j].new_meal_items.length > 0) ? JSON.stringify(this.goodsItems[i]
									.goods[j].new_meal_items) : ""
								if (this.goodsItems[i].goods[j].gid === gid && newMealList === newMealResult) {
									isCartItems = true //如果是默认套餐
									// 当点击加号时,菜品数量+1
									this.goodsAmount = parseInt(this.goodsItems[i].goods[j].amount) + 1

									// 组装数据为购物车页面显示/提交购物车使用
									let data = {
										title: this.goodsItems[i].goods[j].title,
										price: this.goodsItems[i].goods[j].price,
										amount: 1,
										pack_price: this.goodsItems[i].goods[j].pack_price ? this.goodsItems[i]
											.goods[j].pack_price : "", //打包费
										branch_shop_id: this.branchShopId, //分店id
										table_code: this.tableCode, //桌号
										meal_items: this.goodsItems[i].goods[j].meal_items, //套餐里的菜品详细
										gid: gid, //菜品id
										place_type: "0", //购物类型 0：普通订购
										is_meal: this.goodsItems[i].goods[j].is_meal, //是否为套餐 1：套餐 0：非套餐
										meal_type: "0", //套餐类型 1：固定套餐
										new_meal_items: this.goodsItems[i].goods[j].new_meal_items, //套餐里菜品的gid
										amountInput: false, //购物车数量input是否显示/切换view文本 解决卡顿问题
										amountInputFocus: false //切换购物车数量input自动获取焦点
									}
									// console.log(data)
									//提交购物车
									this.saveCart({
										cartData: data
									})

								}
							}
						}
						//如果为自定义套餐
						if (!isCartItems) {
							// 组装数据为购物车页面显示/提交购物车使用
							let data = {
								amount: 1,
								branch_shop_id: this.branchShopId, //分店id
								table_code: this.tableCode, //桌号
								meal_items: mealItems, //套餐里的菜品详细
								gid: gid, //菜品id
								is_meal: 1, //是否为套餐 1：套餐 0：非套餐
								meal_type: 1, //套餐类型 0：固定套餐 1：自定义套餐
								new_meal_items: newMeal, //套餐里菜品的gid
								amountInput: false, //购物车数量input是否显示/切换view文本 解决卡顿问题
								amountInputFocus: false //切换购物车数量input自动获取焦点
							}
							//提交购物车
							this.saveCart({
								cartData: data
							})
						}

					})
				} else {
					// 未登录,跳转到登录页面
					uni.showToast({
						title: "请先登录后操作",
						icon: "none",
						duration: 2000,
						success: () => {
							setTimeout(() => {
								uni.navigateTo({
									url: `/pages/login/index?branch_shop_id=${this.branchShopId}&table_code=${this.tableCode}`
								})
							}, 2000)
						}
					})

				}
			},
			//减少/清空购物车菜品数量
			setCartGoodsAmount(gid, newMeal, mealItem) {
				// 获取选中菜品的套餐gid数据用于判断是否为相同套餐
				let newMealResult = (newMeal && newMeal.length > 0) ? JSON.stringify(newMeal) : ""
				// 循环菜品数据,找到菜品中相同的数据做对比
				let isGoodsMeal = false //判断是否为默认/相同套餐
				for (let i = 0; i < this.goodsItems.length; i++) {
					for (let j = 0; j < this.goodsItems[i].goods.length; j++) {
						let goodsNewMeal = (this.goodsItems[i].goods[j].new_meal_items && this.goodsItems[i].goods[j]
								.new_meal_items.length > 0) ? JSON.stringify(this.goodsItems[i].goods[j].new_meal_items) :
							""
						if (gid === this.goodsItems[i].goods[j].gid && newMealResult === goodsNewMeal) {
							// 是相同菜品
							isGoodsMeal = true
							this.goodsItems[i].goods[j].amount = parseInt(this.goodsItems[i].goods[j].amount) - 1
							this.goodsAmount=this.goodsItems[i].goods[j].amount
							this.setCartAmount({
								cartData: this.goodsItems[i].goods[j],
								branch_shop_id: this.branchShopId
							})
						}
					}
				}
				if (!isGoodsMeal) {
					//自定义套餐
					this.setCartAmount({
						cartData: {  
							gid: gid,
							new_meal_items: newMeal,
							meal_type: "1"
						},
						branch_shop_id: this.branchShopId,

					})
				}
			},
			//输入数量更新购物车数量
			setAmountInput(e, gid, newMeal, mealItems) {
				let amount = e.target.value
				//更新菜品详情中数量
				this.SET_GOODS_AMOUNT({
					gid: gid,
					new_meal_items: newMeal,
					amount:amount
				})
				//更新购物车中数量
				this.setAmount({
					cartData: {
						gid: gid,
						new_meal_items: newMeal,
						amount:amount
 					},
					branch_shop_id: this.branchShopId
				})
			},
			//购物车显示隐藏
			CartShow() {
				this.$token.safeUser(this, this.branchShopId, this.tableCode, () => {
					this.getCart({
						branch_shop_id: this.branchShopId,
						table_code: this.tableCode,
						success: () => {
							this.isCartShow = true
						}
					})
				})
			},
			//清空购物车
			delCartInfo() {
				this.deleteCart({
					branch_shop_id: this.branchShopId,
					table_code: this.tableCode,
					success: () => {
						uni.showToast({
							title: "清空购物车成功",
							icon: "success",
							success: () => {

							}

						})
					}
				})
			},
			//提交订单跳转到订单页面
			submitPayInfo(){
				if(this.amountCount>0){
					uni.navigateTo({
						url:`/user_pages/order/index?branch_shop_id=${this.branchShopId}&table_code=${this.tableCode}&branch_shop_name=${this.shopInfo.branch_shop_name}`
					})
				}else{
					uni.showToast({
						title:"请先添加菜品",
						icon:"none"
					})
				}

			},
			// 点击关注按钮跳转web-view公众号页面
			focusWeixin() {
				uni.navigateTo({
					url: "/pages/main/focus"
				})
			},
			//分享小程序
			onShareAppMessage() {
				return {
					title: this.shopInfo.branch_shop_name,
					path: '/pages/goods/index?branch_shop_id=' + this.branchShopId + '&table_code=' + this.tableCode,
					imageUrl: this.shopInfo.logo
				}
			}
		},
		computed: {
			...mapState({
				shopInfo: state => state.goods.shopInfo, //商家信息
				shopGoods: state => state.goods.shopGoods, //菜品分类
				goodsItems: state => state.goods.goodsItems, //菜品详细
				cartData: state => state.cart.cartData, //购物车里的数据
				amountCount: state => state.cart.cartAmount, //购物车里菜品的数量
			}),
			// 计算属性计算当前店铺购物车总价格
			...mapGetters({
				isTotal: "cart/total"
			}),
			// 判断购物车里是否有数据,如果又则显示购物车组件,没有则隐藏
			cartShowStatus() {
				if (this.cartData.length > 0) {
					return this.isCartShow
				} else {
					this.isCartShow = false
					return this.isCartShow
				}
			}
		}
	}
</script>

<style scoped>
	.page {
		width: 100%;
		height: 100vh;
		overflow: hidden;
		position: relative;
	}

	.header {
		width: 100%;
		height: 300rpx;
		background-color: darkred;
		position: relative;
		z-index: 1;
	}

	/* #ifndef H5 */
	.header.official {
		height: 280rpx;
	}

	/* #endif */
	.business-wrap {
		width: 100%;
		height: 100rpx;
		position: relative;
		z-index: 1;
	}

	.header.ipx.official {
		height: 320rpx;
	}

	.status_bar {
		background-color: darkred
	}

	.status_bar .bar-bg {
		width: 90%;
		height: 100%;
		background-color: #FFFFFF;
		margin: 0 auto;
	}

	.business-wrap .business-info {
		width: 90%;
		height: 180rpx;
		background-color: #FFFFFF;
		position: absolute;
		z-index: 1;
		left: 50%;
		top: -60%;
		transform: translateX(-50%);
		box-shadow: 3px 3px 5px #efefef;
		border-radius: 5px;
	}

	.business-wrap .home {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 15rpx;
		top: 20rpx;
		z-index: 1;
		background-image: url("~@/static/images/goods/home.png");
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center;
	}

	.business-wrap .business-logo {
		width: 100rpx;
		height: 100rpx;
		position: absolute;
		z-index: 1;
		left: 35rpx;
		top: 15rpx;
	}

	.business-wrap .business-logo image {
		width: 100%;
		height: 100%;
		border-radius: 8px;
	}

	.business-wrap .business-name {
		width: 450rpx;
		height: 100rpx;
		font-size: 36rpx;
		color: #333333;
		position: absolute;
		z-index: 1;
		top: 20rpx;
		left: 156rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.business-wrap .promotion {
		width: 75%;
		height: 60rpx;
		position: absolute;
		z-index: 1;
		left: 156rpx;
		top: 80rpx;
		font-size: 26rpx;
		color: #E30019;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-decoration: underline;
	}

	.business-wrap .notice {
		width: 630rpx;
		height: 60rpx;
		position: absolute;
		z-index: 1;
		left: 35rpx;
		top: 130rpx;
		font-size: 26rpx;
		color: #999999;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.tags {
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 40px 25rpx;
		box-sizing: border-box;
	}

	.tags .item-wrap {
		width: auto;
		height: auto;
		display: flex;
	}

	.tags .item-wrap .item {
		width: auto;
		height: auto;
		color: #333333;
		font-size: 28rpx;
		padding: 10rpx 5rpx;
		margin-right: 30rpx;
	}

	.tags .item-wrap .item.focus {
		color: #E30019
	}

	.tags .item-wrap .item.active {
		border-bottom: 2px solid #ffd161;
		font-weight: bold;
	}

	.tags .myorder {
		width: 150rpx;
		height: 100%;
		border-radius: 15px;
		background-color: #f5f5f5;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 10rpx;
	}

	.tags .myorder-icon {
		width: 40rpx;
		height: 40rpx;
		background-image: url("~@/static/images/goods/myorder.png");
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center;
		margin-right: 10rpx;
	}

	.tags .myorder .text {
		color: #333333;
		font-size: 28rpx;
	}

	.tags .tags-handle {
		display: flex;
		height: 50rpx;
	}

	.tags .tags-handle .line {
		width: 3px;
		height: 100%;
		background-color: rgba(245, 245, 245, 0.6);
	}

	.tags .tags-text {
		font-size: 28rpx;
		color: #FFFFFF;
		margin-left: 10rpx;
		border-radius: 5px;
		background-color: #E30019;
		padding: 5rpx 10rpx;
	}

	.tags .my {
		width: 40rpx;
		height: 40rpx;
		background-image: url("~@/static/images/main/my.png");
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center;
		margin-left: 10rpx;
	}

	.cart-main {
		width: 100%;
		height: 100rpx;
		background-color: darkred;
		position: fixed;
		z-index: 90;
		left: 0px;
		bottom: 0px;
	}

	.cart-main .cart-cle {
		width: 130rpx;
		height: 130rpx;
		border-radius: 100%;
		background-color: darkorange;
		position: absolute;
		left: 56rpx;
		top: -40rpx;
	}

	.cart-main .cart-cle-2 {
		width: 100rpx;
		height: 100rpx;
		border-radius: 100%;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: #F8CE86
	}

	.cart-main .cart-icon {
		width: 60rpx;
		height: 60rpx;
		background-image: url("~@/static/images/main/cart.png");
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
		position: absolute;
		z-index: 1;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.cart-main .badge {
		width: 50rpx;
		height: 50rpx;
		border-radius: 100%;
		background-color: darkred;
		position: absolute;
		right: -35rpx;
		top: -35rpx;
		font-size: 24rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 50rpx;
		white-space: nowrap;
		overflow: hidden;
	}

	.cart-main .total {
		font-size: 36rpx;
		color: #FFFFFF;
		width: auto;
		height: auto;
		position: absolute;
		left: 180rpx;
		top: 50%;
		transform: translateY(-50%);
	}

	.cart-main .line {
		width: 2px;
		height: 62rpx;
		background-color: rgba(255, 255, 255, 0.6);
		position: absolute;
		z-index: 1;
		left: 507rpx;
		top: 50%;
		transform: translateY(-50%);
	}

	.cart-main .submit {
		width: 175rpx;
		height: 60rpx;
		position: absolute;
		z-index: 1;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 32rpx;
		color: #FFFFFF;
		line-height: 60rpx;
	}

	.cart-main .handle-cart {
		width: 65%;
		height: 100%;
	}

	.mp-wrap {
		width: 90%;
		margin: 0 auto;
		height: 180rpx;
		background-color: #FFFFFF;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		box-sizing: border-box;
		padding: 0px 20rpx;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
		overflow: hidden;
	}

	/* #ifdef H5 */
	.mp-wrap {
		height: 140rpx;
	}

	/* #endif */
	.mp-wrap.ipx {
		height: 220rpx;
	}

	.mp-wrap .mp-logo {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 20rpx;
	}

	.mp-wrap .mp-logo image {
		width: 100%;
		height: 100%;
		border-radius: 8px;
	}

	.mp-wrap .info {
		width: 84%;
		height: 80rpx;
		position: relative;
		z-index: 1;
		margin-bottom: 20rpx;
	}

	.mp-wrap .info .name {
		width: auto;
		height: auto;
		font-size: 28rpx;
		color: #5A5A5A;
		position: absolute;
		z-index: 1;
		left: 0px;
		top: 0px;
	}

	.mp-wrap .info .desc {
		width: auto;
		height: auto;
		font-size: 24rpx;
		color: #5A5A5A;
		position: absolute;
		z-index: 1;
		left: 0px;
		top: 45rpx;
	}

	.mp-wrap .info .focus {
		width: auto;
		height: auto;
		border: 1px solid #28A622;
		border-radius: 4px;
		font-size: 28rpx;
		color: #28A622;
		position: absolute;
		z-index: 1;
		right: 0px;
		top: 14rpx;
		padding: 5rpx 20rpx;
	}

	/* #ifdef MP-WEIXIN */
	.mp-wrap2 {
		width: 100%;
		margin: 0 auto;
		height: 230rpx;
		background-color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		box-sizing: border-box;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
		overflow: hidden;
		margin-top: 20rpx;
	}

	.mp-wrap2.ipx {
		height: 250rpx;
	}

	/* #endif */
</style>

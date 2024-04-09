<template>
	<view class="page">
		<view class="main">
			<view class="goods-main" v-for="(item,index) in goodsMeal" :key="index">
				<view class="nav">
					<view class="icon"></view>
					<view class="title">{{item.title}}(可选1份)</view>
				</view>
				<view class="goods-wrap">
					<view class="goods-list" v-for="(item2,index2) in item.goods" :key="index2"
						@click="checkGoodsMeal(index,index2)">
						<view class="image">
							<image :src="item2.image" alt=""></image>
						</view>
						<view class="text">{{item2.title}}</view>
						<view class="price" v-if="item2.offset_price!=0">
							{{item2.offset_price?"+"+item2.offset_price:item2.offset_price}}元
						</view>
						<view :class="{elc:true, active:item2.active}"></view>
					</view>
				</view>
			</view>
		</view>
		<view style="width:100%;height:120rpx;"></view>
		<view class="cart-main">
			<view class="total">小计：￥{{total}}</view>
			<view class="line"></view>
			<view class="cart" @click="addCart()">
				<view class="cart-icon"></view>
				<view class="text">加入购物车 ></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapActions,
		mapState,
		mapMutations
	} from "vuex"
	export default {
		name: "meal",
		onLoad(opts) {
			// console.log(opts)
			this.gid = opts.gid ? opts.gid : ""
			this.branch_shop_id = opts.branch_shop_id ? opts.branch_shop_id : ""
			this.table_code = opts.table_code ? opts.table_code : ""
			this.mealInfo = [] //选中的套餐数据重新组成的数组
			this.mealGid = [] //套餐中相同菜品的gid
			this.isSubmit = true //防止重复提交
			//获取套餐详情
			this.getGoodsMeal({
				"branch_shop_id": this.branch_shop_id,
				"gid": this.gid,
				// 获取完套餐数据后用异步回调做页面初始化完成获取默认套餐数据提交购物车
				success: () => {
					this.addCartData()
				}
			})
			//获取套餐标题设置为页面动态标题
			this.getGoodsMealTitle({
				"branch_shop_id": this.branch_shop_id,
				"gid": this.gid,
				success: () => {
					// console.log(this.goodsMealTitle)
					uni.setNavigationBarTitle({
						title: this.goodsMealTitle.title
					})
				}
			})
		},
		methods: {
			...mapActions({
				getGoodsMeal: "goods/getGoodsMeal", //套餐详情
				getGoodsMealTitle: "goods/getGoodsMealTitle", //套餐标题
				saveCart: "cart/saveCart" //提交购物车
			}),
			...mapMutations({
				SET_GOODS_MEAL_ACTIVE: "goods/SET_GOODS_MEAL_ACTIVE" //根据两层索引切换套餐中的菜品内容
			}),
			//根据两层索引切换套餐中的菜品内容
			checkGoodsMeal(index, index2) {
				this.SET_GOODS_MEAL_ACTIVE({
					"index": index,
					"index2": index2
				})
				this.$set(this.goodsMeal[index].goods, index2, this.goodsMeal[index].goods[index2])
				this.addCartData()
			},
			//套餐添加购物车组合套餐里选择的菜品详情数据
			addCartData() {
				if (this.goodsMeal.length > 0) {
					//将选中的套餐数据重新组装成数组传入给购物车
					this.mealInfo = []
					this.mealGid = []
					let newMeal = [] //用于选中菜品后重组的套餐数据
					for (let i = 0; i < this.goodsMeal.length; i++) {
						for (let j = 0; j < this.goodsMeal[i].goods.length; j++) {
							if (this.goodsMeal[i].goods[j].active) {
								newMeal.push({
									amount: "1",
									dis_amount: "1",
									...this.goodsMeal[i].goods[j]
								})
							}
						}
					}
					//判断选中的套餐中是否有相同菜品，如果有，将菜品的gid存入this.mealGid = [] //套餐中相同菜品的gid中用于做判断
					if (newMeal.length > 0) {
						// 定义一个json对象，key去套餐中的菜品的gid，用于判断菜品是否重复
						let mealJSON = {}
						//再次定义一个接受套餐选中菜品详情的集合，用于同mealInfo循环做对比找出重复菜品
						let newMealInfo = []
						for (let i = 0; i < newMeal.length; i++) {
							//如果key（循环套餐中菜品的gid）不存在，证明套餐中没有重复菜品,像json对象中添加此key并value设置为true用于判断
							if (!mealJSON[newMeal[i].gid]) {
								mealJSON[newMeal[i].gid] = true
								newMealInfo.push(newMeal[i])
								this.mealGid.push({"gid":newMeal[i].gid}) //组合套餐中选择的菜品的gid 用于后续判断相同套餐选择不同菜品
							} else {
								//否则说明套餐中有重复菜品出现，该菜品数量+1
								if (newMealInfo.length > 0) {
									for (let j = 0; j < newMealInfo.length; j++) {
										if (newMeal[i].gid === newMealInfo[j].gid) {
											newMealInfo[j].amount++
											newMealInfo[j].dis_amount = newMealInfo[j].amount
										}
									}
								}
							}
						}
						this.mealInfo = newMealInfo
					}
				}
			},
			//提交数据分别给客户端页面显示和服务端保存购物车数据
			addCart() {
				// 验证是否登录
				this.$token.safeUser(this, this.branch_shop_id, this.table_code, () => {
					if (this.isSubmit) {
						this.isSubmit = false
						// 组装数据为购物车页面显示/提交购物车使用
						let cartData = {
							title: this.goodsMealTitle, //套餐名称
							price: this.total, //套餐价格
							gid: this.gid, //套餐的gid
							amount: 1,
							branch_shop_id: this.branch_shop_id, //分店id
							table_code: this.table_code, //桌号
							meal_items: this.mealInfo, //套餐里的菜品详细
							place_type: "0", //购物类型 0：普通订购
							is_meal: "1", //是否为套餐 1：套餐 0：非套餐
							meal_type: "1", //套餐类型 1：固定套餐
							new_meal_items: this.mealGid, //套餐里菜品的gid
							amountInput: false, //购物车数量input是否显示/切换view文本 解决卡顿问题
							amountInputFocus: false //切换购物车数量input自动获取焦点
						}
						this.saveCart({
							cartData: cartData,
							success: () => {
								uni.showToast({
									title: "添加成功",
									icon: "success",
									duration: 2000,
									success: () => {
										setTimeout(() => {
											uni.hideToast()
											uni.navigateBack({
												delta: 1
											})

										}, 2000)
									}
								})
							}
						})
					}
				})
			}
		},
		// 计算属性里的方法可以直接渲染页面使用
		computed: {
			...mapState({
				goodsMeal: state => state.goods.goodsMeal,
				goodsMealTitle: state => state.goods.goodsMealTitle
			}),
			//计算不同菜品套餐最后总价
			total() {
				let total = 0
				for (let i = 0; i < this.goodsMeal.length; i++) {
					for (let j = 0; j < this.goodsMeal[i].goods.length; j++) {
						if (this.goodsMeal[i].goods[j].active) {
							total += parseFloat(this.goodsMeal[i].goods[j].meal_price)
						}
					}
				}
				return total.toFixed(2)
			}
		},
		watch: {
			goodsMealTitle(val) {
				// console.log("监听数据："+val)
			}
		}
	}
</script>

<style scoped>
	.page {
		width: 100%;
		min-height: 100%;
		margin: 0 auto;
		background-color: #EFEFEF;

	}

	.page .main {
		width: 95%;
		height: auto;
		background-color: #FFFFFF;
		margin: 0 auto;
		margin-top: 30rpx;
		border-radius: 6px;
		box-shadow: 3px 3px 5px #e7e7e7;
		overflow: hidden;
	}

	.page .goods-main {
		width: 90%;
		margin: 0 auto;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}

	.page .main .nav {
		width: 100%;
		height: 70rpx;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		border-bottom: 1px solid #EFEFEF;
		margin: 0 auto;
	}

	.page .main .nav .icon {
		width: 20rpx;
		height: 45rpx;
		background-color: #f6ab00;
		border-radius: 20px;
		margin-right: 20rpx;
	}

	.page .main .nav .title {
		font-size: 28rpx;
		color: #333333;
		font-weight: bold;
	}

	.page .main .goods-wrap {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.page .main .goods-list {
		width: 200rpx;
		height: 317rpx;
		box-shadow: 0px 3px 5px #e7e7e7;
		border-radius: 6px;
		margin-top: 30rpx;
		margin-left: 1%;
		margin-right: 1%;
		position: relative;
	}

	.page .main .goods-list .image {
		width: 160rpx;
		height: 160rpx;
		margin: 0 auto;
		margin-top: 20rpx;
	}

	.page .main .goods-list .image image {
		width: 100%;
		height: 100%;
		border-radius: 6px;
	}

	.page .main .goods-list .text {
		width: 160rpx;
		font-size: 24rpx;
		text-align: center;
		white-space: nowrap;
		color: #333333;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0 auto;
		margin-top: 20rpx;
	}

	.page .main .goods-list .price {
		text-align: center;
		font-size: 24rpx;
		color: #ff0000;
		margin-top: 5rpx;
	}

	.page .main .goods-list .elc {
		width: 50rpx;
		height: 50rpx;
		border-radius: 100%;
		border: 2px solid #EFEFEF;
		position: absolute;
		right: 0px;
		top: 0px;
		background-color: #FFFFFF;
	}

	.page .main .goods-list .elc.active {
		background-image: url("~@/static/images/goods/right.png");
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center;
	}

	.cart-main {
		width: 100%;
		height: 100rpx;
		background-color: darkred;
		position: fixed;
		z-index: 90;
		left: 0px;
		bottom: 0px;
		display: flex;
		align-items: center;
		padding: 0px 20rpx;
		box-sizing: border-box;
	}

	.cart-main .total {
		font-size: 28rpx;
		color: #FFFFFF;
		width: 408rpx;
	}

	.cart-main .line {
		width: 2px;
		height: 60rpx;
		background-color: rgba(255, 255, 255, 0.4);
		margin-right: 37rpx;
	}

	.cart-main .cart {
		width: auto;
		height: auto;
		display: flex;
		align-items: center;
	}

	.cart-main .cart .cart-icon {
		width: 60rpx;
		height: 60rpx;
		background-image: url("~@/static/images/goods/cart2.png");
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
		margin-right: 25rpx;
	}

	.cart-main .cart .text {
		font-size: 28rpx;
		color: #FFFFFF;
	}
</style>

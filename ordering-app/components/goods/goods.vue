<template>
	<view class="goods-area" v-show="show">
		<view class="goods-main">
			<!--菜品分类-->
			<scroll-view id="classify" scroll-with-animation="true" scroll-y="true" class="classify"
				:scroll-top="scrollItemsTop">
				<view :class="{item:true, active:item.active}" v-for="(item,index) in classifyItems" :key="item.cid">
					<view @click='goodsActives(index)'>{{item.title}}</view>
				</view>
				<view style="height:170rpx;"></view>
			</scroll-view>
			<!--菜品展示-->
			<scroll-view scroll-y="true" id="goods-wrap" class="goods-wrap" scroll-with-animation="true"
				:scroll-top="scrollTop" @scroll="goodsScroll">
				<view class="goods-classify">
					<!-- block相当于占位符，用于写循环使用 -->
					<block v-for="(item,index) in goodsInfo" :key="index">
						<view class="goods-classify-wrap">
							<!-- //获取item中在vuex里初始化用于监听固定定位title的样式 -->
							<view class="classify-name"
								:style="{left:item.left+'px',top:item.top+'px',position:item.position,zIndex:10}">
								{{item.title}}
							</view>
							<view class="goods-list-wrap">
								<view class="goods-list" v-for="(item2,index2) in item.goods" :key="index2"
									@click="showGoodsDetails(item2)">
									<view class="image">
										<image :lazy-load="true" :src="item2.image"></image>
									</view>
									<view class="goods-info">
										<view class="goods-title">{{item2.title}}</view>
										<view class="sales">销量：{{item2.sales}}</view>
										<!--如果是套餐-->
										<view class="meal" v-if="item2.is_meal==='1'">
											<view class="price">￥15</view>
											<view class="meal-buy">购买</view>
										</view>
										<!--如果非套餐-->
										<view class="price-wrap" v-else>
											<view class="price">￥{{item2.price}}</view>
											<view class="amount">
												<!--如果没有库存-->
												<template v-if="item2.stock<=0">
													<view class="handle-amount">
														<text>已售光</text>
													</view>
												</template>
												<!--
                                                如果菜品售卖在全部时间段
                                                -->
												<template v-else-if="item2.sell_time_type==='0'">
													<view class="handle-amount">
														<!--如果数量大于0，显示减号-->
														<view class="dec" v-if="item2.amount>0"
															@click.stop="decAmount(item2.gid,item2.new_meal_items,item2.meal_items)">
														</view>
														<!--
                                                        为了防止scroll-view组件内使用input卡顿的问题，先使用view组件显示数量，单击该组件，显示input输入框，并隐藏view组件，输入完成后使用@blur事件，隐藏input组件，显示view组件
                                                        -->
														<view class="text" v-if="item2.amount>0 && !item2.amountInput"
															@click.stop="showAmountInput(index,index2)">{{item2.amount}}
														</view>
														<input :value="item2.amount" type="number"
															v-if="item2.amountInput" :focus="item2.amountInputForcus"
															@blur="hideAmountInput($event,item2.gid,item2.new_meal_items,item2.meal_items,index,index2)" />
														<view class="inc"
															@click.stop="isLoginStatus(item2.gid,item2.new_meal_items,item2.meal_items)">
														</view>
													</view>
												</template>
												<!--
                                                如果菜品售卖在自定义时间段
                                                -->
												<template v-else>
													<!--在售卖期-->
													<template v-if="item2.sell_status==='1'">
														<view class="handle-amount">
															<view class="dec" v-if="item2.amount>0"
																@click.stop="decAmount(item2.gid,item2.new_meal_items,item2.meal_items)">
															</view>
															<!-- 菜品数量大于0且amountInput为false 显示文本，否则显示input -->
															<view class="text"
																v-if="item2.amount>0 && !item2.amountInput"
																@click.stop="showAmountInput(index,index2)">
																{{item2.amount}}
															</view>
															<input :value="item2.amount" type="number"
																v-if="item2.amountInput"
																@blur="hideAmountInput($event,item2.gid,item2.new_meal_items,item2.meal_items,index,index2)" />
															<view class="inc"
																@click.stop="isLoginStatus(item2.gid,item2.new_meal_items,item2.meal_items)">
															</view>
														</view>
													</template>
													<template v-else>
														<text>非可售时间</text>
													</template>
												</template>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view style="width:100%;height:190rpx;"></view>
			</scroll-view>
		</view>
		<Details :show="isDetailsShow" :detailsGid="goodsId" :branchShopId="branchShopId" :goodsAmount="goodsAmount"
			@close="isDetailsShow=false" @incAmount="isLoginStatus" @decAmount="decAmount" @setAmount="hideAmountInput">
		</Details>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	import Details from '../../components/goods/details.vue'
	export default {
		name: "goods-component",
		data() {
			return {
				classifyItems: [], //菜品分类 循环数据
				goodsInfo: [], //菜品，循环数据,
				scrollTop: "", //每个菜品区域的top
				scrollItemsTop: "", //每个菜品分类区域的top
				isDetailsShow: false, //是否显示菜品详情组件
			}
		},
		props: {
			//是否显示菜品组件
			show: {
				type: Boolean,
				default: false
			},
			//菜品的id
			goodsId: {
				type: String,
				default: ""
			},
			//商家id
			branchShopId: {
				type: String,
				default: ""
			},
			//菜品分类信息
			shopGoods: {
				type: Array,
				default: () => []
			},
			// 菜品信息
			goodsItems: {
				type: Array,
				default: () => []
			},
			goodsAmount: {
				type: Number,
				default: 0
			}
		},

		mounted() {
			this.goodsTop = 0; //菜品详情scroll-view距离顶部的top
			this.goodsHeight = 0;
			this.goodsLeft = 0; //菜品详情scroll-view距离顶部的left
			this.goodsJson = {} //获取到的菜品的gid作为key，将其相对应的位置top作为value 存储到json对象中用和搜索页面传来的gid相匹配从而拿到定位
			// watch监听如果访问同一家店铺失效问题
			if (this.shopGoods && this.shopGoods.length > 0) {
				this.classifyItems = this.shopGoods
			}
			if (this.goodsItems && this.goodsItems.length > 0) {
				this.goodsInfo = this.goodsItems
			}
			this.isGoodsPosition = true //控制菜品区域定位只在页面加载时执行一次，过后不再执行
		},
		methods: {
			...mapMutations({
				"SET_GOODS_POSITION": "goods/SET_GOODS_POSITION", //改变vuex中goodsItems数据中的定位，解决滚动定位不准确问题
				"SHOW_AMOUNT_INPUT": "goods/SHOW_AMOUNT_INPUT", //菜品组件显示数量输入框
				"HIDE_AMOUNT_INPUT": "goods/HIDE_AMOUNT_INPUT" //菜品组件隐藏输入框
			}),
			goodsActives(index) {
				if (this.classifyItems.length > 0) {
					for (let i = 0; i < this.classifyItems.length; i++) {
						if (this.classifyItems[i].active) {
							this.classifyItems[i].active = false
							break
						}
					}
					this.classifyItems[index].active = true
					this.$set(this.classifyItems, index, this.classifyItems[index])
					//将每一个菜品区域的top赋值菜品区域的scroll-view，从而达到点击左侧菜品分类，右侧滚动条滚动到相应位置
					setTimeout(() => {
						this.scrollTop = this.classifyItems[index].goodsTop
					}, 50)

				}
			},
			//获取菜品位置
			getGoodsPosition() {
				// 先获取菜品的scrool-view节点信息，来获取top，left，height
				let goodsWrap = uni.createSelectorQuery().in(this).select(".goods-wrap")
				goodsWrap.boundingClientRect(data => {
					this.goodsTop = data.top //对应vuex中分类的top
					this.goodsHeight = data.height //对应vuex中的goodsheight 菜品的高度
					this.goodsLeft = data.left //对应vuex中分类的left 
					//获取.goods-classify-wrap节点信息，获取所有菜品分类top,height,left
					let goodsClassify = uni.createSelectorQuery().in(this).selectAll(".goods-classify-wrap")
					goodsClassify.boundingClientRect(goodsData => {
						if (goodsData.length > 0) {
							let goodsWrapTop = 0
							for (let i = 0; i < goodsData.length; i++) {
								//因为每个菜品的top目前是相对于整个窗体，距离窗体顶部还有this.goodsTop的距离 故而做减法
								goodsWrapTop = goodsData[i].top - this
									.goodsTop //用每一个菜品距离顶部的距离减去scrool-view距离顶部的距离从而得到相对应scrool-view的菜品距离从0开始
								// console.log(goodsData[i])
								this.classifyItems[i].goodsTop = goodsWrapTop //将每一个菜品区域的top赋值给菜品分类
								this.classifyItems[i].goodsHeight = goodsData[i].height //菜品区域上方固定分类样式高度
								// this.classifyItems[i].top = goodsData[i].top //菜品区域上方固定分类样式top
							}
							//获取列表内每个菜品的节点信息，top，left,height
							let goodsList = uni.createSelectorQuery().in(this).selectAll(".goods-list")
							goodsList.boundingClientRect(listData => {
								if (listData.length > 0) {
									// 定义一个索引
									let itemsIndex = 0
									//循环菜品分类
									for (let i = 0; i < this.goodsInfo.length; i++) {
										//循环菜品分类下的菜品信息，为top赋值 定位每个菜品
										for (let j = 0; j < this.goodsInfo[i].goods.length; j++) {
											this.goodsInfo[i].goods[j].top = listData[itemsIndex]
												.top
											itemsIndex++
											// 为goodsJson赋值
											let gid = this.goodsInfo[i].goods[j].gid
											this.goodsJson[gid] = this.goodsInfo[i].goods[j].top


										}
									}
									//搜索进入定位菜品信息
									this.setItemPosition()
								}
							}).exec() //exec 执行所有节点信息内容
						}
					}).exec()
				}).exec()
			},
			//监听菜品滚动事件
			goodsScroll(e) {
				// console.log(e.detail.scrollTop)
				if (this.classifyItems.length > 0) {
					for (let i = 0; i < this.classifyItems.length; i++) {
						// 当当前滚条位置大于距离顶部距离且同时小于当前菜品高度整体距离顶部距离时候,就是当前菜品可视区域
						if (this.classifyItems[i].goodsTop <= e.detail.scrollTop && e.detail.scrollTop <= this
							.classifyItems[i].goodsTop + this.classifyItems[i].goodsHeight) {
							//将其他点击状态设置为fasle，如果使用esle设置会出现最后底部区域无法设置的问题
							for (let key in this.classifyItems) {
								if (this.classifyItems[key].active) {
									this.classifyItems[key].active = false
									break
								}
							}
							//判断是否滚动到菜单底部，如果滚动到scroll-view底部区域 强制左侧菜品分类切换到最后一个分类,解决最后一个菜品分类很少无法滚动的情况下，左侧菜单分类不更新
							// console.log(parseInt(e.detail.scrollTop/e.detail.scrollHeight*100))
							if (parseInt(e.detail.scrollTop / e.detail.scrollHeight * 100) >= 90) {
								this.classifyItems[this.classifyItems.length - 1].active = true
							} else {
								this.classifyItems[i].active = true
							}
							//菜品分类滚动到相应位置，滚动条自动滚动
							this.scrollItemsTop = this.classifyItems[i].top
							// console.log(this.classifyItems[i])
							//将非可视区域的标题改为静态定位从而达只显示当先可视区域标题
							for (let goodsKey in this.goodsInfo) {
								//如果定位存在固定定位修改为静态定位
								if (this.goodsInfo[goodsKey].position === "fixed") {
									this.goodsInfo[goodsKey].position = "static"
									this.goodsInfo[goodsKey].top = 0
									this.goodsInfo[goodsKey].left = 0
									//改变vuex中的goodsItems数据的定位,解决点击加号后固定标题头丢死，定位卡顿问题
									this.SET_GOODS_POSITION({
										index: goodsKey,
										position: "static",
										top: 0,
										left: 0
									})
									break
								}
							}
							//菜品区域上方菜品分类固定定位随之更替
							this.goodsInfo[i].position = "fixed"
							this.goodsInfo[i].left = this.goodsLeft
							this.goodsInfo[i].top = this.goodsTop - 10
							//改变vuex中的goodsItems数据的定位
							this.SET_GOODS_POSITION({
								index: i,
								position: "fixed",
								top: this.goodsTop - 10,
								left: this.goodsLeft
							})
						}
					}
				}
			},
			//获取菜品分类位置,实现步骤和获取菜品一样
			getGoodsItemsPosition() {
				//获取菜品分类scroll-view距离屏幕顶部距离
				let goodsItems = uni.createSelectorQuery().in(this).select(".classify")
				goodsItems.boundingClientRect(data => {
					let goodsItemsTop = data.top
					// 获取每个菜品分类区域距离顶部距离
					let goodsClassifyItems = uni.createSelectorQuery().in(this).selectAll(".classify .item")
					goodsClassifyItems.boundingClientRect(data => {
						if (data.length > 0) {
							for (let i = 0; i < data.length; i++) {
								//用每个菜品分类相对于窗体的top距离减去菜品分类的scroll-view距离窗体的top距离 得到每个菜品分来相对于菜品分类的scroll-view的top距离
								this.classifyItems[i].top = data[i].top - goodsItemsTop

							}
						}

					}).exec()
				}).exec()
			},
			//搜索页面进入菜品页面定位菜品位置
			setItemPosition() {
				if (this.goodsId && this.goodsInfo.length > 0) {
					console.log(this.goodsJson[this.goodsId])
					setTimeout(() => {
						//如果gid存在且商品不为0时，获取goodsJson中的相对应的gid 的top（相对于窗体），减去scroll-view的top（相对于窗体），得到相对于scroll-view的top达到定位效果
						this.scrollTop = this.goodsJson[this.goodsId] - this.goodsTop - 50
					}, 50)
				}
			},
			//菜品组件显示输入框
			showAmountInput(index, index2) {
				this.SHOW_AMOUNT_INPUT({
					index: index,
					index2: index2
				})
			},
			//菜品组件隐藏输入框同时更新vuex中的数据源
			hideAmountInput(e, gid, newMeal, mealItems, index, index2) {
				this.$emit("setGoodsAmountInput", e, gid, newMeal, mealItems)
				this.HIDE_AMOUNT_INPUT({
					index: index,
					index2: index2
				})
			},
			//显示菜品详情组件
			showGoodsDetails(val) {
				if (val.stock > 0) {
					if (val.is_meal === "0") {
						this.isDetailsShow = true
					}
				} else {
					uni.showToast({
						title: "菜品暂时不可选购哦，再看看别的啦！",
						icon: "none"
					})
				}
				// 购买数量犹豫在菜品详情/菜品展示以及购物车页面均为相同,这里统一用点餐页面(父页面)做逻辑
				this.$emit("showGoodsDetails", val)
			},
			// 点击加号增加数量同时判断是否登录，逻辑在父页面写
			isLoginStatus(gid, newMeal, mealItem) {
				//传值给父组件，用于做购物车逻辑
				this.$emit("incAmount", gid, newMeal, mealItem)
			},
			//点击减号 减少数量/清空菜品，同加号逻辑相同
			decAmount(gid, newMeal, mealItem) {
		
				
				this.$emit("decAmount", gid, newMeal, mealItem)
			}
		},
		components: {
			Details
		},
		//组件传值容易存在异步获取延迟问题，这里监听数据动向后赋值
		watch: {
			// 监听菜品分类，相同店铺仅执行第一次,
			shopGoods(shopGoods) {
				this.classifyItems = shopGoods
			},
			// 监听菜品，相同店铺仅执行第一次
			goodsItems(goodsItems) {
				this.goodsInfo = goodsItems
				// console.log(goodsItems)

			},
			goods() {
				this.getGoodsItemsPosition()
			},
			goodsInfo() {
				if (this.isGoodsPosition) {
					this.isGoodsPosition = false
					// 监听到菜品数据发生改变后调用获取菜品位置
					this.getGoodsPosition()
				}
			}
		}
	}
</script>

<style scoped>
	.goods-area {
		width: 100%;
	}

	.goods-main {
		width: 100%;
		height: 70vh;
		overflow: hidden;
		display: flex;
		justify-content: space-between;
	}

	.goods-main .classify {
		height: 90%;
		width: 156rpx;
		background-color: #fafafa;
	}

	.goods-main .classify .item {
		width: 100%;
		height: 72rpx;
		overflow: hidden;
		margin-bottom: 40rpx;
		position: relative;
		z-index: 1;
	}

	.goods-main .classify .item view {
		width: 80%;
		font-size: 28rpx;
		color: #999999;
		position: absolute;
		z-index: 1;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%)
	}

	.goods-main .classify .item.active {
		background-color: #FFFFFF;
	}

	.goods-main .classify .item.active view {
		color: #333333
	}

	.goods-main .goods-wrap {
		width: 76%;
		height: 90%;
	}

	.goods-main .goods-classify {
		width: 100%;
	}

	.goods-main .goods-classify .classify-name {
		width: 100%;
		height: auto;
		font-size: 28rpx;
		color: #333333;
		font-weight: bold;
		background-color: #FFFFFF;
	}

	.goods-main .goods-list-wrap {
		width: 100%;
		height: auto;
		margin-bottom: 20rpx;
	}

	.goods-main .goods-list-wrap .goods-list {
		width: 100%;
		height: auto;
		display: flex;
		justify-content: space-between;
		margin-top: 40rpx;
		align-items: center
	}

	.goods-main .goods-list-wrap .goods-list .image {
		width: 180rpx;
		height: 180rpx;
		border-radius: 6px;
	}

	.goods-main .goods-list-wrap .goods-list .image image {
		width: 100%;
		height: 100%;
		border-radius: 6px;
	}

	.goods-main .goods-list .goods-info {
		width: 62%;
		height: auto;
		margin-right: 20rpx;
	}

	.goods-main .goods-list .goods-title {
		width: 100%;
		height: 80rpx;
		overflow: hidden;
		font-size: 28rpx;
		color: #333333;
		font-weight: bold;
	}

	.goods-main .goods-list .sales {
		font-size: 24rpx;
		color: #999999;
		margin-top: 10rpx;
	}

	.goods-main .goods-list .points {
		font-size: 24rpx;
		color: #D6001C;
		margin-top: 10rpx;
	}

	.goods-main .goods-list .price {
		font-size: 28rpx;
		color: #fb4e44;
		font-weight: bold;
	}

	.goods-main .goods-list .price-wrap {
		width: 100%;
		margin-top: 10rpx;
		display: flex;
		justify-content: space-between;
	}

	.goods-main .goods-list .meal {
		width: 100%;
		margin-top: 10rpx;
		display: flex;
		justify-content: space-between;
	}

	.goods-main .goods-list .meal .meal-buy {
		width: 110rpx;
		height: 50rpx;
		background-color: #D6001C;
		color: #FFFFFF;
		text-align: center;
		line-height: 50rpx;
		font-size: 28rpx;
		border-radius: 4px;
	}

	.goods-main .goods-list .amount {
		width: auto;
		height: auto;
		display: flex;
	}

	.goods-main .goods-list .amount text {
		font-size: 24rpx;
		color: #999999;
	}

	.goods-main .goods-list .handle-amount {
		width: auto;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end
	}

	.goods-main .goods-list .handle-amount .dec {
		width: 55rpx;
		height: 55rpx;
		background-image: url("~@/static/images/main/dec.png");
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
	}

	.goods-main .goods-list .handle-amount .inc {
		width: 55rpx;
		height: 55rpx;
		background-image: url("~@/static/images/main/inc.png");
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
	}

	.goods-main .goods-list .handle-amount .text {
		font-size: 28rpx;
		color: #333333;
		margin-right: 10rpx;
		margin-left: 10rpx;
		width: 50rpx;
		text-align: center;
	}

	.goods-main .goods-list .start-sell {
		width: 100%;
		height: auto;
		font-size: 24rpx;
		color: #999999;
	}

	.goods-main .goods-list .handle-amount input {
		width: 50rpx;
		height: 100%;
		text-align: center;
		margin-right: 10rpx;
		margin-left: 10rpx;
	}
</style>

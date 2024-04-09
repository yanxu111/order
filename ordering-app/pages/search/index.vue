<template>
    <view class="page">
        <view class="status_bar bg-color"></view>
        <view :class="{nav:true,wechat:true,ipx:true}">
            <view class="back" @click="back()"></view>
            <view class="title">搜索</view>
        </view>
        <view :class="{header:true,ipx:false}">
            <view :class="{'search-header':true}">
                <view class="search-wrap"  @click="isShow=true">
                    <view class="icon"></view>
                    <view class="search">输入商家名或菜品</view>
                </view>
            </view>
        </view>
        <view :class="{main:true,ipx:true}" v-if="shopSearch.length>0">
            <view class="goods-wrap" v-for="(item,index) in shopSearch" :key="item.gid" @click="goPage('/pages/goods/index?branch_shop_id='+item.branch_shop_id+'&gid='+item.gid)">
                <view class="shop">
                    <view class="shop-name">{{item.branch_shop_name}}</view>
                    <view class="distance">{{item.distance}}</view>
                </view>
                <view class="goods-list">
                    <view class="image"><image :src="item.image"></image></view>
                    <view class="goods-info">
                        <view class="goods-title">{{item.title}}</view>
                        <view class="sales">销量：{{item.sales}}</view>
                        <view class="price-wrap">
                            <view class="price">￥{{item.price}}</view>
                        </view>
                    </view>
                </view>
            </view>		 
        </view>
		<!-- no-data 公共类，在app.vue中定义 -->
        <view class="no-data" v-if="shopSearch.length<=0">没有相关菜品！</view>
		<search :show="isShow" @close="isShow=false" :isLocal="true"></search>
    </view>
</template>

<script>
	import {mapActions,mapState} from "vuex"
    export default {
        name: "search",
        data(){
            return {
                isShow:false,
            }
        },
		onLoad(opts) {
			this.keyWords=opts.keywords?decodeURIComponent(opts.keywords):""
			// console.log(opts)
			// 当前页
			this.curPage=1; 
			//最大页码
			this.pageNum=0;
			// console.log(this.shopSearch.length)
		},
		onShow() {
			uni.getLocation({
				type: 'gcj02',
				success:  (res)=> {
					this.lng=res.longitude
					this.lat=res.latitude
					this.getSearchShop({page:1,kwords:this.keyWords,lng:this.lng,lat:this.lat,success:(res)=>{
						this.pageNum=res
					}})
				},fail:(ex)=> {
					console.log(ex)
				}
			});
			
		},
		methods:{
			...mapActions({
				getSearchShop:"search/getSearchShop",//搜索菜品结果
				getSearchShopReach:"search/getSearchShopReach"//搜索菜品结果上拉加载	
			}),
			goPage(url){
				uni.redirectTo({
					url
				})
			},
			back(){
				uni.navigateBack({
					delta:1
				})
			}
		},
		onReachBottom() {
			// console.log(this.pageNum)
			if(this.curPage<this.pageNum){
				this.curPage++
				this.getSearchShopReach({page:this.curPage,kwords:this.keyWords,lng:this.lng,lat:this.lat})
			}else{
					uni.showToast({
						icon:'none',
						title:"刷不动啦！已经到底儿啦"
					})
				}

		},
		computed:{
			...mapState({
				shopSearch:state=>state.search.shopSearch //搜索菜品结果
			})
		}
    
    }
</script>

<style scoped>
    .page{width:100%;background-color:#FFFFFF;overflow:hidden;}
    .status_bar.bg-color{background-color:darkred;}
    .nav{width:100%;height:88rpx;background-color:darkred;position: fixed;z-index:91;left:0;top:0;display: flex;justify-content: space-between;align-items: center;}
    .nav .back{width:40rpx;height:40rpx;background-image:url("~@/static/images/common/back.png");background-size:100%;background-repeat: no-repeat;background-position: center;}
    .nav .title{position: absolute;z-index:1;left:50%;top:50%;transform: translate(-50%,-50%);color:#FFFFFF;font-size:28rpx;}
    .header{width:100%;background-color:darkred;overflow:hidden;position: fixed;left:0;top:88rpx;z-index:90;}
    .search-header{width:100%;height:auto;display: flex;justify-content: center;align-items: flex-end;margin-top:88rpx;box-sizing: border-box;padding-bottom:20rpx;}
    .header .search-wrap{width:80%;height:52rpx;background-color:rgba(255,255,255,0.9);border-radius: 5px;display:flex;justify-content: start;align-items: center;}
    .header .search-wrap .icon{width:44rpx;height:44rpx;background-image:url("~@/static/images/main/search_icon.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin:0 20rpx;}
    .header .search-wrap .search{font-size:28rpx;color:#999999;}

    .main{width:100%;margin:0 auto;margin-top:280rpx;overflow:hidden;}
    .goods-wrap{width:100%;overflow:hidden;margin-bottom:40rpx;border-bottom: 1px solid #EFEFEF;box-sizing: border-box;padding-left:50rpx;padding-right:50rpx;padding-bottom:50rpx;}
    .shop{width:100%;height:36rpx;display: flex;justify-content: space-between;align-items: center;overflow:hidden;}
    .shop .shop-name{font-size:36rpx;font-weight: bold;width:80%;height:54rpx;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;}
    .shop .distance{font-size:24rpx;color:#666666;}
    .goods-list{width:100%;height:auto;display:flex;justify-content: space-between;margin-top:20rpx;}
    .goods-list .image{width:180rpx;height:180rpx;border-radius: 6px;}
    .goods-list .image image{width:100%;height:100%;border-radius: 6px;}
    .goods-list .goods-info{width:62%;height:auto;margin-right:20rpx;}
    .goods-list .goods-title{width:100%;height:80rpx;overflow:hidden;font-size:28rpx;color:#333333;font-weight: bold;}
    .goods-list .sales{font-size:24rpx;color:#999999;margin-top:10rpx;}
    .goods-list .price{font-size:28rpx;color:#fb4e44;font-weight: bold;}
    .goods-list .price-wrap{width:100%;margin-top:10rpx;display:flex;justify-content: space-between;}

    /*#ifdef MP-WEIXIN*/
    .nav.wechat{padding-top:70rpx;}
    .nav.wechat.ipx{padding-top:90rpx;}
    .nav.wechat .title{top:65%}
    .nav.wechat.ipx .title{top:75%}
    .header.ipx{top:170rpx;}
    .main.ipx{margin-top:330rpx;}
    /*#endif*/
</style>

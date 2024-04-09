<template>
    <view class="page" v-show="show">
        <view class="status_bar"></view>
        <view :class="{'search-title':true,wechat:true,ipx:true}">
            <view class="search-close" @click="close()"></view>
            <view class="title">搜索</view>
        </view>
        <view class="search-header">
            <view class="search-wrap">
                <view class="search-input"><input type="text" confirm-type="search" placeholder="请输入商家或菜品名称" :focus="isFocus" :value="keywords" @input="setKeywords" @confirm="goSearch($event)" /></view>
                <view class="search-btn" @click="goSearch($event)"></view>
            </view>
        </view>
        <view class="search-main">
            <view class="search-area" v-if="historyKeyWords.length>0">
                <view class="search-name-wrap">
                    <view class="search-name">最近搜索</view>
                    <view class="bin" @click="clearHistoryKeywords"></view>
                </view>
                <view class="search-kwords">
                    <view class="kwords" v-for="(item,index) in historyKeyWords" :key="index" @click="goSearch($event,item)">{{item}}</view>
                </view>
            </view>
            <view class="search-area">
                <view class="search-name-wrap">
                    <view class="search-name">热门搜索</view>
                </view>
                <view class="search-kwords">
                    <view class="kwords" v-for="(item,index) in popularSearch" :key="index" @click="goSearch($event,item.title)">{{item.title}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {mapState,mapMutations,mapActions} from "vuex";
    export default {
        name: "search",
        data(){
            return {
                isFocus:false
            }
        },
        props:{
            //是否显示搜索组件
            show:{
                type:Boolean,
                default:false
            },
            //是否在搜索页面进行搜索
            isLocal:{
                type:Boolean,
                default:false
            }
        },
        computed:{
            ...mapState({
                // isIpx:state=>state.system.isIpx,
                keyWords:state=>state.search.keyWords,
                historyKeyWords:state=>state.search.historyKeyWords,
                popularSearch:state=>state.search.popularSearch
            })
        },
        mounted(){
            //获取热门搜索关键词
            this.getPopularSearch();
        },
        methods:{
            ...mapMutations({
                SET_KEYWORDS:"search/SET_KEYWORDS",//设置搜索关键词
                SET_HISTORY_KEYWORDS:"search/SET_HISTORY_KEYWORDS",//设置历史关键词
                DELETE_HISTORY_KEYWORDS:"search/DELETE_HISTORY_KEYWORDS"//清除历史关键词
            }),
            ...mapActions({
                getPopularSearch:"search/getPopularSearch"//获取热门搜索关键词
            }),
            //隐藏搜索组件
            close(){
                this.$emit("close")
            },
            //设置搜索关键词
            setKeywords(e){
                this.SET_KEYWORDS({keyWords:e.target.value})
            },
            //跳转到搜索页面
            goSearch(e,kwords){
                let keywords=kwords || this.keyWords;
                if(keywords.trim()){
                    this.SET_HISTORY_KEYWORDS({historyKeyWords:keywords});
                    //隐藏搜索组件
                    this.close();
                    if(this.isLocal){
                        uni.redirectTo({
                            url:"/pages/search/index?keywords="+encodeURIComponent(keywords)
                        })
                    }else{
                        uni.navigateTo({
                            url:"/pages/search/index?keywords="+encodeURIComponent(keywords)
                        })
                    }
                }else {
                    uni.showToast({
                        title:"请输入关键词",
                        icon:"none",
                        duration:2000
                    })
                }
            },
            //清除最近搜索
            clearHistoryKeywords(){
                uni.showModal({
                    title: '系统提示',
                    content: '确认要清除最近搜索吗？',
                    success: (res)=> {
                        if (res.confirm) {
                            this.DELETE_HISTORY_KEYWORDS();
                        }
                    }
                });
            }
        },
        watch:{
            show(val){
                setTimeout(()=>{
                    this.isFocus=val;
                },300)
            }
        }
    }
</script>

<style scoped>
    .page{width:100%;height:100%;position: fixed;left:0;top:0;z-index:999;background-color:#FFFFFF;}
    .search-header{width:100%;height:100rpx;border-bottom: 1px solid #EFEFEF;display: flex;box-sizing: border-box;padding:0px 20rpx;}
    .search-title .search-close{width:50rpx;height:50rpx;background-image:url("~@/static/images/common/back2.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin-right:20rpx;}
    .search-header .search-wrap{width:95%;height:68rpx;border:1px solid #b2b2b2;border-radius: 5px;display: flex;justify-content: space-between;align-items: center;margin:0 auto;}
    .search-header .search-wrap .search-input{width:85%;height:100%;border-right:1px solid #b2b2b2;}
    .search-header .search-wrap .search-input input{width:90%;height:100%;font-size:28rpx;padding-left:20rpx;}
    .search-header .search-wrap .search-btn{width:50rpx;height:50rpx;background-image:url("~@/static/images/main/search_icon.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin-right:20rpx;}
    .search-title{width:100%;height:100rpx;display:flex;position: relative;z-index:1;align-items: center;margin-top:0rpx;box-sizing: border-box;padding:0 20rpx;}
    /*#ifdef MP-WEIXIN*/
    .search-title.wechat{margin-top:40rpx;}
    .search-title.wechat.ipx{margin-top:80rpx;}
    /*#endif*/
    .search-title .title{width:auto;position: absolute;z-index:1;left:50%;top:50%;transform: translate(-50%,-50%);text-align: center;font-size:36rpx;}

    .search-main{width:100%;}
    .search-main .search-area{width:93%;margin:0 auto;}
    .search-main .search-area .search-name-wrap{width:100%;display:flex;justify-content: space-between;margin-top:20rpx;}
    .search-main .search-area .bin{width:40rpx;height:40rpx;background-image:url("~@/static/images/main/bin.png");background-size:100%;background-repeat: no-repeat;background-position: center;}
    .search-main .search-area .search-name{font-size:28rpx;}
    .search-main .search-area .search-kwords{width:100%;display: flex;flex-wrap: wrap;margin-top:20rpx;}
    .search-main .search-area .search-kwords .kwords{width:170rpx;height:64rpx;background-color:#FFFFFF;border:1px solid #EFEFEF;border-radius: 20px;font-size:28rpx;color:#717376;text-align:center;line-height:64rpx;white-space: nowrap;overflow:hidden;text-overflow: ellipsis;padding:0 20rpx;margin:0 8rpx;margin-bottom:20rpx;}
</style>

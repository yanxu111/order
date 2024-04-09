<template>
	<view class="page">
		<map class="map" :latitude="lat" :longitude="lng" :markers="markers"></map>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default{
		name:"address-map",
		data(){
			return{
					lat:0,
					lng:0,
					markers:[
						{
							id:1,
							latitude:0,
							longitude:0,
							iconPath:"../../static/images/business_map/map_pos.png",
							width:30,
							height:30,
							callout:{
								content:"",
								color:"#FF0000",
								fontSize:"24rpx",
								borderRadius:10,
								borderWidth:1,
								borderColor:"#EFEFEF",
								bgColor:"#ffffff",
								padding:5,
								display:"ALWAYS",
								textAlign:"center",
								
							}
						}
					]
			}
		},
		onLoad(opts) {
			this.lat=opts.lat?opts.lat:""
			this.lng=opts.lng?opts.lng:""
			this.branchShopId=opts.branchShopId?opts.branchShopId:""
			this.markers[0].latitude=this.lat
			this.markers[0].longitude=this.lng
			this.markers[0].callout.content=this.shopInfo.branch_shop_name+"\r\n"+this.shopInfo.address
		},
		computed:{
			...mapState({
				shopInfo:state=>state.business.shopInfo
			})
		}
	}
</script>

<style scoped>
	.page{
		width: 100%;
		height: 100vh;
	}
	.map{
		width: 100%;
		height:100%
	}
</style>
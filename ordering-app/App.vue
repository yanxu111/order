<script>
	export default {
		onLaunch: function() {
			// console.log('App Launch')
			uni.getSystemInfo({
				success: (res) => {
					// console.log(res)
					//同步赋值vuex
					this.$store.commit("system/SET_ISIPX",{isIpx:true})
				}
			})
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style>
    button,input,button:after{border:0 none;outline: none;border-radius: 0;}
    .status_bar {
        height: var(--status-bar-height);
        width: 100%;
    }
		.no-data{
			width: 100%;
			text-align: center;
			font-size: 32rpx;
			position: absolute;
			left: 50%;
			top: 30%;
			z-index: 3;
			/* //平移 */
			transform: translate(-50%,-80%);  
		}
</style>

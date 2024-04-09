<template>
    <view class="page">
        <view class="order-main">
            <view class="pay-success">支付成功！</view>
            <button class="view-order">查看订单</button>
            <view class="msg">关注<text decode="true" class="official">&quot;好运买点餐公众号&quot;</text>获取商家通知和最新优惠信息。</view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "pay-success",
    }
</script>

<style scoped>
    .page{width:100%;min-height:100vh;background-color:#FFFFFF;overflow:hidden;}
    .order-main{width:100%;}
    .order-main .pay-success{width:auto;font-size:32rpx;color:#000000;text-align: center;margin-top:20rpx;font-weight: bold;}
    .order-main .view-order{width:200rpx;height:auto;font-size:28rpx;color:#FFFFFF;border-radius: 5px;background-color:#007aff;margin-top:20rpx;}
    .order-main .msg{font-size:28rpx;margin-top:20rpx;margin-left:20rpx;text-align: center;}
    .order-main .msg .official{color:#E30019;}
</style>

(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/main/main"],{"19cc":function(t,e,n){"use strict";n.r(e);var o=n("4a05"),a=n.n(o);for(var i in o)"default"!==i&&function(t){n.d(e,t,(function(){return o[t]}))}(i);e["default"]=a.a},2694:function(t,e,n){"use strict";(function(t){n("b225");o(n("66fd"));var e=o(n("6329"));function o(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=n,t(e.default)}).call(this,n("543d")["createPage"])},"3cea":function(t,e,n){"use strict";n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return i})),n.d(e,"a",(function(){return o}));var o={search:function(){return n.e("components/search/search").then(n.bind(null,"3f0d"))}},a=function(){var t=this,e=t.$createElement;t._self._c;t._isMounted||(t.e0=function(e){t.isShow=!0},t.e1=function(e){t.isShow=!1})},i=[]},"4a05":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=n("26cb");a(n("4562"));function a(t){return t&&t.__esModule?t:{default:t}}function i(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function c(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?i(Object(n),!0).forEach((function(e){u(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function u(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var s={data:function(){return{isShow:!1}},onLoad:function(){this.lng=0,this.lat=0,this.pageNum=1,this.maxPage=0},onShow:function(){var e=this;t.getSetting({success:function(n){n.authSetting["scope.address"]?(t.getLocation({type:"gcj02",success:function(t){this.lng=t.longitude,this.lat=t.latitude},fail:function(t){console.log(t)}}),e.getShop({page:1,lng:e.lng,lat:e.lat,complete:function(t){e.pageNum=t.page,e.maxPage=t.pagenum}})):t.showModal({title:"系统提示",content:"当前设备未开启地理位置权限，是否开通？",success:function(n){n.confirm&&t.openSetting({success:function(n){t.getLocation({type:"gcj02",success:function(t){this.lng=t.longitude,this.lat=t.latitude},fail:function(t){console.log(t)}}),e.getShop({page:1,lng:e.lng,lat:e.lat,complete:function(t){e.pageNum=t.page,e.maxPage=t.pagenum}})}})}})}})},methods:c(c({},(0,o.mapActions)({getShop:"business/getShop",getShopPage:"business/getShopPage"})),{},{goPage:function(e){t.redirectTo({url:e})}}),onShareAppMessage:function(){return{title:"点餐小程序",path:"/pages/main/main",imageUrl:"../../static/images/main/hanbao.jpg"}},onPullDownRefresh:function(){this.pageNum=1,this.getShop({page:this.pageNum,lng:this.lng,lat:this.lat,success:function(){t.stopPullDownRefresh()}})},onReachBottom:function(){this.pageNum<this.maxPage&&(this.pageNum++,this.getShopPage({page:this.pageNum,lng:this.lng,lat:this.lat}))},computed:c({},(0,o.mapState)({isIpx:function(t){return t.system.isIpx},shops:function(t){return t.business.shops}}))};e.default=s}).call(this,n("543d")["default"])},6329:function(t,e,n){"use strict";n.r(e);var o=n("3cea"),a=n("19cc");for(var i in a)"default"!==i&&function(t){n.d(e,t,(function(){return a[t]}))}(i);n("f0a1");var c,u=n("f0c5"),s=Object(u["a"])(a["default"],o["b"],o["c"],!1,null,"345e6502",null,!1,o["a"],c);e["default"]=s.exports},"6ebd":function(t,e,n){},f0a1:function(t,e,n){"use strict";var o=n("6ebd"),a=n.n(o);a.a}},[["2694","common/runtime","common/vendor"]]]);
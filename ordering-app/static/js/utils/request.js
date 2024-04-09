//二次封装uniapprequest请求方便使用
function request(url,method="get",data={}){
	return new Promise(((resolve,reject)=>{
		uni.request({
			url:url,
			method:method.toLocaleUpperCase(),  //转换为大写达到不区分大小写的效果
			data:data,
			header:{
				"content-type":"application/x-www-form-urlencoded"
			},
			success:(res)=>{
				resolve(res.data)
			},
			fail: (ex) => {
				reject(ex)
			}
		});
	}))
	
}
export{
	request
}
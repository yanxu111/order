import parseHTML from '../static/js/utils/html-parser.js'
//创建好全局过滤器后要去全局main.js里面引用
export function contentFillter(val){
 	if(val){
		 return parseHTML(val)
	}
}
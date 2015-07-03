/*global phantom,require*/
(function(page){
	'use strict';
	var system = require('system')
		,args = system.args
		,sSrcUri = args[1]
	;

	page.viewportSize = { width: 800, height: 600 };
	page.onLoadFinished = handleLoadFinished;
	page.onError = handleError;
	page.open(sSrcUri);

	function handleLoadFinished(){
		var output = page.evaluate(function () {
			var body = document.body
				,forEach = Array.prototype.forEach
				,optionTables = body.querySelectorAll('table.params table.params')
				,resultObject = {}
			;
			try {
				forEach.call(optionTables,function(table){
					var tableTrs = table.querySelectorAll('tbody tr')
						,parentDD = querySelectorParents(table,'dd')
						,id = parentDD&&parentDD.getAttribute('id').split('-').shift().replace('.','')||'a'
						,resultArray = [];
					forEach.call(tableTrs,function(tr){
						var aTr = [];
						for (var j=0,m=tr.children.length;j<m;j++) {
							var mTd = tr.children[j]
								,sContent = j===4?mTd.innerHTML:mTd.textContent;
							aTr.push(
								sContent
									.replace(/[\s\n]+/g,' ')
									.replace(/^\s|\s$/g,'')
							);
						}
						resultArray.push(aTr);
					});
					resultObject[id] = resultArray;
				});
			} catch (err) {
				resultObject.error = err;
			}
			function querySelectorParents(elm,selector){
				var result;
				while ((elm=elm.parentNode)&&elm!==null) {
					if (selectorMatches(elm,selector)) {
						result = elm;
						break;
					}
				}
				return result;
			}
			function selectorMatches(el,selector) {
				var p = Element.prototype
					,f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function (s) {
						return [].indexOf.call(document.querySelectorAll(s),this)!== -1;
					};
				return f.call(el,selector);
			}
			return JSON.stringify(resultObject);//.replace(/[\s\n]+/,' ');
		});
		console.log(output);
		phantom.exit(output);
	}

	function handleError(){
		//var error = JSON.stringify(arguments);
		//console.log(error);
		//phantom.exit(error);
	}
})(require('webpage').create());


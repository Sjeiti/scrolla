/*global jsdoc*/
iddqd.ns('jsdoc.tutorial.detailPage',(function($,u){
	'use strict';

	var loadScript = iddqd.pattern.callbackToPromise(iddqd.loadScript)
		,loop = iddqd.loop
	;

	function init(){
		return Promise.all((function(a){
			loop([
				'scripts/sk123ow.min.js'
			],function(uri){
				a.push(loadScript(uri));
			});
			return a;
		})([]))
			.then(initWidget);
	}

	function initWidget(){
		sk123ow(
			document.getElementById('example')
			,{
				host: jsdoc.elasticServer
				,key:jsdoc.widgetKey
				,resultClick: showDetailPage
			}
		);
	}

	function showDetailPage(data){
		var oSend = {
				title: data.programDescriptions.programName
				,description: data.programDescriptions.programDescription
			}
			,sSend = JSON.stringify(oSend);
		location.href = 'detailPage.html?data='+encodeURIComponent(sSend);
	}

	return init;
})(jQuery));
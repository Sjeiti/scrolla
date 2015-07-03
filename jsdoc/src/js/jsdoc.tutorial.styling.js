/*global jsdoc*/
iddqd.ns('jsdoc.tutorial.styling',(function($,u){
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
		sk123ow(document.getElementById('example'),{
			host: jsdoc.elasticServer
			,key:jsdoc.widgetKey
			,numResults: 5
			,CDNCSS:{theme:'//maxcdn.bootstrapcdn.com/bootswatch/3.3.0/yeti/bootstrap.min.css'}
		});
	}

	return init;
})(jQuery));
/*global jsdoc*/
iddqd.ns('jsdoc.tutorial.callback',(function($,u){
	'use strict';

	var loadScript = iddqd.pattern.callbackToPromise(iddqd.loadScript)
		,loop = iddqd.loop
		,mModal
		,mModalTitle
		,mModalContent
		,$Modal
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
		mModal = document.getElementById('myModal');
		mModalTitle = mModal.querySelector('.modal-title');
		mModalContent = mModal.querySelector('.modal-body');
		$Modal = $('#myModal');
		sk123ow(
			document.getElementById('example')
			,{
				host: jsdoc.elasticServer
				,key:jsdoc.widgetKey
				,resultClick: showModal
				,detailsTarget: mModalContent
				//,details: []
			}
		);
	}

	function showModal(data){
		console.log('showModal',data); // log
		$Modal.modal();
		mModalTitle.textContent = data.programDescriptions.programName.nl;
//		mModalTitle.textContent = data.programDescriptions.programName[0].Value;
		mModalContent.innerHTML = '';
		//mModalContent.textContent = data.programDescriptions.programDescription[0].Value;
	}

	return init;
})(jQuery));
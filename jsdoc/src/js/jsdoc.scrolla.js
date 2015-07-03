/*global zen, scrolla */
iddqd.ns('jsdoc.scrolla',(function(){
	'use strict';

	var callbackToPromise = iddqd.pattern.callbackToPromise
		,loadScript = callbackToPromise(iddqd.loadScript)
		,formatSize = iddqd.internal.native.number.formatSize
		,createElement = iddqd.createElement
		//,xhttp = callbackToPromise(iddqd.network.xhttp)
		,xhttp = iddqd.network.xhttp
		,forEach = Array.prototype.forEach
		,version;

	function init(){
		var sPage = location.href.split('#').shift().split('/').pop();
		//initAnalytics();
		if (sPage==='index.html'||sPage==='') {
			initFirstParagraph();
			initScripts()
			.then(initExamples)
			.then(initVersion)
			.then(initTitle);
		}
	}

	function initScripts(){
		return loadScript('dist/scrolla.js');
	}

	function initVersion(){
		var deferred = Promise.defer();
		xhttp('dist/scrolla.js',function(e){
			version = e.response.match(/@version\s*(.*)/).pop();
			deferred.resolve();
		});
		return deferred.promise;
	}

	function initTitle(){
		var aVersion = version.split('.')
			,mSmall = createElement('small',null,document.querySelector('.navbar-brand'),null,aVersion.slice(0,2).join('.'));
		createElement('span',null,mSmall,null,'.'+aVersion.pop());
	}

	function initFirstParagraph(){
		// put shit in wide green div
		var sPath = location.pathname;
		if (sPath.indexOf('.html')===-1||sPath.indexOf('index.html')!==-1) {
			var mContainer = document.querySelector('body>.container')
				,mArticle = document.querySelector('#main article')
				,mFirstP = createElement('div','firstparagraph')
				,mFirstC = createElement('div','container',mFirstP)
				,mFirst8 = createElement('div','col-sm-9',mFirstC)
				,mFirst4 = createElement('div','col-sm-3 download',mFirstC);
			while (mArticle.firstChild.nodeName!=='H2') {
				mFirst8.appendChild(mArticle.firstChild);
			}
			mContainer.parentNode.insertBefore(mFirstP,mContainer);
			//
			// source
			createElement('h3','nav-label',mFirst4,{},'source');
			//
			createElement('a','btn btn-sm btn-download',mFirst4,{href:'https://github.com/Sjeiti/scrolla'},'https://github.com/Sjeiti/scrolla');
			createElement('input','btn btn-sm btn-source',mFirst4,{value:'https://github.com/Sjeiti/scrolla.git',style:'text-align:right;text-indent:-10rem;'});
			createElement('input','btn btn-sm btn-source',mFirst4,{value:'bower install scrolla --save'});
			//
			// use
			//createElement('input','unveal',mFirst4,{type:'radio',name:'wrap',id:'wrap-cdn',checked:'checked'});
			//createElement('label','btn btn-sm',mFirst4,{for:'wrap-cdn'},'cdn');
			createElement('input','unveal',mFirst4,{type:'radio',name:'wrap',id:'wrap-download',checked:'checked'});
			createElement('label','btn btn-sm',mFirst4,{for:'wrap-download'},'download');
			//
			// download
			var mWrapDownload = createElement('div','wrap wrap-download',mFirst4);
			[
				'dist/scrolla.js'
				,'dist/scrolla.min.js'
				,'dist/scrolla.jgz'
			].forEach(function(uri){
				var sFile = uri.split('/').pop()
					,mA = createElement('a','btn btn-sm btn-download filesize',mWrapDownload,{download:sFile,href:uri},sFile	);
				xhttp(uri,function(e){
					mA.setAttribute('data-filesize',formatSize(e.response.length));
				});
			});
			//
			// CDN
			/*xhttp('http://api.cdnjs.com/libraries?search=scrolla',function(e){
				var response = JSON.parse(e.response)
					,latest = response.results.pop().latest
					,latestVersion = latest.match(/\d*\.\d*\.\d*!/g).pop()
					,mWrapCDN = createElement('div','wrap wrap-cdn',mFirst4);
				createElement('a','btn btn-sm btn-cdn',mWrapCDN,{href:'http://cdnjs.com/libraries/scrolla'},'http://cdnjs.com/libraries/scrolla');
				[
					'https://cdnjs.cloudflare.com/ajax/libs/scrolla/'+latestVersion+'/scrolla.js'
					,'https://cdnjs.cloudflare.com/ajax/libs/scrolla/'+latestVersion+'/scrolla.min.js'
				].forEach(function(uri){
					createElement('input','btn btn-sm btn-cdn',mWrapCDN,{value:uri} );
				});
				//
				// focus input
				Array.prototype.forEach.call(mFirst4.querySelectorAll('input'),function(elm){
					elm.addEventListener('focus',handleInputFocus);
				});
			});*/
		}
	}

	function initExamples(){
		var examplesHeader = document.getElementById('examples')
			,pres = querySelectorAllAfter(examplesHeader,'pre');
		pres.forEach(function(pre){
			if (pre.nodeName.toLowerCase()==='pre'){
				var classList = pre.classList
					,contains = classList.contains.bind(classList)
					,code = pre.querySelector('code')
					,codeContent = code.textContent;
				console.log('pre',pre); // log
				if (contains('lang-javascript')) {
					// jshint evil:true
					eval(codeContent);
					// jshint evil:false
					// todo: add button disenable
				} else if (contains('lang-css')) {
					var style = document.createElement('style');
					style.textContent = codeContent;
					pre.parentNode.insertBefore(style,pre);
				}
				if (contains('source')) {
					scrolla(pre);
					//scrolla(code);
					/*var wrap = document.createElement('div');
					pre.parentNode.insertBefore(wrap,pre);
					wrap.appendChild(pre);
					scrolla(wrap,{class:'scrolla-source'});*/
				}
			}
		});
	}

	function querySelectorAllAfter(elm,nodeName){
		var result = [];
		while((elm=elm.nextSibling)&&elm) {
			elm.nodeName.toLowerCase()===nodeName&&result.push(elm);
		}
		return result;
	}

	return init;
})());
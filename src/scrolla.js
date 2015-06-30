/**
 * Scrolla is a pure-js, cross-everything scrollbar script.
 * @version 1.0.0
 * @license MIT
 * @author Ron Valstar <ron@ronvalstar.nl>
 * @copyright Ron Valstar <ron@ronvalstar.nl>
 * @namespace scrolla
 */
/**
 * The scrolla instance
 * @typedef {Object} scrollaInstance
 * @property {Function} step
 */
window.scrolla = (function(window,document){
	'use strict';

	var /*baseHash = btoa(Date.now()%1E6)
		,*/classnameBase = 'scrolla'
		,classnameWrapper = 'wrapper'
		,classnameViewport = 'viewport'
		//,forEach = Array.prototype.forEach
		,createElement = document.createElement.bind(document)
		,createDiv = createElement.bind(document,'div')
		,body = document.body
		,head = document.head
		,lastEvent = null
		//
		,baseStyleSheet
		,viewportRule
		,contentRule
		//
		,isInitialised = false
	;
	function init(){
		initCSS();
		initBrowserScrollbarSize();
		isInitialised = true;
	}
	function initCSS(){
		insertRule('.'+classnameBase+' .gutter { position: absolute; background-color: rgba(0,0,0,.2); z-index: 1; }');
		insertRule('.'+classnameBase+' .bar { position: absolute; background-color: gray; }');
		insertRule('.'+classnameBase+' .horizontal .bar { height: 100%; min-width: 1px; }');
		insertRule('.'+classnameBase+' .vertical .bar { width: 100%; min-height: 1px; }');
		//
		insertRule('.'+classnameBase+' { position: relative; }');
		insertRule('.'+classnameBase+' .'+classnameWrapper+' { position: relative; width: 100%; height: 100%; overflow: hidden; }');
		viewportRule = insertRule('.'+classnameBase+' .'+classnameViewport+' { position: absolute; top: 0; left: 0; width: 100%; height: 100%; padding-right: 17px; padding-bottom: 17px; overflow: scroll; }');
		contentRule = insertRule('.'+classnameBase+' .'+classnameViewport+' *:last-child { margin-bottom: -17px; }');
	}
	function initBrowserScrollbarSize(){
		var size = getBrowserScrollbarSize();
		viewportRule.style.paddingRight = viewportRule.style.paddingBottom = size+'px';
		contentRule.style.marginBottom = -size+'px';
	}
	function instantiate(element,options){
		!isInitialised&&init();
		var ////////////////////////////////
			hash = btoa(Date.now()%1E6)
			,gutterHor = createDiv()
			,barHor = createDiv()
			,gutterVer = createDiv()
			,barVer = createDiv()
			,left = createDiv()
			,right = createDiv()
			,top = createDiv()
			,bottom = createDiv()
			// the private scroll instance
			,inst = {
				hash: hash
				//
				,base: element
				,wrapper: createDiv()
				//
				,viewport: createDiv()
				,viewportW: element.offsetWidth
				,viewportH: element.offsetHeight
				,viewportScrollW: element.scrollWidth
				,viewportScrollH: element.scrollHeight
				//
				,gutterSize: options.gutterSize||10
				// horizontal gutter
				,gutterHor: gutterHor
				,gutterHorClassList: gutterHor.classList
				,gutterHorStyle: gutterHor.style
				,barHor: barHor
				,barHorStyle: barHor.style
				,barHorSize: null
				,barHorPos: 0
				// vertical gutter
				,gutterVer: gutterVer
				,gutterVerClassList: gutterVer.classList
				,gutterVerStyle: gutterVer.style
				,barVer: barVer
				,barVerStyle: barVer.style
				,barVerSize: null
				,barVerPos: 0
				//
				,handleBarDrag: null
				,handleBarMouseup: null
				//
				,left: left
				,right: right
				,top: top
				,bottom: bottom
				//
			}
			,instancePublic = {
				step: stepViewport.bind(stepViewport,inst)
			}
		;
		//
		// set other instance variables
		inst.barHorSize = getBarSize(inst,true);
		inst.barVerSize = getBarSize(inst,false);
		// initalise
		initWrapper(inst,element);
		initHorVer(inst);
		initGutterAndBar(inst);
		initViewport(inst);
		inst.base.scroller = instancePublic;
		return instancePublic;
	}
	function initWrapper(inst,element){
		inst.base.classList.add(classnameBase);
		inst.wrapper.classList.add(classnameWrapper);
		inst.viewport.classList.add(classnameViewport);
		while (element.childNodes.length) {
			inst.viewport.appendChild(element.childNodes[0]);
		}
		inst.base.appendChild(inst.wrapper);
		inst.wrapper.appendChild(inst.viewport);
	}
	function initHorVer(inst){
		[true,false].forEach(function(horizontal){
			inst[horizontal?'hor':'ver'] = {
				get viewportSize(){ return horizontal?inst.viewportW:inst.viewportH; }
				,set viewportSize(v){ if (horizontal) inst.viewportW = v; else inst.viewportH = v; }
				,get viewportScrollSize(){ return horizontal?inst.viewportScrollW:inst.viewportScrollH; }
				,set viewportScrollSize(v){ if (horizontal) inst.viewportScrollW = v; else inst.viewportScrollH = v; }
				,gutter: horizontal?inst.gutterHor:inst.gutterVer
				,gutterClassList: horizontal?inst.gutterHorClassList:inst.gutterVerClassList
				,gutterStyle: horizontal?inst.gutterHorStyle:inst.gutterVerStyle
				,bar: horizontal?inst.barHor:inst.barVer
				,barStyle: horizontal?inst.barHorStyle:inst.barVerStyle
				,get barSize(){ return horizontal?inst.barHorSize:inst.barVerSize; }
				,set barSize(v){ if (horizontal) inst.barHorSize = v; else inst.barVerSize = v; }
				,get barPos(){ return horizontal?inst.barHorPos:inst.barVerPos; }
				,set barPos(v){ if (horizontal) inst.barHorPos = v; else inst.barVerPos = v; }
				,backward: horizontal?inst.left:inst.top
				,forward: horizontal?inst.right:inst.bottom
			};
		});
	}
	function initGutterAndBar(inst){
		[inst.hor,inst.ver].forEach(function(o){
			var isHorizontal = o.gutter===inst.gutterHor
				,sizePrll = isHorizontal?'width':'height'
				,sizePrpd = isHorizontal?'height':'width'
			;
			o.gutterClassList.add('gutter');
			o.gutterClassList.add(isHorizontal?'horizontal':'vertical');
			o.gutterStyle[sizePrll] = o.viewportSize+'px';
			o.gutterStyle[sizePrpd] = inst.gutterSize+'px';
			o.bar.classList.add('bar');
			o.gutter.addEventListener('click',handleGutterClick.bind(o.gutter,inst,isHorizontal));
			//
			o.barStyle[sizePrll] = o.barSize + 'px';
			o.bar.addEventListener('mousedown',handleBarMousedown.bind(o.bar,inst,isHorizontal));
			o.bar.addEventListener('touchstart',handleBarMousedown.bind(o.bar,inst,isHorizontal));
			o.bar.addEventListener('click',handleStopPropagation);
			o.gutter.appendChild(o.bar);
			inst.base.insertBefore(o.gutter,inst.wrapper);
			//
			[o.backward,o.forward].forEach(function(button,i){
				button.classList.add('button');
				button.classList.add(isHorizontal?'hor':'ver');
				button.classList.add(i===0?'bw':'fw');
				inst.base.insertBefore(button,inst.wrapper);
				button.addEventListener('click',handleButtonClick.bind(button,inst,isHorizontal,button===o.forward));
			});
		});
	}
	function initViewport(inst){
		inst.viewport.addEventListener('scroll',handleScroll.bind(inst.viewport,inst));
	}
	function handleScroll(inst) {
		setBarPos(inst,true);
		setBarPos(inst,false);
	}
	function handleGutterClick(inst,horizontal,e){
		var dir = horizontal?inst.hor:inst.ver
			,pos = horizontal?e.offsetX:e.offsetY
		;
		stepViewport(inst,horizontal,pos>dir.barPos?1:-1);
	}
	function handleBarMousedown(inst,horizontal,e){
		inst.handleBarDrag = handleBarDrag.bind(window,inst,horizontal,e);
		inst.handleBarMouseup = handleBarMouseup.bind(window,inst);
		window.addEventListener('mousemove',inst.handleBarDrag);
		window.addEventListener('touchmove',inst.handleBarDrag);
		window.addEventListener('mouseup',inst.handleBarMouseup);
		window.addEventListener('touchend',inst.handleBarMouseup);
		e.preventDefault();
	}
	function handleBarDrag(inst,horizontal,eDown,e){
		var lastE = lastEvent||eDown
			,isTouch = e.type==='touchmove'
				,client = isTouch?e.touches[0]:e
				,lastClient = isTouch?lastE.touches[0]:lastE
			,offset = horizontal?client.clientX - lastClient.clientX:client.clientY - lastClient.clientY
			,dir = horizontal?inst.hor:inst.ver
		;
		//
		dir.barPos = Math.min(Math.max(dir.barPos + offset,0),dir.viewportSize-dir.barSize);
		dir.barStyle[horizontal?'left':'top'] = dir.barPos+'px';
		//
		inst.viewport[horizontal?'scrollLeft':'scrollTop'] = (dir.barPos/dir.viewportSize)*dir.viewportScrollSize;
		//
		e.preventDefault();
		lastEvent = e;
	}
	function handleBarMouseup(inst){
		window.removeEventListener('mousemove',inst.handleBarDrag);
		window.removeEventListener('touchmove',inst.handleBarDrag);
		window.removeEventListener('mouseup',inst.handleBarMouseup);
		window.removeEventListener('touchend',inst.handleBarMouseup);
		lastEvent = null;
	}
	function handleButtonClick(inst,horizontal,forward){
		stepViewport(inst,horizontal,forward);
	}
	function handleStopPropagation(e){
		e.stopPropagation();
	}
	function getBarSize(inst,horizontal){
		return horizontal?inst.viewportW/inst.viewportScrollW*inst.viewportW:inst.viewportH/inst.viewportScrollH*inst.viewportH;
	}
	function setBarPos(inst,horizontal){
		//var dir = horizontal?inst.hor:inst.ver;
		if (horizontal) {
			inst.barHorPos = (inst.viewport.scrollLeft/inst.viewport.scrollWidth)*inst.viewportW;
			inst.barHorStyle.left = inst.barHorPos + 'px';
		} else {
			inst.barVerPos = (inst.viewport.scrollTop/inst.viewport.scrollHeight)*inst.viewportH;
			inst.barVerStyle.top = inst.barVerPos + 'px';
		}
	}
	function stepViewport(inst,horizontal,forward){
		var dir = horizontal?inst.hor:inst.ver;
		inst.viewport[horizontal?'scrollLeft':'scrollTop'] += (forward?1:-1)*dir.viewportSize;
		setBarPos(inst,horizontal);
	}
	function getBrowserScrollbarSize(){
		var outer = createDiv()
			,inner = createDiv()
			,widthNoScroll
			,widthWithScroll
		;
		outer.style.visibility = 'hidden';
		outer.style.width = '100px';
		outer.style.msOverflowStyle = 'scrollbar';
		body.appendChild(outer);
		widthNoScroll = outer.offsetWidth;
		//
		outer.style.overflow = 'scroll';
		inner.style.width = '100%';
		outer.appendChild(inner);
		widthWithScroll = inner.offsetWidth;
		//
		body.removeChild(outer);
		//
		return widthNoScroll - widthWithScroll;
	}
	function getStyleSheet(){
		if (!baseStyleSheet) {
			var elm = createElement('style');
			elm.appendChild(document.createTextNode(''));
			head.insertBefore(elm,head.firstChild);
			baseStyleSheet = elm.sheet;
		}
		return baseStyleSheet;
	}
	function insertRule(css){
		var sheet = getStyleSheet();
		sheet.insertRule(css,0);
		return sheet.cssRules[0];
	}
	/*function extend(target,source){
		for (var s in source) target[s] = source[s];
	}*/
	return instantiate;
})(window,document);
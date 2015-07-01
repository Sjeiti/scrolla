/**
 * Scrolla is a pure-js, cross-everything scrollbar script.
 * @version 0.0.3
 * @license MIT/GPL
 * @author Ron Valstar <ron@ronvalstar.nl>
 * @copyright Ron Valstar <ron@ronvalstar.nl>
 * @namespace scrolla
 */
/**
 * The scrolla instance
 * @typedef {Object} scrollaInstance
 * @property {Function} step
 * @property {Function} resize
 */
/**
 * The private scrolla instance
 * @typedef {Object} scrollaPrivateInstance
 * @property {HTMLElement} base
 * @property {HTMLElement} wrapper
 * @property {HTMLElement} viewport
 * @property {Number} viewportW
 * @property {Number} viewportH
 * @property {Number} viewportScrollW
 * @property {Number} viewportScrollH
 * @property {Number} gutterSize
 * @property {HTMLElement} gutterHor
 * @property {DOMTokenList} gutterHorClassList
 * @property {CSSStyleDeclaration} gutterHorStyle
 * @property {HTMLElement} barHor
 * @property {CSSStyleDeclaration} barHorStyle
 * @property {Number} barHorSize
 * @property {Number} barHorPos
 * @property {HTMLElement} gutterVer
 * @property {DOMTokenList} gutterVerClassList
 * @property {CSSStyleDeclaration} gutterVerStyle
 * @property {HTMLElement} barVer
 * @property {CSSStyleDeclaration} barVerStyle
 * @property {Number} barVerSize
 * @property {Number} barVerPos
 * @property {Function} handleBarDrag
 * @property {Function} handleBarMouseup
 * @property {Function} resize
 * @property {HTMLElement} left
 * @property {HTMLElement} right
 * @property {HTMLElement} top
 * @property {HTMLElement} bottom
 * @property {Function} animatedStepCallback
 */
window.scrolla = (function(window,document){
	'use strict';

	var /*baseHash = btoa(Date.now()%1E6)
		,*/classnameBase = 'scrolla'
		,classnameWrapper = 'wrapper'
		,classnameViewport = 'viewport'
		,classnameGutter = 'gutter'
		,classnameBar = 'bar'
		,classnameButton = 'button'
		,classnameHorizontal = 'horizontal'
		,classnameVertical = 'vertical'
		,classnameForward = 'forward'
		,classnameBackward = 'backward'
		,stringPx = 'px'
		,eventClick = 'click'
		,eventMousedown = 'mousedown'
		,eventMousemove = 'mousemove'
		,eventMouseup = 'mouseup'
		,eventTouchstart = 'touchstart'
		,eventTouchmove = 'touchmove'
		,eventTouchend = 'touchend'
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
		//
		,defaultOptions = {

		}
		//
		,instances = []
	;

	/**
	 * Initialise scrolla: create CSS rules, calculate scrollbar size and add resize events.
	 * Initialisation can be called manually or automatically on the first scrolla instantiation.
	 * ClassNames of the CSS rules can be changed through the options object.
	 * @param {Object} [options]
	 * @param {String} [options.classnameWrapper='wrapper']
	 * @param {String} [options.classnameViewport='viewport']
	 * @param {String} [options.classnameGutter='gutter']
	 * @param {String} [options.classnameBar='bar']
	 * @param {String} [options.classnameHorizontal='horizontal']
	 * @param {String} [options.classnameVertical='vertical']
	 */
	function init(options){
		initCSS(options);
		initBrowserScrollbarSize();
		initEvents();
		isInitialised = true;
	}

	/**
	 * Create CSS rules.
	 * @param {Object} [options]
	 */
	function initCSS(options){
		if (options) {
			options.classnameWrapper&&(classnameWrapper=options.classnameWrapper);
			options.classnameViewport&&(classnameViewport=options.classnameViewport);
			options.classnameGutter&&(classnameGutter=options.classnameGutter);
			options.classnameBar&&(classnameBar=options.classnameBar);
			options.classnameHorizontal&&(classnameHorizontal=options.classnameHorizontal);
			options.classnameVertical&&(classnameVertical=options.classnameVertical);
		}
		insertRule('.'+classnameBase+' .'+classnameGutter+' { position: absolute; background-color: rgba(0,0,0,.2); z-index: 1; }');
		insertRule('.'+classnameBase+' .'+classnameBar+' { position: absolute; background-color: gray; }');
		insertRule('.'+classnameBase+' .'+classnameHorizontal+' .'+classnameBar+' { height: 100%; min-width: 1px; }');
		insertRule('.'+classnameBase+' .'+classnameVertical+' .'+classnameBar+' { width: 100%; min-height: 1px; }');
		//
		insertRule('.'+classnameBase+' { position: relative; overflow: visible!important; }');
		insertRule('.'+classnameBase+' .'+classnameWrapper+' { position: relative; width: 100%; height: 100%; overflow: hidden; }');
		viewportRule = insertRule('.'+classnameBase+' .'+classnameViewport+' { position: absolute; top: 0; left: 0; width: 100%; height: 100%; padding-right: 17px; padding-bottom: 17px; overflow: scroll; }');
		contentRule = insertRule('.'+classnameBase+' .'+classnameViewport+' *:last-child { margin-bottom: -17px; }');
	}

	/**
	 * Calculate browser scrollbar size and apply to CSS rules.
	 */
	function initBrowserScrollbarSize(){
		var size = getBrowserScrollbarSize();
		viewportRule.style.paddingRight = viewportRule.style.paddingBottom = size+stringPx;
		contentRule.style.marginBottom = -size+stringPx;
	}

	/**
	 * Initialise events.
	 */
	function initEvents(){
		window.addEventListener('resize',handleWindowResize);
	}

	/**
	 * Handle window resize for each scrolla instance.
	 */
	function handleWindowResize(){
		instances.forEach(function(instance){
			instance.resize();
		});
	}

	/**
	 * Instantiate scrolla
	 * @param {HTMLElement} element
	 * @param {Object} [options]
	 * @returns scrollaInstance
	 */
	function instantiate(element,options){
		extend(options,defaultOptions);
		!isInitialised&&init();
		var /*hash = btoa(Date.now()%1E6)
			,*/gutterHor = createDiv()
			,barHor = createDiv()
			,gutterVer = createDiv()
			,barVer = createDiv()
			,left = createDiv()
			,right = createDiv()
			,top = createDiv()
			,bottom = createDiv()
			// the private scroll instance
			,inst = {
				base: element
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
				,resize: null
				//
				,left: left
				,right: right
				,top: top
				,bottom: bottom
				//
				,animatedStepCallback: options.animatedStepCallback
			}
			,instancePublic = {
				step: stepViewport.bind(stepViewport,inst)
			}
		;
		// set other instance variables
		inst.resize = resize.bind(resize,inst);
		/*extend(inst,{
			resize: resize.bind(resize,inst)
		});*/
		//
		// initalise
		initWrapper(inst,element);
		initHorVer(inst);
		initGutterAndBar(inst);
		initViewport(inst);
		//
		instances.push(inst);
		//
		inst.resize();
		//
		inst.base.scrolla = instancePublic;
		return instancePublic;
	}

	/**
	 * Initialise the structure of the elements.
	 * @param {scrollaPrivateInstance} inst
	 * @param {HTMLElement} element
	 */
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

	/**
	 * Add the hor and ver properties to the scrolla instance.
	 * @param {scrollaPrivateInstance} inst
	 */
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

	/**
	 * Initialise instance controll elements.
	 * @param {scrollaPrivateInstance} inst
	 */
	function initGutterAndBar(inst){
		[inst.hor,inst.ver].forEach(function(o){
			var isHorizontal = o.gutter===inst.gutterHor
				,sizePrll = getParallel(isHorizontal)
				,sizePrpd = getPerpendicular(isHorizontal)
			;
			o.gutterClassList.add(classnameGutter);
			o.gutterClassList.add(isHorizontal?classnameHorizontal:classnameVertical);
			o.gutterStyle[sizePrll] = o.viewportSize+stringPx;
			o.gutterStyle[sizePrpd] = inst.gutterSize+stringPx;
			o.bar.classList.add(classnameBar);
			o.gutter.addEventListener(eventClick,handleGutterClick.bind(o.gutter,inst,isHorizontal));
			//
			o.barStyle[sizePrll] = o.barSize + stringPx;
			o.bar.addEventListener(eventMousedown,handleBarMousedown.bind(o.bar,inst,isHorizontal));
			o.bar.addEventListener(eventTouchstart,handleBarMousedown.bind(o.bar,inst,isHorizontal));
			o.bar.addEventListener(eventClick,handleStopPropagation);
			o.gutter.appendChild(o.bar);
			inst.base.insertBefore(o.gutter,inst.wrapper);
			//
			[o.backward,o.forward].forEach(function(button,i){
				button.classList.add(classnameButton);
				button.classList.add(isHorizontal?classnameHorizontal:classnameVertical);
				button.classList.add(i===0?classnameBackward:classnameForward);
				inst.base.insertBefore(button,inst.wrapper);
				button.addEventListener(eventClick,handleButtonClick.bind(button,inst,isHorizontal,button===o.forward));
			});
		});
	}

	/**
	 * Initialise the instance viewport element.
	 * @param {scrollaPrivateInstance} inst
	 */
	function initViewport(inst){
		inst.viewport.addEventListener('scroll',handleScroll.bind(inst.viewport,inst));
	}

	/**
	 * Handle the viewport scroll event.
	 * @param {scrollaPrivateInstance} inst
	 */
	function handleScroll(inst) {
		setBarPos(inst,true);
		setBarPos(inst,false);
	}

	/**
	 * Handle gutter click event.
	 * @param {scrollaPrivateInstance} inst
	 * @param {boolean} horizontal
	 * @param {MouseEvent} e
	 */
	function handleGutterClick(inst,horizontal,e){
		// todo: Firefox bug
		var dir = horizontal?inst.hor:inst.ver
			,pos = horizontal?e.offsetX:e.offsetY
		;
		stepViewport(inst,horizontal,pos>dir.barPos);
	}

	/**
	 * Handle bar mousedown event.
	 * @param {scrollaPrivateInstance} inst
	 * @param {boolean} horizontal
	 * @param {MouseEvent} e
	 */
	function handleBarMousedown(inst,horizontal,e){
		inst.handleBarDrag = handleBarDrag.bind(window,inst,horizontal,e);
		inst.handleBarMouseup = handleBarMouseup.bind(window,inst);
		window.addEventListener(eventMousemove,inst.handleBarDrag);
		window.addEventListener(eventTouchmove,inst.handleBarDrag);
		window.addEventListener(eventMouseup,inst.handleBarMouseup);
		window.addEventListener(eventTouchend,inst.handleBarMouseup);
		e.preventDefault();
	}

	/**
	 * Handle bar drag event.
	 * @param {scrollaPrivateInstance} inst
	 * @param {boolean} horizontal
	 * @param {MouseEvent} eDown
	 * @param {MouseEvent} e
	 */
	function handleBarDrag(inst,horizontal,eDown,e){
		var lastE = lastEvent||eDown
			,isTouch = e.type===eventTouchmove
				,client = isTouch?e.touches[0]:e
				,lastClient = isTouch?lastE.touches[0]:lastE
			,offset = horizontal?client.clientX - lastClient.clientX:client.clientY - lastClient.clientY
			,dir = horizontal?inst.hor:inst.ver
		;
		//
		dir.barPos = Math.min(Math.max(dir.barPos + offset,0),dir.viewportSize-dir.barSize);
		dir.barStyle[horizontal?'left':'top'] = dir.barPos+stringPx;
		//
		inst.viewport[getScroll(horizontal)] = (dir.barPos/dir.viewportSize)*dir.viewportScrollSize;
		//
		e.preventDefault();
		lastEvent = e;
	}

	/**
	 * Handle bar mouseup event.
	 * @param {scrollaPrivateInstance} inst
	 */
	function handleBarMouseup(inst) {
		window.removeEventListener(eventMousemove,inst.handleBarDrag);
		window.removeEventListener(eventTouchmove,inst.handleBarDrag);
		window.removeEventListener(eventMouseup,inst.handleBarMouseup);
		window.removeEventListener(eventTouchend,inst.handleBarMouseup);
		lastEvent = null;
	}

	/**
	 * Handle button click event.
	 * @param {scrollaPrivateInstance} inst
	 * @param {boolean} horizontal
	 * @param {boolean} forward
	 */
	function handleButtonClick(inst,horizontal,forward){
		stepViewport(inst,horizontal,forward);
	}

	/**
	 * Stop propagation
	 * @param {Event} e
	 */
	function handleStopPropagation(e){
		e.stopPropagation();
	}

	/**
	 * Resize the elements by recalculating the changed dimensions.
	 * @param {scrollaPrivateInstance} inst
	 */
	function resize(inst){
		inst.viewportW = inst.base.offsetWidth;
		inst.viewportH = inst.base.offsetHeight;
		inst.barHorSize = getBarSize(inst,true);
		inst.barVerSize = getBarSize(inst,false);
		setBarPos(inst,true);
		setBarPos(inst,false);
		[inst.hor,inst.ver].forEach(function(o){
			var isHorizontal = o.gutter===inst.gutterHor
				,sizePrll = getParallel(isHorizontal)
				,sizePrpd = getPerpendicular(isHorizontal)
			;
			o.gutterStyle[sizePrll] = o.viewportSize+stringPx;
			o.gutterStyle[sizePrpd] = inst.gutterSize+stringPx;
			o.barStyle[sizePrll] = o.barSize + stringPx;
		});
	}

	/**
	 * Calculate the size of the bar element by the size of the viewport in respect to the scrollable size of the viewport
	 * @param {scrollaPrivateInstance} inst
	 * @param {boolean} horizontal
	 */
	function getBarSize(inst,horizontal){
		return horizontal?inst.viewportW/inst.viewportScrollW*inst.viewportW:inst.viewportH/inst.viewportScrollH*inst.viewportH;
	}

	/**
	 * Sets the bar position to the viewport scroll position.
	 * @param {scrollaPrivateInstance} inst
	 * @param {boolean} horizontal
	 */
	function setBarPos(inst,horizontal){ // todo: refactor
		//var dir = horizontal?inst.hor:inst.ver;
		if (horizontal) {
			inst.barHorPos = inst.viewport.scrollWidth===0?0:(inst.viewport.scrollLeft/inst.viewport.scrollWidth)*inst.viewportW;
			inst.barHorStyle.left = inst.barHorPos + stringPx;
		} else {
			inst.barVerPos = inst.viewport.scrollTop===0?0:(inst.viewport.scrollTop/inst.viewport.scrollHeight)*inst.viewportH;
			inst.barVerStyle.top = inst.barVerPos + stringPx;
		}
	}

	/**
	 * Scroll the viewport by the viewport size.
	 * @param {scrollaPrivateInstance} inst
	 * @param {boolean} horizontal
	 * @param {boolean} forward
	 */
	function stepViewport(inst,horizontal,forward){
		var dir = horizontal?inst.hor:inst.ver
			,scrollDir = getScroll(horizontal)
			,scrollFrom = parseFloat(inst.viewport[scrollDir])
			,scrollTo = scrollFrom + (forward?1:-1)*dir.viewportSize
		;
		inst.viewport[scrollDir] = scrollTo;
		setBarPos(inst,horizontal);
		//
		inst.animatedStepCallback&&inst.animatedStepCallback({
			elm: inst.viewport
			,property: scrollDir
			,from: scrollFrom
			,to: scrollTo
			,updateBar: setBarPos.bind(null,inst,horizontal)
		});
	}

	/**
	 * Calculate the size of the real scrollbar.
	 * @returns {number}
	 */
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

	/**
	 * Get the scrolla stylesheet.
	 * @returns {CSSStyleSheet}
	 */
	function getStyleSheet(){
		if (!baseStyleSheet) {
			var elm = createElement('style');
			elm.appendChild(document.createTextNode(''));
			head.insertBefore(elm,head.firstChild);
			baseStyleSheet = elm.sheet;
		}
		return baseStyleSheet;
	}

	/**
	 * Add a css rule to the scrolla stylesheet.
	 * @param {string} css
	 * @returns {CSSRule}
	 */
	function insertRule(css){
		var sheet = getStyleSheet();
		sheet.insertRule(css,0);
		return sheet.cssRules[0];
	}

	/**
	 * Get the property name of the size parallel to an element.
	 * @param {boolean} horizontal
	 * @returns {string}
	 */
	function getParallel(horizontal){
		return horizontal?'width':'height';
	}

	/**
	 * Get the property name of the size perpendicular to an element.
	 * @param {boolean} horizontal
	 * @returns {string}
	 */
	function getPerpendicular(horizontal){
		return horizontal?'height':'width';
	}

	/**
	 * Get the property name of the scroll position of an element.
	 * @param {boolean} horizontal
	 * @returns {string}
	 */
	function getScroll(horizontal){
		return horizontal?'scrollLeft':'scrollTop';
	}

	/**
	 * Extend and object
	 * @param {Object} target
	 * @param {Object} source
	 */
	function extend(target,source){
		for (var s in source) target[s] = source[s];
	}

	// todo: add api
	instantiate.init = init;
	return instantiate;
})(window,document);
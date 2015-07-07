/**
 * Scrolla is a pure-js, cross-everything scrollbar script.
 * @version 0.0.12
 * @license MIT/GPL
 * @author Ron Valstar <ron@ronvalstar.nl>
 * @copyright Ron Valstar <ron@ronvalstar.nl>
 * @namespace scrolla
 */
window.scrolla = (function(window,document){
	'use strict';

	var /*baseHash = btoa(Date.now()%1E6)
		,forEach = Array.prototype.forEach
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
		,classnameInactive = 'inactive'
		,classnameDisabled = 'disabled'
		,classnameAllInline = 'all-inline'
		,stringPx = 'px'
		,eventClick = 'click'
		,eventMousedown = 'mousedown'
		,eventMousemove = 'mousemove'
		,eventMouseup = 'mouseup'
		,eventTouchstart = 'touchstart'
		,eventTouchmove = 'touchmove'
		,eventTouchend = 'touchend'
		,createElement = document.createElement.bind(document)
		,createDiv = createElement.bind(document,'div')
		,body = document.body
		,head = document.head
		//
		,baseStyleSheet
		//
		,scrollBarSize = getBrowserScrollbarSize()
		,stepSize = 0.95
		//
		,dimensionDefaultStyles = {
			width:'auto'
			,'min-width':'0px'
			,'max-width':'none'
			,height:'auto'
			,'min-height':'0px'
			,'max-height':'none'
			,position:'static'
			,left:'auto'
			,right:'auto'
			,top:'auto'
			,bottom:'auto'
			,'margin-left':'0px'
			,'margin-right':'0px'
			,'margin-top':'0px'
			,'margin-bottom':'0px'
		}
		,dimensionStyles = (function(a){
			for (var s in dimensionDefaultStyles) a.push(s);
			return a;
		})([])
		//
		,isInitialised = false
		//
		,defaultOptions = {
			// todo: set or loose
		}
		//
		,instancesNr = 0
		,instances = []
	;

	/**
	 * Initialise scrolla: create CSS rules, calculate scrollbar size and add resize events.
	 * Initialisation can be called manually or automatically on the first scrolla instantiation.
	 * ClassNames of the CSS rules can be changed through the options object.
	 * @memberof scrolla
	 * @public
	 * @param {Object} [options]
	 * @param {String} [options.stepSize=0.95] The amount of the step size, a number from 0 to 1 proportionate to the viewport size.
	 * @param {String} [options.classnameWrapper='wrapper'] ClassName for the wrapper.
	 * @param {String} [options.classnameViewport='viewport'] ClassName for the viewport.
	 * @param {String} [options.classnameGutter='gutter'] ClassName for the gutters.
	 * @param {String} [options.classnameBar='bar'] ClassName for the bars.
	 * @param {String} [options.classnameButton='button'] ClassName for the buttons.
	 * @param {String} [options.classnameHorizontal='horizontal'] ClassName for horizontal.
	 * @param {String} [options.classnameVertical='vertical'] ClassName for vertical.
	 * @param {String} [options.classnameForward='forward'] ClassName for forward.
	 * @param {String} [options.classnameBackward='backward'] ClassName for backward.
	 * @param {String} [options.classnameInactive='inactive'] ClassName for inactive ui elements.
	 * @param {String} [options.classnameDisabled='disabled'] ClassName for a disabled scrolla instance.
	 * @param {String} [options.classnameAllInline='all-inline'] ClassName for the viewport when all direct children are inline.
	 */
	function init(options){
		if (!isInitialised) {
			options.stepSize&&(stepSize = options.stepSize);
			initClassListToggleFix();
			initCSS(options);
			initEvents();
			isInitialised = true;
			return true;
		}
		return false;
	}

	/**
	 * Fix for classList.toggle second boolean argument.
	 * @memberof scrolla
	 * @private
	 */
	function initClassListToggleFix(){
		/*global DOMTokenList*/
		var testElement = document.createElement('_');
		testElement.classList.toggle(classnameBase, false);
		if (testElement.classList.contains(classnameBase)) {
			var _toggle = DOMTokenList.prototype.toggle;
			DOMTokenList.prototype.toggle = function(token, force) {
				/*jshint -W018 */
				if (1 in arguments && !this.contains(token) === !force) {
					return force;
				} else {
					return _toggle.call(this, token);
				}
				/*jshint +W018 */
			};
		}
		testElement = null;
	}

	/**
	 * Create CSS rules.
	 * @memberof scrolla
	 * @private
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
		// selectors
		var d = '.'
			,g = '>'
			,selectorBase = d+classnameBase
			,selectorWrapper = selectorBase+g+d+classnameWrapper
			,selectorViewport = selectorWrapper+g+d+classnameViewport
			,selectorAllInline = selectorWrapper+g+d+classnameAllInline
			//
			,selectorBaseDisabled = d+classnameBase+d+classnameDisabled
			,selectorWrapperDisabled = selectorBaseDisabled+g+d+classnameWrapper
			,selectorViewportDisabled = selectorWrapperDisabled+g+d+classnameViewport
			,selectorAllInlineDisabled = selectorWrapperDisabled+g+d+classnameAllInline
			//
			,selectorGutter = selectorBase+g+d+classnameGutter
			,selectorGutterH = selectorGutter+d+classnameHorizontal
			,selectorGutterV = selectorGutter+d+classnameVertical
			,selectorBar = selectorGutter+g+d+classnameBar
			,selectorBarH = selectorGutterH+g+d+classnameBar
			,selectorBarV = selectorGutterV+g+d+classnameBar
			,selectorButton = selectorBase+g+d+classnameButton
			,selectorInactive = selectorBase+g+d+classnameInactive
		;
		// gutter
		insertRule(selectorGutter+'{'
			+'position: absolute;'
			+'background-color: rgba(0,0,0,.2);'
			+'z-index: 1;}');
		insertRule(selectorGutterH+'{'
			+'width: 100%;}');
		insertRule(selectorGutterV+'{'
			+'height: 100%;}');
		// bar
		insertRule(selectorBar+'{'
			+'position: absolute;'
			+'background-color: gray;'
			+'cursor: pointer;}');
		insertRule(selectorBarH+'{'
			+'height: 100%;'
			+'min-width: 1px;}');
		insertRule(selectorBarV+'{'
			+'width: 100%;'
			+'min-height: 1px;}');
		// button
		insertRule(selectorButton+'{'
			+'cursor: pointer;}');
		// inactive
		insertRule(selectorInactive+'{'
			+'display: none;}');
		//
		//
		// base
		insertRule(selectorBase+'{'
			+'position: relative;'
			+'overflow: visible!important; }');
		// wrapper
		insertRule(selectorWrapper+'{'
			+'position: relative;'
			+'width: 100%;'
			+'height: 100%;'
			+'overflow: hidden; }');
		// viewport
		insertRule(selectorViewport+'{'
			+'box-sizing: content-box;'
			+'position: absolute;'
			+'top: 0;'
			+'left: 0;'
			+'width: 100%;'
			+'height: 100%;'
			+'margin: 0;'
			+'padding: 0 '+scrollBarSize+'px '+scrollBarSize+'px 0;'
			+'overflow: scroll; }');
		insertRule(selectorViewport+'::-webkit-scrollbar{'
			+'display:none; }');
		// viewport content
		insertRule(selectorViewport+' * {'
			+'box-sizing: border-box; }');
		insertRule(selectorViewport+'>*:last-child {'
			+'margin-bottom: -'+scrollBarSize+'px; }');
		insertRule(selectorAllInline+'>* {'
			+'margin-bottom: -'+scrollBarSize+'px; }');
		insertRule(selectorAllInline+'>*:last-child {'
			+'margin-right: -'+scrollBarSize+'px; }');
		//
		// disable
		insertRule(selectorBaseDisabled+'{'
			+'height: auto!important; }');
		// wrapper
		insertRule(selectorWrapperDisabled+'{'
			+'position: static;'
			+'width: auto;'
			+'height: auto;'
			+'overflow: auto; }');
		// viewport
		insertRule(selectorViewportDisabled+'{'
			+'position: static;'
			+'width: auto;'
			+'height: auto;'
			+'padding: 0;'
			+'overflow: auto; }');
		// ui
		insertRule(selectorBaseDisabled+g+d+classnameGutter+','
			+selectorBaseDisabled+g+d+classnameButton+' {'
			+'display: none; }');
		// viewport content
		insertRule(selectorViewportDisabled+'>*:last-child {'
			+'margin-bottom: 0px; }');
		insertRule(selectorAllInlineDisabled+'>* {'
			+'margin-bottom: 0px; }');
		insertRule(selectorAllInlineDisabled+'>*:last-child {'
			+'margin-right: 0px; }');
	}

	/**
	 * Initialise events.
	 * @memberof scrolla
	 * @private
	 */
	function initEvents(){
		window.addEventListener('resize',handleWindowResize);
	}

	/**
	 * Handle window resize for each scrolla instance.
	 * @memberof scrolla
	 * @private
	 */
	function handleWindowResize(){
		instances.forEach(function(instance){
			instance.resize();
		});
	}

	/**
	 * Instantiate scrolla
	 * @memberof scrolla
	 * @public
	 * @param {HTMLElement} element
	 * @param {Object} [options]
	 * @param {string} [options.id='scrolla#']
	 * @param {string} [options.class='scrolla#']
	 * @param {Number} [options.gutterSize=8]
	 * @param {animatedStepCallback} [options.animatedStepCallback]
	 * @param {HTMLElement} [options.gutterHor=HTMLDivElement]
	 * @param {HTMLElement} [options.barHor=HTMLDivElement]
	 * @param {HTMLElement} [options.gutterVer=HTMLDivElement]
	 * @param {HTMLElement} [options.barVer=HTMLDivElement]
	 * @param {HTMLElement} [options.left=HTMLDivElement]
	 * @param {HTMLElement} [options.right=HTMLDivElement]
	 * @param {HTMLElement} [options.top=HTMLDivElement]
	 * @param {HTMLElement} [options.bottom=HTMLDivElement]
	 * @returns scrollaInstance
	 */
	function scrolla(element,options){
		options = extend(options||{},defaultOptions);
		!isInitialised&&init();
		var gutterHor = options.gutterHor||createDiv()
			,barHor = options.barHor||createDiv()
			,gutterVer = options.gutterVer||createDiv()
			,barVer = options.barVer||createDiv()
			,left = options.left||createDiv()
			,right = options.right||createDiv()
			,top = options.top||createDiv()
			,bottom = options.bottom||createDiv()
			,instanceId = classnameBase+(instancesNr++)
			// the private scroll instance
			,inst = {
				id: options.id||instanceId
				,class: options.class||instanceId
				,base: createDiv()
				,wrapper: createDiv()
				//
				,viewport: element
				,viewportW: element.offsetWidth
				,viewportH: element.offsetHeight
				,viewportScrollW: element.scrollWidth
				,viewportScrollH: element.scrollHeight
				//
				,gutterSize: options.gutterSize||8
				// horizontal gutter
				,gutterHor: gutterHor
				,gutterHorClassList: gutterHor.classList
				,barHor: barHor
				,barHorStyle: barHor.style
				,barHorSize: null
				,barHorPos: 0
				// vertical gutter
				,gutterVer: gutterVer
				,gutterVerClassList: gutterVer.classList
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
				,allInline: true
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
				,resize: resize.bind(null,inst)
				,enable: disenable.bind(null,inst)
				,element: inst.base
			}
		;
		// set other instance variables
		inst.resize = instancePublic.resize;
		//
		// expose public instance to element
		inst.base.scrolla = instancePublic;
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
		return instancePublic;
	}

	/**
	 * Initialise the structure of the elements.
	 * @memberof scrolla
	 * @private
	 * @param {scrollaPrivateInstance} inst
	 * @param {HTMLElement} element
	 */
	function initWrapper(inst,element){
		// classnames
		inst.base.classList.add(classnameBase);
		inst.base.classList.add(classnameBase+'-'+inst.viewport.nodeName.toLowerCase());
		inst.base.classList.add(inst.class);
		inst.base.setAttribute('id',inst.id);
		inst.wrapper.classList.add(classnameWrapper);
		inst.viewport.classList.add(classnameViewport);
		//
		// set base element dimensions
		var defaultStyles = getDefaultStyles(element,dimensionStyles)
			,baseStyle = inst.base.style;
		for (var cssProperty in defaultStyles) {
			var styleValue = defaultStyles[cssProperty];
			styleValue!==dimensionDefaultStyles[cssProperty]&&(baseStyle[cssProperty] = styleValue);
		}
		// if no height is set revert to offetHeight
		if (baseStyle.height===''&&baseStyle.minHeight===''){
			baseStyle.height = inst.viewportH+stringPx;
		}
		//
		//inst.viewport
		console.log('initWrapper::scroll',document.defaultView.getComputedStyle(inst.viewport, null).getPropertyValue('scroll')); // log
		//
		//
		// structure
		element.parentNode.insertBefore(inst.base,element);
		inst.base.appendChild(inst.wrapper);
		inst.wrapper.appendChild(inst.viewport);
		//
		// check for inline contents
		var children = element.children;
		for (var i=0,l=children.length;i<l;i++) {
			var child = children[i]
				,computedStyle = getComputedStyle(child)
				,display = computedStyle.getPropertyValue('display');
			if (display.indexOf('inline')==-1) {
				inst.allInline = false;
				break;
			}
		}
		inst.allInline&&inst.viewport.classList.add(classnameAllInline);
	}

	/**
	 * Add the hor and ver properties to the scrolla instance.
	 * @memberof scrolla
	 * @private
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
	 * @memberof scrolla
	 * @private
	 * @param {scrollaPrivateInstance} inst
	 */
	function initGutterAndBar(inst){
		[inst.hor,inst.ver].forEach(function(dir){
			var isHorizontal = dir.gutter===inst.gutterHor
				,sizePrll = getParallel(isHorizontal)
				,sizePrpd = getPerpendicular(isHorizontal)
			;
			dir.gutterClassList.add(classnameGutter);
			dir.gutterClassList.add(isHorizontal?classnameHorizontal:classnameVertical);
			//
			insertRule('.'+inst.class+'>.gutter.'+(isHorizontal?classnameHorizontal:classnameVertical)+'{'
				+sizePrpd+': '+inst.gutterSize+stringPx+';}');
			//
			dir.bar.classList.add(classnameBar);
			dir.gutter.addEventListener(eventClick,handleGutterClick.bind(dir.gutter,inst,isHorizontal));
			//
			dir.barStyle[sizePrll] = dir.barSize + stringPx;
			dir.bar.addEventListener(eventMousedown,handleBarMousedown.bind(dir.bar,inst,isHorizontal));
			dir.bar.addEventListener(eventTouchstart,handleBarMousedown.bind(dir.bar,inst,isHorizontal));
			dir.bar.addEventListener(eventClick,handleStopPropagation);
			dir.gutter.appendChild(dir.bar);
			inst.base.insertBefore(dir.gutter,inst.wrapper);
			//
			[dir.backward,dir.forward].forEach(function(button,i){
				button.classList.add(classnameButton);
				button.classList.add(isHorizontal?classnameHorizontal:classnameVertical);
				button.classList.add(i===0?classnameBackward:classnameForward);
				inst.base.insertBefore(button,inst.wrapper);
				button.addEventListener(eventClick,handleButtonClick.bind(button,inst,isHorizontal,button===dir.forward));
			});
		});
	}

	/**
	 * Initialise the instance viewport element.
	 * @memberof scrolla
	 * @private
	 * @param {scrollaPrivateInstance} inst
	 */
	function initViewport(inst){
		inst.viewport.addEventListener('scroll',handleScroll.bind(inst.viewport,inst));
	}

	/**
	 * Handle the viewport scroll event.
	 * @memberof scrolla
	 * @private
	 * @param {scrollaPrivateInstance} inst
	 */
	function handleScroll(inst) {
		setBarPos(inst,true);
		setBarPos(inst,false);
	}

	/**
	 * Handle gutter click event.
	 * @memberof scrolla
	 * @private
	 * @param {scrollaPrivateInstance} inst
	 * @param {boolean} horizontal
	 * @param {MouseEvent} e
	 */
	function handleGutterClick(inst,horizontal,e){
		// todo: Firefox bug
		var dir = getDirection(inst,horizontal)
			,pos = horizontal?e.offsetX:e.offsetY
		;
		stepViewport(inst,horizontal,pos>dir.barPos);
	}

	/**
	 * Handle bar mousedown event.
	 * @memberof scrolla
	 * @private
	 * @param {scrollaPrivateInstance} inst
	 * @param {boolean} horizontal
	 * @param {MouseEvent} e
	 */
	function handleBarMousedown(inst,horizontal,e){
		var dir = getDirection(inst,horizontal)
			,orgBarPos = dir.barPos;
		inst.handleBarDrag = handleBarDrag.bind(window,inst,horizontal,orgBarPos,e);
		inst.handleBarMouseup = handleBarMouseup.bind(window,inst);
		window.addEventListener(eventMousemove,inst.handleBarDrag);
		window.addEventListener(eventTouchmove,inst.handleBarDrag);
		window.addEventListener(eventMouseup,inst.handleBarMouseup);
		window.addEventListener(eventTouchend,inst.handleBarMouseup);
		e.preventDefault();
	}

	/**
	 * Handle bar drag event.
	 * @memberof scrolla
	 * @private
	 * @param {scrollaPrivateInstance} inst
	 * @param {boolean} horizontal
	 * @param {Number} orgBarPos
	 * @param {MouseEvent} eDown
	 * @param {MouseEvent} e
	 */
	function handleBarDrag(inst,horizontal,orgBarPos,eDown,e){
		var dir = getDirection(inst,horizontal)
			,isTouch = e.type===eventTouchmove
			,client = isTouch?e.touches[0]:e
			,lastClient = isTouch?eDown.touches[0]:eDown
			,offset = horizontal?client.clientX - lastClient.clientX:client.clientY - lastClient.clientY
			,barPos = Math.min(Math.max(orgBarPos + offset,0),dir.viewportSize-dir.barSize)
		;
		//
		inst.viewport[getScroll(horizontal)] = (barPos/dir.viewportSize)*dir.viewportScrollSize;
		//
		e.preventDefault();
	}

	/**
	 * Handle bar mouseup event.
	 * @memberof scrolla
	 * @private
	 * @param {scrollaPrivateInstance} inst
	 */
	function handleBarMouseup(inst) {
		window.removeEventListener(eventMousemove,inst.handleBarDrag);
		window.removeEventListener(eventTouchmove,inst.handleBarDrag);
		window.removeEventListener(eventMouseup,inst.handleBarMouseup);
		window.removeEventListener(eventTouchend,inst.handleBarMouseup);
	}

	/**
	 * Handle button click event.
	 * @memberof scrolla
	 * @private
	 * @param {scrollaPrivateInstance} inst
	 * @param {boolean} horizontal
	 * @param {boolean} forward
	 */
	function handleButtonClick(inst,horizontal,forward){
		stepViewport(inst,horizontal,forward);
	}

	/**
	 * Stop propagation
	 * @memberof scrolla
	 * @private
	 * @param {Event} e
	 */
	function handleStopPropagation(e){
		e.stopPropagation();
	}

	/**
	 * Resize the elements by recalculating the changed dimensions.
	 * @memberof scrolla
	 * @private
	 * @param {scrollaPrivateInstance} inst
	 */
	function resize(inst){
		// recalculate sizes
		inst.viewportW = inst.base.offsetWidth;
		inst.viewportH = inst.base.offsetHeight;
		inst.viewportScrollW = inst.viewport.scrollWidth;
		inst.viewportScrollH = inst.viewport.scrollHeight;
		inst.barHorSize = getBarSize(inst,true);
		inst.barVerSize = getBarSize(inst,false);
		// check inactive elements
		var isHorInActive = inst.viewportScrollW<=inst.viewportW
			,isVerInActive = inst.viewportScrollH<=inst.viewportH;
		inst.gutterHor.classList.toggle(classnameInactive,isHorInActive);
		inst.gutterVer.classList.toggle(classnameInactive,isVerInActive);
		inst.left.classList.toggle(classnameInactive,isHorInActive);
		inst.right.classList.toggle(classnameInactive,isHorInActive);
		inst.top.classList.toggle(classnameInactive,isVerInActive);
		inst.bottom.classList.toggle(classnameInactive,isVerInActive);
		// set positions
		setBarPos(inst,true);
		setBarPos(inst,false);
		[inst.hor,inst.ver].forEach(function(o){
			var isHorizontal = o.gutter===inst.gutterHor
				,sizePrll = getParallel(isHorizontal)
			;
			o.barStyle[sizePrll] = o.barSize + stringPx;
		});
	}

	/**
	 * Calculate the size of the bar element by the size of the viewport in respect to the scrollable size of the viewport
	 * @memberof scrolla
	 * @private
	 * @param {scrollaPrivateInstance} inst
	 * @param {boolean} horizontal
	 */
	function getBarSize(inst,horizontal){
		var dir = getDirection(inst,horizontal);
		return dir.viewportSize/dir.viewportScrollSize*dir.viewportSize;
		//return horizontal?inst.viewportW/inst.viewportScrollW*inst.viewportW:inst.viewportH/inst.viewportScrollH*inst.viewportH;
	}

	/**
	 * Sets the bar position to the viewport scroll position.
	 * @memberof scrolla
	 * @private
	 * @param {scrollaPrivateInstance} inst
	 * @param {boolean} horizontal
	 */
	function setBarPos(inst,horizontal){ // todo: refactor
		//var dir = horizontal?inst.hor:inst.ver;
		if (horizontal) {
			inst.barHorPos = inst.viewportScrollW===0?0:(inst.viewport.scrollLeft/inst.viewportScrollW)*inst.viewportW;
			inst.barHorStyle.left = inst.barHorPos + stringPx;
			//console.log('setBarPos',inst.viewportScrollW,inst.viewport.scrollWidth,inst.viewport.scrollLeft); // log
		} else {
			inst.barVerPos = inst.viewportScrollH===0?0:(inst.viewport.scrollTop/inst.viewportScrollH)*inst.viewportH;
			inst.barVerStyle.top = inst.barVerPos + stringPx;
		}
	}

	/**
	 * Scroll the viewport by the viewport size.
	 * @name step
	 * @type {Function}
	 * @memberof scrollaInstance
	 * @public
	 * @param {boolean} horizontal
	 * @param {boolean} forward
	 */

	/**
	 * Scroll the viewport by the viewport size.
	 * @memberof scrolla
	 * @private
	 * @param {scrollaPrivateInstance} inst
	 * @param {boolean} horizontal
	 * @param {boolean} forward
	 */
	function stepViewport(inst,horizontal,forward){
		var dir = getDirection(inst,horizontal)
			,scrollDir = getScroll(horizontal)
			,scrollFrom = parseFloat(inst.viewport[scrollDir])
			,scrollTo = scrollFrom + (forward?1:-1)*stepSize*dir.viewportSize
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
	 * Disable or enable
	 * @memberof scrolla
	 * @private
	 * @param {scrollaPrivateInstance} inst
	 * @param {boolean} enable
	 */
	function disenable(inst,enable){
		inst.base.classList.toggle(classnameDisabled,!enable);
	}

	/**
	 * Calculate the size of the real scrollbar.
	 * @memberof scrolla
	 * @private
	 * @returns {number}
	 */
	function getBrowserScrollbarSize(){
		var outer = createDiv()
			,inner = createDiv()
			,widthNoScroll
			,widthWithScroll
			,classNameTestSize = 'test'+Date.now()
			,selectorTestSize = '.'+classNameTestSize
			,sheet = getStyleSheet()
		;
		insertRule(selectorTestSize+'::-webkit-scrollbar{display:none; }');
		outer.classList.add(classNameTestSize);
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
		sheet.length&&sheet.deleteRule(0);
		//
		return widthNoScroll - widthWithScroll;
	}

	/**
	 * Get the scrolla stylesheet.
	 * @memberof scrolla
	 * @private
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
	 * @memberof scrolla
	 * @private
	 * @param {string} css
	 * @returns {CSSRule}
	 */
	function insertRule(css){
		var sheet = getStyleSheet();
		try{sheet.insertRule(css,0);}catch(err){console.warn(err);}
		return sheet.cssRules[0];
	}

	/**
	 * Get the property name of the size parallel to an element.
	 * @memberof scrolla
	 * @private
	 * @param {boolean} horizontal
	 * @returns {string}
	 */
	function getParallel(horizontal){
		return horizontal?'width':'height';
	}

	/**
	 * Get the property name of the size perpendicular to an element.
	 * @memberof scrolla
	 * @private
	 * @param {boolean} horizontal
	 * @returns {string}
	 */
	function getPerpendicular(horizontal){
		return horizontal?'height':'width';
	}

	/**
	 * Get the property name of the scroll position of an element.
	 * @memberof scrolla
	 * @private
	 * @param {boolean} horizontal
	 * @returns {string}
	 */
	function getScroll(horizontal){
		return horizontal?'scrollLeft':'scrollTop';
	}

	/**
	 * Get the direction object.
	 * @memberof scrolla
	 * @private
	 * @param {scrollaPrivateInstance} inst
	 * @param {boolean} horizontal
	 * @returns {scrollaDirection}
	 */
	function getDirection(inst,horizontal){
		return horizontal?inst.hor:inst.ver;
	}

	/**
	 * Extend and object
	 * @memberof scrolla
	 * @private
	 * @param {Object} target
	 * @param {Object} source
	 */
	function extend(target,source){
		for (var s in source) target[s] = source[s];
		return target;
	}

	/**
	 * Get the CSS style values of an element (not the computed values).
	 * @memberof scrolla
	 * @private
	 * @param {HTMLElement} element
	 * @param {Array} props
	 * @returns {Object}
	 */
	function getDefaultStyles(element,props) {
		var parent = element.parentNode
			,computedStyle = getComputedStyle(element)
			,values = {};
		parent.style.display = 'none';
		props.forEach(function(prop){
			values[prop] = computedStyle.getPropertyValue(prop);
		});
		parent.style.removeProperty('display');
		return values;
	}

	// todo: add api
	//instantiate.init = init;
	Object.defineProperty(scrolla, 'init', {
		enumerable: false
		,configurable: false
		,writable: false
		,value: init
	});

	return scrolla;
})(window,document);

/**
 * The scrolla instance
 * @typedef {Object} scrollaInstance
 * @property {Function} resize
 * @property {Function} enable
 * @property {HTMLElement} element
 */
/**
 * The private scrolla instance
 * @typedef {Object} scrollaPrivateInstance
 * @property {string} id
 * @property {string} class
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
 * @property {HTMLElement} barHor
 * @property {CSSStyleDeclaration} barHorStyle
 * @property {Number} barHorSize
 * @property {Number} barHorPos
 * @property {HTMLElement} gutterVer
 * @property {DOMTokenList} gutterVerClassList
 * @property {HTMLElement} barVer
 * @property {CSSStyleDeclaration} barVerStyle
 * @property {Number} barVerSize
 * @property {Number} barVerPos
 * @property {Function} handleBarDrag
 * @property {Function} handleBarMouseup
 * @property {Function} resize
 * @property {boolean} allInline
 * @property {HTMLElement} left
 * @property {HTMLElement} right
 * @property {HTMLElement} top
 * @property {HTMLElement} bottom
 * @property {Function} animatedStepCallback
 * @property {scrollaDirection} hor
 * @property {scrollaDirection} ver
 */
/**
 * The scrolla direction (horizontal or vertical)
 * @typedef {Object} scrollaDirection
 * @property {Number} viewportSize viewportW or viewportH
 * @property {Number} viewportScrollSize viewportScrollW or viewportScrollH
 * @property {HTMLElement} gutter gutterHor or gutterVer
 * @property {DOMTokenList} gutterClassList gutterHorClassList or gutterVerClassList
 * @property {HTMLElement} bar barHor or barVer
 * @property {CSSStyleDeclaration} barStyle barHorStyle or barVerStyle
 * @property {Number} barSize barHorSize or barVerSize
 * @property {Number} barPos barHorPos or barVerPos
 * @property {HTMLElement} backward left or top
 * @property {HTMLElement} forward right or bottom
 */
/**
 * This callback can be parsed to an options object to create animated scrolling.
 * @callback animatedStepCallback
 * @param {Object} options
 * @param {HTMLElement} options.elm The viewport element
 * @param {string} options.property The element property to be set
 * @param {string} options.from The property from-value
 * @param {string} options.to The property to-value
 * @param {Function} options.updateBar The update function to set the scrollbar position
 */
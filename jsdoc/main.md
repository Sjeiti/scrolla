# scrolla

Scrolla is a pure-js scrollbar script that is easy to implement and style. It has a lot of good features:

- single file
- no dependencies
- crossbrowser/device
- stylesheet dynamically added to document
- all the basic ui components
- instances can be controlled through API
- hooks for animated scrolling


## usage

Include the script and instantiate it onto an HTMLElement:

``` javascript
var instance = scrolla(document.querySelector('.myElement'));
```

### options

The second argument is an optional options object.

``` javascript
var instance = scrolla(document.querySelector('.myElement'),{gutterSize:2});
```

The options object can have the following settings:

{{scrolla}}

### instance api

The `scrolla` function call returns an instance with the following API: 

``` javascript
instance.step(true);
instance.resize();
```

### scrolla api

When first called *scrolla* adds CSS to your document. This can be easily overridden but you can also set the classNames the CSS uses by explicitly initialising *scrolla* yourself by calling `scrolla.init({});`.
If you want to use this you have to call this method before creating any instances.
The `scrolla.init` method takes an options object as the first argument:

{{init}}

## examples

<style>
	section {
		position: relative;
		margin: 20px 0 60px;
	}
	pre.source {
		margin: 20px 0;
		max-height: 200px;
		border: 0;
		word-wrap: normal;
	}
	.disenable {
		margin-top: 10px;
	}
	.scrolla-pre {
		box-shadow: 0 0 1px gray;
	}
	asdf.scrolla-pre pre {
		padding: 1rem;
	}
	.scrolla-pre code {
		white-space: pre;
	}
	.scrolla-pre .gutter.vertical {
		right: 0;
		width: 2px;
		transition: width 200ms ease-out;
	}
	.scrolla-pre .gutter.vertical:before {
		content: '';
		position: absolute;
		right: 0;
		width: 40px;
		height: 100%;
	}
	.scrolla-pre .gutter.vertical:hover {
		width: 10px;
	}
	.scrolla-pre .gutter.horizontal {
		bottom: 0;
		height: 2px;
		transition: height 200ms ease-out;
	}
	.scrolla-pre .gutter.horizontal:before {
		content: '';
		position: absolute;
		bottom: 0;
		height: 40px;
		width: 100%;
	}
	.scrolla-pre .gutter.horizontal:hover {
		height: 10px;
	}
	.scrolla-pre .gutter .bar {
		background-color: #666;
	}

	/**/
</style>

(see examples folder in repository)


### default behavior

The default sort simply sorts the text of each element

<style>
	.instance1 {
		width: 60%;
		height: 150px;
		overflow: scroll;
	}
	.instance1 div {
		height:1100px;
		width:1500px;
		background-color: #CCC;
		background-image: repeating-linear-gradient(45deg, transparent, transparent 128px, #DDD 128px, #DDD 256px);
	}
</style>
<div class="instance1">
	<div></div>
</div>

``` javascript
scrolla(document.querySelector('.instance1'));
```


### Easy CSS styling

<div class="target-css"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula quam nibh, eu tristique tellus dignissim quis. Integer condimentum ultrices elit ut mattis. Praesent rhoncus tortor metus, nec pellentesque enim mattis nec. Nulla vitae turpis ut dui consectetur pellentesque quis vel est. Curabitur rutrum, mauris ut mollis lobortis, sem est congue lectus, ut sodales nunc leo a libero. Cras quis sapien in mi fringilla tempus condimentum quis velit. Aliquam id aliquam arcu. Morbi tristique aliquam rutrum. Duis tincidunt, orci suscipit cursus molestie, purus nisi pharetra dui, tempor dignissim felis turpis in mi. Vivamus ullamcorper arcu sit amet mauris egestas egestas. Vestibulum turpis neque, condimentum a tincidunt quis, molestie vel justo. Sed molestie nunc dapibus arcu feugiat, ut sollicitudin metus sagittis. Aliquam a volutpat sem. Quisque id magna ultrices, lobortis dui eget, pretium libero. Curabitur aliquam in ante eu ultricies.</p></div>

``` css
.target-css {
	width: 60%;
	height: 150px;
	overflow: scroll;
	background-color: #DDD;
}
.target-css p {
	padding: 10px;
}
.instance-css .gutter {
	background-color: #CCC;
}
.instance-css .bar {
	border-radius: 15px;
	background-color: #BBB;
}
.instance-css .horizontal {
	top: -10px;
}
.instance-css .gutter.vertical {
	right: 0;
	width: 15px;
}
```

``` javascript
scrolla(document.querySelector('.target-css'),{class:'instance-css'});
```


### Positioned and animated

<div class="target-anim">
	<div class="left">&lt;</div>
	<div class="right">&gt;</div>
	<div><p>Aenean egestas cursus tempor. Maecenas semper tortor sit amet egestas cursus. Mauris porttitor quis nisi ut tincidunt. Curabitur adipiscing eleifend nibh.</p></div>
</div>

``` css
.target-anim {
	position: relative;
	left: 25px;
	width: 70%;
	height: 70px;
	overflow: scroll;
	background-color: #EEE;
}
.target-anim div {
	white-space: nowrap;
	font-size: 44px;
	line-height: 60px;
}
.instance-anim .left, .instance-anim .right {
	position: absolute;
	top: 45%;
	font: bold 28px/28px 'Courier New', monospace;
	text-align: center;
}
.instance-anim .left { left: -20px; }
.instance-anim .right { right: -20px; }
.instance-anim .gutter.horizontal { bottom: 0; height: 20px; }
```

``` javascript
var element = document.querySelector('.target-anim');
scrolla(element,{
	left: element.querySelector('.left')
	,right: element.querySelector('.right')
	,animatedStepCallback: function(o){
		var tweenProp = {
			onUpdate: o.updateBar
			,ease: Strong.easeInOut
		};
		tweenProp[o.property] = o.from;
		TweenMax.from(o.elm,0.4,tweenProp);
	}
	,class: 'instance-anim'
});
```


### A list

<style>
.target-list {
	width: 500px;
	padding-left: 0;
	list-style: none;
	white-space: nowrap;
	background-color: gray;
}
.target-list li {
	display: inline-block;
	vertical-align: top;
	width: 100px;
	height: 100px;
	font-size: 34px;
	line-height: 90px;
	text-align: center;
	color: white;
}
.instance-list .bar {
	background-color: red;
}
</style>
<ul class="target-list"> </ul>

``` javascript
var element = document.querySelector('.target-list');
for (var i=0;i<25;i++) {
	var li = document.createElement('li');
	li.textContent = i;
	li.style.backgroundColor = '#'+Math.floor(Math.random()*16777215).toString(16);
	element.appendChild(li);
}
scrolla(element,{class:'instance-list'});
```
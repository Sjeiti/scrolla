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

**id** (string='scrolla#')
<p>An optional instance ID.</p>

**class** (string='scrolla#')
<p>An optional instance className.</p>

**gutterSize** (Number=8)
<p>The size of the gutter in pixels. You can also just set this with CSS.</p>

**animatedStepCallback** (animatedStepCallback)
<p>A callback method when stepping to apply animations with (see <a href="global.html#animatedStepCallback"><code>animatedStepCallback</code></a>).</p>

**gutterHor** (HTMLElement=HTMLDivElement)
<p>An optional HTMLElement for the horizontal gutter.</p>

**barHor** (HTMLElement=HTMLDivElement)
<p>An optional HTMLElement for horizontal bar.</p>

**gutterVer** (HTMLElement=HTMLDivElement)
<p>An optional HTMLElement for vertical gutter.</p>

**barVer** (HTMLElement=HTMLDivElement)
<p>An optional HTMLElement for vertical bar</p>

**left** (HTMLElement=HTMLDivElement)
<p>An optional HTMLElement for left button.</p>

**right** (HTMLElement=HTMLDivElement)
<p>An optional HTMLElement for right button.</p>

**top** (HTMLElement=HTMLDivElement)
<p>An optional HTMLElement for top button.</p>

**bottom** (HTMLElement=HTMLDivElement)
<p>An optional HTMLElement for bottom button.</p>



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

**stepSize** (String=0.95)
<p>The amount of the step size, a number from 0 to 1 proportionate to the viewport size.</p>

**classnameWrapper** (String='wrapper')
<p>ClassName for the wrapper.</p>

**classnameViewport** (String='viewport')
<p>ClassName for the viewport.</p>

**classnameGutter** (String='gutter')
<p>ClassName for the gutters.</p>

**classnameBar** (String='bar')
<p>ClassName for the bars.</p>

**classnameButton** (String='button')
<p>ClassName for the buttons.</p>

**classnameHorizontal** (String='horizontal')
<p>ClassName for horizontal.</p>

**classnameVertical** (String='vertical')
<p>ClassName for vertical.</p>

**classnameForward** (String='forward')
<p>ClassName for forward.</p>

**classnameBackward** (String='backward')
<p>ClassName for backward.</p>

**classnameInactive** (String='inactive')
<p>ClassName for inactive ui elements.</p>

**classnameDisabled** (String='disabled')
<p>ClassName for a disabled scrolla instance.</p>

**classnameAllInline** (String='all-inline')
<p>ClassName for the viewport when all direct children are inline.</p>




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


**class** (string='scrolla#')


**gutterSize** (Number=8)


**animatedStepCallback** (animatedStepCallback)


**gutterHor** (HTMLElement=HTMLDivElement)


**barHor** (HTMLElement=HTMLDivElement)


**gutterVer** (HTMLElement=HTMLDivElement)


**barVer** (HTMLElement=HTMLDivElement)


**left** (HTMLElement=HTMLDivElement)


**right** (HTMLElement=HTMLDivElement)


**top** (HTMLElement=HTMLDivElement)


**bottom** (HTMLElement=HTMLDivElement)




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

**classnameWrapper** (String='wrapper')


**classnameViewport** (String='viewport')


**classnameGutter** (String='gutter')


**classnameBar** (String='bar')


**classnameHorizontal** (String='horizontal')


**classnameVertical** (String='vertical')





## bar

Lipsum Orem
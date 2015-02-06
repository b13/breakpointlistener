var B = B || {};

(function(funcName, baseObj) {
	// The public function name defaults to window.docReady
	// but you can pass in your own object and own function name and those will be used
	// if you want to put them in a different namespace
	funcName = funcName || "docReady";
	baseObj = baseObj || window;
	var readyList = [];
	var readyFired = false;
	var readyEventHandlersInstalled = false;

	// call this when the document is ready
	// this function protects itself against being called more than once
	function ready() {
		if (!readyFired) {
			// this must be set to true before we start calling callbacks
			readyFired = true;
			for (var i = 0; i < readyList.length; i++) {
				// if a callback here happens to add new ready handlers,
				// the docReady() function will see that it already fired
				// and will schedule the callback to run right after
				// this event loop finishes so all handlers will still execute
				// in order and no new ones will be added to the readyList
				// while we are processing the list
				readyList[i].fn.call(window, readyList[i].ctx);
			}
			// allow any closures held by these functions to free
			readyList = [];
		}
	}

	function readyStateChange() {
		if ( document.readyState === "complete" ) {
			ready();
		}
	}

	// This is the one public interface
	// docReady(fn, context);
	// the context argument is optional - if present, it will be passed
	// as an argument to the callback
	baseObj[funcName] = function(callback, context) {
		// if ready has already fired, then just schedule the callback
		// to fire asynchronously, but right away
		if (readyFired) {
			setTimeout(function() {callback(context);}, 1);
			return;
		} else {
			// add the function and context to the list
			readyList.push({fn: callback, ctx: context});
		}
		// if document already ready to go, schedule the ready function to run
		if (document.readyState === "complete") {
			setTimeout(ready, 1);
		} else if (!readyEventHandlersInstalled) {
			// otherwise if we don't have event handlers installed, install them
			if (document.addEventListener) {
				// first choice is DOMContentLoaded event
				document.addEventListener("DOMContentLoaded", ready, false);
				// backup is window load event
				window.addEventListener("load", ready, false);
			} else {
				// must be IE
				document.attachEvent("onreadystatechange", readyStateChange);
				window.attachEvent("onload", ready);
			}
			readyEventHandlersInstalled = true;
		}
	}
})("docReady", window);

require([
	'breakpointlistener'
], function(BPL){

	function initialize(){
		var currentBreakpoint;

		B.jsXSContainer       = document.querySelectorAll('.bJS_visible-xs')[0];
		B.jsSMContainer       = document.querySelectorAll('.bJS_visible-sm')[0];
		B.jsMDContainer       = document.querySelectorAll('.bJS_visible-md')[0];
		B.jsLGContainer       = document.querySelectorAll('.bJS_visible-lg')[0];
		B.viewportWidthField  = document.querySelectorAll('.bJS_dataDisplay-width')[0];
		B.viewportHeightField = document.querySelectorAll('.bJS_dataDisplay-height')[0];

		B.BreakpointListener = new BPL({
			breakpoints: {
				xs: 0,
				sm: 768,
				md: 992,
				lg: 1200
			}
		});

		currentBreakpoint = B.BreakpointListener.getCurrentBreakpoint();

		if(currentBreakpoint != 'xs') B.jsXSContainer.style.display = "none";
		if(currentBreakpoint != 'sm') B.jsSMContainer.style.display = "none";
		if(currentBreakpoint != 'md') B.jsMDContainer.style.display = "none";
		if(currentBreakpoint != 'lg') B.jsLGContainer.style.display = "none";

		B.BreakpointListener.onChangeBreakpoint(function(evt){

			switch(evt.lastBreakpoint){
				case 'xs':
					B.jsXSContainer.style.display = "none";
					break;
				case 'sm':
					B.jsSMContainer.style.display = "none";
					break;
				case 'md':
					B.jsMDContainer.style.display = "none";
					break;
				case 'lg':
					B.jsLGContainer.style.display = "none";
					break;
			}

			switch(evt.currentBreakpoint){
				case 'xs':
					B.jsXSContainer.style.display = "block";
					break;
				case 'sm':
					B.jsSMContainer.style.display = "block";
					break;
				case 'md':
					B.jsMDContainer.style.display = "block";
					break;
				case 'lg':
					B.jsLGContainer.style.display = "block";
					break;
			}

			B.viewportWidthField.innerHTML = B.BreakpointListener.getCssViewPortWidth();
			B.viewportHeightField.innerHTML = B.BreakpointListener.getCssViewPortHeight();

		});

		window.addEventListener('resize', function(){
			B.viewportWidthField.innerHTML = B.BreakpointListener.getCssViewPortWidth();
			B.viewportHeightField.innerHTML = B.BreakpointListener.getCssViewPortWidth();
		});
	}

	docReady(initialize);

});
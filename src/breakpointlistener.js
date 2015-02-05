define('breakpointlistener', ['bowser'], function(bowser){

	function clone(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}

	function extend(){
		if(!arguments.length) return undefined;

		var targetObj = arguments[0];

		for(var i = arguments.length - 1; i > 0; i--){
			if (null == arguments[i] || "object" != typeof arguments[i]) continue;
			for(var attr in arguments[i]){
				if (arguments[i].hasOwnProperty(attr)) targetObj[attr] = arguments[i][attr];
			}
		}

		return targetObj;
	}

	var BreakpointListener = function(opts){
		var
			bph = this
			, defaultOptions = {};

		function initialize(opts) {
			bph.options = extend(clone(defaultOptions), opts || {});

			bph.breakpointHandlers = [];
			bph.currentBreakpoint = bph.getCurrentBreakpoint();

			//Bind function scope
			bph.onResize = function(){
				onResize.apply(bph, arguments);
			};

			bindEvents();
		}

		function bindEvents() {
			window.addEventListener('resize', bph.onResize, false)
		}

		function onResize() {
			var evt = {
				lastBreakpoint     : bph.currentBreakpoint
				,currentBreakpoint : bph.updateBreakpoint()
				,timestamp : new Date()
			};

			if(evt.lastBreakpoint != evt.currentBreakpoint){
				if(bph.breakpointHandlers.length){
					for(var i = 0; i < bph.breakpointHandlers.length; i++){
						bph.breakpointHandlers[i].call(bph, evt);
					}
				}
			}
		}

		bph.getCurrentBreakpoint = function(){
			if(!bph.currentBreakpoint){
				bph.updateBreakpoint();
			}
			return bph.currentBreakpoint;
		};

		bph.getViewPortHeight = function(){
			var e = window, a = 'inner';
			if (!('innerHeight' in window )) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return e[ a+'Height' ];
		};

		bph.getViewPortWidth = function(){
			var e = window, a = 'inner';

			if(bowser.msie){
				return document.documentElement.innderWidth
			}

			if (!('innerWidth' in window )) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return e[ a+'Width' ];
		};

		bph.offChangeBreakpoint = function(handler){
			bph.unregisterBreakpointHandler(handler);
		};

		bph.onChangeBreakpoint = function(handler){
			bph.registerBreakpointHandler(handler);
		};

		bph.registerBreakpointHandler = function(handler){
			if(typeof handler === 'function'){
				bph.breakpointHandlers.push(handler);
			}
		};

		bph.unregisterBreakpointHandler = function(handler){
			var handlerIndex = bph.breakpointHandlers.indexOf(handler);

			if(handlerIndex > -1){
				bph.breakpointHandlers.splice(handlerIndex, 1);
			}
		};

		bph.updateBreakpoint = function(){
			var width = this.getViewPortWidth()
				, breakpoint = 'xs';

			for(var key in bph.options.breakpoints){
				var val = bph.options.breakpoints[key];
				if(width < val) break;
				breakpoint = key;
			}

			bph.currentBreakpoint = breakpoint;

			return breakpoint;
		};

		initialize(opts);
	};

	return BreakpointListener;
});
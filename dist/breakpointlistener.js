define('breakpointlistener', function(){

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
			bph.currentBreakPoint = bph.getCurrentBreakPoint();

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
				lastBreakPoint     : bph.currentBreakPoint
				,currentBreakPoint : bph.updateBreakPoint()
				,timestamp : new Date()
			};

			if(evt.lastBreakPoint != evt.currentBreakPoint){
				for(var index in bph.breakpointHandlers){
					bph.breakpointHandlers[index].call(bph, evt);
				}
			}
		}

		bph.getCurrentBreakPoint = function(){
			if(!bph.currentBreakPoint){
				bph.updateBreakPoint();
			}
			return bph.currentBreakPoint;
		};

		bph.getViewPortWidth = function(){
			var viewPortWidth;

			if (document.compatMode === 'BackCompat') {
				viewPortWidth = document.body.clientWidth;
			} else {
				viewPortWidth = document.documentElement.clientWidth;
			}

			return viewPortWidth;
		};

		bph.offChangeBreakpoint = function(handler){
			bph.unregisterBreakPointHandler(handler);
		};

		bph.onChangeBreakpoint = function(handler){
			bph.registerBreakPointHandler(handler);
		};

		bph.registerBreakPointHandler = function(handler){
			if(typeof handler === 'function'){
				bph.breakpointHandlers.push(handler);
			}
		};

		bph.unregisterBreakPointHandler = function(handler){
			var handlerIndex = bph.breakpointHandlers.indexOf(handler);

			if(handlerIndex > -1){
				bph.breakpointHandlers.splice(handlerIndex, 1);
			}
		};

		bph.updateBreakPoint = function(){
			var width = this.getViewPortWidth()
				, breakpoint = 'xs';

			for(var key in bph.options.breakpoints){
				var val = bph.options.breakpoints[key];
				if(width < val) break;
				breakpoint = key;
			}

			bph.currentBreakPoint = breakpoint;

			return breakpoint;
		};

		initialize(opts);
	};

	return BreakpointListener;
});
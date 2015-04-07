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
			bph._onResize = function(){
				_onResize.apply(bph, arguments);
			};

			bindEvents();
		}

		function bindEvents() {
			if(bowser.msie && bowser.version <= 8){
				window.attachEvent('onresize', bph._onResize);
			}
			else {
				window.addEventListener('resize', bph._onResize, false);
			}
		}

		function _onResize() {
			var evt = {
				lastBreakpoint     : bph.currentBreakpoint
				,currentBreakpoint : _updateBreakpoint()
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

		function _updateBreakpoint(){
			var width = bph.getCssViewPortWidth()
				, breakpoint = 'xs';

			for(var key in bph.options.breakpoints){
				var val = bph.options.breakpoints[key];
				if(width < val) break;
				breakpoint = key;
			}

			bph.currentBreakpoint = breakpoint;

			return breakpoint;
		}

		bph.getCurrentBreakpoint = function(){
			if(!bph.currentBreakpoint){
				_updateBreakpoint();
			}
			return bph.currentBreakpoint;
		};

		bph.getCssViewPortHeight = function(){
			var e = window, a = 'inner';

			if(bowser.msie && bowser.version <= 8){
				return document.documentElement.offsetHeight;
			}

			if (!('innerHeight' in window )) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return e[ a+'Height' ];
		};

		bph.getCssViewPortWidth = function(){
			var e = window, a = 'inner';

			if(bowser.msie && bowser.version <= 8){
				return document.documentElement.offsetWidth;
			}

			if (!('innerWidth' in window )) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return e[ a+'Width' ];
		};

		bph.offChangeBreakpoint = function(handler){
			return bph.unregisterBreakpointHandler(handler);
		};

		bph.onChangeBreakpoint = function(handler){
			return bph.registerBreakpointHandler(handler);
		};

		bph.registerBreakpointHandler = function(handler){
			if(typeof handler === 'function'){
				bph.breakpointHandlers.push(handler);
			}
			return handler;
		};

		bph.unregisterBreakpointHandler = function(handler){
			var handlerIndex = bph.breakpointHandlers.indexOf(handler);

			if(handlerIndex > -1){
				bph.breakpointHandlers.splice(handlerIndex, 1);
				return handler;
			}
			return void 0;
		};

		bph.updateBreakpoint = function(preventEvent){
			if(preventEvent){
				_updateBreakpoint();
			}
			else {
				_onResize();
			}

			return bph.currentBreakpoint;
		};

		initialize(opts);
	};

	return BreakpointListener;
});
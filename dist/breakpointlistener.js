define('breakpointlistener'
, ['jquery']
, function($){
	var BreakpointListener = function(opts){
		var
			bph = this
			, defaultOptions = {};

		function initialize(opts) {
			bph.options = $.extend(defaultOptions, opts || {});

			bph.breakpointHandlers = [];
			bph.currentBreakPoint = bph.getCurrentBreakPoint();

			bindEvents();
		}

		function bindEvents() {
			$(window).on('resize', onResize);
		}

		function onResize() {
			var evt = {
				lastBreakPoint     : bph.currentBreakPoint
				,currentBreakPoint :bph.updateBreakPoint()
				,timestamp : new Date()
			};

			if(evt.lastBreakPoint != evt.currentBreakPoint){
				$.each(bph.breakpointHandlers, function(index, handler){
					handler(evt);
				});
			}
		}

		bph.getCurrentBreakPoint = function(){
			if(!bph.currentBreakPoint){
				bph.updateBreakPoint();
			}
			return bph.currentBreakPoint;
		};

		bph.offChangeBreakpoint = function(handler){
			bph.unregisterBreakPointHandler(handler);
		};

		bph.onChangeBreakpoint = function(handler){
			bph.registerBreakPointHandler(handler);
		};

		bph.registerBreakPointHandler = function(handler){
			if(_.isFunction(handler)){
				bph.breakpointHandlers.push(handler);
			}
		};

		bph.unregisterBreakPointHandler = function(handler){
			bph.breakpointHandlers = _.without(bph.breakpointHandlers, handler);
		};

		bph.updateBreakPoint = function(){
			var width = $(window).width()
				, breakpoint = 'xs';

			$.each(bph.options.breakpoints, function(key, val){
				if(width < val) return breakpoint;
				breakpoint = key;
			});
			bph.currentBreakPoint = breakpoint;

			return breakpoint;
		};

		initialize(opts);
	};

	return BreakpointListener;
});
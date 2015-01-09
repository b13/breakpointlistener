define('breakpointlistener'
, ['jquery']
, function($){
	var BreakpointListener = function(opts){
		var
			bpl = this
			, defaultOptions = {};

		/**
		 * Initialize the breakpointListener intance
		 * @param opts
		 */
		function initialize(opts) {
			bpl.options = $.extend(defaultOptions, opts || {});

			bpl.breakpointHandlers = [];
			bpl.currentBreakpoint = bpl.getCurrentBreakpoint();

			bindEvents();
		}

		/**
		 * Binding events
		 */
		function bindEvents() {
			$(window).on('resize', onResize);
		}

		/**
		 * Resize handler
		 */
		function onResize() {
			var evt = {
				lastBreakpoint     : bpl.currentBreakpoint
				,currentBreakpoint :bpl.updateBreakpoint()
				,timestamp : new Date()
			};

			if(evt.lastBreakpoint != evt.currentBreakpoint){
				$.each(bpl.breakpointHandlers, function(index, handler){
					handler(evt);
				});
			}
		}

		/**
		 * Returns a string representation of the current breakpoint
		 * @returns {*}
		 */
		bpl.getCurrentBreakpoint = function(){
			if(!bpl.currentBreakpoint){
				bpl.updateBreakpoint();
			}
			return bpl.currentBreakpoint;
		};

		/**
		 * Unregister a breakpoint change handler.
		 * Does the same as unregisterBreakpointHandler.
		 * @param handler
		 */
		bpl.offChangeBreakpoint = function(handler){
			bpl.unregisterBreakpointHandler(handler);
		};

		/**
		 * Register a breakpoint change handler.
		 * Does tha same as registerBreakpointHandler.
		 * @param handler
		 */
		bpl.onChangeBreakpoint = function(handler){
			bpl.registerBreakpointHandler(handler);
		};

		/**
		 * Register a breakpoint change handler.
		 * @param handler
		 */
		bpl.registerBreakpointHandler = function(handler){
			if(_.isFunction(handler)){
				bpl.breakpointHandlers.push(handler);
			}
		};

		/**
		 * Unregister a breakpoint change handler.
		 * @param handler
		 */
		bpl.unregisterBreakpointHandler = function(handler){
			bpl.breakpointHandlers = _.without(bpl.breakpointHandlers, handler);
		};

		/**
		 * Function that computes which breakpoint is the current one.
		 * Can be triggered manually if needed.
		 * @returns {string}
		 */
		bpl.updateBreakpoint = function(){
			var width = $(window).width()
				, breakpoint = 'xs';

			$.each(bpl.options.breakpoints, function(key, val){
				if(width < val) return breakpoint;
				breakpoint = key;
			});
			bpl.currentBreakpoint = breakpoint;

			return breakpoint;
		};

		initialize(opts);
	};

	return BreakpointListener;
});
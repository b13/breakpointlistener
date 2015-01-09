Breakpoint Listener
===================

Introduction
------------

The breakpointListener is a small tool the listen to breakpoint changes in JS code in a resource economic way. Its 
purpose is to register handlers that will be called on breakpoint changes.

### Initialization with AMD

	require(['breakpointlistener'], function(BPL){
		var BreakpointListener = new BPL({
			breakpoints: {
				"xs": 0,
				"sm": 480,
				"md": 768,
				"lg": 1024
			}
		});
	});
	
Simply load the breakpoint listener as AMD module and create new instances of it. It is required to define the 
breakpoints like in the following example, but it is not required to define 4 breakpoints you could define any number of 
breakpoints that is bigger than 1. You could chose any name you want for the breakpoints, but it is recommended to use
the commonly used identifiers xs, sm, md and lg.

### Getting the current breakpoint
	
	BreakpointListener.getCurrentBreakpoint();


### Binding breakpoint change handlers

	BreakpointListener.onChangeBreakpoint(function(evt){
		switch(evt.currentBreakpoint){
			case "xs":
				if(evt.lastBreakpoint === "sm"){
					. . .
				}
				break;
			case "sm":
				. . .
				break;
			case "md":
				. . .
				break;
			case "lg":
				. . .
				break;
		}
		
		. . .
	});

registerBreakpointHandler(handler); is equivalent to onChangeBreakpoint(handler);

	BreakpointListener.registerBreakpointHandler(function(evt){
		. . .
	});

Simply register callbacks to listen to breakpoint changes. The callback will receive an evt parameter, that contains:
- currentBreakpoint	// The breakpoint that is now active
- lastBreakpoint	// The breakpoint that was active before the breakpoint change
- timestamp			// Time when the change occurred
	
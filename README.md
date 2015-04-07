Breakpoint Listener
===================

Introduction
------------

The breakpointListener is a small tool to listen to breakpoint changes in JS code in a resource economic way. Its 
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

Returns a string representation of the current breakpoint. 


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

Functions
---------

Function name | Return value | Description
--------- | ------------ | -----------
getCurrentBreakpoint() | String | Returns the current breakpoint. Possible values are: 'xs', 'sm', 'md', 'lg'
getCssViewPortHeight() | number | Returns the height of the viewport. This value corresponds to the height value that is used in css media queries.
getCssViewPortWidth() | number | Returns the width of the viewport. This value corresponds to the width value that is used in css media queries. 
offChangeBreakpoint(function:handlerFunction) | function/undefined | Same as unregisterBreakpointHandler(function:handlerFunction). Unbinds the given handler from the onChangeBreakpoint event and returns it, if it was bound before. 
onChangeBreakpoint(function:handlerFunction) | function | Same as registerBreakpointHandler(function:handlerFunction). Binds the given handler to the onChangeBreakpoint event and returns it. 
registerBreakpointHandler(function:handlerFunction) | function | Binds the given handler to the onChangeBreakpoint event and returns it.
unregisterBreakpointHandler(function:handlerFunction) | function/undefined | Unbinds the given handler from the onChangeBreakpoint event and returns it, if it was bound before.
updateBreakpoint(boolean:preventEvent) | String | Forces the breakpoint handler to update the breakpoint value and and to trigger the onChangeBreakpoint event if the breakpoint changed and if the given preventEvent argument is false.
	
var fakeKeyboard = function($){
	
	var keyDownEvent = new $.Event("keydown"),
	    defaultKeyPressCount = 1;
	
	function pressKey(keyCodeToBePressed, keyPressCount){	
		var i;
		keyDownEvent.keyCode = keyCodeToBePressed;
		keyPressCount = keyPressCount || defaultKeyPressCount;
		for (i=1; i <= keyPressCount; i++) {
			$(window).trigger(keyDownEvent);		
		}
	     	return this;	
	}; 

	function pressRightArrow(keyPressCount){
		return this.pressKey(39, keyPressCount);
	};

	function pressLeftArrow(keyPressCount){
		return this.pressKey(37, keyPressCount);
	};

	function pressEnter(keyPressCount){
		return this.pressKey(13, keyPressCount);
	};

	function pressHome(keyPressCount){
		return this.pressKey(36, keyPressCount);
	};

	function pressEnd(keyPressCount){
		return this.pressKey(35, keyPressCount);
	};

	return {
		pressRightArrow : pressRightArrow,
		pressLeftArrow : pressLeftArrow,
		pressEnter : pressEnter,
		pressHome : pressHome,
		pressEnd : pressEnd,
		pressKey : pressKey
	};

}(jQuery);

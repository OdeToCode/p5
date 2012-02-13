var onebyone = function () {

    var target = null;

    var initialize = function (element) {
        target = element;
        target.children().addClass("onebyone");
    };

    var step = function () {
        var hidden = target.children(".onebyone");
        hidden.first().removeClass("onebyone");
        return hidden.length > 0;
    };

    var cancel = function() {

    };

    return {
        initialize: initialize,
        step: step,
        cancel: cancel
    };
    
};

var timedAppear = function () {

    var target = null;
    var timeoutHandle = null;

    var initialize = function (element) {
        target = element;
        target.hide();

        var delay = target.data("animation-delay");
        timeoutHandle = setTimeout(fadeIn, delay);
    };

    var step = function () {
        return timeoutHandle != null;
    };

    var cancel = function () {
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
        }
    };

    var fadeIn = function () {
        target.fadeIn();
        timeoutHandle = null;
    };

    return {
        initialize: initialize,
        step: step,
        cancel: cancel
    };
};

p5.registerAnimations({
    "onebyone": onebyone,
    "timedAppear" : timedAppear
});

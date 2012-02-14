var completionSignal = function () {

    var deferred = $.Deferred();

    var complete = function () {
        $(window).unbind("killAnimations", complete);
        deferred.resolve();
    };

    $(window).bind("killAnimations", complete);

    return {
        complete: complete,
        promise: deferred.promise()        
    };
};

var onebyone = function (element) {

    var target = element;
    var signal = completionSignal();

    var step = function () {
        var hidden = target.children(".onebyone");
        hidden.first().removeClass("onebyone");
        if (hidden.length <= 1) {
            signal.complete();
        }
    };

    target.children().addClass("onebyone");

    return {
        step: step,
        done: signal.promise
    };
};

var timedAppear = function (element) {

    var target = element;
    var timeoutHandle = null;
    var signal = completionSignal();

    var step = function () {

    };

    var cleanup = function () {
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
        }
    };

    var fadeIn = function () {
        target.fadeIn();
        signal.complete();
    };

    var delay = target.data("animation-delay");
    target.hide();
    timeoutHandle = setTimeout(fadeIn, delay);
    signal.promise.always(cleanup);

    return {
        step: step,
        done: signal.promise
    };
};

p5.registerAnimations({
    "onebyone": onebyone,
    "timedAppear" : timedAppear
});

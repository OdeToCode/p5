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

    var cleanup = function () {
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
            timeoutHandle = null;
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
        step: function () { },
        done: signal.promise
    };
};

var zoomto = function (element) {
    var target = element;
    var signal = completionSignal();

    var zoomables = _.sortBy(
        target.children("[data-step]").toArray(),
            function (child) {
                return -($(child).data().step);
            }
    );

    var step = function () {
        var child = zoomables.pop();
        if (child) {
            var targetSize = $(child).attr("data-targetsize") || 0.9;
            $(child).zoomTo({targetsize: targetSize});
        }
        else {
            signal.complete();
        }
    };

    signal.promise.always(
        function () {
            $("body").zoomTo({ targetsize: 1.0 });
        }
    );

    return {
        step: step,
        done: signal.promise
    };
};

p5.registerAnimations({
    "onebyone": onebyone,
    "timedAppear": timedAppear,
    "zoomto" : zoomto
});

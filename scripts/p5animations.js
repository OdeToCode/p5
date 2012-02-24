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

var zoompan = function (element) {
    var target = element;
    var signal = completionSignal();
    var ratio = Math.PI / 180;

    var zoomables = target.children("[data-step]").toArray();
    zoomables = _.sortBy(zoomables, function (child) {
        return $(child).data().step;
    });

    var cleanup = function () {

    };

    var getTransformData = function (zoomable) {
        var data = $(zoomable).data();
        var transform = {
            scale: parseFloat(data.scale) || 1,
            rotateY: parseInt(data.rotatey) * ratio || 0,
            rotateX: parseInt(data.rotatex) * ratio || 0,
            rotateZ: parseInt(data.rotatez) * ratio || 0,
            translateX: parseInt(data.x) || 0,
            translateY: parseInt(data.y) || 0,
            translateZ: parseInt(data.z) || 0
        };
        return transform;
    };

    var positionZoomables = function () {
        _.each(zoomables, function (zoomable) {
            var transform = getTransformData(zoomable);
            $(zoomable).css({ position: "absolute" });
            $(zoomable).animate(transform);
        });
    };

    var step = function () {
        var child = zoomables.pop();
        var transform = getTransformData(child);

        target.animate({
            scale: 1 / transform.scale,
            rotateX: transform.rotateX,
            rotateY: transform.rotateY,
            rotateZ: transform.rotateZ,
            translateX: transform.translateX,
            translateY: transform.translateY,
            translateZ: transform.translateZ
        });

        if (zoomables.length < 1) {
            signal.complete();
        }
    };

    positionZoomables();
    signal.promise.always(cleanup);

    return {
        step: step,
        done: signal.promise
    };
};

p5.registerAnimations({
    "onebyone": onebyone,
    "timedAppear": timedAppear,
    "zoompan" : zoompan
});

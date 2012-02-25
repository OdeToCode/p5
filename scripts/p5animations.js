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

var zoomer = (function () {
    
    var currentScale = 1;

    return {
        'in': function (options) {
            if (currentScale !== 1) {
                zoomer.out();
                setTimeout(function () { zoomer["in"](options); }, 820);
                return;
            }
            options.x = options.x || 0;
            options.y = options.y || 0;

            var padding = 20;

            options.width = options.element.getBoundingClientRect().width + (padding * 2);
            options.height = options.element.getBoundingClientRect().height + (padding * 2);
            options.x = options.element.getBoundingClientRect().left - padding;
            options.y = options.element.getBoundingClientRect().top - padding;


            // If width/height values are set, calculate scale from those values
            if (options.width !== undefined && options.height !== undefined) {
                options.scale = Math.max(Math.min(window.innerWidth / options.width, window.innerHeight / options.height), 1);
            }

            if (options.scale > 1) {
                options.x *= options.scale;
                options.y *= options.scale;
            }
            var transform = {
                translateX: -options.x,
                translateY: -options.y,
                scale: options.scale
            };
            $(document.body).animate(transform);

            currentScale = options.scale;
            setTimeout(options.complete, 200);
        },

        'out': function () {
            $(document.body).animate({
                scale: 1, translateX: 0, translateY: 0
            });
            currentScale = 1;
        }
    };

})();


var zoompan = function (element) {
    var target = element;
    var signal = completionSignal();
    var ratio = Math.PI / 180;    

    var zoomables = _.sortBy(
        target.children("[data-step]").toArray(),
            function (child) {
                return -($(child).data().step);
            }
    );

    var zoomTo = function (zoomable) {
        var clientTransform = getTransformData(zoomable);

        zoomer["in"]({
            target: target,
            element: zoomable,
            rotate: clientTransform.rotateZ,
            complete: function () {
                $(zoomable).animate({ rotateZ: 0 });
            }
        });
    };

    var reset = function () {
        zoomer.out(target);
        $("footer").fadeIn();
    };

    var getTransformData = function (zoomable) {
        var data = $(zoomable).data();
        var transform = {
            scale: parseFloat(data.scale) || 1,
            rotateZ: parseInt(data.rotate) * ratio || 0,
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
        $("footer").fadeOut();
        var child = zoomables.pop();
        if (child) {
            zoomTo(child);
        }
        else {
            signal.complete();
        }
    };

    positionZoomables();
    signal.promise.always(reset);

    return {
        step: step,
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
            zoom["in"]({ element: child });
        }
        else {
            signal.complete();
        }
    };

    signal.promise.always(
        function () {
            zoom["out"]();
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
    "zoompan": zoompan,
    "zoomto" : zoomto
});

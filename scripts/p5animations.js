(function () {
    "using strict";

    var completionSignal = function () {

        var deferred = $.Deferred();

        var complete = function () {
            $(window).unbind("killAnimations", complete);
            deferred.resolve();
        };

        $(window).bind("killAnimations", complete);

        return {
            resolve: complete,
            promise: deferred.promise()
        };
    };

    // for demonstation purposes only
    var annoying = function (element) {       
        var signal = completionSignal();

        return {
            step: function () {
                alert(element.text());
                signal.resolve();
            },
            done: signal.promise
        };
    };

    var onebyone = function (element) {

        var target = element;
        var signal = completionSignal();

        var step = function () {
            var hidden = target.children(".onebyone");
            hidden.first().removeClass("onebyone");
            if (hidden.length <= 1) {
                signal.resolve();
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
            signal.resolve();
        };

        var delay = target.data("animation-delay");

        target.hide();
        timeoutHandle = setTimeout(fadeIn, delay);
        signal.promise.always(cleanup);

        return {
            step: function () {
            },
            done: signal.promise
        };
    };

    var zoom = function (element) {
        var target = element;
        var signal = completionSignal();

        var zoomables = _.sortBy(
            target.children("[data-zoom-step]"),
            function (child) {
                return -($(child).data().zoomStep);
            }
        );

        var step = function () {
            var child = $(zoomables.pop());
            if (child.length > 0) {
                child.zoomTo(child.data());
            } else {
                signal.resolve();
            }
        };

        var reset = function () {
            $("body").zoomTo({ targetsize: 1.0 });
        };

        signal.promise.always(reset);

        return {
            step: step,
            done: signal.promise
        };
    };

    var addclass = function (element) {
        var target = element;
        var signal = completionSignal();

        var children = _.sortBy(
            target.children("[data-addclass-step]"),
            function (child) {
                $(child).addClass("transitionable");
                return -($(child).data().addclassStep);
            }
        );

        var step = function () {
            var child = $(children.pop());
            if (child.length > 0) {
                var classes = child.data().addclass.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    if (!child.hasClass(classes[i])) {
                        child.addClass(classes[i]);
                        if (i < classes.length - 1) {
                            children.push(child);
                            break;
                        }
                    }
                }
            }
            if (children.length == 0) {
                signal.resolve();
            }
        };

        var reset = function () {
            $("body").zoomTo({ targetsize: 1.0 });
        };

        signal.promise.always(reset);

        return {
            step: step,
            done: signal.promise
        };
    };

    p5.registerAnimations({
        "onebyone": onebyone,
        "timedAppear": timedAppear,
        "zoom": zoom,
        "addclass": addclass,
        "alert": annoying
    });
})();
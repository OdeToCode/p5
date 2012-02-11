var p5 = function () {
    "use strict";

    var start = function () {
        setFirstVisibleSlide();
        $(window).bind("keydown", keyDown);
    };

    var setFirstVisibleSlide = function () {
        $("section").first().addClass("current");
    };

    var keyDown = function (event) {

        var handler = keys[event.keyCode];
        if (handler) {
            event.preventDefault();
            handler.action();
        }
    };

    var moveForward = function () {
        var current = $("section.current");
        var next = current.next();
        if (next.length) {
            current.removeClass("current");
            next.addClass("current");
        }
    };

    var moveBackward = function () {
        var current = $("section.current");
        var prev = current.prev();
        if (prev.length) {
            current.removeClass("current");
            prev.addClass("current");
        }
    };

    var moveFirst = function () {
        $("section.current").removeClass("current");
        $("section").first().addClass("current");
    };

    var moveLast = function () {
        $("section.current").removeClass("current");
        $("section").last().addClass("current");
    };

    var keys = {
        39: { name: "rightArrow", action: moveForward },
        40: { name: "downArrow", action: moveForward },
        34: { name: "pageDown", action: moveForward },
        32: { name: "space", action: moveForward },
        37: { name: "leftArrow", action: moveBackward },
        38: { name: "upArrow", action: moveBackward },
        33: { name: "pageUp", action: moveBackward },
        36: { name: "home", action: moveFirst },
        35: { name: "end", action: moveLast }
    };

    return {
        start: start
    };

} ();

p5.start();

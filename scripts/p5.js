var p5 = function () {
    "use strict";

    var start = function () {
        assignSlideIdentifiers();
        setFirstVisibleSlide();

        $(window).bind("keydown", onKeyDown)
                 .bind("hashchange", hashChange);

    };

    var hashChange = function () {
        moveTo(window.location.hash.slice(1));
    };

    var assignSlideIdentifiers = function () {
        $("section").each(function (index) {
            var slide = $(this);
            slide.data("id", index);
        });
    };

    var setFirstVisibleSlide = function () {
        if (window.location.hash) {
            moveTo(window.location.hash.slice(1));
        }
        else {
            $("section").first().addClass("current");
            updateHistory();
        }
    };

    var moveTo = function (id) {
        $("section.current").removeClass("current");
        $("section").filter(function () {
            return $(this).data("id") == id;
        }).addClass("current");
    };

    var updateHistory = function () {
        var id = $("section.current").data("id");
        window.history.pushState(
            { "id": id }, id, "#" + id
        );
    };

    var onKeyDown = function (event) {

        var handler = keys[event.keyCode];
        if (handler) {
            event.preventDefault();
            handler.action();
            updateHistory();
        }
    };        

    var moveTo = function (id) {
        $("section.current").removeClass("current");
        $("section").filter(function () {
            return $(this).data("id") == id;
        }).addClass("current");
    };

    var moveForward = function () {
        var current = $("section.current");
        var next = current.next("section");
        if (next.length) {
            current.removeClass("current");
            next.addClass("current");
        }
    };

    var moveBackward = function () {
        var current = $("section.current");
        var prev = current.prev("section");
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

$(function() {
    p5.start();
});
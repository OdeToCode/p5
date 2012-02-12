var p5 = function () {
    "use strict";

    var start = function () {
        assignSlideIdentifiers();
        setFirstVisibleSlide();

        $(window).bind("keydown", onKeyDown)
                 .bind("hashchange", hashChange);
    };

    var registerAnimations = function (newAnimations) {
        $.extend(animations, newAnimations);
    };

    var assignSlideIdentifiers = function () {
        slides().each(function (index) {
            var slide = $(this);
            slide.data("id", index);
        });
    };

    var setFirstVisibleSlide = function () {
        if (window.location.hash) {
            setCurrentSlide(slideById(window.location.hash.slice(1))); 
        }
        else {
            setCurrentSlide(slides().first());
        }
    };

    var updateHistory = function (slide) {
        var id = slide.data("id");
        window.history.pushState(
            { "id": id }, id, "#" + id
        );
    };

    var onKeyDown = function (event) {

        var handler = keys[event.keyCode];
        if (handler) {
            event.preventDefault();
            handler.action();
        }
    };

    var hashChange = function () {
        moveTo(window.location.hash.slice(1));
    };

    var moveForward = function () {
        setCurrentSlide(nextSlide());
    };

    var moveBackward = function () {
        setCurrentSlide(previousSlide());
    };

    var moveFirst = function () {
        setCurrentSlide(slides().first());
    };

    var moveLast = function () {
        setCurrentSlide(slides().last());
    };
               
    var setCurrentSlide = function (slide) {
        if (slide.length > 0) {
            slides().removeClass("current");
            slide.addClass("current");
            updateHistory(slide);
        }
    };

    var slides = function () {
        return $("section");
    };

    var nextSlide = function () {
        return $("section.current").next("section");
    };

    var previousSlide = function () {
        return $("section.current").prev("section");
    };

    var slideById = function (id) {
        return slides().filter(function () {
            return $(this).data("id") == id;
        });
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

    var animations;

    return {
        start: start,
        registerAnimations: registerAnimations
    };

} ();

$(function() {
    p5.start();
});
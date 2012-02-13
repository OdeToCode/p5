var p5 = function () {
    "use strict";

    var start = function () {
        assignSlideIdentifiers();
        setFirstVisibleSlide();

        $(window).bind("keydown", onKeyDown)
                 .bind("hashchange", hashChange);
    };

    var stop = function () {
        killAnimations();
        $(window).unbind("keydown", onKeyDown)
                 .unbind("hashchange", hashChange);
    };

    var registerAnimations = function (newAnimations) {
        $.extend(registeredAnimations, newAnimations);
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
        } else {
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
        if (stepAnimation()) {
            return;
        }
        setCurrentSlide(nextSlide());
    };

    var moveTo = function (id) {
        killAnimations();
        setCurrentSlide(slideById(id));
    };

    var moveBackward = function () {
        killAnimations();
        setCurrentSlide(previousSlide());
    };

    var moveFirst = function () {
        killAnimations();
        setCurrentSlide(slides().first());
    };

    var moveLast = function () {
        killAnimations();
        setCurrentSlide(slides().last());
    };

    var setCurrentSlide = function (slide) {
        if (slide.length > 0) {
            slides().removeClass("current");
            slide.addClass("current");
            updateHistory(slide);
            startAnimations(slide);
        }
    };

    var startAnimations = function (slide) {
        $("[data-animation]", slide).add(slide).each(function () {
            var animation = extractAnimation($(this));
            if (animation) {
                animation.initialize($(this));
                currentAnimations.push(animation);
            }
        });
    };

    var extractAnimation = function (element) {
        var name = element.data("animation");
        if (name) {
            var factory = registeredAnimations[name];
            if (factory) {
                return factory();
            }
        }
        return null;
    };

    var stepAnimation = function () {
        var stepped = false;
        if (currentAnimations.length > 0) {
            stepped = runStep();
        }
        return stepped;
    };

    var runStep = function () {
        var animation = currentAnimations[0];
        if (animation) {
            var more = animation.step();
            if (!more) {
                if (animation.cancel) {
                    animation.cancel();
                }
                currentAnimations.pop();
            }
            return more;
        }
        return false;
    };

    var killAnimations = function () {
        $(currentAnimations).each(function () {
            if (this.cancel) {
                this.cancel();
            }
        });
        currentAnimations = [];
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

    var registeredAnimations = {};
    var currentAnimations = [];

    return {
        start: start,
        stop: stop,
        registerAnimations: registerAnimations
    };

} ();

$(function () {
    p5.start();
});
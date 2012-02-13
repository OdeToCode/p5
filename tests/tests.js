module("navigation", {
    setup: function () {        
        p5.start();
    },
    teardown: function () {
        p5.stop();
    }
});

test("Sets first slide as start slide", function () {
    ok($("#slide1").hasClass("current"));    
});

test("Moves to next slide on right arrow", function () {    
    $(window).trigger(rightArrow());
    ok($("#slide2").hasClass("current"));
});

test("Doesn't move past last slide", function () {
    $(window).trigger(rightArrow());
    $(window).trigger(rightArrow());
    $(window).trigger(rightArrow());
    $(window).trigger(rightArrow());
    ok($("#slide3").hasClass("current"));
});

test("Moves to previous slide on left arrow", function() {
    $(window).trigger(rightArrow());
    $(window).trigger(leftArrow());
    ok($("#slide1").hasClass("current"));
});

test("Moves to first slide on home", function() {
    $(window).trigger(rightArrow());
    $(window).trigger(home());
    ok($("#slide1").hasClass("current"));
});

test("Moves to last slide on end", function () {    
    $(window).trigger(end());
    ok($("#slide3").hasClass("current"));
});

var rightArrow = function () {
    var event = new $.Event("keydown");
    event.keyCode = 39;
    return event;
};

var leftArrow = function() {
    var event = new $.Event("keydown");
    event.keyCode = 37;
    return event;
};

var home = function() {
    var event = new $.Event("keydown");
    event.keyCode = 36;
    return event;
};

var end = function() {
    var event = new $.Event("keydown");
    event.keyCode = 35;
    return event;
};

(function () {

    window.history.pushState = function(x,y,z) {

    };

})(p5);
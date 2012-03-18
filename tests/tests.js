var testEnvironment = {    
    setup: function () {
        $("#qunit-fixture").append("<section id='slide1'></section>" +
                                    "<section id='slide2'></section>" +
                                    "<section id='slide3'></section>");
        p5.start();
    },

    teardown: function () {
        p5.stop();
    }
};

module("navigation", testEnvironment);
    
test("Sets first slide as start slide", function () {
    ok($("#slide1").hasClass("current"));    
});

test("Moves to next slide on right arrow", function () {    
    $(window).trigger(rightArrow());
    ok($("#slide2").hasClass("current"));
});

test("Moves to next slide on enter", function () {
    $(window).trigger(enter()); ;
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

module("History", testEnvironment);

test("Pushes state on move", function () {
    $(window).trigger(rightArrow());
    strictEqual(lastState.url, "#1");
});

var animTestEnvironment = {
    setup: function () {
        $("#qunit-fixture").append("<section id='slide1'></section>" +
                                    "<section id='slide2' data-animation='testanimation'></section>" +
                                    "<section id='slide3'></section>");
        p5.start();
    },

    teardown: function () {
        p5.stop();
    }
};

module("Animation", animTestEnvironment);

test("Steps animation with right arrow", function () {
    $(window).trigger(rightArrow());
    $(window).trigger(rightArrow());
    ok(lastAnimation.getState().stepCount == 1);
});

test("Cancels animation on left arrow", function () {
    $(window).trigger(rightArrow());
    $(window).trigger(rightArrow());
    $(window).trigger(leftArrow());
    ok(lastAnimation.getState().isCancelled);
});

test("Resolved when stepping stops", function () {
    $(window).trigger(rightArrow());
    $(window).trigger(rightArrow());
    $(window).trigger(rightArrow());
    $(window).trigger(rightArrow());
    ok(lastAnimation.getState().isResolved);
});

test("Moves to next slide when animation complete", function () {
    $(window).trigger(rightArrow());
    $(window).trigger(rightArrow());
    $(window).trigger(rightArrow());
    $(window).trigger(rightArrow());
    $(window).trigger(rightArrow());
    ok($("#slide3").hasClass("current"));
});

module("array remove test");

test("Can remove object reference from Array", function () {
    var o1 = {};
    var o2 = {};
    var o3 = {};
    var array = [o1, o2, o3];

    array.remove(o2);
    ok(array.length == 2);
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

var enter = function () {
    var event = new $.Event("keydown");
    event.keyCode = 13;
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

var lastState = null;

window.history.pushState = function(data, title, url) {
    lastState = {
            data:data,
            title:title,
            url:url
    };
};

var lastAnimation = null;

var testAnimation = function () {

    var stepCount = 0;
    var isCancelled = false;
    var deferred = $.Deferred();

    var complete = function () {
        $(window).unbind("killAnimations", complete);
        isCancelled = true;
        deferred.resolve();
    };

    $(window).bind("killAnimations", complete);

    lastAnimation = {
        done: deferred.promise(),
        step: function () {
            stepCount++;
            if (stepCount >= 3) {
                deferred.resolve();
            }
        },                
        getState: function () {
            return {                
                stepCount: stepCount,
                isCancelled: isCancelled,
                isResolved: deferred.isResolved()
            };
        }
    };

    return lastAnimation;
};

p5.registerAnimations({
    testanimation: testAnimation
});
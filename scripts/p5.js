var p5 = function () {
    "use strict";

    var start = function () {        
        setFirstVisibleSlide();
    };

    var setFirstVisibleSlide = function () {
        $("section").first.css("current");
    };

    return {
        start: start
    };

} ();


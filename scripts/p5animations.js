var onebyone = (function () {

    var target = null;

    var initialize = function (element) {
        target = element;
        target.children().addClass("onebyone");
    };

    var step = function () {
        var hidden = target.children(".onebyone");
        hidden.first().removeClass("onebyone");
        return hidden.length > 0;
    };

    var cancel = function() {

    };

    return {
        initialize: initialize,
        step: step,
        cancel: cancel
    };
    
})();

p5.registerAnimations({
    "onebyone": onebyone
});

// todo: remove after explaining what not to do
//var Animation = function (stepFunction) {
//    var deferred = $.Deferred();
//    this.step = function () {
//        if (!stepFunction()) {
//            deferred.resolve();
//            return false;
//        }
//        return true;
//    };
//    this.promise = deferred.promise();
//    this.cancel = function () {
//        deferred.resolve();
//    };
//};
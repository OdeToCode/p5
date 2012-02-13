(function (p5) {

    var Animation = function (stepFunction) {
        var deferred = $.Deferred();
        this.step = function () {
            if (!stepFunction()) {
                deferred.resolve();
                return false;
            }
            return true;
        };
        this.promise = deferred.promise();
        this.cancel = function () {
            deferred.resolve();
        };
    };

    var onebyone = function (target) {

        target.children().addClass("onebyone");
        var step = function () {
            var hidden = target.children(".onebyone");
            hidden.first().removeClass("onebyone");
            if (hidden.length > 1) {
                return true;
            }
            return false;
        };

        return new Animation(step);
    };

    p5.registerAnimations({
        "onebyone": onebyone
    });

})(p5);

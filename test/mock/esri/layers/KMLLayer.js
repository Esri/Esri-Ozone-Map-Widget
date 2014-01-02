define(function() {
    return function(){
        this.getLayers = function() {
            return [{
                fullExtent: {
                    name: "mockExtent",
                    getCenter: function(){}
                }
            }];
        };

        this.hide = function() {};

        this.on = function(){};

        this.show = function() {};

    };
});
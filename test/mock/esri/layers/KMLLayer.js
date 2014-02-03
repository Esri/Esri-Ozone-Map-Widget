define(function() {
    return function(){
        this.getLayers = function() {
            return [{
                fullExtent: {
                    name: "mockExtent",
                    getCenter: function(){}
                },
                id: "mockObject - ID"
            }];
        };

        this.hide = function() {};

        this.on = function(){};

        this.show = function() {};

    };
});
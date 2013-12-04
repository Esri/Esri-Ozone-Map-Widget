define(function() {
    var Map = function() {
        this.geographicExtent = {
            xmin: 0,
            ymin: 0,
            xmax: 2,
            ymax: 2,
            getCenter: function() {
                return {x: 1, y: 1};
            }
        };

        this.getScale = function() {
            return 2;
        };

        this.on = function() {

        }
    };

    return Map;
});
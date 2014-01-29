define(function() {
    var Map = function() {
        this.addLayer = function() {};

        this.addLayers = function() {};

        this.centerAt = function() {};

        this.geographicExtent = {
            xmin: 0,
            ymin: 0,
            xmax: 2,
            ymax: 2,
            getCenter: function() {
                return {x: 1, y: 1};
            },
            spatialReference: {
                _getInfo: function() {}
            }
        };

        this.getScale = function() {
            return 2;
        };

        this.setScale = function() {};

        this.getZoom = function() {
            return this.zoom;
        };

        this.setZoom = function(zoom) {
            this.zoom = zoom;
        };

        this.getMaxZoom = function() {
            return this.zoom;
        };

        this.on = function() {};

        this.removeLayer = function(){};

        this.setExtent = function(){};
    };

    return Map;
});
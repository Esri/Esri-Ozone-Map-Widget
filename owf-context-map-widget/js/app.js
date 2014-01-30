
require([
    "esri/map", "esri/toolbars/draw", "esri/geometry/webMercatorUtils", "cmwapi/cmwapi", "dojo/domReady!"],
    function(Map, Draw, webMercatorUtils, CommonMapApi) {
        var map = new Map("mapDiv", {
            center: [-77.035841, 38.901721],
            zoom: 1,
            basemap: "streets",
            slider:false
        });

        var sendClickEvent = function(e) {
            var locationEvent = {};
            locationEvent.location = {lat: e.mapPoint.getLatitude(), lon: e.mapPoint.getLongitude()};
            CommonMapApi.view.center.location.send(locationEvent);
        };

        var sendDragEvent = function(e) {
            var locationEvent = {};
            locationEvent.bounds = {};
            var extent = webMercatorUtils.webMercatorToGeographic(e.geometry);
            locationEvent.bounds.southWest = {lat: extent.ymin, lon: extent.xmin};
            locationEvent.bounds.northEast = {lat: extent.ymax, lon: extent.xmax};
            locationEvent.zoom = 'auto';
            CommonMapApi.view.center.bounds.send(locationEvent);
        };

        var initMap = function() {
            map.disableMapNavigation();
            map.enableRubberBandZoom();
            map.setMapCursor("crosshair");
            var draw = new Draw(map, { showTooltips: false });
            draw.activate(esri.toolbars.Draw.EXTENT);
            if (OWF.Util.isRunningInOWF()) {
                OWF.ready(function () {
                    OWF.notifyWidgetReady();
                    map.on('dbl-click', sendClickEvent);
                    map.on('click', sendClickEvent);
                    draw.on('draw-end', sendDragEvent);
                });
            }
        };

        map.on('load', initMap);
    }
);

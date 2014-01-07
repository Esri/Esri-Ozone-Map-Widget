// Entry point for map webapp
//
// NOTE: Modules that are not compatible with asynchronous module loading
// (AMD) are included in the webapp's HTML file to prevent issues.
require([
    "models/map", "models/overlayManager", "models/basemapGallery", "esri/dijit/Scalebar","dojo/json", "esri/dijit/Geocoder",
    "esri/layers/KMLLayer","esri/arcgis/utils","dojo/parser","dojo/dom-style",
     /*"OWFWidgetExtensions/owf-widget-extended",*/ "dojo/domReady!"],
    function(Map, OverlayManager, BasemapGallery,Scalebar, JSON, Geocoder, KMLLayer, arcgisUtils, parser,
        domStyle, cmwapiAdapter, Graphic, PictureMarkerSymbol, Point) {

        var map = new Map("map", {
            center: [-76.809469, 39.168101],
            zoom: 7,
            basemap: "streets"
        });

        var geocoder = new Geocoder({
                map: map
            }, "search");
        geocoder.startup();

        var basemapGallery = new BasemapGallery({
                showArcGISBasemaps: true,
                map: map
        }, "basemapGallery");

        new Scalebar({ map:map, attachTo:"bottom-left", scalebarUnit: "dual" });

        if (OWF.Util.isRunningInOWF()) {
            OWF.ready(function () {
                OWF.notifyWidgetReady();
                var overlayManager = new OverlayManager(map);
                $('#map').on('mouseup', function() {
                    $('#popover_overlay_wrapper').hide();
                    $('#popover_content_wrapper').hide();
                    $('#basemaps').removeClass('selected');
                    $('#overlay').removeClass('selected');
                });
                $('#overlay').on('click', overlayManager.toggleOverlayManager);
                $('#basemaps').on('click', basemapGallery.toggleBasemapGallery);
                $("[rel=tooltip]").tooltip({ placement: 'bottom'});
           });
        }
    });
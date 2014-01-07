// Entry point for map webapp
//
// NOTE: Modules that are not compatible with asynchronous module loading
// (AMD) are included in the webapp's HTML file to prevent issues.
require([
    "models/map", "models/overlayManager", "esri/dijit/Scalebar","dojo/json", "esri/dijit/Geocoder",
    "esri/layers/KMLLayer","esri/dijit/BasemapGallery","esri/arcgis/utils","dojo/parser","dojo/dom-style",
     /*"OWFWidgetExtensions/owf-widget-extended",*/ "dojo/domReady!"],
    function(Map, OverlayManager, Scalebar, JSON, Geocoder, KMLLayer, BasemapGallery, arcgisUtils, parser,
        domStyle, cmwapiAdapter, Graphic, PictureMarkerSymbol, Point) {
        var map = new Map("map", {
            center: [-76.809469, 39.168101],
            zoom: 7,
            basemap: "streets"
        });
    if (OWF.Util.isRunningInOWF()) {

        OWF.ready(function () {
            OWF.notifyWidgetReady();

            var geocoder = new Geocoder({
                map: map
            }, "search");
            geocoder.startup();

            var basemapGallery = new BasemapGallery({
                showArcGISBasemaps: true,
                map: map
            }, "basemapGallery");
            basemapGallery.startup();

            basemapGallery.on("error", function(msg) {
                console.log("basemap gallery error:  ", msg);
            });

            var overlayManager = new OverlayManager(map);

            new Scalebar({
                map:map,
                attachTo:"bottom-left",
                scalebarUnit: "dual"
            });

            var toggleBaseMaps = function() {
                $('#popover_content_wrapper').toggle();
                $('#overlay').removeClass('selected');
                $('#popover_overlay_wrapper').hide();
                $('#basemaps').toggleClass('selected');
            };

            var addButtonHandlers = function() {
                $('#map').on('mouseup', function() {
                    $('#popover_overlay_wrapper').hide();
                    $('#popover_content_wrapper').hide();
                    $('#basemaps').removeClass('selected');
                    $('#overlay').removeClass('selected');
                });
                $('#overlay').on('click', overlayManager.toggleOverlayManager);
                $('#basemaps').on('click', toggleBaseMaps);
                $("[rel=tooltip]").tooltip({ placement: 'bottom'});
            }();
       });
    }
    });
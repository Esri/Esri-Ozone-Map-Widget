/**
 * Defines a map object for this webapp.
 * @module
 */
define(["dojo/_base/declare", "esri/map", "esri/tasks/locator", "esri/graphic",
        "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/Font", "esri/symbols/TextSymbol", "dojo/_base/Color"],
        function(declare, BaseMap, Locator, Graphic,
                 InfoTemplate, SimpleMarkerSymbol, 
                 Font, TextSymbol, Color) {
    var Map = declare(BaseMap, /** @lends Map.prototype */ {
        /**
         * Create a new map instance.
         * @constructs
         * @param {string} divId - Identifier for DIV to bind map to.
         * @param {object} options - Initialization options. See esri/map
         * constructor for more information.
         */
        constructor: function(divId, options) {
            var locatorUrl = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

            if (window.location.protocol != "file:") {
                // Match same protocol as page to avoid mixed content issues
                locatorUrl = locatorUrl.replace("http://",
                    window.location.protocol + "//");
            }

            this.locator = new Locator(locatorUrl);
        },
        /**
         * Returns a dojo.Deferred that will receive a list of candidates on
         * successful completion
         */
        addressToLocations: function(freeFormAddress, inCurrentExtent) {
            var params = { address: { "SingleLine": freeFormAddress } };

            if (inCurrentExtent) {
                params.searchExtent = this.extent;
            }

            this.locator.outSpatialReference = this.spatialReference;

            return this.locator.addressToLocations(params);
        },
        /**
         * Add a market to the map. Uses the same argument format as the OWF
         * Google Maps sample widget: obj must have an 'address' property
         * which is a free form string.
         */
        placeMarker: function(obj) {
            var me = this;

            me.addressToLocations(obj.address).then(function(candidates) {
                if (candidates.length > 0) {
                    var loc = candidates[0].location;
                    console.log("Found " + loc.x + ", " + loc.y);

                    var symbol = new SimpleMarkerSymbol();
                    var infoTemplate = new InfoTemplate(
                        "Location",
                        "Address: ${address}<br />Score: ${score}");

                    symbol.setStyle(SimpleMarkerSymbol.STYLE_SQUARE);
                    symbol.setColor(new Color([153, 0, 51, 0.75]));

                    var attributes = {
                        address: candidates[0].address,
                        score: candidates[0].score
                    };

                    var geometry = candidates[0].location;
                    var graphic = new Graphic(geometry, symbol, attributes, infoTemplate);

                    me.graphics.add(graphic);

                    var displayText = candidates[0].address;

                    var font = new Font(
                        "10pt",
                        Font.STYLE_NORMAL,
                        Font.VARIANT_NORMAL,
                        Font.WEIGHT_BOLD,
                        "Helvetica");

                    var textSymbol = new TextSymbol(
                        displayText,
                        font,
                        new Color("#666633"));

                    textSymbol.setOffset(0, 8);
                    me.graphics.add(new Graphic(geometry, textSymbol));

                    me.centerAndZoom(geometry, 15);
                }
            });
        }
    });

    return Map;
});

/**
 * Defines a map object for this webapp.
 * @module
 */
define(["dojo/_base/declare", "esri/map", "esri/tasks/locator", "esri/graphic",
        "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/Font", "esri/symbols/TextSymbol", "dojo/_base/Color"],
        function(declare, MapBase, Locator, Graphic,
                 InfoTemplate, SimpleMarkerSymbol, 
                 Font, TextSymbol, Color) {
    /**
     * Create a new map instance.
     * @class Map
     * @classdesc Wrapper for ESRI map object.
     * @param {string} divId - Identifier for DIV to bind map to.
     * @param {object} options - Initialization options. See esri/map
     * constructor for more information.
     */
    return declare(MapBase, /** @lends Map.prototype */ {
        // The description for this constructor is above (to prevent
        // duplicate entries for this class from appearing in the output
        // jsdocs). The block above seems to be the only way to get a class
        // description in the output.
        constructor: function(divId, options) {
            var locatorUrl = "http://geocode.arcgis.com/arcgis/rest/" +
                             "services/World/GeocodeServer";

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
         * @param {string} freeFormAddress - Free form address.
         * @param {boolean} inCurrentExtent - Set true to limit results to
         * current map extent.
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
         * Add a marker to the map. Uses the same argument format as the OWF
         * 7 Google Maps sample widget.
         * @param {object} obj - Must have an <b>address</b> property which
         * is a free form string. The <b>name</b> and <b>phoneNumber</b>
         * properties are optional.
         */
        placeMarker: function(obj) {
            var me = this;

            me.addressToLocations(obj.address).then(function(candidates) {
                if (candidates.length > 0) {
                    var symbol = new SimpleMarkerSymbol();
                    var infoTemplate = new InfoTemplate(
                        (obj.name) ? obj.name : "Location",
                        "<div>${address}</div>" +
                        ((obj.phoneNumber) ?
                            '<br /><div><a href="tel:+${phoneNumber}">${phoneNumber}</a></div>' : "")
                        + "<br /><div>Score: ${score}</div>");

                    symbol.setStyle(SimpleMarkerSymbol.STYLE_SQUARE);
                    symbol.setColor(new Color([153, 0, 51, 0.75]));

                    var attributes = {
                        address: candidates[0].address,
                        score: candidates[0].score
                    };

                    if (obj.phoneNumber) {
                        attributes.phoneNumber = obj.phoneNumber;
                    }

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
                } else {
                    console.log("Failed to find location for address: " +
                                obj.address);
                }
            });
        }
    });
});

// Wrapper for ESRI map object
define(["esri/map", "esri/tasks/locator", "esri/graphic",
        "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/Font", "esri/symbols/TextSymbol", "dojo/_base/Color"],
        function(Map, Locator, Graphic,
                 InfoTemplate, SimpleMarkerSymbol, 
                 Font, TextSymbol, Color) {
    return Backbone.Model.extend({
        defaults: {
            map: null, // Instance of underlying ESRI map object
            locator: null
        },
        initialize: function(divName) {
            var map = new Map(divName, {
                center: [-56.049, 38.485],
                zoom: 3,
                basemap: "streets"
            });

            this.set({map: map});

            var locatorUrl = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

            if (window.location.protocol != "file:") {
                // Match same protocol as page to avoid mixed content issues
                locatorUrl = locatorUrl.replace("http://",
                    window.location.protocol + "//");
            }

            this.set({locator: new Locator(locatorUrl)});
        },
        // Returns a dojo.Deferred that will receive a list of candidates on
        // successful completion
        addressToLocations: function(freeFormAddress, inCurrentExtent) {
            var params = { address: { "SingleLine": freeFormAddress } };

            if (inCurrentExtent) {
                params.searchExtent = this.get("map").extent;
            }

            this.get("locator").outSpatialReference = this.get("map").spatialReference;

            return this.get("locator").addressToLocations(params);
        },
        // Add a market to the map. Uses the same argument format as the OWF
        // Google Maps sample widget: obj must have an 'address' property
        // which is a free form string.
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

                    me.get("map").graphics.add(graphic);

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
                    me.get("map").graphics.add(new Graphic(geometry, textSymbol));

                    me.get("map").centerAndZoom(geometry, 20);
                }
            });
        }
    });
});

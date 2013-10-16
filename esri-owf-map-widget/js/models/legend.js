define(["esri/dijit/Legend", "dojo/_base/connect"], function(Legend, Connect) {
    return Backbone.Model.extend({
        // Create a legend for a particular map
        initialize: function(map, divName) {
            var esriMap = map.get("map");

            Connect.connect(esriMap, "onLoad", function(theMap) {
                var legend = new Legend({
                    map: esriMap
                }, divName);

                legend.startup();
            });
        }
    });
});

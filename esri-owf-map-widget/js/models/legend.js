define(["dojo/_base/declare", "esri/dijit/Legend", "dojo/_base/connect"],
       function(declare, Legend, Connect) {
    var LegendExtension = declare(Legend, {
    });

    // Create a legend on a particular map. The legend will not load until
    // the map is ready.
    LegendExtension.createForMap = function(map, divId) {
        Connect.connect(map, "onLoad", function(theMap) {
            var legend = new LegendExtension({
                    map: map
                }, divId);

            legend.startup();
        });
    }

    return LegendExtension;
});

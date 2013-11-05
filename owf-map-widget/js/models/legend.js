/**
 * Defines a legend object for this webapp.
 * @module
 */
define(["dojo/_base/declare", "esri/dijit/Legend", "dojo/_base/connect"],
       function(declare, BaseLegend, Connect) {
    /**
     * Create a new legend instance.
     * @class Legend
     * @classdesc Wrapper for ESRI legend object.
     * @param {object} params - Initialization parameters. Must include a
     * <b>map</b> property.
     * @param {string} divId - Identifier for DIV to bind legend to.
     */
    var Legend = declare(BaseLegend, {
    });

    /**
     * Create a legend on a particular map. The legend will not load until
     * the map is ready.
     * @memberof Legend
     * @param {map} map - Map object this legend will be bound to.
     * @param {string} divId - Identifier for DIV to bind legend to.
     */
    Legend.createForMap = function(map, divId) {
        Connect.connect(map, "onLoad", function(theMap) {
            var legend = new Legend({
                    map: map
                }, divId);

            legend.startup();
        });
    }

    return Legend;
});


define(["cmwapi/Channels"], 
    function(Channels) {

    /**
     * Defines a convenience module for handling all the map.feature interactions according to the CMW API 1.1 specification.
     *
     * @exports cmwapi/map/Feature
     */
    var Feature = {

        /**
         * @see module:cmwapi/map/feature/Plot
         */
        plot : {
            addHandler : function(func) {},
            removeHandlers : function() {},
            send : function(data) {}
        },
        /**
         * @see module:cmwapi/map/feature/PlotURL
         */
        plotURL: {
            addHandler : function(func) {},
            removeHandlers : function() {},
            send : function(data) {}
        },
        /**
         * @see module:cmwapi/map/feature/Unplot
         */
        unplot: {
            addHandler : function(func) {},
            removeHandlers : function() {},
            send : function(data) {}
        },
        /**
         * @see module:cmwapi/map/feature/Hide
         */
        hide: {
            addHandler : function(func) {},
            removeHandlers : function() {},
            send : function(data) {}
        },
        /**
         * @see module:cmwapi/map/feature/Show
         */
        show: {
            addHandler : function(func) {},
            removeHandlers : function() {},
            send : function(data) {}
        },
        /**
         * @see module:cmwapi/map/feature/FeatureSelected
         */
        featureSelected: {
            addHandler : function(func) {},
            removeHandlers : function() {},
            send : function(data) {}
        },
        /**
         * @see module:cmwapi/map/feature/Update
         */
        update: {
            addHandler : function(func) {},
            removeHandlers : function() {},
            send : function(data) {}
        }
    };

    return Feature;
});

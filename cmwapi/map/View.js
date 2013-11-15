
define(["cmwapi/Channels"], 
    function(Channels) {

    /**
     * Defines a convenience module for handling all the map.view interactions according to the CMW API 1.1 specification.
     *
     * @exports cmwapi/map/View
     */
    var View = {

        /**
         * @see module:cmwapi/map/view/Zoom
         */
        zoom : {
            addHandler : function(func) {},
            removeHandlers : function() {},
            send : function(data) {}
        },
        center : {
            /**
             * @see module:cmwapi/map/view/CenterOverlay
             */
            overlay: {
                addHandler : function(func) {},
                removeHandlers : function() {},
                send : function(data) {}
            },
            /**
             * @see module:cmwapi/map/view/CenterFeature
             */
            feature: {
                addHandler : function(func) {},
                removeHandlers : function() {},
                send : function(data) {}
            },
            /**
             * @see module:cmwapi/map/view/CenterLocation
             */
            location: {
                addHandler : function(func) {},
                removeHandlers : function() {},
                send : function(data) {}
            },
            /**
             * @see module:cmwapi/map/view/CenterBounds
             */
            bounds: {
                addHandler : function(func) {},
                removeHandlers : function() {},
                send : function(data) {}
            }
        },
        
        /**
         * @see module:cmwapi/map/view/Clicked
         */
        clicked: {
            addHandler : function(func) {},
            removeHandlers : function() {},
            send : function(data) {}
        }
    };

    return View;
});

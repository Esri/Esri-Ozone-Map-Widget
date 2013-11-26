
define(["cmwapi/Channels", "cmwapi/map/view/Zoom", "cmwapi/map/view/CenterOverlay",
    "cmwapi/map/view/CenterFeature", "cmwapi/map/view/CenterLocation",
    "cmwapi/map/view/CenterBounds", "cmwapi/map/view/Clicked"], 
    function(Channels, Zoom, CenterOverlay, CenterFeature, CenterLocation,
        CenterBounds, Clicked) {

    /**
     * Defines a convenience module for handling all the map.view interactions according to the CMW API 1.1 specification.
     *
     * @exports cmwapi/map/View
     */
    var View = {

        /**
         * @see module:cmwapi/map/view/Zoom
         */
        zoom : Zoom,
        center : {
            /**
             * @see module:cmwapi/map/view/CenterOverlay
             */
            overlay: CenterOverlay,
            /**
             * @see module:cmwapi/map/view/CenterFeature
             */
            feature: CenterFeature,
            /**
             * @see module:cmwapi/map/view/CenterLocation
             */
            location: CenterLocation,
            /**
             * @see module:cmwapi/map/view/CenterBounds
             */
            bounds: CenterBounds
        },
        
        /**
         * @see module:cmwapi/map/view/Clicked
         */
        clicked: Clicked
    };

    return View;
});

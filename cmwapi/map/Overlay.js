
define(["cmwapi/Channels", "cmwapi/map/overlay/Create", "cmwapi/map/overlay/Remove",
    "cmwapi/map/overlay/Hide", "cmwapi/map/overlay/Show", "cmwapi/map/overlay/Update"], 
    function(Channels, Create, Remove, Hide, Show, Update) {

    /**
     * Defines a convenience module for handling all the map.overlay interactions according to the CMW API 1.1 specification.
     *
     * @exports cmwapi/map/Overlay
     */
    var Overlay = {

        /**
         * @see module:cmwapi/map/overlay/Create
         */
        create : Create,
        /**
         * @see module:cmwapi/map/overlay/Remove
         */
        remove: Remove,
        /**
         * @see module:cmwapi/map/overlay/Hide
         */
        hide: Hide,
        /**
         * @see module:cmwapi/map/overlay/Show
         */
        show: Show,
        /**
         * @see module:cmwapi/map/overlay/Update
         */
        update: Update
    };

    return Overlay;
});

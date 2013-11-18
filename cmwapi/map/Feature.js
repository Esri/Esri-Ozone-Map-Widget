
define(["cmwapi/map/feature/Plot", "cmwapi/map/feature/PlotURL", "cmwapi/map/feature/Unplot",
    "cmwapi/map/feature/Hide", "cmwapi/map/feature/Show", "cmwapi/map/feature/Selected", "cmwapi/map/feature/Update"], 
    function(Plot, PlotURL, Unplot, Hide, Show, Selected, Update) {

    /**
     * Defines a convenience module for handling all the map.feature interactions according to the CMW API 1.1 specification.
     *
     * @exports cmwapi/map/Feature
     */
    var Feature = {

        /**
         * @see module:cmwapi/map/feature/Plot
         */
        plot : Plot,
        /**
         * @see module:cmwapi/map/feature/Unplot
         */
        unplot: Unplot,
        /**
         * @see module:cmwapi/map/feature/Hide
         */
        hide: Hide,
        /**
         * @see module:cmwapi/map/feature/Show
         */
        show: Show,
        /**
         * @see module:cmwapi/map/feature/Selected
         */
        selected: Selected,
        /**
         * @see module:cmwapi/map/feature/Update
         */
        update: Update
    };

    /**
     * @see module:cmwapi/map/feature/PlotURL
     */
    Feature.plot.url = PlotURL;

    return Feature;
});

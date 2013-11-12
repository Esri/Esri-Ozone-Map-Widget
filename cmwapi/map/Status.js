
define(["cmwapi/Channels", "cmwapi/map/Error", "cmwapi/map/status/About", "cmwapi/map/status/Format",
        "cmwapi/map/status/Request", "cmwapi/map/status/View"], 
    function(Channels, Error, About, Format, Request, View) {

    /**
     * Defines a convenience module for handling all the map.status interactions according to the CMW API 1.1 specification.
     *
     * @exports cmwapi/map/Status
     */
    var Status = {

        /**
         * @see module:cmwapi/map/status/Request.SUPPORTED_STATUS_TYPES
         */
        SUPPORTED_STATUS_TYPES : Request.SUPPORTED_STATUS_TYPES,
        /**
         * @see module:cmwapi/map/status/Format.REQUIRED_FORMATS
         */
        REQUIRED_FORMATS : Format.REQUIRED_FORMATS,

        /**
         * @see module:cmwapi/map/status/Request
         */
        request : Request,
        /**
         * @see module:cmwapi/map/status/View
         */
        view: View,
        /**
         * @see module:cmwapi/map/status/About
         */
        about: About,
        /**
         * @see module:cmwapi/map/status/Format
         */
        format: Format
    };

    return Status;
});

/**
 * Defines the module for requesting map status information according to the CMW API 1.1 specification.
 *
 * @module cmwapi/map/Status
 */
define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error", "cmwapi/map/status/Request", "cmwapi/map/status/About"], 
    function(Channels, Validator, Error, Request, About) {

    var FORMATS_REQUIRED = ["kml", "wms"];
    var validator = new Validator(SUPPORTED_STATUS_TYPES);

    var status = {

        SUPPORTED_STATUS_TYPES : Request.SUPPORTED_STATUS_TYPES,
        FORMATS_REQUIRED : About.FORMATS_REQUIRED,

        request : Request,
        view: View,
        about: About,

        /**
         * Send out the list of data formats that this map supports.
         *
         */
        formats : function ( formats ) {
            var sendFormats;

            // send at least FORMATS_REQUIRED
            if (formats instanceof Array) {
                sendFormats = FORMATS_REQUIRED.concat(formats);
            } else { sendFormats = FORMATS_REQUIRED; }

            // note: this may cause us to send the same format value more than once...
            // blend data given with FORMATS_REQUIRED...
            OWF.Eventing.publish(Channels.MAP_STATUS_FORMAT, Ozone.util.toString({formats: sendFormats}));
        },

        /**
         *
         * @param handler
         */
        handleFormats: function (handler) {

            // no real validation here...
            var newHandler = function (sender, msg) {

                if (!msg.formats) {
                    Map.error.error(sender, Channels.MAP_STATUS_FORMATS, msg, "Unable to determine formats" );
                } else {
                    handler(sender, msg);
                }
            };

            OWF.Eventing.subscribe(Channels.MAP_STATUS_FORMAT, newHandler);
            return newHandler;

        }
    };

    return Status;
});

/**
 * Defines the Format channel module according to the CMW API 1.1 specification
 *
 * @module cmwapi/map/status/Format
 */
define(["cmwapi/Channels", "cmwapi/map/Error"], function(Channels, Error) {

    var REQUIRED_FORMATS = ["kml", "wms"];

    /**
     * @constructor
     * @alias module:cmwapi/map/status/Format
     */
    var Format = {

        /** 
         * The minimum formats required by any maps that support the CMW API.
         */
        REQUIRED_FORMATS : REQUIRED_FORMATS,

        /**
         * Send out the list of data formats that this map supports.
         * @todo Consider not validating against any set list here or making sure that the passed in formats contains
         * at least the required formats.  If not, an error is thrown on the error channel.  Quesion: Do we send only
         * if there is no error?  Or always send the provided formats?
         */
        send : function ( formats ) {
            var sendFormats;

            // send at least REQUIRED_FORMATS
            if (formats instanceof Array) {
                sendFormats = REQUIRED_FORMATS.concat(formats);
            } else { sendFormats = REQUIRED_FORMATS; }

            // note: this may cause us to send the same format value more than once...
            // blend data given with REQUIRED_FORMATS...
            OWF.Eventing.publish(Channels.MAP_STATUS_FORMAT, Ozone.util.toString({formats: sendFormats}));
        },

        /**
         *
         * @param handler
         */
        addHandler: function (handler) {

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

        },

        /**
         * Stop listening to the format channel and handling events upon it.
         */
        removeHandlers : function() {
            OWF.Eventing.unsubscribe(Channels.MAP_STATUS_FORMAT);
        }

    };

    return Format;

});

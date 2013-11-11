define(["cmwapi/Channels", "cmwapi/map/Error"], function(Channels, Error) {

    var REQUIRED_FORMATS = ["kml", "wms"];

    /**
     * The Format module provides methods for using a map.status.format OWF Eventing channel
     * according to the [CMWAPI 1.1 Specification](http://www.cmwapi.org).  This module 
     * abstracts the OWF Eventing channel mechanism from client code and validates messages
     * using specification rules.  Any errors are published
     * on the map.error channel using an {@link module:cmwapi/map/Error|Error} module.
     * @exports cmwapi/map/status/Format
     */
    var Format = {

        /** 
         * A string array of the minimum formats required by any maps that support the CMWAPI 1.1:  
         * "kml" and "wms".
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
         * Subscribes to the status formats channel and registers a handler to be called when messages
         * are published to it.
         *
         * @param {module:cmwapi/map/status/Format~Handler} handler An event handler for any format messages.
         */
        addHandler: function (handler) {

            // no real validation here...
            var newHandler = function (sender, msg) {

                if (!msg.formats) {
                    Error.send(sender, Channels.MAP_STATUS_FORMATS, msg, "Unable to determine formats" );
                } else {
                    handler(sender, msg);
                }
            };

            OWF.Eventing.subscribe(Channels.MAP_STATUS_FORMAT, newHandler);
            return newHandler;

        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers : function() {
            OWF.Eventing.unsubscribe(Channels.MAP_STATUS_FORMAT);
        }

        /**
         * A function for handling request channel messages.
         * @callback module:cmwapi/map/status/Format~Handler
         * @param {string} sender The widget sending a format message
         * @param {object} msg The formats requested in a JSON object.  {formats: String[]}
         */
    };

    return Format;

});

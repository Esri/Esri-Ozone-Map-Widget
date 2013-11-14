define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error"], function(Channels, Validator, Error) {

    /**
     * The Request module provides methods for using a map.status.request OWF Eventing channel
     * according to the [CMWAPI 1.1 Specification](http://www.cmwapi.org).  This module
     * abstracts the OWF Eventing channel mechanism from client code and validates messages
     * using specification rules.  Any errors are published
     * on the map.error channel using an {@link module:cmwapi/map/Error|Error} module.
     * @exports cmwapi/map/status/Request
     */
    var Request = {

        /**
         * An array of valid status message type strings.  The [CMWAPI 1.1 Specification](http://www.cmwapi.org)
         * allows for "about", "format", and "view".
         */
        SUPPORTED_STATUS_TYPES: Validator.SUPPORTED_STATUS_TYPES,

        /**
         * Sends a status request message.
         * @param {Array<string>} [types] version 1.1 only supports "about", "format", and "view"
         */
        send: function(types) {
            var checkTypes = Validator.validRequestTypes(types);
            if (checkTypes.result) {
                // build JSON string for types
                var objTypes = {
                    types: types
                };

                OWF.Eventing.publish(Channels.MAP_STATUS_REQUEST, Ozone.util.toString(objTypes));
            } else {
                // Send an error with the current widget instance as the sender.
                Error.send( OWF.getInstanceId(), Channels.MAP_STATUS_REQUEST, types, checkTypes.msg);
            }
        },

        /**
         * Subscribes to the view channel and registers a handler to be called when messages are published to it.
         *
         * @param {module:cmwapi/map/status/Request~Handler} handler An event handler for any request messages.
         * @todo Since single item (types), working to leave it as JSON &#123;types: []&#125;.<br />
         * @todo Verify - Is the idea of sender important???
         */
        addHandler: function(handler) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function(sender, msg) {

                var jsonMsg = Ozone.util.parseJson(msg);
                if (jsonMsg.types) {
                    var checkTypes = Validator.validRequestTypes(jsonMsg.types);
                    if (checkTypes.result) {
                        handler(sender, jsonMsg.types);
                    } else {
                        Error.send( sender, Channels.MAP_STATUS_REQUEST, msg, checkTypes.msg);
                    }
                } else {
                    // if none requested, handle _all_
                    handler(sender, Validator.SUPPORTED_STATUS_TYPES);
                }
            };
            OWF.Eventing.subscribe(Channels.MAP_STATUS_REQUEST, newHandler );
            return newHandler;  // returning to make it easy to test!
        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers: function() {
            OWF.Eventing.unsubscribe(Channels.MAP_STATUS_REQUEST);
        }

        /**
         * A function for handling request channel messages.
         * @callback module:cmwapi/map/status/Request~Handler
         * @param {string} sender The widget sending a request message
         * @param {Array<string>} types One or more of the
         *     {@link module:cmwapi/map/status/Request.SUPPORTED_STATUS_TYPES|SUPPORTED_STATUS_TYPES} values.
         */
    };

    return Request;
});

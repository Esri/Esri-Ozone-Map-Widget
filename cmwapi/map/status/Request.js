/**
 * Defines the module for requesting map status information according to the CMW API 1.1 specification.
 *
 * @module cmwapi/map/status/Request
 */
define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error"], function(Channels, Validator) {

    var SUPPORTED_STATUS_TYPES = ["about", "format", "view"];
    var validator = new Validator(SUPPORTED_STATUS_TYPES);

    /**
     * @constructor
     * @alias module:cmwapi/map/status/Request
     */
    var Request = {

        SUPPORTED_STATUS_TYPES : SUPPORTED_STATUS_TYPES,
        /**
         * DO the request for status
         * @param {string[]} [types] version 1.1 only supports "about", "format", and "view"
         */
        send : function ( types ) {
            checkTypes = validator.validRequestTypes(types);
            if (checkTypes.result) {
                // build JSON string for types
                var objTypes = {
                    types : types
                };

                OWF.Eventing.publish(Channels.MAP_STATUS_REQUEST, Ozone.util.toString(objTypes));
            } else {
                // TODO: get actual widget id
                Map.error.error( OWF.getInstanceId(), Channels.MAP_STATUS_REQUEST, types, checkTypes.msg);
            }
        },

        /**
         * HANDLE a request for status...
         * @param handler {function} means of passing in function handler when message is received.<br />
         *   Will be given sender, as well as payload of request message (types).
         *   Since single item (types), working to leave it as JSON &#123;types: []&#125;.<br />
         *   TODO: Is that idea of sender important???<br />
         *   TODO: how would we remove handlers here???
         */
        addHandler : function( handler ) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function( sender, msg) {

                jsonMsg = Ozone.util.parseJson(msg);
                if (jsonMsg.types) {
                    checkTypes = validator.validRequestTypes(jsonMsg.types);
                    if (checkTypes.result) {
                        handler(sender, jsonMsg.types);
                    } else {
                        Map.error.error( sender, Channels.MAP_STATUS_REQUEST, msg, checkTypes.msg);
                    }
                } else {
                    // if none requested, handle _all_
                    handler(sender, SUPPORTED_STATUS_TYPES);
                }
            };
            OWF.Eventing.subscribe(Channels.MAP_STATUS_REQUEST, newHandler );
            return newHandler;  // returning to make it easy to test!
        },

        /**
         * Stop listening to the request channel and handling events upon it.
         */
        removeHandlers : function() {
            OWF.Eventing.unsubscribe(Channels.MAP_STATUS_REQUEST);
        }
    }

    return Request;
});

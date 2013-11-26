define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error"], 
    function(Channels, Validator, Error) {

    var SUPPORTED_KEYS = ["alt", "ctrl", "shift", "none"];
    var SUPPORTED_BUTTONS = ["left", "middle", "right"];
    var SUPPORTED_TYPES = ["single", "double"];

    /**
     * Validate the input types against the supported map status request types.
     * @param types {Array<string>} The types to validate.
     * @returns {module:cmwapi/Validator~Result}
     */
    var  itemIsAllowedValue = function(allowedValues, item) {
        if (typeof item !== "undefined") {
            if (Validator.isArray(allowedValues)) {
                return (allowedValues.indexOf(item.toString().toLowerCase()) > -1);
            }
        }
        return true;
    };

    /**
     * The Clicked module provides methods for reporting mouse clicks on a map via an OWF Eventing channel
     * according to the [CMWAPI 1.1 Specification](http://www.cmwapi.org).  This module 
     * abstracts the OWF Eventing channel mechanism from client code and validates messages
     * using specification rules.  Any errors are published
     * on the map.error channel using an {@link module:cmwapi/map/Error|Error} module.
     *
     * According to the 
     * CMWAPI Specification payloads sent over the channel may require validation of individual parameters or
     * default values for omitted parameters.  Where possible, this module abstracts those rules from client code.
     * Both the send and addHandler functions will auto-fill defaults for missing parameters. Further, addHandler
     * will wrap any passed-in function with payload validation code, so that they fail fast on invalid payloads and
     * do not push bad data into any map specific handlers.  A summary of payload errors is pushed to the 
     * {@link module:cmwapi/map/Error|Error} channel if that occurs.
     *
     * @exports cmwapi/map/view/Clicked
     */
    var Clicked = {

        /** The keys supported by this click module. */
        SUPPORTED_KEYS: SUPPORTED_KEYS,

        /** The mouse buttons supported by this click module. */
        SUPPORTED_BUTTONS: SUPPORTED_BUTTONS,

        /** The mouse click types supported by this click module. */
        SUPPORTED_TYPES: SUPPORTED_TYPES,

        /**
         * Send information that centers a map on a location.
         * @param {Object|Array} data 
         * @param {number} data.lat A latitude value in decimal degrees of the click point.
         * @param {number} data.lon A longitude value in decimal degrees of the click point.
         * @param {string} data.button The mouse button clicked: "left", "middle", "right".  For
         *     backwards compatibility, a missing button value should be considered as "left".
         * @param {string} data.type The type of mouse click: "single", "double".  For backwards
         *     compatibility, a missing type value should be considered as "single".
         * @param {Array<string>} data.keys An array of keys pressed during the click event.
         *     Supported values are "alt", "ctrl", "shift", and "none".  For backwards compatibility,
         *     a missing keys value should be treated as "none".
         */
        send : function ( data ) {

            // validData will story results from any Validator and may be resused for internal
            // error bookkeeping.
            var validData = Validator.validObjectOrArray( data );
            var payload = validData.payload;

            // If the data was not in proper payload structure, an Object or Array of objects, 
            // note the error and return.
            if (!validData.result) {
                Error.send( OWF.getInstanceId(), Channels.MAP_VIEW_CLICKED, data, 
                    validData.msg);
                return;
            }

            // Check all the feature objects; fill-in any missing attributes.
            for (var i = 0; i < payload.length; i++) {
                // Check the lat value
                if (!Validator.isNumber(payload[i].lat)) {
                    validData.result = false;
                    validData.msg += "Invalid lat value for payload " + i + ". ";
                }
                // Check the lon value
                if (!Validator.isNumber(payload[i].lon)) {
                    validData.result = false;
                    validData.msg += "Invalid lon value for payload " + i + ". ";
                }
                // Check the button
                if (!itemIsAllowedValue(SUPPORTED_BUTTONS, payload[i].button)) {
                    validData.result = false;
                    validData.msg += "Invalid button value for payload " + i + ". ";
                }
                // Check the click type
                if (!itemIsAllowedValue(SUPPORTED_TYPES, payload[i].type)) {
                    validData.result = false;
                    validData.msg += "Invalid mouse click type for payload " + i + ". ";
                }

                // Check the keys value
                if (payload[i].keys && Validator.isArray(payload[i].keys)) {
                    for (var j = 0; j < payload[i].keys.length; j++) {
                        if (!itemIsAllowedValue(SUPPORTED_KEYS, payload[i].keys[j])) {
                            validData.result = false;
                            validData.msg += "Invalid key for payload " + i + ". ";
                        }
                    }
                }
            }

            // Send along the payload if we did not fail validation.    
            if (validData.result) {
                if (payload.length === 1) {
                    OWF.Eventing.publish(Channels.MAP_VIEW_CLICKED, Ozone.util.toString(payload[0]));
                }
                else {
                    OWF.Eventing.publish(Channels.MAP_VIEW_CLICKED, Ozone.util.toString(payload));
                }
            }
            else {
                Error.send( OWF.getInstanceId(), Channels.MAP_VIEW_CLICKED, 
                    Ozone.util.toString(data),
                    validData.msg);
            }

        },

        /**
         * Subscribes to the clicked channel and registers a handler to be called when messages
         * are published to it.
         *
         * @param {module:cmwapi/map/view/Clicked~Handler} handler An event handler for any creation messages.
         *
         */
        addHandler : function (handler) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function( sender, msg ) {
              
                // Parse the sender and msg to JSON.
                var jsonMsg = (Validator.isString(msg)) ? Ozone.util.parseJson(msg) : msg;
                var data = (Validator.isArray(jsonMsg)) ? jsonMsg : [jsonMsg];
                var validData = {result: true, msg: ""};

                for (var i = 0; i < data.length; i ++) {
                                    // Check the lat value
                    if (!Validator.isNumber(data[i].lat)) {
                        validData.result = false;
                        validData.msg += "Invalid lat value for payload " + i + ". ";
                    }
                    // Check the lon value
                    if (!Validator.isNumber(data[i].lon)) {
                        validData.result = false;
                        validData.msg += "Invalid lon value for payload " + i + ". ";
                    }
                    // Check the button
                    if (!itemIsAllowedValue(SUPPORTED_BUTTONS, data[i].button)) {
                        validData.result = false;
                        validData.msg += "Invalid button value for payload " + i + ". ";
                    }
                    // Check the click type
                    if (!itemIsAllowedValue(SUPPORTED_TYPES, data[i].type)) {
                        validData.result = false;
                        validData.msg += "Invalid mouse click type for payload " + i + ". ";
                    }

                    // Check the keys value
                    if (data[i].keys && Validator.isArray(data[i].keys)) {

                        for (var j = 0; j < data[i].keys.length; j++) {
                            if (!itemIsAllowedValue(SUPPORTED_KEYS, data[i].keys[j])) {
                                validData.result = false;
                                validData.msg += "Invalid key for payload " + i + ". ";
                            }
                        }
                    }
                }

                if (validData.result) {
                    handler(sender, (data.length === 1) ? data[0] : data);
                }
                else {
                    Error.send(sender, Channels.MAP_VIEW_CLICKED, 
                        msg,
                        validData.msg);
                }
                
            };

            OWF.Eventing.subscribe(Channels.MAP_VIEW_CLICKED, newHandler);
            return newHandler;
        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers : function() {
            OWF.Eventing.unsubscribe(Channels.MAP_VIEW_CLICKED);
        }

        /**
         * A function for handling channel messages.
         * @callback module:cmwapi/map/view/Clicked~Handler
         * @param {string} sender The widget sending a format message
         * @param {Object|Array} data  A data object or array of data objects.
         * @param {number} data.lat A latitude value in decimal degrees of the click point.
         * @param {number} data.lon A longitude value in decimal degrees of the click point.
         * @param {string} data.button The mouse button clicked: "left", "middle", "right".  For
         *     backwards compatibility, a missing button value should be considered as "left".
         * @param {string} data.type The type of mouse click: "single", "double".  For backwards
         *     compatibility, a missing type value should be considered as "single".
         * @param {Array<string>} data.keys An array of keys pressed during the click event.
         *     Supported values are "alt", "ctrl", "shift", and "none".  For backwards compatibility,
         *     a missing keys value should be treated as "none".
         */

    };

    return Clicked;

});

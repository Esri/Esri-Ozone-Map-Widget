define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error"], 
    function(Channels, Validator, Error) {

    /**
     * The CenterFeature module provides methods for centering a map feature via an OWF Eventing channel
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
     * @exports cmwapi/map/view/CenterFeature
     */
    var CenterFeature = {

        /**
         * Send information that centers a map feature.
         * @param {Object|Array} data 
         * @param {string} [data.overlayId] The ID of the overlay.  If a valid ID string is not specified, the sending widget's ID is used.
         * @param {string} data.featureId The ID of the feature.  If an ID is not specified, an error is generated.
         * @param {number|string} [data.zoom] A range in meters at which to set a zoom or the term "auto" to
         *     to ask a map to best vit the overlay in the user's viewable area.
         */
        send : function ( data ) {

            // validData will story results from any Validator and may be resused for internal
            // error bookkeeping.
            var validData = Validator.validObjectOrArray( data );
            var payload = validData.payload;

            // If the data was not in proper payload structure, an Object or Array of objects, 
            // note the error and return.
            if (!validData.result) {
                Error.send( OWF.getInstanceId(), Channels.MAP_VIEW_CENTER_FEATURE, data, 
                    validData.msg);
                return;
            }

            // Check all the payload attributes; fill-in any missing attributes.
            for (var i = 0; i < payload.length; i ++) {
                // The overlayId is optional; defaults to widget id if not specified.
                payload[i].overlayId = (payload[i].overlayId) ? payload[i].overlayId : OWF.getInstanceId();

                // A feature id is required.
                if (!payload[i].featureId) {
                    validData.result = false;
                    validData.msg += 'Need a feature Id for feature at index ' + i + '. ';
                }

                // Zoom is optional; if it does exist, check it for a number or "auto".
                if (typeof payload[i].zoom !== "undefined") {
                    payload[i].zoom = (payload[i].zoom) ? payload[i].zoom : false;
                    if (!Validator.isNumber(payload[i].zoom) && payload[i].zoom.toString().toLowerCase() !== "auto") {
                        validData.result = false;
                        validData.msg += "zoom values must be a number or 'auto'. ";
                    }
                }
            }

            // Since everything is optional, no major data validation is performed here.  Send
            // along the payload.    
            if (validData.result) {
                if (payload.length === 1) {
                    OWF.Eventing.publish(Channels.MAP_VIEW_CENTER_FEATURE, Ozone.util.toString(payload[0]));
                }
                else {
                    OWF.Eventing.publish(Channels.MAP_VIEW_CENTER_FEATURE, Ozone.util.toString(payload));
                }
            }
            else {
                Error.send( OWF.getInstanceId(), Channels.MAP_VIEW_CENTER_FEATURE, 
                    Ozone.util.toString(data),
                    validData.msg);
            }

        },

        /**
         * Subscribes to the center feature channel and registers a handler to be called when messages
         * are published to it.
         *
         * @param {module:cmwapi/map/view/CenterFeature~Handler} handler An event handler for any creation messages.
         *
         */
        addHandler : function (handler) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function( sender, msg ) {
              
                // Parse the sender and msg to JSON.
                var jsonSender = Ozone.util.parseJson(sender);
                var jsonMsg = (Validator.isString(msg)) ? Ozone.util.parseJson(msg) : msg;
                var data = (Validator.isArray(jsonMsg)) ? jsonMsg : [jsonMsg];
                var validData = {result: true, msg: ""};

                for (var i = 0; i < data.length; i ++) {
                    // The overlayId is optional; defaults to widget id if not specified.
                    data[i].overlayId = (data[i].overlayId) ? data[i].overlayId : jsonSender.id;

                    if (!data[i].featureId) {
                        validData.result = false;
                        validData.msg += 'Need a feature Id for feature at index ' + i + '. ';
                    }

                    // Zoom is optional; if it doesn't exist, explicitly set it to the default.
                    if (typeof data[i].zoom !== "undefined") {
                        data[i].zoom = (data[i].zoom) ? data[i].zoom : false;
                        if (!Validator.isNumber(data[i].zoom) && data[i].zoom.toString().toLowerCase() !== "auto") {
                            validData.result = false;
                            validData.msg += "zoom values must be a number or 'auto'. ";
                        }
                    }
                }

                if (validData.result) {
                    handler(sender, (data.length === 1) ? data[0] : data);
                }
                else {
                    Error.send(sender, Channels.MAP_VIEW_CENTER_FEATURE, 
                        msg,
                        validData.msg);
                }
                
            };

            OWF.Eventing.subscribe(Channels.MAP_VIEW_CENTER_FEATURE, newHandler);
            return newHandler;
        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers : function() {
            OWF.Eventing.unsubscribe(Channels.MAP_VIEW_CENTER_FEATURE);
        }

        /**
         * A function for handling channel messages.
         * @callback module:cmwapi/map/view/CenterFeature~Handler
         * @param {string} sender The widget sending a format message
         * @param {Object|Array} data  A data object or array of data objects.
         * @param {string} data.overlayId The ID of the overlay. 
         * @param {string} data.featureId The ID of the feature. 
         * @param {number|string} [data.zoom] A range in meters at which to set a zoom or the term "auto" to
         *     to ask a map to best vit the overlay in the user's viewable area.
         */

    };

    return CenterFeature;

});

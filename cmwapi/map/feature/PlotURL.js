define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error"], 
    function(Channels, Validator, Error) {

    /**
     * The PlotURL module provides methods for using a feature URL plotting OWF Eventing channel
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
     * @exports cmwapi/map/feature/PlotURL
     */
    var PlotURL = {

        /**
         * Send information that plots one or more map features via URL.
         * @param {Object|Array} data 
         * @param {string} [data.overlayId] The ID of the overlay.  If a valid ID string is not specified, the sending widget's ID is used.
         * @param {string} data.featureId The ID of the feature.  If an ID is not specified, an error is generated.
         * @param {string} [data.name] The name of the feature.  If a valid name string is not specified,
         *     the featureId is used.  Names are not unique and are meant purely for display purposes.
         * @param {string} [data.format] The format of the feature.  If not specified, this defaults to "kml".
         * @param {string} data.url The URL of the feature data.
         * @param {Object} [data.params] A JSON object of parameters to be added to the URL during a feature request from a server.
         *     According to the [CMWAPI 1.1 Specification](http://www.cmwapi.org), params may be ignored unless the format is
         *     set to "wms".  Also, request, exceptions, SRS/CRS, widgeth, height, and bbox params should not be passed in
         *     as they are determined by the map as needed.  Finally, all parameters should <em>not</em> be URL encoded.
         * @param {boolean} [data.zoom] True, if the map should automatically zoom to this feature; false, otherwise.
         *     Defaults to false. 
         * @todo At present, we're not defaulting the name to the feature id if not supplied.  Is this valid?  The API does
         *     not require a default; does that imply an empty string?
         */
        send : function ( data ) {

            // validData will story results from any Validator and may be resused for internal
            // error bookkeeping.
            var validData = Validator.validObjectOrArray( data );
            var payload = validData.payload;

            // If the data was not in proper payload structure, an Object or Array of objects, 
            // note the error and return.
            if (!validData.result) {
                Error.send( OWF.getInstanceId(), Channels.MAP_FEATURE_PLOT_URL, data, 
                    validData.msg);
                return;
            }

            // Check all the feature objects; fill-in any missing attributes.
            for (var i = 0; i < payload.length; i ++) {
                // The overlayId is optional; defaults to widget id if not specified.
                payload[i].overlayId = (payload[i].overlayId) ? payload[i].overlayId : OWF.getInstanceId();

                if (!payload[i].featureId) {
                    validData.result = false;
                    validData.msg += 'Need a feature Id for feature at index ' + i + '. ';
                }

                // The name is optional; defaults to the feature id if not specified
                // if (payload[i].featureId) {
                //     payload[i].name = (payload[i].name) ? payload[i].name : payload[i].featureId;
                // }

                // Check for a format.  If it exists, retain; otherwise, default to kml.
                payload[i].format = (payload[i].format) ? payload[i].format : "kml";

                if (!payload[i].url) {
                    validData.result = false;
                    validData.msg += 'Need a URL for feature at index ' + i + '. ';
                }

                // Param use is map specific; no validation or defaults set at this level. 

                // Zoom is optional; if it doesn't exist, explicitly set it to the default.
                payload[i].zoom = (payload[i].zoom) ? payload[i].zoom : false;
            }

            // Since everything is optional, no major data validation is performed here.  Send
            // along the payload.    
            if (validData.result) {
                if (payload.length === 1) {
                    OWF.Eventing.publish(Channels.MAP_FEATURE_PLOT_URL, Ozone.util.toString(payload[0]));
                }
                else {
                    OWF.Eventing.publish(Channels.MAP_FEATURE_PLOT_URL, Ozone.util.toString(payload));
                }
            }
            else {
                Error.send( OWF.getInstanceId(), Channels.MAP_FEATURE_PLOT_URL, 
                    Ozone.util.toString(data),
                    validData.msg);
            }

        },

        /**
         * Subscribes to the feature plot URL channel and registers a handler to be called when messages
         * are published to it.
         *
         * @param {module:cmwapi/map/feature/PlotURL~Handler} handler An event handler for any creation messages.
         *
         */
        addHandler : function (handler) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function( sender, msg ) {
              
                // Parse the sender and msg to JSON.
                var jsonSender = Ozone.util.parseJson(sender);
                var jsonMsg = (Validator.isString(msg)) ? Ozone.util.parseJson(msg) : msg;
                var data = (Validator.isArray(jsonMsg)) ? jsonMsg : [jsonMsg];
                var validData = true;
                var errorMsg = "";

                for (var i = 0; i < data.length; i ++) {
                    // The overlayId is optional; defaults to widget id if not specified.
                    data[i].overlayId = (data[i].overlayId) ? data[i].overlayId : jsonSender.id;

                    if (!data[i].featureId) {
                        validData = false;
                        errorMsg += 'Need a feature Id for feature at index ' + i + '. ';
                    }

                    // The name is optional; defaults to the feature id if not specified
                    // if (data[i].featureId) {
                    //     data[i].name = (data[i].name) ? data[i].name : data[i].featureId;
                    // }

                    // Check for a format.  If it exists, retain; otherwise, default to kml.
                    data[i].format = (data[i].format) ? data[i].format : "kml";

                    if (!data[i].url) {
                        validData = false;
                        errorMsg += 'Need a URL for feature at index ' + i + '. ';
                    }

                    // Param use is map specific; no validation or defaults set at this level. 

                    // Zoom is optional; if it doesn't exist, explicitly set it to the default.
                    data[i].zoom = (data[i].zoom) ? data[i].zoom : false;
                }

                if (validData) {
                    handler(sender, (data.length === 1) ? data[0] : data);
                }
                else {
                    Error.send(sender, Channels.MAP_FEATURE_PLOT_URL, 
                        msg,
                        errorMsg);
                }
                
            };

            OWF.Eventing.subscribe(Channels.MAP_FEATURE_PLOT_URL, newHandler);
            return newHandler;
        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers : function() {
            OWF.Eventing.unsubscribe(Channels.MAP_FEATURE_PLOT_URL);
        }

        /**
         * A function for handling channel messages.
         * @callback module:cmwapi/map/feature/PlotURL~Handler
         * @param {string} sender The widget sending a format message
         * @param {Object|Array} data  A data object or array of data objects.
         * @param {string} data.overlayId The ID of the overlay. 
         * @param {string} data.featureId The ID of the feature. 
         * @param {string} [data.name] The name of the feature.  Names are not unique and are meant purely for display purposes.
         * @param {string} data.format The format of the feature.  This defaults to "kml".
         * @param {string} data.url The URL of the feature data.
         * @param {Object} [data.params] A JSON object of parameters to be added to the URL during a feature request from a server.
         *     According to the [CMWAPI 1.1 Specification](http://www.cmwapi.org), params may be ignored unless the format is
         *     set to "wms".  Also, request, exceptions, SRS/CRS, widgeth, height, and bbox params should not be passed in
         *     as they are determined by the map as needed.  Finally, all parameters should <em>not</em> be URL encoded.
         * @param {boolean} [data.zoom] True, if the map should automatically zoom to this feature; false, otherwise.
         *     Defaults to false. 
         */

    };

    return PlotURL;

});

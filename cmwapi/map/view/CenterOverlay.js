define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error"],
    function(Channels, Validator, Error) {

    /**
     * @copyright © 2013 Environmental Systems Research Institute, Inc. (Esri)
     *
     * @license
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at<br>
     * <br>
     *     {@link http://www.apache.org/licenses/LICENSE-2.0}<br>
     * <br>
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * @description The CenterOverlay module provides methods for centering a map overlay via an OWF Eventing channel
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
     * @version 1.1
     *
     * @exports cmwapi/map/view/CenterOverlay
     */
    var CenterOverlay = {

        /**
         * Send information that centers a map overlay.
         * @param {Object|Array} data
         * @param {string} [data.overlayId] The ID of the overlay.  If a valid ID string is not specified, the sending widget's ID is used.
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
                Error.send( OWF.getInstanceId(), Channels.MAP_VIEW_CENTER_OVERLAY, data,
                    validData.msg);
                return;
            }

            // Check all the payload attributes; fill-in any missing attributes.
            for (var i = 0; i < payload.length; i ++) {
                // The overlayId is optional; defaults to widget id if not specified.
                payload[i].overlayId = (payload[i].overlayId) ? payload[i].overlayId : OWF.getInstanceId();

                // Zoom is optional; if it doesn't exist, explicitly set it to the default.
                if (typeof payload[i].zoom !== "undefined") {
                    payload[i].zoom = (payload[i].zoom) ? payload[i].zoom : false;
                    if (!Validator.isNumber(payload[i].zoom) && payload[i].zoom.toString().toLowerCase() !== "auto") {
                        validData.result = false;
                        validData.msg += "zoom values must be a number or 'auto'. ";
                    }
                }
            }

            // Send along the payload if we did not fail validation.
            if (validData.result) {
                if (payload.length === 1) {
                    OWF.Eventing.publish(Channels.MAP_VIEW_CENTER_OVERLAY, Ozone.util.toString(payload[0]));
                }
                else {
                    OWF.Eventing.publish(Channels.MAP_VIEW_CENTER_OVERLAY, Ozone.util.toString(payload));
                }
            }
            else {
                Error.send( OWF.getInstanceId(), Channels.MAP_VIEW_CENTER_OVERLAY,
                    Ozone.util.toString(data),
                    validData.msg);
            }

        },

        /**
         * Subscribes to the center overlay channel and registers a handler to be called when messages
         * are published to it.
         *
         * @param {module:cmwapi/map/view/CenterOverlay~Handler} handler An event handler for any creation messages.
         * @return {module:cmwapi/map/view/CenterOverlay~Handler} The original event handler wrapped in CMWAPI payload validation code.
         *     Where appropriate default values for missing payload attributes are filled in and
         *     invalid payloads are noted on the Error channel prior to execution of the
         *     the input handler.  Invalid payloads will short-circuit execution of the provided handler.
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
                    handler(jsonSender.id, (data.length === 1) ? data[0] : data);
                }
                else {
                    Error.send(jsonSender.id, Channels.MAP_VIEW_CENTER_OVERLAY,
                        msg,
                        validData.msg);
                }

            };

            OWF.Eventing.subscribe(Channels.MAP_VIEW_CENTER_OVERLAY, newHandler);
            return newHandler;
        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers : function() {
            OWF.Eventing.unsubscribe(Channels.MAP_VIEW_CENTER_OVERLAY);
        }

        /**
         * A function for handling channel messages.
         * @callback module:cmwapi/map/view/CenterOverlay~Handler
         * @param {string} sender The widget sending a format message
         * @param {Object|Array} data  A data object or array of data objects.
         * @param {string} data.overlayId The ID of the overlay.
         * @param {number|string} [data.zoom] A range in meters at which to set a zoom or the term "auto" to
         *     to ask a map to best vit the overlay in the user's viewable area.
         */

    };

    return CenterOverlay;

});

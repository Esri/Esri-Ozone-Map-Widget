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
     * @description The Unplot module provides methods for using a feature removal OWF Eventing channel
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
     * @module cmwapi/map/feature/Unplot
     */
    var Unplot = {

        /**
         * Send information that removes one or more map features.
         * @method send
         * @param {Object|Object[]} data
         * @param {String} [data.overlayId] The ID of the overlay.  If a valid ID string is not specified, the sending widget's ID is used.
         * @param {String} data.featureId The ID of the feature.  If an ID is not specified, an error is generated.
         * @memberof module:cmwapi/map/feature/Unplot
         */
        send: function(data) {

            var payload;
            var msg = "";
            var validData = true;

            if( Object.prototype.toString.call( data ) === '[object Array]' ) {
                payload = data;
            }
            else {
                payload = [data];
            }

            // Check all the feature objects; fill-in any missing attributes.
            for (var i = 0; i < payload.length; i ++) {
                // The overlayId is optional; defaults to widget id if not specified.
                payload[i].overlayId = (payload[i].overlayId) ? payload[i].overlayId : OWF.getInstanceId();

                if (!payload[i].featureId) {
                    validData = false;
                    msg += 'Need a feature Id for feature at index ' + i + '. ';
                }
            }

            // Send along the payload if we did not fail validation.
            if (validData) {
                if (payload.length === 1) {
                    OWF.Eventing.publish(Channels.MAP_FEATURE_UNPLOT, Ozone.util.toString(payload[0]));
                }
                else {
                    OWF.Eventing.publish(Channels.MAP_FEATURE_UNPLOT, Ozone.util.toString(payload));
                }
            }
            else {
                Error.send( OWF.getInstanceId(), Channels.MAP_FEATURE_UNPLOT,
                    Ozone.util.toString(data),
                    msg);
            }

        },

        /**
         * Subscribes to the feature removal channel and registers a handler to be called when messages
         * are published to it.
         * @method addHandler
         * @param {module:cmwapi/map/feature/Unplot~Handler} handler An event handler for any creation messages.
         * @memberof module:cmwapi/map/feature/Unplot
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
                }

                if (validData) {
                    handler(sender, (data.length === 1) ? data[0] : data);
                }
                else {
                    Error.send(sender, Channels.MAP_FEATURE_UNPLOT,
                        msg,
                        errorMsg);
                }

            };

            OWF.Eventing.subscribe(Channels.MAP_FEATURE_UNPLOT, newHandler);
            return newHandler;
        },

        /**
         * Stop listening to the channel and handling events upon it.
         * @method removeHandlers
         * @memberof module:cmwapi/map/feature/Unplot
         */
        removeHandlers : function() {
            OWF.Eventing.unsubscribe(Channels.MAP_FEATURE_UNPLOT);
        }

        /**
         * A function for handling channel messages.
         * @callback module:cmwapi/map/feature/Unplot~Handler
         * @param {String} sender The widget sending a format message
         * @param {Object|Object[]} data  A data object or array of data objects.
         * @param {String} data.overlayId The ID of the overlay.
         * @param {String} data.featureId The ID of the feature.
         * @memberof module:cmwapi/map/feature/Unplot
         */

    };

    return Unplot;

});

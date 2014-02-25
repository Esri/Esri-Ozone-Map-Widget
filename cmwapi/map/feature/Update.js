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
     * @description The Update module provides methods for modifying a feature's name and parent overlya via OWF Eventing channels
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
     * @exports cmwapi/map/feature/Update
     */
    var Update = {

        /**
         * Send information that modifies the name or overlay of one or more map features.
         * @param {Object|Array} data
         * @param {string} [data.overlayId] The ID of the overlay.  If a valid ID string is not specified, the sending widget's ID is used.
         * @param {string} data.featureId The ID of the feature.  If an ID is not specified, an error is generated.
         * @param {string} [data.name] The name of the feature.  If set, this will override any previous feature name.
         *     If no value is provided, the existing name, if any, will persist.
         * @param {string} [data.newOverlayId] The ID of the new parent overlay for this feature.  Setting this
         *     effectively moves the feature to a different location in the overlay heirarchy.
         */
        send : function ( data ) {

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

                // No validation is done on the new name or parent overlay id.
            }

            // Send along the payload if we did not fail validation.
            if (validData) {
                if (payload.length === 1) {
                    OWF.Eventing.publish(Channels.MAP_FEATURE_UPDATE, Ozone.util.toString(payload[0]));
                }
                else {
                    OWF.Eventing.publish(Channels.MAP_FEATURE_UPDATE, Ozone.util.toString(payload));
                }
            }
            else {
                Error.send( OWF.getInstanceId(), Channels.MAP_FEATURE_UPDATE,
                    Ozone.util.toString(data),
                    msg);
            }

        },

        /**
         * Subscribes to the channel that modifies the name or overlay of one or more map features and
         * registers a handler to be called when messages are published to it.
         *
         * @param {module:cmwapi/map/feature/Update~Handler} handler An event handler for any creation messages.
         * @return {module:cmwapi/map/feature/Update~Handler} The original event handler wrapped in CMWAPI payload validation code.
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
                var validData = true;
                var errorMsg = "";

                for (var i = 0; i < data.length; i ++) {
                    // The overlayId is optional; defaults to widget id if not specified.
                    data[i].overlayId = (data[i].overlayId) ? data[i].overlayId : jsonSender.id;

                    if (!data[i].featureId) {
                        validData = false;
                        errorMsg += 'Need a feature Id for feature at index ' + i + '. ';
                    }

                    // No validation is done on the new name or parent overlay id.
                }

                if (validData) {
                    handler(jsonSender.id, (data.length === 1) ? data[0] : data);
                }
                else {
                    Error.send(jsonSender.id, Channels.MAP_FEATURE_UPDATE,
                        msg,
                        errorMsg);
                }

            };

            OWF.Eventing.subscribe(Channels.MAP_FEATURE_UPDATE, newHandler);
            return newHandler;
        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers : function() {
            OWF.Eventing.unsubscribe(Channels.MAP_FEATURE_UPDATE);
        }

        /**
         * A function for handling channel messages.
         * @callback module:cmwapi/map/feature/Update~Handler
         * @param {string} sender The widget sending a format message
         * @param {Object|Array} data  A data object or array of data objects.
         * @param {string} data.overlayId The ID of the overlay.
         * @param {string} data.featureId The ID of the feature.
         * @param {string} [data.name] The name of the feature.  If set, this will override any previous feature name.
         *     If no value is provided, the existing name, if any, will persist.
         * @param {string} [data.newOverlayId] The ID of the new parent overlay for this feature.  Setting this
         *     effectively moves the feature to a different location in the overlay heirarchy.
         */

    };

    return Update;

});

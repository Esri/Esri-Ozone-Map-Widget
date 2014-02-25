define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error"], function(Channels, Validator, Error) {

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
     * @description The Request module provides methods for using a map.status.request OWF Eventing channel
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
     * @exports cmwapi/map/feature/status/Sublayers
     */
    var Sublayers = {

        /**
         * Sends a feature status layers message. It is expected that this message will be called
         *  with one layers object for each subfeature/attribute of the overlayId featureId combination
         * @param layers {Object|Object[]}
         * @param layers.overlayId {String}
         * @param layers.[overlayName] {String}
         * @param layers.featureId {String}
         * @param layers.[featureName] {String}
         * @param layers.[subfeatureName] {String}
         */
        send: function(data) {
            var validData = Validator.validObjectOrArray(data);
            var payload = validData.payload;

            if (validData.result) {
                if (payload.length === 1) {
                    OWF.Eventing.publish(Channels.MAP_FEATURE_STATUS_LAYERS, Ozone.util.toString(payload[0]));
                } else {
                    OWF.Eventing.publish(Channels.MAP_FEATURE_STATUS_LAYERS, Ozone.util.toString(payload));
                }
            } else {
                Error.send( OWF.getInstanceId(), Channels.MAP_FEATURE_STATUS_LAYERS, data, validData.msg);
                return;
            }
        },

        /**
         * Subscribes to the feature.status.layers channel and registers a handler to be called when
         * messages are published to it.
         *
         * @param {module:cmwapi/map/feature/status/Layers~Handler} handler
         * @return {module:cmwapi/map/feature/status/Layers~Handler} The original event handler provided
         *  wrapped in CMWAPI payload validation code. Where appropriate default values for missing
         *  payload attributes are filled in and invalid payloads are noted on the Error channel prior to
         *  execution of the the input handler. Invalid payloads will short-circuit execution of the provided
         *  handler.
         */
        addHandler: function(handler) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function(sender, msg) {
                var jsonSender = Ozone.util.parseJson(sender);
                var jsonMsg = Ozone.util.parseJson(msg);
                var data = (Validator.isArray(jsonMsg)) ? jsonMsg : [jsonMsg];

                for (var i = 0; i < data.length; i ++) {
                    handler(jsonSender.id, data[i]);
                }
            };
            OWF.Eventing.subscribe(Channels.MAP_FEATURE_STATUS_LAYERS, newHandler);
            return newHandler;  // returning to make it easy to test!
        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers: function() {
            OWF.Eventing.unsubscribe(Channels.MAP_FEATURE_STATUS_LAYERS);
        }

        /**
         * A function for handling feature status layers channel messages.
         * @callback module:cmwapi/map/feature/status/Layers~Handler
         * @param {string} sender The widget sending a feature status layers message
         * @param {Object[]} layers One or more objects representing a given subfeature/attribute of the
         *  overlayId featureId combination
         */
    };

    return Sublayers;
});

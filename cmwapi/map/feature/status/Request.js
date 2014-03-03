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
     * @exports cmwapi/map/feature/status/Request
     */
    var Request = {

        /**
         * Sends a feature status request message.
         */
        send: function() {
            OWF.Eventing.publish(Channels.MAP_FEATURE_STATUS_REQUEST, Ozone.util.toString({}));
        },

        /**
         * Subscribes to the feature.status.request channel and registers a handler to be called when
         * messages are published to it.
         *
         * @param {module:cmwapi/map/feature/status/Request~Handler} handler
         * @return {module:cmwapi/map/feature/status/Request~Handler} The original event handler.
         */
        addHandler: function(handler) {
            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function(sender) {
                var jsonSender = Ozone.util.parseJson(sender);

                handler(jsonSender.id);
            };
            OWF.Eventing.subscribe(Channels.MAP_FEATURE_STATUS_REQUEST, newHandler);
            return newHandler;  // returning to make it easy to test!
        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers: function() {
            OWF.Eventing.unsubscribe(Channels.MAP_FEATURE_STATUS_REQUEST);
        }

        /**
         * A function for handling feature status start channel messages.
         * @callback module:cmwapi/map/feature/status/Request~Handler
         * @param {string} sender The widget sending a feature status start message
         */
    };

    return Request;
});

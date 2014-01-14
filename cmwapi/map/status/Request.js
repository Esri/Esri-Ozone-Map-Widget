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
         * @param {Object|Array} data
         * @param {Array<string>} data.[types] version 1.1 only supports "about", "format", and "view"
         */
        send: function(data) {

            // validData will story results from any Validator and may be reused for internal
            // error bookkeeping.
            var validData = Validator.validObjectOrArray( data );
            var payload = validData.payload;

            if (!validData.result) {
                Error.send( OWF.getInstanceId(), Channels.MAP_STATUS_REQUEST, data,
                    validData.msg);
                return;
            }

            var isValidData = true;
            var errorMsg = '';

            for (var i=0 ; i < payload.length ; i++ ) {
                var checkTypes = Validator.validRequestTypes(payload[i].types);
                if (!checkTypes.result) {
                    isValidData = false;
                    errorMsg += checkTypes.msg + ' at index[' + i + ']. ';
                }

            }
            if (!isValidData) {
                // Send an error with the current widget instance as the sender.
                Error.send( OWF.getInstanceId(), Channels.MAP_STATUS_REQUEST, payload, errorMsg);
            } else {
                OWF.Eventing.publish(Channels.MAP_STATUS_REQUEST, payload);
            }
        },

        /**
         * Subscribes to the view channel and registers a handler to be called when messages are published to it.
         *
         * @param {module:cmwapi/map/status/Request~Handler} handler An event handler for any request messages.
         * @todo Since single item (types), working to leave it as JSON &#123;types: []&#125;.<br />
         */
        addHandler: function(handler) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function(sender, msg) {
                var jsonSender = Ozone.util.parseJson(sender);
                var jsonMsg = Ozone.util.parseJson(msg);
                if (jsonMsg.types) {
                    var checkTypes = Validator.validRequestTypes(jsonMsg.types);
                    if (checkTypes.result) {
                        handler(jsonSender.id, jsonMsg.types);
                    } else {
                        Error.send( jsonSender.id, Channels.MAP_STATUS_REQUEST, msg, checkTypes.msg);
                    }
                } else {
                    // if none requested, handle _all_
                    handler(jsonSender.id, Validator.SUPPORTED_STATUS_TYPES);
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

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
     * @exports cmwapi/map/feature/status/Stop
     */
    var Stop = {

        /**
         * An array of valid feature status event type strings.
         */
        SUPPORTED_STATUS_TYPES: Validator.SUPPORTED_FEATURE_EVENT_TYPES,

        /**
         * Sends a feature status stop message.
         * @param data {Object|Array}
         * @param data.[eventTypes] {Array<string>}
         * @param data.overlayId {String}
         * @param data.featureId {String}
         * @param data.[subfeatureId] {String}
         */
        send: function(data) {

            var validData = Validator.validObjectOrArray( data );
            var payload = validData.payload;

            if (!validData.result) {
                Error.send( OWF.getInstanceId(), Channels.MAP_FEATURE_STATUS_STOP, data,
                    validData.msg);
                return;
            }

            var isValidData = true;
            var errorMsg = '';

            for (var i=0 ; i < payload.length ; i++ ) {
                var checkEventType = Validator.validEventTypes(payload[i].eventType);
                if (!checkEventType.result) {
                   isValidData = false;
                   errorMsg += checkEventType.msg + ' at index[' + i + ']. ';
                }

            }

            if(isValidData) {
                if (payload.length === 1) {
                    OWF.Eventing.publish(Channels.MAP_FEATURE_STATUS_STOP, Ozone.util.toString(payload[0]));
                } else {
                    OWF.Eventing.publish(Channels.MAP_FEATURE_STATUS_STOP, Ozone.util.toString(payload));
                }
            } else {
                Error.send( OWF.getInstanceId(), Channels.MAP_FEATURE_STATUS_STOP, payload, errorMsg);
                return;
            }
        },

        /**
         * Subscribes to the feature.status.stop channel and registers a handler to be called when
         * messages are published to it.
         *
         * @param {module:cmwapi/map/feature/status/Stop~Handler} handler
         * @return {module:cmwapi/map/feature/status/Stop~Handler} The original event handler provided
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
                    if (data[i].eventType) {
                        var checkEventType = Validator.validEventTypes(data[i].eventType);
                        if (checkEventType.result) {
                            handler(jsonSender.id, data[i].eventType, data[i].overlayId, data[i].featureId, data[i].subfeatureId);
                        } else {
                            Error.send(jsonSender.id, Channels.MAP_FEATURE_STATUS_STOP, msg, checkEventType.msg);
                        }
                    } else {
                        // if none requested, handle _all_
                        handler(jsonSender.id, 'mouse-over', data[i].overlayId, data[i].featureId, data[i].subfeatureId);
                    }
                }
            };
            OWF.Eventing.subscribe(Channels.MAP_FEATURE_STATUS_STOP, newHandler);
            return newHandler;  // returning to make it easy to test!
        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers: function() {
            OWF.Eventing.unsubscribe(Channels.MAP_FEATURE_STATUS_STOP);
        }

        /**
         * A function for handling feature status stop channel messages.
         * @callback module:cmwapi/map/feature/status/Stop~Handler
         * @param sender {String} The widget sending a feature status stop message
         * @param eventTypes {Array<String>} types One or more of the
         *     {@link module:cmwapi/Validator/SUPPORTED_EVENT_TYPES|SUPPORTED_EVENT_TYPES} values.
         * @param overlayId {String}
         * @param featureId {String}
         * @param [subfeatureId] {String}
         */
    };

    return Stop;
});
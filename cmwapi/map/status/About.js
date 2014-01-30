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
     * @description The About module provides methods for using a map.status.about OWF Eventing channel
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
     * @todo status.about - version parameter: how to return that you support multiple versions?  and/or, how could you?
     * @todo status.about - widgetName: assume that's a "human-readable" name, rather than universal name?
     * @exports cmwapi/map/status/About
     */
    var About = {

        /**
         * An array of allowed/expected type strings of map widgets responding to CMWAPI about requests.
         * The [CMWAPI 1.1 Specification](http://www.cmwapi.org) allows for "2-D", "3-D", and "other".
         */
        SUPPORTED_MAP_TYPES: Validator.SUPPORTED_MAP_TYPES,

        /**
         * Send About information that describes this widget and its level of CMWAPI support.
         * @param {Object|Array} data
         * @param {string} data.version The version of this widget
         * @param {string} data.type One of the {@link module:cmwapi/map/status/About.TYPES_ALLOWED|TYPES_ALLOWED} values.
         * @param {string} data.widgetName - name of the map widget
         */
        send: function(data) {

            // validData will story results from any Validator and may be reused for internal
            // error bookkeeping.
            var validData = Validator.validObjectOrArray( data );
            var payload = validData.payload;
            var msg;

            // If the data was not in proper payload structure, an Object or Array of objects,
            // note the error and return.
            if (!validData.result) {
                Error.send( OWF.getInstanceId(), Channels.MAP_STATUS_ABOUT, data,
                    validData.msg);
                return;
            }

            for (var i=0; i < payload.length; i++) {

                if (!data.version) {
                    validData = false;
                    msg += 'Need a version of the CMWAPI; ';
                }
                //todo: should we validate against the set of potential versions here?

                // valid type
                if (!data.type) {
                    validData = false;
                    msg += 'Need a type of widget: see SUPPORTED_MAP_TYPES; ';
                } else {
                    var validType = Validator.validMapType(data.type);
                    if (!validType.result) {
                        validData = false;
                        msg += 'Need a type of widget within TYPES_ALLOWED; ';
                    }
                }

                // has some sort of widget name
                if (!data.widgetName) {
                    validData = false;
                    msg += 'Need a widget name; ';
                }
            }

            // Send along the payload if we did not fail validation.
            if (validData.result) {
                if (payload.length === 1) {
                    OWF.Eventing.publish(Channels.MAP_STATUS_ABOUT, Ozone.util.toString(payload[0]));
                }
                else {
                    OWF.Eventing.publish(Channels.MAP_STATUS_ABOUT, Ozone.util.toString(payload));
                }
            } else {
                Error.send( OWF.getInstanceId(), Channels.MAP_STATUS_ABOUT, payload, msg);
            }

        },

        /**
         * Subscribes to the status about channel and registers a handler to be called when messages
         * are published to it.
         *
         * @param {module:cmwapi/map/status/About~Handler} handler An event handler for any format messages.
         * @return {module:cmwapi/map/status/About~Handler} The original event handler wrapped in CMWAPI payload validation code.
         *     Where appropriate default values for missing payload attributes are filled in and
         *     invalid payloads are noted on the Error channel prior to execution of the
         *     the input handler.  Invalid payloads will short-circuit execution of the provided handler.
         */
        addHandler: function(handler) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function( sender, msg) {

                // Parse the sender and msg to JSON.
                var jsonMsg = (Validator.isString(msg)) ? Ozone.util.parseJson(msg) : msg;
                var data = (Validator.isArray(jsonMsg)) ? jsonMsg : [jsonMsg];
                var validData = true;
                var errorMsg = "";

                for (var i = 0; i < data.length; i ++) {
                    if (!data[i].version) {
                        errorMsg += 'Need a version for the status at index ' + i + '. ';
                        validData = false;
                    }
                    if (!data[i].type) {
                        errorMsg += 'Need a type of widget (see TYPES_ALLOWED) for the status at index ' + i + '. ';
                        validData = false;
                    }
                    if (!data[i].widgetName) {
                        errorMsg += 'Need a widget name for the status at index ' + i + '. ';
                        validData = false;
                    }
                }

                if (validData) {
                    handler(sender, (data.length === 1) ? data[0] : data);
                }
                else {
                    Error.send(sender, Channels.MAP_STATUS_ABOUT,
                        msg,
                        errorMsg);
                }
            };



            OWF.Eventing.subscribe(Channels.MAP_STATUS_ABOUT, newHandler);
            return newHandler;
        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers: function() {
            OWF.Eventing.unsubscribe(Channels.MAP_STATUS_ABOUT);
        }

        /**
         * A function for handling request channel messages.
         * @callback module:cmwapi/map/status/About~Handler
         * @param {Object|Array} data
         * @param {string} data.sender The widget sending an about message
         * @param {string} data.version The version of the widget
         * @param {string} data.type One of the {@link module:cmwapi/map/status/About.TYPES_ALLOWED|TYPES_ALLOWED} values.
         * @param {string} data.widgetName  The name of the widget publishing about information
         */


    };

    return About;

});

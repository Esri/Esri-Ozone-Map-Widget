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
     * @description The View module provides methods for using a map.status.view OWF Eventing channel
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
     * @exports cmwapi/map/status/View
     * @todo status.view: would we filter out if the requester isn't me?
     */
    var View = {

        /**
         * Sends a status view message.  The only real CMWAPI requirement here is what goes out over the channel.
         * @param {Object|Array} data
         * @param {string} data.requester Client that requested this status message be sent (if any). An empty requestor
         *     denotes that the message is being sent due to a map view change.
         * @param {object} data.bounds Information about the bounding view.
         * @param {object} data.bounds.southWest The southwest corner object with attributes
         * @param {number} data.bounds.southWest.lat A latitude value
         * @param {number} data.bounds.southWest.lon A longitude value
         * @param {object} data.bounds.northEast The northeast corner object with attributes
         * @param {number} data.bounds.northEast.lat A latitude value
         * @param {number} data.bounds.northEast.lon A longitude value
         * @param {object} data.center A point on which to center a map.
         * @param {number} data.center.lat The latitude value in decimal degrees.
         * @param {number} data.center.lon The longitude value in decimal degrees.
         * @param {number} data.range  The current distance in meters the map is zoomed out.
         */
        send: function(data) {

           /*
            Validate data provided
            */
            var msg = '';

            // validData will story results from any Validator and may be resused for internal
            // error bookkeeping.
            var validData = Validator.validObjectOrArray( data );
            var payload = validData.payload;
            var isValidData = true;

            // If the data was not in proper payload structure, an Object or Array of objects,
            // note the error and return.
            if (!validData.result) {
                Error.send( OWF.getInstanceId(), Channels.MAP_STATUS_VIEW, data,
                    validData.msg);
                return;
            }

            // Check all the feature objects; fill-in any missing attributes.
            for (var i = 0; i < payload.length; i++) {

                // validate bounds
                var checkBounds = Validator.validBounds(payload[i].bounds);
                if (!checkBounds.result) {
                    msg += checkBounds.msg +'  for view index[' + i + ']. ';
                    isValidData = false;
                }
                var checkCenter = Validator.validCenter(payload[i].center);
                if (!checkCenter.result) {
                    msg += checkCenter.msg+' for view index[' + i + ']. ';
                    isValidData = false;
                }
                var checkRange = Validator.validRange(payload[i].range);
                if (!checkRange.result) {
                    msg+=checkRange.msg+' for view index[' + i + ']. ';
                    isValidData = false;
                }
            }
            if (!isValidData) {
                Error.send( OWF.getInstanceId(), Channels.MAP_STATUS_VIEW,
                    payload,
                    msg);
            } else {
                if (payload.length === 1) {
                    OWF.Eventing.publish(Channels.MAP_STATUS_VIEW, Ozone.util.toString(payload[0]));
                } else {
                    OWF.Eventing.publish(Channels.MAP_STATUS_VIEW, Ozone.util.toString(payload));
                }
            }

        },

        /**
         * Subscribes to the view channel and registers a handler to be called when messages are published to it.
         *
         * @param {module:cmwapi/map/status/View~Handler} handler An event handler for any view messages.
         * @return {module:cmwapi/map/status/View~Handler} The original event handler wrapped in CMWAPI payload validation code.
         *     Where appropriate default values for missing payload attributes are filled in and
         *     invalid payloads are noted on the Error channel prior to execution of the
         *     the input handler.  Invalid payloads will short-circuit execution of the provided handler.
         */
        addHandler: function(handler) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function(sender, msg) {

                // Parse the sender and msg to JSON.
                var jsonMsg = (Validator.isString(msg)) ? Ozone.util.parseJson(msg) : msg;
                var data = (Validator.isArray(jsonMsg)) ? jsonMsg : [jsonMsg];

                var isValidData= true;

                for (var i = 0; i < data.length; i ++) {

                    // No real validation for requester as it is optional; The other
                    // elements need to be validated.
                    var checkResult = Validator.validBounds(data[i].bounds);
                    if (!checkResult.result) {
                        msg += checkResult.msg + ' for the status at index ' + i + '. ';
                        isValidData = false;
                    }
                    checkResult = Validator.validCenter(data[i].center);
                    if (!checkResult.result) {
                        msg += checkResult.msg +';';
                        isValidData = false;
                    }
                    checkResult = Validator.validRange(data[i].range);
                    if (!checkResult.result) {
                        msg += checkResult.msg +';';
                        isValidData = false;
                    }
                }

                if (isValidData) {
                    handler(sender, jsonMsg.requester, jsonMsg.bounds, jsonMsg.center, jsonMsg.range );
                } else {
                    var msgOut = Ozone.util.toString({requester: jsonMsg.requester, bounds: jsonMsg.bounds,
                        center: jsonMsg.center, range: jsonMsg.range});
                    Error.send(sender, Channels.MAP_STATUS_VIEW, msgOut, msg );
                }
            };

            OWF.Eventing.subscribe(Channels.MAP_STATUS_VIEW, newHandler);
            return newHandler;
        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers: function() {
            OWF.Eventing.unsubscribe(Channels.MAP_STATUS_VIEW);
        }

        /**
         * A function for handling View channel messages.
         * @callback module:cmwapi/map/status/View~Handler
         * @param {Object|Array} data
         * @param {string} data.sender The widget sending a view message
         * @param {object} data.bounds Information about the bounding view.
         * @param {object} data.bounds.southWest The southwest corner object with attributes
         * @param {number} data.bounds.southWest.lat A latitude value
         * @param {number} data.bounds.southWest.lon A longitude value
         * @param {object} data.bounds.northEast The northeast corner object with attributes
         * @param {number} data.bounds.northEast.lat A latitude value
         * @param {number} data.bounds.northEast.lon A longitude value
         * @param {object} data.center A point on which to center a map.
         * @param {number} data.center.lat The latitude value in decimal degrees.
         * @param {number} data.center.lon The longitude value in decimal degrees.
         * @param {number} data.range The current distance in meters the map is zoomed out.
         */
    };

    return View;

});

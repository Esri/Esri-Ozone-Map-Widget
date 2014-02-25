define(["cmwapi/Channels", "cmwapi/Validator"], function(Channels, Validator) {
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
     * @description Defines the Error channel module according to the CMW API 1.1 specification
     *
     * @todo error sender - instance id or widget id? (inferring by example, need to ask on forums)
     * @todo error description - no common list, correct?
     *
     * @version 1.1
     *
     * @exports cmwapi/map/Error
     */
    var Error = {

        /**
         * @private
         * @param arguments presumably comprised of 4 elements
         * @param {string} arguments.[0] - sender of message that caused error
         * @param {string} arguments.[1] - type of message that caused error (example seems to be cmwapi call: e.g., map.feature.hide)
         * @param {string} arguments.[2] - message that caused the error  (example seems to be payload)
         * @param {string} arguments.[3] error - a description of the error
         * @returns {Object} payload - payload or null, if didn't get all 4 values
         * @returns {string} payload.sender
         * @returns {string} payload.type
         * @returns {string} payload.msg
         * @returns {string} payload.error
         */
        sendHelper: function( ) {
            var sendPayload = null;

            if (arguments[0].length === 4) {
                sendPayload = { sender: arguments[0][0],
                    type: arguments[0][1],
                    msg: arguments[0][2],
                    error: arguments[0][3]
                };
            }
            return sendPayload;
        },

        /**
         * Send information that supports the creation of a map overlay.
         * @param {Object|Array} data
         * @param {string} data.sender sender of message that caused error
         * @param {string} data.type type of message that caused error (example seems to be cmwapi call: e.g., map.feature.hide)
         * @param {string} data.msg message that caused the error  (example seems to be payload)
         * @param {string} data.error a description of the error
         */
        send: function(data) {

            // cheat, for folks who are using the previous simple approach of sending across sender, type, msg, error...
            if (arguments.length === 4) {
                data = Error.sendHelper(arguments);
            }

            var validData = Validator.validObjectOrArray( data );
            var payload = validData.payload;

            // If the data was not in proper payload structure, an Object or Array of objects,
            // note the error and return.
            // If we call Error here, this will get us in a recursive loop!
            if (!validData.result) {
                //console.error ("Unable to send on error channel - sent data is not valid: [data: " + data + "].  " + validData.msg);
                Error.send( OWF.getInstanceId(), Channels.MAP_ERROR, data,
                    validData.msg);
                return;
            }

            for (var i=0; i < payload.length; i++) {
                // all attributes are required
                if (! payload[i].sender || ! payload[i].type || ! payload[i].msg || ! payload[i].error ) {
                    Error.send( OWF.getInstanceId(), Channels.MAP_ERROR, payload[i], "Missing attribute in sender, type, msg, or error");
                } else {
                    // if an error message fails silently, want the rest to succeed, so sending along as we have them..
                    OWF.Eventing.publish(Channels.MAP_ERROR, Ozone.util.toString(payload[i]));
                }
            }
        },

        /**
         * Subscribes to the error channel and registers a handler to be called when messages are published to it.
         *
         * @param {module:cmwapi/map/Error~Handler} handler An event handler for any creation messages.
         * @returns {module:cmwapi/map/Error~ReturnedHandler} Wrapped handler, useful for testing
         */
        addHandler: function(handler) {

            // Following pattern of wrapping the handler, to let us deal with test code
            var newHandler = function(sender, msg) {

                // Parse the sender and msg to JSON.
                var jsonSender = Ozone.util.parseJson(sender);
                var jsonMsg = (Validator.isString(msg)) ? Ozone.util.parseJson(msg) : msg;
                var data = (Validator.isArray(jsonMsg)) ? jsonMsg : [jsonMsg];
                var validData = true;

                if (validData) {
                    handler(jsonSender.id, (data.length === 1) ? data[0] : data);
                } else {
                    // nothing really that can be done if the error message itself has an error...
                    console.log("Error handler is being given invalid data: " + msg);
                }

            };

            OWF.Eventing.subscribe(Channels.MAP_ERROR, newHandler);

            return newHandler;

        },

        /**
         * Stop listening to the error channel and handling events upon it.
         */
        removeHandlers: function() {
            OWF.Eventing.unsubscribe(Channels.MAP_ERROR);
        }

        /**
         * A function for handling error channel messages.
         * @callback module:cmwapi/map/Error~Handler
         * @param {string} sender sender of message that caused error (since cmwapi is pub/sub, could be you - can opt to ignore)
         * @param {string} type type of message that caused error
         * @param {string} msg the message that caused the error
         * @param {string} error a description of the error
         */

        /**
         * A function for handling error channel messages.
         * @callback module:cmwapi/map/Error~ReturnedHandler
         * @param {string} sender sender of message that caused error (since cmwapi is pub/sub, could be you - can opt to ignore)
         * @param {string} msg the message that caused the error
         * @param {string} msg.type
         * @param {string} msg.msg
         * @param {string} msg.error
         */

    };

    return Error;

});

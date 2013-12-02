define(["cmwapi/Channels"], function(Channels) {
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
     * @exports cmwapi/map/Error
     */
    var Error = {

        /**
         *
         * @param sender - sender of message that caused error
         * @param type - type of message that caused error (example seems to be cmwapi call: e.g., map.feature.hide)
         * @param msg - message that caused the error  (example seems to be payload)
         * @param error - a description of the error
         */
        send: function(sender, type, msg, error) {
            var sendPayload = { sender: sender,
                type: type,
                msg: msg,
                error: error
            };
            OWF.Eventing.publish(Channels.MAP_ERROR, Ozone.util.toString(sendPayload));

        },

        /**
         * Subscribes to the error channel and registers a handler to be called when messages are published to it.
         * 
         * @param {module:cmwapi/map/Error~Handler} handler An event handler for any creation messages.
         *
         */
        addHandler: function(handler) {

            // Following pattern of wrapping the handler, to let us deal with test code
            var newHandler = function(sender, msg) {

                // nothing really that can be done if the error message itself has an error...
                handler(sender, msg.type, msg.msg, msg.error);
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

    };

    return Error;

});

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
     * @description The Zoom module provides methods for using an OWF Eventing channel
     * according to the [CMWAPI 1.1 Specification](http://www.cmwapi.org) to specify the zoom level of a map.  This module
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
     * @module cmwapi/map/view/Zoom
     */
    var Zoom = {

        /**
         * Send information that supports the zoom level of a map overlay.
         * @method send
         * @param {Object|Object[]} data
         * @param {String} data.range The range in meters at which the a view should be zoomed in/out.
         * @memberof module:cmwapi/map/view/Zoom
         */
        send: function(data) {

            var validData = Validator.validObjectOrArray( data );
            var payload = validData.payload;

            // If the data was not in proper payload structure, an Object or Array of objects,
            // note the error and return.
            if (!validData.result) {
                Error.send( OWF.getInstanceId(), Channels.MAP_VIEW_ZOOM, data,
                    validData.msg);
                return;
            }

            // Check all the overlay objects; fill-in any missing attributes.
            for (var i = 0; i < payload.length; i ++) {
                // A range level must be defined.
                if (!payload[i].range || !Validator.isNumber(payload[i].range)) {
                    validData.result = false;
                    validData.msg += 'Need a range at which to set the view for payload ' + i + '. ';
                }
            }

            if (validData.result) {
                if (payload.length === 1) {
                    OWF.Eventing.publish(Channels.MAP_VIEW_ZOOM, Ozone.util.toString(payload[0]));
                }
                else {
                    OWF.Eventing.publish(Channels.MAP_VIEW_ZOOM, Ozone.util.toString(payload));
                }
            }
            else {
                Error.send( OWF.getInstanceId(), Channels.MAP_VIEW_ZOOM,
                    Ozone.util.toString(data),
                    validData.msg);
            }

        },

        /**
         * Subscribes to the overlay show channel and registers a handler to be called when messages
         * are published to it.
         * @method addHandler
         * @param {module:cmwapi/map/view/Zoom~Handler} handler An event handler for any show messages.
         * @memberof module:cmwapi/map/view/Zoom
         */
        addHandler: function(handler) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function(sender, msg) {

                // Parse the sender and msg to JSON.
                var jsonMsg = (Validator.isString(msg)) ? Ozone.util.parseJson(msg) : msg;
                var data = (Validator.isArray(jsonMsg)) ? jsonMsg : [jsonMsg];
                var validData = {result: true, msg: ""};

                for (var i = 0; i < data.length; i ++) {
                    // A range level must be defined.
                    if (!data[i].range || !Validator.isNumber(data[i].range)) {
                        validData.result = false;
                        validData.msg += 'Need a range at which to set the view for payload ' + i + '. ';
                    }
                }

                if (validData.result) {
                    handler(sender, (data.length === 1) ? data[0] : data);
                }
                else {
                    Error.send(sender, Channels.MAP_VIEW_ZOOM,
                        msg,
                        validData.msg);
                }
            };

            OWF.Eventing.subscribe(Channels.MAP_VIEW_ZOOM, newHandler);
            return newHandler;
        },

        /**
         * Stop listening to the channel and handling events upon it.
         * @method removeHandlers
         * @memberof module:cmwapi/map/view/Zoom
         */
        removeHandlers: function() {
            OWF.Eventing.unsubscribe(Channels.MAP_VIEW_ZOOM);
        }

        /**
         * A function for handling channel messages.
         * @callback module:cmwapi/map/view/Zoom~Handler
         * @param {String} sender The widget sending a format message
         * @param {Object|Object[]} data  A data object or array of data objects.
         * @param {String} data.range The range in meters at which the a view should be zoomed in/out.
         * @memberof module:cmwapi/map/view/Zoom
         */
    };

    return Zoom;

});

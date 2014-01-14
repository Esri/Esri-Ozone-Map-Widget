define(["cmwapi/Channels", "cmwapi/map/Error", "cmwapi/Validator"], function(Channels, Error, Validator) {

    var REQUIRED_FORMATS = ["kml", "wms"];

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
     * @description The Format module provides methods for using a map.status.format OWF Eventing channel
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
     * @exports cmwapi/map/status/Format
     */
    var Format = {

        /**
         * A string array of the minimum formats required by any maps that support the CMWAPI 1.1:
         * "kml" and "wms".
         */
        REQUIRED_FORMATS: REQUIRED_FORMATS,

        /**
         * Send out the list of data formats that this map supports.
         * @todo Consider not validating against any set list here or making sure that the passed in formats contains
         * at least the required formats.  If not, an error is thrown on the error channel.  Quesion: Do we send only
         * if there is no error?  Or always send the provided formats?
         */
        send: function(data) {

            // validData will story results from any Validator and may be reused for internal
            // error bookkeeping.
            var validData = Validator.validObjectOrArray( data );
            var payload = validData.payload;

            if (!validData.result) {
                //console.error ("Unable to send on error channel - sent data is not valid: [data: " + data + "].  " + validData.msg);
                Error.send( OWF.getInstanceId(), Channels.MAP_STATUS_FORMAT, data,
                    validData.msg);
                return;
            }

            var formatsSet = [];
            for (var i=0; i < payload.length; i++)  {
                var listedFormats = payload[i].formats;

                if (listedFormats instanceof Array) {
                    for (var j=0; j < listedFormats.length; j++ ) {
                        if (! Validator.containsValue(formatsSet, listedFormats[j])) {
                            formatsSet.push(listedFormats[j]);
                        }
                    }
                }
            }

            // verify that we're also including REQUIRED_FORMATS
            for (var k=0; k < REQUIRED_FORMATS.length; k++) {
                if (! Validator.containsValue(formatsSet, REQUIRED_FORMATS[k])) {
                    formatsSet.push(REQUIRED_FORMATS[k]);
                }
            }

            // note: this may cause us to send the same format value more than once...
            // blend data given with REQUIRED_FORMATS...
            OWF.Eventing.publish(Channels.MAP_STATUS_FORMAT, Ozone.util.toString({'formats': formatsSet}));
        },

        /**
         * Subscribes to the status formats channel and registers a handler to be called when messages
         * are published to it.
         *
         * @param {module:cmwapi/map/status/Format~Handler} handler An event handler for any format messages.
         */
        addHandler: function(handler) {

            // no real validation here...
            var newHandler = function(sender, msg) {

                // Parse the sender and msg to JSON.
                var jsonMsg = (Validator.isString(msg)) ? Ozone.util.parseJson(msg) : msg;
                var data = (Validator.isArray(jsonMsg)) ? jsonMsg : [jsonMsg];

                for (var i = 0; i < data.length; i ++) {
                    if (!data[i].formats) {
                        Error.send(sender, Channels.MAP_STATUS_FORMATS, msg, "Unable to determine formats" );
                    } else {
                        handler(sender, data[i]);
                    }
                }
            };

            OWF.Eventing.subscribe(Channels.MAP_STATUS_FORMAT, newHandler);
            return newHandler;

        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers: function() {
            OWF.Eventing.unsubscribe(Channels.MAP_STATUS_FORMAT);
        }

        /**
         * A function for handling request channel messages.
         * @callback module:cmwapi/map/status/Format~Handler
         * @param {string} sender The widget sending a format message
         * @param {object} msg The formats requested in a JSON object.  {formats: String[]}
         */
    };

    return Format;

});

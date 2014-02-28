define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error"],
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
     * @description The Print module provides methods for using an OWF Eventing channel
     * according to an extention of the [CMWAPI 1.1 Specification](http://www.cmwapi.org) to print a view of a map.  This module
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
     * Since the Print channel is an extension of the CMWAPI it can pass values that are not standarized accross the API
     * an example of this would be specification of print templates in the passed data.  An example of a valid print template
     * is as follows:
     * {
     *     template: {
     *          name: "Letter ANSI A Landscape",
     *          label: "Landscape (PDF)",
     *          format: "pdf",
     *          options: {
     *              legendLayers: [], // empty array means no legend
     *              scalebarUnit: "Miles",
     *              titleText: "Landscape PDF"
     *           }
     *      }
     *  }
     *
     * @version 1.1
     *
     * @exports cmwapi/map/view/Print
     */
    function(Channels, Validator, Error) {


    var Print = {

        send : function (data) {

            var validData = Validator.validObjectOrArray(data);
            var payload = validData.payload;

            if (!validData.result) {
                Error.send(OWF.getInstanceId(), Channels.MAP_VIEW_PRINT, data, validData.msg);
                return;
            }

            for (var i = 0; i < payload.length; i ++) {
                if (payload[i].template && !Validator.validObjectOrArray(payload[i].template).result) {
                    validData.result = false;
                    validData.msg += 'Specified template is incorrect or invalid  ' + i + '. ';
                }
            }

            if (validData.result) {
                if (payload.length === 1) {
                    OWF.Eventing.publish(Channels.MAP_VIEW_PRINT, Ozone.util.toString(payload[0]));
                } else {
                    OWF.Eventing.publish(Channels.MAP_VIEW_PRINT, Ozone.util.toString(payload));
                }
            } else {
                Error.send(OWF.getInstanceId(), Channels.MAP_VIEW_PRINT, Ozone.util.toString(data), validData.msg);
            }

        },

        addHandler : function (handler) {

            var newHandler = function(sender, msg) {
                var jsonSender = Ozone.util.parseJson(sender);
                var jsonMsg = (Validator.isString(msg)) ? Ozone.util.parseJson(msg) : msg;
                var data = (Validator.isArray(jsonMsg)) ? jsonMsg : [jsonMsg];
                var validData = {result: true, msg: ""};

                for (var i = 0; i < data.length; i ++) {
                    if (data[i].template && !Validator.validObjectOrArray(data[i].template).result) {
                        validData.result = false;
                        validData.msg += 'Specified template is incorrect or invalid  ' + i + '. ';
                    }
                }
                if (validData.result) {
                    handler(jsonSender.id, (data.length === 1) ? data[0] : data);
                } else {
                    Error.send(jsonSender.id, Channels.MAP_VIEW_PRINT,msg, validData.msg);
                }
            };

            OWF.Eventing.subscribe(Channels.MAP_VIEW_PRINT, newHandler);
            return newHandler;
        },

        removeHandlers : function() {
            OWF.Eventing.unsubscribe(Channels.MAP_VIEW_PRINT);
        }
    };

    return Print;
});

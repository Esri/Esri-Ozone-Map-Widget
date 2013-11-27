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
 */
define(["cmwapi/cmwapi"], function(CommonMapApi) {
    var ErrorAdapter = function() {
        var me = this;

        /**
         * Build and send an error
         * @method error.error
         * @param caller {String} The id of the widget which sent a call triggering the event causing this error
         * @param message {String} The readable message for the error
         * @param err {object} The object representing the error details data
         * @memberof! module:EsriAdapter#
         */
        me.error = function(caller, message, err) {
            var sender = caller;
            var type = err.type;
            var msg = message;
            var error = err;

            CommonMapApi.error.send(sender, type, msg, error);
        };

        /**
         * handle an error
         * @method error.handleError
         * @param sender {String} The id of the widget which send the error message
         * @param type {String} The type of error for which the message corresponds
         * @param message {String} The readable error message
         * @param error {object} The object representing the error details data
         * @memberof! module:EsriAdapter#
         */
        me.handleError = function(sender, type, message, error) {
            //TODO
        };
        CommonMapApi.error.addHandler(me.handleError);
    };

    return ErrorAdapter;
});
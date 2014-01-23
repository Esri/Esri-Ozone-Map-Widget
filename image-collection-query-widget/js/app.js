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

// Entry point for map webapp
//
// NOTE: Modules that are not compatible with asynchronous module loading
// (AMD) are included in the webapp's HTML file to prevent issues.
require([
    "dojo/parser", "dijit/form/DateTextBox", "dojo/dom-style", "dojo/domReady!"],
    function(parser, DateTextBox) {
        parser.parse();



        if (OWF.Util.isRunningInOWF()) {
            OWF.ready(function () {
                $("[rel=tooltip]").tooltip({ placement: 'bottom'});
                OWF.notifyWidgetReady();
           });
        }
});

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

// NOTE: Modules that are not compatible with asynchronous module loading
// (AMD) are included in the webapp's HTML file to prevent issues.
require(["cmwapi/cmwapi", "esri/dijit/Gauge", "dojo/parser", "dojo/domReady!"], function(CMWAPI, Gauge, parser) {
    parser.parse();

    console.debug("Starting gauge widget");
    var knownMaps = {};

    if(OWF.Util.isRunningInOWF()) {
        OWF.ready(function() {
            var gauge = new Gauge({
                title: "test"
            }, 'gauge');
            gauge.startup();

            CMWAPI.status.format.addHandler(function(callerID, data){
                try{
                var formats = data.formats;
                for(var i = 0; i < formats.length; i++) {
                    if(formats[i] === "arcgis-dynamicmapservice" ||
                        formats[i] === "arcgis-imageservice" ||
                        formats[i] === "arcgis-feature" ) {
                        knownMaps[callerID] = {};
                        break;
                    }
                }
                } catch(e) {
                    console.debug(e);
                }
            });

            console.debug("Calling map.status.request");
            CMWAPI.status.request.send({types: ["format"]});
        });
    }

    var addToDropdown = function(guid) {
        knownMaps.push(guid);
        if(knownMaps.length > 1) {
            //check for dropdown
            console.log($("select.map_selection_dropdown"));

            //get all widgets so we can pull id? --> point being how do we get the name?

            //add if its not there
            //make sure all options are in list and still open
        }
    };

    var changeSelection = function() {
        //send message to setup on event to new
        CMWAPI.feature.status.start.send({type: 'mouse-over'});
        //send message to stop on event to old
        CMWAPI.feature.status.start.send({});
    };

    //on dropdown popout double check open maps
});

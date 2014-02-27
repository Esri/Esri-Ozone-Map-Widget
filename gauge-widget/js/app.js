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

    var knownMaps = {};
    var mapLayers = {};

    var selectedMapId;
    var selectedOverlayId;
    var selectedFeatureId;
    var selectedSubfeatureId;
    var selectedEventType = 'mouse-over';

    var gauge;

    var checkMapResponse = function(callerId, data){
        var mapSelector = $(".map_selector");

        var formats = data.formats;
        for(var i = 0; i < formats.length; i++) {
            if(formats[i] === "arcgis-dynamicmapservice" ||
                formats[i] === "arcgis-imageservice" ||
                formats[i] === "arcgis-feature" ) {

                //if its not in the list and drop down then add it
                if(typeof(knownMaps[callerId]) === "undefined") {
                    knownMaps[callerId] = {};
                    mapSelector.append("<option mapId=" + callerId + ">" + callerId + "</option>");
                }
                break;
            }
        }
    };

    var handleMapSelected = function() {
        CMWAPI.feature.status.request.send();
    }

    var handleReceivedLayers = function(sender, layers) {
        var selected = $(".map_selector option:selected");
        var mapWidgetId = selected.attr("mapId");

        var layerSelector = $('.sublayer_selector');

        if(!CMWAPI.validator.isArray(layers)) {
            layers = [layers];
        }

        for(var i = 0; i < layers.length; i++) {
            if(sender === mapWidgetId) {

                layerSelector.append('<option overlayId="' + layers[i].overlayId +
                    '" featureId="' + layers[i].featureId +
                    '" sublayerId="' + layers[i].sublayerId +
                    '">' + layers[i].overlayName + " - " + layers[i].featureName + " - " +
                    layers[i].sublayerId + '</option>');
            }
        }
    }

    var handleChangeSelection = function() {
        //send message to stop reporting old
        if(selectedOverlayId && selectedFeatureId) {
            CMWAPI.feature.status.stop.send({
                type: selectedEventType,
                overlayId: selectedOverlayId,
                featureId: selectedFeatureId,
                subfeatureId: selectedSubfeatureId
            });
        }

        var selected = $('.sublayer_selector option:selected');

        selectedOverlayId = selected.attr("overlayId");
        selectedFeatureId = selected.attr("featureId");
        selectedSubfeatureId = selected.attr("sublayerId");

        //send message to setup on event to new
        CMWAPI.feature.status.start.send({
            type: selectedEventType,
            overlayId: selectedOverlayId,
            featureId: selectedFeatureId,
            subfeatureId: selectedSubfeatureId
        });
    };

    var handleReport = function(sender, overlayId, featureId, subfeatureId, value) {
        if(overlayId === selectedOverlayId &&
            featureId === selectedFeatureId &&
            subfeatureId === selectedSubfeatureId) {
            gauge.set('value', value);
            gauge.set('caption', value);
        }
    }

    if(OWF.Util.isRunningInOWF()) {
        OWF.ready(function() {
            gauge = new Gauge({}, 'gauge');
            gauge.startup();

            CMWAPI.status.format.addHandler(checkMapResponse);

            CMWAPI.status.request.send({types: ["format"]});

            $(".map_selector").on('change', handleMapSelected);
            $(".sublayer_selector").on('change', handleChangeSelection);

            CMWAPI.feature.status.sublayers.addHandler(handleReceivedLayers);
            CMWAPI.feature.status.report.addHandler(handleReport);
        });
    }
});

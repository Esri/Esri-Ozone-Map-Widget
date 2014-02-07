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
 * OWF-Context-Map
 * Allows a user to click, or double a point and send out an event on the CMWAPI that will center the
 * any map based on that point.  Also allows a user to click and drag a bounding box that will set the
 * extent of any map implementing the CMWAPI.
 */

require([
    "esri/map", "esri/toolbars/draw", "esri/geometry/webMercatorUtils", "cmwapi/cmwapi", "dojo/domReady!"],
    function(Map, Draw, webMercatorUtils, CommonMapApi) {
        var map = new Map("mapDiv", {
            center: [-77.035841, 38.901721],
            zoom: 1,
            basemap: "streets",
            slider:false
        });

        var sendClickEvent = function(e) {
            var locationEvent = {};
            locationEvent.location = {lat: e.mapPoint.getLatitude(), lon: e.mapPoint.getLongitude()};
            CommonMapApi.view.center.location.send(locationEvent);
        };

        var sendDragEvent = function(e) {
            var locationEvent = {};
            locationEvent.bounds = {};
            var extent = webMercatorUtils.webMercatorToGeographic(e.geometry);
            locationEvent.bounds.southWest = {lat: extent.ymin, lon: extent.xmin};
            locationEvent.bounds.northEast = {lat: extent.ymax, lon: extent.xmax};
            locationEvent.zoom = 'auto';
            CommonMapApi.view.center.bounds.send(locationEvent);
        };

        //Map is initialized as a map with all controls disabled in order to act a contextual map in which
        //a user uses its overview to direct the flow of other maps.
        var initMap = function() {
            map.disableMapNavigation();
            map.enableRubberBandZoom();
            map.setMapCursor("crosshair");
            var draw = new Draw(map, { showTooltips: false });
            draw.activate(esri.toolbars.Draw.EXTENT);
            if (OWF.Util.isRunningInOWF()) {
                OWF.ready(function () {
                    OWF.notifyWidgetReady();
                    map.on('dbl-click', sendClickEvent);
                    map.on('click', sendClickEvent);
                    draw.on('draw-end', sendDragEvent);
                });
            }
        };

        map.on('load', initMap);
    }
);

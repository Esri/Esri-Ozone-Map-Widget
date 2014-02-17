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
    "esri/map", "esri/toolbars/draw", "esri/graphic", "esri/geometry/Extent", "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol",
    "esri/layers/GraphicsLayer", "dojo/_base/Color", "esri/geometry/webMercatorUtils", "cmwapi/cmwapi", "dojo/domReady!"],
    function(Map, Draw, Graphic, Extent, SimpleFillSymbol, SimpleLineSymbol, GraphicsLayer, Color, webMercatorUtils, CommonMapApi) {
        var clickEvent, doubleClickEvent;

        var map = new Map("mapDiv", {
            wrapAround180: false,
            center: [-77.035841, 38.901721],
            zoom: 1,
            basemap: "streets",
            slider:false
        });

        var extentColors = [new Color([255,0,0,1]), new Color([0,255,0,1]), new Color([0,0,255,1])];
        var mapIds = {};
        var mapColorCount = {};
        var contextCount = 0;

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

        //Function that uses the CMWAPI to listen to the status view channel and update the conext map with appropriate shaded areas to show
        //the current views of the other maps on the dashboard.
        var statusHadler = function() {
            CommonMapApi.status.view.addHandler(function(jsonID, senderID, msg) {
                var sourceID = OWF.Util.parseJson(jsonID).id;
                var northEast = msg.northEast;
                var southWest = msg.southWest;
                var extent = webMercatorUtils.geographicToWebMercator(new Extent(
                    southWest.lon,
                    southWest.lat,
                    northEast.lon,
                    northEast.lat,
                    map.spatialReference));

                var layer = new GraphicsLayer();
                if(mapIds[sourceID.toString()]) {
                    map.removeLayer(mapIds[sourceID.toString()]);
                } else {
                    mapColorCount[sourceID.toString()] = contextCount++;
                }
                mapIds[sourceID.toString()] = layer;

                var symbol =  new SimpleFillSymbol(
                    SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, extentColors[mapColorCount[sourceID.toString()]], 1),
                    new Color([125,125,125,0.35]));

                layer.add(new Graphic(extent, symbol));
                map.addLayer(layer);
            });
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
                    statusHadler();
                    map.on('dbl-click', sendClickEvent);
                    map.on('click', sendClickEvent);
                    draw.on('draw-end', sendDragEvent);
                    CommonMapApi.status.request.send({types:['view']});
                });
            }
        };

        map.on('load', initMap);
    }
);

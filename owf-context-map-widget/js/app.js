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
    "esri/map", "esri/toolbars/draw", "esri/graphic", "esri/geometry/Extent", "esri/SpatialReference", "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol",
    "esri/layers/GraphicsLayer", "dojo/_base/Color", "esri/geometry/webMercatorUtils", "cmwapi/cmwapi", "dojo/domReady!"],
    function(Map, Draw, Graphic, Extent, SpatialReference, SimpleFillSymbol, SimpleLineSymbol, GraphicsLayer, Color, webMercatorUtils, CommonMapApi) {
        var clickEvent, doubleClickEvent;

        var map = new Map("mapDiv", {
            wrapAround180: false,
            center: [0, 0],
            basemap: "streets",
            slider:false,
            autoResize: false
        });

        var extentColors = [new Color([228,26,28,1]), new Color([55,126,184,1]), new Color([77,175,74,1]), new Color([152,78,163,1]),
            new Color([255,127,0,1])];
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
                var extent = new Extent(southWest.lon,
                    southWest.lat,
                    northEast.lon,
                    northEast.lat,
                    new SpatialReference(4326));

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

                // Handle the case out extent encompasses pretty much the entire world.  Using 359.9999 here instead of
                // 360 to allow for some rounding error.  Also catch the case where rounding errors may have
                // made xmax < xmin on very large extents that encompass nearly all of the globe.
                if (Math.abs(extent.xmax - extent.xmin) >= 359.999999 ||
                    (Math.abs(extent.xmax - extent.xmin) <= 0.000001 && extent.xmax < extent.xmin)) {
                    layer.add(new Graphic(new Extent(-180,
                        extent.ymin,
                        180,
                        extent.ymax,
                        extent.spatialReference), symbol));
                }
                // Handle the case where our bounding box wraps around the international date
                // line.  In this case, we draw two bounding boxes to show the wrapping area.
                else if (extent.xmax < extent.xmin) {
                    layer.add(new Graphic(new Extent(extent.xmin,
                        extent.ymin,
                        180,
                        extent.ymax,
                        extent.spatialReference), symbol));
                    layer.add(new Graphic(new Extent(-180,
                        extent.ymin,
                        extent.xmax,
                        extent.ymax,
                        extent.spatialReference), symbol));
                }
                // Otherwise draw a normal bounding box.
                else {
                    layer.add(new Graphic(extent, symbol));
                }

                map.addLayer(layer);
            });
        };

        //Map is initialized as a map with all controls disabled in order to act a contextual map in which
        //a user uses its overview to direct the flow of other maps.
        var initMap = function() {
            //map.disableMapNavigation();
            map.disableShiftDoubleClickZoom();
            map.disableScrollWheelZoom();
            map.enableRubberBandZoom();
            map.setMapCursor("crosshair");

            // set the zoom level based upon how many times the max zoomed world tile could
            // be expanded within our widget's height and width without obscuring any of the
            // image.
            var numberBaseImages = Math.floor(Math.min(map.height / 256, map.width / 256));
            numberBaseImages = (numberBaseImages >= 1) ? numberBaseImages : 1;
            map.setZoom(Math.floor(Math.log(numberBaseImages) / Math.log(2)));

            // Activate the drawing tools.
            var draw = new Draw(map, { showTooltips: false });
            draw.activate(esri.toolbars.Draw.EXTENT);

            // Check for OWF before setting up OWF-based events.
            if (OWF.Util.isRunningInOWF()) {
                OWF.ready(function () {
                    OWF.notifyWidgetReady();
                    statusHadler();
                    map.on('dbl-click', sendClickEvent);
                    map.on('click', sendClickEvent);
                    draw.on('draw-end', sendDragEvent);
                    CommonMapApi.status.request.send({types:['view']});

                    // Use the widget state API to reposition the context map
                    // when the widget is resized.
                    var widgetState = Ozone.state.WidgetState.getInstance({
                        onStateEventReceived: function(sender, msg) {
                            var eventName = msg.eventName;
                            console.log(eventName);
                            if (eventName === 'resize') {
                                // Here we're reloading the window assuming resize events are
                                // not often.  This forces the layout to be completely
                                // reconfigured and avoid some issues with trying to use
                                // map.resize() or map.reposition() to affect the same change.
                                // Using those methods or having the map auto-resize
                                // was not properly repositioning full extent map images on
                                // and lead to extensive whitespace borders.  It may be worth
                                // revisiting this in the future to avoid reloading the map
                                // and saving an extra server call.
                                window.location.reload();
                            }
                        }
                    });
                    widgetState.addStateEventListeners({
                        events: ['resize']
                    })
                });
            }
        };

        map.on('load', initMap);
    }
);

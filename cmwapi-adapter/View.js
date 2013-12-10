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
define(["cmwapi/cmwapi", "esri/kernel", "esri/geometry/Extent", "esri/geometry/Point"],
    function(CommonMapApi, EsriNS, Extent, Point) {

    /** Assumed default DPI for your average screen resolution. */
    var DEFAULT_DPI = 96;
    /** Assumed DPI for a high DPI screen.*/
    var HIGH_DPI = 120;

    /**
     * Calculates the scale at which to simulate a view at the given altitude in meters. We are assuming
     * either an average 96 dpi or high 120 dpi for screen resolution since there's few reliable
     * ways to query that across a range of legacy browsers. Assuming an altitude above a flat map, 
     * we can use the law of sines and an estimated view angle of 60 degrees to the left/right of 
     * a viewer's centerline to determine how much of the map they can view.  This distance is then 
     * converted to a scale value and set on the input map.  This course method assumes basic trigonometric
     * functions on a mercator projection and is not likely to be exact.  However, given that most basemaps
     * use discrete scales and zoom levels, this value will map to the nearest scale anyway and may
     * suffice for this application.
     * @private
     * @param {Map} map An ArcGIS JavaScript map
     * @param {number} alt An viewing altitude in meters for which we need to find an equivalent scale.
     * @returns {number} A scale value appropriate to the input map.
     * @todo In testing against other maps, this appears to be correct assuming the units 
     * in ArcGIS map.getScale().
     * @see http://resources.esri.com/help/9.3/arcgisserver/apis/silverlight/apiref/topic380.html  
     */
    var zoomAltitudeToScale = function(map, alt) {
        // (altitude in meters) * sin(60 deg) / sin(30 deg) to get half the view width in meters.
        var widthInMeters = (alt * Math.sin(1.04719755)) / Math.sin(0.523598776);
        // scale = width in meters * 39.37 inches/meter * screen resolution / (0.5 * map.width)
        // map.width is halved because widgetInMeters represents half the user's view.
        // Using high dpi value here as it seems to match more closely with other map implementations.
        var scale = (widthInMeters * 39.37 * HIGH_DPI) / (0.5 * map.width);
        return scale;
    };

    var View = function(map, overlayManager) {
        var me = this;

        /**
         * A function for a zooming a map to a particular range.
         * @see module:cmwapi/map/view/Zoom~Handler
         */
        me.handleZoom = function(sender, data) {
            if(data.length > 1) {
                // Only respond to the last position sent.  No need to make the map jump around.
                var lastPos = data.length - 1;
                //map.setScale(data[lastPos].range);
                map.setScale(zoomAltitudeToScale(map, data[lastPos].range));
            } else {
                //map.setScale(data.range);
                map.setScale(zoomAltitudeToScale(map, data.range));
            }
        };
        CommonMapApi.view.zoom.addHandler(me.handleZoom);

        me.handleCenterOverlay = function(sender, data) {
            if(data.length > 1) {
                // Only respond to the last position sent.  No need to make the map jump around.
                var lastPos = data.length - 1;
            } else {

            }
        };
        CommonMapApi.view.center.overlay.addHandler(me.handleCenterOverlay);

        me.handleCenterFeature = function(sender, data) {
            if(data.length > 1) {
                // Only respond to the last position sent.  No need to make the map jump around.
                var lastPos = data.length - 1;
            } else {

            }
        };
        CommonMapApi.view.center.feature.addHandler(me.handleCenterFeature);

        /**
         * A function for a request to center a map on a location.
         * @todo Correct the zoom implementation.  At present, we're just setting the scale.  This needs to 
         * be calculated from a range value instead
         * @see module:cmwapi/map/view/CenterLocation~Handler
         * @memberof! module:EsriAdapter#
         */
        me.handleCenterLocation = function(sender, data) {
            var point;
            if(data.length > 1) {
                // Only respond to the last position sent.  No need to make the map jump around.
                var lastPos = data.length - 1;
                point = new Point(data[lastPos].location.lon,
                    data[lastPos].location.lat,
                    map.geographicExtent.spatialReference);

                // TODO: set the zoom level.
                if (data[lastPos].zoom && data[lastPos].zoom.toString().toLowerCase() === "auto") {
                    map.setZoom(map.getMaxZoom());
                }
                else if (data[lastPos].zoom) {
                    map.setScale(zoomAltitudeToScale(map, data[lastPos].zoom));
                }

                // Recenter the map.
                map.centerAt(point);

            } else {
                point = new Point(data.location.lon,
                    data.location.lat,
                    map.geographicExtent.spatialReference);
                // TODO: set the zoom level.
                if (data.zoom && data.zoom.toString().toLowerCase() === "auto") {
                    map.setZoom(map.getMaxZoom());
                }
                else if (data.zoom) {
                    map.setScale(zoomAltitudeToScale(map, data.zoom));
                }

                // Recenter the map.
                map.centerAt(point);
            }
        };
        CommonMapApi.view.center.location.addHandler(me.handleCenterLocation);

        /**
         * A function for a request to center a map on a bounding box with.
         * @todo Correct the zoom implementation.  At present, we're just setting the scale.  This needs to 
         * be calculated from a range value instead
         * @see module:cmwapi/map/view/CenterBounds~Handler
         * @memberof! module:EsriAdapter#
         */
        me.handleCenterBounds = function(sender, data) {
            var extent;
            var payload;

            if(data.length > 1) {
                // Only respond to the last position sent.  No need to make the map jump around.
                var lastPos = data.length - 1;
                extent = new Extent(data[lastPos].bounds.southWest.lon,
                    data[lastPos].bounds.southWest.lat,
                    data[lastPos].bounds.northEast.lon,
                    data[lastPos].bounds.northEast.lat,
                    map.geographicExtent.spatialReference);
                payload = data[lastPos];
            } else {
                extent = new Extent(data.bounds.southWest.lon,
                    data.bounds.southWest.lat,
                    data.bounds.northEast.lon,
                    data.bounds.northEast.lat,
                    map.geographicExtent.spatialReference);
                payload = data;
            }

            // If auto zoom, reset the entire extent.
            if (payload.zoom === "auto") {
                map.setExtent(extent, true);
                map.centerAt(extent.getCenter());
            }
            // If we have a non-auto zoom, recenter the map and zoom.
            else if (typeof payload.zoom !== "undefined") {
                // Set the zoom level.
                map.setScale(zoomAltitudeToScale(map, payload.zoom));

                // Recenter the map.
                map.centerAt(extent.getCenter());
            }
            // Otherwise, use recenter the map.
            else {
                map.centerAt(extent.getCenter());
            }
        };
        CommonMapApi.view.center.bounds.addHandler(me.handleCenterBounds);

        /**
         * Commented out as we may not need this at present.  We respond to feature selections but not
         * random clicks in other maps.
         * Handles click events sent from 
         * @see module:cmwapi/map/view/Clicked~Handler
         */
        // me.handleClicked = function(sender, data) {
        //     // Nothing to do.
        // };
        // CommonMapApi.view.clicked.addHandler(me.handleClicked);

        
    };

    return View;
});
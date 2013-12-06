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
    var View = function(map, overlayManager) {
        var me = this;

        /**
         * A function for a zooming a map to a particular range.
         * @todo Correct the zoom implementation.  At present, we're just setting the scale.  This needs to 
         * be calculated from a range value instead.
         * @see module:cmwapi/map/view/Zoom~Handler
         */
        me.handleZoom = function(sender, data) {
            if(data.length > 1) {
                // Only respond to the last position sent.  No need to make the map jump around.
                var lastPos = data.length - 1;
                map.setScale(data[lastPos].range);
            } else {
                map.setScale(data.range);
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
        CommonMapApi.view.center.overlay.addHandler(me.handleCenterFeature);

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

                // Recenter the map.
                map.centerAt(point);

            } else {
                point = new Point(data.location.lon,
                    data.location.lat,
                    map.geographicExtent.spatialReference);
                // TODO: set the zoom level.

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
                // TODO: set the zoom level.

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
         * Handles click events sent from 
         * @see module:cmwapi/map/view/Clicked~Handler
         */
        me.handleClicked = function(sender, data) {
            // Nothing to do.
        };
        CommonMapApi.view.clicked.addHandler(me.handleClicked);

        
    };

    return View;
});
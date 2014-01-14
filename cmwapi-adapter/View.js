define(["cmwapi/cmwapi", "esri/kernel", "esri/geometry/Extent", "esri/geometry/Point",
    "cmwapi-adapter/ViewUtils"],
    function(CommonMapApi, EsriNS, Extent, Point, ViewUtils) {
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
     * @module cmwapi-adapter/View
     */

    /**
     * @constructor
     * @param map {object} ESRI map object for which this adapter should apply
     * @param overlayManager {module:cmwapi-adapter/EsriOverlayManager}
     * @alias module:cmwapi-adapter/View
     */
    var View = function(map, overlayManager) {
        var me = this;

        /**
         * Zooms a map to a particular range.  If given an array of zoom ranges,
         * only the last one is used for the attached Map.
         * @method handleZoom
         * @see module:cmwapi/map/view/Zoom~Handler
         * @memberof module:cmwapi-adapter/View#
         */
        me.handleZoom = function(sender, data) {
            if(data.length > 1) {
                // Only respond to the last position sent.  No need to make the map jump around.
                var lastPos = data.length - 1;
                //map.setScale(data[lastPos].range);
                map.setScale(ViewUtils.zoomAltitudeToScale(map, data[lastPos].range));
            } else {
                //map.setScale(data.range);
                map.setScale(ViewUtils.zoomAltitudeToScale(map, data.range));
            }
        };
        CommonMapApi.view.zoom.addHandler(me.handleZoom);

        /**
         * Centers/zooms a map to a particular overlay.  If given an overlay and zoom level, it will attempt to center
         * on the union of all Features under that overlay.  If given an array of overlays and zoom ranges are provided,
         * only the last one is used to center the map.
         * @method handleCenterOverlay
         * @see module:cmwapi/map/view/CenterOverlay~Handler
         * @memberof module:cmwapi-adapter/View#
         */
        me.handleCenterOverlay = function(sender, data) {
            if(data.length > 1) {
                // Only respond to the last position sent.  No need to make the map jump around.
                var lastPos = data.length - 1;
                var lastData = data[lastPos];
                overlayManager.overlay.zoom(sender, lastData.overlayId, lastData.zoom);
            } else {
                overlayManager.overlay.zoom(sender, data.overlayId, data.zoom);
            }
        };
        CommonMapApi.view.center.overlay.addHandler(me.handleCenterOverlay);

        /**
         * Centers/zooms a map to a particular CMWAPI feature.  If given an array of features and zoom ranges,
         * only the last one is used to center the map.
         * @method handleCenterFeature
         * @see module:cmwapi/map/view/CenterFeaure~Handler
         * @memberof module:cmwapi-adapter/View#
         */
        me.handleCenterFeature = function(sender, data) {
            if(data.length > 1) {
                // Only respond to the last position sent.  No need to make the map jump around.
                var lastPos = data.length - 1;
                var lastData = data[lastPos];
                overlayManager.feature.zoom(sender, lastData.overlayId, lastData.featureId,
                    null, null, lastData.zoom);
            } else {
                overlayManager.feature.zoom(sender, data.overlayId, data.featureId,
                    null, null, data.zoom);
            }
        };
        CommonMapApi.view.center.feature.addHandler(me.handleCenterFeature);

        /**
         * Centers/zooms a map to a particular location as specified by latitude/longitude.  If given an array of
         * locations, only the last one is used.
         * @method handleCenterLocation
         * @see module:cmwapi/map/view/CenterLocation~Handler
         * @memberof module:cmwapi-adapter/View#
         */
        me.handleCenterLocation = function(sender, data) {
            var point;
            if(data.length > 1) {
                // Only respond to the last position sent.  No need to make the map jump around.
                var lastPos = data.length - 1;
                point = new Point(data[lastPos].location.lon,
                    data[lastPos].location.lat,
                    map.geographicExtent.spatialReference);

                // Set the zoom level or just the center, depending upon zoom param.
                if (data[lastPos].zoom && data[lastPos].zoom.toString().toLowerCase() === "auto") {
                    map.setZoom(map.getMaxZoom());
                }
                else if (data[lastPos].zoom) {
                    map.setScale(ViewUtils.zoomAltitudeToScale(map, data[lastPos].zoom));
                }

                // Recenter the map.
                map.centerAt(point);

            } else {
                point = new Point(data.location.lon,
                    data.location.lat,
                    map.geographicExtent.spatialReference);
                // Set the zoom level or just the center, depending upon zoom param.
                if (data.zoom && data.zoom.toString().toLowerCase() === "auto") {
                    map.setZoom(map.getMaxZoom());
                }
                else if (data.zoom) {
                    map.setScale(ViewUtils.zoomAltitudeToScale(map, data.zoom));
                }

                // Recenter the map.
                map.centerAt(point);
            }
        };
        CommonMapApi.view.center.location.addHandler(me.handleCenterLocation);

        /**
         * Centers/zooms a map to a particular CMWAPI bounds.  If given an array of bounds and zoom ranges,
         * only the last one is used to adjust the map.
         * @method handleCenterBounds
         * @see module:cmwapi/map/view/CenterBounds~Handler
         * @memberof module:cmwapi-adapter/View#
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
            }
            // If we have a non-auto zoom, recenter the map and zoom.
            else if (typeof payload.zoom !== "undefined") {
                // Set the zoom level.
                map.setScale(ViewUtils.zoomAltitudeToScale(map, payload.zoom));

                // Recenter the map.
                map.centerAt(extent.getCenter());
            }
            // Otherwise, recenter the map.
            else {
                map.centerAt(extent.getCenter());
            }
        };
        CommonMapApi.view.center.bounds.addHandler(me.handleCenterBounds);

    };

    return View;
});
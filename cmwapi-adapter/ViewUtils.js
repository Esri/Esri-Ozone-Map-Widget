define(function() {

    var unionExtents = function(newExtent, currentMax) {
        if(currentMax === null) {
            return newExtent;
        } else {
            return currentMax.union(newExtent);
        }
    };

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
     * @description A set of utility constants and functions for finding and manipulating
     * ArcGIS JavaScript Map, Extents, and Layers.
     * @see {@link https://developers.arcgis.com/en/javascript/jsapi/extent-amd.html|Extent}
     * @see {@link https://developers.arcgis.com/en/javascript/jsapi/map-amd.html|Map}
     * @see {@link https://developers.arcgis.com/en/javascript/jsapi/layer-amd.html|Layer}
     * @exports cmwapi-adapter/ViewUtils
     */
    var ViewUtils = {

        /**
         * A high pixels (dots) per inch value for web displays.  Note:  This is an assumed value and
         * does not necessarily reflect the DPI of the current display.
         * @type number
         */ 
        HIGH_DPI : 120,
        /**
         * A low or default pixels (dots) per inch value for web displays.  Note:  This is an assumed
         * value and does not necessarily reflect the DPI of the current display.
         * @type number
         */
        DEFAULT_DPI : 96,
        /**
         * The value of sine(30 degrees).
         * @type number
         */
        SINE_30_DEG : Math.sin(0.523598776),
        /**
         * The value of sine(60 degrees).
         * @type number
         */
        SINE_60_DEG : Math.sin(1.04719755),
        /**
         * The number of inches in a meter.  This is used for unit conversions and calculations related to
         * assumed screen resolution.
         * @type number
         */
        INCHES_PER_METER : 39.37,

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
         * @todo Verify this approach;  it appears to work for now, but a more accurate or dpi-agnostic method may be preferred.
         * @param {Map} map An ArcGIS JavaScript map
         * @param {number} alt An viewing altitude in meters for which we need to find an equivalent scale.
         * @returns {number} A scale value appropriate to the input map.
         * @see http://resources.esri.com/help/9.3/arcgisserver/apis/silverlight/apiref/topic380.html  
         */
        zoomAltitudeToScale : function(map, alt) {
            // (altitude in meters) * sin(60 deg) / sin(30 deg) to get half the view width in meters.
            var widthInMeters = (alt * this.SINE_60_DEG) / this.SINE_30_DEG;
            // scale = width in meters * 39.37 inches/meter * screen resolution / (0.5 * map.width)
            // map.width is halved because widgetInMeters represents half the user's view.
            // Using high dpi value here as it seems to match more closely with other map implementations.
            var scale = (widthInMeters * this.INCHES_PER_METER * this.HIGH_DPI) / (0.5 * map.width);
            return scale;
        },

        /**
         * Calculates the approximate zoom range in meters at which a map's current view/scale is set.  This makes the same 
         * assumptions as the zoomAltitudeToScale function and simply reverses its mathematical process.
         * @todo Verify this approach;  it appears to work for now, but a more accurate or dpi-agnostic method may be preferred.
         * @param {Map} map An ArcGIS JavaScript map
         * @returns {number} A zoom range in meters.
         * @see http://resources.esri.com/help/9.3/arcgisserver/apis/silverlight/apiref/topic380.html 
         */ 
        scaleToZoomAltitude : function(map) {
            // Calculate the range from the current scale using law of sines and a triangle from user's
            // viewpoint to center of extent, to the edge of the map. This assumes a user as a 120 degree field of view.
            // Triangle widthInMeters = scale * (1m / InchesPerMeter) * (1 / screen DPI) * (map width * 0.5).  We half
            // the map width in pixels since only half forms one side of our triangle to determine range.   
            var widthInMeters = (map.getScale() * map.width * (0.5)) / (this.INCHES_PER_METER * this.HIGH_DPI);
            // Using law of sines, range = widthInMeters * sine(30 deg) / sine(60 deg). 
            var range = (widthInMeters * this.SINE_30_DEG) / this.SINE_60_DEG;

            return range;
        },

        /**
         * Finds the outermost extent of an ArcGIS Layer.  This function is used to examine ArcGIS JavaScript Layers that have a 
         * nested Layer structure and attempts to find the outmost layer that encompasses all contained data by performing a union
         * of all their extents.
         * @param {Layer} esriLayer An ArcGIS JavaScript Layer
         * @return {Extent}  The outermost extent
         */
        findLayerExtent : function(esriLayer) {
            var extent = null;
            var layers = esriLayer.getLayers();

            var layer;
            for(var i = 0; i < layers.length; i++) {
                layer = layers[i];

                if(typeof(layer.getLayers) !== 'undefined') { //kmlLayer
                    extent = unionExtents(this.findLayerExtent(layer), extent);
                } else if(typeof(layer.getImages) !== 'undefined') { //mapImageLayer
                    var images = layer.getImages();
                    for(var j = 0; j < images.length; j++) {
                        extent = unionExtents(images[j].extent, extent);
                    }
                } else { //featureLayer
                    extent = unionExtents(layer.fullExtent, extent);
                }
            }
            return extent;
        },

        /**
         * Convenience function for finding the outermost extent of a CMWAPI feature.  This function pulls the equivalent 
         * ArcGIS layer from the feature object and defers to findLayerExtent for the bulk of the work.
         * @param {cmwapi-adapter/EsriOverlayManager/Feature} feature A CMWAPI feature.
         * @return {Extent}  The outermost extent
         */
        findFeatureExtent: function(feature) {
            return this.findLayerExtent(feature.esriObject);
        },

        /**
         * Finds the outermost Extent of a CMWAPI Overlay.  This function traverses the overlay's child overlays and feature
         * and unions the extents of all ArcGIS Layers contained therein.  The composite Extent is returned.
         * @param {cmwapi-adapter/EsriOverlayManager/Overlay} overlay A CMWAPI overlay.
         * @return {Extent} The outermost extent.
         */
        findOverlayExtent : function(overlay) {
            var extent = null;
            var idx = null;

            // Get the max extent of the features in this overlay.
            if (typeof(overlay.features) !== 'undefined') {
                //for (var i = 0; i < overlay.features.length; i++) {
                for (idx in overlay.features) {
                    extent = unionExtents(this.findFeatureExtent(overlay.features[idx]), extent);
                }
            }

            // Recursively check any child overlays
            if (typeof(overlay.children) !== 'undefined') {
                for (idx in overlay.children) {
                    extent = unionExtents(this.findOverlayExtent(overlay.children[idx]), extent);
                }
            }
            return extent;
        }

        
    };

    return ViewUtils;
});
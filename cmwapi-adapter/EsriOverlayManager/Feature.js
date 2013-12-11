define(["esri/layers/KMLLayer"],function(KMLLayer) {
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
     * @description Manager for overlay layers to be used in conjunction with an ESRI map,
     * the {@link EsriAdapter}, and the {@link Map|Common Map Widget API}
     * @version 1.1
     * @module cmwapi-adapter/EsriOverlayManager/Feature
     */

     var handler = function(manager, map, adapter) {
        var me = this;

        /**
         * A feature which can be plotted or displayed on a Map.
         * @constructor
         * @param overlayId {String} The id of an overlay layer which will contain this feature;
         *      If an overlay with the given ID does not exist, one will be created
         * @param featureId {String} The id to be given to this feature. If the ID exists for the provided
         *      ovelayId the previous feature with the given featureId will be replaced with this feature;
         *      otherwise the feature will be created.
         * @param name {Stirng} The non-unique readable name to give to this feature
         * @param format {String} The format in which the feature parameter is being specified
         * @param feature The data detailing this feature
         * @param Zoom {boolean} Whether or not the map should zoom to this feature upon being added to the map
         * @memberof module:cmwapi-adapter/EsriOverlayManager
         */
        var Feature = function(overlayId, featureId, name, format, feature, zoom, esriObject) {
            var resolveFeature = function() {
                //TODO figure out the type of esri feature and return
            };

            this.overlayId = overlayId; //needed?
            this.featureId = featureId;
            this.name = name;
            this.format = format;
            this.feature = feature;
            this.zoom = zoom;

            this.isHidden = false;

            this.esriObject = esriObject;
        };

        /**
         * @method plotFeature
         * @param caller {String} the id of the widget which made the request resulting in this function call.
         * @param overlayId {String} The id of the overlay on which this feature should be displayed
         * @param featureId {String} The id to be given for the feature, unique to the provided overlayId
         * @param name {String} The readable name for which this feature should be labeled
         * @param format {String} The format type of the feature data included
         * @param feature The data in the format specified providing the detail for this feature
         * @param [zoom] {boolean} Whether or not the map should zoom to this feature upon creation
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        me.plotFeature = function(caller, overlayId, featureId, name, format, feature, zoom) {
            /*if(typeof(manager.overlays[overlayId]) === undefined) {
                manager.overlay.createOverlay(caller, overlayId, overlayId);
            }

            var overlay = manager.overlays[overlayId];

            if(typeof(overlay.features[featureId] !== 'undefined')) {
                me.deleteFeature(overlayId, featureId);
            }
            //create
            //overlay.features[featureId] = new Feature(ovelayId, featureId, name, format, feature, zoom);
            //add to map
            //zoom if feature.zoom === true*/
            var msg = "Function not yet implemented";
            adapter.error.send(caller, msg, {message: msg, type: "not_yet_implemented"});
        };

        /**
         * @method plotFeatureUrl
         * @param caller {String} the id of the widget which made the request resulting in this function call.
         * @param overlayId {String} The id of the overlay on which this feature should be displayed
         * @param featureId {String} The id to be given for the feature, unique to the provided overlayId
         * @param name {String} The readable name for which this feature should be labeled
         * @param format {String} The format type of the feature data included
         * @param feature The url containing the data for the feature
         * @param params //FIXME only matters for wms?
         * @param [zoom] {boolean} Whether or not the map should zoom to this feature upon creation
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        me.plotFeatureUrl = function(caller, overlayId, featureId, name, format, url, params, zoom) {
            if(typeof(manager.overlays[overlayId]) === 'undefined') {
                manager.overlay.createOverlay(caller, overlayId, overlayId);
            }

            var overlay = manager.overlays[overlayId];
            if(typeof(overlay.features[featureId]) !== 'undefined') {
                me.deleteFeature(overlayId, featureId);
            }

            //if a type we like then handler function
            if(format === 'kml') {
                plotKmlFeatureUrl(caller, overlayId, featureId, name, url, zoom);
            } else {
                var msg = "Format, " + format + " of data is not accepted";
                adapter.error.send(caller, msg, {message: msg, type: 'invalid_data_format'});
            }
        };

        /**
         * Plots a kml layer via url to the map
         * @private
         * @method plotKmlFeatureUrl
         * @param caller {String}
         * @param overlayId {String}
         * @param featureId {String}
         * @param name {String}
         * @param url {String}
         * @param [zoom] {Boolean}
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        var plotKmlFeatureUrl = function(caller, overlayId, featureId, name, url, zoom) {
            var layer = new KMLLayer(url);

            map.addLayer(layer);

            var overlay = manager.overlays[overlayId];
            overlay.features[featureId] = new Feature(overlayId, featureId, name, 'kml-url', url, zoom, layer);

            layer.on("load", function() {
                if(zoom) {
                    me.zoomFeature(caller, overlayId, featureId);
                }
                manager.treeChanged();
            });
            
        };

        /**
         * @method deleteFeature
         * @param overlayId {String} The id of the overlay which contains the feature to be removed
         * @param featureId {String} The id of the feature which is to be removed
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        me.deleteFeature = function(caller, overlayId, featureId) {
            var overlay = manager.overlays[overlayId];
            var msg;
            if(typeof(overlay) === 'undefined') {
                msg = "Overlay could not be found with id " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
                return;
            }

            var feature = overlay.features[featureId];
            if(typeof(feature) === 'undefined') {
                msg = "Feature could not be found with id " + featureId + " and overlayId " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
                return;
            }

            map.removeLayer(feature.esriObject);
            delete overlay.features[featureId];
            manager.treeChanged();
        };

        /**
         * @method hideFeature
         * @param overlayId {String} The id of the overlay which contains the feature to be hidden
         * @param featureId {String} The id of the feature which is to be hidden
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        me.hideFeature = function(caller, overlayId, featureId) {
            var overlay = manager.overlays[overlayId];
            var msg;
            if(typeof(overlay) === 'undefined') {
                msg = "Overlay could not be found with id " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
                return;
            }
            var feature = overlay.features[featureId];
            if(typeof(feature) === 'undefined') {
                msg = "Feature could not be found with id " + featureId + " and overlayId " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
                return;
            }

            if(!feature.isHidden) {
                feature.isHidden = true;
                feature.esriObject.hide();
                manager.treeChanged();
            }
        };

        /**
         * @method showFeature
         * @param caller {String} The id of the widget which made the request resulting in this call.
         * @param overlayId {String} The id of the overlay which contains the feature to be shown
         * @param featureId {String} The id of the feature which is to be shown
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        me.showFeature = function(caller, overlayId, featureId) {
            var overlay = manager.overlays[overlayId];
            var msg;
            if(typeof(overlay) === 'undefined') {
                msg = "Overlay could not be found with id " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
                return;
            }
            var feature = overlay.features[featureId];
            if(typeof(feature) === 'undefined') {
                msg = "Feature could not be found with id " + featureId + " and overlayId " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
                return;
            }

            if(feature.isHidden) {
                feature.isHidden = false;
                feature.esriObject.show();
                manager.treeChanged();
            }
        };

        /**
         * @method zoomFeature
         * @param caller {String}
         * @param overlayId {String}
         * @param featureId {String}
         * @param [selectedId] {String}
         * @param [selectedName] {String}
         */
        me.zoomFeature = function(caller, overlayId, featureId, selectedId, selectedName) {
            var overlay = manager.overlays[overlayId];
            var msg;
            if(typeof(overlay) === 'undefined') {
                msg = "Overlay could not be found with id " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
                return;
            }
            var feature = overlay.features[featureId];
            if(typeof(feature) === 'undefined') {
                msg = "Feature could not be found with id " + featureId + " and overlayId " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
                return;
            }

            var extent = findExtent(feature.esriObject);

            console.log(extent);
            map.setExtent(extent, true);
        };

        var findExtent = function(esriLayer) {
            var extent = null;
            var layers = esriLayer.getLayers();
            console.log(layers);

            var layer;
            for(var i = 0; i < layers.length; i++) {
                layer = layers[i];

                if(typeof(layer.getLayers) !== 'undefined') { //kmlLayer
                    determineMaxExtent(findExtent(layer), extent);
                } else if(typeof(layer.getImages) !== 'undefined') { //mapImageLayer
                    var images = layer.getImages();
                    for(var j = 0; j < images.length; j++) {
                        extent = determineMaxExtent(images[j].extent, extent);
                    }
                } else { //featureLayer
                    extent = determineMaxExtent(layer.fullExtent, extent);
                }
            }
            return extent;
        };

        var determineMaxExtent = function(newExtent, currentMax) {
            if(currentMax === null) {
                return newExtent;
            } else {
                return currentMax.union(newExtent);
            }
        };

        /**
         * @method updateFeature
         * @param overlayId {String}
         * @param featureId {String}
         * @param [name] {String}
         * @param [newOverlayId] {String}
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        me.updateFeature = function(caller, overlayId, featureId, name, newOverlayId) {
            if(typeof(manager.overlays[overlayId]) !== 'undefined' && typeof(manager.overlays[overlayId].features[featureId]) !== 'undefined') {
                var feature = manager.overlays[overlayId].features[featureId];

                if(name !== feature.name) {
                    feature.name = name;
                }

                if(newOverlayId && newOverlayId !== overlayId) {
                    if(typeof(manager.overlays[newOverlayId]) === 'undefined') {
                        //FIXME What should happen here? hide it.
                    } else {
                        var newFeature = new Feature(newOverlayId, featureId, name, feature.format, feature.feature, feature.zoom);
                        manager.overlays[newOverlayId].features[featureId] = newFeature;
                        delete manager.overlays[overlayId].features[featureId];

                        //FIXME should we do something to handle if the new overlay is hidden
                    }
                }
                manager.treeChanged();
            } else {
                var msg = "Feature could not be found with id " + featureId + " and overlayId " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
            }
        };

    };

    return handler;
});
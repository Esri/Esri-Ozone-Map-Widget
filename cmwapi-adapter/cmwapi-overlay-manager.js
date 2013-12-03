define(["esri/layers/KMLLayer"], function(KMLLayer) {
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
     * @module cmwapi-adapter/EsriOverlayManager
     */

    /**
     * @constructor
     * @alias module:cmwapi-adapter/EsriOverlayManager
     * @param adapter {module:EsriAdapter}
     * @param map {object} The ESRI map object which this overlay manager should apply to
     */
    var EsriOverlayManager = function(adapter, map) {
        var me = this;

        me.overlays = {};

        /**
         * An overlay layer to contain features.
         * @constructor
         * @param overlayId {String} the unique id by which this overlay should be identified
         * @param name {String} optional; the non-unique readable name; if not specified the id will be used
         * @param parentId {String} optional; the parent to be set for this overlay
         * @memberof module:cmwapi-adapter/EsriOverlayManager
         */
        var Overlay = function(overlayId, name, parentId) {
            this.id= overlayId;
            this.name= name;
            //Overlay IDs of children overlays
            this.children = {};
            this.parentId = parentId;
            //Mapping FeatureID->Feature object of children features
            this.features = {};
            this.isHidden = false;
            if(parentId) {
                resolveParent(this, parentId);
            }
        };

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
                //TODO figure out the type of esri feature, create and return
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
         * @private
         * @method resolveParent
         * @param childId {String} The id of the child for which the parent should be set
         * @param parentId {String} The id of the overlay to be set as parent
         * @param previousParentId {String} optional; The id of the overlay that was previously designated as parent to the childId
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        var resolveParent = function(child, parentId, previousParentId) {
            if(previousParentId) {
                delete me.overlays[previousParentId].children[child.id];
            }

            if(me.overlays[parentId]) {
                me.overlays[parentId].children[child.id] = child;
            }
        };

        /**
         * @method createOverlay
         * @param caller {String} the id of the widget which made the request resulting in this function call.
         * @param name {String} optional; The readable name for the overlay; if not specified the id will be used
         * @param overlayId {String} The id of the overlay to create; if it exists nothing will be created
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        me.createOverlay = function(caller, overlayId, name, parentId) {
            if(me.overlays[overlayId]) {
                me.updateOverlay(name, overlayId, parentId);
            } else {
                me.overlays[overlayId] = new Overlay(overlayId, name, parentId);
            }
        };

        /**
         * @method deleteOverlay
         * @param caller {String} the id of the widget which made the request resulting in this function call.
         * @param overlayId {String} the id of the overlay to be deleted from the manager
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        me.removeOverlay = function(caller, overlayId) {
            //TODO Error if overlay not found?

            var overlay = me.overlays[overlayId];

            if(overlay) {
                //find parent
                var parent = me.overlays[overlay.parentId];
                if(parent) {
                    delete parent.children[overlayId];
                }

                var features = Object.keys(overlay.features);
                for(var i = 0; i < features.length; i++) {
                    me.deleteFeature(overlayId, features[i].featureId);
                }

                var children = Object.keys(overlay.children);
                //recursively remove children from this overlay
                for(i = 0; i < children.length; i++) {
                    me.removeOverlay(caller, children[i]);
                }
            }

            delete me.overlays[overlayId];
        };

        /**
         * @method hideOverlay
         * @param caller {String} the id of the widget which made the request resulting in this function call.
         * @param overlayId {String} the id of the overlay to be hidden
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        me.hideOverlay = function(caller, overlayId) {
            var overlay = me.overlays[overlayId];
            if(!overlay) {
                adapter.error.error(caller, "Overlay not found with id " + overlayId, {type: "invalid_id"});
            } else {
                overlay.isHidden = true;

                var features = Object.keys(overlay.features);
                for(var i = 0; i < features.length; i++) {
                    feature[i].isHidden = true;
                    feature[i].esriObject.hide();
                }
            }
        };

        /**
         * @method showOverlay
         * @param caller {String} the id of the widget which made the request resulting in this function call.
         * @param overlayId {String} the id of the overlay to be shown
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        me.showOverlay = function(overlayId) {
            var overlay = me.overlays[overlayId];
            if(!overlay) {
                adapter.error.error(caller, "Overlay not found with id " + overlayId, {type: "invalid_id"});
            } else {
                overlay.isHidden = false;

                var features = Object.keys(overlay.features);
                for(var i = 0; i < features.length; i++) {
                    feature[i].isHidden = false;
                    feature[i].esriObject.show();
                }
            }
        };

        /**
         * @method updateOverlay
         * @param caller {String} the id of the widget which made the request resulting in this function call.
         * @param name {String} The name that should be set; the current or a new name.
         * @param overlayId {String} the id of the overlay to be updated.
         * @param parentId {String} optional; the id of the overlay to be set as the parent.
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        me.updateOverlay = function(caller, name, overlayId, parentId) {
            if(typeof(me.overlays[overlayId]) === 'undefined') {
                var msg = "No overlay exists with the provided id of " + overlayId;
                adapter.error.error(sender, msg, {type: 'map.overlay.update', msg: msg});
            } else {
                if(me.overlays[overlayId].name !== name) {
                    me.overlays[overlayId].setName(name);
                }
                if(parentId && parentId !== me.overlays[overlayId].parentId) {
                    me.designateParent(overlayId, parentId);
                }
            }
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
            /*if(typeof(me.overlays[overlayId]) === undefined) {
                me.createOverlay(caller, overlayId, overlayId);
            }

            var overlay = me.overlays[overlayId];

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
            if(typeof(me.overlays[overlayId]) === undefined) {
                me.createOverlay(caller, overlayId, overlayId);
            }

            var overlay = me.overlays[overlayId];
            if(typeof(overlay.features[featureId] !== 'undefined')) {
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
            var layer = new KMLLayer(featureId, url);

            map.addLayer(layer);

            var overlay = me.overlays[overlayId];
            overlay.features[featureId] = new Feature(ovelayId, featureId, name, 'kml-url', url, zoom, layer);

            me.zoomFeature(caller, overlayId, featureId);
        };

        /**
         * @method deleteFeature
         * @param overlayId {String} The id of the overlay which contains the feature to be removed
         * @param featureId {String} The id of the feature which is to be removed
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        me.deleteFeature = function(caller, overlayId, featureId) {
            var overlay = me.overlays[overlayId];
            var msg;
            if(typeof(overlay) === 'undefined') {
                msg = "Overlay could not be found with id " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
                return;
            }

            var feature = overlay.features[featureId];
            if(typeof(feature) !== 'undefined') {
                msg = "Feature could not be found with id " + featureId + " and overlayId " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
                return;
            }

            map.removeLayer(feature.esriObject);
            delete overlay.features[featureId];
        };

        /**
         * @method hideFeature
         * @param overlayId {String} The id of the overlay which contains the feature to be hidden
         * @param featureId {String} The id of the feature which is to be hidden
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        me.hideFeature = function(caller, overlayId, featureId) {
            var overlay = me.overlays[overlayId];
            var msg;
            if(typeof(overlay) === 'undefined') {
                msg = "Overlay could not be found with id " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
                return;
            }
            var feature = overlay.features[featureId];
            if(typeof(feature) !== 'undefined') {
                msg = "Feature could not be found with id " + featureId + " and overlayId " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
                return;
            }

            if(!feature.isHidden()) {
                feature.esriObject.hide();
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
            var overlay = me.overlays[overlayId];
            var msg;
            if(typeof(overlay) === 'undefined') {
                msg = "Overlay could not be found with id " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
                return;
            }
            var feature = overlay.features[featureId];
            if(typeof(feature) !== 'undefined') {
                msg = "Feature could not be found with id " + featureId + " and overlayId " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
                return;
            }

            if(feature.isHidden()) {
                feature.esriObject.show();
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
        me.zoomFeature = function(sender, overlayId, featureId, selectedId, selectedName) {
            var overlay = me.overlays[overlayId];
            var msg;
            if(typeof(overlay) === 'undefined') {
                msg = "Overlay could not be found with id " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
                return;
            }
            var feature = overlay.features[featureId];
            if(typeof(feature) !== 'undefined') {
                msg = "Feature could not be found with id " + featureId + " and overlayId " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
                return;
            }

            //FIXME zoom to sub feature

            var extent = findExtent(feature.esriObject);

            map.setExtent(extent);
        };

        var findExtent = function(esriLayer) {
            var extent = null;
            var layers = esriLayer.getLayers();

            var layer;
            for(var i = 0; i < layers.length; i++) {
                layer = layers[i];

                if(typeof(layer.getLayers) !== 'undefined') { //kmlLayer
                    determineMaxExtent(findExtent(layer), extent);
                } else if(typeof(layer.getImages) !== 'undefined') { //mapImageLayer
                    var images = layer.getImages();
                    for(var j = 0; j < images.length; j++) {
                        extent = determineMaxExtent(image.extent, extent);
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
        me.updateFeature = function(overlayId, featureId, name, newOverlayId) {
            if(typeof(me.overlays[overlayId]) !== 'undefined' && typeof(me.overlays[overlayId].features[featureId]) !== 'undefined') {
                var feature = me.overlays[overlayId].features[featureId];

                if(name !== feature.name) {
                    feature.name = name;
                }

                if(newOverlayId && newOverlayId !== overlayId) {
                    if(typeof(me.overlays[newOverlayId]) === 'undefined') {
                        //FIXME
                    } else {
                        var newFeature = new Feature(newOverlayId, featureId, name, feature.format, feature.feature, feature.zoom);
                        me.overlays[newOverlayId].features[featureId] = newFeature;
                        delete me.overlays[overlayId].features[featureId];
                        //FIXME handle if the new overlay is hidden
                    }
                }
            } else {
                var msg = "Feature could not be found with id " + featureId + " and overlayId " + overlayId;
                adapter.error.error(caller, msg, {type: "invalid_id", message: msg});
            }
        };

        me.getOverlayTree = function() {
            var result = []
            for(overlay in me.overlays) {
                if(!overlay.parentId) {
                    result.push(resolveOverlayChildren(overlay.id));
                }
            }
        };

        var resolveOverlayChildren = function(overlayId) {
            var overlay = me.overlays[overlayId];

            var res = {
                type: 'overlay',
                id: overlay.id,
                name: overlay.name,
                isHidden: overlay.idHidden,
                children: []
            };

            var child;
            var resolvedChild;

            for(child in overlay.children) {
                resolvedChild = resolveOverlayChildren(child.id)
                res.children.push(resolvedChild);
            }
            for(feature in overlay.features) {
                res.children.push({
                    type: 'feature',
                    id: feature.id,
                    name: feature.name,
                    zoom: feature.zoom,
                    isHidden: feature.isHidden,
                    esriObject: feature.esriObject
                });
            }

            return res;
        };

        me.getOverlays = function() {
            return me.overlays;
        }
    };

    return EsriOverlayManager;
});

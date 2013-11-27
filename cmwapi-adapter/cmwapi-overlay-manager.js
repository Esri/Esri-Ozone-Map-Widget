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
                resolveParent(overlayId, parentId);
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
            }

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
         * @memberof module:cmwapi-adapter/EsriOverlayManager
         */
        var resolveParent = function(childId, parentId, previousParentId) {
            if(previousParentId) {
                var array = me.overlays[previousParentId].children;

                for(var i = 0; i < array.length; i--) {
                    if(array[i] === childId) {
                        array.splice(i, 1);
                    }
                }
            }

            if(me.overlays[parentId]) {
                me.overlays[parentId].children[childId] = {};
            }
        };

        /**
         * @method createOverlay
         * @param name {String} optional; The readable name for the overlay; if not specified the id will be used
         * @param overlayId {String} The id of the overlay to create; if it exists nothing will be created
         * @memberof module:cmwapi-adapter/EsriOverlayManager
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
         * @param overlayId {String} the id of the overlay to be deleted from the manager
         * @memberof module:cmwapi-adapter/EsriOverlayManager
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

                var children = Object.keys(overlay.children);
                //recursively remove children from this overlay
                for(var i = 0; i < children.length; i++) {
                    me.removeOverlay(caller, children[i]);
                }
            }

            delete me.overlays[overlayId];
        };

        /**
         * @method hideOverlay
         * @param overlayId {String} the id of the overlay to be hidden
         * @memberof module:cmwapi-adapter/EsriOverlayManager
         */
        me.hideOverlay = function(caller, overlayId) {
            var overlay = me.overlays[overlayId];
            if(!overlay) {
                adapter.error.error(caller, "Overlay not found with id " + overlayId, {type: "invalid_id"});
            } else {
                overlay.isHidden = true;

                for(feature in ovelay.features) {
                    feature.isHidden = true;
                    feature.esriObject.hide();
                }
            }
        };

        /**
         * @method showOverlay
         * @param overlayId {String} the id of the overlay to be shown
         * @memberof module:cmwapi-adapter/EsriOverlayManager
         */
        me.showOverlay = function(overlayId) {
            var overlay = me.overlays[overlayId];
            if(!overlay) {
                adapter.error.error(caller, "Overlay not found with id " + overlayId, {type: "invalid_id"});
            } else {
                overlay.isHidden = false;

                for(feature in ovelay.features) {
                    feature.isHidden = false;
                    feature.esriObject.show();
                }
            }
        };

        /**
         * @method updateOverlay
         * @param name {String} The name that should be set; the current or a new name.
         * @param overlayId {String} the id of the overlay to be updated.
         * @param parentId {String} optional; the id of the overlay to be set as the parent.
         * @memberof module:cmwapi-adapter/EsriOverlayManager
         */
        me.updateOverlay = function(name, overlayId, parentId) {
            if(typeof(me.overlays[overlayId]) === 'undefined') {
                var msg = "No overlay exists with the provided id of " + overlayId;
                adapter.error.error(sender, msg, {type: 'map.overlay.update', msg: msg})
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
         * Resolves and returns the overlay and children for a specified overlayId
         * @private
         * @method flattenOverlay
         * @param overlayId {String} the Id for the overlay to be flattened
         * @memberof module:cmwapi-adapter/EsriOverlayManager
         */
        var flattenOverlay = function(overlayId) {
            if(typeof(me.overlays[overlayId]) === undefined) {
                adapter.error.error(caller, "Overlay not found with id " + overlayId, {type: "invalid_id"});
            } else {
                var overlay = me.overlays[overlayId];
                console.log(overlay);
                for(var i = 0; i < overlay.children.length; i++) {
                    overlay.children[i] = flattenOverlay(overlay.children[i]);
                }
                return overlay;
            }
        };

        /**
         * @method plotFeature
         * @param overlayId {String} The id of the overlay on which this feature should be displayed
         * @param featureId {String} The id to be given for the feature, unique to the provided overlayId
         * @param name {String} The readable name for which this feature should be labeled
         * @param format {String} The format type of the feature data included
         * @param feature The data in the format specified providing the detail for this feature
         * @param zoom {boolean} Whether or not the map should zoom to this feature upon creation
         * @memberof module:cmwapi-adapter/EsriOverlayManager
         */
        me.plotFeature = function(caller, overlayId, featureId, name, format, feature, zoom) {
            if(typeof(me.overlays[overlayId]) === undefined) {
                me.createOverlay(caller, overlayId, overlayId);
            }

            var overlay = me.overlays[overlayId];

            if(typeof(overlay.features[featureId] !== 'undefined')) {
                me.deleteFeature(overlayId, featureId);
            }
            //create
            //overlay.features[featureId] = new Feature(ovelayId, featureId, name, format, feature, zoom);
            //add to map
            //zoom if feature.zoom === true
        };

        /**
         * @method plotFeatureUrl
         * @param overlayId {String} The id of the overlay on which this feature should be displayed
         * @param featureId {String} The id to be given for the feature, unique to the provided overlayId
         * @param name {String} The readable name for which this feature should be labeled
         * @param format {String} The format type of the feature data included
         * @param feature The url containing the data for the feature
         * @param params FIXME what is this
         * @param zoom {boolean} Whether or not the map should zoom to this feature upon creation
         * @memberof module:cmwapi-adapter/EsriOverlayManager
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
            if(format == 'kml') {
                plotKmlFeatureUrl(caller, overlayId, featureId, name, url, params, zoom);
            } else {
                //error not yet impl
            }
        };

        /**
         * Plots a kml layer via url to the map
         * @private
         * @method plotKmlFeatureUrl
         * @param //TODO
         * @memberof module:cmwapi-adapter/EsriOverlayManager
         */
        var plotKmlFeatureUrl = function(caller, overlayId, featureId, name, url, params, zoom) {
            var layer = new KMLLayer(featureId, url);

            map.addLayer(layer);

            var overlay = me.overlays[overlayId];
            overlay.features[featureId] = new Feature(ovelayId, featureId, name, 'kml-url', url, zoom, layer);
            /*if(overlay.isHidden) {
                me.hideFeature(overlayId, featureId); //Dont hide, should be shown to show something happened
            } else {
                //TODO handle the zoom... how do we zoom to what is contained in the kml layer?
            }*/
        }

        /**
         * @method deleteFeature
         * @param overlayId {String} The id of the overlay which contains the feature to be removed
         * @param featureId {String} The id of the feature which is to be removed
         * @memberof module:cmwapi-adapter/EsriOverlayManager
         */
        me.deleteFeature = function(overlayId, featureId) {
            var overlay = me.overlays[overlayId];
            if(typeof(overlay) === 'undefined') {
                adapter.error.error(caller, "Overlay could not be found with id " + overlayId, {type: "invalid_id"});
                return;
            }

            var feature = overlay.features[featureId];
            if(typeof(feature) !== 'undefined') {
                adapter.error.error(caller, "Feature could not be found with id " + featureId +
                        " and overlayId " + overlayId, {type: "invalid_id"});
                return;
            }

            map.removeLayer(feature.esriObject);
            delete overlay.features[featureId];
        };

        /**
         * @method hideFeature
         * @param overlayId {String} The id of the overlay which contains the feature to be hidden
         * @param featureId {String} The id of the feature which is to be hidden
         * @memberof module:cmwapi-adapter/EsriOverlayManager
         */
        me.hideFeature = function(overlayId, featureId) {
            var overlay = me.overlays[overlayId];
            if(typeof(overlay) === 'undefined') {
                adapter.error.error(caller, "Overlay could not be found with id " + overlayId, {type: "invalid_id"});
                return;
            }
            var feature = overlay.features[featureId];
            if(typeof(feature) !== 'undefined') {
                adapter.error.error(caller, "Feature could not be found with id " + featureId +
                        " and overlayId " + overlayId, {type: "invalid_id"});
                return;
            }

            if(!feature.isHidden()) {
                feature.esriObject.hide();
            }
        };

        /**
         * @method showFeature
         * @param overlayId {String} The id of the overlay which contains the feature to be shown
         * @param featureId {String} The id of the feature which is to be shown
         * @memberof module:cmwapi-adapter/EsriOverlayManager
         */
        me.showFeature = function() {
            var overlay = me.overlays[overlayId];
            if(typeof(overlay) === 'undefined') {
                adapter.error.error(caller, "Overlay could not be found with id " + overlayId, {type: "invalid_id"});
                return;
            }
            var feature = overlay.features[featureId];
            if(typeof(feature) !== 'undefined') {
                adapter.error.error(caller, "Feature could not be found with id " + featureId +
                        " and overlayId " + overlayId, {type: "invalid_id"});
                return;
            }

            if(feature.isHidden()) {
                feature.esriObject.show();
            }
        };

        /**
         * @method updateFeature
         * @param overlayId {String}
         * @param featureId {String}
         * @param name {String}
         * @param newOverlayId {String} optional;
         * @memberof module:cmwapi-adapter/EsriOverlayManager
         */
        me.updateFeature = function(overlayId, featureId, name, newOverlayId) {
            var feature = me.overlays[overlayId].features[featureId];
            if(name != feature.name) {
                feature.name = name;
            }

            if(newOverlayId && newOverlayId !== overlayId) {
                if(typeof(me.overlays[newOverlayId]) !== 'undefined' && me.overlays[newOverlayId] !== null) {
                    var feature = me.overlays[overlayId].features[featureId];
                    var newFeature = new Feature(newOverlayId, featureId, name, feature.format, feature.feature, feature.zoom);
                    me.overlays[newOverlayId].features[featureId] = newFeature;
                    delete me.overlays[overlayId].features[featureId];
                } else {
                    adapter.error.error(caller, "Feature could not be found with id " + featureId +
                        " and overlayId " + overlayId, {type: "invalid_id"});
                }
            }
        };








        me.getOverlays = function() {
            return me.overlays;
        };

        /**
         * outputs the current saved overlays
         * @method debug
         * @memberof module:cmwapi-adapter/EsriOverlayManager
         */
        me.debug = function() {
            console.log(me.overlays);
        };
    };

    return EsriOverlayManager;
});

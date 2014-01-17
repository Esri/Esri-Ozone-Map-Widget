define(["cmwapi/cmwapi", "cmwapi-adapter/ViewUtils"], function(cmwapi, ViewUtils) {
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
     *
     * @version 1.1
     *
     * @module cmwapi-adapter/EsriOverlayManager/Overlay
     */

     var handlers = function(manager, map, adapter) {
        var me = this;

        /**
         * An overlay layer to contain features.
         * @constructor
         * @param overlayId {String} the unique id by which this overlay should be identified
         * @param name {String} optional; the non-unique readable name; if not specified the id will be used
         * @param parentId {String} optional; the parent to be set for this overlay
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Overlay
         */
        var Overlay = function(overlayId, name, parentId) {
            this.id= overlayId;
            this.name= name || '';
            //Overlay IDs of children overlays
            this.children = {};

            //Mapping FeatureID->Feature object of children features
            this.features = {};
            this.isHidden = false;
            if(parentId) {
                this.parentId = parentId;
                resolveParent(this, parentId);
            }
        };

        var sendError = function(caller, msg, error) {
            var sender = caller;
            var type = error.type;

            cmwapi.error.send(sender, type, msg, error);
        };

        /**
         * @private
         * @method resolveParent
         * @param childId {String} The id of the child for which the parent should be set
         * @param parentId {String} The id of the overlay to be set as parent
         * @param previousParentId {String} optional; The id of the overlay that was previously designated as parent to the childId
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Overlay#
         */
        var resolveParent = function(child, parentId, previousParentId) {
            if(previousParentId) {
                delete manager.overlays[previousParentId].children[child.id];
            }

            if(manager.overlays[parentId]) {
                manager.overlays[parentId].children[child.id] = child;
            }
        };

        /**
         * This function will create a new overlay in a non-destructive manner.  If an overlay with the
         * given overlayId already exists, this function will have no effect.
         * @method createOverlay
         * @param caller {String} the id of the widget which made the request resulting in this function call.
         * @param name {String} optional; The readable name for the overlay; if not specified the id will be used
         * @param overlayId {String} The id of the overlay to create; if it exists nothing will be created
         * @param parentId {String} The id of the overlay to be set as the parent of the overlay being created.
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Overlay#
         */
        me.createOverlay = function(caller, overlayId, name, parentId) {
            if(!manager.overlays[overlayId]) {
                manager.overlays[overlayId] = new Overlay(overlayId, name, parentId);
                manager.treeChanged();
            }
        };

        /**
         * @method deleteOverlay
         * @param caller {String} the id of the widget which made the request resulting in this function call.
         * @param overlayId {String} the id of the overlay to be deleted from the manager
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Overlay#
         */
        me.removeOverlay = function(caller, overlayId) {
            //TODO Error if overlay not found?

            var overlay = manager.overlays[overlayId];

            if(overlay) {
                //find parent
                var parent = manager.overlays[overlay.parentId];
                if(parent) {
                    delete parent.children[overlayId];
                }

                var features = overlay.features;
                for(var i in features) {
                    if(features.hasOwnProperty(i)) {
                        manager.feature.deleteFeature(caller, overlayId, features[i].featureId);
                    }
                }

                var children = overlay.children;
                //recursively remove children from this overlay
                for(i in children) {
                    if(children.hasOwnProperty(i)) {
                        me.removeOverlay(caller, i);
                    }
                }
            }

            delete manager.overlays[overlayId];
            manager.treeChanged();
        };

        /**
         * @method hideOverlay
         * @param caller {String} the id of the widget which made the request resulting in this function call.
         * @param overlayId {String} the id of the overlay to be hidden
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Overlay#
         */
        me.hideOverlay = function(caller, overlayId) {
            var overlay = manager.overlays[overlayId];
            if(!overlay) {
                var msg = "Overlay not found with id " + overlayId;
                sendError(caller, msg, {type: "map.overlay.hide", msg: msg});
            } else {
                overlay.isHidden = true;

                for(var i in overlay.features) {
                    if(overlay.features.hasOwnProperty(i)) {
                        overlay.features[i].isHidden = true;
                        overlay.features[i].esriObject.hide();
                    }
                }

                for(var o in overlay.children) {
                    if(overlay.children.hasOwnProperty(o)) {
                        me.hideOverlay(caller, o);
                    }
                }

                manager.treeChanged();
            }
        };

        /**
         * @method showOverlay
         * @param caller {String} the id of the widget which made the request resulting in this function call.
         * @param overlayId {String} the id of the overlay to be shown
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Overlay#
         */
        me.showOverlay = function(caller, overlayId) {
            var overlay = manager.overlays[overlayId];
            if(!overlay) {
                var msg = "Overlay not found with id " + overlayId;
                sendError(caller, msg, {type: "map.overlay.show", msg: msg});
            } else {
                overlay.isHidden = false;

                var features = overlay.features;
                for(var i in features) {
                    if(features.hasOwnProperty(i)) {
                        features[i].isHidden = false;
                        features[i].esriObject.show();
                    }
                }

                for(var o in overlay.children) {
                    if(overlay.children.hasOwnProperty(o)) {
                        me.showOverlay(caller, o);
                    }
                }
                manager.treeChanged();
            }
        };

        /**
         * @method updateOverlay
         * @param caller {String} the id of the widget which made the request resulting in this function call.
         * @param overlayId {String} the id of the overlay to be updated.
         * @param name {String} The name that should be set; the current or a new name.
         * @param parentId {String} optional; the id of the overlay to be set as the parent.
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Overlay#
         */
        me.updateOverlay = function(caller, overlayId, name, parentId) {
            if(typeof(manager.overlays[overlayId]) === 'undefined') {
                var msg = "No overlay exists with the provided id of " + overlayId;
                sendError(caller, msg, {type: 'map.overlay.update', msg: msg});
            } else {
                var overlay = manager.overlays[overlayId];
                if(name && overlay.name !== name) {
                    overlay.name = name;
                }
                if(parentId && parentId !== overlay.parentId) {
                    var oldParent = overlay.parentId;
                    overlay.parentId = parentId;
                    resolveParent(overlay, parentId, oldParent);
                }
                manager.treeChanged();
            }
        };

        /**
         * @method zoom
         * @param caller {String}
         * @param overlayId {String}
         * @param zoom {number}
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Overlay#
         */
        me.zoom = function(caller, overlayId, range) {
            var overlay = manager.overlays[overlayId];
            var msg;
            if(typeof(overlay) === 'undefined') {
                msg = "Overlay could not be found with id " + overlayId;
                sendError(caller, msg, {type: "map.feature.zoom", msg: msg});
                return;
            }

            var extent = ViewUtils.findOverlayExtent(overlay);

            if(extent) {
                // If auto zoom, reset the entire extent.
                if (range && range.toString().toLowerCase() === "auto") {
                    map.setExtent(extent, true);
                }
                // If we have a non-auto zoom, recenter the map and zoom.
                else if (typeof range !== "undefined") {
                    // Set the zoom level.
                    map.setScale(ViewUtils.zoomAltitudeToScale(map, range));

                    // Recenter the map.
                    map.centerAt(extent.getCenter());
                }
                // Otherwise, use recenter the map.
                else {
                    map.centerAt(extent.getCenter());
                }
            }
        };
    };

    return handlers;
});
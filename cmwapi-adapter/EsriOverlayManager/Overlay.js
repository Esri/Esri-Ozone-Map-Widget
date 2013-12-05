define(function() {
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
     * @module cmwapi-adapter/EsriOverlayManager/Overlay
     */

     var handlers = function(manager, adapter) {
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
         * @private
         * @method resolveParent
         * @param childId {String} The id of the child for which the parent should be set
         * @param parentId {String} The id of the overlay to be set as parent
         * @param previousParentId {String} optional; The id of the overlay that was previously designated as parent to the childId
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
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
         * @method createOverlay
         * @param caller {String} the id of the widget which made the request resulting in this function call.
         * @param name {String} optional; The readable name for the overlay; if not specified the id will be used
         * @param overlayId {String} The id of the overlay to create; if it exists nothing will be created
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        me.createOverlay = function(caller, overlayId, name, parentId) {
            if(manager.overlays[overlayId]) {
                me.updateOverlay(caller, name, overlayId, parentId);
            } else {
                manager.overlays[overlayId] = new Overlay(overlayId, name, parentId);
                manager.treeChanged();
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

            var overlay = manager.overlays[overlayId];

            if(overlay) {
                //find parent
                var parent = manager.overlays[overlay.parentId];
                if(parent) {
                    delete parent.children[overlayId];
                }

                var features = Object.keys(overlay.features);
                for(var i = 0; i < features.length; i++) {
                    manager.feature.deleteFeature(overlayId, features[i].featureId);
                }

                var children = Object.keys(overlay.children);
                //recursively remove children from this overlay
                for(i = 0; i < children.length; i++) {
                    me.removeOverlay(caller, children[i]);
                }
            }

            delete manager.overlays[overlayId];
            manager.treeChanged();
        };

        /**
         * @method hideOverlay
         * @param caller {String} the id of the widget which made the request resulting in this function call.
         * @param overlayId {String} the id of the overlay to be hidden
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        me.hideOverlay = function(caller, overlayId) {
            var overlay = manager.overlays[overlayId];
            if(!overlay) {
                adapter.error.error(caller, "Overlay not found with id " + overlayId, {type: "invalid_id"});
            } else {
                overlay.isHidden = true;

                var features = Object.keys(overlay.features);
                for(var i = 0; i < features.length; i++) {
                    feature[i].isHidden = true;
                    feature[i].esriObject.hide();
                }
                manager.treeChanged();
            }
        };

        /**
         * @method showOverlay
         * @param caller {String} the id of the widget which made the request resulting in this function call.
         * @param overlayId {String} the id of the overlay to be shown
         * @memberof module:cmwapi-adapter/EsriOverlayManager#
         */
        me.showOverlay = function(overlayId) {
            var overlay = manager.overlays[overlayId];
            if(!overlay) {
                adapter.error.error(caller, "Overlay not found with id " + overlayId, {type: "invalid_id"});
            } else {
                overlay.isHidden = false;

                var features = Object.keys(overlay.features);
                for(var i = 0; i < features.length; i++) {
                    feature[i].isHidden = false;
                    feature[i].esriObject.show();
                }
                manager.treeChanged();
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
            if(typeof(manager.overlays[overlayId]) === 'undefined') {
                var msg = "No overlay exists with the provided id of " + overlayId;
                adapter.error.error(sender, msg, {type: 'map.overlay.update', msg: msg});
            } else {
                if(me.overlays[overlayId].name !== name) {
                    me.overlays[overlayId].setName(name);
                }
                if(parentId && parentId !== me.overlays[overlayId].parentId) {
                    me.designateParent(overlayId, parentId);
                }
                manager.treeChanged();
            }
        };
    };

    return handlers;
});
define(["cmwapi/cmwapi", "esri/layers/KMLLayer", "cmwapi-adapter/EsriOverlayManager/Overlay", "cmwapi-adapter/EsriOverlayManager/Feature"],
    function(cmwapi, KMLLayer, OverlayHandler, FeatureHandler) {

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

        me.overlay = new OverlayHandler(me, map, adapter);
        me.feature = new FeatureHandler(me, map, adapter);

        var treeChangedHandlers = [];
        me.bindTreeChangeHandler = function(handlerFunction) {
            if(typeof(handlerFunction) === 'function') {
                treeChangedHandlers.push(handlerFunction);
            }
        };

        me.treeChanged = function() {
            for(var i = 0; i < treeChangedHandlers.length; i++) {
                treeChangedHandlers[i]();
            }
        };

        me.getOverlayTree = function() {
            var result = [];
            var overlay;
            for(var overlayId in me.overlays) {
                overlay = me.overlays[overlayId];
                if(!overlay.parentId) {
                    result.push(resolveOverlayChildren(overlay.id));
                }
            }
            return result;
        };

        var resolveOverlayChildren = function(overlayId) {
            var overlay = me.overlays[overlayId];

            var res = {
                type: 'overlay',
                id: overlay.id,
                name: overlay.name,
                isHidden: overlay.isHidden,
                children: []
            };

            var child;
            var resolvedChild;
            var feature;

            for(var childId in overlay.children) {
                child = overlay.children[childId];
                resolvedChild = resolveOverlayChildren(child.id);
                res.children.push(resolvedChild);
            }
            for(var featureId in overlay.features) {
                feature = overlay.features[featureId];
                res.children.push({
                    type: 'feature',
                    id: feature.featureId,
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
        };

//////////////////////////
        me.sendOverlayCreate = function(id, name, parentId) {
            cmwapi.overlay.create.send({
                name: name,
                overlayId: id,
                parentId: parentId
            });
        };

        me.sendOverlayRemove = function(overlayId) {
            cmwapi.overlay.remove.send({
                overlayId: overlayId
            });
        };

        me.sendOverlayHide = function(overlayId) {
            cmwapi.overlay.hide.send({
                overlayId: overlayId
            });
        };

        me.sendOverlayShow = function(overlayId) {
            cmwapi.overlay.show.send({
                overlayId: overlayId
            });
        };

        me.sendOverlayUpdate = function(overlayId, name, newParentId) {
            cmwapi.overlay.update.send({
                overlayId: overlayId,
                name: name,
                parentId: newParentId
            });
        }

        me.sendFeaturePlotUrl = function(overlayId, featureId, name, format, url, params, zoom) {
            cmwapi.feature.plot.url.send({
                overlayId: overlayId,
                featureId: featureId,
                name: name,
                format: format,
                url: url,
                params: params,
                zoom: zoom
            });
        };

        me.sendFeatureUnplot = function(overlayId, featureId) {
            cmwapi.feature.unplot.send({
                overlayId: overlayId,
                featureId: featureId
            });
        };

        me.sendFeatureUpdate = function(overlayId, featureId, newName, newOverlayId) {
            cmwapi.feature.update.send({
                overlayId: overlayId,
                featureId: featureId,
                newOverlayId: newOverlayId,
                name: newName
            });
        };

        me.sendFeatureHide = function(overlayId, featureId) {
            cmwapi.feature.hide.send({
                overlayId: overlayId,
                featureId: featureId
            });
        };

        me.sendFeatureShow = function(overlayId, featureId, zoom) {
            cmwapi.feature.show.send({
                overlayId: overlayId,
                featureId: featureId,
                zoom: (zoom ? zoom : false)
            });
        };
    };

    return EsriOverlayManager;
});

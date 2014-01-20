define(["cmwapi/cmwapi", "esri/layers/KMLLayer", "esri/layers/WMSLayer", "esri/layers/WMSLayerInfo", "cmwapi-adapter/ViewUtils",
    "esri/layers/GraphicsLayer", "esri/graphic","esri/symbols/PictureMarkerSymbol", "esri/geometry/Point", "esri/InfoTemplate"],
    function(cmwapi, KMLLayer, WMSLayer, WMSLayerInfo, ViewUtils, GraphicsLayer, Graphic, PictureMarkerSymbol, Point, InfoTemplate) {

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
     * @module cmwapi-adapter/EsriOverlayManager/Feature
     */

    //This is the symbol associated with a marker placed on a map, the image is alrady encoded in the infodata.
    var MARKER_SYMBOL = {"angle":0,"xoffset":2,"yoffset":8,"type":"esriPMS","url":"http://static.arcgis.com/images/Symbols/Basic/BlueShinyPin.png","imageData":"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","contentType":"image/png","width":24,"height":24};


    var handler = function(manager, map) {
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
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Feature
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

        var sendError = function(caller, message, err) {
            var sender = caller;
            var type = err.type;
            var msg = message;
            var error = err;

            cmwapi.error.send(sender, type, msg, error);
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
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Feature#
         */
        me.plotFeature = function(caller, overlayId, featureId, name, format, feature, zoom) {
            /*if(typeof(manager.overlays[overlayId]) === undefined) {
                manager.overlay.createOverlay(caller, overlayId, overlayId);
            }

            var overlay = manager.overlays[overlayId];

            if(typeof(overlay.features[featureId] !== 'undefined')) {
                me.deleteFeature(caller, overlayId, featureId);
            }
            //create
            //overlay.features[featureId] = new Feature(ovelayId, featureId, name, format, feature, zoom);
            //add to map
            //zoom if feature.zoom === true*/
            var msg = "Function not yet implemented";
            sendError(caller, msg, {msg: msg, type: "not_yet_implemented"});
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
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Feature#
         */
        me.plotFeatureUrl = function(caller, overlayId, featureId, name, format, url, params, zoom) {
            if(typeof(manager.overlays[overlayId]) === 'undefined') {
                manager.overlay.createOverlay(caller, overlayId, overlayId);
            }

            var overlay = manager.overlays[overlayId];
            if(typeof(overlay.features[featureId]) !== 'undefined') {
                me.deleteFeature(caller, overlayId, featureId);
            }

            //if a type we like then handler function
            if(format === 'kml') {
                plotKmlFeatureUrl(caller, overlayId, featureId, name, url, zoom);
            } else if(format === "wms") {
                plotWmsFeatureUrl(caller, overlayId, featureId, name, url, params, zoom);
            } else {
                var msg = "Format, " + format + " of data is not accepted";
                sendError(caller, msg, {msg: msg, type: 'invalid_data_format'});
            }
        };

        /**
         * @method plotMarker
         * @param caller {String} the id of the widget which made the request resulting in this function call.
         * @param overlayId {String} The id of the overlay on which this marker should be displayed
         * @param featureId {String} The id to be given for the feature, unique to the provided overlayId
         * @param name {String} The readable name for which this feature should be labeled
         * @param marker {String} The icon and location information of the marker to be placed.
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Feature#
         */
        me.plotMarker = function(caller, overlayId, featureId, name, marker, zoom) {
            if(typeof(manager.overlays[overlayId]) === 'undefined') {
                manager.overlay.createOverlay(caller, overlayId, overlayId);
            }
            var overlay = manager.overlays[overlayId];
            if(typeof(overlay.features[featureId]) !== 'undefined') {
                me.deleteFeature(caller, overlayId, featureId);
            }
            var layer = new GraphicsLayer();
            var markerImage = marker.iconUrl ? {url : marker.iconUrl, height: 25, width: 25} : MARKER_SYMBOL;
            var symbol = new PictureMarkerSymbol(markerImage);
            var point = new Point(marker.latlong.long, marker.latlong.lat);
            var graphic = new Graphic(point, symbol);
            var infoTemplate = new InfoTemplate();

            infoTemplate.setTitle(name);
            infoTemplate.setContent(marker.details);

            graphic.setAttributes({id: featureId, name: name});
            graphic.setInfoTemplate(infoTemplate);
            layer.add(graphic);
            map.addLayer(layer);
            zoom = zoom ? map.getMaxZoom() : undefined;
            map.setZoom(zoom);
            map.centerAt(point);
            overlay.features[featureId] = new Feature(overlayId, featureId, name, 'marker', null, null, layer);
            
            // Add the original marker data to the feature so it can be recreated if persisted to OWF preferences or elsewhere.
            overlay.features[featureId].marker = marker;

            layer.on('click', function(e) {
                cmwapi.feature.selected.send({
                    overlayId:overlayId,
                    featureId:featureId,
                    selectedId: e.graphic.attributes.id,
                    selectedName: e.graphic.attributes.name
                });
            });

            layer.on("error", function(e) {
                _layerErrorHandler(caller, overlayId, featureId, layer, e);
            });
            manager.treeChanged();
        };

        /**
         * Plots a kml layer via url to the map
         * @private
         * @method plotKmlFeatureUrl
         * @param caller {String} The widget making a request that led to this method call
         * @param overlayId {String} The unique id of the overlay containing the feature to be plotted
         * @param featureId {String} The id, unique to the overlay, to be given to the plotted feature
         * @param name {String} The non-unique readable name to give to the feature
         * @param url {String} The url containing kml data to be plotted
         * @param [zoom] {Boolean} If the plotted feature should be zoomed to upon being plotted
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Feature#
         */
        var plotKmlFeatureUrl = function(caller, overlayId, featureId, name, url, zoom) {
            var layer = new KMLLayer(url);

            map.addLayer(layer);

            var overlay = manager.overlays[overlayId];
            overlay.features[featureId] = new Feature(overlayId, featureId, name, 'kml-url', url, zoom, layer);

            layer.on("load", function() {
                addKmlFeatureListeners(caller, overlayId, featureId, layer);
                if(zoom) {
                    me.zoom(caller, overlayId, featureId, null, null, "auto");
                }
            });

            layer.on("error", function(e) {
                _layerErrorHandler(caller, overlayId, featureId, layer, e);
            });

            manager.treeChanged();
        };

        var _layerErrorHandler = function( caller, overlayId, featureId, layer, e ) {
            var msg = 'Unable to apply layer - ' + e.error;
            manager.notifyError(caller, msg);
            sendError( caller, msg, {msg: msg, type: 'layer_error'});
            me.deleteFeature(caller, overlayId, featureId);

        };

        /**
         * Recursively adds listeners to kml layer data in order to bind to kml select events
         * @private
         * @param caller {String} The widget making a request that led to this method call
         * @param overlayId {String} The unique id of the overlay containing the feature to be selected
         * @param featureId {String} The id, unique to the overlay, to be given to the selected feature
         * @param layer {String} Top KML layer that will be recursed down.
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Feature#
         */
        var addKmlFeatureListeners = function(caller, overlayId, featureId, layer) {
            var sendSelected = function(e) {
                cmwapi.feature.selected.send({
                    overlayId:overlayId,
                    featureId:featureId,
                    selectedId: e.graphic.attributes.id,
                    selectedName: e.graphic.attributes.name
                });
            };
            (function onLoadListenRecurse(currLayer) {
                currLayer = currLayer.layer ? currLayer.layer : currLayer;
                var curr = currLayer.getLayers();
                for(var i =0; i < curr.length; i++) {
                    if(curr[i].loaded) {
                        curr[i].on('click', sendSelected);
                    } else {
                        curr[i].on('load', onLoadListenRecurse);
                    }
                }
            })(layer);
        };

        /**
         * Plots a wms layer via url to the map
         * @private
         * @param caller {String} The widget making a request that led to this method call
         * @param overlayId {String} The unique id of the overlay containing the feature to be plotted
         * @param featureId {String} The id, unique to the overlay, to be given to the plotted feature
         * @param name {String} The non-unique readable name to give to the feature
         * @param url {String} The url containing kml data to be plotted
         * @param params {Object} wms params to be used when pulling data from the url
         * @param [zoom] {Boolean} If the plotted feature should be zoomed to upon being plotted
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Feature#
         */
        var plotWmsFeatureUrl = function(caller, overlayId, featureId, name, url, params, zoom) {

            var layerInfos;
            if(cmwapi.validator.isArray(params.layers)) {
                layerInfos = [];
                for(var i = 0; i < params.layers.length; i++) {
                    layerInfos.push(new WMSLayerInfo({name: params.layers[i], title: params.layers[i]}));
                }
            } else {
                layerInfos = [new WMSLayerInfo({name: params.layers, title: params.layers})];
            }

            var details = {extent: map.geographicExtent, layerInfos: layerInfos};
            var layer = new WMSLayer(url, details);

            layer.setVisibleLayers([params.layers]);
            map.addLayer(layer);

            var overlay = manager.overlays[overlayId];

            overlay.features[featureId] = new Feature(overlayId, featureId, name, 'wms-url', url, zoom, layer);
            overlay.features[featureId].params = params;

            layer.on("load", function() {
                if(zoom) {
                    me.zoom(caller, overlayId, featureId, null, null, "auto");
                }

            });

            layer.on("error", function(e) {
                _layerErrorHandler(caller, overlayId, featureId, layer, e);
            });


            manager.treeChanged();
        };

        /**
         * @method deleteFeature
         * @param overlayId {String} The id of the overlay which contains the feature to be removed
         * @param featureId {String} The id of the feature which is to be removed
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Feature#
         */
        me.deleteFeature = function(caller, overlayId, featureId) {
            var overlay = manager.overlays[overlayId];
            var msg;
            if(typeof(overlay) === 'undefined') {
                msg = "Overlay could not be found with id " + overlayId;
                sendError(caller, msg, {type: "map.feature.unplot", msg: msg});
                return;
            }

            var feature = overlay.features[featureId];
            if(typeof(feature) === 'undefined') {
                msg = "Feature could not be found with id " + featureId + " and overlayId " + overlayId;
                sendError(caller, msg, {type: "map.feature.unplot", msg: msg});
                return;
            }

            if (feature.esriObject) {   // we may have added to the tree, but are still in state on pulling up esri layers
                map.removeLayer(feature.esriObject);
            }

            delete overlay.features[featureId];
            manager.treeChanged();
        };

        /**
         * @method hideFeature
         * @param overlayId {String} The id of the overlay which contains the feature to be hidden
         * @param featureId {String} The id of the feature which is to be hidden
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Feature#
         */
        me.hideFeature = function(caller, overlayId, featureId) {
            var overlay = manager.overlays[overlayId];
            var msg;
            if(typeof(overlay) === 'undefined') {
                msg = "Overlay could not be found with id " + overlayId;
                sendError(caller, msg, {type: "map.feature.hide", msg: msg});
                return;
            }
            var feature = overlay.features[featureId];
            if(typeof(feature) === 'undefined') {
                msg = "Feature could not be found with id " + featureId + " and overlayId " + overlayId;
                sendError(caller, msg, {type: "map.feature.hide", msg: msg});
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
         * @param zoom {boolean} When true, the map will automatically zoom to the feature when shown.
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Feature#
         */
        me.showFeature = function(caller, overlayId, featureId, zoom) {
            var overlay = manager.overlays[overlayId];
            var msg;
            if(typeof(overlay) === 'undefined') {
                msg = "Overlay could not be found with id " + overlayId;
                sendError(caller, msg, {type: "map.feature.show", msg: msg});
                return;
            }
            var feature = overlay.features[featureId];
            if(typeof(feature) === 'undefined') {
                msg = "Feature could not be found with id " + featureId + " and overlayId " + overlayId;
                sendError(caller, msg, {type: "map.feature.show", msg: msg});
                return;
            }

            if (zoom) {
                me.zoom(caller, overlayId, featureId, null, null, "auto");
            }

            if(feature.isHidden) {
                feature.isHidden = false;
                feature.esriObject.show();
                manager.treeChanged();
            }

        };

        /**
         * @method zoom
         * @param caller {String}
         * @param overlayId {String}
         * @param featureId {String}
         * @param [selectedId] {String}  Not used at present
         * @param [selectedName] {String} Not used at present
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Feature#
         */
        me.zoom = function(caller, overlayId, featureId, selectedId, selectedName, range) {
            var overlay = manager.overlays[overlayId];
            var msg;
            if(typeof(overlay) === 'undefined') {
                msg = "Overlay could not be found with id " + overlayId;
                sendError(caller, msg, {type: "map.feature.zoom", msg: msg});
                return;
            }
            var feature = overlay.features[featureId];
            if(typeof(feature) === 'undefined') {
                msg = "Feature could not be found with id " + featureId + " and overlayId " + overlayId;
                sendError(caller, msg, {type: "map.feature.zoom", msg: msg});
                return;
            }

            //wms -> noop -- Can't center or zoom on wms because wms always responds to current extent
            if(feature.format !== 'wms' && feature.format !== 'wms-url') {
                var extent = ViewUtils.findLayerExtent(feature.esriObject);

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
            }
        };

        /**
         * @method centerFeature
         * @param caller {String}
         * @param overlayId {String}
         * @param featureId {String}
         * @param [selectedId] {String}
         * @param [selectedName] {String}
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Feature#
         */
        me.centerFeatureGraphic = function(caller, overlayId, featureId, selectedId, selectedName) {
            var overlay = manager.overlays[overlayId];
            var msg;
            if(typeof(overlay) === 'undefined') {
                msg = "Overlay could not be found with id " + overlayId;
                sendError(caller, msg, {type: "map.feature.zoom", msg: msg});
                return;
            }
            var feature = overlay.features[featureId];
            if(typeof(feature) === 'undefined') {
                msg = "Feature could not be found with id " + featureId + " and overlayId " + overlayId;
                sendError(caller, msg, {type: "map.feature.zoom", msg: msg});
                return;
            }
            var layers = feature.esriObject.getLayers();
            recurseGraphic(layers, selectedId, selectedName);
        };


        var recurseGraphic = function(currLayerArr, selectedId, selectedName) {
            for(var i = 0; i < currLayerArr.length; i++) {
                var currLayer = currLayerArr[i].layer || currLayerArr[i];
                if(currLayer.graphics) {
                    var graphics = currLayer.graphics;
                    for(var j =0; j < graphics.length; j++) {
                        if(graphics[j].attributes.id === selectedId || graphics[j].attributes.name === selectedName) {
                            if(graphics[j].geometry.type.toLowerCase() === 'point') {
                                map.centerAt(graphics[j].geometry);
                            } else if(graphics[j].geometry.type.toLowerCase() === 'extent') {
                                 map.centerAt(graphics[j].geometry.getCenter());
                            } else {
                                map.centerAt(graphics[j].geometry.getExtent().getCenter());
                            }
                        }
                    }
                } else if(!currLayer.graphics && (typeof(currLayer.getLayers) != "undefined")) {
                    recurseGraphic(currLayer.getLayers(), selectedId, selectedName);
                }
            }
        };

        /**
         * @method updateFeature
         * @param overlayId {String}
         * @param featureId {String}
         * @param [name] {String}
         * @param [newOverlayId] {String}
         * @memberof module:cmwapi-adapter/EsriOverlayManager/Feature#
         */
        me.updateFeature = function(caller, overlayId, featureId, name, newOverlayId) {
            var msg = "";
            if(typeof(manager.overlays[overlayId]) === 'undefined' || typeof(manager.overlays[overlayId].features[featureId]) === 'undefined') {
                msg = "Feature could not be found with id " + featureId + " and overlayId " + overlayId;
                sendError(caller, msg, {type: "map.feature.update", msg: msg});
            } else {
                var feature = manager.overlays[overlayId].features[featureId];

                if(name !== feature.name) {
                    manager.overlays[overlayId].features[featureId].name = name;
                }

                if(newOverlayId && newOverlayId !== overlayId) {
                    if(typeof(manager.overlays[newOverlayId]) === 'undefined') {
                        //FIXME What should happen here?.
                        msg = "Could not find overlay with id " + newOverlayId;
                        sendError(caller, msg, {type: "map.feature.update", msg: msg});
                    } else {
                        name = (name ? name : feature.name);

                        var newFeature = new Feature(newOverlayId, featureId, name, feature.format, feature.feature, feature.zoom, feature.esriObject);
                        manager.overlays[newOverlayId].features[featureId] = newFeature;
                        delete manager.overlays[overlayId].features[featureId];

                        //hide it if the new overlay is hidden
                        if(manager.overlays[newOverlayId].isHidden) {
                            me.hideFeature(caller, newOverlayId, featureId);
                        }
                    }
                }
                manager.treeChanged();
            }
        };

    };

    return handler;
});
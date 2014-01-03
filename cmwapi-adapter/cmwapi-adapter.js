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
 * @module EsriAdapter
 */
define(["cmwapi/cmwapi", "cmwapi-adapter/Overlay", "cmwapi-adapter/Feature", "cmwapi-adapter/Status",
        "cmwapi-adapter/View", "cmwapi-adapter/Error", "cmwapi-adapter/EsriOverlayManager"],
        function(CommonMapApi, Overlay, Feature, Status, View, Error, OverlayManager) {

    /**
     * @classdesc Adapter layer between Common Map Widget API v. 1.1 javascript
     *      implementation and ESRI map implementations
     * @constructor
     * @version 1.1
     * @param map {object} ESRI map object for which this adapter should apply
     * @alias module:EsriAdapter
     */
    var EsriAdapter = function(map) {
        // Capture 'this' for use in custom event handlers.
        var me = this;

        /**
         * Handles click events on an ArcGIS map and reports the event over a CMWAPI channel.
         * @private
         * @param {MouseEvent} evt A MouseEvent fired by an ArcGIS map.  This is essentially a DOM MouseEvent
         *     with added, ArcGIS-specific attributes.
         * @param {string} type Should be either {@link module:cmwapi/map/view/Clicked|SINGLE} or
         *    {@link module:cmwapi/map/view/Clicked|DOUBLE}; Default is the former value.
         * @memberof! module:EsriAdapter#
         */
        var sendClick = function(evt, type) {
            var payload = {};
            var keys = [];

            // Calculate lat/lon from event's MapPoint.
            payload.lat = evt.mapPoint.getLatitude();
            payload.lon = evt.mapPoint.getLongitude();

            // Determine the keys selected during a mouse click.
            if (evt.altKey) {
                keys.push(CommonMapApi.view.clicked.ALT);
            }
            if (evt.shiftKey) {
                keys.push(CommonMapApi.view.clicked.SHIFT);
            }
            if (evt.ctrlKey) {
                keys.push(CommonMapApi.view.clicked.CTRL);
            }
            if (keys.length === 0) {
                keys.push(CommonMapApi.view.clicked.NONE);
            }
            payload.keys = keys;

            // Take the input type.
            payload.type = (typeof type !== "undefined") ? type : CommonMapApi.view.clicked.SINGLE;

            // Determine the button clicked.
            if (evt.button === 0) {
                payload.button = CommonMapApi.view.clicked.LEFT;
            }
            else if (evt.button === 1) {
                payload.button = CommonMapApi.view.clicked.MIDDLE;
            }
            else if (evt.button === 2) {
                payload.button = CommonMapApi.view.clicked.RIGHT;
            }
            else {
                // Simply return without sending a click.  We're not interested in
                // other buttons for now.  If we send this anyway without a button
                // specified, the value may be interpreted as a "left" button by
                // any widgets using an older CMWAPI implementation.
                return false;
            }

            CommonMapApi.view.clicked.send(payload);
        };

        /**
         * Handles double click events on an ArcGIS map and reports the event over a CMWAPI channel.
         * @private
         * @param {MouseEvent} evt A MouseEvent fired by an ArcGIS map.  This is essentially a DOM MouseEvent
         *     with added, ArcGIS-specific attributes.
         * @memberof! module:EsriAdapter#
         */
        var sendDoubleClick = function(evt) {
            sendClick(evt, CommonMapApi.view.clicked.DOUBLE);
        };

        /**
         * Reports out changes in an ArcGIS map extent according to the CMWAPI
         * map.status.view channel definition.
         * @private
         * @memberof! module:EsriAdapter#
         */
        var sendStatusViewUpdate = function() {
            me.status.sendView(OWF.getInstanceId());
        };

        /**
         * An event unloader.  It removes our custom handlers from an ArcGIS map object.
         * @private
         * @memberof! module:EsriAdapter#
         */
        var unloadHandlers = function() {
            console.log("UNLOADING OUR CUSTOM MAP EVENT HANDLERS!");
            me.clickHandler.remove();
            me.dblClickHandler.remove();
            me.unloadMapHandler.remove();
        };



        this.overlayManager = new OverlayManager(map);

        // Attach any exposed instance attributes.
        this.overlay = new Overlay(this, this.overlayManager);
        this.feature = new Feature(this, this.overlayManager);
        this.status = new Status(this, map );
        this.view = new View(map, this.overlayManager);
        this.error = new Error(this);

        // Attach any custom map handlers.
        this.clickHandler = map.on("click", sendClick);
        this.dblClickHandler = map.on("dbl-click", sendDoubleClick);
        this.extentChangeHandler = map.on("extent-change", sendStatusViewUpdate);

        this.unloadMapHandler = map.on("unload", unloadHandlers);


        var handleDragAndDrop = function(overlayManager) {
            var dropZone = map.root;
            var mouseLocation;
            map.on('mouse-up', function(e) {
                mouseLocation = e;
            });
            map.on('mouse-over', function() {
                OWF.DragAndDrop.setDropEnabled(true);
            });
            map.on('mouse-out', function() {
                OWF.DragAndDrop.setDropEnabled(false);
            });
            OWF.DragAndDrop.addDropZoneHandler({
                dropZone: dropZone,
                handler: function (evt) {
                    var callerId = OWF.Util.parseJson(evt.dragSourceId).id;
                    var overlayId = evt.dragDropData.overlayId || OWF.getInstanceId();
                    var featureId = evt.dragDropData.featureId;
                    var name = evt.dragDropData.name;
                    var zoom = evt.dragDropData.zoom ? true : false;
                    var payload = {};
                    payload.featureId = featureId;
                    if(evt.dragDropData.marker) {
                        payload.marker = {
                            details: evt.dragDropData.marker.details,
                            iconUrl:  evt.dragDropData.marker.iconUrl,
                            latlong: {
                                long : mouseLocation.mapPoint.getLongitude(),
                                lat: mouseLocation.mapPoint.getLatitude()
                            }
                        };
                    }
                    if(evt.dragDropData.feature) {
                        payload.feature = {
                            format: evt.dragDropData.feature.format,
                            featureData: evt.dragDropData.feature.featureData
                        };
                    }
                    if(evt.dragDropData.featureUrl) {
                        payload.featureUrl = {
                            format: evt.dragDropData.featureUrl.format,
                            url: evt.dragDropData.featureUrl.url,
                            params: evt.dragDropData.featureUrl.params
                        };
                    }
                    if(CommonMapApi.validator.validDragAndDropPayload(payload).result === true && mouseLocation) {
                        if(payload.marker) { //payload contains a marker.
                            overlayManager.feature.plotMarker(callerId, overlayId, featureId, name, payload.marker);
                        }
                        if(payload.feature) { //payload contains a feature string.
                            overlayManager.feature.plotFeature(
                                callerId,
                                overlayId,
                                featureId,
                                name,
                                payload.feature.format,
                                payload.feature.featureData);
                        }
                        if(payload.featureUrl) { // payload contains a feature url.
                             overlayManager.feature.plotFeatureUrl(
                                callerId,
                                overlayId,
                                featureId,
                                name,
                                payload.featureUrl.format,
                                payload.featureUrl.url,
                                payload.featureUrl.params,
                                zoom);
                        }
                        mouseLocation = null;
                    }
                }
            });
        }(this.overlayManager);
    };

    return EsriAdapter;
});

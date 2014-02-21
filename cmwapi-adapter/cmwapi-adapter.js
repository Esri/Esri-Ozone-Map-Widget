
define(["cmwapi/cmwapi", "cmwapi-adapter/Overlay", "cmwapi-adapter/Feature", "cmwapi-adapter/Status",
        "cmwapi-adapter/View", "cmwapi-adapter/Error", "cmwapi-adapter/EsriOverlayManager"],
        function(CommonMapApi, Overlay, Feature, Status, View, Error, OverlayManager) {
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
     * @description Adapter layer between Common Map Widget API v. 1.1 javascript
     *  implementation and ESRI map implementations
     *
     * @version 1.1
     *
     * @module cmwapi-adapter/cmwapi-adapter
     */

    /**
     * @constructor
     * @param map {object} ESRI map object for which this adapter should apply
     * @param errorNotifier
     * @param infoNotifier
     * @alias module:cmwapi-adapter/cmwapi-adapter
     */
    var EsriAdapter = function(map, errorNotifier, infoNotifier) {
        // Capture 'this' for use in custom event handlers.
        var me = this;

        //Keep track of the mouse location on mouse up events to handle drag and drop.
        var mouseLocation;

        /**
         * Handles click events on an ArcGIS map and reports the event over a CMWAPI channel.
         * @private
         * @method sendClick
         * @param {MouseEvent} evt A MouseEvent fired by an ArcGIS map.  This is essentially a DOM MouseEvent
         *     with added, ArcGIS-specific attributes.
         * @param {String} type Should be either {@link module:cmwapi/map/view/Clicked.SINGLE|SINGLE} or
         *    {@link module:cmwapi/map/view/Clicked.DOUBLE|DOUBLE}; Default is the former value.
         * @memberof module:cmwapi-adapter/cmwapi-adapter#
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
         * @method sendDoubleClick
         * @param {MouseEvent} evt A MouseEvent fired by an ArcGIS map.  This is
         *  essentially a DOM MouseEvent with added, ArcGIS-specific attributes.
         * @memberof module:cmwapi-adapter/cmwapi-adapter#
         */
        var sendDoubleClick = function(evt) {
            sendClick(evt, CommonMapApi.view.clicked.DOUBLE);
        };

        /**
         * Handles drag and drop events over the OWF DragAndDrop API.
         * @private
         * @method sendDragAndDrop
         * @param {MouseEvent} evt A MouseEvent fired by OWF.  This is essentially a DOM MouseEvent
         *  with added, OWF-specific attributes.
         * @memberof module:cmwapi-adapter/cmwapi-adapter#
         */
        var sendDragAndDrop = function(evt) {
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
            //Perform validation of the payload and verify that it contains the required fields
            var payloadValidation = CommonMapApi.validator.validDragAndDropPayload(payload);
            if(payloadValidation.result === true && mouseLocation) {
                //payload contains a marker.
                if(payload.marker) {
                    me.overlayManager.feature.plotMarker(callerId, overlayId, featureId, name, payload.marker, zoom);
                }
                //payload contains a feature string.
                if(payload.feature) {
                    me.overlayManager.feature.plotFeature(
                        callerId,
                        overlayId,
                        featureId,
                        name,
                        payload.feature.format,
                        payload.feature.featureData,
                        zoom);
                }
                // payload contains a feature url.
                if(payload.featureUrl) {
                     me.overlayManager.feature.plotFeatureUrl(
                        callerId,
                        overlayId,
                        featureId,
                        name,
                        payload.featureUrl.format,
                        payload.featureUrl.url,
                        payload.featureUrl.params,
                        zoom);
                }
                // Save the manager state.
                me.overlayManager.archiveState();
                mouseLocation = null;
            } else {
                me.error.error(callerId, payloadValidation.msg, {type: "map.feature.dragAndDrop", msg: payloadValidation.msg});
            }
        };

        /**
         * Reports out changes in an ArcGIS map extent according to the CMWAPI
         *  map.status.view channel definition.
         * @private
         * @method sendStatusViewUpdate
         * @memberof module:cmwapi-adapter/cmwapi-adapter#
         */
        var sendStatusViewUpdate = function() {
            me.status.sendView(OWF.getInstanceId());
        };

        /**
         * Updates the mouse location on mouse up events, to get to location for drag and drop
         * @private
         * @method updateMouseLocation
         * @param location {MouseEvent} The MouseEvent generated by the click mouseUp
         * @memberof module:cmwapi-adapter/cmwapi-adapter#
         */
        var updateMouseLocation = function(location) {
            mouseLocation = location;
        };

        /**
         * Notifies OWF that the map is compatible with the drag and drop api
         *  when a drag event is brought onto the map.
         * @private
         * @method setDropEnabled
         * @memberof module:cmwapi-adapter/cmwapi-adapter#
         */
        var setDropEnabled = function() {
            OWF.DragAndDrop.setDropEnabled(true);
        };

        /**
         * Notifies OWF that the map is no longer compatible with the drag and
         *  drop api when it is dragged outside of the map.
         * @private
         * @method setDropDisabled
         * @memberof! module:cmwapi-adapter/cmwapi-adapter#
         */
        var setDropDisabled = function() {
            OWF.DragAndDrop.setDropEnabled(false);
        };

        /**
         * An event unloader. It removes our custom handlers from an ArcGIS map object.
         * @private
         * @method unloadHandlers
         * @memberof module:cmwapi-adapter/cmwapi-adapter#
         */
        var unloadHandlers = function() {
            console.log("UNLOADING OUR CUSTOM MAP EVENT HANDLERS!");
            me.clickHandler.remove();
            me.dblClickHandler.remove();
            me.upClickHandler.remove();
            me.dropEnabledHandler.remove();
            me.dropDisabledHandler.remove();
            me.unloadMapHandler.remove();

        };

        this.overlayManager = new OverlayManager(map, errorNotifier, infoNotifier);
        this.overlayManager.retrieveState();

        // Attach any exposed instance attributes.
        /**
         * @see module:cmwapi-adapter/Overlay
         * @memberof! module:cmwapi-adapter/cmwapi-adapter#
         */
        this.overlay = new Overlay(this, this.overlayManager);
        /**
         * @see module:cmwapi-adapter/Feature
         * @memberof! module:cmwapi-adapter/cmwapi-adapter#
         */
        this.feature = new Feature(this, this.overlayManager, map);
        /**
         * @see module:cmwapi-adapter/Status
         * @memberof! module:cmwapi-adapter/cmwapi-adapter#
         */
        this.status = new Status(this, map );
        /**
         * @see module:cmwapi-adapter/View
         * @memberof! module:cmwapi-adapter/cmwapi-adapter#
         */
        this.view = new View(map, this.overlayManager);
        /**
         * @see module:cmwapi-adapter/Error
         * @memberof! module:cmwapi-adapter/cmwapi-adapter#
         */
        this.error = new Error(this);

        // Attach any custom map handlers.
        this.clickHandler = map.on("click", sendClick);
        this.dblClickHandler = map.on("dbl-click", sendDoubleClick);
        this.extentChangeHandler = map.on("extent-change", sendStatusViewUpdate);
        this.upClickHandler = map.on('mouse-up', updateMouseLocation);
        this.dropEnabledHandler = map.on('mouse-over', setDropEnabled);
        this.dropDisabledHandler = map.on('mouse-out', setDropDisabled);
        this.unloadMapHandler = map.on("unload", unloadHandlers);

        map.on('load', this.view.setInitialView);

        //Attach drop zone handler to OWF.
        OWF.DragAndDrop.addDropZoneHandler({ dropZone: map.root, handler: sendDragAndDrop });
    };

    return EsriAdapter;
});

/**
 * @module EsriAdapter
 */
define(["cmwapi", "esri/kernel", "cmwapi-overlay-manager"], function(CommonMapApi, EsriNS, OverlayManager) {
    /**
     * @classdesc Adapter layer between Common Map Widget API v. 1.1 javascript
     *      implementation and ESRI map implementations
     * @constructor
     * @version 1.1
     * @param map {object} ESRI map object for which this adapter should apply
     * @alias module:EsriAdapter
     */
    var EsriAdapter = function(map) {
        var overlayManager = new OverlayManager(this, map);

        /**
         * The container for the ESRI adapter overlay methods
         * @memberof module:EsriAdapter
         * @alias overlay
         */
        this.overlay = (function() {
            var me = this;

            /**
             * Handler for an incoming map overlay create request.
             * @method overlay.handleCreate
             * @param sender {String} the widget making the create overlay request
             * @param name {String} The non-unique readable name to be given to the created overlay.
             * @param overlayId {String} The unique id to be given to the created overlay.
             * @param parentId {String} optional; the id of the overlay to be set as the parent of the created overlay.
             * @memberof! module:EsriAdapter#
             */
            me.handleCreate = function(sender, name, overlayId, parentId) {
                overlayManager.createOverlay(name, overlayId, parentId);
            };
            //CommonMapApi.overlay.handleCreate(me.handleCreate);

            /**
             * Handler for an indcoming request to remove a layer.
             * @method overlay.handleRemove
             * @param sender {String} the widget making the remove overlay request
             * @param overlayId {String} optional; the id of the overlay to be removed; if not provided
             *      the id of the sender will be assumed.
             * @memberof! module:EsriAdapter#
             */
            me.handleRemove = function(sender, overlayId) {
                if(!overlayId) {
                    overlayId = sender;
                }

                overlayManager.removeOverlay(overlayId);
            };
            //CommonMapApi.overlay.handleRemove(me.handleRemove);

            /**
             * Handler for an indcoming request to hide a layer.
             * @method overlay.handleHide
             * @param sender {String} the widget making the hide overlay request
             * @param overlayId {String} optional; the id of the overlay to be removed; if not provided
             *      the id of the sender will be assumed.
             * @memberof! module:EsriAdapter#
             */
            me.handleHide = function(sender, overlayId) {
                if(!overlayId) {
                    overlayId = sender;
                }

                overlayManager.hideOverlay(overlayId);
            };
            //CommonMapApi.overlay.handleHide(me.handleHide);

            /**
             * Handler for an incoming overlay show request
             * @method overlay.handleShow
             * @param sender {String} The widget making the show overlay request
             * @param overlayId {String} optional; the id of the overlay to be shown; if not
             *      specified, the id of the sender will be assumed.
             * @memberof! module:EsriAdapter#
             */
            me.handleShow = function(sender, overlayId) {
                if(!overlayId) {
                    overlayId = sender;
                }

                overlayManager.showOverlay(overlayId);
            };
            //CommonMapApi.overlay.handleShow(me.handleShow);

            /**
             * Handler for an incoming overlay update request
             * @method overlay.handleUpdate
             * @param sender {String} The widget making the update overlay request
             * @param name {String} optional; the name to be set for the overlay specified. If
             *      not specified, the name will not be changed
             * @param overlayId {Stinrg} optional; the Id of the overlay to be updated. If not
             *      specified, the id of the sender will be assumed.
             * @param parentId {String} optional; The id of the overlay to be set as the parent
             *      of the overlay specified. If not specified, the parent will not be updated.
             * @memberof! module:EsriAdapter#
             */
            var handleUpdate = function(sender, name, overlayId, parentId) {
                if(!overlayId) {
                    overlayId = sender;
                }

                overlayManager.updateOverlay(name, overlayId, parentId);
            };
            //CommonMapApi.overlay.handleUpdate(me.handleUpdate);
        })();

        /**
         * The container for the ESRI adapter feature methods
         * @memberof module:EsriAdapter
         * @alias feature
         */
        this.feature = (function() {
            var me = this;

            /**
             * Handler for plot feature request
             * @method feature.handlePlot
             * @param sender {String} the widget which made the plot feature request
             * @param overlayId {String} optional; The Id of the overlay to which the feature should be plotted. If
             *      not specified, the id of the sender is used
             * @param featureId {String} The id to be given to the feature; unique to the overlayId.
             * @param name {String} optional; The non-unique readable name to be given to the feature. If not
             *      specified, the featureId will be used.
             * @param format {String} optional; The format type of the feature data
             * @param feature The data for the feature to be plotted
             * @param zoom {Boolean} Whether or not the feature should be zoomed to when plotted.
             * @memberof! module:EsriAdapter#
             */
            me.handlePlot = function(sender, overlayId, featureId, name, format, feature, zoom) {

            };
            //CommonMapApi.feature.handlePlot(me.handlePlot);

            /**
             * Handler for plot url request
             * @method feature.handlePlot
             * @param sender {String} the widget which made the feature plot url request
             * @param overlayId {String} optional; The Id of the overlay to which the feature should be plotted. If
             *      not specified, the id of the sender is used
             * @param featureId {String} The id to be given to the feature; unique to the overlayId.
             * @param name {String} optional; The non-unique readable name to be given to the feature. If not
             *      specified, the featureId will be used.
             * @param format {String} optional; The format type of the feature data
             * @param url {String} The url for where the feature data could be retrieved
             * @param zoom {Boolean} Whether or not the feature should be zoomed to when plotted.
             * @memberof! module:EsriAdapter#
             */
            me.handlePlotUrl = function(sender, overlayId, featureId, name, format, url, params, zoom) {
                //get url then call plot or vice?
            };
            //CommonMapApi.feature.handlePlotUrl(me.handlePlotUrl);

            /**
             * Handler for feature unplot request
             * @method feature.handleUnplot
             * @param sender {String} the widget which made the feature unplot request
             * @param overlayId {String} optional; the id for the overlay from which the feature should be
             *      unplotted. If not provided, the id of the sender will be assumed
             * @param featureId {String} The id of the feature to unplot
             * @memberof! module:EsriAdapter#
             */
            me.handleUnplot = function(sender, overlayId, featureId) {
                if(!overlayId) {
                    overlayId = sender;
                }
                overlayManager.deleteFeature(overlayId, featureId);
            };
            //CommonMapApi.feature.handleUnplot(me.handleUnplot);

            /**
             * Handler for request to hide feature
             * @method feature.handleHide
             * @param sender {String} the widget which made the feature hide request
             * @param overlayId {String} optional; the id for the overlay from which the feature should be
             *      hidden. If not provided, the id of the sender will be assumed
             * @param featureId {String} The id of the feature to hide
             * @memberof! module:EsriAdapter#
             */
            me.handleHide = function(sender, overlayId, featureId) {
                if(!overlayId) {
                    overlayId = sender;
                }
                overlayManager.hideFeature(overlayId, featureId);
            };
            //CommonMapApi.feature.handleHide(me.handleHide);

            me.handleShow = function() {

            };
            //CommonMapApi.feature.handleShow(me.handleShow);

            me.handleSelected = function() {

            };
            //CommonMapApi.feature.handleSelected(me.handleSelected);

            me.handleUpdate = function() {

            };
            //CommonMapApi.feature.handlePlotUrl(me.handlePlotUrl);
        })();


        /**
         * The container for ESRI Adapter status methods
         * @memberof module:EsriAdapter
         * @alias status
         */
        this.status = new (function() {
            var me = this;

            /**
             * Handler for an incoming map status request.
             * @method status.handleRequest
             * @param caller {String} optional; the widget making the status request
             * @param types {String[]} optional; the types of status being requested. Array of strings;
             *      1.1 only supports "about", "format", and "view"
             * @memberof! module:EsriAdapter#
             */
            me.handleRequest = function(caller, types) {
                if(!types || types.contains("view")) {
                    sendView(caller);
                }

                if(!types || types.contains("about")) {
                    sendAbout(caller);
                }

                if(!types || types.contains("format")) {
                    sendFormat(caller);
                }
            };

            /**
             * Calculate the view details of the map and announce via the CMW-API
             * @private
             * @method status.sendView
             * @param caller {String} The Id of the widget which requested the map view status
             * @memberof! module:EsriAdapter#
             */
            var sendView = function(caller) {
                var bounds = {
                    southWest: {
                        lat: map.geographicExtent.ymin,
                        lon: map.geographicExtent.xmin
                    },
                    northEast: {
                        lat: map.geographicExtent.ymax,
                        lon: map.geographicExtent.xmax
                    }
                };

                var center = {
                    lat: map.geographicExtent.getCenter().y,
                    lon: map.geographicExtent.getCenter().x,
                };

                var range = map.getScale();

                CommonMapApi.status.view.send(caller, bounds, center, range);
            };

            /**
             * Compile the map about details and announce via the CMW-API
             * @private
             * @method status.sendAbout
             * @param caller {object} The Id of the widget which requested the map view status
             * @memberof! module:EsriAdapter#
             */
            var sendAbout = function(caller) {
                var version = EsriNS.version;
                var type = "2-D";
                var widgetName = ""; //FIXME

                CommonMapApi.status.about.send(version, type, widgetName);
            };

            /**
             * Announce the accepted formats via the CMW-API
             * @private
             * @method status.sendFormat
             * @param caller {object} The Id of the widget which requested the map view status
             * @memberof! module:EsriAdapter#
             */
            var sendFormat = function() {
                var formats = ["kml"/*, "geojson", "wms"*/];

                CommonMapApi.status.format.send(formats);
            };

            //return { handleRequest: me.handleRequest };
        })();
        // Bind the functions to the CMW API
        CommonMapApi.status.request.addHandler(this.status.handleRequest);

        /**
         * The container for EsriAdapter error methods
         * @alias error
         * @memberof module:EsriAdapter
         */
        this.error = (function() {
            var me = this;

            /**
             * Build and send an error
             * @method error.error
             * @param caller {String} The id of the widget which sent a call triggering the event causing this error
             * @param message {String} The readable message for the error
             * @param err {object} The object representing the error details data
             * @memberof! module:EsriAdapter#
             */
            me.error = function(caller, message, err) {
                var sender = caller;
                var type = err.type;
                var msg = message;
                var error = err;

                CommonMapApi.error.send(sender, type, msg, error);
            };

            /**
             * handle an error
             * @method error.handleError
             * @param sender {String} The id of the widget which send the error message
             * @param type {String} The type of error for which the message corresponds
             * @param message {String} The readable error message
             * @param error {object} The object representing the error details data
             * @memberof! module:EsriAdapter#
             */
            me.handleError = function(sender, type, message, error) {
                //TODO
            };

            return { handleError: me.handleError };
        })();

        // Bind error functions to CMW API
        CommonMapApi.error.addHandler(this.error.handleError);
    };

    return EsriAdapter;
});

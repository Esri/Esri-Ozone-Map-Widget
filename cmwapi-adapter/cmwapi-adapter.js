/**
 * @module EsriAdapter
 */
define(["cmwapi/cmwapi", "esri/kernel", "cmwapi-overlay-manager"], function(CommonMapApi, EsriNS, OverlayManager) {
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
            var overlay = {};

            /**
             * Handler for an incoming map overlay create request.
             * @method overlay.handleCreate
             * @param sender {String} the widget making the create overlay request
             * @param data {Object|Object[]}
             * @param data.name {String} The non-unique readable name to be given to the created overlay.
             * @param data.overlayId {String} The unique id to be given to the created overlay.
             * @param [data.parentId] {String} the id of the overlay to be set as the parent of the created overlay.
             * @memberof! module:EsriAdapter#
             */
            overlay.handleCreate = function(sender, data) {
                if(data.length > 1) {
                    for(var i = 0; i < data.length; i++) {
                        overlayManager.createOverlay(sender, data[i].name, data[i].overlayId, data[i].parentId);
                    }
                } else {
                    overlayManager.createOverlay(sender, data.name, data.overlayId, data.parentId);
                }
            };
            CommonMapApi.overlay.create.addHandler(overlay.handleCreate);

            /**
             * Handler for an indcoming request to remove a layer.
             * @method overlay.handleRemove
             * @param sender {String} the widget making the remove overlay request
             * @param data {Object|Object[]}
             * @param data.overlayId {String} the id of the overlay to be removed; if not provided
             *      the id of the sender will be assumed.
             * @memberof! module:EsriAdapter#
             */
            overlay.handleRemove = function(sender, data) {
                if(data.length > 1) {
                    for(var i = 0; i < data.length; i++) {
                        overlayManager.removeOverlay(sender, data[i].overlayId);
                    }
                } else {
                    overlayManager.removeOverlay(sender, data.overlayId);
                }

            };
            CommonMapApi.overlay.remove.addHandler(overlay.handleRemove);

            /**
             * Handler for an indcoming request to hide a layer.
             * @method overlay.handleHide
             * @param sender {String} the widget making the hide overlay request
             * @param data {Object|Object[]}
             * @param data.overlayId {String} the id of the overlay to be removed; if not provided
             *      the id of the sender will be assumed.
             * @memberof! module:EsriAdapter#
             */
            overlay.handleHide = function(sender, data) {
                if(data.length > 1) {
                    for(var i = 0; i < data.length; i++) {
                        overlayManager.hideOverlay(sender, data[i].overlayId);
                    }
                } else {
                    overlayManager.hideOverlay(sender, data.overlayId);
                }
            };
            CommonMapApi.overlay.hide.addHandler(overlay.handleHide);

            /**
             * Handler for an incoming overlay show request
             * @method overlay.handleShow
             * @param sender {String} The widget making the show overlay request
             * @param data {Object|Object[]}
             * @param data.overlayId {String} the id of the overlay to be shown; if not
             *      specified, the id of the sender will be assumed.
             * @memberof! module:EsriAdapter#
             */
            overlay.handleShow = function(sender, data) {
                if(data.length > 1) {
                    for(var i = 0; i < data.length; i++) {
                        overlayManager.showOverlay(sender, data[i].overlayId);
                    }
                } else {
                    overlayManager.showOverlay(sender, data.overlayId);
                }
            };
            CommonMapApi.overlay.show.addHandler(overlay.handleShow);

            /**
             * Handler for an incoming overlay update request
             * @method overlay.handleUpdate
             * @param sender {String} The widget making the update overlay request
             * @param data {Object|Object[]}
             * @param [data.name] {String} the name to be set for the overlay specified. If
             *      not specified, the name will not be changed
             * @param data.overlayId {String} the Id of the overlay to be updated. If not
             *      specified, the id of the sender will be assumed.
             * @param [data.parentId] {String} The id of the overlay to be set as the parent
             *      of the overlay specified. If not specified, the parent will not be updated.
             * @memberof! module:EsriAdapter#
             */
            overlay.handleUpdate = function(sender, data) {
                if(data.length > 1) {
                    for(var i = 0; i < data.length; i++) {
                        overlayManager.updateOverlay(sender, data[i].name, data[i].overlayId, data[i].parentId);
                    }
                } else {
                    overlayManager.updateOverlay(sender, data.name, data.overlayId, data.parentId);
                }
            };
            CommonMapApi.overlay.update.addHandler(overlay.handleUpdate);
        })();

        /**
         * The container for the ESRI adapter feature methods
         * @memberof module:EsriAdapter
         * @alias feature
         */
        this.feature = (function() {
            var feature = {};

            /**
             * Handler for plot feature request
             * @method feature.handlePlot
             * @param sender {String} the widget which made the plot feature request
             * @param data {Object|Object[]}
             * @param data.overlayId {String} The Id of the overlay to which the feature should be plotted.
             * @param data.featureId {String} The id to be given to the feature; unique to the overlayId.
             * @param data.name {String} The non-unique readable name to be given to the feature.
             * @param data.format {String} The format type of the feature data
             * @param data.feature The data for the feature to be plotted
             * @param [data.zoom] {Boolean} Whether or not the feature should be zoomed to when plotted.
             * @memberof! module:EsriAdapter#
             */
            feature.handlePlot = function(sender, data) {
                if(data.length > 1) {
                    for(var i = 0; i < data.length; i++) {

                    }
                } else {

                }
            };
            CommonMapApi.feature.plot.addHandler(feature.handlePlot);

            /**
             * Handler for plot url request
             * @method feature.handlePlot
             * @param sender {String} the widget which made the feature plot url request
             * @param data {Object|Object[]}
             * @param data.overlayId {String} The Id of the overlay to which the feature should be plotted.
             * @param data.featureId {String} The id to be given to the feature; unique to the overlayId.
             * @param data.name {String} The non-unique readable name to be given to the feature.
             * @param data.format {String} The format type of the feature data
             * @param data.url {String} The url for where the feature data could be retrieved
             * @param [data.zoom] {Boolean} Whether or not the feature should be zoomed to when plotted.
             * @memberof! module:EsriAdapter#
             */
            feature.handlePlotUrl = function(sender, overlayId, featureId, name, format, url, params, zoom) {
                if(data.length > 1) {
                    for(var i = 0; i < data.length; i++) {
                        OverlayManager.plotFeatureUrl(sender, overlayId, featureId, name, format, url, params, zoom);
                    }
                } else {
                    OverlayManager.plotFeatureUrl(sender, overlayId, featureId, name, format, url, params, zoom);
                }
            };
            CommonMapApi.feature.plot.url.addHandler(feature.handlePlotUrl);

            /**
             * Handler for feature unplot request
             * @method feature.handleUnplot
             * @param sender {String} the widget which made the feature unplot request
             * @param overlayId {String} optional; the id for the overlay from which the feature should be
             *      unplotted. If not provided, the id of the sender will be assumed
             * @param featureId {String} The id of the feature to unplot
             * @memberof! module:EsriAdapter#
             */
            feature.handleUnplot = function(sender, overlayId, featureId) {
                if(!overlayId) {
                    overlayId = sender;
                }
                overlayManager.deleteFeature(overlayId, featureId);
            };
            CommonMapApi.feature.unplot.addHandler(feature.handleUnplot);

            /**
             * Handler for request to hide feature
             * @method feature.handleHide
             * @param sender {String} the widget which made the feature hide request
             * @param overlayId {String} optional; the id for the overlay from which the feature should be
             *      hidden. If not provided, the id of the sender will be assumed
             * @param featureId {String} The id of the feature to hide
             * @memberof! module:EsriAdapter#
             */
            feature.handleHide = function(sender, overlayId, featureId) {
                if(!overlayId) {
                    overlayId = sender;
                }
                overlayManager.hideFeature(overlayId, featureId);
            };
            CommonMapApi.feature.hide.addHandler(feature.handleHide);

            feature.handleShow = function() {

            };
            CommonMapApi.feature.show.addHandler(feature.handleShow);

            feature.handleSelected = function() {

            };
            CommonMapApi.feature.selected.addHandler(feature.handleSelected);

            feature.handleUpdate = function() {

            };
            CommonMapApi.feature.update.addHandler(feature.handlePlotUrl);

            return feature;
        })();


        /**
         * The container for ESRI Adapter status methods
         * @memberof module:EsriAdapter
         * @alias status
         */
        this.status = (function() {
            var status = {};

            /**
             * Handler for an incoming map status request.
             * @method status.handleRequest
             * @param caller {String} optional; the widget making the status request
             * @param types {String[]} optional; the types of status being requested. Array of strings;
             *      1.1 only supports "about", "format", and "view"
             * @memberof! module:EsriAdapter#
             */
            status.handleRequest = function(caller, types) {
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

            return status;
        })();
        // Bind the functions to the CMW API
        CommonMapApi.status.request.addHandler(this.status.handleRequest);

        /**
         * The container for EsriAdapter error methods
         * @alias error
         * @memberof module:EsriAdapter
         */
        this.error = (function() {
            var error = {};

            /**
             * Build and send an error
             * @method error.error
             * @param caller {String} The id of the widget which sent a call triggering the event causing this error
             * @param message {String} The readable message for the error
             * @param err {object} The object representing the error details data
             * @memberof! module:EsriAdapter#
             */
            error.error = function(caller, message, err) {
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
            error.handleError = function(sender, type, message, error) {
                //TODO
            };

            return error;
        }());
        // Bind error functions to CMW API
        CommonMapApi.error.addHandler(this.error.handleError);
    };

    return EsriAdapter;
});

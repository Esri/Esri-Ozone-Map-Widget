define(["cmwapi/cmwapi"], function(CommonMapApi) {
    /**
     * @classdesc Adapter layer between Common Map Widget API v. 1.1 javascript
     *      implementation and ESRI map implementations
     * @constructor
     * @version 1.1
     * @param map {object} ESRI map object for which this adapter should apply
     */
    EsriAdapter = function(map) {

        /**
         * The container for ESRI Adapter status methods
         * @memberof EsriAdapter
         * @alias status
         */ 
        this.status = (function() {
            var me = this;

            /**
             * Handler for an incomming map status request.
             * @method status.handleRequest
             * @param caller {String} optional; the widget making the status request
             * @param types {String[]} optional; the types of status being requested. Array of strings;
             *      1.1 only supports "about", "format", and "view"
             * @memberof! EsriAdapter#
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
             * @memberof! EsriAdapter#
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
             * @memberof! EsriAdapter#
             */
            var sendAbout = function() {
                var version = esri.version;
                var type = "2-D";
                var widgetName = ""; //FIXME
                
                CommonMapApi.status.about.send(version, type, widgetName);
            };

            /**
             * Announce the accepted formats via the CMW-API
             * @private
             * @method status.sendFormat
             * @param caller {object} The Id of the widget which requested the map view status
             * @memberof! EsriAdapter#
             */
            var sendFormat = function() {
                var formats = ["kml"/*, "geojson", "wms"*/];

                CommonMapApi.status.format.send(formats);
            };

            return { handleRequest: me.handleRequest };
        })();

        // Bind the functions to the CMW API
        CommonMapApi.status.request.addHandler(this.status.handleRequest);

        /**
         * The container for EsriAdapter error methods
         * @alias error
         * @memberof EsriAdapter
         */
        this.error = (function() {
            var me = this;
            
            /**
             * Build and send an error
             * @method error.error
             * @param caller {String} The id of the widget which sent a call triggering the event causing this error
             * @param message {String} The readable message for the error
             * @param err {object} The object representing the error details data
             * @memberof! EsriAdapter#
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
             * @memberof! EsriAdapter#
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

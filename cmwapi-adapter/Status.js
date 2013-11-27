define(["cmwapi/cmwapi", "esri/kernel"], function(CommonMapApi, EsriNS) {
    var Status = function(adapater, map) {
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
            if(!types || types.indexOf("view") != -1) {
                sendView(caller);
            }

            if(!types || types.indexOf("about") != -1) {
                sendAbout(caller);
            }

            if(!types || types.indexOf("format") != -1) {
                sendFormat(caller);
            }
        };
        CommonMapApi.status.request.addHandler(me.handleRequest);

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
            var widgetName = OWF.getInstanceId();

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
    };

    return Status;
});
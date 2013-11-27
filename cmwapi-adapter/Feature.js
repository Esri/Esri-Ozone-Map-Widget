define(["cmwapi/cmwapi"], function(CommonMapApi) {
    var Feature = function(adapater, overlayManager) {
        var me = this;

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
        me.handlePlot = function(sender, data) {
            if(data.length > 1) {
                var data_item;
                for(var i = 0; i < data.length; i++) {
                    data_item = data[i];
                    overlayManager.plotFeature(sender, data_item.overlayId, data_item.featureId, data_item.name,
                        data_item.format, data_item.feature, data_item.zoom);
                }
            } else {
                overlayManager.plotFeature(sender, data.overlayId, data.featureId, data.name,
                        data.format, data.feature, data.zoom);
            }
        };
        CommonMapApi.feature.plot.addHandler(me.handlePlot);

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
        me.handlePlotUrl = function(sender, data) {
            if(data.length > 1) {
                for(var i = 0; i < data.length; i++) {
                    OverlayManager.plotFeatureUrl(sender, overlayId, featureId, name, format, url, params, zoom);
                }
            } else {
                OverlayManager.plotFeatureUrl(sender, overlayId, featureId, name, format, url, params, zoom);
            }
        };
        CommonMapApi.feature.plot.url.addHandler(me.handlePlotUrl);

        /**
         * Handler for feature unplot request
         * @method feature.handleUnplot
         * @param sender {String} the widget which made the feature unplot request
         * @param data {Object|Object[]}
         * @param data.overlayId {String} optional; the id for the overlay from which the feature should be
         *      unplotted. If not provided, the id of the sender will be assumed
         * @param data.featureId {String} The id of the feature to unplot
         * @memberof! module:EsriAdapter#
         */
        me.handleUnplot = function(sender, data) {
            if(data.length > 1) {
                var data_item;
                for(var i = 0; i < data.length; i++) {
                    data_item = data[i];
                    overlayManager.deleteFeature(data_item.overlayId, data_item.featureId);
                }
            } else {
                overlayManager.deleteFeature(data.overlayId, data.featureId);
            }
        };
        CommonMapApi.feature.unplot.addHandler(me.handleUnplot);

        /**
         * Handler for request to hide feature
         * @method feature.handleHide
         * @param sender {String} the widget which made the feature hide request
         * @param data {Object|Object[]}
         * @param data.overlayId {String} optional; the id for the overlay from which the feature should be
         *      hidden. If not provided, the id of the sender will be assumed
         * @param data.featureId {String} The id of the feature to hide
         * @memberof! module:EsriAdapter#
         */
        me.handleHide = function(sender, data) {
            if(data.length > 1) {
                var data_item;
                for(var i = 0; i < data.length; i++) {
                    data_item = data[i];
                    overlayManager.hideFeature(data_item.overlayId, data_item.featureId);
                }
            } else {
                overlayManager.hideFeature(data.overlayId, data.featureId);
            }

        };
        CommonMapApi.feature.hide.addHandler(me.handleHide);

        /**
         * Handler for request to show feature
         * @param sender {String} The id of the widget making the request to show the feature
         * @param data {Object|Object[]}
         * @param data.overlayId {String} The id of the overlay to which the feature to show belongs
         * @param data.featureId {Stirng} The id of the feature which should be shown
         */
        me.handleShow = function(sender, data) {
            if(data.length > 1) {
                var data_item;
                for(var i = 0; i < data.length; i++) {
                    data_item = data[i];
                    overlayManager.showFeature(data_item.overlayId, data_item.featureId);
                }
            } else {
                overlayManager.showFeature(data.overlayId, data.featureId);
            }
        };
        CommonMapApi.feature.show.addHandler(me.handleShow);

        /**
         * Handler for a given feature being selected
         * //FIXME
         */
        me.handleSelected = function() {
            //zoom to the feature on the map
        };
        CommonMapApi.feature.selected.addHandler(me.handleSelected);

        /**
         * Handler for request to update a feature
         * @param Sender {String} The id of the widgets making the request to update the feature
         * @param data {Object|Object[]}
         * @param data.overlayId {String} The id of the overlay for which the feature to be updated belongs.
         * @param data.featureId {String} The id of the feature to be updated; unique to the given overlayId
         * @param [data.name] {String} the optional name to be set for the feature; If not provided, the name will not be changed.
         * @param [data.newOverlayId] {String} The optional id of the new overlay for which the feature should belong. If not
         *      provided the parent overlay will not be changed.
         */
        me.handleUpdate = function() {
            if(data.length > 1) {
                var data_item;
                for(var i = 0; i < data.length; i++) {
                    data_item = data[i];
                    overlayManager.hideFeature(data_item.overlayId, data_item.featureId, data_item.name, data_item.newOverlayId);
                }
            } else {
                overlayManager.hideFeature(data.overlayId, data.featureId, data.name, data.newOverlayId);
            }
        };
        CommonMapApi.feature.update.addHandler(me.handleUpdate);
    }

    return Feature;
});
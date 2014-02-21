define(["cmwapi/cmwapi", "cmwapi-adapter/feature/Status"], function(CommonMapApi, Status) {
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
     * @version 1.1
     *
     * @module cmwapi-adapter/Feature
     */

    /**
     * @constructor
     * @param adapter {module:cmwapi-adapter/cmwapi-adapter}
     * @param overlayManager {module:cmwapi-adapter/EsriOverlayManager}
     * @alias module:cmwapi-adapter/Feature
     */
    var Feature = function(adapter, overlayManager, map) {
        var me = this;

        me.status = new Status(overlayManager, map);

        /**
         * Handler for plot feature request
         * @method handlePlot
         * @param sender {String} the widget which made the plot feature request
         * @param data {Object|Object[]}
         * @param data.overlayId {String} The Id of the overlay to which the feature should be plotted.
         * @param data.featureId {String} The id to be given to the feature; unique to the overlayId.
         * @param data.name {String} The non-unique readable name to be given to the feature.
         * @param data.format {String} The format type of the feature data
         * @param data.feature The data for the feature to be plotted
         * @param [data.zoom] {Boolean} Whether or not the feature should be zoomed to when plotted.
         * @memberof module:cmwapi-adapter/Feature#
         */
        me.handlePlot = function(sender, data) {
            if(data.length > 1) {
                var data_item;
                for(var i = 0; i < data.length; i++) {
                    data_item = data[i];
                    overlayManager.feature.plotFeature(sender, data_item.overlayId, data_item.featureId, data_item.name,
                        data_item.format, data_item.feature, data_item.zoom);
                }
            } else {
                overlayManager.feature.plotFeature(sender, data.overlayId, data.featureId, data.name,
                        data.format, data.feature, data.zoom);
            }
            overlayManager.archiveState();
        };
        CommonMapApi.feature.plot.addHandler(me.handlePlot);

        /**
         * Handler for plot url request
         * @method handlePlot
         * @param sender {String} the widget which made the feature plot url request
         * @param data {Object|Object[]}
         * @param data.overlayId {String} The Id of the overlay to which the feature should be plotted.
         * @param data.featureId {String} The id to be given to the feature; unique to the overlayId.
         * @param data.name {String} The non-unique readable name to be given to the feature.
         * @param data.format {String} The format type of the feature data
         * @param data.url {String} The url for where the feature data could be retrieved
         * @param [data.zoom] {Boolean} Whether or not the feature should be zoomed to when plotted.
         * @memberof module:cmwapi-adapter/Feature#
         */
        me.handlePlotUrl = function(sender, data) {
            if(data.length > 1) {
                var data_item;
                for(var i = 0; i < data.length; i++) {
                    data_item = data[i];
                    overlayManager.feature.plotFeatureUrl(sender, data_item.overlayId, data_item.featureId, data_item.name,
                        data_item.format, data_item.url, data_item.params, data_item.zoom);
                }
            } else {
                overlayManager.feature.plotFeatureUrl(sender, data.overlayId, data.featureId, data.name, data.format, data.url,
                    data.params, data.zoom);
            }
            overlayManager.archiveState();
        };
        CommonMapApi.feature.plot.url.addHandler(me.handlePlotUrl);

        /**
         * Handler for feature unplot request
         * @method handleUnplot
         * @param sender {String} the widget which made the feature unplot request
         * @param data {Object|Object[]}
         * @param data.overlayId {String} optional; the id for the overlay from which the feature should be
         *      unplotted. If not provided, the id of the sender will be assumed
         * @param data.featureId {String} The id of the feature to unplot
         * @memberof module:cmwapi-adapter/Feature#
         */
        me.handleUnplot = function(sender, data) {
            if(data.length > 1) {
                var data_item;
                for(var i = 0; i < data.length; i++) {
                    data_item = data[i];
                    overlayManager.feature.deleteFeature(sender, data_item.overlayId, data_item.featureId);
                }
            } else {
                overlayManager.feature.deleteFeature(sender, data.overlayId, data.featureId);
            }
            overlayManager.archiveState();
        };
        CommonMapApi.feature.unplot.addHandler(me.handleUnplot);

        /**
         * Handler for request to hide feature
         * @method handleHide
         * @param sender {String} the widget which made the feature hide request
         * @param data {Object|Object[]}
         * @param data.overlayId {String} optional; the id for the overlay from which the feature should be
         *      hidden. If not provided, the id of the sender will be assumed
         * @param data.featureId {String} The id of the feature to hide
         * @memberof module:cmwapi-adapter/Feature#
         */
        me.handleHide = function(sender, data) {
            if(data.length > 1) {
                var data_item;
                for(var i = 0; i < data.length; i++) {
                    data_item = data[i];
                    overlayManager.feature.hideFeature(sender, data_item.overlayId, data_item.featureId);
                }
            } else {
                overlayManager.feature.hideFeature(sender, data.overlayId, data.featureId);
            }
            overlayManager.archiveState();
        };
        CommonMapApi.feature.hide.addHandler(me.handleHide);

        /**
         * Handler for request to show feature
         * @method handleShow
         * @param sender {String} The id of the widget making the request to show the feature
         * @param data {Object|Object[]}
         * @param data.overlayId {String} The id of the overlay to which the feature to show belongs
         * @param data.featureId {Stirng} The id of the feature which should be shown
         * @memberof module:cmwapi-adapter/Feature#
         */
        me.handleShow = function(sender, data) {
            if(data.length > 1) {
                var data_item;
                for(var i = 0; i < data.length; i++) {
                    data_item = data[i];
                    overlayManager.feature.showFeature(sender, data_item.overlayId, data_item.featureId, data_item.zoom);
                }
            } else {
                overlayManager.feature.showFeature(sender, data.overlayId, data.featureId, data.zoom);
            }
            overlayManager.archiveState();
        };
        CommonMapApi.feature.show.addHandler(me.handleShow);

        /**
         * Handler for a given feature being selected
         * @method handleSelected
         * @param {String} sender The widget sending a format message
         * @param {Object|Object[]} data  A data object or array of data objects.
         * @param {String} data.overlayId The ID of the overlay.
         * @param {String} data.featureId The ID of the feature.
         * @param {String} [data.selectedId] The ID of the actual selected object.  This may be an implementation
         *    specific subfeature id for data within an aggregated feature.
         * @param {String} [data.selectedName] The name of the selected object.
         * @memberof module:cmwapi-adapter/Feature#
         */
        me.handleSelected = function(sender, data) {
            var senderObj = OWF.Util.parseJson(sender);
            if(OWF.getInstanceId() !== senderObj.id) {
                if(data.length > 1) {
                    var data_item;
                    for(var i = 0; i < data.length; i++) {
                        data_item = data[i];
                        overlayManager.feature.centerFeatureGraphic(sender, data_item.overlayId, data_item.featureId, data_item.selectedId, data_item.selectedName);
                    }
                } else {
                    overlayManager.feature.centerFeatureGraphic(sender, data.overlayId, data.featureId, data.selectedId, data.selectedName);
                }
            }
            overlayManager.archiveState();
        };
        CommonMapApi.feature.selected.addHandler(me.handleSelected);

        /**
         * Handler for request to update a feature
         * @method handleUpdate
         * @param Sender {String} The id of the widgets making the request to update the feature
         * @param data {Object|Object[]}
         * @param data.overlayId {String} The id of the overlay for which the feature to be updated belongs.
         * @param data.featureId {String} The id of the feature to be updated; unique to the given overlayId
         * @param [data.name] {String} the optional name to be set for the feature; If not provided, the name will not be changed.
         * @param [data.newOverlayId] {String} The optional id of the new overlay for which the feature should belong. If not
         *      provided the parent overlay will not be changed.
         * @memberof module:cmwapi-adapter/Feature#
         */
        me.handleUpdate = function(sender, data) {
            if(data.length > 1) {
                var data_item;
                for(var i = 0; i < data.length; i++) {
                    data_item = data[i];
                    overlayManager.feature.updateFeature(sender, data_item.overlayId, data_item.featureId, data_item.name, data_item.newOverlayId);
                }
            } else {
                overlayManager.feature.updateFeature(sender, data.overlayId, data.featureId, data.name, data.newOverlayId);
            }
            overlayManager.archiveState();
        };
        CommonMapApi.feature.update.addHandler(me.handleUpdate);
    };

    return Feature;
});
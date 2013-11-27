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
 */
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
                for(var i = 0; i < data.length; i++) {

                }
            } else {

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
        me.handlePlotUrl = function(sender, overlayId, featureId, name, format, url, params, zoom) {
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
        CommonMapApi.feature.unplot.addHandler(me.handleUnplot);

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
        CommonMapApi.feature.hide.addHandler(me.handleHide);

        me.handleShow = function() {

        };
        CommonMapApi.feature.show.addHandler(me.handleShow);

        me.handleSelected = function() {

        };
        CommonMapApi.feature.selected.addHandler(me.handleSelected);

        me.handleUpdate = function() {

        };
        CommonMapApi.feature.update.addHandler(me.handlePlotUrl);
    }

    return Feature;
});
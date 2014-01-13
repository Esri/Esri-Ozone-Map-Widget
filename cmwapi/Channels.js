define(function() {
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
     * @description Defines the OWF Eventing channels used by the CMW API 1.1.
     *
     * @version 1.1
     *
     * @module cmwapi/Channels
     */

    var MAP_OVERLAY_CREATE = 'map.overlay.create';
    var MAP_OVERLAY_REMOVE = 'map.overlay.remove';
    var MAP_OVERLAY_HIDE = 'map.overlay.hide';
    var MAP_OVERLAY_SHOW = 'map.overlay.show';
    var MAP_OVERLAY_UPDATE = 'map.overlay.update';

    var MAP_FEATURE_PLOT = 'map.feature.plot';
    var MAP_FEATURE_PLOT_URL = 'map.feature.plot.url';
    var MAP_FEATURE_UNPLOT = 'map.feature.unplot';
    var MAP_FEATURE_HIDE = 'map.feature.hide';
    var MAP_FEATURE_SHOW = 'map.feature.show';
    var MAP_FEATURE_SELECTED = 'map.feature.selected';
    var MAP_FEATURE_UPDATE = 'map.feature.update';

    var MAP_VIEW_ZOOM = 'map.view.zoom';
    var MAP_VIEW_CENTER_OVERLAY = 'map.view.center.overlay';
    var MAP_VIEW_CENTER_FEATURE = 'map.view.center.feature';
    var MAP_VIEW_CENTER_LOCATION = 'map.view.center.location';
    var MAP_VIEW_CENTER_BOUNDS = 'map.view.center.bounds';
    var MAP_VIEW_CLICKED = 'map.view.clicked';

    var MAP_STATUS_REQUEST = 'map.status.request';
    var MAP_STATUS_VIEW = 'map.status.view';
    var MAP_STATUS_FORMAT = 'map.status.format';
    var MAP_STATUS_ABOUT = 'map.status.about';

    var MAP_ERROR = 'map.error';


    var Channels = {

        /**
         * The name of the overlay create channel.
         * @type String
         * @memberof module:cmwapi/Channels
         */
         MAP_OVERLAY_CREATE: MAP_OVERLAY_CREATE,
        /**
         * The name of the overlay remove channel.
         * @type String
         * @memberof module:cmwapi/Channels
         */
         MAP_OVERLAY_REMOVE: MAP_OVERLAY_REMOVE,
        /**
         * The name of the overlay hide channel.
         * @type String
         * @memberof module:cmwapi/Channels
         */
         MAP_OVERLAY_HIDE: MAP_OVERLAY_HIDE,
        /**
         * The name of the overlay show channel.
         * @type String
         * @memberof module:cmwapi/Channels
         */
         MAP_OVERLAY_SHOW: MAP_OVERLAY_SHOW,
        /**
         * The name of the overlay update channel.
         * @type String
         * @memberof module:cmwapi/Channels
         */
         MAP_OVERLAY_UPDATE: MAP_OVERLAY_UPDATE,

        /**
        * The name of the feature plot channel.
        * @type String
         * @memberof module:cmwapi/Channels
        */
        MAP_FEATURE_PLOT: MAP_FEATURE_PLOT,
        /**
        * The name of the feature plot url channel.
        * @type String
         * @memberof module:cmwapi/Channels
        */
        MAP_FEATURE_PLOT_URL: MAP_FEATURE_PLOT_URL,
        /**
        * The name of the feature unplot channel.
        * @type String
         * @memberof module:cmwapi/Channels
        */
        MAP_FEATURE_UNPLOT: MAP_FEATURE_UNPLOT,
        /**
        * The name of the feature hide channel.
        * @type String
         * @memberof module:cmwapi/Channels
        */
        MAP_FEATURE_HIDE: MAP_FEATURE_HIDE,
        /**
        * The name of the feature show channel.
        * @type String
         * @memberof module:cmwapi/Channels
        */
        MAP_FEATURE_SHOW: MAP_FEATURE_SHOW,
        /**
        * The name of the feature selected channel.
        * @type String
         * @memberof module:cmwapi/Channels
        */
        MAP_FEATURE_SELECTED: MAP_FEATURE_SELECTED,
        /**
        * The name of the feature update channel.
        * @type String
         * @memberof module:cmwapi/Channels
        */
        MAP_FEATURE_UPDATE: MAP_FEATURE_UPDATE,

        /**
         * The name of the zoom channel.
         * @String
         * @memberof module:cmwapi/Channels
         */
        MAP_VIEW_ZOOM: MAP_VIEW_ZOOM,
        /**
         * The name of the center on an overlay channel.
         * @String
         * @memberof module:cmwapi/Channels
         */
        MAP_VIEW_CENTER_OVERLAY: MAP_VIEW_CENTER_OVERLAY,
        /**
         * The name of the center on a feature channel.
         * @String
         * @memberof module:cmwapi/Channels
         */
        MAP_VIEW_CENTER_FEATURE: MAP_VIEW_CENTER_FEATURE,
        /**
         * The name of the center on a location channel.
         * @String
         * @memberof module:cmwapi/Channels
         */
        MAP_VIEW_CENTER_LOCATION: MAP_VIEW_CENTER_LOCATION,
        /**
         * The name of the center on a bounding box channel.
         * @String
         * @memberof module:cmwapi/Channels
         */
        MAP_VIEW_CENTER_BOUNDS: MAP_VIEW_CENTER_BOUNDS,
        /**
         * The name of the clicked location channel.
         * @type String
         * @memberof module:cmwapi/Channels
         */
        MAP_VIEW_CLICKED: MAP_VIEW_CLICKED,

        /**
         * The name of the status request channel.
         * @type String
         * @memberof module:cmwapi/Channels
         */
        MAP_STATUS_REQUEST: MAP_STATUS_REQUEST,
        /**
         * The name of the status view channel.
         * @type String
         * @memberof module:cmwapi/Channels
         */
        MAP_STATUS_VIEW: MAP_STATUS_VIEW,
        /**
         * The name of the status format channel.
         * @type String
         * @memberof module:cmwapi/Channels
         */
        MAP_STATUS_FORMAT: MAP_STATUS_FORMAT,
        /**
         * The name of the status about channel.
         * @type String
         * @memberof module:cmwapi/Channels
         */
        MAP_STATUS_ABOUT: MAP_STATUS_ABOUT,
        /**
         * The name of the error channel.
         * @type String
         * @memberof module:cmwapi/Channels
         */
        MAP_ERROR: MAP_ERROR,

        /**
         * Returns an array of the OWF channels utilized by this implementation of the CMW API.
         * @method getChannels
         * @return {Array<String>}
         * @memberof module:cmwapi/Channels
         */
        getChannels: function() {
            return [this.MAP_OVERLAY_CREATE, this.MAP_OVERLAY_REMOVE, this.MAP_OVERLAY_HIDE,
                this.MAP_OVERLAY_SHOW, this.MAP_OVERLAY_UPDATE,
                this.MAP_STATUS_REQUEST, this.MAP_STATUS_REQUEST, this.MAP_STATUS_FORMAT, this.MAP_STATUS_ABOUT,
                this.MAP_ERROR];
        }
    };

    return Channels;
});
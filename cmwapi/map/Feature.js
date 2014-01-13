
define(["cmwapi/map/feature/Plot", "cmwapi/map/feature/PlotURL", "cmwapi/map/feature/Unplot",
    "cmwapi/map/feature/Hide", "cmwapi/map/feature/Show", "cmwapi/map/feature/Selected", "cmwapi/map/feature/Update"],
    function(Plot, PlotURL, Unplot, Hide, Show, Selected, Update) {

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
     * @description Defines a convenience module for handling all the map.feature interactions according to the CMW API 1.1 specification.
     *
     * @version 1.1
     *
     * @module cmwapi/map/Feature
     */
    var Feature = {

        /**
         * @see module:cmwapi/map/feature/Plot
         * @memberof module:cmwapi/map/Feature
         */
        plot : Plot,
        /**
         * @see module:cmwapi/map/feature/Unplot
         * @memberof module:cmwapi/map/Feature
         */
        unplot: Unplot,
        /**
         * @see module:cmwapi/map/feature/Hide
         * @memberof module:cmwapi/map/Feature
         */
        hide: Hide,
        /**
         * @see module:cmwapi/map/feature/Show
         * @memberof module:cmwapi/map/Feature
         */
        show: Show,
        /**
         * @see module:cmwapi/map/feature/Selected
         * @memberof module:cmwapi/map/Feature
         */
        selected: Selected,
        /**
         * @see module:cmwapi/map/feature/Update
         * @memberof module:cmwapi/map/Feature
         */
        update: Update
    };

    /**
     * @see module:cmwapi/map/feature/PlotURL
     * @memberof module:cmwapi/map/Feature
     */
    Feature.plot.url = PlotURL;

    return Feature;
});

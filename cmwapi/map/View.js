
define(["cmwapi/Channels", "cmwapi/map/view/Zoom", "cmwapi/map/view/CenterOverlay",
    "cmwapi/map/view/CenterFeature", "cmwapi/map/view/CenterLocation",
    "cmwapi/map/view/CenterBounds", "cmwapi/map/view/Clicked", "cmwapi/map/view/Print"],
    function(Channels, Zoom, CenterOverlay, CenterFeature, CenterLocation,
        CenterBounds, Clicked, Print) {

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
     * @description Defines a convenience module for handling all the map.view interactions according to the CMW API 1.1 specification.
     *
     * @version 1.1
     *
     * @exports cmwapi/map/View
     */
    var View = {

        /**
         * @see module:cmwapi/map/view/Zoom
         */
        zoom : Zoom,
        center : {
            /**
             * @see module:cmwapi/map/view/CenterOverlay
             */
            overlay: CenterOverlay,
            /**
             * @see module:cmwapi/map/view/CenterFeature
             */
            feature: CenterFeature,
            /**
             * @see module:cmwapi/map/view/CenterLocation
             */
            location: CenterLocation,
            /**
             * @see module:cmwapi/map/view/CenterBounds
             */
            bounds: CenterBounds,
        },

        /**
         * @see module:cmwapi/map/view/Clicked
         */
        clicked: Clicked,

        /**
         * @see module:cmwapi/map/view/Print
         */
        print: Print
    };

    return View;
});

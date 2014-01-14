define(["cmwapi/Channels", "cmwapi/map/overlay/Create", "cmwapi/map/overlay/Remove",
    "cmwapi/map/overlay/Hide", "cmwapi/map/overlay/Show", "cmwapi/map/overlay/Update"],
    function(Channels, Create, Remove, Hide, Show, Update) {

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
     * @description Defines a convenience module for handling all the map.overlay interactions according to the CMW API 1.1 specification.
     *
     * @version 1.1
     *
     * @exports cmwapi/map/Overlay
     */
    var Overlay = {

        /**
         * @see module:cmwapi/map/overlay/Create
         */
        create: Create,
        /**
         * @see module:cmwapi/map/overlay/Remove
         */
        remove: Remove,
        /**
         * @see module:cmwapi/map/overlay/Hide
         */
        hide: Hide,
        /**
         * @see module:cmwapi/map/overlay/Show
         */
        show: Show,
        /**
         * @see module:cmwapi/map/overlay/Update
         */
        update: Update
    };

    return Overlay;
});
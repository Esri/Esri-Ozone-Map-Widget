
define(["cmwapi/Channels", "cmwapi/map/Error", "cmwapi/map/status/About", "cmwapi/map/status/Format",
        "cmwapi/map/status/Request", "cmwapi/map/status/View"],
    function(Channels, Error, About, Format, Request, View) {

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
     * @description Defines a convenience module for handling all the map.status interactions according to the CMW API 1.1 specification.
     *
     * @exports cmwapi/map/Status
     */
    var Status = {

        /**
         * @see module:cmwapi/map/status/Request.SUPPORTED_STATUS_TYPES
         */
        SUPPORTED_STATUS_TYPES: Request.SUPPORTED_STATUS_TYPES,
        /**
         * @see module:cmwapi/map/status/Format.REQUIRED_FORMATS
         */
        REQUIRED_FORMATS: Format.REQUIRED_FORMATS,

        /**
         * @see module:cmwapi/map/status/Request
         */
        request: Request,
        /**
         * @see module:cmwapi/map/status/View
         */
        view: View,
        /**
         * @see module:cmwapi/map/status/About
         */
        about: About,
        /**
         * @see module:cmwapi/map/status/Format
         */
        format: Format
    };

    return Status;
});

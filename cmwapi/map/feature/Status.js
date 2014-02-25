
define(["cmwapi/map/feature/status/Start", "cmwapi/map/feature/status/Stop",
    "cmwapi/map/feature/status/Request", "cmwapi/map/feature/status/Sublayers",
    "cmwapi/map/feature/status/Report"],
    function(Start, Stop, Request, Sublayers, Report) {

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
     * @exports cmwapi/map/feature/Status
     */
    var Status = {

        /**
         * @see module:cmwapi/map/feature/status/Start
         */
        start: Start,

        /**
         * @see module:cmwapi/map/feature/status/Stop
         */
        stop: Stop,

        /**
         * @see module:cmwapi/map/feature/status/Request
         */
        request: Request,

        /**
         * @see module:cmwapi/map/feature/status/Sublayers
         */
        sublayers: Sublayers,

        report: Report
    };

    return Status;
});

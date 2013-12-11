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
     * @exports cmwapi/Channels
     */
    var Constants = {

        /**
         * A high pixels (dots) per inch value for web displays.  Note:  This is an assumed value and
         * does not necessarily reflect the DPI of the current display.
         * @type number
         */ 
        HIGH_DPI: 120,
        /**
         * A low or default pixels (dots) per inch value for web displays.  Note:  This is an assumed
         * value and does not necessarily reflect the DPI of the current display.
         * @type number
         */
        DEFAULT_DPI: 96,
        /**
         * The value of sine(30 degrees).
         * @type number
         */
        SINE_30_DEG: Math.sin(0.523598776),
        /**
         * The value of sine(60 degrees).
         * @type number
         */
        SINE_60_DEG: Math.sin(1.04719755),
        /**
         * The number of inches in a meter.  This is used for unit conversions and calculations related to
         * assumed screen resolution.
         * @type number
         */
        INCHES_PER_METER: 39.37
    };

    return Constants;
});
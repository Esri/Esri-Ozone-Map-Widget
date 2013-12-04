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
 * @module EsriAdapter
 */
define(["cmwapi/cmwapi", "cmwapi-adapter/Overlay", "cmwapi-adapter/Feature", "cmwapi-adapter/Status", "cmwapi-adapter/Error",
        "cmwapi-adapter/cmwapi-overlay-manager"],
        function(CommonMapApi, Overlay, Feature, Status, Error, OverlayManager) {

    /**
     * @classdesc Adapter layer between Common Map Widget API v. 1.1 javascript
     *      implementation and ESRI map implementations
     * @constructor
     * @version 1.1
     * @param map {object} ESRI map object for which this adapter should apply
     * @alias module:EsriAdapter
     */
    var EsriAdapter = function(map) {
        this.overlayManager = new OverlayManager(this, map);

        this.overlay = new Overlay(this, this.overlayManager);

        this.feature = new Feature(this, this.overlayManager);

        this.status = new Status(this, map);

        this.error = new Error(this);
    };

    return EsriAdapter;
});

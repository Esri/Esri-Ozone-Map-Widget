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

// Entry point for map webapp
//
// NOTE: Modules that are not compatible with asynchronous module loading
// (AMD) are included in the webapp's HTML file to prevent issues.
require([
    "esri/map", "digits/overlayManager/js/overlayManager", "esri/dijit/BasemapGallery", "esri/dijit/Scalebar",
    "esri/dijit/Geocoder","dojo/dom-style", /*"OWFWidgetExtensions/owf-widget-extended",*/ "dojo/domReady!"],
    function(Map, OverlayManager, BasemapGallery,Scalebar, Geocoder) {

        var map = new Map("map", {
            center: [-76.809469, 39.168101],
            zoom: 7,
            basemap: "streets"
        });

        var geocoder = new Geocoder({ map: map }, "search");
        geocoder.startup();

        var basemapGallery = new BasemapGallery({ showArcGISBasemaps: true, map: map }, "basemapGallery");
        basemapGallery.startup();

        new Scalebar({ map:map, attachTo:"bottom-left", scalebarUnit: "dual" });

        var toggleBasemapGallery = function() {
            $('#popover_content_wrapper').toggle();
            $('#overlay').removeClass('selected');
            $('#popover_overlay_wrapper').hide();
            $('#basemaps').toggleClass('selected');
        }

        if (OWF.Util.isRunningInOWF()) {
            OWF.ready(function () {
                OWF.notifyWidgetReady();
                var overlayManager = new OverlayManager(map);
                $('#map').on('mouseup', function() {
                    $('#popover_overlay_wrapper').hide();
                    $('#popover_content_wrapper').hide();
                    $('#basemaps').removeClass('selected');
                    $('#overlay').removeClass('selected');
                });
                $('#overlay').on('click', overlayManager.toggleOverlayManager);
                $('#basemaps').on('click', toggleBasemapGallery);
                $("[rel=tooltip]").tooltip({ placement: 'bottom'});
           });
        }
});
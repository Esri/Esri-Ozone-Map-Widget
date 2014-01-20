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
    "esri/dijit/Legend", "esri/dijit/Geocoder", "notify/notify.min", "dojo/dom-style", "dojo/domReady!"],
    function(Map, OverlayManager, BasemapGallery, Scalebar, Legend, Geocoder) {

    var map = new Map("map", {
        center: [-76.809469, 39.168101],
        zoom: 7,
        basemap: "streets"
    });

    map.on('load', function() {
        handleLayout();
    });

    var geocoder = new Geocoder({map: map}, "search");
    geocoder.startup();

    var basemapGallery = new BasemapGallery({showArcGISBasemaps: true, map: map}, "basemapGallery");
    basemapGallery.startup();

    new Scalebar({ map:map, attachTo:"bottom-left", scalebarUnit: "dual" });

    var legend = new Legend({
        autoUpdate: true,
        map: map,
        respectCurrentMapScale: true
    }, 'legend_holder_div');
    legend.startup();

    var toggleBasemapGallery = function() {
        $('#popover_content_wrapper').toggle();
        $('#overlay').removeClass('selected');
        $('#popover_overlay_wrapper').hide();
        $('#basemaps').toggleClass('selected');
    };

    var handleLegendPopOut = function() {
        var legendWidth = 250;
        var legendDividerWidth = 3;
        var totalWidth = legendWidth + legendDividerWidth;

        $('.legend_button').hide();

        var windowWidth = $(window).width();

        console.log(windowWidth);
        console.log(totalWidth);

        $("#map").width((windowWidth - totalWidth));
        console.log($("#map").width());
        //map.reposition(true);
        map.resize(true);

        $('.esri_info_div').width(totalWidth);
        $("#legend").width(legendWidth);

        $('#legend_holder_div').width(legendWidth - $('#legend_holder_div').outerWidth());

        $(".legend_vertical_divider").width(legendDividerWidth);
        $(".legend_vertical_divider").css('left', '250px');

        $('.legend_vertical_divider').mousedown(function(e){
            e.preventDefault();

            $('*').css({'cursor':'col-resize'});

            $(document).mousemove(function(e){
                var position = e.pageX;
                $('#map').width(windowWidth - position);
                map.resize(true);

                $('.esri_info_div').width(position - 3);
                $("#legend").width(position - 3);
                $('#legend_holder_div').width((position - 3) - ($('#legend_holder_div').outerWidth() - $('#legend_holder_div').innerWidth()));

                $(".legend_vertical_divider").css('left', position - 3);
            });
        });
        $(document).mouseup(function(e){
            $(document).unbind('mousemove');
            $('*').css({'cursor':''});
        });

    };
    $(".legend_button").on('click', handleLegendPopOut);

    var handleLayout = function() {
        var windowWidth = $(window).width();

        console.log(windowWidth);

        $("#map").width(windowWidth - $("#legend").width());
        //map.reposition(true);
        map.resize(true);
    };

    if (OWF.Util.isRunningInOWF()) {
        OWF.ready(function () {
            esri.config.defaults.io.proxyUrl = "/owf/proxy.jsp";

            OWF.notifyWidgetReady();
            var overlayManager = new OverlayManager(map, $.notify);
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

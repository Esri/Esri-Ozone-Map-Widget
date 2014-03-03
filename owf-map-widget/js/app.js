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
    "esri/map", "digits/overlayManager/js/overlayManager", "digits/legend/js/legend",
    "digits/basemapGallery/js/basemapGallery", "esri/dijit/Scalebar", "esri/dijit/Geocoder", "dojo/_base/array",
    "dojo/parser", "esri/dijit/Print", "esri/tasks/PrintTemplate", "notify/notify.min", "dojo/dom-style", "dojo/domReady!"],
    function(Map, OverlayManager, Legend, BasemapGallery, Scalebar, Geocoder, arrayUtils, parser, Print, PrintTemplate) {

    var map = new Map("map", {
        basemap: "streets"
    });
    parser.parse();

    var legend = new Legend(map);

    var geocoder = new Geocoder({map: map}, "search");
    geocoder.startup();

    var basemapGallery = new BasemapGallery({showArcGISBasemaps: true, map: map}, "basemapGallery");
    basemapGallery.startup();

    new Scalebar({ map:map, attachTo:"bottom-left", scalebarUnit: "dual" });

    var toggleBasemapGallery = function() {
        $('#popover_content_wrapper').toggle();
        $('#overlay').removeClass('selected');
        $('#popover_overlay_wrapper').hide();
        $('#basemaps').toggleClass('selected');
    };

    $.notify.addStyle('esri', {  // modeled after bootstrap style
        html: "<div>\n" +
            "<div class='title' data-notify-html='title'/>\n" +
            "<span data-notify-text/>\n</div>"
    });

    $.notify.defaults({ autoHide: false, clickToHide: true, style: 'esri'});

    var errorNotifier = function( msg ) {
        $.notify(msg, {className: "error", autoHide: true, autoHideDelay: 10000});
    };

    var infoNotifier = function( msg ) {
        $.notify(msg, {className: "info", autoHide: true, autoHideDelay: 5000});
    };

    if (OWF.Util.isRunningInOWF()) {
        OWF.ready(function () {
            // see https://developers.arcgis.com/en/javascript/jshelp/ags_proxy.html for options
            //  applicable to your deployment environment
            // Base installation - applying with a JSP available in this app.
            //  However, other options (ASP.NET, PHP) exist
            // TODO: Need means of configuring for the overall application...  Also, dealing with authentication
            esri.config.defaults.io.proxyUrl = "/owf/proxy.jsp";

            OWF.notifyWidgetReady();
            var overlayManager = new OverlayManager(map, errorNotifier, infoNotifier);
            $('#map').on('mouseup', function() {
                $('#popover_overlay_wrapper, #popover_content_wrapper').hide();
                $('#basemaps, #overlay, #legend_button').removeClass('selected');
                //$('#data_div_button').removeClass('selected');
            });

            $('#overlay').on('click', overlayManager.toggleOverlayManager);
            $('#basemaps').on('click', toggleBasemapGallery);
            $("#legend_button").on('click', legend.handleLegendPopOut);
            //$('#data_div_button').on('click', handleDataDivPopOut);
            $("[rel=tooltip]").tooltip({ placement: 'bottom'});
            createPrintDijit("asdf");
       });
    }


     function createPrintDijit(printTitle) {
          var layoutTemplate, templateNames, mapOnlyIndex, templates;

          // create an array of objects that will be used to create print templates
          var layouts = [{
            name: "Letter ANSI A Landscape",
            label: "Landscape (PDF)",
            format: "pdf",
            options: {
              legendLayers: [], // empty array means no legend
              scalebarUnit: "Miles",
              titleText: printTitle + ", Landscape PDF"
            }
          }, {
            name: "Letter ANSI A Portrait",
            label: "Portrait (Image)",
            format: "jpg",
            options:  {
              legendLayers: [],
              scaleBarUnit: "Miles",
              titleText: printTitle + ", Portrait JPG"
            }
          }];

          // create the print templates
          var templates = arrayUtils.map(layouts, function(lo) {
            var t = new PrintTemplate();
            t.layout = lo.name;
            t.label = lo.label;
            t.format = lo.format;
            t.layoutOptions = lo.options;
            return t;
          });

          var printer = new Print({
            map:map,
            templates: templates,
            url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
          }, "print_button");
          printer.startup();
        }
});

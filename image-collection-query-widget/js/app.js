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
require(["dojo/query","dojo/io-query", "dojo/parser", "dojox/html/entities", "dijit/form/DateTextBox", 
    "cmwapi/cmwapi",
    "dojox/form/Manager", "dojo/dom-style", "dojo/domReady!"],
    function(query, ioQuery, parser, Entities, DateTextBox, CMWAPI) {
        parser.parse();

        var DEFAULT_SERVER = "http://wdcintelgis.esri.com/arcgis/rest/services/Iran/ImageCollectionCoverage/MapServer/2/query";
        var DEFAULT_CLOUD = 50;
        var DEFAULT_NAME = "Image Query";
        var DEFAULT_PARAMS = "?f=kml&outfields=*"

        var buildRequestUrl = function(server, start, end, cloud) {
            var url = DEFAULT_SERVER;
            var start;
            var end;

            var query = {
                f: "kmz",
                outFields: "*",
            }

            // Change the server if necessary
            if (server && server.toString().trim().length > 0) {
                url = server;
            }

            // Add the cloud coverage query param.
            //query.where = "CLOUD_COVER_PERCENT < " + ((query()))

            // Add the start and end times.
            start = new Date(startTime.get("value"));
            end = new Date(endTime.get("value"));
            if (start.getTime() < end.getTime()) {
                query.time = start.getTime() + ", " + end.getTime();
            }

            // HTTP encode it.
            return url + "?" + ioQuery.objectToQuery(query);

        }

        var createQueryOverlay = function(name) {
            var payload = {
                name: name,
                overlayId: OWF.getInstanceId()
            };
            CMWAPI.overlay.create.send(payload)
        };

        // query("#cloud-cover");
        // query("#query-name");
        // query("#collection-url");
        // startTime;
        // endTime;
        // console.log(queryForm);
        // console.log(query("#query-btn"));
        query("#query-btn").on("click", function(event) {

            // Create the overlay for results.
            createQueryOverlay("Image Collection Queries");

            var requestUrl = buildRequestUrl(query("#collection-url").attr("value"),
                startTime.get("value"), 
                endTime.get("value"), 
                query("#cloud-cover").attr("value"));
            var payload = {
                overlayId: OWF.getInstanceId(),
                featureId: DEFAULT_NAME,
                name: DEFAULT_NAME,
                format: "kml",
                url: requestUrl,
                zoom: true
            };

            CMWAPI.feature.plot.url.send(payload);
            alert( "The query payload is " + payload);
            
            // event.preventDefault();
        });


        if (OWF.Util.isRunningInOWF()) {
            OWF.ready(function () {
                OWF.notifyWidgetReady();
           });
        }

});

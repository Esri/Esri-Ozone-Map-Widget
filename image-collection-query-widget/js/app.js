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

// NOTE: Modules that are not compatible with asynchronous module loading
// (AMD) are included in the webapp's HTML file to prevent issues.
require(["dojo/query","dojo/io-query", "dojo/parser", "dojox/html/entities", "dijit/form/DateTextBox", 
    "cmwapi/cmwapi",
    "dojox/form/Manager", "dojo/dom-style", "dojo/domReady!"],
    function(query, ioQuery, parser, Entities, DateTextBox, CMWAPI) {
        parser.parse();

        var DEFAULT_SERVER = "http://wdcintelgis.esri.com/arcgis/rest/services/Iran/ImageCollectionCoverage/MapServer/2/query";
        var DEFAULT_CLOUD = 0;
        var DEFAULT_NAME = "Image Query";
        var DEFAULT_PARAMS = "?f=kml&outfields=*";

        var buildRequestUrl = function(server, start, end, cloud) {
            var url = DEFAULT_SERVER;
            var start;
            var end;
            var where = "";
            var query = {
                f: "kmz",
                outFields: "*",
                returnGeometry: true
            };


            // Change the server if necessary
            if (server && server.toString().trim().length > 0) {
                url = server;
            }

            // Add the cloud coverage query param.
            if (cloud && cloud.toString().trim().length > 0) {
                //query.where = "CLOUD_COVER_PERCENT < " + cloud;
                where = "CLOUD_COVER_PERCENT <= " + cloud;
            } else {
                //query.where = "1=1 AND 2=2";
                where = "CLOUD_COVER_PERCENT <= " + DEFAULT_CLOUD;
            }

            // Add the start and end times.
            // Note the query for COLLECTION_DATE should follow this format:
            // COLLECTION_DATE<=date '2013-08-19 00:00:00' AND COLLECTION_DATE>=date '2013-08-18 00:00:00' 
            start = startTime.format(startTime.get("value"), {
                datePattern: "yyyy-MM-dd 00:00:00",
                selector: "date"
            });
            end = endTime.format(endTime.get("value"), {
                datePattern: "yyyy-MM-dd 00:00:00",
                selector: "date"
            });

            // Add the collection dates to the where clause.
            where += " AND COLLECTION_DATE>=" + "date '" + start + "'"; 
            where += " AND COLLECTION_DATE<=" + "date '" + end + "'";

            // Add the where clause to the query params and generate the main
            // query URL.
            query.where = where;
            url = url + "?" + ioQuery.objectToQuery(query);
            url = url.replace(/'/g, "%27");
            return url;
        }

        var createQueryOverlay = function(name) {
            var payload = {
                name: name,
                overlayId: OWF.getInstanceId()
            };
            CMWAPI.overlay.create.send(payload)
        };

        query("#query-btn").on("click", function(event) {

            // Create the overlay for results.
            createQueryOverlay("Image Collection Queries");

            var requestUrl = buildRequestUrl(query("#collection-url").attr("value"),
                startTime.get("value"), 
                endTime.get("value"), 
                query("#cloud-cover").attr("value")),
                featureId = query("#query-name").attr("value");

            featureId = (featureId && featureId.toString().trim().length > 0) ? featureId : DEFAULT_NAME;

            var payload = {
                overlayId: OWF.getInstanceId(),
                featureId: featureId,
                name: featureId,
                format: "kml",
                url: requestUrl,
                zoom: true
            };

            CMWAPI.feature.plot.url.send(payload);
            event.preventDefault();
        });


        if (OWF.Util.isRunningInOWF()) {
            OWF.ready(function () {
                OWF.notifyWidgetReady();
           });
        }

});

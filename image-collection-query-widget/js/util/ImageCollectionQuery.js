define(["dojo/io-query", "cmwapi/cmwapi"],
    function(ioQuery, CMWAPI) {

     var DEFAULT_SERVER = "http://wdcintelgis.esri.com/arcgis/rest/services/Iran/ImageCollectionCoverage/MapServer/2/query";
     var DEFAULT_CLOUD = 25;
     var DEFAULT_NAME = "Image Query";

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
     * @description A utilitiy class for creating CMWAPI overlays and generating
     * the query URL for an image footprint service that includes attributes for collection times
     * and cloud cover.  This is configured by default to work with a specific data set provided
     * on Esri's public servers.
     *
     * @exports image-collection-query-widget/util/ImageCollectionQuery
     */
     var ImageCollectionQuery = {
        /** 
         * The default feature service url for queries. 
         */
        DEFAULT_SERVER : DEFAULT_SERVER,
        /** 
         * The default maximum cloud coverage percentage. 
         */
        DEFAULT_CLOUD : DEFAULT_CLOUD,
        /** 
         * The default CMWAPI feature name to use when publishing query results. 
         */
        DEFAULT_NAME : DEFAULT_NAME,

        /**
         * Helper method for constructing a query URL against a sample footprints service.
         * At present, this is configured to query one of Esri's sample services.
         * @param {string} server The base URL of the ArcGIS service to query
         * @param {string} start The start date string in format 'yyyy-MM-dd hh:mm:ss'
         * @param {string} end The end date string in format 'yyyy-MM-dd hh:mm:ss'
         * @param {number} cloud The maximum percentage cloud cover to allow
         * @param {boolean} returnCountOnly True if the query URL should request only a total and no data
         * @return {string} The constructed query URL
         */
        buildRequestUrl : function(server, start, end, cloud, returnCountOnly) {
            var url = DEFAULT_SERVER;
            var where = "";
            var start, end;
            var query = {
                f: (returnCountOnly) ? "json" : "kmz",
                returnCountOnly: (returnCountOnly === true),
                outFields: "*",
                returnGeometry: !(returnCountOnly === true)
            };

            // Change the server if necessary
            if (server && server.toString().replace(/^\s+|\s+$/g, '').length > 0) {
                url = server;
            }

            // Add the cloud coverage query param.
            if (cloud && cloud.toString().replace(/^\s+|\s+$/g, '').length > 0) {
                where = "CLOUD_COVER_PERCENT <= " + cloud;
            } else {
                where = "CLOUD_COVER_PERCENT <= " + DEFAULT_CLOUD;
            }

            // Add the collection dates to the where clause.
            where += " AND COLLECTION_DATE>=" + "date '" + start + "'"; 
            where += " AND COLLECTION_DATE<=" + "date '" + end + "'";

            // Add the where clause to the query params and generate the main
            // query URL.
            query.where = where;
            url = url + "?" + ioQuery.objectToQuery(query);
            url = url.replace(/'/g, "%27");
            return url;
        },

        /**
         * Helper method for creating a CMWAPI overlay. 
         * @param {string} name The name of the overlay.
         */
        createQueryOverlay : function(name) {
            var payload = {
                name: name,
                overlayId: OWF.getInstanceId()
            };
            CMWAPI.overlay.create.send(payload);
        }
    };

    return ImageCollectionQuery;
});

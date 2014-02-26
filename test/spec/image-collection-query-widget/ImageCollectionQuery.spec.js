/**
 * Copyright © 2013 Environmental Systems Research Institute, Inc. (Esri)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at<br>
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(["dojo/io-query", "cmwapi/cmwapi", "image-collection-query-widget/js/util/ImageCollectionQuery",
        "test/mock/OWF", "test/mock/Ozone"],
        function(ioQuery, cmwapi, ImageCollectionQuery, OWF, Ozone) {

    describe("ImageCollectionQuery module", function() {

        beforeEach(function() {
            // Mock the necessary OWF methods and attach them to the window.
            // OWF should be in global scope when other libraries attempt to
            // access it.
            window.OWF = OWF;
            window.Ozone = Ozone;
        });

        afterEach(function() {
            // Remove our mock objects from the window so neither they nor
            // any spies upon them hang around for other test suites.
            delete window.OWF;
            delete window.Ozone;
        });

        it("generates a proper json format request when asked for counts only", function() {
            var date = Date.now();

            var url = ImageCollectionQuery.buildRequestUrl("http://foo", "2014-01-01 00:00:00", "2014-01-02 00:00:00", 42, true);
            var site = url.substring(0, url.indexOf("?"));
            var query = url.substring(url.indexOf("?") + 1, url.length);
            var queryObject = ioQuery.queryToObject(query);

            expect(site).toEqual("http://foo");
            expect(queryObject.f).toEqual("json");
            expect(queryObject.returnCountOnly).toEqual("true");
            expect(queryObject.outFields).toEqual("*");
            expect(queryObject.returnGeometry).toEqual("false");
            expect(queryObject.where).toEqual("CLOUD_COVER_PERCENT <= 42 AND COLLECTION_DATE>=date '2014-01-01 00:00:00' AND COLLECTION_DATE<=date '2014-01-02 00:00:00'");
        });

        it("generates a proper kml format request when asked for counts only", function() {
            var date = Date.now();

            var url = ImageCollectionQuery.buildRequestUrl("http://foo", "2014-01-01 00:00:00", "2014-01-02 00:00:00", 42, false);
            var site = url.substring(0, url.indexOf("?"));
            var query = url.substring(url.indexOf("?") + 1, url.length);
            var queryObject = ioQuery.queryToObject(query);

            expect(site).toEqual("http://foo");
            expect(queryObject.f).toEqual("kmz");
            expect(queryObject.returnCountOnly).toEqual("false");
            expect(queryObject.outFields).toEqual("*");
            expect(queryObject.returnGeometry).toEqual("true");
            expect(queryObject.where).toEqual("CLOUD_COVER_PERCENT <= 42 AND COLLECTION_DATE>=date '2014-01-01 00:00:00' AND COLLECTION_DATE<=date '2014-01-02 00:00:00'");
        });

        it("calls the cmwapi's overlay channels properly to create a Image Queries overlay", function() {
            spyOn(cmwapi.overlay.create, 'send').andCallThrough();;
            ImageCollectionQuery.createQueryOverlay('TEST OVERLAY');

            expect(cmwapi.overlay.create.send.calls.length).toEqual(1);
            expect(cmwapi.overlay.create.send.mostRecentCall.args[0].name).toEqual("TEST OVERLAY");
            expect(cmwapi.overlay.create.send.mostRecentCall.args[0].overlayId).toBeDefined();
        });
    });
});

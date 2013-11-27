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
define(["cmwapi/cmwapi", "cmwapi-adapter/Status", "esri/kernel", "test/mock/esriMap", "test/mock/OWF", "test/mock/Ozone"],
        function(CommonMapApi, Status, EsriNS, Map, OWF, Ozone) {

    describe("To test the CMWAPI Adapter status module", function() {
        beforeEach(function() {
            // Mock the necessary OWF methods and attach them to the window.
            // OWF should be in global scope when other libraries attempt to
            // access it.
            window.OWF = OWF;
            window.Ozone = Ozone;
            window.Map = Map;
        });

        afterEach(function() {
            // Remove our mock objects from the window so neither they nor
            // any spies upon them hang around for other test suites.
            delete window.OWF;
            delete window.Ozone;
            delete window.Map;
        });

        it("verify that the status object can be created without error", function() {
            var status  = new Status();
            expect(status).toBeDefined();
        });

        describe("spy on the cmwapi methods", function() {
            beforeEach(function() {
                spyOn(CommonMapApi.status.request, 'addHandler').andCallThrough();
                spyOn(CommonMapApi.status.view, 'send').andCallThrough();
                spyOn(CommonMapApi.status.about, 'send').andCallThrough();
                spyOn(CommonMapApi.status.format, 'send').andCallThrough();
            });

            it("and check that the handler is bound", function() {
                var map = new Map();
                var status  = new Status({}, map);
                expect(CommonMapApi.status.request.addHandler).toHaveBeenCalled();
            });

            it("and check that the view send is called with 'view' type as param", function() {
                var map = new Map();
                var status  = new Status({}, map);
                status.handleRequest("FakeWidget", ["view"]);
                expect(CommonMapApi.status.view.send).toHaveBeenCalledWith('FakeWidget',
                    {southWest: {lat: 0, lon: 0}, northEast: {lat: 2, lon: 2}}, {lat: 1, lon: 1 }, 2);
                expect(CommonMapApi.status.about.send).not.toHaveBeenCalled();
                expect(CommonMapApi.status.format.send).not.toHaveBeenCalled();
            });

            it("and check that the about send is called with 'about' type as param", function() {
                var map = new Map();
                var status  = new Status({}, map);
                status.handleRequest("FakeWidget", ["about"]);
                expect(CommonMapApi.status.view.send).not.toHaveBeenCalled();
                expect(CommonMapApi.status.about.send).toHaveBeenCalledWith(EsriNS.version, "2-D", OWF.getInstanceId());
                expect(CommonMapApi.status.format.send).not.toHaveBeenCalled();
            });

            it("and check that the format send is called with 'format' type as param", function() {
                var map = new Map();
                var status  = new Status({}, map);
                status.handleRequest("FakeWidget", ["format"]);
                expect(CommonMapApi.status.view.send).not.toHaveBeenCalled();
                expect(CommonMapApi.status.about.send).not.toHaveBeenCalled();
                expect(CommonMapApi.status.format.send).toHaveBeenCalledWith(["kml"]);
            });

            it("and check that the view and format send are called with 'format' and 'view' types as params", function() {
                var map = new Map();
                var status  = new Status({}, map);
                status.handleRequest("FakeWidget", ["format", "view"]);
                expect(CommonMapApi.status.view.send).toHaveBeenCalled();
                expect(CommonMapApi.status.about.send).not.toHaveBeenCalled();
                expect(CommonMapApi.status.format.send).toHaveBeenCalled();
            });
        })
    });

});
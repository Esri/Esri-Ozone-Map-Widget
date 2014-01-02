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
define(["cmwapi/cmwapi", "cmwapi-adapter/EsriOverlayManager", "cmwapi-adapter/ViewUtils", "esri/kernel", "test/mock/esriMap", 
    "test/mock/OWF", "test/mock/Ozone"],
    function(CommonMapApi, OverlayManager, ViewUtils, EsriNS, Map, OWF, Ozone) {

    describe("To test the CMWAPI Adapter ViewUtils module", function() {

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

        it("verifies that the ViewUtils object can be included", function() {
            expect(ViewUtils).toBeDefined();
        });

        // This just performs some basic happy path testing to verify that the methods traverse a very simple
        // overlay/feature tree.  Until the math behind some of the ViewUtil methods is vetted a bit more,
        // this will cover the basic case.  Further testing requires actual Maps and Extents.
        it("finds an extent from a feature, overlay, or layer.", function() {
            var overlayManager = new OverlayManager(new Map());
            overlayManager.overlay.createOverlay("fake", "o", "on");

            overlayManager.feature.plotFeatureUrl("fake2", "o", "f", "fn", "kml", "http://url");

            // Check that we can get the extent of the mock kml feature through its layer, feature, or overlay.
            expect(ViewUtils.findOverlayExtent(overlayManager.getOverlays().o).name).toEqual("mockExtent");
            expect(ViewUtils.findFeatureExtent(overlayManager.getOverlays().o.features.f).name).toEqual("mockExtent");
            expect(ViewUtils.findLayerExtent(overlayManager.getOverlays().o.features.f.esriObject).name).toEqual("mockExtent");
        });

    });

});
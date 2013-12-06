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
define(["cmwapi/cmwapi", "cmwapi-adapter/cmwapi-adapter", "cmwapi-adapter/EsriOverlayManager"], function(CommonMapApi, Adapter, OverlayManager) {

    describe("To test Common Map Widget API ESRI overlay manager", function() {
        describe("Overlay functions", function() {
            var overlayManager;

            var mapStub = {

            };

            beforeEach(function() {
                overlayManager = new OverlayManager({}, mapStub);
            });

            it("verify the overlay create without parent", function() {
                var overlays = overlayManager.getOverlays();

                expect(Object.keys(overlays).length).toBe(0);

                overlayManager.overlay.createOverlay("FakeWidget", "1111", "Name 1");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
            });

            it("verify the overlay create of two, one with parent", function() {
                var overlays = overlayManager.getOverlays();

                expect(Object.keys(overlays).length).toBe(0);

                overlayManager.overlay.createOverlay("FakeWidget", "1111", "Name 1");

                overlays = overlayManager.getOverlays();

                expect(Object.keys(overlays).length).toBe(1);
                expect(overlays['1111']).toBeDefined();
                expect(overlays['1111'].children).toBeDefined();
                expect(Object.keys(overlays["1111"].children).length).toBe(0)

                overlayManager.overlay.createOverlay("FakeWidget 1", "2222", "Name 2", "1111");
                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(2);
                expect(overlays['1111']).toBeDefined();
                expect(overlays['1111'].children).toBeDefined();
                expect(Object.keys(overlays["1111"].children).length).toBe(1)
                expect(overlays["1111"].children["2222"]).toBeDefined();

                overlays["2222"].name = "New Name 2";
                expect(overlays["1111"].children["2222"].name).toBe("New Name 2");
            });


            xit("verify overlay create with duplicate id", function() {

            });

            it("verify overlay remove of one", function() {
                var overlays = overlayManager.getOverlays();

                expect(Object.keys(overlays).length).toBe(0);

                overlayManager.overlay.createOverlay("fake widget", "1111", "Name 1");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);

                overlayManager.overlay.removeOverlay("FakeWidget2", "1111")
                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(0);
            });

            it("verify overlay remove of one and resolve parent child pointers", function() {
                var overlays = overlayManager.getOverlays();

                expect(Object.keys(overlays).length).toBe(0);

                overlayManager.overlay.createOverlay("fake widget", "1111", "Name 1");
                overlayManager.overlay.createOverlay("fake widget", "2222", "Name 1", "1111");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(2);

                overlayManager.overlay.removeOverlay("Fake widget2", "2222");

                overlays = overlayManager.getOverlays();
                expect(overlays["2222"]).not.toBeDefined();
                expect(overlays["1111"].children["2222"]).not.toBeDefined();
            });

            it("verify overlay remove of one and child", function() {
                var overlays = overlayManager.getOverlays();

                expect(Object.keys(overlays).length).toBe(0);

                overlayManager.overlay.createOverlay("fake widget", "1111", "Name 1");
                overlayManager.overlay.createOverlay("fake widget", "2222", "Name 1", "1111");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(2);

                overlayManager.overlay.removeOverlay("FakeWidget2", "1111");

                overlays = overlayManager.getOverlays();
                expect(overlays["1111"]).not.toBeDefined();
                expect(overlays["2222"]).not.toBeDefined();
            });

            it("verify overlay hide with invalid id calls error", function() {

            });

            it("verify overlay hide with valid id", function() {

            });

        });

        describe("change handler", function() {
            it("verify the handlers are called on tree change", function() {
                var overlayManager = new OverlayManager({}, {});

                var handler = jasmine.createSpy('changeHandler');

                overlayManager.bindTreeChangeHandler(handler);

                expect(handler).not.toHaveBeenCalled();

                overlayManager.overlay.createOverlay("fake widget", "1111", "Name 1");

                expect(handler).toHaveBeenCalled();
            });
        });
    });
});

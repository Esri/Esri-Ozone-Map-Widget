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
define(["cmwapi/cmwapi", "cmwapi-adapter/cmwapi-adapter", "cmwapi-adapter/EsriOverlayManager",
        "test/mock/esriMap", "test/mock/OWF", "test/mock/Ozone"],
        function(CommonMapApi, Adapter, OverlayManager, Map, OWF, Ozone) {

    describe("To test Common Map Widget API ESRI overlay manager", function() {
        describe("Overlay functions", function() {
            var overlayManager;
            var adapter;

            beforeEach(function() {
                window.OWF = OWF;
                window.Ozone = Ozone;
                window.Map = Map;

                adapter = new Adapter(new Map());
                overlayManager = new OverlayManager(adapter, new Map());
            });

            afterEach(function() {
                // Remove our mock objects from the window so neither they nor
                // any spies upon them hang around for other test suites.
                delete window.OWF;
                delete window.Ozone;
                delete window.Map;
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


            it("verify overlay create with duplicate id", function() {
                var update = spyOn(overlayManager.overlay, 'updateOverlay').andCallThrough();

                expect(Object.keys(overlayManager.getOverlays()).length).toBe(0);

                //create the overlay
                overlayManager.overlay.createOverlay("FakeWidget", "1111", "Name 1");

                expect(update).not.toHaveBeenCalled();

                //create with same ID
                overlayManager.overlay.createOverlay("FakeWidget", "1111", "Name 2");

                expect(update).toHaveBeenCalledWith("FakeWidget", "1111", "Name 2", undefined);
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

            it("verify overlay hide with valid id", function() {
                overlayManager.overlay.createOverlay("fake widget", "1111", "Name 1");
                overlayManager.overlay.createOverlay("fake widget", "2222", "Name 1", "1111");
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(2);

                expect(overlays["2222"].isHidden).toBe(false);
                expect(overlays["1111"].isHidden).toBe(false);

                overlayManager.overlay.hideOverlay("Fake widget 2", "1111");

                overlays = overlayManager.getOverlays();
                expect(overlays["2222"].isHidden).toBe(true);
                expect(overlays["1111"].isHidden).toBe(true);
            });

            it("verify remove of bad id does not call error", function() {
                var error = spyOn(adapter.error, 'error').andCallThrough();

                overlayManager.overlay.removeOverlay("fake widget 2", "9876");

                expect(error).not.toHaveBeenCalled();
            });

            it("verify update of bad id calls error", function() {
                var error = spyOn(adapter.error, 'error').andCallThrough();

                overlayManager.overlay.updateOverlay("fake widget 2", "9876");

                var msg = "No overlay exists with the provided id of 9876";
                expect(error).toHaveBeenCalledWith("fake widget 2", msg, {type: 'map.overlay.update', msg: msg});
            });

            it("verify overlay hide with invalid id calls error", function() {
                var error = spyOn(adapter.error, 'error').andCallThrough();

                overlayManager.overlay.hideOverlay("fake widget", "9876");

                var msg = "Overlay not found with id 9876"
                expect(error).toHaveBeenCalledWith("fake widget", msg, {type: "map.overlay.hide", msg: msg});
            });

            it("verify overlay show with invalid id calls error", function() {
                var error = spyOn(adapter.error, 'error').andCallThrough();

                overlayManager.overlay.hideOverlay("fake widget", "9876");

                var msg = "Overlay not found with id 9876"
                expect(error).toHaveBeenCalledWith("fake widget", msg, {type: "map.overlay.hide", msg: msg});
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

        describe("ui api relay calls", function() {
            var overlayManager;
            var adapter;

            beforeEach(function() {
                window.OWF = OWF;
                window.Ozone = Ozone;
                window.Map = Map;

                adapter = new Adapter(new Map());
                overlayManager = new OverlayManager(adapter, new Map());
            });

            afterEach(function() {
                // Remove our mock objects from the window so neither they nor
                // any spies upon them hang around for other test suites.
                delete window.OWF;
                delete window.Ozone;
                delete window.Map;
            });

            it("verify send overlay create calls api correctly", function() {
                spyOn(CommonMapApi.overlay.create, 'send').andCallThrough();

                overlayManager.sendOverlayCreate("id", "name");

                expect(CommonMapApi.overlay.create.send).toHaveBeenCalledWith({overlayId: "id", name: "name", parentId: null});
            });

            it("verify send overlay remove calls api correctly", function() {
                spyOn(CommonMapApi.overlay.remove, 'send').andCallThrough();

                overlayManager.sendOverlayRemove("id");

                expect(CommonMapApi.overlay.remove.send).toHaveBeenCalledWith({overlayId: "id"});
            });

            it("verify send overlay hide calls api correctly", function() {
                spyOn(CommonMapApi.overlay.hide, 'send').andCallThrough();

                overlayManager.sendOverlayHide("id");

                expect(CommonMapApi.overlay.hide.send).toHaveBeenCalledWith({overlayId: "id"});
            });

            it("verify send overlay show calls api correctly", function() {
                spyOn(CommonMapApi.overlay.show, 'send').andCallThrough();

                overlayManager.sendOverlayShow("id");

                expect(CommonMapApi.overlay.show.send).toHaveBeenCalledWith({overlayId: "id"});
            });

            xit("verify send overlay update calls api correctly", function() {
                spyOn(CommonMapApi.overlay.update, 'send').andCallThrough();

                overlayManager.sendOverlayUpdate("id", "newName", "newParentId");

                expect(CommonMapApi.overlay.update.send).toHaveBeenCalledWith({overlayId: "id", name: "name", parentId: "newParentId"});
            });

            xit("verify send feature ploturl calls api correctly", function() {

            });

            xit("verify send feature unplot calls api correctly", function() {

            });

            xit("verify send feature update calls api correctly", function() {

            });

            xit("verify send feature hide calls api correctly", function() {

            });

            xit("verify send feature show calls api correctly", function() {

            });
        });

        describe("feature handlers", function() {
            var overlayManager;

            beforeEach(function() {
                overlayManager = new OverlayManager({}, {});
            });

            xit("verify plot feature with kml string and existing overlay", function() {

            });

            xit("verify plot feature with wms string and existing overlay", function() {

            });

            xit("verify plot feature with kml url and existing overlay", function() {

            });

            xit("verify plot feature with wms url and existing overlay", function() {

            });

            xit("verify plot kml url with duplicate featureId calls delete first", function() {

            });

            xit("verify plot url with bad overlay id calls overlay create", function() {

            });

            xit("verify delete feature with good overlay id and good feature id", function() {

            });

            xit("verify delete feature with bad overlay id calls error", function() {

            });

            xit("verify delete feature with bad feature id calls error", function() {

            });

            xit("verify hide feature with good overlay id and good feature id", function() {

            });

            xit("verify feature is hidden when parent overlay is hidden", function() {

            });

            xit("verify feature is hidden multiple overlays deep", function() {

            });

            xit("verify hide feature with bad overlay id calls error", function() {

            });

            xit("verify hide feature with bad feature id calls error", function() {

            });

            xit("verify show feature with good overlay id and good feature id", function() {

            });

            xit("verify show feature with bad overlay id calls error", function() {

            });

            xit("verify show feature with bad feature id calls error", function() {

            });

            xit("verify zoom feature with good overlay id and good feature id", function() {

            });

            xit("verify zoom feature with bad overlay id calls error", function() {

            });

            xit("verify zoom feature with bad feature id calls error", function() {

            });

            xit("verify update feature with good overlay id and good feature id", function() {

            });

            xit("verify update feature with bad overlay id calls error", function() {

            });

            xit("verify update feature with bad feature id calls error", function() {

            });

            xit("verify update feature with bad new overlay id", function() {

            });

            xit("verify update feature with new overlay hidden", function() {

            });
        });
    });
});

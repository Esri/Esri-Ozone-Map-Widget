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
                overlayManager = adapter.overlayManager;
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


            it("verify overlay create with duplicate id is a no-op and does not update an overlay.", function() {
                var update = spyOn(overlayManager.overlay, 'updateOverlay').andCallThrough();

                expect(Object.keys(overlayManager.getOverlays()).length).toBe(0);

                //create the overlay
                overlayManager.overlay.createOverlay("FakeWidget", "1111", "Name 1");

                expect(update).not.toHaveBeenCalled();

                //create with same ID
                overlayManager.overlay.createOverlay("FakeWidget", "1111", "Name 2");

                expect(update).not.toHaveBeenCalled();
                
                var overlays = overlayManager.getOverlays();
                expect(overlays["1111"].name).toEqual("Name 1");
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
                var eventing = OWF.Eventing;
                expect(eventing).not.toBe(null);

                var error = spyOn(eventing, 'publish').andCallThrough();

                overlayManager.overlay.removeOverlay("fake widget 2", "9876");

                expect(error).not.toHaveBeenCalled();
            });

            it("verify update of bad id calls error", function() {
                var eventing = OWF.Eventing;
                expect(eventing).not.toBe(null);

                var error = spyOn(eventing, 'publish').andCallThrough();

                overlayManager.overlay.updateOverlay("fake widget 2", "9876");

                var msg = "No overlay exists with the provided id of 9876";
                expect(error).toHaveBeenCalledWith('map.error', JSON.stringify({
                    sender: "fake widget 2",
                    type: "map.overlay.update",
                    msg: msg,
                    error: {type: 'map.overlay.update', msg: msg}
                }));
            });

            it("verify overlay hide with invalid id calls error", function() {
                var eventing = OWF.Eventing;
                expect(eventing).not.toBe(null);

                var error = spyOn(eventing, 'publish').andCallThrough();

                overlayManager.overlay.hideOverlay("fake widget", "9876");

                var msg = "Overlay not found with id 9876"
                expect(error).toHaveBeenCalledWith("map.error", JSON.stringify({
                    sender: "fake widget",
                    type: "map.overlay.hide",
                    msg: msg,
                    error: {type: "map.overlay.hide", msg: msg}
                }));
            });

            it("verify overlay show with invalid id calls error", function() {
                var eventing = OWF.Eventing;
                expect(eventing).not.toBe(null);

                var error = spyOn(eventing, 'publish').andCallThrough();

                overlayManager.overlay.hideOverlay("fake widget", "9876");

                var msg = "Overlay not found with id 9876"
                expect(error).toHaveBeenCalledWith("map.error", JSON.stringify({
                    sender: "fake widget",
                    type: "map.overlay.hide",
                    msg: msg,
                    error: {type: "map.overlay.hide", msg: msg}
                }));
            });

            it("verify update of overlay with new parent", function() {
                var update = spyOn(overlayManager.overlay, 'updateOverlay').andCallThrough();

                expect(Object.keys(overlayManager.getOverlays()).length).toBe(0);

                //create the overlay
                overlayManager.overlay.createOverlay("FakeWidget", "o1", "on1");
                overlayManager.overlay.createOverlay("FakeWidget", "o2", "on2");
                overlayManager.overlay.createOverlay("FakeWidget", "o3", "on3", "o1");

                expect(update).not.toHaveBeenCalled();

                overlayManager.overlay.updateOverlay("fake", "o3", null, "o2");

                expect(update).toHaveBeenCalledWith("fake", "o3", null, "o2");

                var overlays = overlayManager.getOverlays();
                expect(overlays["o3"].parentId).toBe("o2");
                expect(overlays["o3"].name).toBe("on3");
            });

            it("verify showOverlay calls error for bad id", function() {
                var eventing = OWF.Eventing;
                expect(eventing).not.toBe(null);

                var error = spyOn(eventing, 'publish').andCallThrough();

                overlayManager.overlay.showOverlay("fake widget", "9876");

                var msg = "Overlay not found with id 9876"
                expect(error).toHaveBeenCalledWith("map.error", JSON.stringify({
                    sender: "fake widget",
                    type: "map.overlay.show",
                    msg: msg,
                    error: {type: "map.overlay.show", msg: msg}
                }));
            });

            it("verify showOverlay recurses properly", function() {
                var show = spyOn(overlayManager.overlay, 'showOverlay').andCallThrough();

                overlayManager.overlay.createOverlay("FakeWidget", "o1", "on1");
                overlayManager.overlay.createOverlay("FakeWidget", "o2", "on2", "o1");
                overlayManager.feature.plotFeatureUrl("fake2", "o2", "f1", "fn1", "kml", "http://url");
                var overlays = overlayManager.getOverlays();
                overlays['o2'].features['f1'].isHidden = true;

                overlayManager.overlay.showOverlay("fake", 'o1');

                expect(show).toHaveBeenCalledWith("fake", "o1");
                expect(show).toHaveBeenCalledWith("fake", "o2");
                overlays = overlayManager.getOverlays();
                expect(overlays['o2'].features['f1'].isHidden).toBe(false);
            });

            it("verify removeOverlay recurses properly", function() {
                var remove = spyOn(overlayManager.overlay, 'removeOverlay').andCallThrough();
                var fremove = spyOn(overlayManager.feature, 'deleteFeature').andCallThrough();

                overlayManager.overlay.createOverlay("FakeWidget", "o1", "on1");
                overlayManager.overlay.createOverlay("FakeWidget", "o2", "on2", "o1");
                overlayManager.feature.plotFeatureUrl("fake2", "o2", "f1", "fn1", "kml", "http://url");

                overlayManager.overlay.removeOverlay("fake", 'o1');

                expect(remove).toHaveBeenCalledWith("fake", "o1");
                expect(remove).toHaveBeenCalledWith("fake", "o2");
                expect(fremove).toHaveBeenCalledWith("fake", "o2", "f1");
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

            it("verify skipped if not a function", function() {
                var overlayManager = new OverlayManager({}, {});

                var handler = {please: "dont run"};

                overlayManager.bindTreeChangeHandler(handler);
            });
        });

        describe("overlayManager ui functions", function() {
            var overlayManager;
            var adapter;

            beforeEach(function() {
                window.OWF = OWF;
                window.Ozone = Ozone;
                window.Map = Map;

                adapter = new Adapter(new Map());
                overlayManager = adapter.overlayManager;
            });

            afterEach(function() {
                // Remove our mock objects from the window so neither they nor
                // any spies upon them hang around for other test suites.
                delete window.OWF;
                delete window.Ozone;
                delete window.Map;
            });

            it("verify getOverlayTree call returns the expected tree json", function() {
                overlayManager.overlay.createOverlay("FakeWidget", "o1", "on1");
                overlayManager.overlay.createOverlay("FakeWidget", "o2", "on2", "o1");
                overlayManager.feature.plotFeatureUrl("fake2", "o2", "f1", "fn1", "kml", "http://url");

                var tree = overlayManager.getOverlayTree();
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
                overlayManager = adapter.overlayManager;
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

                expect(CommonMapApi.overlay.create.send).toHaveBeenCalledWith({overlayId: "id", name: "name"});
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

            it("verify send overlay update calls api correctly", function() {
                spyOn(CommonMapApi.overlay.update, 'send').andCallThrough();

                overlayManager.sendOverlayUpdate("id", "newName", "newParentId");

                expect(CommonMapApi.overlay.update.send).toHaveBeenCalledWith({overlayId: "id", name: "newName", parentId: "newParentId"});
            });

            it("verify send feature ploturl calls api correctly", function() {
                spyOn(CommonMapApi.feature.plot.url, 'send').andCallThrough();

                overlayManager.sendFeaturePlotUrl("O", "F", "n", "kml", "http://fake.com", null, false);

                expect(CommonMapApi.feature.plot.url.send).toHaveBeenCalledWith({
                    overlayId: "O",
                    featureId: "F",
                    name: "n",
                    format: "kml",
                    url: "http://fake.com",
                    params: null,
                    zoom: false
                });
            });

            it("verify send feature unplot calls api correctly", function() {
                spyOn(CommonMapApi.feature.unplot, 'send').andCallThrough();

                overlayManager.sendFeatureUnplot("O", "F");

                expect(CommonMapApi.feature.unplot.send).toHaveBeenCalledWith({
                    overlayId: "O",
                    featureId: "F"
                });
            });

            it("verify send feature update calls api correctly", function() {
                spyOn(CommonMapApi.feature.update, 'send').andCallThrough();

                overlayManager.sendFeatureUpdate("o", "f", "nn", "no");

                expect(CommonMapApi.feature.update.send).toHaveBeenCalledWith({
                    overlayId: "o",
                    featureId: "f",
                    name: "nn",
                    newOverlayId: "no"
                });
            });

            it("verify send feature update calls api correctly without newOverlayId", function() {
                spyOn(CommonMapApi.feature.update, 'send').andCallThrough();

                overlayManager.sendFeatureUpdate("o", "f", "nn");

                expect(CommonMapApi.feature.update.send).toHaveBeenCalledWith({
                    overlayId: "o",
                    featureId: "f",
                    name: "nn",
                    newOverlayId: null
                });
            });

            it("verify send feature hide calls api correctly", function() {
                spyOn(CommonMapApi.feature.hide, 'send').andCallThrough();

                overlayManager.sendFeatureHide("O", "F");

                expect(CommonMapApi.feature.hide.send).toHaveBeenCalledWith({overlayId: "O", featureId: "F"});
            });

            it("verify send feature show calls api correctly", function() {
                spyOn(CommonMapApi.feature.show, 'send').andCallThrough();

                overlayManager.sendFeatureShow("O", "F");

                expect(CommonMapApi.feature.show.send).toHaveBeenCalledWith({overlayId: "O", featureId: "F", zoom: false});
            });

            it("verify send feature show calls api correctly with zoom", function() {
                spyOn(CommonMapApi.feature.show, 'send').andCallThrough();

                overlayManager.sendFeatureShow("O", "F", true);

                expect(CommonMapApi.feature.show.send).toHaveBeenCalledWith({overlayId: "O", featureId: "F", zoom: true});
            });
        });

        describe("feature handlers", function() {
            var overlayManager;
            var adapter;
            var map;

            beforeEach(function() {
                window.OWF = OWF;
                window.Ozone = Ozone;
                window.Map = Map;

                map = new Map();
                adapter = new Adapter(map);
                overlayManager = adapter.overlayManager;
            });

            afterEach(function() {
                // Remove our mock objects from the window so neither they nor
                // any spies upon them hang around for other test suites.
                delete window.OWF;
                delete window.Ozone;
                delete window.Map;
            });

            xit("verify plot feature with kml string and existing overlay", function() {

            });

            xit("verify plot feature with wms string and existing overlay", function() {

            });

            it("verify plot feature with kml url and existing overlay", function() {
                var overlays = overlayManager.getOverlays();
                overlayManager.overlay.createOverlay("fake", "o", "on");
                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
                expect(Object.keys(overlays["o"].features).length).toBe(0);

                overlayManager.feature.plotFeatureUrl("fake2", "o", "f", "fn", "kml", "http://url");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
                expect(Object.keys(overlays["o"].features).length).toBe(1);

                expect(overlays["o"].features["f"]).toBeDefined();
                expect(overlays["o"].features["f"].esriObject).toBeDefined();
            });

            xit("verify plot feature with wms url and existing overlay", function() {

            });

            it("verify plot kml url with duplicate featureId calls delete first", function() {
                var overlays = overlayManager.getOverlays();
                overlayManager.overlay.createOverlay("fake", "o", "on");
                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
                expect(Object.keys(overlays["o"].features).length).toBe(0);

                overlayManager.feature.plotFeatureUrl("fake2", "o", "f", "fn", "kml", "http://url");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
                expect(Object.keys(overlays["o"].features).length).toBe(1);

                expect(overlays["o"].features["f"]).toBeDefined();
                expect(overlays["o"].features["f"].esriObject).toBeDefined();

                var del = spyOn(overlayManager.feature, 'deleteFeature').andCallThrough();

                overlayManager.feature.plotFeatureUrl("fake2", "o", "f", "fn2", "kml", "http://url2");

                expect(del).toHaveBeenCalledWith("fake2", "o", "f");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
                expect(Object.keys(overlays["o"].features).length).toBe(1);
            });

            it("verify plot url with bad overlay id calls overlay create", function() {
                var overlays = overlayManager.getOverlays();
                var oCreate = spyOn(overlayManager.overlay, "createOverlay").andCallThrough();

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(0);

                overlayManager.feature.plotFeatureUrl("fake2", "o", "f", "fn", "kml", "http://url");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
                expect(Object.keys(overlays["o"].features).length).toBe(1);

                expect(overlays["o"].name).toBe("o");

                expect(overlays["o"].features["f"]).toBeDefined();
                expect(overlays["o"].features["f"].esriObject).toBeDefined();
            });

            it("verify unplot feature with good overlay id and good feature id", function() {
                var overlays = overlayManager.getOverlays();
                overlayManager.overlay.createOverlay("fake", "o", "on");
                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
                expect(Object.keys(overlays["o"].features).length).toBe(0);

                overlayManager.feature.plotFeatureUrl("fake2", "o", "f", "fn", "kml", "http://url");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
                expect(Object.keys(overlays["o"].features).length).toBe(1);

                expect(overlays["o"].features["f"]).toBeDefined();
                expect(overlays["o"].features["f"].esriObject).toBeDefined();

                overlayManager.feature.deleteFeature("fake", "o", "f");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
                expect(Object.keys(overlays["o"].features).length).toBe(0);
                expect(overlays["o"].features["f"]).not.toBeDefined();
            });

            it("verify delete feature with bad overlay id calls error", function() {
                var eventing = OWF.Eventing;
                expect(eventing).not.toBe(null);

                var err = spyOn(eventing, 'publish').andCallThrough();

                overlayManager.feature.deleteFeature("fake", "o", "f");

                var msg = "Overlay could not be found with id o";
                expect(err).toHaveBeenCalledWith("map.error", JSON.stringify({
                    sender: "fake",
                    type: "map.feature.unplot",
                    msg: msg,
                    error: {type: "map.feature.unplot", msg: msg}
                }));
            });

            it("verify delete feature with bad feature id calls error", function() {
                var eventing = OWF.Eventing;
                expect(eventing).not.toBe(null);

                var err = spyOn(eventing, 'publish').andCallThrough();

                var overlays = overlayManager.getOverlays();
                overlayManager.overlay.createOverlay("fake", "o", "on");
                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
                expect(Object.keys(overlays["o"].features).length).toBe(0);

                overlayManager.feature.deleteFeature("fake", "o", "f");

                var msg = "Feature could not be found with id f and overlayId o";
                expect(err).toHaveBeenCalledWith("map.error", JSON.stringify({
                    sender: "fake",
                    type: "map.feature.unplot",
                    msg: msg,
                    error: {type: "map.feature.unplot", msg: msg}
                }));
            });

            it("verify hide feature with good overlay id and good feature id", function() {
                overlayManager.overlay.createOverlay("fake", "o", "on");
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);

                expect(overlays["o"].isHidden).toBe(false);

                overlayManager.feature.plotFeatureUrl("fake2", "o", "f", "fn", "kml", "http://url");

                var hide = spyOn(overlays["o"].features["f"].esriObject, 'hide');

                overlayManager.feature.hideFeature("fake2", "o", "f");

                overlays = overlayManager.getOverlays();
                expect(overlays["o"].isHidden).toBe(false);
                expect(overlays["o"].features["f"].isHidden).toBe(true);
                expect(overlays["o"].features["f"].esriObject.hide).toHaveBeenCalledWith();
            });

            it("verify feature is hidden when parent overlay is hidden", function() {
                overlayManager.overlay.createOverlay("fake", "o", "on");
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);

                expect(overlays["o"].isHidden).toBe(false);

                overlayManager.feature.plotFeatureUrl("fake2", "o", "f", "fn", "kml", "http://url");

                var hide = spyOn(overlays["o"].features["f"].esriObject, 'hide');

                overlayManager.overlay.hideOverlay("fake2", "o");

                overlays = overlayManager.getOverlays();
                expect(overlays["o"].isHidden).toBe(true);
                expect(overlays["o"].features["f"].isHidden).toBe(true);
                expect(overlays["o"].features["f"].esriObject.hide).toHaveBeenCalledWith();
            });

            it("verify feature is hidden multiple overlays deep", function() {
                overlayManager.overlay.createOverlay("fake", "n", "nn");
                overlayManager.overlay.createOverlay("fake", "o", "on", "n");
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(2);

                expect(overlays["o"].isHidden).toBe(false);

                overlayManager.feature.plotFeatureUrl("fake2", "o", "f", "fn", "kml", "http://url");

                var hide = spyOn(overlays["o"].features["f"].esriObject, 'hide');

                overlayManager.overlay.hideOverlay("fake2", "n");

                overlays = overlayManager.getOverlays();
                expect(overlays["n"].isHidden).toBe(true);
                expect(overlays["o"].isHidden).toBe(true);
                expect(overlays["o"].features["f"].isHidden).toBe(true);
                expect(hide).toHaveBeenCalledWith();
            });

            it("verify hide feature with bad overlay id calls error", function() {
                var eventing = OWF.Eventing;
                expect(eventing).not.toBe(null);

                var err = spyOn(eventing, 'publish').andCallThrough();

                overlayManager.feature.hideFeature("fake2", "o", "f");

                var msg = "Overlay could not be found with id o";
                expect(err).toHaveBeenCalledWith("map.error", JSON.stringify({
                    sender: "fake2",
                    type: "map.feature.hide",
                    msg: msg,
                    error: {type: "map.feature.hide", msg: msg}
                }));
            });

            it("verify hide feature with bad feature id calls error", function() {
                var eventing = OWF.Eventing;
                expect(eventing).not.toBe(null);

                var err = spyOn(eventing, 'publish').andCallThrough();

                overlayManager.overlay.createOverlay("fake", "o", "on");

                overlayManager.feature.hideFeature("fake2", "o", "f");

                var msg = "Feature could not be found with id f and overlayId o"
                expect(err).toHaveBeenCalledWith("map.error", JSON.stringify({
                    sender: "fake2",
                    type: "map.feature.hide",
                    msg: msg,
                    error: {type: "map.feature.hide", msg: msg}
                }));
            });

            it("verify show feature with good overlay id and good feature id", function() {
                overlayManager.overlay.createOverlay("fake", "o", "on");
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);

                expect(overlays["o"].isHidden).toBe(false);

                overlayManager.feature.plotFeatureUrl("fake2", "o", "f", "fn", "kml", "http://url");

                var show = spyOn(overlays["o"].features["f"].esriObject, 'show');

                overlayManager.feature.hideFeature("fake2", "o", "f");
                overlayManager.feature.showFeature("fake2", "o", "f");

                overlays = overlayManager.getOverlays();
                expect(overlays["o"].isHidden).toBe(false);
                expect(overlays["o"].features["f"].isHidden).toBe(false);
                expect(show).toHaveBeenCalledWith();
            });

            it("verify show feature with bad overlay id calls error", function() {
                var eventing = OWF.Eventing;
                expect(eventing).not.toBe(null);

                var err = spyOn(eventing, 'publish').andCallThrough();

                overlayManager.feature.showFeature("fake2", "o", "f");

                var msg = "Overlay could not be found with id o";
                expect(err).toHaveBeenCalledWith("map.error", JSON.stringify({
                    sender: "fake2",
                    type: "map.feature.show",
                    msg: msg,
                    error: {type: "map.feature.show", msg: msg}
                }));
            });

            it("verify show feature with bad feature id calls error", function() {
                var eventing = OWF.Eventing;
                expect(eventing).not.toBe(null);

                var err = spyOn(eventing, 'publish').andCallThrough();

                overlayManager.overlay.createOverlay("fake", "o", "on");

                overlayManager.feature.showFeature("fake2", "o", "f");

                var msg = "Feature could not be found with id f and overlayId o";
                expect(err).toHaveBeenCalledWith("map.error", JSON.stringify({
                    sender: "fake2",
                    type: "map.feature.show",
                    msg: msg,
                    error: {type: "map.feature.show", msg: msg}
                }));
            });

            it("verify zoom feature with good overlay id and good feature id", function() {
                var setExtent = spyOn(map, 'setExtent');

                overlayManager.overlay.createOverlay("fake", "o", "on");
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);

                overlayManager.feature.plotFeatureUrl("fake2", "o", "f", "fn", "kml", "http://url");

                overlayManager.feature.zoom("fake", "o", "f", null, null, "auto");

                expect(setExtent).toHaveBeenCalled();
            });

            it("verify zoom feature with bad overlay id calls error", function() {
                var eventing = OWF.Eventing;
                expect(eventing).not.toBe(null);

                var err = spyOn(eventing, 'publish').andCallThrough();

                overlayManager.feature.zoom("fake", "o", "f", null, null, "auto");

                var msg = "Overlay could not be found with id o";
                expect(err).toHaveBeenCalledWith("map.error", JSON.stringify({
                    sender: "fake",
                    type: "map.feature.zoom",
                    msg: msg,
                    error: {type: "map.feature.zoom", msg: msg}
                }));
            });

            it("verify zoom feature with bad feature id calls error", function() {
                var eventing = OWF.Eventing;
                expect(eventing).not.toBe(null);

                var err = spyOn(eventing, 'publish').andCallThrough();

                overlayManager.overlay.createOverlay("fake", "o", "on");
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);

                overlayManager.feature.plotFeatureUrl("fake2", "o", "f", "fn", "kml", "http://url");

                overlayManager.feature.zoom("fake", "o", "notf", null, null, "auto");

                var msg = "Feature could not be found with id notf and overlayId o";
                expect(err).toHaveBeenCalledWith("map.error", JSON.stringify({
                    sender: "fake",
                    type: "map.feature.zoom",
                    msg: msg,
                    error: {type: "map.feature.zoom", msg: msg}
                }));
            });

            it("verify update feature with good overlay id and good feature id", function() {
                overlayManager.overlay.createOverlay("fake", "o", "on");
                overlayManager.overlay.createOverlay("fake", "no", "non");
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(2);

                overlayManager.feature.plotFeatureUrl("fake", "o", "f", "fn", "kml", "http://url");

                overlayManager.feature.updateFeature("fake2", "o", "f", "nn", "no")

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays["o"].features).length).toBe(0);
                expect(Object.keys(overlays["no"].features).length).toBe(1);
                expect(overlays["no"].features["f"].name).toBe("nn");
            });

            it("verify update feature with bad overlay id calls error", function() {
                var eventing = OWF.Eventing;
                expect(eventing).not.toBe(null);

                var err = spyOn(eventing, 'publish').andCallThrough();

                overlayManager.feature.updateFeature("fake", "o", "f", "nn", "no");

                var msg = "Feature could not be found with id f and overlayId o";
                expect(err).toHaveBeenCalledWith("map.error", JSON.stringify({
                    sender: "fake",
                    type: "map.feature.update",
                    msg: msg,
                    error: {type: "map.feature.update", msg: msg}
                }));
            });

            it("verify update feature with bad feature id calls error", function() {
                var eventing = OWF.Eventing;
                expect(eventing).not.toBe(null);

                var err = spyOn(eventing, 'publish').andCallThrough();

                overlayManager.overlay.createOverlay("fake", "o", "on");
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);

                overlayManager.feature.plotFeatureUrl("fake2", "o", "f", "fn", "kml", "http://url");

                overlayManager.feature.updateFeature("fake", "o", "notf", "nn", "no");

                var msg = "Feature could not be found with id notf and overlayId o";
                expect(err).toHaveBeenCalledWith("map.error", JSON.stringify({
                    sender: "fake",
                    type: "map.feature.update",
                    msg: msg,
                    error: {type: "map.feature.update", msg: msg}
                }));
            });

            it("verify update feature with bad new overlay id", function() {
                var eventing = OWF.Eventing;
                expect(eventing).not.toBe(null);

                var err = spyOn(eventing, 'publish').andCallThrough();

                overlayManager.overlay.createOverlay("fake", "o", "on");
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);

                overlayManager.feature.plotFeatureUrl("fake2", "o", "f", "fn", "kml", "http://url");

                overlayManager.feature.updateFeature("fake", "o", "f", "nn", "no");

                var msg = "Could not find overlay with id no";
                expect(err).toHaveBeenCalledWith("map.error", JSON.stringify({
                    sender: "fake",
                    type: "map.feature.update",
                    msg: msg,
                    error: {type: "map.feature.update", msg: msg}
                }));
            });

            it("verify update feature with new overlay hidden", function() {
                overlayManager.overlay.createOverlay("fake", "o", "on");
                overlayManager.overlay.createOverlay("fake", "no", "non");
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(2);

                overlayManager.feature.plotFeatureUrl("fake", "o", "f", "fn", "kml", "http://url");
                overlayManager.overlay.hideOverlay("fake3", "no");

                overlays = overlayManager.getOverlays();
                expect(overlays["o"].features["f"].isHidden).toBe(false);
                expect(overlays["no"].isHidden).toBe(true);

                overlayManager.feature.updateFeature("fake2", "o", "f", "nn", "no");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays["o"].features).length).toBe(0);
                expect(Object.keys(overlays["no"].features).length).toBe(1);
                expect(overlays["no"].features["f"].name).toBe("nn");
                expect(overlays["no"].features["f"].isHidden).toBe(true);
            });

            it("verify update feature name", function() {
                overlayManager.overlay.createOverlay("fake", "o", "on");
                overlayManager.overlay.createOverlay("fake", "no", "non");
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(2);

                overlayManager.feature.plotFeatureUrl("fake", "o", "f", "fn", "kml", "http://url");
                overlayManager.overlay.hideOverlay("fake3", "no");

                overlays = overlayManager.getOverlays();
                expect(overlays["o"].features["f"].isHidden).toBe(false);
                expect(overlays["no"].isHidden).toBe(true);

                overlayManager.feature.updateFeature("fake", "o", "f", "nn");

                overlays = overlayManager.getOverlays();
                expect(overlays["o"].features["f"].name).toBe("nn");
            });

            it('verify plot marker and zoom', function() {
                var marker = {
                    iconUrl: 'http://icon',
                    details: 'this is a test marker',
                    latlong: {
                        lat: 39.575759137747426,
                        long: -79.1550500546856
                    }
                }
                overlayManager.feature.plotMarker('fake', 'o', 'f', 'fn', marker, true);
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
                expect(overlays["o"].features["f"].name).toBe("fn");

            });

             it('verify plot marker  then verify marker is updated', function() {
                var marker = {
                    iconUrl: 'http://icon',
                    details: 'this is a test marker',
                    latlong: {
                        lat: 39.575759137747426,
                        long: -79.1550500546856
                    }
                }
                overlayManager.feature.plotMarker('fake', 'o', 'f', 'fn', marker);
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
                expect(overlays["o"].features["f"].name).toBe("fn");
                overlayManager.feature.plotMarker('fake', 'o', 'f', 'updatedName', marker);
                expect(overlays["o"].features["f"].name).toBe("updatedName");
                expect(Object.keys(overlays).length).toBe(1);
            });

             it('verify default icon is used when no icon is specified in the marker', function() {
                var marker = {
                    details: 'this is a test marker',
                    latlong: {
                        lat: 39.575759137747426,
                        long: -79.1550500546856
                    }
                }
                overlayManager.feature.plotMarker('fake', 'o', 'f', 'fn', marker);
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
                expect(overlays["o"].features["f"].name).toBe("fn");
            });

             it('verify add multiple markers to one overlay', function() {
                var marker = {
                    details: 'this is a test marker',
                    latlong: {
                        lat: 39.575759137747426,
                        long: -79.1550500546856
                    }
                }

                var marker2 = {
                    details: 'this is a test marker2',
                    latlong: {
                        lat: 38.575759137747426,
                        long: -79.1550500546856
                    }
                }
                overlayManager.feature.plotMarker('fake', 'o', 'f', 'fn', marker);
                overlayManager.feature.plotMarker('fake', 'o', 'f2', 'marker 2', marker2);
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
                 expect(Object.keys(overlays["o"].features).length).toBe(2);
                expect(overlays["o"].features["f"].name).toBe("fn");
                expect(overlays["o"].features["f2"].name).toBe("marker 2");
            });

             it('verify add multiple markers and create mutiple overlays', function() {
                var marker = {
                    details: 'this is a test marker',
                    latlong: {
                        lat: 39.575759137747426,
                        long: -79.1550500546856
                    }
                }

                var marker2 = {
                    details: 'this is a test marker2',
                    latlong: {
                        lat: 38.575759137747426,
                        long: -79.1550500546856
                    }
                }
                overlayManager.feature.plotMarker('fake', 'o', 'f', 'fn', marker);
                overlayManager.feature.plotMarker('fake', 'o1', 'f2', 'marker 2', marker2);
                var overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(2);
                expect(Object.keys(overlays["o"].features).length).toBe(1);
                expect(Object.keys(overlays["o1"].features).length).toBe(1);
                expect(overlays["o"].features["f"].name).toBe("fn");
                expect(overlays["o1"].features["f2"].name).toBe("marker 2");
            });

        });
    });
});

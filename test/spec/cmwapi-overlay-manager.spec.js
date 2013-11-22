define(["cmwapi/cmwapi", "cmwapi-adapter", "cmwapi-overlay-manager"], function(CommonMapApi, Adapter, OverlayManager) {

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

                overlayManager.createOverlay("FakeWidget", "1111", "Name 1");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
            });

            it("verify the overlay create of two, one with parent", function() {
                var overlays = overlayManager.getOverlays();

                expect(Object.keys(overlays).length).toBe(0);

                overlayManager.createOverlay("FakeWidget", "1111", "Name 1");

                overlays = overlayManager.getOverlays();

                expect(Object.keys(overlays).length).toBe(1);
                expect(overlays['1111']).toBeDefined();
                expect(overlays['1111'].children).toBeDefined();
                expect(Object.keys(overlays["1111"].children).length).toBe(0)

                overlayManager.createOverlay("FakeWidget 1", "2222", "Name 2", "1111");
                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(2);
                expect(overlays['1111']).toBeDefined();
                expect(overlays['1111'].children).toBeDefined();
                expect(Object.keys(overlays["1111"].children).length).toBe(1)
                expect(overlays["1111"].children["2222"]).toBeDefined();
            });

            it("verify overlay create with duplicate id", function() {

            });

            it("verify overlay remove of one", function() {
                var overlays = overlayManager.getOverlays();

                expect(Object.keys(overlays).length).toBe(0);

                overlayManager.createOverlay("fake widget", "1111", "Name 1");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);

                overlayManager.removeOverlay("FakeWidget2", "1111")
                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(0);
            });

            it("verify overlay remove of one and resolve parent child pointers", function() {
                var overlays = overlayManager.getOverlays();

                expect(Object.keys(overlays).length).toBe(0);

                overlayManager.createOverlay("fake widget", "1111", "Name 1");
                overlayManager.createOverlay("fake widget", "2222", "Name 1", "1111");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(2);

                overlayManager.removeOverlay("Fake widget2", "2222");

                overlays = overlayManager.getOverlays();
                expect(overlays["2222"]).not.toBeDefined();
                expect(overlays["1111"].children["2222"]).not.toBeDefined();
            });

            it("verify overlay remove of one and child", function() {
                var overlays = overlayManager.getOverlays();

                expect(Object.keys(overlays).length).toBe(0);

                overlayManager.createOverlay("fake widget", "1111", "Name 1");
                overlayManager.createOverlay("fake widget", "2222", "Name 1", "1111");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(2);

                overlayManager.removeOverlay("FakeWidget2", "1111");

                overlays = overlayManager.getOverlays();
                expect(overlays["1111"]).not.toBeDefined();
                expect(overlays["2222"]).not.toBeDefined();
            });

            it("verify overlay hide with invalid id calls error", function() {

            });

            it("verify overlay hide with valid id", function() {

            });
        });
    });
});

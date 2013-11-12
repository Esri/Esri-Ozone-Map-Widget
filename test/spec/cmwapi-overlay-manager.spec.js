define(["cmwapi", "cmwapi-adapter", "cmwapi-overlay-manager"], function(CommonMapApi, Adapter, OverlayManager) {

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

                overlayManager.createOverlay("1111", "Name 1");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
            });

            it("verify the overlay create two, one with parent", function() {
                var overlays = overlayManager.getOverlays();

                expect(Object.keys(overlays).length).toBe(0);

                overlayManager.createOverlay("1111", "Name 1");

                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(1);
                expect(overlays["1111"].children.length).toBe(0)

                overlayManager.createOverlay("2222", "Name 2", "1111");
                overlays = overlayManager.getOverlays();
                expect(Object.keys(overlays).length).toBe(2);
                expect(overlays["1111"].children.length).toBe(1);
            });
        })
    });


});
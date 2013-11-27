define(["cmwapi/cmwapi", "cmwapi-adapter/cmwapi-adapter",  "test/mock/esriMap", "test/mock/OWF", "test/mock/Ozone"],
        function(CommonMapApi, Adapter,  Map, OWF, Ozone) {

    describe("To test ESRI Common Map API adapter", function() {

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
            delete window.statusHandler;
            delete window.errorHandler;
        });

        it("test syntax in adapter module definition", function() {
            // Verify the module can be initialized without errors
            var map = new Map();

            var instance = new Adapter(map);
        });

        it("test that overlay adapter dependency is brought in", function() {
            var map = new Map();
            var adapter = new Adapter(map);

            expect(adapter.overlay).toBeDefined();
            expect(adapter.overlay.handleCreate).toBeDefined();
            expect(adapter.overlay.handleRemove).toBeDefined();
            expect(adapter.overlay.handleHide).toBeDefined();
            expect(adapter.overlay.handleShow).toBeDefined();
            expect(adapter.overlay.handleUpdate).toBeDefined();
        });

        it("test that feature adapter dependency is brought in", function() {
            var map = new Map();
            var adapter = new Adapter(map);

            expect(adapter.feature).toBeDefined();

            expect(adapter.feature.handlePlot).toBeDefined();
            expect(adapter.feature.handlePlotUrl).toBeDefined();
            expect(adapter.feature.handleUnplot).toBeDefined();
            expect(adapter.feature.handleHide).toBeDefined();
            expect(adapter.feature.handleShow).toBeDefined();
            expect(adapter.feature.handleSelected).toBeDefined();
            expect(adapter.feature.handleUpdate).toBeDefined();
        });

        it("test that status adapter dependency is brought in", function() {
            var map = new Map();
            var instance = new Adapter(map);

            expect(instance.status).toBeDefined();
            expect(instance.status.handleRequest).toBeDefined();
            //cant check that the handler was bound because the adapter was required at the top --
            //check this in the individual file spec
        });

        it("test that error adapter dependency is brought in", function() {
            var map = new Map();
            var adapter = new Adapter(map);

            expect(adapter.error).toBeDefined();
            expect(adapter.error.error).toBeDefined();
            expect(adapter.error.handleError).toBeDefined();
        });
    });
});

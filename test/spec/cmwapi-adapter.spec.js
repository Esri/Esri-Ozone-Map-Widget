define(["cmwapi", "cmwapi-adapter"], function(CommonMapApi, Adapter) {
    describe("ESRI Common Map API adapter", function() {
        var validBounds, validCenter, validRange;

        beforeEach(function() {
            // Mock the necessary OWF methods and attach them to the window.
            // OWF should be in global scope when other libraries attempt to
            // access it.
            var OWF = {
                Eventing : {
                    publish : function() {

                    },
                    subscribe : function() {

                    }
                }
            };
            var Ozone = {
                util: {
                    toString : function() {
                    },
                    parseJson : function() {}
                }
            };

            var errorHandler = CommonMapApi.error;
            var statusHandler = CommonMapApi.status;

            window.OWF = OWF;
            window.Ozone = Ozone;

            window.statusHandler = statusHandler;
            window.errorHandler = errorHandler;

            requestor = 'requestor';
            validBounds = { southWest: { lat: 1, lon: 1}, northEast: {lat: 1, lon: 1}};
            validRange = 22;        invalidRange = -22;
            validCenter = { lat: 1, lon: 1};

            // TODO: Mock Esri Map object
        });

        afterEach(function() {
            // Remove our mock objects from the window so neither they nor
            // any spies upon them hang around for other test suites.
            delete window.OWF;
            delete window.Ozone;

            delete window.statusHandler;
            delete window.errorHandler;
        });

        it("Testing syntax in adapter module definition", function() {
            // Verify the module can be initialized without errors
            var instance = new Adapter({} /* TODO: Mock Map object*/);
        });

        // TODO: Create more (and better) tests
    });
});

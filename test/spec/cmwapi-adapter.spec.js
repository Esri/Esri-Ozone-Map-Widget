define(["cmwapi", "cmwapi-adapter"], function(CommonMapApi, Adapter) {

    describe("ESRI Common Map API adapter", function() {

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

            // TODO: Mock Esri Map object
            var Map = function() {
                this.geographicExtent= {
                    xmin: 0,
                    ymin: 0,
                    xmax: 0,
                    ymax: 0,
                    getCenter: function() {
                        return {x: 0, y: 0};
                    }
                };
            };
            window.Map = Map;
        });

        afterEach(function() {
            // Remove our mock objects from the window so neither they nor
            // any spies upon them hang around for other test suites.
            delete window.OWF;
            delete window.Ozone;

            delete window.statusHandler;
            delete window.errorHandler;

            delete window.Map;
        });

        it("Testing syntax in adapter module definition", function() {
            // Verify the module can be initialized without errors
            var map = new Map();

            var instance = new Adapter(map);
        });

        // TODO: Create more (and better) tests

    });
});

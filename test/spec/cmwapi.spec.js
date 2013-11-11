define(["cmwapi/cmwapi"], function(Map) {

    /**
     * Most of the functional tests have been pushed down into the various modules that create the
     * CMWAPI 1.1 implementation.  This top level file presently serves as an example
     * of how to setup tests for a module and mock the OWF framework.
     */
    describe("Common Map API tests", function() {

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
                },
                getInstanceId : function() {
                    return -1;
                }
            };
            var Ozone = {
                util: {
                    toString : function() {
                    },
                    parseJson : function() {}
                }
            };

            var errorHandler = Map.error;
            var statusHandler = Map.status;

            window.OWF = OWF;
            window.Ozone = Ozone;

            window.statusHandler = statusHandler;
            window.errorHandler = errorHandler;
        });

        afterEach(function() {
            // Remove our mock objects from the window so neither they nor
            // any spies upon them hang around for other test suites.
            delete window.OWF;
            delete window.Ozone;

            delete window.statusHandler;
            delete window.errorHandler;
        });

        describe("A suite", function() {

            it("contains spec with an expectation", function() {
                expect(true).toBe(true);
            });

            var statusHandler = Map.status;
            it("Map.status is not null", function() {
                expect(statusHandler).not.toBe(null);
            });
        });

    });
});

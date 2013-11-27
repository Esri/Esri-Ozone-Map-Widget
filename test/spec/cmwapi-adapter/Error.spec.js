define(["cmwapi/cmwapi", "cmwapi-adapter/Error", "test/mock/esriMap", "test/mock/OWF", "test/mock/Ozone"],
        function(CommonMapApi, Error, Map, OWF, Ozone) {
     describe("To test the CMWAPI Adapter error module", function() {
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

        it("verify that the error module object can be created without error", function() {
            var error = new Error();
            expect(error).toBeDefined();
        });

        describe("and verify that proper api calls are used", function() {
            beforeEach(function() {
                spyOn(CommonMapApi.error, 'addHandler').andCallThrough();
                spyOn(CommonMapApi.error, 'send').andCallThrough();
            });

            it("verify that the handler is added to the channel", function() {
                expect(CommonMapApi.error.addHandler).not.toHaveBeenCalled();

                var error = new Error();

                expect(CommonMapApi.error.addHandler).toHaveBeenCalled();
            });

            it("verify that the proper call is made by the error function", function() {
                expect(CommonMapApi.error.send).not.toHaveBeenCalled();

                var error = new Error();

                expect(CommonMapApi.error.send).not.toHaveBeenCalled();

                var caller = "FakeWidget";
                var message = "Test error message";
                var type = "test_error_type";
                var err = {
                    message: message,
                    type: type
                };

                error.error(caller, message, err);

                expect(CommonMapApi.error.send).toHaveBeenCalledWith(caller, type, message, err);
            });
        });
    });
});
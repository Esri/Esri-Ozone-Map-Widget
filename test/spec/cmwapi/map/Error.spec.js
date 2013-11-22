define(["cmwapi/Channels", "cmwapi/map/Error", "test/mock/OWF", "test/mock/Ozone"], 
    function(Channels, Error, OWF, Ozone) {

    describe("The Error Module ", function() {

        beforeEach(function() {
            // Mock the necessary OWF methods and attach them to the window.
            // OWF should be in global scope when other libraries attempt to
            // access it.
            window.OWF = OWF;
            window.Ozone = Ozone;
        });

        afterEach(function() {
            // Remove our mock objects from the window so neither they nor
            // any spies upon them hang around for other test suites.
            delete window.OWF;
            delete window.Ozone;
        });


        it("registers on the appropriate channel", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(Error, 'addHandler').andCallThrough();
            spyOn(eventing, 'subscribe');

            Error.addHandler(function() {});
            expect(Error.addHandler).toHaveBeenCalled();
            expect(eventing.subscribe).toHaveBeenCalled();

        });

    });
});

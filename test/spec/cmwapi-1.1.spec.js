
describe("A suite", function() {


    it("contains spec with an expectation", function() {
        expect(true).toBe(true);
    });

    var statusHandler = Map.status;
    it("Map.status is not null", function() {
        expect(statusHandler).not.toBe(null);
    });


});

describe("Spying on behavior", function() {


    beforeEach(function() {
        // Mock the necessary OWF methods and attach them to the window.  OWF should be in global
        // scope when other libraries attempt to access it.
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
                }
            }
        };

        window.OWF = OWF;
        window.Ozone = Ozone;
    });

    afterEach(function() {
        // Remove our mock objects from the window so neither they nor any spies upon them
        // hang around for other test suites.
        delete window.OWF;
        delete window.Ozone;
    });


    // Not currently working, as OWF.Eventing.publish barfs in request....
    it("Map.status.request gets called", function() {
       var eventing = OWF.Eventing;
       expect(eventing).not.toBe(null);

       var statusHandler = Map.status;
       spyOn(statusHandler, 'request').andCallThrough();
       spyOn(eventing, 'publish');

       statusHandler.request();
       expect(statusHandler.request).toHaveBeenCalled();

       // expect publish to be called
       expect(eventing.publish).toHaveBeenCalled();

       // don't expect error to be called
    });

    // Not currently working, as OWF.Eventing.publish barfs in request....
    it("Map.status.request gets called with wrong types", function() {
        var statusHandler = Map.status;
        spyOn(statusHandler, 'request').andCallThrough();
        statusHandler.request(['foo']);
        expect(statusHandler.request).toHaveBeenCalled();

        // expect error to be called...

        // publish will be called, as now we're calling the error channel for issues


    });

});


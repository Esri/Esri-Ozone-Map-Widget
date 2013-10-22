

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

    var OWF = null;

    // attempt to set up OWF eventing correctly - not quite working
    beforeEach(function() {
        OWF = {
            Eventing : {
                publish : function() {

                },
                subscribe : function() {

                }
        }
        };
    })


    // Not currently working, as OWF.Eventing.publish barfs in request....
    xit("Map.status.request gets called", function() {
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
    })

    // Not currently working, as OWF.Eventing.publish barfs in request....
    xit("Map.status.request gets called with wrong types", function() {
        var statusHandler = Map.status;
        spyOn(statusHandler, 'request').andCallThrough();
        statusHandler.request(['foo']);
        expect(statusHandler.request).toHaveBeenCalled();

        // expect error to be called...

        // publish will be called, as now we're calling the error channel for issues


    })

});



/*
describe('Map.status', function() {

    var statusHandler = Map.status;
    spyOn(statusHandler, "request");
    statusHandler.request();

    it("verifies that request was called", function() {
       expect(statusHandler.request).toHaveBeenCalled();
    });
});
*/

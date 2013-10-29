
xdescribe("A suite", function() {


    it("contains spec with an expectation", function() {
        expect(true).toBe(true);
    });

    var statusHandler = Map.status;
    it("Map.status is not null", function() {
        expect(statusHandler).not.toBe(null);
    });


});

xdescribe("Map.status.request calls and handlers", function() {


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
        // Remove our mock objects from the window so neither they nor any spies upon them
        // hang around for other test suites.
        delete window.OWF;
        delete window.Ozone;

        delete window.statusHandler;
        delete window.errorHandler;

    });


    it("Map.status.request gets called", function() {
       var eventing = OWF.Eventing;
       expect(eventing).not.toBe(null);

       //var statusHandler = Map.status;
       //var errorHandler = Map.error;
       spyOn(statusHandler, 'request').andCallThrough();
       spyOn(eventing, 'publish');
       spyOn(errorHandler, 'error');

       statusHandler.request();
       expect(statusHandler.request).toHaveBeenCalled();

       // expect publish to be called
       expect(eventing.publish).toHaveBeenCalled();

       // don't expect error to be called
       expect(errorHandler.error.calls.length).toEqual(0);
    });

    it("Map.status.request gets called with wrong types", function() {
        //var statusHandler = Map.status;
        var eventing = OWF.Eventing;
        spyOn(eventing, 'publish');

        spyOn(statusHandler, 'request').andCallThrough();
        spyOn(errorHandler, 'error').andCallThrough();

        statusHandler.request(['foo']);

        expect(statusHandler.request).toHaveBeenCalled();
        expect(statusHandler.request.mostRecentCall.args[0]).toEqual(['foo']);

        // expect error to be called...
        expect(errorHandler.error).toHaveBeenCalled();

        // publish will be called, as now we're calling the error channel for issues
        //  note that this only happens if we 'callThrough' on errorHandler
        expect(eventing.publish.mostRecentCall.args[0]).toEqual("map.error");


    });

    it("Testing handler for map.status.request message when given invalid type", function() {

        var eventing = OWF.Eventing;
        spyOn(eventing, 'subscribe');

        var testHandler = jasmine.createSpy('testHandler');
        var newHandler = statusHandler.handleRequest(testHandler);
        expect(eventing.subscribe.mostRecentCall.args[0]).toEqual('map.status.request');

        // This won't actually get called: remember, asynchronous eventing: I'm still waiting for a publish
        //expect(testHandler).toHaveBeenCalled();

        // But I can test the behavior for newHandler!
        var returnVal = { types: ['foo']};
        spyOn(Ozone.util, 'parseJson').andReturn(returnVal);
        spyOn(errorHandler, 'error');

        newHandler('senderFoo', { types: ['foo']});
        expect(errorHandler.error).toHaveBeenCalled();

        // DON'T expect testHandler to have been called!
        expect(testHandler.calls.length).toEqual(0);

    });

    it("Testing handler for map.status.request message when given valid type", function() {

        var eventing = OWF.Eventing;
        spyOn(eventing, 'subscribe');

        var testHandler = jasmine.createSpy('testHandler');
        var newHandler = statusHandler.handleRequest(testHandler);
        expect(eventing.subscribe.mostRecentCall.args[0]).toEqual('map.status.request');

        // This won't actually get called: remember, asynchronous eventing: I'm still waiting for a publish
        //expect(testHandler).toHaveBeenCalled();

        // But I can test the behavior for newHandler!
        var jsonVal = { types: ['view']};
        spyOn(Ozone.util, 'parseJson').andReturn(jsonVal);
        spyOn(errorHandler, 'error');

        newHandler('senderFoo', jsonVal);   // cheating: since I know I'm going to parse it anyway
        // don't expect error to be called
        expect(errorHandler.error.calls.length).toEqual(0);

        // Now DO expect testHandler to have been called!
        expect(testHandler.calls.length).toEqual(1);
        expect(testHandler.mostRecentCall.args[1]).toEqual(['view']);
    });

    it("Testing handler for map.status.request message when given no types", function() {

        var eventing = OWF.Eventing;
        spyOn(eventing, 'subscribe');

        var testHandler = jasmine.createSpy('testHandler');
        var newHandler = statusHandler.handleRequest(testHandler);
        expect(eventing.subscribe.mostRecentCall.args[0]).toEqual('map.status.request');

        // This won't actually get called: remember, asynchronous eventing: I'm still waiting for a publish
        //expect(testHandler).toHaveBeenCalled();

        // But I can test the behavior for newHandler!
        var jsonVal = { };
        spyOn(Ozone.util, 'parseJson').andReturn(jsonVal);
        spyOn(errorHandler, 'error');

        newHandler('senderFoo', jsonVal );
        // don't expect error to be called
        expect(errorHandler.error.calls.length).toEqual(0);

        // Now DO expect testHandler to have been called!
        expect(testHandler.calls.length).toEqual(1);
        expect(testHandler.mostRecentCall.args[1]).toEqual(Map.status.SUPPORTED_STATUS_TYPES);
    });

});

describe("Map.status.view calls and handlers", function() {

    var validBounds, validCenter, validRange;

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

        requestor = 'requestor';
        validBounds = { southWest: { lat: 1, lon: 1}, northEast: {lat: 1, lon: 1}};
        validRange = 22;        invalidRange = -22;
        validCenter = { lat: 1, lon: 1};
    });

    afterEach(function() {
        // Remove our mock objects from the window so neither they nor any spies upon them
        // hang around for other test suites.
        delete window.OWF;
        delete window.Ozone;

        delete window.statusHandler;
        delete window.errorHandler;
    });

    it("Testing map.status.view send message: valid data with optional requester", function() {

        spyOn(statusHandler, 'view').andCallThrough();
        spyOn(errorHandler, 'error');
        var eventing = OWF.Eventing;
        spyOn(eventing, 'publish');

        statusHandler.view(requestor, validBounds, validCenter, validRange);
        expect(statusHandler.view).toHaveBeenCalled();
        expect(eventing.publish.mostRecentCall.args[0]).toEqual('map.status.view');

    });

    it("Testing invalid centers", function() {
        var invalidCenter1 = { lat: 1 }, invalidCenter2 = { lon: 1}, invalidCenter3 = {foo: 1, bar: 1};

        spyOn(statusHandler, 'view').andCallThrough();
        spyOn(errorHandler, 'error');
        var eventing = OWF.Eventing;
        spyOn(eventing, 'publish');

        statusHandler.view(requestor, validBounds, invalidCenter1, validRange);
        expect(statusHandler.view).toHaveBeenCalled();
        expect(errorHandler.error).toHaveBeenCalled();
        expect(eventing.publish.calls.length).toEqual(0);

        statusHandler.view(requestor, validBounds, invalidCenter2, validRange);
        expect(statusHandler.view).toHaveBeenCalled();
        expect(errorHandler.error).toHaveBeenCalled();
        expect(eventing.publish.calls.length).toEqual(0);

        statusHandler.view(requestor, validBounds, invalidCenter3, validRange);
        expect(statusHandler.view).toHaveBeenCalled();
        expect(errorHandler.error).toHaveBeenCalled();
        expect(eventing.publish.calls.length).toEqual(0);

        statusHandler.view(requestor, validBounds, null, validRange);
        expect(statusHandler.view).toHaveBeenCalled();
        expect(errorHandler.error).toHaveBeenCalled();
        expect(eventing.publish.calls.length).toEqual(0);

    });

    it("Testing invalid bounds", function() {
        var invalidBounds1 = { southWest: {lat: 1, lon: 1} },
            invalidBounds2 = { northEast: {lat: 1, lon: 1} },
            invalidBounds3 = { southWest : {foo: 1, bar: 1}, northEast: {foo: 1, bar: 1}};

        spyOn(statusHandler, 'view').andCallThrough();
        spyOn(errorHandler, 'error');
        var eventing = OWF.Eventing;
        spyOn(eventing, 'publish');

        statusHandler.view(requestor, invalidBounds1, validCenter, validRange);
        expect(statusHandler.view).toHaveBeenCalled();
        expect(errorHandler.error).toHaveBeenCalled();
        expect(eventing.publish.calls.length).toEqual(0);

        statusHandler.view(requestor, invalidBounds2, validCenter, validRange);
        expect(statusHandler.view).toHaveBeenCalled();
        expect(errorHandler.error).toHaveBeenCalled();
        expect(eventing.publish.calls.length).toEqual(0);

        statusHandler.view(requestor, invalidBounds3, validCenter, validRange);
        expect(statusHandler.view).toHaveBeenCalled();
        expect(errorHandler.error).toHaveBeenCalled();
        expect(eventing.publish.calls.length).toEqual(0);

        statusHandler.view(requestor, null, validCenter, validRange);
        expect(statusHandler.view).toHaveBeenCalled();
        expect(errorHandler.error).toHaveBeenCalled();
        expect(eventing.publish.calls.length).toEqual(0);

    });

    it("Testing invalid range", function() {
        var invalidRange1 = 'beta',
            invalidRange2 = -124,
            invalidRange3 = 0;

        spyOn(statusHandler, 'view').andCallThrough();
        spyOn(errorHandler, 'error');
        var eventing = OWF.Eventing;
        spyOn(eventing, 'publish');

        statusHandler.view(requestor, validBounds, validCenter, invalidRange1);
        expect(statusHandler.view).toHaveBeenCalled();
        expect(errorHandler.error).toHaveBeenCalled();
        expect(eventing.publish.calls.length).toEqual(0);

        statusHandler.view(requestor, validBounds, validCenter, invalidRange2);
        expect(statusHandler.view).toHaveBeenCalled();
        expect(errorHandler.error).toHaveBeenCalled();
        expect(eventing.publish.calls.length).toEqual(0);

        statusHandler.view(requestor, validBounds, validCenter, invalidRange3);
        expect(statusHandler.view).toHaveBeenCalled();
        expect(errorHandler.error).toHaveBeenCalled();
        expect(eventing.publish.calls.length).toEqual(0);

        statusHandler.view(requestor, validBounds, validCenter, null);
        expect(statusHandler.view).toHaveBeenCalled();
        expect(errorHandler.error).toHaveBeenCalled();
        expect(eventing.publish.calls.length).toEqual(0);

    });

    it("Testing multiple invalids for map.status.view", function () {
        var invalidBounds1 = { southWest: {lat: 1, lon: 1} },
            invalidRange1 = 'beta';

        spyOn(statusHandler, 'view').andCallThrough();
        spyOn(errorHandler, 'error');
        var eventing = OWF.Eventing;
        spyOn(eventing, 'publish');

        statusHandler.view(requestor, invalidBounds1, validCenter, invalidRange1);
        expect(statusHandler.view).toHaveBeenCalled();
        expect(errorHandler.error.mostRecentCall.args[3]).toContain('Range');
        expect(errorHandler.error.mostRecentCall.args[3]).toContain('Bounds');
        expect(errorHandler.error.mostRecentCall.args[3]).not.toContain('Center');
        expect(eventing.publish.calls.length).toEqual(0);

    });

    it("Testing map.status.view handler", function() {
        var eventing = OWF.Eventing;
        spyOn(eventing, 'subscribe');

        var testHandler = jasmine.createSpy('testHandler');
        var newHandler = statusHandler.handleView(testHandler);
        expect(eventing.subscribe.mostRecentCall.args[0]).toEqual('map.status.view');

        // This won't actually get called: remember, asynchronous eventing: I'm still waiting for a publish
        //expect(testHandler).toHaveBeenCalled();

        // But I can test the behavior for newHandler!
        var jsonVal = { requester: '',
            bounds: validBounds,
            range: validRange,
            center: validCenter };
        spyOn(Ozone.util, 'parseJson').andReturn(jsonVal);
        spyOn(errorHandler, 'error');

        newHandler('senderFoo', jsonVal );
        // don't expect error to be called
        expect(errorHandler.error.calls.length).toEqual(0);

        // Now DO expect testHandler to have been called!
        expect(testHandler.calls.length).toEqual(1);
        //expect(testHandler.mostRecentCall.args[1]).toEqual(Map.status.SUPPORTED_STATUS_TYPES);

    });

});

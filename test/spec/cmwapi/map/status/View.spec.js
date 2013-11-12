define(["cmwapi/Channels", "cmwapi/map/status/View", "cmwapi/map/Error", "cmwapi/Validator"], 
    function(Channels, View, Error, Validator) {

    describe("Map.status.view calls and handlers", function() {

        var validBounds, validCenter, validRange;

        beforeEach(function() {
            requestor = 'requestor';
            validBounds = { southWest: { lat: 1, lon: 1}, northEast: {lat: 1, lon: 1}};
            validRange = 22;        invalidRange = -22;
            validCenter = { lat: 1, lon: 1};

            // Mock the necessary OWF methods and attach them to the window.
            // OWF should be in global scope when other libraries attempt to
            // access it.
            var OWF = {
                Eventing : {
                    publish : function() {

                    },
                    subscribe : function() {

                    },
                    unsubscribe : function() {

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

            window.OWF = OWF;
            window.Ozone = Ozone;
        });

        afterEach(function() {
            // Remove our mock objects from the window so neither they nor
            // any spies upon them hang around for other test suites.
            delete window.OWF;
            delete window.Ozone;
        });

        it("Testing map.status.view send message: valid data with optional requester", function() {

            spyOn(View, 'send').andCallThrough();
            spyOn(Error, 'send');
            var eventing = OWF.Eventing;
            spyOn(eventing, 'publish');

            View.send(requestor, validBounds, validCenter, validRange);
            expect(View.send).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_STATUS_VIEW);

        });

        it("Unsubscribes the correct channel when removeHandlers is called", function() {

            var eventing = OWF.Eventing;

            spyOn(View, 'removeHandlers').andCallThrough();
            spyOn(Error, 'send');
            spyOn(eventing, 'unsubscribe');

            View.removeHandlers();
            expect(View.removeHandlers).toHaveBeenCalled();
            expect(eventing.unsubscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_STATUS_VIEW);

            expect(Error.send.calls.length).toEqual(0);

        });

        it("Testing invalid centers", function() {
            var invalidCenter1 = { lat: 1 }, invalidCenter2 = { lon: 1}, invalidCenter3 = {foo: 1, bar: 1};

            spyOn(View, 'send').andCallThrough();
            spyOn(Error, 'send');
            var eventing = OWF.Eventing;
            spyOn(eventing, 'publish');

            View.send(requestor, validBounds, invalidCenter1, validRange);
            expect(View.send).toHaveBeenCalled();
            expect(Error.send).toHaveBeenCalled();
            expect(eventing.publish.calls.length).toEqual(0);

            View.send(requestor, validBounds, invalidCenter2, validRange);
            expect(View.send).toHaveBeenCalled();
            expect(Error.send).toHaveBeenCalled();
            expect(eventing.publish.calls.length).toEqual(0);

            View.send(requestor, validBounds, invalidCenter3, validRange);
            expect(View.send).toHaveBeenCalled();
            expect(Error.send).toHaveBeenCalled();
            expect(eventing.publish.calls.length).toEqual(0);

            View.send(requestor, validBounds, null, validRange);
            expect(View.send).toHaveBeenCalled();
            expect(Error.send).toHaveBeenCalled();
            expect(eventing.publish.calls.length).toEqual(0);

        });

        it("Testing invalid bounds", function() {
            var invalidBounds1 = { southWest: {lat: 1, lon: 1} },
                invalidBounds2 = { northEast: {lat: 1, lon: 1} },
                invalidBounds3 = { southWest : {foo: 1, bar: 1}, northEast: {foo: 1, bar: 1}};

            spyOn(View, 'send').andCallThrough();
            spyOn(Error, 'send');
            var eventing = OWF.Eventing;
            spyOn(eventing, 'publish');

            View.send(requestor, invalidBounds1, validCenter, validRange);
            expect(View.send).toHaveBeenCalled();
            expect(Error.send).toHaveBeenCalled();
            expect(eventing.publish.calls.length).toEqual(0);

            View.send(requestor, invalidBounds2, validCenter, validRange);
            expect(View.send).toHaveBeenCalled();
            expect(Error.send).toHaveBeenCalled();
            expect(eventing.publish.calls.length).toEqual(0);

            View.send(requestor, invalidBounds3, validCenter, validRange);
            expect(View.send).toHaveBeenCalled();
            expect(Error.send).toHaveBeenCalled();
            expect(eventing.publish.calls.length).toEqual(0);

            View.send(requestor, null, validCenter, validRange);
            expect(View.send).toHaveBeenCalled();
            expect(Error.send).toHaveBeenCalled();
            expect(eventing.publish.calls.length).toEqual(0);

        });

        it("Testing invalid range", function() {
            var invalidRange1 = 'beta',
                invalidRange2 = -124,
                invalidRange3 = 0;

            spyOn(View, 'send').andCallThrough();
            spyOn(Error, 'send');
            var eventing = OWF.Eventing;
            spyOn(eventing, 'publish');

            View.send(requestor, validBounds, validCenter, invalidRange1);
            expect(View.send).toHaveBeenCalled();
            expect(Error.send).toHaveBeenCalled();
            expect(eventing.publish.calls.length).toEqual(0);

            View.send(requestor, validBounds, validCenter, invalidRange2);
            expect(View.send).toHaveBeenCalled();
            expect(Error.send).toHaveBeenCalled();
            expect(eventing.publish.calls.length).toEqual(0);

            View.send(requestor, validBounds, validCenter, invalidRange3);
            expect(View.send).toHaveBeenCalled();
            expect(Error.send).toHaveBeenCalled();
            expect(eventing.publish.calls.length).toEqual(0);

            View.send(requestor, validBounds, validCenter, null);
            expect(View.send).toHaveBeenCalled();
            expect(Error.send).toHaveBeenCalled();
            expect(eventing.publish.calls.length).toEqual(0);

        });

        it("Testing invalid lat/long", function() {

            var invalidLat= 'b',
                invalidLon= 'xxxx';


            // test through center check - same tests will be made through 
            var invalidCenter1 = { lat: invalidLat, lon: invalidLon }, 
                invalidCenter2 = { lat: 1, lon: invalidLon }, 
                invalidCenter3 = { lat: invalidLat, lon: 1 };
            
            spyOn(View, 'send').andCallThrough();
            spyOn(Error, 'send');
            var eventing = OWF.Eventing;
            spyOn(eventing, 'publish');

            View.send(requestor, validBounds, invalidCenter1, validRange);
            expect(View.send).toHaveBeenCalled();
            expect(Error.send).toHaveBeenCalled();
            expect(eventing.publish.calls.length).toEqual(0);

            View.send(requestor, validBounds, invalidCenter2, validRange);
            expect(View.send).toHaveBeenCalled();
            expect(Error.send).toHaveBeenCalled();
            expect(eventing.publish.calls.length).toEqual(0);

            View.send(requestor, validBounds, invalidCenter3, validRange);
            expect(View.send).toHaveBeenCalled();
            expect(Error.send).toHaveBeenCalled();
            expect(eventing.publish.calls.length).toEqual(0);


        });

        it("Testing multiple invalids for map.status.view", function () {
            var invalidBounds1 = { southWest: {lat: 1, lon: 1} },
                invalidRange1 = 'beta';

            spyOn(View, 'send').andCallThrough();
            spyOn(Error, 'send');
            var eventing = OWF.Eventing;
            spyOn(eventing, 'publish');

            View.send(requestor, invalidBounds1, validCenter, invalidRange1);
            expect(View.send).toHaveBeenCalled();
            expect(Error.send.mostRecentCall.args[3]).toContain('Range');
            expect(Error.send.mostRecentCall.args[3]).toContain('Bounds');
            expect(Error.send.mostRecentCall.args[3]).not.toContain('Center');
            expect(eventing.publish.calls.length).toEqual(0);

        });

        it("Testing map.status.view handler", function() {
            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = View.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_STATUS_VIEW);

            // This won't actually get called: remember, asynchronous eventing: I'm still waiting for a publish
            //expect(testHandler).toHaveBeenCalled();

            // But I can test the behavior for newHandler!
            var jsonVal = { requester: '',
                bounds: validBounds,
                range: validRange,
                center: validCenter };
            spyOn(Ozone.util, 'parseJson').andReturn(jsonVal);
            spyOn(Error, 'send');

            newHandler('senderFoo', jsonVal );
            // don't expect error to be called
            expect(Error.send.calls.length).toEqual(0);

            // Now DO expect testHandler to have been called!
            expect(testHandler.calls.length).toEqual(1);
            //expect(testHandler.mostRecentCall.args[1]).toEqual(Map.status.SUPPORTED_STATUS_TYPES);

        });

    });
});

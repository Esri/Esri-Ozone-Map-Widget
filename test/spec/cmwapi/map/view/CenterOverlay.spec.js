define(["cmwapi/Channels", "cmwapi/map/view/CenterOverlay", "cmwapi/map/Error", "cmwapi/Validator",
    "test/mock/OWF", "test/mock/Ozone"], 
    function(Channels, CenterOverlay, Error, Validator, OWF, Ozone) {

    describe(Channels.MAP_VIEW_CENTER_OVERLAY + " module", function() {

        var INSTANCE_ID = OWF.getInstanceId();

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

        it("sends data to the correct channel", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(CenterOverlay, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send');

            CenterOverlay.send({});
            expect(CenterOverlay.send).toHaveBeenCalled();

            // expect publish to be called
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_VIEW_CENTER_OVERLAY);
            expect(Ozone.util.parseJson(eventing.publish.mostRecentCall.args[1]).overlayId).toEqual(INSTANCE_ID);
            expect(Ozone.util.parseJson(eventing.publish.mostRecentCall.args[1]).zoom).toBeUndefined();

            // don't expect error to be called
            expect(Error.send.calls.length).toEqual(0);
        });

        it("fails data with invalid zoom values", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(CenterOverlay, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send').andCallThrough();

            CenterOverlay.send({zoom:{}});
            expect(CenterOverlay.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_ERROR);

            CenterOverlay.send({zoom:"test"});
            expect(CenterOverlay.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_ERROR);

            expect(Error.send.calls.length).toEqual(2);
        });

        it("unsubscribes the correct channel when removeHandlers is called", function() {

            var eventing = OWF.Eventing;

            spyOn(CenterOverlay, 'removeHandlers').andCallThrough();
            spyOn(Error, 'send');
            spyOn(eventing, 'unsubscribe');

            CenterOverlay.removeHandlers();
            expect(CenterOverlay.removeHandlers).toHaveBeenCalled();
            expect(eventing.unsubscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_VIEW_CENTER_OVERLAY);

            expect(Error.send.calls.length).toEqual(0);

        });

        it("wraps added handlers and validates a zoom range", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = CenterOverlay.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_VIEW_CENTER_OVERLAY);

            // Test the behavior for newHandler  CenterOverlay a sender an empty payload to pass along
            // Our code should fill in the payload and pass it along to the testHandler.
            var jsonVal = {
                zoom: 10000
            };
            var sender = {
                id: INSTANCE_ID
            };

            // Spy on Error and call our wrapper handler.
            spyOn(Error, 'send');
            newHandler(Ozone.util.toString(sender), jsonVal); 

            // We don't expect error to be called
            expect(Error.send.calls.length).toEqual(0);

            // We DO expect testHandler to have been called and the missing jsonVal items to have been
            // filled in.
            expect(testHandler.calls.length).toEqual(1);
            expect(testHandler.mostRecentCall.args[1].overlayId).toEqual(INSTANCE_ID);
            expect(testHandler.mostRecentCall.args[1].zoom).toEqual(10000);
        });

        it("passes object arrays to added handlers and validates a zoom range", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = CenterOverlay.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_VIEW_CENTER_OVERLAY);

            // Test the behavior for newHandler  Create a sender an empty payload to pass along
            // Our code should fill in the payload and pass it along to the testHandler.
            var jsonVal = [{
                zoom: 1000
            },{
                zoom: "auto"
            },{
                zoom: "AUTO"
            }];
            var sender = {
                id: INSTANCE_ID
            };

            // Spy on Error and call our wrapper handler.
            spyOn(Error, 'send');
            newHandler(Ozone.util.toString(sender), jsonVal); 

            // We don't expect error to be called
            expect(Error.send.calls.length).toEqual(0);

            // We DO expect testHandler to have been called and the jsonVal values to
            // carry through unchanged.  Any missing featureId should be filled in.
            expect(testHandler.calls.length).toEqual(1);
            expect(testHandler.mostRecentCall.args[1].length).toEqual(3);
            expect(testHandler.mostRecentCall.args[1][0].zoom).toEqual(1000);
            expect(testHandler.mostRecentCall.args[1][1].zoom).toEqual("auto");
            expect(testHandler.mostRecentCall.args[1][2].zoom).toEqual("AUTO");
        });
    });
});

define(["cmwapi/Channels", "cmwapi/map/feature/Unplot", "cmwapi/map/Error", "cmwapi/Validator",
    "test/mock/OWF", "test/mock/Ozone"], 
    function(Channels, Unplot, Error, Validator, OWF, Ozone) {

    describe(Channels.MAP_FEATURE_UNPLOT + " module", function() {

        var INSTANCE_ID = "TEST_ID";

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

            spyOn(Unplot, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send');

            Unplot.send({featureId:"myFeatureId"});
            expect(Unplot.send).toHaveBeenCalled();

            // expect publish to be called
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_FEATURE_UNPLOT);

            // don't expect error to be called
            expect(Error.send.calls.length).toEqual(0);
        });

        it("fails data missing a feature id", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(Unplot, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send').andCallThrough();

            Unplot.send({});
            expect(Unplot.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_ERROR);
            expect(Error.send.calls.length).toEqual(1);
        });

        it("unsubscribes the correct channel when removeHandlers is called", function() {

            var eventing = OWF.Eventing;

            spyOn(Unplot, 'removeHandlers').andCallThrough();
            spyOn(Error, 'send');
            spyOn(eventing, 'unsubscribe');

            Unplot.removeHandlers();
            expect(Unplot.removeHandlers).toHaveBeenCalled();
            expect(eventing.unsubscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_FEATURE_UNPLOT);

            expect(Error.send.calls.length).toEqual(0);

        });

        it("wraps added handlers and passes along any optional elements; a missing overlayId is filled in", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = Unplot.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_FEATURE_UNPLOT);

            // Test the behavior for newHandler  Unplot a sender an empty payload to pass along
            // Our code should fill in the payload and pass it along to the testHandler.
            var jsonVal = {
                featureId: "myFeatureId"
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
            expect(testHandler.mostRecentCall.args[1].featureId).toEqual("myFeatureId");
        });

        it("passes object arrays to added handlers", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = Unplot.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_FEATURE_UNPLOT);

            // Test the behavior for newHandler  Create a sender an empty payload to pass along
            // Our code should fill in the payload and pass it along to the testHandler.
            var jsonVal = [{
                featureId: "myFeatureId1"
            },{
                overlayId: "myOverlayId2",
                featureId: "myFeatureId2"
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
            // carry through unchanged.  Any missing elements with defaults should be filled in.
            expect(testHandler.calls.length).toEqual(1);
            expect(testHandler.mostRecentCall.args[1].length).toEqual(2);
            expect(testHandler.mostRecentCall.args[1][0].overlayId).toEqual(INSTANCE_ID);
            expect(testHandler.mostRecentCall.args[1][0].featureId).toEqual("myFeatureId1");
            expect(testHandler.mostRecentCall.args[1][1].overlayId).toEqual("myOverlayId2");
            expect(testHandler.mostRecentCall.args[1][1].featureId).toEqual("myFeatureId2");
        });
    });
});

define(["cmwapi/Channels", "cmwapi/map/overlay/Create", "cmwapi/map/Error", "cmwapi/Validator",
    "test/mock/OWF", "test/mock/Ozone"], 
    function(Channels, Create, Error, Validator, OWF, Ozone) {

    describe(Channels.MAP_OVERLAY_CREATE + " module", function() {

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

            spyOn(Create, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send');

            Create.send();
            expect(Create.send).toHaveBeenCalled();

            // expect publish to be called
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_OVERLAY_CREATE);

            // don't expect error to be called
            expect(Error.send.calls.length).toEqual(0);
        });

        it("unsubscribes the correct channel when removeHandlers is called", function() {

            var eventing = OWF.Eventing;

            spyOn(Create, 'removeHandlers').andCallThrough();
            spyOn(Error, 'send');
            spyOn(eventing, 'unsubscribe');

            Create.removeHandlers();
            expect(Create.removeHandlers).toHaveBeenCalled();
            expect(eventing.unsubscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_OVERLAY_CREATE);

            expect(Error.send.calls.length).toEqual(0);

        });


        it("wraps added handlers and fills in missing payload data", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = Create.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_OVERLAY_CREATE);

            // Test the behavior for newHandler  Create a sender an empty payload to pass along
            // Our code should fill in the payload and pass it along to the testHandler.
            var jsonVal = {};
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
            expect(testHandler.mostRecentCall.args[1].name).toEqual(INSTANCE_ID);
            expect(testHandler.mostRecentCall.args[1].parentId).toEqual(null);
        });

        it("wraps added handlers and does not override passed in payload data", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = Create.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_OVERLAY_CREATE);

            // Test the behavior for newHandler  Create a sender an empty payload to pass along
            // Our code should fill in the payload and pass it along to the testHandler.
            var jsonVal = {
                overlayId: "myOverlay",
                name: "myName",
                parentId: "myParent"
            };
            var sender = {
                id: INSTANCE_ID
            };

            // Spy on Error and call our wrapper handler.
            spyOn(Error, 'send');
            newHandler(Ozone.util.toString(sender), jsonVal); 

            // We don't expect error to be called
            expect(Error.send.calls.length).toEqual(0);

            // We DO expect testHandler to have been called and the missing jsonVal values to
            // carry through unchanged.
            expect(testHandler.calls.length).toEqual(1);
            expect(testHandler.mostRecentCall.args[1].overlayId).toEqual("myOverlay");
            expect(testHandler.mostRecentCall.args[1].name).toEqual("myName");
            expect(testHandler.mostRecentCall.args[1].parentId).toEqual("myParent");
        });

        it("passes object arrays to added handlers", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = Create.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_OVERLAY_CREATE);

            // Test the behavior for newHandler  Create a sender an empty payload to pass along
            // Our code should fill in the payload and pass it along to the testHandler.
            var jsonVal = [{
                overlayId: "myOverlay1",
                name: "myName1",
                parentId: "myParent1"
            },{
                overlayId: "myOverlay2",
                name: "myName2",
                parentId: "myParent2"
            }];
            var sender = {
                id: INSTANCE_ID
            };

            // Spy on Error and call our wrapper handler.
            spyOn(Error, 'send');
            newHandler(Ozone.util.toString(sender), jsonVal); 

            // We don't expect error to be called
            expect(Error.send.calls.length).toEqual(0);

            // We DO expect testHandler to have been called and the missing jsonVal values to
            // carry through unchanged.
            expect(testHandler.calls.length).toEqual(1);
            expect(testHandler.mostRecentCall.args[1].length).toEqual(2);
            expect(testHandler.mostRecentCall.args[1][0].overlayId).toEqual("myOverlay1");
            expect(testHandler.mostRecentCall.args[1][0].name).toEqual("myName1");
            expect(testHandler.mostRecentCall.args[1][0].parentId).toEqual("myParent1");
            expect(testHandler.mostRecentCall.args[1][1].overlayId).toEqual("myOverlay2");
            expect(testHandler.mostRecentCall.args[1][1].name).toEqual("myName2");
            expect(testHandler.mostRecentCall.args[1][1].parentId).toEqual("myParent2");
        });


    });
});

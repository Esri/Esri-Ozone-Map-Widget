define(["cmwapi/Channels", "cmwapi/map/status/About", "cmwapi/map/Error", "cmwapi/Validator"], 
    function(Channels, About, Error, Validator) {

    describe("Map.status.about calls and handlers", function() {

        beforeEach(function() {
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

        it("map.status.about", function() {
            spyOn(About, 'send').andCallThrough();
            spyOn(Error, 'send');
            spyOn(Ozone.util, 'toString').andCallFake( function(jsonStruct) {
                return jsonStruct;
            });
            var eventing = OWF.Eventing;
            spyOn(eventing, 'publish');

            About.send("1.1", "2-D", "Widget Foo");
            expect(About.send).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_STATUS_ABOUT);
            expect(eventing.publish.mostRecentCall.args[1]).toEqual({version: "1.1", type: "2-D", widgetName: "Widget Foo"});

            expect(Error.send.calls.length).toEqual(0);
        });

        it("Unsubscribes the correct channel when removeHandlers is called", function() {

            var eventing = OWF.Eventing;

            spyOn(About, 'removeHandlers').andCallThrough();
            spyOn(Error, 'send');
            spyOn(eventing, 'unsubscribe');

            About.removeHandlers();
            expect(About.removeHandlers).toHaveBeenCalled();
            expect(eventing.unsubscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_STATUS_ABOUT);

            expect(Error.send.calls.length).toEqual(0);

        });

        it("map.status.about bad data", function() {
            spyOn(About, 'send').andCallThrough();
            spyOn(Error, 'send');
            spyOn(Ozone.util, 'toString').andCallFake( function(jsonStruct) {
                return jsonStruct;
            });
            var eventing = OWF.Eventing;
            spyOn(eventing, 'publish');

            About.send(null, "2-D", "Widget Foo");
            expect(About.send).toHaveBeenCalled();
            expect(Error.send.calls.length).toEqual(1);
            expect(eventing.publish.calls.length).toEqual(0);

            About.send("1.1", "foo", "Widget Foo");
            expect(About.send).toHaveBeenCalled();
            expect(Error.send.calls.length).toEqual(2);
            expect(eventing.publish.calls.length).toEqual(0);

            About.send("1.1", "3-D", null);
            expect(About.send).toHaveBeenCalled();
            expect(Error.send.calls.length).toEqual(3);
            expect(eventing.publish.calls.length).toEqual(0);

            About.send("1.1", "3-D", '');
            expect(About.send).toHaveBeenCalled();
            expect(Error.send.calls.length).toEqual(4);
            expect(eventing.publish.calls.length).toEqual(0);

            About.send(null, null, null);
            expect(About.send).toHaveBeenCalled();
            expect(Error.send.calls.length).toEqual(5);
            expect(Error.send.mostRecentCall.args[3]).toMatch('.+;.+;.+;.+');
            expect(eventing.publish.calls.length).toEqual(0);


        });

        it("Test handler for map.status.about", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = About.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_STATUS_ABOUT);

            // This won't actually get called: remember, asynchronous eventing: I'm still waiting for a publish
            //expect(testHandler).toHaveBeenCalled();
            // But I can test the behavior for newHandler!
            var jsonVal = {
                version: '1.1.0',
                type: '2-D',
                widgetName: 'CMWAPI Spec widget'
            };
            spyOn(Ozone.util, 'parseJson').andReturn(jsonVal);
            spyOn(Error, 'send');

            newHandler('senderFoo', jsonVal );
            // don't expect error to be called
            expect(Error.send.calls.length).toEqual(0);

            // Now DO expect testHandler to have been called!
            expect(testHandler.calls.length).toEqual(1);
        });

    });
});

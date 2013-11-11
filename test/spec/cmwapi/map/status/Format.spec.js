define(["cmwapi/Channels", "cmwapi/map/status/Format", "cmwapi/map/Error", "cmwapi/Validator"], 
    function(Channels, Format, Error, Validator) {

    describe("Map.status.format calls and handlers", function() {

        beforeEach(function() {
            // Mock the necessary OWF methods and attach them to the window.
            // OWF should be in global scope when other libraries attempt to
            // access it.
            var OWF = {
                Eventing : {
                    publish : function() {

                    },
                    subscribe : function() {

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

        it("Testing map.status.format send message: don't send any formats", function() {

            spyOn(Format, 'send').andCallThrough();
            spyOn(Error, 'send');
            spyOn(Ozone.util, 'toString').andCallFake( function(jsonStruct) {
                return jsonStruct;
            });
            var eventing = OWF.Eventing;
            spyOn(eventing, 'publish');

            Format.send();
            expect(Format.send).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual('map.status.format');
            expect(eventing.publish.mostRecentCall.args[1]).toEqual({formats: Format.REQUIRED_FORMATS});

            expect(Error.send.calls.length).toEqual(0);

        });

        it("Testing map.status.format send message: send any formats", function() {

            spyOn(Format, 'send').andCallThrough();
            spyOn(Error, 'send');
            spyOn(Ozone.util, 'toString').andCallFake( function(jsonStruct) {
                return jsonStruct;
            });
            var eventing = OWF.Eventing;
            spyOn(eventing, 'publish');

            var testFormats = ['geoJSON', 'uhf'];
            var outputFormats = Format.REQUIRED_FORMATS.concat(testFormats);
            Format.send(testFormats);
            expect(Format.send).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual('map.status.format');
            expect(eventing.publish.mostRecentCall.args[1]).toEqual({formats: outputFormats});

            expect(Error.send.calls.length).toEqual(0);
        });


        xit("Testing map.status.format handler - not yet implemented", function() {
            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = statusHandler.handleFormats(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual('map.status.view');

            // This won't actually get called: remember, asynchronous eventing: I'm still waiting for a publish
            //expect(testHandler).toHaveBeenCalled();

            // But I can test the behavior for newHandler!
            /* TODO: update for formats
            var jsonVal = { requester: '',
                bounds: validBounds,
                range: validRange,
                center: validCenter };
            */
            spyOn(Ozone.util, 'parseJson').andReturn(jsonVal);
            spyOn(Error, 'error');

            newHandler('senderFoo', jsonVal );
            // don't expect error to be called
            expect(Error.error.calls.length).toEqual(0);

            // Now DO expect testHandler to have been called!
            expect(testHandler.calls.length).toEqual(1);
            //expect(testHandler.mostRecentCall.args[1]).toEqual(Map.status.SUPPORTED_STATUS_TYPES);

        });
    });
});

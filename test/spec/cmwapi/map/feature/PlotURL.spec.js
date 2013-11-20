define(["cmwapi/Channels", "cmwapi/map/feature/PlotURL", "cmwapi/map/Error", "cmwapi/Validator"], 
    function(Channels, PlotURL, Error, Validator) {

    describe(Channels.MAP_FEATURE_PLOT_URL + " module", function() {

        var INSTANCE_ID = "TEST_ID";

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
                    return INSTANCE_ID;
                }
            };
            var Ozone = {
                util: {
                    toString : function(value) {
                        // Just defer to JSON stringify here.
                        return JSON.stringify(value);
                    },
                    parseJson : function(value) {
                        // Just defer to JSON parse here.
                        return JSON.parse(value);
                    }
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

        it("sends data to the correct channel", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(PlotURL, 'send').andCallThrough();
            spyOn(eventing, 'publish').andCallThrough();
            spyOn(Error, 'send');

            PlotURL.send({featureId:"myFeatureId", url: "http://www.test.url"});
            expect(PlotURL.send).toHaveBeenCalled();

            // expect publish to be called
            expect(eventing.publish).toHaveBeenCalled();

            var payload = Ozone.util.parseJson(eventing.publish.mostRecentCall.args[1]);
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_FEATURE_PLOT_URL);
            expect(payload.overlayId).toEqual(INSTANCE_ID);
            expect(payload.featureId).toEqual("myFeatureId");
            expect(payload.url).toEqual("http://www.test.url");
            expect(payload.name).toBe(undefined);
            expect(payload.format).toEqual("kml");
            expect(payload.params).toBe(undefined);
            expect(payload.zoom).toBe(false);
            
            // don't expect error to be called
            expect(Error.send.calls.length).toEqual(0);
        });

        it("fails data missing a feature id", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(PlotURL, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send').andCallThrough();

            PlotURL.send({url: "http://www.test.url"});
            expect(PlotURL.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_ERROR);
            expect(Error.send.calls.length).toEqual(1);
        });

        it("fails data missing a url", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(PlotURL, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send').andCallThrough();

            PlotURL.send({featureId: "myFeatureId"});
            expect(PlotURL.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_ERROR);
            expect(Error.send.calls.length).toEqual(1);
        });

        it("unsubscribes the correct channel when removeHandlers is called", function() {

            var eventing = OWF.Eventing;

            spyOn(PlotURL, 'removeHandlers').andCallThrough();
            spyOn(Error, 'send');
            spyOn(eventing, 'unsubscribe');

            PlotURL.removeHandlers();
            expect(PlotURL.removeHandlers).toHaveBeenCalled();
            expect(eventing.unsubscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_FEATURE_PLOT_URL);

            expect(Error.send.calls.length).toEqual(0);

        });

        it("wraps added handlers and passes along any optional elements; missing overlayId, zoom and format are filled in", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = PlotURL.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_FEATURE_PLOT_URL);

            // Test the behavior for newHandler  PlotURL a sender an empty payload to pass along
            // Our code should fill in the payload and pass it along to the testHandler.
            var jsonVal = {
                featureId: "myFeatureId",
                url: "http://www.test.url",
                name: "myName",
                params: "myParams"
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
            expect(testHandler.mostRecentCall.args[1].url).toEqual("http://www.test.url");
            expect(testHandler.mostRecentCall.args[1].name).toEqual("myName");
            expect(testHandler.mostRecentCall.args[1].format).toEqual("kml");
            expect(testHandler.mostRecentCall.args[1].params).toEqual("myParams");
            expect(testHandler.mostRecentCall.args[1].zoom).toBe(false);
        });

        it("passes object arrays to added handlers", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = PlotURL.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_FEATURE_PLOT_URL);

            // Test the behavior for newHandler  Create a sender an empty payload to pass along
            // Our code should fill in the payload and pass it along to the testHandler.
            var jsonVal = [{
                featureId: "myFeatureId1",
                url: "http://www.test.url.1"
            },{
                overlayId: "myOverlayId2",
                featureId: "myFeatureId2",
                url: "http://www.test.url.2",
                name: "myName",
                format: "wms",
                params: "myParams",
                zoom: true
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
            expect(testHandler.mostRecentCall.args[1][0].url).toEqual("http://www.test.url.1");
            expect(testHandler.mostRecentCall.args[1][0].name).toBe(undefined);
            expect(testHandler.mostRecentCall.args[1][0].format).toEqual("kml");
            expect(testHandler.mostRecentCall.args[1][0].params).toBe(undefined);
            expect(testHandler.mostRecentCall.args[1][0].zoom).toBe(false);
            expect(testHandler.mostRecentCall.args[1][1].overlayId).toEqual("myOverlayId2");
            expect(testHandler.mostRecentCall.args[1][1].featureId).toEqual("myFeatureId2");
            expect(testHandler.mostRecentCall.args[1][1].url).toEqual("http://www.test.url.2");
            expect(testHandler.mostRecentCall.args[1][1].name).toEqual("myName");
            expect(testHandler.mostRecentCall.args[1][1].format).toEqual("wms");
            expect(testHandler.mostRecentCall.args[1][1].params).toEqual("myParams");
            expect(testHandler.mostRecentCall.args[1][1].zoom).toBe(true);
        });
    });
});

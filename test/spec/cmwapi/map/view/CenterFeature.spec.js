/**
 * Copyright © 2013 Environmental Systems Research Institute, Inc. (Esri)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at<br>
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(["cmwapi/Channels", "cmwapi/map/view/CenterFeature", "cmwapi/map/Error", "cmwapi/Validator",
    "test/mock/OWF", "test/mock/Ozone"], 
    function(Channels, CenterFeature, Error, Validator, OWF, Ozone) {

    describe(Channels.MAP_VIEW_CENTER_FEATURE + " module", function() {

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

            spyOn(CenterFeature, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send');

            CenterFeature.send({featureId: "myFeatureId"});
            expect(CenterFeature.send).toHaveBeenCalled();

            // expect publish to be called
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_VIEW_CENTER_FEATURE);

            var payload = Ozone.util.parseJson(eventing.publish.mostRecentCall.args[1]);
            expect(payload.overlayId).toEqual(INSTANCE_ID);
            expect(payload.featureId).toEqual("myFeatureId");
            expect(payload.zoom).toBeUndefined();

            // don't expect error to be called
            expect(Error.send.calls.length).toEqual(0);
        });

        it("fails data with invalid zoom values", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(CenterFeature, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send').andCallThrough();

            CenterFeature.send({zoom:{}});
            expect(CenterFeature.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_ERROR);

            CenterFeature.send({zoom:"test"});
            expect(CenterFeature.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_ERROR);

            expect(Error.send.calls.length).toEqual(2);
        });

        it("fails data with missing featureId values", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(CenterFeature, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send').andCallThrough();

            CenterFeature.send({zoom:{}});
            expect(CenterFeature.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_ERROR);
            expect(Error.send.calls.length).toEqual(1);
        });

        it("unsubscribes the correct channel when removeHandlers is called", function() {

            var eventing = OWF.Eventing;

            spyOn(CenterFeature, 'removeHandlers').andCallThrough();
            spyOn(Error, 'send');
            spyOn(eventing, 'unsubscribe');

            CenterFeature.removeHandlers();
            expect(CenterFeature.removeHandlers).toHaveBeenCalled();
            expect(eventing.unsubscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_VIEW_CENTER_FEATURE);

            expect(Error.send.calls.length).toEqual(0);

        });

        it("wraps added handlers and validates a zoom range", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = CenterFeature.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_VIEW_CENTER_FEATURE);

            // Test the behavior for newHandler  CenterFeature a sender an empty payload to pass along
            // Our code should fill in the payload and pass it along to the testHandler.
            var jsonVal = {
                featureId: "myFeatureId",
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
            expect(testHandler.mostRecentCall.args[1].featureId).toEqual("myFeatureId");
            expect(testHandler.mostRecentCall.args[1].zoom).toEqual(10000);
        });

        it("passes object arrays to added handlers and validates a zoom range", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = CenterFeature.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_VIEW_CENTER_FEATURE);

            // Test the behavior for newHandler  Create a sender an empty payload to pass along
            // Our code should fill in the payload and pass it along to the testHandler.
            var jsonVal = [{
                featureId: "myFeatureId1",
                zoom: 1000
            },{
                featureId: "myFeatureId2",
                zoom: "auto"
            },{
                featureId: "myFeatureId3",
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
            expect(testHandler.mostRecentCall.args[1][0].featureId).toEqual("myFeatureId1");
            expect(testHandler.mostRecentCall.args[1][1].zoom).toEqual("auto");
            expect(testHandler.mostRecentCall.args[1][1].featureId).toEqual("myFeatureId2");
            expect(testHandler.mostRecentCall.args[1][2].zoom).toEqual("AUTO");
            expect(testHandler.mostRecentCall.args[1][2].featureId).toEqual("myFeatureId3");
        });
    });
});

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
define(["cmwapi/Channels", "cmwapi/map/view/CenterBounds", "cmwapi/map/Error", "cmwapi/Validator",
    "test/mock/OWF", "test/mock/Ozone"], 
    function(Channels, CenterBounds, Error, Validator, OWF, Ozone) {

    describe(Channels.MAP_VIEW_CENTER_BOUNDS + " module", function() {

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

            spyOn(CenterBounds, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send');

            CenterBounds.send({bounds: { southWest: { lat: 1, lon: 1}, northEast: {lat: 1, lon: 1}}});
            expect(CenterBounds.send).toHaveBeenCalled();

            // expect publish to be called
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_VIEW_CENTER_BOUNDS);

            var payload = Ozone.util.parseJson(eventing.publish.mostRecentCall.args[1]);
            expect(payload.bounds.southWest.lat).toEqual(1);
            expect(payload.bounds.southWest.lon).toEqual(1);
            expect(payload.bounds.northEast.lat).toEqual(1);
            expect(payload.bounds.northEast.lon).toEqual(1);
            expect(payload.zoom).toBeUndefined();

            // don't expect error to be called
            expect(Error.send.calls.length).toEqual(0);
        });

        it("fails data with invalid zoom values", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(CenterBounds, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send').andCallThrough();

            CenterBounds.send({location: {lat: 1, lon: 2}, zoom:{}});
            expect(CenterBounds.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_ERROR);

            CenterBounds.send({bounds: { southWest: { lat: 1, lon: 1}, northEast: {lat: 1, lon: 1}},
                zoom:"test"});
            expect(CenterBounds.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_ERROR);

            expect(Error.send.calls.length).toEqual(2);
        });

        it("fails data with missing bounds values", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(CenterBounds, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send').andCallThrough();

            CenterBounds.send({});
            expect(CenterBounds.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_ERROR);
            expect(Error.send.calls.length).toEqual(1);
        });

        it("unsubscribes the correct channel when removeHandlers is called", function() {

            var eventing = OWF.Eventing;

            spyOn(CenterBounds, 'removeHandlers').andCallThrough();
            spyOn(Error, 'send');
            spyOn(eventing, 'unsubscribe');

            CenterBounds.removeHandlers();
            expect(CenterBounds.removeHandlers).toHaveBeenCalled();
            expect(eventing.unsubscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_VIEW_CENTER_BOUNDS);

            expect(Error.send.calls.length).toEqual(0);

        });

        it("wraps added handlers and validates a zoom range", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = CenterBounds.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_VIEW_CENTER_BOUNDS);

            // Test the behavior for newHandler  CenterBounds a sender an empty payload to pass along
            // Our code should fill in the payload and pass it along to the testHandler.
            var jsonVal = {
                bounds: { southWest: { lat: 1, lon: 1}, northEast: {lat: 1, lon: 1}},
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
            expect(testHandler.mostRecentCall.args[1].bounds.southWest.lat).toEqual(1);
            expect(testHandler.mostRecentCall.args[1].bounds.southWest.lon).toEqual(1);
            expect(testHandler.mostRecentCall.args[1].bounds.northEast.lat).toEqual(1);
            expect(testHandler.mostRecentCall.args[1].bounds.northEast.lon).toEqual(1);
            expect(testHandler.mostRecentCall.args[1].zoom).toEqual(10000);
        });

        it("passes object arrays to added handlers and validates a zoom range", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = CenterBounds.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_VIEW_CENTER_BOUNDS);

            // Test the behavior for newHandler  Create a sender an empty payload to pass along
            // Our code should fill in the payload and pass it along to the testHandler.
            var jsonVal = [{
                bounds: { southWest: { lat: 1, lon: 1}, northEast: {lat: 1, lon: 1}},
                zoom: 1000
            },{
                bounds: { southWest: { lat: 2, lon: 2}, northEast: {lat: 2, lon: 2}},
                zoom: "auto"
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
            expect(testHandler.mostRecentCall.args[1].length).toEqual(2);
            expect(testHandler.mostRecentCall.args[1][0].zoom).toEqual(1000);
            expect(testHandler.mostRecentCall.args[1][0].bounds.southWest.lat).toEqual(1);
            expect(testHandler.mostRecentCall.args[1][0].bounds.southWest.lon).toEqual(1);
            expect(testHandler.mostRecentCall.args[1][1].zoom).toEqual("auto");
            expect(testHandler.mostRecentCall.args[1][1].bounds.southWest.lat).toEqual(2);
            expect(testHandler.mostRecentCall.args[1][1].bounds.southWest.lon).toEqual(2);
        });
    });
});

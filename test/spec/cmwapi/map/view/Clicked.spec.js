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
define(["cmwapi/Channels", "cmwapi/map/view/Clicked", "cmwapi/map/Error", "cmwapi/Validator",
    "test/mock/OWF", "test/mock/Ozone"], 
    function(Channels, Clicked, Error, Validator, OWF, Ozone) {

    describe(Channels.MAP_VIEW_CLICKED + " module", function() {

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

            spyOn(Clicked, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send');

            Clicked.send({
                lat: 1, 
                lon: 2,
                type: "single",
                button: "left"
            });
            expect(Clicked.send).toHaveBeenCalled();

            // expect publish to be called
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_VIEW_CLICKED);

            var payload = Ozone.util.parseJson(eventing.publish.mostRecentCall.args[1]);
            expect(payload.lat).toEqual(1);
            expect(payload.lon).toEqual(2);
            expect(payload.type).toEqual("single");
            expect(payload.button).toEqual("left");
            expect(payload.keys).toBeUndefined();

            // don't expect error to be called
            expect(Error.send.calls.length).toEqual(0);
        });

        it("fails data with invalid lat/lon values", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(Clicked, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send').andCallThrough();

            Clicked.send({
                lat: "test", 
                lon: 2,
                type: "single",
                button: "left"
            });
            expect(Clicked.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_ERROR);

            Clicked.send({
                lat: 1, 
                type: "single",
                button: "left"
            });
            expect(Clicked.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_ERROR);

            expect(Error.send.calls.length).toEqual(2);
        });

        it("fails data with bad type values", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(Clicked, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send').andCallThrough();

            Clicked.send({
                lat: 1, 
                lon: 2,
                type: "test",
                button: "left"
            });
            expect(Clicked.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_ERROR);
            expect(Error.send.calls.length).toEqual(1);
        });

        it("fails data with bad button values", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(Clicked, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send').andCallThrough();

            Clicked.send({
                lat: 1, 
                lon: 2,
                type: "double",
                button: "test"
            });
            expect(Clicked.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_ERROR);
            expect(Error.send.calls.length).toEqual(1);
        });

        it("fails data with bad key values", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(Clicked, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send').andCallThrough();

            Clicked.send({
                lat: 1, 
                lon: 2,
                type: "double",
                button: "right",
                keys: ["test"]
            });
            expect(Clicked.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toEqual(Channels.MAP_ERROR);
            expect(Error.send.calls.length).toEqual(1);
        });

        it("unsubscribes the correct channel when removeHandlers is called", function() {

            var eventing = OWF.Eventing;

            spyOn(Clicked, 'removeHandlers').andCallThrough();
            spyOn(Error, 'send');
            spyOn(eventing, 'unsubscribe');

            Clicked.removeHandlers();
            expect(Clicked.removeHandlers).toHaveBeenCalled();
            expect(eventing.unsubscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_VIEW_CLICKED);

            expect(Error.send.calls.length).toEqual(0);

        });

        it("wraps added handlers and validates payload", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = Clicked.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_VIEW_CLICKED);

            // Test the behavior for newHandler  Clicked a sender an empty payload to pass along
            // Our code should fill in the payload and pass it along to the testHandler.
            var jsonVal = {
                lat: 1, 
                lon: 2,
                type: "double",
                button: "right",
                keys: ["ctrl"]
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
            expect(testHandler.mostRecentCall.args[1].lat).toEqual(1);
            expect(testHandler.mostRecentCall.args[1].lon).toEqual(2);
            expect(testHandler.mostRecentCall.args[1].type).toEqual("double");
            expect(testHandler.mostRecentCall.args[1].button).toEqual("right");
            expect(testHandler.mostRecentCall.args[1].keys[0]).toEqual("ctrl");
        });

        it("passes object arrays to added handlers and validates payload", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = Clicked.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_VIEW_CLICKED);

            // Test the behavior for newHandler  Create a sender an empty payload to pass along
            // Our code should fill in the payload and pass it along to the testHandler.
            var jsonVal = [{
                lat: 1, 
                lon: 1,
                type: "single",
                button: "left",
                keys: ["alt"]
            },{
                lat: 2, 
                lon: 2,
                type: "double",
                button: "middle",
                keys: ["shift"]
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
            expect(testHandler.mostRecentCall.args[1][0].lat).toEqual(1);
            expect(testHandler.mostRecentCall.args[1][0].lon).toEqual(1);
            expect(testHandler.mostRecentCall.args[1][0].type).toEqual("single");
            expect(testHandler.mostRecentCall.args[1][0].button).toEqual("left");
            expect(testHandler.mostRecentCall.args[1][0].keys[0]).toEqual("alt");
            expect(testHandler.mostRecentCall.args[1][1].lat).toEqual(2);
            expect(testHandler.mostRecentCall.args[1][1].lon).toEqual(2);
            expect(testHandler.mostRecentCall.args[1][1].type).toEqual("double");
            expect(testHandler.mostRecentCall.args[1][1].button).toEqual("middle");
            expect(testHandler.mostRecentCall.args[1][1].keys[0]).toEqual("shift");
        });
    });
});

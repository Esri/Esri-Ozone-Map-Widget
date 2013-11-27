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
define(["cmwapi/Channels", "cmwapi/map/status/Request", "cmwapi/map/Error", "cmwapi/Validator",
    "test/mock/OWF", "test/mock/Ozone"], 
    function(Channels, Request, Error, Validator, OWF, Ozone) {

    describe("Map.status.request calls and handlers", function() {

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

        it("Map.status.request gets called", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(Request, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send');

            Request.send();
            expect(Request.send).toHaveBeenCalled();

            // expect publish to be called
            expect(eventing.publish).toHaveBeenCalled();

            // don't expect error to be called
            expect(Error.send.calls.length).toEqual(0);
        });

        it("Unsubscribes the correct channel when removeHandlers is called", function() {

            var eventing = OWF.Eventing;

            spyOn(Request, 'removeHandlers').andCallThrough();
            spyOn(Error, 'send');
            spyOn(eventing, 'unsubscribe');

            Request.removeHandlers();
            expect(Request.removeHandlers).toHaveBeenCalled();
            expect(eventing.unsubscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_STATUS_REQUEST);

            expect(Error.send.calls.length).toEqual(0);

        });

        it("Map.status.request gets called with wrong types", function() {
            //var statusHandler = Map.status;
            var eventing = OWF.Eventing;
            spyOn(eventing, 'publish');

            spyOn(Request, 'send').andCallThrough();
            spyOn(Error, 'send').andCallThrough();

            Request.send(['foo']);

            expect(Request.send).toHaveBeenCalled();
            expect(Request.send.mostRecentCall.args[0]).toEqual(['foo']);

            // expect error to be called...
            expect(Error.send).toHaveBeenCalled();

            // publish will be called, as now we're calling the error channel for issues
            //  note that this only happens if we 'callThrough' on Error
            expect(eventing.publish.mostRecentCall.args[0]).toEqual("map.error");
        });

        it("Testing handler for map.status.request message when given invalid type", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = Request.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_STATUS_REQUEST);

            // This won't actually get called: remember, asynchronous eventing: I'm still waiting for a publish
            //expect(testHandler).toHaveBeenCalled();

            // But I can test the behavior for newHandler!
            var returnVal = { types: ['foo']};
            spyOn(Ozone.util, 'parseJson').andReturn(returnVal);
            spyOn(Error, 'send');

            newHandler('senderFoo', { types: ['foo']});
            expect(Error.send).toHaveBeenCalled();

            // DON'T expect testHandler to have been called!
            expect(testHandler.calls.length).toEqual(0);
        });

        it("Testing handler for map.status.request message when given valid type", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = Request.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_STATUS_REQUEST);

            // This won't actually get called: remember, asynchronous eventing: I'm still waiting for a publish
            //expect(testHandler).toHaveBeenCalled();

            // But I can test the behavior for newHandler!
            var jsonVal = { types: ['view']};
            spyOn(Ozone.util, 'parseJson').andReturn(jsonVal);
            spyOn(Error, 'send');

            newHandler('senderFoo', jsonVal);   // cheating: since I know I'm going to parse it anyway
            // don't expect error to be called
            expect(Error.send.calls.length).toEqual(0);

            // Now DO expect testHandler to have been called!
            expect(testHandler.calls.length).toEqual(1);
            expect(testHandler.mostRecentCall.args[1]).toEqual(['view']);
        });

        it("Testing handler for map.status.request message when given no types", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = Request.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_STATUS_REQUEST);

            // This won't actually get called: remember, asynchronous eventing: I'm still waiting for a publish
            //expect(testHandler).toHaveBeenCalled();

            // But I can test the behavior for newHandler!
            var jsonVal = { };
            spyOn(Ozone.util, 'parseJson').andReturn(jsonVal);
            spyOn(Error, 'send');

            newHandler('senderFoo', jsonVal );
            // don't expect error to be called
            expect(Error.send.calls.length).toEqual(0);

            // Now DO expect testHandler to have been called!
            expect(testHandler.calls.length).toEqual(1);
            expect(testHandler.mostRecentCall.args[1]).toEqual(Validator.SUPPORTED_STATUS_TYPES);
        });

    });
});

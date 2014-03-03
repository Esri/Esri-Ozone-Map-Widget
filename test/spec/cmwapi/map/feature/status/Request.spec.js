/**
 * Copyright © 2013 Environmental Systems Research Inst`ute, Inc. (Esri)
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
define(["cmwapi/Channels", "cmwapi/map/feature/status/Request", "cmwapi/map/Error", "cmwapi/Validator",
    "test/mock/OWF", "test/mock/Ozone"],
    function(Channels, Request, Error, Validator, OWF, Ozone) {

    describe("Verify " + Channels.MAP_FEATURE_STATUS_REQUEST + " module", function() {

        var INSTANCE_ID = OWF.getInstanceId();

        beforeEach(function() {

            window.OWF = OWF;
            window.Ozone = Ozone;
        });

        afterEach(function() {
            delete window.OWF;
            delete window.Ozone;
        });

        it("sends data to the correct channel", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(Request, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send');

            Request.send({eventType: 'mouse-over', overlayId: 'o', featureId: 'f', subfeatureId: 'sf'});
            expect(Request.send).toHaveBeenCalled();

            // expect publish to be called
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toBe(Channels.MAP_FEATURE_STATUS_REQUEST);

            // don't expect error to be called
            expect(Error.send.calls.length).toBe(0);
        });

        it("unsubscribes the correct channel when removeHandlers is called", function() {

            var eventing = OWF.Eventing;

            spyOn(Request, 'removeHandlers').andCallThrough();
            spyOn(Error, 'send');
            spyOn(eventing, 'unsubscribe');

            Request.removeHandlers();
            expect(Request.removeHandlers).toHaveBeenCalled();
            expect(eventing.unsubscribe.mostRecentCall.args[0]).toBe(Channels.MAP_FEATURE_STATUS_REQUEST);

            expect(Error.send.calls.length).toBe(0);

        });

        it("wraps added handlers and passes along any optional elements", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = Request.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toBe(Channels.MAP_FEATURE_STATUS_REQUEST);

            var sender = {
                id: INSTANCE_ID
            };

            // Spy on Error and call our wrapper handler.
            spyOn(Error, 'send');
            newHandler(Ozone.util.toString(sender));

            // We don't expect error to be called
            expect(Error.send.calls.length).toBe(0);

            // We DO expect testHandler to have been called and event type to have been filled in
            expect(testHandler.calls.length).toBe(1);
        });

        xit("validates event type on handler and passes if good", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = Request.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toBe(Channels.MAP_FEATURE_STATUS_STOP);

            var jsonVal = [{
                overlayId: 'o',
                featureId: 'f',
                subfeatureId: 'sf',
                eventType: 'mouse-over'
            },{
                overlayId: 'o2',
                featureId: 'f2',
                subfeatureId:'sf2',
                eventType: 'click'
            }];
            var sender = {
                id: INSTANCE_ID
            };

            // Spy on Error and call our wrapper handler.
            spyOn(Error, 'send');
            newHandler(Ozone.util.toString(sender), Ozone.util.toString(jsonVal));

            // We don't expect error to be called
            expect(Error.send.calls.length).toBe(0);

            // We DO expect testHandler to have been called and event type to have been filled in
            expect(testHandler.calls.length).toBe(2);
        });

        xit("validates event type on handler and errors if bad", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = Request.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toBe(Channels.MAP_FEATURE_STATUS_STOP);

            var jsonVal = {
                overlayId: 'o',
                featureId: 'f',
                subfeatureId: 'sf',
                eventType: 'fake-event'
            };
            var sender = {
                id: INSTANCE_ID
            };

            // Spy on Error and call our wrapper handler.
            spyOn(Error, 'send');
            newHandler(Ozone.util.toString(sender), Ozone.util.toString(jsonVal));

            // We don't expect error to be called
            expect(Error.send.calls.length).toBe(1);

            // We DO expect testHandler to have been called and event type to have been filled in
            expect(testHandler.calls.length).toBe(0);
        });
    });
});

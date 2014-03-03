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
define(["cmwapi/Channels", "cmwapi/map/feature/status/Sublayers", "cmwapi/map/Error", "cmwapi/Validator",
    "test/mock/OWF", "test/mock/Ozone"],
    function(Channels, Sublayers, Error, Validator, OWF, Ozone) {

    describe("Verify " + Channels.MAP_FEATURE_STATUS_SUBLAYERS + " module", function() {

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

            spyOn(Sublayers, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send');

            Sublayers.send({eventType: 'mouse-over', overlayId: 'o', featureId: 'f', subfeatureId: 'sf'});
            expect(Sublayers.send).toHaveBeenCalled();

            // expect publish to be called
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toBe(Channels.MAP_FEATURE_STATUS_SUBLAYERS);

            // don't expect error to be called
            expect(Error.send.calls.length).toBe(0);
        });

        it("errors on bad data object", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(Sublayers, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send').andCallThrough();

            //pre json encoded
            Sublayers.send( Ozone.util.toString({foo: 'bar'}));
            expect(Sublayers.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toBe(Channels.MAP_ERROR);
            expect(Error.send.calls.length).toBe(1);
        });

        it("does not error on data object array", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(Sublayers, 'send').andCallThrough();
            spyOn(eventing, 'publish');
            spyOn(Error, 'send').andCallThrough();

            //pre json encoded
            Sublayers.send([{eventType: 'mouse-over', overlayId: 'o', featureId: 'f', subfeatureId: 'sf'},
                        {eventType: 'mouse-over', overlayId: 'o2', featureId: 'f2', subfeatureId: 'sf2'}]);
            expect(Sublayers.send).toHaveBeenCalled();

            // expect publish to be called on the error channel.
            expect(eventing.publish).toHaveBeenCalled();
            expect(eventing.publish.mostRecentCall.args[0]).toBe(Channels.MAP_FEATURE_STATUS_SUBLAYERS);
            expect(Error.send.calls.length).toBe(0);
        });

        it("unsubscribes the correct channel when removeHandlers is called", function() {

            var eventing = OWF.Eventing;

            spyOn(Sublayers, 'removeHandlers').andCallThrough();
            spyOn(Error, 'send');
            spyOn(eventing, 'unsubscribe');

            Sublayers.removeHandlers();
            expect(Sublayers.removeHandlers).toHaveBeenCalled();
            expect(eventing.unsubscribe.mostRecentCall.args[0]).toBe(Channels.MAP_FEATURE_STATUS_SUBLAYERS);

            expect(Error.send.calls.length).toBe(0);

        });

        it("wraps added handlers and passes along any optional elements", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = Sublayers.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toBe(Channels.MAP_FEATURE_STATUS_SUBLAYERS);

            var jsonVal = {
                overlayId: 'o',
                overlayName: 'overlay',
                featureId: 'f',
                featureName: 'feature',
                subfeatureId: 'sf'
            };
            var sender = {
                id: INSTANCE_ID
            };

            // Spy on Error and call our wrapper handler.
            spyOn(Error, 'send');
            newHandler(Ozone.util.toString(sender), Ozone.util.toString(jsonVal));

            // We don't expect error to be called
            expect(Error.send.calls.length).toBe(0);

            // We DO expect testHandler to have been called and event type to have been filled in
            expect(testHandler.calls.length).toBe(1);
            expect(testHandler.mostRecentCall.args[1]).toBe('o');
            expect(testHandler.mostRecentCall.args[2]).toBe('overlay');
            expect(testHandler.mostRecentCall.args[3]).toBe('f');
            expect(testHandler.mostRecentCall.args[4]).toBe('feature');
            expect(testHandler.mostRecentCall.args[5]).toBe('sf');
        });

        it("wraps added handlers and passes along any optional elements without breaking on array",
            function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = Sublayers.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toBe(Channels.MAP_FEATURE_STATUS_SUBLAYERS);

            var jsonVal = [{
                overlayId: 'o',
                overlayName: 'overlay',
                featureId: 'f',
                featureName: 'feature',
                subfeatureId: 'sf'
            },{
                overlayId: 'o2',
                overlayName: 'overlay2',
                featureId: 'f2',
                featureName: 'feature2',
                subfeatureId: 'sf2'
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
            expect(testHandler.mostRecentCall.args[1]).toBe('o2');
            expect(testHandler.mostRecentCall.args[2]).toBe('overlay2');
            expect(testHandler.mostRecentCall.args[3]).toBe('f2');
            expect(testHandler.mostRecentCall.args[4]).toBe('feature2');
            expect(testHandler.mostRecentCall.args[5]).toBe('sf2');
        });
    });
});

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
define(["cmwapi/Channels", "cmwapi/map/status/About", "cmwapi/map/Error", "cmwapi/Validator",
    "test/mock/OWF", "test/mock/Ozone"], 
    function(Channels, About, Error, Validator, OWF, Ozone) {

    describe("Map.status.about calls and handlers", function() {

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

        it("map.status.about", function() {
            spyOn(About, 'send').andCallThrough();
            spyOn(Error, 'send');
            spyOn(Ozone.util, 'toString').andCallFake( function(jsonStruct) {
                return jsonStruct;
            });
            var eventing = OWF.Eventing;
            spyOn(eventing, 'publish');

            About.send({version: "1.1", type: "2-D", widgetName: "Widget Foo"});
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


            About.send({type: "2-D", widgetName: "Widget Foo"});
            expect(About.send).toHaveBeenCalled();About
            expect(Error.send.calls.length).toEqual(1);
            expect(eventing.publish.calls.length).toEqual(0);

            About.send({version: "1.1", type: "foo", widgetName: "Widget Foo"});
            expect(About.send).toHaveBeenCalled();
            expect(Error.send.calls.length).toEqual(2);
            expect(eventing.publish.calls.length).toEqual(0);

            About.send({version: "1.1", type: "3-D"});
            expect(About.send).toHaveBeenCalled();
            expect(Error.send.calls.length).toEqual(3);
            expect(eventing.publish.calls.length).toEqual(0);

            About.send({version: "1.1", type: "3-D", widgetName: ''});
            expect(About.send).toHaveBeenCalled();
            expect(Error.send.calls.length).toEqual(4);
            expect(eventing.publish.calls.length).toEqual(0);

            //About.send(null, null, null);
            About.send({});
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

        it("Test error handling for map.status.about", function() {

            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = About.addHandler(testHandler);
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_STATUS_ABOUT);

            // This won't actually get called: remember, asynchronous eventing: I'm still waiting for a publish
            //expect(testHandler).toHaveBeenCalled();
            // But I can test the behavior for newHandler!
            var jsonVal = {
                //version: '1.1.0',      missing version value
                type: '2-D',
                widgetName: 'CMWAPI Spec widget'
            };
            spyOn(Ozone.util, 'parseJson').andReturn(jsonVal);
            spyOn(Error, 'send');

            newHandler('senderFoo', jsonVal );

            expect(Error.send.calls.length).toEqual(1);


            expect(testHandler.calls.length).toEqual(0);
        });


        it("Test that handler gets passed object arrays", function() {


            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = About.addHandler(testHandler);            
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_STATUS_ABOUT);

            // Test the behavior for newHandler  Create a sender an empty payload to pass along
            var jsonVal = [{
                version: '1.1.0',
                type: '2-D',
                widgetName: 'CMWAPI Spec widget'
            },{
                version: '1.3.0',
                type: '2-D',
                widgetName: 'CMWAPI Spec Test widget'
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
            // carry through unchanged.  
            expect(testHandler.calls.length).toEqual(1);
            expect(testHandler.mostRecentCall.args[1].length).toEqual(2);
            expect(testHandler.mostRecentCall.args[1][0].version).toEqual("1.1.0");
            expect(testHandler.mostRecentCall.args[1][0].type).toEqual("2-D");
            expect(testHandler.mostRecentCall.args[1][0].widgetName).toEqual("CMWAPI Spec widget");

            expect(testHandler.mostRecentCall.args[1][1].version).toEqual("1.3.0");
            expect(testHandler.mostRecentCall.args[1][1].type).toEqual("2-D");
            expect(testHandler.mostRecentCall.args[1][1].widgetName).toEqual("CMWAPI Spec Test widget");

        });

        it("Test that handler only sends back one error, even with multiple objects in array", function() {


            var eventing = OWF.Eventing;
            spyOn(eventing, 'subscribe');

            var testHandler = jasmine.createSpy('testHandler');
            var newHandler = About.addHandler(testHandler);            
            expect(eventing.subscribe.mostRecentCall.args[0]).toEqual(Channels.MAP_STATUS_ABOUT);

            // Test the behavior for newHandler  Create a sender an empty payload to pass along
            var jsonVal = [{
                //version: '1.1.0',     // missing version
                type: '2-D',
                widgetName: 'CMWAPI Spec widget'
            },{
                //version: '1.3.0',     // missing version
                //type: '2-D',
                type: 'foo',    // bad type
                widgetName: 'CMWAPI Spec Test widget'
            }];
            var sender = {
                id: INSTANCE_ID
            };

            // Spy on Error and call our wrapper handler.
            spyOn(Error, 'send');
            newHandler(Ozone.util.toString(sender), jsonVal); 

            // We expect error to be called only once
            expect(Error.send.calls.length).toEqual(1);

            expect(testHandler.calls.length).toEqual(0);

        });


    });
});

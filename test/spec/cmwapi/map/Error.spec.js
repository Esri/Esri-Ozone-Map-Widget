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
define(["cmwapi/Channels", "cmwapi/map/Error", "test/mock/OWF", "test/mock/Ozone"], 
    function(Channels, Error, OWF, Ozone) {

    describe("The Error Module ", function() {

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


        it("registers on the appropriate channel", function() {
            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(Error, 'addHandler').andCallThrough();
            spyOn(eventing, 'subscribe');

            Error.addHandler(function() {});
            expect(Error.addHandler).toHaveBeenCalled();
            expect(eventing.subscribe).toHaveBeenCalled();

        });

        it("if given invalid data, sends out an error", function() {

            spyOn(Error, 'send').andCallThrough();

            Error.send('foo');  // not given an object, not given an array of objects, but given something
            expect(Error.send).toHaveBeenCalled();

            // expect it's going to send out an error on its own error receipt...
            expect(Error.send.calls.length).toEqual(2);
            expect(Error.send.mostRecentCall.args[1]).toEqual(Channels.MAP_ERROR);
        });

        it("if given null data, sends out an error", function() {

            spyOn(Error, 'send').andCallThrough();

            Error.send();  
            expect(Error.send).toHaveBeenCalled();

            // expect it's going to send out an error on its own error receipt...
            expect(Error.send.calls.length).toEqual(2);
            expect(Error.send.mostRecentCall.args[1]).toEqual(Channels.MAP_ERROR);
        });


        it("if given an object without all required fields, sends out an error", function() {

            spyOn(Error, 'send').andCallThrough();

            // not giving it sender...
            var sendPayload = { msg: 'foo', type: 'any', error: 'error'};
            Error.send(sendPayload);  
            expect(Error.send).toHaveBeenCalled();

            // expect it's going to send out an error on its own error receipt...
            expect(Error.send.calls.length).toEqual(2);
            expect(Error.send.mostRecentCall.args[1]).toEqual(Channels.MAP_ERROR);
            expect(Error.send.mostRecentCall.args[3]).toMatch(/^Missing/);
        });


        it("if given an array where some objects are valid, sends out set that are valid...", function() {

            var eventing = OWF.Eventing;
            expect(eventing).not.toBe(null);

            spyOn(Error, 'send').andCallThrough();
            spyOn(eventing, 'publish');
    
            // not giving it sender...
            var sendPayload1 = { msg: 'foo', type: 'any', error: 'error'};
            var sendPayloadGood = { sender: 1, msg: 'foo', type: 'any', error: 'error'};

            Error.send([sendPayloadGood, sendPayload1, sendPayloadGood]);  
            expect(Error.send).toHaveBeenCalled();

            // expect it's going to send out an error on its own error receipt...
            expect(Error.send.calls.length).toEqual(2);     // will get called once, and call itself with an error once
            expect(Error.send.mostRecentCall.args[1]).toEqual(Channels.MAP_ERROR);
            expect(Error.send.mostRecentCall.args[3]).toMatch(/^Missing/);

            // will ALSO send out on the eventing channel 2 more times..., for a grand total of 3 
            // (one as its own error, 2 for the good items)
            expect(eventing.publish.calls.length).toEqual(3); 
        
        });

    });
});

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
define(["cmwapi/cmwapi"], function(Map) {

    /**
     * Most of the functional tests have been pushed down into the various modules that create the
     * CMWAPI 1.1 implementation.  This top level file presently serves as an example
     * of how to setup tests for a module and mock the OWF framework.
     */
    describe("Common Map API tests", function() {

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

            var errorHandler = Map.error;
            var statusHandler = Map.status;

            window.OWF = OWF;
            window.Ozone = Ozone;

            window.statusHandler = statusHandler;
            window.errorHandler = errorHandler;
        });

        afterEach(function() {
            // Remove our mock objects from the window so neither they nor
            // any spies upon them hang around for other test suites.
            delete window.OWF;
            delete window.Ozone;

            delete window.statusHandler;
            delete window.errorHandler;
        });

        describe("A suite", function() {

            it("contains spec with an expectation", function() {
                expect(true).toBe(true);
            });

            var statusHandler = Map.status;
            it("Map.status is not null", function() {
                expect(statusHandler).not.toBe(null);
            });
        });

    });
});

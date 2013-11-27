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
define(["cmwapi/cmwapi", "cmwapi-adapter/cmwapi-adapter"], function(CommonMapApi, Adapter) {

    describe("To test ESRI Common Map API adapter", function() {

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
                }
            };
            var Ozone = {
                util: {
                    toString : function() {
                    },
                    parseJson : function() {}
                }
            };

            var errorHandler = CommonMapApi.error;
            var statusHandler = CommonMapApi.status;

            window.OWF = OWF;
            window.Ozone = Ozone;

            window.statusHandler = statusHandler;
            window.errorHandler = errorHandler;

            // TODO: Mock Esri Map object
            var Map = function() {
                this.geographicExtent= {
                    xmin: 0,
                    ymin: 0,
                    xmax: 0,
                    ymax: 0,
                    getCenter: function() {
                        return {x: 0, y: 0};
                    }
                };
            };
            window.Map = Map;
        });

        afterEach(function() {
            // Remove our mock objects from the window so neither they nor
            // any spies upon them hang around for other test suites.
            delete window.OWF;
            delete window.Ozone;

            delete window.statusHandler;
            delete window.errorHandler;

            delete window.Map;
        });

        it("test syntax in adapter module definition", function() {
            // Verify the module can be initialized without errors
            var map = new Map();

            var instance = new Adapter(map);
        });

        it("test that overlay adapter dependency is brought in", function() {
            expect(true).toBe(false);
        });

        it("test that feature adapter dependency is brought in", function() {
            expect(true).toBe(false);
        });

        it("test that status adapter dependency is brought in", function() {
            expect(true).toBe(false);
        });

        it("test that error adapter dependency is brought in", function() {
            expect(true).toBe(false);
        });
    });
});

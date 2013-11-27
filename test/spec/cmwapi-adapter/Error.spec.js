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
define(["cmwapi/cmwapi", "cmwapi-adapter/Error", "test/mock/esriMap", "test/mock/OWF", "test/mock/Ozone"],
        function(CommonMapApi, Error, Map, OWF, Ozone) {
     describe("To test the CMWAPI Adapter error module", function() {
        beforeEach(function() {
            // Mock the necessary OWF methods and attach them to the window.
            // OWF should be in global scope when other libraries attempt to
            // access it.
            window.OWF = OWF;
            window.Ozone = Ozone;
            window.Map = Map;
        });

        afterEach(function() {
            // Remove our mock objects from the window so neither they nor
            // any spies upon them hang around for other test suites.
            delete window.OWF;
            delete window.Ozone;
            delete window.Map;
        });

        it("verify that the error module object can be created without error", function() {
            var error = new Error();
            expect(error).toBeDefined();
        });

        describe("and verify that proper api calls are used", function() {
            beforeEach(function() {
                spyOn(CommonMapApi.error, 'addHandler').andCallThrough();
                spyOn(CommonMapApi.error, 'send').andCallThrough();
            });

            it("verify that the handler is added to the channel", function() {
                expect(CommonMapApi.error.addHandler).not.toHaveBeenCalled();

                var error = new Error();

                expect(CommonMapApi.error.addHandler).toHaveBeenCalled();
            });

            it("verify that the proper call is made by the error function", function() {
                expect(CommonMapApi.error.send).not.toHaveBeenCalled();

                var error = new Error();

                expect(CommonMapApi.error.send).not.toHaveBeenCalled();

                var caller = "FakeWidget";
                var message = "Test error message";
                var type = "test_error_type";
                var err = {
                    message: message,
                    type: type
                };

                error.error(caller, message, err);

                expect(CommonMapApi.error.send).toHaveBeenCalledWith(caller, type, message, err);
            });
        });
    });
});
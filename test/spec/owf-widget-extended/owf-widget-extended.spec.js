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
 define(["test/mock/OWF", "test/mock/Ozone", "owf-map-widget/js/owf-widget-extended"],
        function(OWF, Ozone, OWFExtended) {

 xdescribe("Testing widget instance preferences", function() {

 	it("Verify save of widget instance preference...", function() {
 		this.fail(Error());
 	});

 	it("Verify get of widget instance preference...", function() {
 		this.fail(Error());
 	});

 	it("Verify delete of widget instance preference...", function() {
 		this.fail(Error());
 	});

 });

 describe("Testing generation of preference ids", function() {

   beforeEach(function() {
        // Mock the necessary OWF methods and attach them to the window.
        // OWF should be in global scope when other libraries attempt to
        // access it.
        window.OWF = OWF;
        window.Ozone = Ozone;
    });

    it("Testing interaction with Preferences, period", function() {
    	OWF.Preferences.setUserPreference();
    });

 	it("Good preference inputs", function() {

 		// no error
 		OWFExtended.Preferences._generateInstancePreferenceName({namespace: 'foo.bar.com', name: 'bar123'});

 	});

 	it("No namespace given", function() {
 		OWFExtended.Preferences._generateInstancePreferenceName({ name: 'foo'});
 	});

 	it("No name given", function() {
		OWFExtended.Preferences._generateInstancePreferenceName({ namespace: 'foo.bar.com.xxxx.yyyyyyy'});

 	});

 	it("Neither namespace nor name given", function() {

 		OWF.Preferences._generateInstancePreferenceName({ });

 		OWF.Preferences._generateInstancePreferenceName();
 	});


 });

});
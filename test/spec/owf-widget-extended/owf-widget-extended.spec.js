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
        function(OWF, Ozone, OWFWidgetExtended) {

 describe("Testing widget instance preferences", function() {

   beforeEach(function() {
        // Mock the necessary OWF methods and attach them to the window.
        // OWF should be in global scope when other libraries attempt to
        // access it.
        window.OWF = OWF;
        window.Ozone = Ozone;
    });

 	it("Verify save of widget instance preference...", function() {
 		spyOn(OWF.Preferences, 'setUserPreference');

 		
		OWFWidgetExtended.Preferences.setWidgetInstancePreference(); 		
		expect(OWF.Preferences.setUserPreference).not.toHaveBeenCalled();
 		

 		OWFWidgetExtended.Preferences.setWidgetInstancePreference({name: 'foo', namespace: 'bar' });

 		var expectedId = "foo" + ":" + OWF.getInstanceId();
 		expect(OWF.Preferences.setUserPreference).toHaveBeenCalled();
 		expect(OWF.Preferences.setUserPreference).toHaveBeenCalledWith({name: expectedId, namespace: 'bar'});

 		OWFWidgetExtended.Preferences.setWidgetInstancePreference({}); 		
 		expectedId = ":" + OWF.getInstanceId();
		expect(OWF.Preferences.setUserPreference).toHaveBeenCalledWith({name: expectedId});

 	});

 	it("Verify get of widget instance preference...", function() {
 		spyOn(OWF.Preferences, 'getUserPreference');

 		
		OWFWidgetExtended.Preferences.getWidgetInstancePreference(); 		
		expect(OWF.Preferences.getUserPreference).not.toHaveBeenCalled();
 		

 		OWFWidgetExtended.Preferences.getWidgetInstancePreference({name: 'foo', namespace: 'bar' });

 		var expectedId = "foo" + ":" + OWF.getInstanceId();
 		expect(OWF.Preferences.getUserPreference).toHaveBeenCalled();
 		expect(OWF.Preferences.getUserPreference).toHaveBeenCalledWith({name: expectedId, namespace: 'bar'});

 		OWFWidgetExtended.Preferences.getWidgetInstancePreference({}); 		
 		expectedId = ":" + OWF.getInstanceId();
		expect(OWF.Preferences.getUserPreference).toHaveBeenCalledWith({name: expectedId});
 	});

 	it("Verify delete of widget instance preference...", function() {
 		spyOn(OWF.Preferences, 'deleteUserPreference');

 		
		OWFWidgetExtended.Preferences.deleteWidgetInstancePreference(); 		
		expect(OWF.Preferences.deleteUserPreference).not.toHaveBeenCalled();
 		

 		OWFWidgetExtended.Preferences.deleteWidgetInstancePreference({name: 'foo', namespace: 'bar' });

 		var expectedId = "foo" + ":" + OWF.getInstanceId();
 		expect(OWF.Preferences.deleteUserPreference).toHaveBeenCalled();
 		expect(OWF.Preferences.deleteUserPreference).toHaveBeenCalledWith({name: expectedId, namespace: 'bar'});

 		OWFWidgetExtended.Preferences.deleteWidgetInstancePreference({}); 		
 		expectedId = ":" + OWF.getInstanceId();
		expect(OWF.Preferences.deleteUserPreference).toHaveBeenCalledWith({name: expectedId});


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

 		var expectedId = "bar123:" + OWF.getInstanceId();

 		// no error
 		var preferenceId = OWFWidgetExtended.Preferences._generateInstancePreferenceName({namespace: 'foo.bar.com', name: 'bar123'});
 		expect(preferenceId).toMatch(expectedId + '$');
 	});

 	it("No name given", function() { 		

 		var expectedId = ":" + OWF.getInstanceId();
 		var preferenceId = OWFWidgetExtended.Preferences._generateInstancePreferenceName({});
 		expect(preferenceId).toMatch(expectedId + '$');

 		var preferenceId = OWFWidgetExtended.Preferences._generateInstancePreferenceName();
 		expect(preferenceId).toMatch(expectedId + '$');
		
 	});


 });

});
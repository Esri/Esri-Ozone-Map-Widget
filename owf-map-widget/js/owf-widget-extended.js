/**
 * @copyright © 2013 Environmental Systems Research Institute, Inc. (Esri)
 *
 * @license
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at<br>
 * <br>
 *     {@link http://www.apache.org/licenses/LICENSE-2.0}<br>
 * <br>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @description Helpful extensions to OWF widget APIs.  
 *
 * Developed on behalf of Esri
 *
 * Assumes inclusion in an OWF environment
 *
*/

OWF = window.OWF ? window.OWF : {};

OWF.Preferences = OWF.Preferences ? OWF.Preferences : {};

/*
 * 
 * WidgetInstancePreference refers to preferences stored/retrieved for a particular
 *    instance of a widget on a dashboard.  E.g., if there are two Esri map widgets on
 *    on a dashboard, saving the instance preferences for one will keep its data unique 
 *    from the data stored for another.
 *
 * Because the original use case intended may include semi-sizable configuration data which 
 *    may be longer than the preferences API, this API also handles segmenting preference data
 *    and then recombining it upon retrieval.
 *
 * Caution: as with all preferences data, be wary of storing preference data that (1) should only be 
 *    viewable by specific users, as administrative users can see preference data, or (2) is considered 
 *    too sensitive to store in other than specially protected databases.  
*/

OWF.Preferences.getWidgetInstancePreference = function() {

};

OWF.Preferences.setWidgetInstancePreference = function() {

};

OWF.Preferences.deleteWidgetInstancePreference = function() {

};
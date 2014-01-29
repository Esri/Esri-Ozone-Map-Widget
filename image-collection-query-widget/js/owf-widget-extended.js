define(
     [],       // no dependencies...  since OWF isn't wrapped as a Require module, pulling from window

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

function() {

     OWF = window.OWF ? window.OWF : {};

     OWF.Preferences = OWF.Preferences ? OWF.Preferences : {};

     /*
      * 
      * WidgetInstancePreference refers to preferences stored/retrieved for a particular
      *    instance of a widget on a dashboard.  E.g., if there are two Esri map widgets on
      *    on a dashboard, saving the instance preferences for one will keep its data unique 
      *    from the data stored for another.
      *
      * TODO: Because the original use case intended may include semi-sizable configuration data which 
      *    may be longer than the preferences API, this API should also handle segmenting preference data
      *    and then recombining it upon retrieval.
      *
      * Caution: as with all preferences data, be wary of storing preference data that (1) should only be 
      *    viewable by specific users, as administrative users can see preference data, or (2) is considered 
      *    too sensitive to store in other than specially protected databases.  
     */

     /**
      @description Retrieves the user preference for the provided name and namespace, for the calling widget instance
      @name getWidgetInstancePreference
      @methodOf OWF.Preferences

      @param {Object} cfg config object see below for properties
      @param {String} cfg.namespace The namespace of the requested user preference
      @param {String} cfg.name The name of the requested user preference
      @param {Function} cfg.onSuccess The function to be called if the user preference is successfully retrieved from
        the database.  This function takes a single argument, which is a JSON object.  See getUserPreference for its format.
      @param {Function} [cfg.onFailure] Optional function parameter, again aligned with getUserPreference.
     */     
     OWF.Preferences.getWidgetInstancePreference = function(cfg) {
          if (cfg) {
               cfg.namespace = genInstanceName(cfg);
               OWF.Preferences.getUserPreference(cfg);
          }          
     };

     OWF.Preferences.setWidgetInstancePreference = function(cfg) {
          if (cfg) {
               //cfg.name = genInstanceName(cfg);
               cfg.namespace = genInstanceName(cfg);
               OWF.Preferences.setUserPreference(cfg);
          }
     };

     OWF.Preferences.deleteWidgetInstancePreference = function(cfg) {
          if (cfg) {
               cfg.namespace = genInstanceName(cfg);
               OWF.Preferences.deleteUserPreference(cfg);
          }
     };


     /**
      @description Generates a name for this user preference that's unique to the widget instance
      @name _generateInstancePreferenceName
      @methodOf OWF.Preferences
      @access private

      @param {Object} [cfg] config object see below for properties
      @param {String} [cfg.name] The name of the requested user preference
      */
     var genInstanceName = function(cfg) {
          var widgetId = OWF.getInstanceId();

          //var name = (cfg && cfg.name) ? cfg.name + ":" + widgetId : ":" + widgetId;
          //var name = (cfg && cfg.name) ? cfg.name + "." + widgetId : "." + widgetId;
          var name = (cfg && cfg.namespace) ? cfg.namespace + "." + widgetId : "." + widgetId;

          return name;

     };

     // exposed for testing purposes... 
     OWF.Preferences._generateInstancePreferenceName = genInstanceName;

     return OWF;
}
);
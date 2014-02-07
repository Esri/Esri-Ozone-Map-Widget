define('cmwapi/Validator', function() {

    var SUPPORTED_STATUS_TYPES = ["about", "format", "view"];
    var SUPPORTED_MAP_TYPES = ["2-D","3-D","other"];

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
     * @description A utility class for validating various message elements used for the
     * [CMWAPI 1.1 Specification](http://www.cmwapi.org).  This validator
     * has static members that specify the supported map status types and map types allowed as well
     * a number of functions for checking latitude/longitude pairs, various type fields, and bounding
     * boxes for map views.
     *
     * @version 1.1
     *
     * @exports cmwapi/Validator
     */
    var Validator = {
        /**
         * An array of valid status message type strings.  The [CMWAPI 1.1 Specification](http://www.cmwapi.org)
         * allows for "about", "format", and "view".
         */
        SUPPORTED_STATUS_TYPES: SUPPORTED_STATUS_TYPES,
        /**
         * An array of allowed/expected type strings of map widgets responding to CMWAPI about requests.
         * The [CMWAPI 1.1 Specification](http://www.cmwapi.org) allows for "2-D", "3-D", and "other".
         */
        SUPPORTED_MAP_TYPES: SUPPORTED_MAP_TYPES,

        /**
         * Validate the input type against the supported map types.
         * @param types {Array<string>} The types to validate.
         * @returns {module:cmwapi/Validator~Result}
         */
        validMapType: function(type) {
            var retVal = {
                result: false,
                msg: type + ' is not a supported map type'
            };

            if (type) {
                for (var i = 0; i < SUPPORTED_MAP_TYPES.length; i++) {
                    if (SUPPORTED_MAP_TYPES[i] === type) {
                        retVal.result = true;
                        retVal.msg = "";
                    }
                }
            }

            return retVal;
        },

        /**
         * Validate the input types against the supported map status request types.
         * @param types {Array<string>} The types to validate.
         * @returns {module:cmwapi/Validator~Result}
         */
        validRequestTypes: function(types) {
            var retVal = {
                result: true,
                msg: ""
            };

            if (types) {
                for (var i = 0; i < types.length; i++  ) {
                    var found = false;
                    for (var j = 0; j < SUPPORTED_STATUS_TYPES.length; j++ ) {
                        if (SUPPORTED_STATUS_TYPES[j] === types[i]) {
                            found = true;
                        }
                    }
                    if (!found) {
                        retVal.result = false;
                        retVal.msg += types[i] + ' is not a supported map status request type. ';
                    }
                }
            }
            return retVal;
        },

        /**
         * Validate a set of bounds used to drive view messages in the CMWAPI.  Bounds require
         * latitude/longitude values for the southwest and northeast corners of a bounding box on map.
         * @param {Object} bounds Information about the bounding view.
         * @param {Object} bounds.southWest The southwest corner object with attributes
         * @param {number} bounds.southWest.lat A latitude value
         * @param {number} bounds.southWest.lon A longitude value
         * @param {Object} bounds.northEast The northeast corner object with attributes
         * @param {number} bounds.northEast.lat A latitude value
         * @param {number} bounds.northEast.lon A longitude value
         * @returns {module:cmwapi/Validator~Result}
         */
        validBounds: function(bounds) {
            if (!bounds) {
                return {result: false, msg: 'Bounds are required'};
            }
            if (!bounds.southWest) {
                return {result: false, msg: 'Bounds needs southWest coordinates'};
            } else if (!this.validLatLon(bounds.southWest.lat, bounds.southWest.lon)) {
                return {result: false, msg: 'Bounds requires a valid southWest lat/lon pair [' + bounds.southWest.lat + ',' + bounds.southWest.lon +"]"};
            }
            if (!bounds.northEast) {
                return {result: false, msg: 'Bounds needs northEest coordinates'};
            } else if (!this.validLatLon(bounds.northEast.lat, bounds.northEast.lon)) {
                return {result: false, msg: 'Bounds requires a valid northEast lat/lon pair [' + bounds.northEast.lat + ',' + bounds.northEast.lon +"]"};
            }

            return {result: true, msg:""};
        },

        /**
         * Validates the center point as latitude/longitude value.
         * @param {Object} center A point on which to center a map.
         * @param {number} center.lat The latitude value in decimal degrees.
         * @param {number} center.lon The longitude value in decimal degrees.
         * @returns {module:cmwapi/Validator~Result}
         */
        validCenter: function(center) {
            if (!center) {
                return {result: false, msg: 'Center is required'};
            }

            if (!this.validLatLon(center.lat, center.lon)) {
                return {result: false, msg: 'Center requires a valid lat/lon pair [' + center.lat + ',' + center.lon +"]"};
            }
            return {result: true, msg:""};
        },

        /**
         * Validates the range as a positive number.  Note that individual maps may accept any valid range but
         * round them to a set of discrete values.  Such refinement is responsibility of any client code/maps using
         * this function.
         * @param {number} range A range value specifying a map's potential zoom level.
         * @returns {module:cmwapi/Validator~Result}
         */
        validRange: function(range) {
           if (!range) {
               return {result: false, msg: 'Range is required'};
           }
           // check that range is a number, and greater than 0
           if (!(this.isNumber(range) && (range > 0))) {
               return {result: false, msg: 'Range must be numeric and >= 0 [' + range + ']'};
           }
           return {result: true, msg:""};
        },

        /**
         * Validates the structure of a Drag and Drop data payload.  The CMWAPI specificies a particular
         * format for drag and drop data.  This method will check the structure and return a description
         * of any errors found.  Note that this method will not alter the structure of the payload. Payloads must
         * include at least one of a marker, feature, or featureUrl attribute.
         * @param {Object} payload A point on which to center a map.
         * @param {string} [payload.overlayId] The ID of the overlay.  This is optional.  If missing, client code is expected to use the sending widget's ID.
         * @param {string} payload.featureId The ID of the feature.  If an ID is not specified, an error is generated.
         * @param {string} [payload.name] The name of the feature.  Names are optional, not unique and are meant purely for display purposes.
         * @param {boolean} [payload.zoom] Boolean denoting whether or not to zoom to the feature.  This is optional and not validated at present.
         * @param {Object} [payload.marker]
         * @param {string} [payload.marker.details] An optional marker description. No validation is performed on this.
         * @param {string} [payload.marker.iconUrl] An optional marker icon URL.  No validation is performed on this at present.
         * @param {Object} [payload.feature]
         * @param {string} payload.feature.format The format of the feature.  Valid values depend on CMWAPI implementations.  This is
         *     merely checked for existence.
         * @param {string} payload.feature.featureData The data of the feature.  This should be a non-empty string.
         * @param {Object} [payload.featureUrl]
         * @param {string} payload.featureUrl.format The format of the feature.  Valid values depend on CMWAPI implementations.  This is
         *     merely checked for existence.
         * @param {string} payload.featureUrl.url The URL of the feature data.
         * @param {Object} [payload.featureUrl.params] A JSON object of parameters to be added to the URL during a feature request from a server.
         *     According to the [CMWAPI 1.1 Specification](http://www.cmwapi.org), params may be ignored unless the format is
         *     set to "wms".  Also, request, exceptions, SRS/CRS, widgeth, height, and bbox params should not be passed in
         *     as they are determined by the map as needed.  Finally, all parameters should <em>not</em> be URL encoded.
         */
        validDragAndDropPayload: function(payload) {
            var retVal = {result: true, msg: ''};

           if (!payload) {
               return {result: false, msg: 'A drag and drop payload is required for validation.'};
           }

           // Check that we have at least one of a marker, feature, or feature URL.
           if ((typeof payload.marker === 'undefined') && (typeof payload.feature === 'undefined') &&
               (typeof payload.featureUrl === 'undefined')) {
                retVal.result = false;
                retVal.msg += 'At least one of a marker, feature, or featureUrl are required. ';
           }

           // check that range is a number, and greater than 0
           if (!payload.featureId) {
               retVal.result = false;
               retVal.msg += 'Need a featureId for this drag and drop request. ';
           }

           // Check any features for required fields.
           if (payload.feature) {
                if (typeof payload.feature.format === 'undefined') {
                    retVal.result = false;
                    retVal.msg += 'format is a required parameter in drag and drop payloads for features via string data. ';
                }
                if (typeof payload.feature.featureData === 'undefined') {
                    retVal.result = false;
                    retVal.msg += 'featureData is a required parameter in drag and drop payloads for features via string data. ';
                }
           }

           // Check any featureUrls for required fields.
           if (payload.featureUrl) {
                if (typeof payload.featureUrl.format === 'undefined') {
                    retVal.result = false;
                    retVal.msg += 'format is a required parameter in drag and drop payloads for features via URL. ';
                }
                if (typeof payload.featureUrl.url === 'undefined') {
                    retVal.result = false;
                    retVal.msg += 'url is a required parameter in drag and drop payloads for features via URL. ';
                }
           }

           return retVal;
        },

        /**
         * Validates a basic payload structure.  Payloads handed to channels are expected to be Objects or Arrays of
         * Objects.  This function will check the type of the input to see if it is an object or object
         * array.  Undefined inputs are considered valid and returned as an array containing
         * a single empty object. Note that this function does not evaluate individual payload attributes.
         * @returns {module:cmwapi/Validator~PayloadResult}
         */
        validObjectOrArray: function(data) {
            var retVal = {
                result: true,
                msg:"",
                payload: undefined
            };

            if ( typeof data === 'undefined' ) {
                retVal.payload = [{}];
            }
            else if( Object.prototype.toString.call( data ) === '[object Array]' ) {
                retVal.payload = data;
            }
            else if (typeof data === 'object') {
                retVal.payload = [data];
            }
            else {
                retVal.result = false;
                retVal.msg = "Input data should be an object or array of like objects.";
            }
            return retVal;
        },

        /**
         * A basic number validator that checks that the value can be parsed as a float and in finite in value.
         * @param {number} n A value to test
         * @returns {boolean}
         */
        isNumber: function(n) {
            // from http://stackoverflow.com/a/1830844
           return !isNaN(parseFloat(n)) && isFinite(n);
        },

        /**
         * A basic string test that should handle both literal and Object based strings. Note that stringified JSON
         * objects passed in as data will return true since they are in a string format.
         * @see http://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
         */
        isString: function(data) {
            // The first type will also catch stringified json.
            return (typeof data === "string" || Object.prototype.toString(data) === '[object String]');
        },

        /**
         * A basic Array test that should handle both literal and Object based strings.
         * @see http://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
         */
        isArray: function(data) {
            return (Object.prototype.toString.call( data ) === '[object Array]');
        },

        /**
         * Validates a latitude, longitude pair in decimal degrees.
         * @param {number} lat A latitude in decimal degrees
         * @param {number} lon A longitude in decimal degrees
         * @returns {boolean}
         */
        validLatLon: function(lat,lon) {
            // Check that both are numbers.
            if (!this.isNumber(lat) || !this.isNumber(lon)) {
                return false;
            }
            // Verify the latitude and longitude ranges.
            if ((lat < -90) || (lat > 90) || (lon < -180) || (lon > 180)) {
                return false;
            }
            return true;
        },

        /**
         * Validate the input type against the values in the input list.
         * @param types {Array<string>} The allowed values.
         * @param item {string} The value to test.
         * @returns {module:cmwapi/Validator~Result}
         */
        containsValue : function(allowedValues, item) {
            if (typeof item !== "undefined") {
                if (this.isArray(allowedValues)) {
                    for (var i = 0; i < allowedValues.length; i++) {
                        if (allowedValues[i] === item) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        /**
         * A validation results object that includes the boolean result and an error message if
         * validation fails.
         * @typedef {Object} module:cmwapi/Validator~Result
         * @property {boolean} result True, if validation passes; false, otherwise
         * @property {string} msg An error message denoting types of errors when validation fails
         */

        /**
         * A validation results object that includes the boolean result and an error message if
         * validation fails.  The payload array will contain an empty object if no input was given
         * or an array of objects that were passed in.
         * @typedef {Object} module:cmwapi/Validator~PayloadResult
         * @property {boolean} result True, if validation passes; false, otherwise
         * @property {Object[]} payload An array of payload objects
         * @property {string} msg An error message denoting types of errors when validation fails
         */
    };

    return Validator;

});

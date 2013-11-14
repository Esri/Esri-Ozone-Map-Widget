define('cmwapi/Validator', function() {

    var SUPPORTED_STATUS_TYPES = ["about", "format", "view"];
    var SUPPORTED_MAP_TYPES = ["2-D","3-D","other"];

    /**
     * A utility class for validating various message elements used for the 
     * [CMWAPI 1.1 Specification](http://www.cmwapi.org).  This validator
     * has static members that specify the supported map status types and map types allowed as well
     * a number of functions for checking latitude/longitude pairs, various type fields, and bounding
     * boxes for map views.
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
        validMapType : function(type) {
            if (type) {
                if (SUPPORTED_MAP_TYPES.indexOf(type) <= -1) {
                    return {result: false, msg: type + ' is not a supported map type'};
                }
            }
            return {result: true};
        },

        /**
         * Validate the input types against the supported map status request types.
         * @param types {Array<string>} The types to validate.
         * @returns {module:cmwapi/Validator~Result}
         */
        validRequestTypes : function(types) {
            if (types) {
                for (var i = 0; i < types.length; i++  ) {
                    if (SUPPORTED_STATUS_TYPES.indexOf(types[i]) <= -1) {
                        return {result: false, msg: types[i] + ' is not a supported a map status request type'};
                    }
                }
            }
            return {result: true};
        },

        /**
         * Validate a set of bounds used to drive view messages in the CMWAPI.  Bounds require
         * latitude/longitude values for the southwest and northeast corners of a bounding box on map.
         * @param {object} bounds Information about the bounding view.
         * @param {object} bounds.southWest The southwest corner object with attributes
         * @param {number} bounds.southWest.lat A latitude value
         * @param {number} bounds.southWest.lon A longitude value
         * @param {object} bounds.northEast The northeast corner object with attributes
         * @param {number} bounds.northEast.lat A latitude value
         * @param {number} bounds.northEast.lon A longitude value
         * @returns {module:cmwapi/Validator~Result}
         */
        validBounds : function(bounds) {
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

            return {result: true};
        },

        /**
         * Validates the center point as latitude/longitude value.
         * @param {object} center A point on which to center a map.
         * @param {number} center.lat The latitude value in decimal degrees.
         * @param {number} center.lon The longitude value in decimal degrees.
         * @returns {module:cmwapi/Validator~Result}
         */
        validCenter : function(center) {
            if (!center) {
                return {result: false, msg: 'Center is required'};
            }

            if (!this.validLatLon(center.lat, center.lon)) {
                return {result: false, msg: 'Center requires a valid lat/lon pair [' + center.lat + ',' + center.lon +"]"};
            }
            return {result: true};
        },

        /**
         * Validates the range as a positive number.  Note that individual maps may accept any valid range but
         * round them to a set of discrete values.  Such refinement is responsibility of any client code/maps using
         * this function.
         * @param {Number} range A range value specifying a map's potential zoom level.
         * @returns {module:cmwapi/Validator~Result}
         */
        validRange : function(range) {
           if (!range) {
               return {result: false, msg: 'Range is required'};
           }
           // check that range is a number, and greater than 0
           if (!(this.isNumber(range) && (range > 0))) {
               return {result: false, msg: 'Range must be numeric and >= 0 [' + range + ']'};
           }
           return {result: true};
        },

        /**
         * A basic number validator that checks that the value can be parsed as a float and in finite in value.
         * @param {number} n A value to test
         * @returns {boolean}
         */ 
        isNumber : function(n) {
            // from http://stackoverflow.com/a/1830844
           return !isNaN(parseFloat(n)) && isFinite(n);
        },

        /**
         * A basic string test that should handle both literal and Object based strings.
         * @todo using this limits the requirement of this api implementation on other libraries.  However, we
         *     may want to leverage dojo or underscore instead.
         * @see http://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
         */
        isString : function(data) {
            return (Object.prototype.toString(data) === '[object String]');
        },

        /**
         * A basic Array test that should handle both literal and Object based strings.
         * @todo This is similar to our isString implementation.  Using this limits the requirement of 
         *     this api implementation on other libraries.  However, we may want to leverage dojo or 
         *     underscore instead.
         * @see http://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
         */
        isArray : function(data) {
            return (Object.prototype.toString.call( data ) === '[object Array]');
        },

        /**
         * Validates a latitude, longitude pair in decimal degrees.
         * @param {number} lat A latitude in decimal degrees
         * @param {number} lon A longitude in decimal degrees
         * @returns {boolean}
         */
        validLatLon : function(lat,lon) {
            // Check that both are numbers.
            if (!this.isNumber(lat) || !this.isNumber(lon)) {
                return false;
            }
            // Verify the latitude and longitude ranges.
            if ((lat < -90) || (lat > 90) || (lon < -180) || (lon > 180)) {
                return false;
            }
            return true;
        }

        /**
         * A validation results object that includes the boolean result and an error message if
         * validation fails.
         * @typedef {Object} module:cmwapi/Validator~Result
         * @property {boolean} result True, if validation passes; false, otherwise
         * @property {string} msg An error message denoting types of errors when validation fails
         */
    };

    return Validator;

});

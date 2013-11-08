/**
 * Defines A utility class for validating various message elements used for the CMW API.
 * @todo Consider converting to a static class - this is instanced at present to allow supported request types to
 *       be passed in.  These are governed by the API spec and not by any specific map implementation.  
 *       They shouldn't be changed.
 * @todo Add a simple format validator to cover map types (i.e., 2D vs. 3D vs. Other)
 * 
 * @module cmwapi/Validator
 */
define('cmwapi/Validator', function() {
    /**
     * @constructor
     * @alias module:cmwapi/Validator
     */
    var Validator = function(types) {
        /** The types to consider valid. */
        this.types = types ? types : [];

        /**
         * Validate the input types against those provided when this validator was constructed.
         * @param types {Array<String>} The types to validate.
         * @returns {Boolean} True, if all are valid; Otherwise, it returns a JSON object with obj.result = false and
         * obj.msg set to an error message for the first invalid type.
         */
        this.validRequestTypes = function(types) {
            if (types) {
                for (var i = 0; i < types.length; i++  ) {
                    if (this.types.indexOf(types[i]) <= -1) {
                        return {result: false, msg: types[i] + ' is not a supported request type'};
                    }
                }
            }
            return {result: true};
        };

        /**
         * Validate a set of bounds used to drive view messages in the CMWAPI.  Bounds require
         * latitude/longitude values for the southwest and northeast corners of a bounding box on map.
         * @param bounds {Object} Information about the bounding view.
         * @param bounds.southWest The southwest corner
         * @param bounds.northEast The northeast corner
         * @returns {Boolean}
         */

        this.validBounds = function(bounds) {
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
        };

        /**
         * Validates the center point as latitude/longitude value.
         * @param center {Object} A point on which to center a map.
         * @param center.lat {Number} The latitude value in decimal degrees.
         * @param center.lon {Number} The longitude value in decimal degrees.
         * @returns {Boolean}
         */
        this.validCenter = function(center) {
            if (!center) {
                return {result: false, msg: 'Center is required'};
            }

            if (!this.validLatLon(center.lat, center.lon)) {
                return {result: false, msg: 'Center requires a valid lat/lon pair [' + center.lat + ',' + center.lon +"]"};
            }
            return {result: true};
        };

        /**
         * Validates the range as a positive number.  Note that individual maps may accept any valid range but
         * round them to a set of discrete values.  Such refinement is responsibility of any client code/maps using
         * this function.
         * @param range {Number} A range value specifying a map's potential zoom level.
         * @returns {Boolean|{result: false, msg: String}}
         */
        this.validRange = function(range) {
           if (!range) {
               return {result: false, msg: 'Range is required'};
           }
           // check that range is a number, and greater than 0
           if (!(this.isNumber(range) && (range > 0))) {
               return {result: false, msg: 'Range must be numeric and >= 0 [' + range + ']'};
           }
           return {result: true};
        };

        /**
         * A basic number validator that checks that the value can be parsed as a float and in finite in value.
         * @param n {Number}
         * @returns {Boolean}
         */ 
        this.isNumber = function(n) {
            // from http://stackoverflow.com/a/1830844
           return !isNaN(parseFloat(n)) && isFinite(n);
        };

        /**
         * Validates a latitude, longitude pair in decimal degrees.
         * @param lat {Number} A latitude in decimal degrees
         * @param lon {Number} A longitude in decimal degrees
         * @returns {Boolean}
         */
        this.validLatLon = function(lat,lon) {
            // Check that both are numbers.
            if (!this.isNumber(lat) || !this.isNumber(lon)) {
                return false;
            }
            // Verify the latitude and longitude ranges.
            if ((lat < -90) || (lat > 90) || (lon < -180) || (lon > 180)) {
                return false;
            }
            return true;
        };
    };

    return Validator;

});

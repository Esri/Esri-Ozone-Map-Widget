/**
 * Implementation of Common Map Widget API, v 1.1
 *
 * Developed on behalf of Esri
 *
 * Assumes inclusion in an OWF environment, and that its eventing capabilities are available
 *
 * Provides both a means to invoke the API (eventing channel), a way to receive the API,
 *  and metadata about the API calls, such that we can build a test harness
 *
 *  General pattern:
 *      request : invoke function
 *      handleRequest : means to handler for invocation, as well as receive info on who requested it
 *      requestMetadata : JSON structure used to build out views to test API
 *
 */


/**
 * @ignore
 */
var Map = Map ? Map : {};


/**
 * @ignore
 */
Map.status = Map.status ? Map.status : {};
Map.status = ( function ( ) {

    /**
     * Questions:
     *      status.about: version parameter: how to return that you support multiple versions?  and/or, how could you?
     *      status.about: widgetName: assume that's a "human-readable" name, rather than universal name?
     *
     *      status.view: would we filter out if the requester isn't me?
     */

    /**
     * Pattern of usage
     *      w1: send:  map.status.request  {types: [view]}
     *      m1: receive map.status.request
     *      m1: send: map.status.view {requester: w1, ... }
     *      w1: receive: map.status.view - and the requester matches, so it handles
     */

    /**
     * Channels used for messaging
     */
    var CHANNEL_REQUEST = "map.status.request", CHANNEL_VIEW = "map.status.view", CHANNEL_FORMAT = "map.status.format",
        CHANNEL_ABOUT = "map.status.about";

    var SUPPORTED_STATUS_TYPES = ["about", "format", "view"];

    var FORMATS_REQUIRED = ["kml", "wms"];

    validRequestTypes = function(types) {
        if (types) {
            for (var i = 0; i < types.length; i++  ) {
                if (!(SUPPORTED_STATUS_TYPES.indexOf(types[i]) > -1)) {
                    return {result: false, msg: types[i] + ' is not a supported request type'}
                }
            }
        }
        return {result: true};
    },
    validBounds = function(bounds) {
      if (!bounds) {
          return {result: false, msg: 'Bounds are required'}
      }
      if (!bounds.southWest) {
        return {result: false, msg: 'Bounds needs southWest coordinates'}
      } else if (!validLatLon(bounds.southWest.lat, bounds.southWest.lon)) {
        return {result: false, msg: 'Bounds requires a valid southWest lat/lon pair [' + bounds.southWest.lat + ',' + bounds.southWest.lon +"]"}
      }
      if (!bounds.northEast) {
        return {result: false, msg: 'Bounds needs northWest coordinates'}
      } else if (!validLatLon(bounds.northEast.lat, bounds.northEast.lon)) {
          return {result: false, msg: 'Bounds requires a valid northEast lat/lon pair [' + bounds.northEast.lat + ',' + bounds.northEast.lon +"]"}
      }

      return {result: true};
    },
    validCenter = function(center) {
        if (!center) {
            return {result: false, msg: 'Center is required'}
        }

        if (!validLatLon(center.lat, center.lon)) {
            return {result: false, msg: 'Center requires a valid lat/lon pair [' + center.lat + ',' + center.lon +"]"}
        }
        return {result: true};
    },
    validRange = function(range) {
       if (!range) {
           return {result: false, msg: 'Range is required'}
       }
       // check that range is a number, and greater than 0
       if (!(isNumber(range) && (range > 0))) {
           return {result: false, msg: 'Range must be numeric and >= 0 [' + range + ']'}
       }
       return {result: true};
    },
    isNumber = function(n) {
        // from http://stackoverflow.com/a/1830844
       return !isNaN(parseFloat(n)) && isFinite(n);
    },
    validLatLon = function(lat,lon) {
        if (!lat || !lon) {
            return false;
        }
        return true;        // TODO: Replace this with real validator
    }
    return {

        SUPPORTED_STATUS_TYPES : SUPPORTED_STATUS_TYPES,

        /**
         * DO the request for status
         * @param types : optional; array of strings; 1.1 only supports "about", "format", and "view"
         */
        request : function ( types ) {
            checkTypes = validRequestTypes(types);
            if (checkTypes.result) {
                // build JSON string for types
                var objTypes = {
                    types : types
                }

                OWF.Eventing.publish(CHANNEL_REQUEST, Ozone.util.toString(objTypes));
            } else {
                // TODO: get actual widget id
                Map.error.error( "1", CHANNEL_REQUEST, types, checkTypes.msg);
            }
        },

        /**
         * HANDLE a request for status...
         * @param handler : function; means of passing in function handler when message is received
         *   Will be given sender, as well as payload of request message (types).
         *   Since single item (types), working to leave it as JSON {types: []}
         *   TODO: Is that idea of sender important???
         *   TODO: how would we remove handlers here???
         */
        handleRequest : function( handler ) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function( sender, msg) {

                jsonMsg = Ozone.util.parseJson(msg);
                if (jsonMsg.types) {
                    checkTypes = validRequestTypes(jsonMsg.types);
                    if (checkTypes.result) {
                        handler(sender, jsonMsg.types)
                    } else {
                        Map.error.error( sender, CHANNEL_REQUEST, msg, checkTypes.msg);
                    }
                } else {
                    // if none requested, handle _all_
                    handler(sender, SUPPORTED_STATUS_TYPES);
                }
            }
            OWF.Eventing.subscribe(CHANNEL_REQUEST, newHandler );
            return newHandler;  // returning to make it easy to test!
        },

        /**
         * Method to send OUT view message.  Only real API requirement here is what goes out over the channel,
         *    not how it comes in...  we can optimize as need be for usage
         *
         * @param requester : optional; to whom to send, if not to everyone
         * @param bounds :
         *      { southWest { lat: , lon: }, northEast { lat: , lon: } }
         * @param center : { lat: , lon: }
         * @param range :
         */
        view : function ( requester, bounds, center, range) {

           /*
            Validate data provided
            */
            var msg = '';
            var isValidData = true;

            // validate bounds
            checkBounds = validBounds(bounds);
            if (!checkBounds.result) {
                msg += checkBounds.msg +';';
                isValidData = false;
            }
            checkCenter = validCenter(center);
            if (!checkCenter.result) {
                msg += checkCenter.msg+';';
                isValidData = false;
            }
            checkRange = validRange(range);
            if (!checkRange.result) {
                msg+=checkRange.msg+';';
                isValidData = false;
            }
            msgOut = Ozone.util.toString({requester: requester, bounds: bounds, center: center, range: range});
            if (!isValidData) {
                Map.error.error("1", CHANNEL_VIEW,
                    msgOut,
                    msg);
            } else {
                OWF.Eventing.publish(CHANNEL_VIEW, msgOut);
            }

        },

        /**
         * Invoke handler if CHANNEL_VIEW message received meets API specifications for map.status.view.
         * Otherwise, throw map.error
         *
         * @param handler: function has a parameter for sender, bounds, center, and range.
         *      Sender is string / widget id
         *      Bounds is { southWest: {lat: , lon: }, northEast: {lat: , lon: }}
         *      Center is { lat: , lon:  }
         *      Range is number
         *
         */
        handleView : function ( handler ) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function( sender, msg) {

                var isValidData = true;
                jsonMsg = Ozone.util.parseJson(msg);
                if (jsonMsg.requester) {
                    // no real validation going on here, and it's an optional item..
                }
                var checkResult = validBounds(jsonMsg.bounds);
                if (!checkResult.result) {
                    msg += checkResult.msg +';';
                    isValidData = false;
                }
                checkResult = validCenter(jsonMsg.center);
                if (!checkResult.result) {
                    msg += checkResult.msg +';';
                    isValidData = false;
                }
                checkResult = validRange(jsonMsg.range);
                if (!checkResult.result) {
                    msg += checkResult.msg +';';
                    isValidData = false;
                }
                if (isValidData) {
                    handler(sender, jsonMsg.requester, jsonMsg.bounds, jsonMsg.center, jsonMsg.range )
                } else {
                    var msgOut = Ozone.util.toString({requester: jsonMsg.requester, bounds: jsonMsg.bounds,
                        center: jsonMsg.center, range: jsonMsg.range});
                    Map.error.error(sender, CHANNEL_VIEW, msgOut, msg );
                }
            }

            OWF.Eventing.subscribe(CHANNEL_VIEW, newHandler);
            return newHandler;
        },

        FORMATS_REQUIRED : FORMATS_REQUIRED,

        /**
         * Send out the list of data formats that this map supports.
         *
         */
        formats : function ( formats ) {
            var sendFormats;

            // send at least FORMATS_REQUIRED
            if (formats instanceof Array) {
                sendFormats = FORMATS_REQUIRED.concat(formats);
            } else { sendFormats = FORMATS_REQUIRED; }

            // note: this may cause us to send the same format value more than once...
            // blend data given with FORMATS_REQUIRED...
            OWF.Eventing.publish(CHANNEL_FORMAT, Ozone.util.toString({formats: sendFormats}));
        },

        /**
         *
         * @param handler
         */
        handleFormats : function (handler) {


        },

        TYPES_ALLOWED : ["2-D", "3-D", "other"],

        /**
         *
         * @param version - what version (s??) of the Common Map Widget API that this map widget supports
         * @param type - one of TYPES_ALLOWED
         * @param widgetName - name of the map widget
         */
        about : function ( version, type, widgetName ) {

            // valid type

            // has some sort of widget name

            OWF.Eventing.publish(CHANNEL_ABOUT, Ozone.util.toString( {version: version, type: type, widgetName: widgetName}));


        },

        handleAbout : function (handler) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function( sender, msg) {

            }


            OWF.Eventing.subscribe(CHANNEL_ABOUT, newHandler);
        }

    };


})();

Map.error = Map.error ? Map.error : {};
Map.error = ( function () {
    var CHANNEL_ERROR = "map.error";

    /**
     * Questions:
     *  error sender: instance id or widget id? (inferring by example, need to ask on forums)
     *  error description: no common list, correct?
     */
    return {
        /**
         *
         * @param sender : sender of message that caused error
         * @param type : type of message that caused error (example seems to be cmwapi call: e.g., map.feature.hide)
         * @param msg : message that caused the error  (example seems to be payload}
         * @param error : a description of the error
         */
        error : function (sender, type, msg, error) {
            var sendPayload = { sender: sender,
                type: type,
                msg: msg,
                error: error
            }
            OWF.Eventing.publish(CHANNEL_ERROR, Ozone.util.toString(sendPayload));

        },

        /**
         *
         * @param handler
         *  Handler will receive payload of the following:
         *   {sender: , type: , msg:, error: }
         *   sender = sender of message that caused error (since cmwapi is pub/sub, if it's not you, ignore)
         *   type = type of message that caused error
         *   msg = payload of message that caused error
         *   error = description of error
         */
        handleError : function(handler) {

        }

    }

})();
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
     */

    /**
     * Channels used for messaging
     */
    var CHANNEL_REQUEST = "map.status.request", CHANNEL_VIEW = "map.status.view", CHANNEL_FORMAT = "map.status.format",
        CHANNEL_ABOUT = "map.status.about";

    var SUPPORTED_STATUS_TYPES = ["about", "format", "view"];

    validRequestTypes = function(types) {
        if (types) {
            for (var i = 0; i < types.length; i++  ) {
                if (!(SUPPORTED_STATUS_TYPES.indexOf(types[i]) > -1)) {
                    return {result: false, msg: types[i] + ' is not a supported request type'}
                }
            }
        }
        return {result: true};
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
        },

        /**
         * @param requester : optional; to whom to send, if not to everyone
         * @param bounds :
         *      { southWest { lat: , lon: }, northEast { lat: , lon: } }
         * @param center : { lat: , lon: }
         * @param range :
         */
        view : function ( requester, bounds, center, range) {

        },

        /**
         *
         * @param handler
         */
        handleView : function ( handler ) {


        },

        FORMATS_REQUIRED : ["kml", "wms"],

    /**
         * Send out the list of data formats that this map supports.
         *
         */
        formats : function ( ) {

            // send at least FORMATS_REQUIRED
        },

        /**
         *
         * @param handler
         */
        handleFormats : function (handler) {},

        TYPES_ALLOWED : ["2-D", "3-D", "other"],

        /**
         *
         * @param version - what version (s??) of the Common Map Widget API that this map widget supports
         * @param type - one of TYPES_ALLOWED
         * @param widgetName - name of the map widget
         */
        about : function ( version, type, widgetName ) {},

        handleAbout : function (handler) {}

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
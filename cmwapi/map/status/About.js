/**
 * Defines the About channel module according to the CMW API 1.1 specification
 *
 * @todo status.about - version parameter: how to return that you support multiple versions?  and/or, how could you?
 * @todo status.about - widgetName: assume that's a "human-readable" name, rather than universal name?
 * @module cmwapi/map/status/About
 */
define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error"], function(Channels, Validator, Error) {

    var TYPES_ALLOWED = ["2-D", "3-D", "other"];

    /* Creat a validator.  We need not pass in request types as we will not be using those validation functions. */
    var validator = new Validator([]);

    /**
     * @constructor
     * @alias module:cmwapi/map/status/About
     */
    var About = {

        TYPES_ALLOWED : TYPES_ALLOWED,

        /**
         *
         * @param version - what version (s??) of the Common Map Widget API that this map widget supports
         * @param type - one of TYPES_ALLOWED
         * @param widgetName - name of the map widget
         */
        send : function ( version, type, widgetName ) {

            var validData = true;
            var msg; 

            if (!version) {
                validData = false;
                msg += 'Need a version of the CMWAPI; ';
            }

            // valid type
            if (!type) {
                validData = false;
                msg += 'Need a type of widget : see TYPES_ALLOWED; ';                    
            } else {
                if (TYPES_ALLOWED.indexOf(type)==-1) {
                    validData = false;
                    msg += 'Need a type of widget within TYPES_ALLOWED; ';
                }
            }

            // has some sort of widget name
            if (!widgetName) {
                validData = false;
                msg += 'Need a widget name; '
            }

            var dataPayload = Ozone.util.toString( {version: version, type: type, widgetName: widgetName});
            if (validData) {        
                OWF.Eventing.publish(Channels.MAP_STATUS_ABOUT, dataPayload);
            } else {
                Error.send( OWF.getInstanceId(), Channels.MAP_STATUS_ABOUT, dataPayload, msg);
            }

        },

        /**
         * Registers a handler on to be called whenever a message comes over the map status about channel.
         * Otherwise, throw map.error
         * @todo FIll in params docs
         *
         */
        addHandler : function (handler) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function( sender, msg) {
                var validData= true;
                if (!msg.version) {
                    Error.send(sender, Channels.MAP_STATUS_ABOUT, null, "Need a version of the CMWAPI");
                    validData = false;
                }
                if (!msg.type) {
                    Error.send(sender, Channels.MAP_STATUS_ABOUT, null, "Need a type of widget : see TYPES_ALLOWED");
                    validData = false;
                }
                if (!msg.widgetName) {
                    Error.send(sender, Channels.MAP_STATUS_ABOUT, null, "Need a widget name");
                    validData = false;
                }
                if (validData) {
                    handler(sender, msg.version, msg.type, msg.widgetName);
                }
            };


            OWF.Eventing.subscribe(Channels.MAP_STATUS_ABOUT, newHandler);
            return newHandler;
        },

        /**
         * Stop listening to the error channel and handling events upon it.
         */
        removeHandlers : function() {
            OWF.Eventing.unsubscribe(Channels.MAP_STATUS_ABOUT);
        }

    };

    return About;

});

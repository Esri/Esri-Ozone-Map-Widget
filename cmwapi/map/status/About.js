define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error"], function(Channels, Validator, Error) {

    /**
     * The About module provides methods for using a map.status.about OWF Eventing channel
     * according to the [CMWAPI 1.1 Specification](http://www.cmwapi.org).  This module
     * abstracts the OWF Eventing channel mechanism from client code and validates messages
     * using specification rules.  Any errors are published
     * on the map.error channel using an {@link module:cmwapi/map/Error|Error} module.
     *
     * @todo status.about - version parameter: how to return that you support multiple versions?  and/or, how could you?
     * @todo status.about - widgetName: assume that's a "human-readable" name, rather than universal name?
     * @exports cmwapi/map/status/About
     */
    var About = {

        /**
         * An array of allowed/expected type strings of map widgets responding to CMWAPI about requests.
         * The [CMWAPI 1.1 Specification](http://www.cmwapi.org) allows for "2-D", "3-D", and "other".
         */
        SUPPORTED_MAP_TYPES: Validator.SUPPORTED_MAP_TYPES,

        /**
         * Send About information that describes this widget and its level of CMWAPI support.
         * @param {string} version The version of this widget
         * @param {string} type One of the {@link module:cmwapi/map/status/About.TYPES_ALLOWED|TYPES_ALLOWED} values.
         * @param {string} widgetName - name of the map widget
         */
        send: function(version, type, widgetName) {

            var validData = true;
            var msg;

            if (!version) {
                validData = false;
                msg += 'Need a version of the CMWAPI; ';
            }

            // valid type
            if (!type) {
                validData = false;
                msg += 'Need a type of widget: see SUPPORTED_MAP_TYPES; ';
            } else {
                var validType = Validator.validMapType(type);
                if (!validType.result) {
                    validData = false;
                    msg += 'Need a type of widget within TYPES_ALLOWED; ';
                }
            }

            // has some sort of widget name
            if (!widgetName) {
                validData = false;
                msg += 'Need a widget name; ';
            }

            var dataPayload = Ozone.util.toString( {version: version, type: type, widgetName: widgetName});
            if (validData) {
                OWF.Eventing.publish(Channels.MAP_STATUS_ABOUT, dataPayload);
            } else {
                Error.send( OWF.getInstanceId(), Channels.MAP_STATUS_ABOUT, dataPayload, msg);
            }

        },

        /**
         * Subscribes to the status about channel and registers a handler to be called when messages
         * are published to it.
         *
         * @param {module:cmwapi/map/status/About~Handler} handler An event handler for any format messages.
         *
         */
        addHandler: function(handler) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function( sender, msg) {
                var validData= true;
                if (!msg.version) {
                    Error.send(sender, Channels.MAP_STATUS_ABOUT, null, "Need a version of the CMWAPI");
                    validData = false;
                }
                if (!msg.type) {
                    Error.send(sender, Channels.MAP_STATUS_ABOUT, null, "Need a type of widget: see TYPES_ALLOWED");
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
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers: function() {
            OWF.Eventing.unsubscribe(Channels.MAP_STATUS_ABOUT);
        }

        /**
         * A function for handling request channel messages.
         * @callback module:cmwapi/map/status/About~Handler
         * @param {string} sender The widget sending an about message
         * @param {string} version The version of the widget
         * @param {string} type One of the {@link module:cmwapi/map/status/About.TYPES_ALLOWED|TYPES_ALLOWED} values.
         * @param {string} widgetName  The name of the widget publishing about information
         */

    };

    return About;

});

/**
 * Defines the Error channel module according to the CMW API 1.1 specification
 *
 * TODO: error sender - instance id or widget id? (inferring by example, need to ask on forums)
 * TODO: error description - no common list, correct?
 * @module cmwapi/map/Error
 */
define(["cmwapi/Channels"], function(Channels) {
    /**
     * @constructor
     * @alias module:cmwapi/map/Error
     */
    var Error = {

        /**
         *
         * @param sender - sender of message that caused error
         * @param type - type of message that caused error (example seems to be cmwapi call: e.g., map.feature.hide)
         * @param msg - message that caused the error  (example seems to be payload)
         * @param error - a description of the error
         */
        send : function (sender, type, msg, error) {
            var sendPayload = { sender: sender,
                type: type,
                msg: msg,
                error: error
            };
            OWF.Eventing.publish(Channels.MAP_ERROR, Ozone.util.toString(sendPayload));

        },

        /**
         * Subscribes to the error channel and 
         * @param handler {function}
         *  Handler will receive payload of the following:<br />
         *   &#123; sender: , type: , msg:, error: &#125;<br />
         *   sender = sender of message that caused error (since cmwapi is pub/sub, if it's not you, ignore)<br />
         *   type = type of message that caused error<br />
         *   msg = payload of message that caused error<br />
         *   error = description of error
         */
        addHandler : function(handler) {

            var newHandler = function(sender, msg) {

                // nothing really that can be done if the error message itself has an error...
                handler(sender, msg.type, msg.msg, msg.error);
            };

            OWF.Eventing.subscribe(Channels.MAP_ERROR, newHandler);

        },

        /**
         * Stop listening to the error channel and handling events upon it.
         */
        removeHandlers : function() {
            OWF.Eventing.unsubscribe(Channels.MAP_ERROR);
        }

    };

    return Error;

});

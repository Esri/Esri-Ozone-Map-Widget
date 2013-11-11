define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error"], function(Channels, Validator, Error) {

    /**
     * The View module provides methods for using a map.status.view OWF Eventing channel
     * according to the [CMWAPI 1.1 Specification](http://www.cmwapi.org).  This module 
     * abstracts the OWF Eventing channel mechanism from client code and validates messages
     * using specification rules.  Any errors are published
     * on the map.error channel using an {@link module:cmwapi/map/Error|Error} module.
     * @exports cmwapi/map/status/View
     * @todo status.view: would we filter out if the requester isn't me?
     */
    var View = {

        /**
         * Sends a status view message.  The only real CMWAPI requirement here is what goes out over the channel.
         * @param {string} requester Client that requested this status message be sent (if any). An empty requestor 
         *     denotes that the message is being sent due to a map view change.
         * @param {Object} bounds 
         *      &#123; southWest &#123; lat: <number>, lon: <number>&#125;, northEast &#123; lat: <number>, lon: <number>&#125; &#125;
         * @param {object} center  &#123; lat: <number>, lon: <number>&#125;
         * @param {number} range  The current distance in meters the map is zoomed out.
         */
        send : function ( requester, bounds, center, range) {

           /*
            Validate data provided
            */
            var msg = '';
            var isValidData = true;

            // validate bounds
            var checkBounds = Validator.validBounds(bounds);
            if (!checkBounds.result) {
                msg += checkBounds.msg +';';
                isValidData = false;
            }
            var checkCenter = Validator.validCenter(center);
            if (!checkCenter.result) {
                msg += checkCenter.msg+';';
                isValidData = false;
            }
            var checkRange = Validator.validRange(range);
            if (!checkRange.result) {
                msg+=checkRange.msg+';';
                isValidData = false;
            }
            var msgOut = Ozone.util.toString({requester: requester, bounds: bounds, center: center, range: range});
            if (!isValidData) {
                Error.send( OWF.getInstanceId(), Channels.MAP_STATUS_VIEW,
                    msgOut,
                    msg);
            } else {
                OWF.Eventing.publish(Channels.MAP_STATUS_VIEW, msgOut);
            }

        },

        /**
         * Subscribes to the view channel and registers a handler to be called when messages are published to it.
         *
         * @param {module:cmwapi/map/status/View~Handler} handler An event handler for any view messages.
         */
        addHandler : function ( handler ) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function( sender, msg) {

                var isValidData = true;
                var jsonMsg = Ozone.util.parseJson(msg);

                // No real validation for requester as it is optional; The other
                // elements need to be validated.
                var checkResult = Validator.validBounds(jsonMsg.bounds);
                if (!checkResult.result) {
                    msg += checkResult.msg +';';
                    isValidData = false;
                }
                checkResult = Validator.validCenter(jsonMsg.center);
                if (!checkResult.result) {
                    msg += checkResult.msg +';';
                    isValidData = false;
                }
                checkResult = Validator.validRange(jsonMsg.range);
                if (!checkResult.result) {
                    msg += checkResult.msg +';';
                    isValidData = false;
                }
                if (isValidData) {
                    handler(sender, jsonMsg.requester, jsonMsg.bounds, jsonMsg.center, jsonMsg.range );
                } else {
                    var msgOut = Ozone.util.toString({requester: jsonMsg.requester, bounds: jsonMsg.bounds,
                        center: jsonMsg.center, range: jsonMsg.range});
                    Error.send(sender, Channels.MAP_STATUS_VIEW, msgOut, msg );
                }
            };

            OWF.Eventing.subscribe(Channels.MAP_STATUS_VIEW, newHandler);
            return newHandler;
        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers : function() {
            OWF.Eventing.unsubscribe(Channels.MAP_STATUS_VIEW);
        }

        /**
         * A function for handling View channel messages.
         * @callback module:cmwapi/map/status/View~Handler
         * @param {string} sender The widget sending a view message
         * @param {object} bounds &#123; southWest &#123; lat: <number>, lon: <number>&#125;, northEast &#123; lat: <number>, lon: <number>&#125; &#125;
         * @param {object} center &#123; lat: <number>, lon: <number>&#125;
         * @param {number} range The current distance in meters the map is zoomed out.
         */
    };

    return View;

});

/**
 * Defines the View channel module according to the CMW API 1.1 specification
 *
 * TODO: status.view: would we filter out if the requester isn't me?
 * @module cmwapi/map/status/View
 */
define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error"], function(Channels, Validator, Error) {
    /* Creat a validator.  We need not pass in request types as we will not be using those validation functions. */
    var validator = new Validator([]);

    /**
     * @constructor
     * @alias module:cmwapi/map/status/View
     */
    var View = {

        /**
         * Method to send OUT view message.  Only real API requirement here is what goes out over the channel,
         *    not how it comes in...  we can optimize as need be for usage
         *
         * @param [requester] to whom to send, if not to everyone
         * @param bounds
         *      &#123; southWest &#123; lat: , lon: &#125;, northEast &#123; lat: , lon: &#125; &#125;
         * @param center &#123; lat: , lon: &#125;
         * @param range
         */
        send : function ( requester, bounds, center, range) {

           /*
            Validate data provided
            */
            var msg = '';
            var isValidData = true;

            // validate bounds
            var checkBounds = validator.validBounds(bounds);
            if (!checkBounds.result) {
                msg += checkBounds.msg +';';
                isValidData = false;
            }
            var checkCenter = validator.validCenter(center);
            if (!checkCenter.result) {
                msg += checkCenter.msg+';';
                isValidData = false;
            }
            var checkRange = validator.validRange(range);
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
         * Invoke handler if Channels.MAP_STATUS_VIEW message received meets API specifications for map.status.view.
         * Otherwise, throw map.error
         *
         * @param handler {function} has a parameter for sender, bounds, center, and range.<br />
         *      Sender is string / widget id<br />
         *      Bounds is &#123; southWest: &#123; lat: , lon: &#125;, northEast: &#123;lat: , lon: &#125; &#125;<br />
         *      Center is &#123; lat: , lon: &#125;<br />
         *      Range is number
         *
         */
        addHandler : function ( handler ) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function( sender, msg) {

                var isValidData = true;
                var jsonMsg = Ozone.util.parseJson(msg);

                // No real validation for requester as it is optional; The other
                // elements need to be validated.
                var checkResult = validator.validBounds(jsonMsg.bounds);
                if (!checkResult.result) {
                    msg += checkResult.msg +';';
                    isValidData = false;
                }
                checkResult = validator.validCenter(jsonMsg.center);
                if (!checkResult.result) {
                    msg += checkResult.msg +';';
                    isValidData = false;
                }
                checkResult = validator.validRange(jsonMsg.range);
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
         * Stop listening to the error channel and handling events upon it.
         */
        removeHandlers : function() {
            OWF.Eventing.unsubscribe(Channels.MAP_STATUS_VIEW);
        }

    };

    return View;

});

define(["cmwapi/Channels", "cmwapi/Validator"], function(Channels, Validator) {

    /**
     * The Create module provides methods for using an overlay creation OWF Eventing channel
     * according to the [CMWAPI 1.1 Specification](http://www.cmwapi.org).  This module
     * abstracts the OWF Eventing channel mechanism from client code and validates messages
     * using specification rules.  Any errors are published
     * on the map.error channel using an {@link module:cmwapi/map/Error|Error} module.
     *
     * @todo Discuss how to handle uniqueness rules of overlay ids; these rules must be handled by the adapter and may be
     *     specific to the map implementation.  Should we be able to validate that at this level?
     * @exports cmwapi/map/overlay/Create
     */
    var Create = {

        /**
         * Send information that supports the creation of a map overlay.
         * @param {Object|Array} data
         * @param {string} [data.name] The name of the overlay.  If a valid name string is not specified, the overlayId is used.
         * @param {string} [data.overlayId] The ID of the overlay.  If a valid ID string is not specified, the sending widget's ID is used.
         * @param {string} [data.parentId] The ID of the parent overlay.  This will establishes or changes a parent/child relationship
         */
        send: function(data) {

            var payload;

            if (Object.prototype.toString.call(data) === '[object Array]') {
                payload = data;
            }
            else {
                payload = [data];
            }

            // Check all the overlay objects; fill-in any missing attributes.
            for (var i = 0; i < payload.length; i ++) {
                // The overlayId is optional; defaults to widget id if not specified.
                payload[i].overlayId = (payload[i].overlayId) ? payload[i].overlayId : OWF.getInstanceId();

                // The name is optional; defaults to overlay id if not specified.
                payload[i].name = (payload[i].name) ? payload[i].name : payload[i].overlayId;

                // The parentId is optional
                payload[i].parentId = (payload[i].parentId) ? payload[i].parentId : null;
            }

            // Since everything is optional, no major data validation is performed here.  Send
            // along the payload.
            if (payload.length === 1) {
                OWF.Eventing.publish(Channels.MAP_OVERLAY_CREATE, Ozone.util.toString(payload[0]));
            }
            else {
                OWF.Eventing.publish(Channels.MAP_OVERLAY_CREATE, Ozone.util.toString(payload));
            }

        },

        /**
         * Subscribes to the overlay create channel and registers a handler to be called when messages
         * are published to it.
         *
         * @param {module:cmwapi/map/overlay/Create~Handler} handler An event handler for any creation messages.
         *
         */
        addHandler: function(handler) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function(sender, msg) {

                // Parse the sender and msg to JSON.
                var jsonSender = Ozone.util.parseJson(sender);
                var jsonMsg = (Validator.isString(msg)) ? Ozone.util.parseJson(msg) : msg;
                var data = (Validator.isArray(jsonMsg)) ? jsonMsg : [jsonMsg];

                for (var i = 0; i < data.length; i ++) {
                    // The overlayId is optional; defaults to widget id if not specified.
                    data[i].overlayId = (data[i].overlayId) ? data[i].overlayId : jsonSender.id;

                    // The name is optional; defaults to overlay id if not specified.
                    data[i].name = (data[i].name) ? data[i].name : data[i].overlayId;

                    // The parentId is optional
                    data[i].parentId = (data[i].parentId) ? data[i].parentId : null;
                }

                handler(sender, (data.length === 1) ? data[0] : data);
            };

            OWF.Eventing.subscribe(Channels.MAP_OVERLAY_CREATE, newHandler);
            return newHandler;
        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers: function() {
            OWF.Eventing.unsubscribe(Channels.MAP_OVERLAY_CREATE);
        }

        /**
         * A function for handling channel messages.
         * @callback module:cmwapi/map/overlay/Create~Handler
         * @param {string} sender The widget sending a format message
         * @param {Object|Array} data  A data object or array of data objects.
         * @param {string} [data.name] The name of the overlay.  If a valid name string is not specified, the overlayId is used.
         * @param {string} [data.overlayId] The ID of the overlay.  If a valid ID string is not specified, the sending widget's ID is used.
         * @param {string} [data.parentId] The ID of the parent overlay.  This will establishes or changes a parent/child relationship
         */

    };

    return Create;

});

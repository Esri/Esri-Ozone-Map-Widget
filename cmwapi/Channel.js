define(function() {

    /**
     * The Channel module collects some basic methods for abstracting away a CMWAPI channel.  It 
     * serves as a skeleton module that should be extended to provide custom default behavior or
     * I/O validation.
     * @module cmwapi/Channel
     */

    /**
     * @constructor
     * @alias module:cmwapi/Channel
     * @param {string} name The name of the OWF Eventing Channel to use for communication.
     */
    var Channel = function(name){

        this._name = name;

        return (this);
    };

    Channel.prototype = {
        /** 
         * Returns the name of the OWF Eventing channel on which this module operates.
         */
        getChannelName : function() {
            return ( this._name );
        },

        /**
         * Send information over the OWF Eventing channel specified by this Channel's name.
         * This function should be overridden by any modules that extend Channel if they 
         * require custom validation or processing of input data.
         * @param {Object} data
         */
        send: function(data) {
            OWF.Eventing.publish( this._name, data );
        },

        /**
         * Subscribes to the OWF Eventing channel specified by this channel's name and registers the
         * given handler on that channel.  This function should be overridden by any specific modules
         * that extend Channel that require custom validation of handler parameters or outputs.
         *
         * @param {function} handler An event handler for any creation messages.
         *
         */
        addHandler: function(handler) {
            OWF.Eventing.subscribe( this._name, handler );
        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers: function() {
            OWF.Eventing.unsubscribe( this._name );
        }

    };

    return Channel;

});

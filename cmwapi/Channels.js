/**
 * Defines the OWF Eventing channels used by the CMW API.
 * @module cmwapi/Channels
 */
define(function() {

    var MAP_STATUS_REQUEST = 'map.status.request';
    var MAP_STATUS_VIEW = 'map.status.view';
    var MAP_STATUS_FORMAT = 'map.status.format';
    var MAP_STATUS_ABOUT = 'map.status.about';

    var MAP_ERROR = 'map.error';

    /**
     * @constructor
     * @alias module:cmwapi/Channels
     */
    var Channels = {
        /**
         * The name of the status request channel.
         * @type String
         */
        MAP_STATUS_REQUEST: MAP_STATUS_REQUEST,
        /**
         * The name of the status view channel.
         * @type String
         */
        MAP_STATUS_VIEW: MAP_STATUS_VIEW,
        /**
         * The name of the status format channel. 
         * @type String
         */
        MAP_STATUS_FORMAT: MAP_STATUS_FORMAT,
        /**
         * The name of the status about channel.
         * @type String
         */
        MAP_STATUS_ABOUT: MAP_STATUS_ABOUT,
        /**
         * The name of the error channel.
         * @type String
         */
        MAP_ERROR: MAP_ERROR,
        /**
         * Returns an array of the OWF channels utilized by this implementation of the CMW API.
         * @return {Array<String>} 
         */
        getChannels: function () {
            return [this.MAP_STATUS_REQUEST, this.MAP_STATUS_REQUEST, this.MAP_STATUS_FORMAT, this.MAP_STATUS_ABOUT, 
                this.MAP_ERROR];
        }
    };

    return Channels;
});
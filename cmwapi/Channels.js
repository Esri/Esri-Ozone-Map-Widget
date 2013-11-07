/**
 * Defines the OWF Eventing channels used by the CMW API.
 * @module cmwapi/Channels
 */
define(function() {

    /**
     * The name of the status request channel.
     * @type String
     */
    var MAP_STATUS_REQUEST = 'map.status.request';

    /**
     * The name of the status view channel.
     * @type String
     * @memberof Channels
     */
    var MAP_STATUS_VIEW = 'map.status.view';

    /**
     * The name of the status format channel. 
     * @type String
     * @memberof Channels
     */
    var MAP_STATUS_FORMAT = 'map.status.format';

    /**
     * The name of the status about channel.
     * @type String
     * @memberof Channels
     */
    var MAP_STATUS_ABOUT = 'map.status.about';

    /**
     * @constructor
     * @alias module:cmwapi/Channels
     */
    var Channels = {
        MAP_STATUS_REQUEST: MAP_STATUS_REQUEST,
        MAP_STATUS_VIEW: MAP_STATUS_VIEW,
        MAP_STATUS_FORMAT: MAP_STATUS_FORMAT,
        MAP_STATUS_ABOUT: MAP_STATUS_ABOUT,
        
        /**
         * Returns an array of the OWF channels utilized by this implementation of the CMW API.
         * @return {Array<String>} 
         */
        getChannels: function () {
            return [MAP_STATUS_REQUEST, MAP_STATUS_REQUEST, MAP_STATUS_FORMAT, MAP_STATUS_ABOUT];
        }
    };

    return Channels;
});
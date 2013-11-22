define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error", "cmwapi/map/Status", "cmwapi/map/Overlay",
	    "cmwapi/map/Feature", "cmwapi/map/View"],
    function(Channels, Validator, Error, Status, Overlay, Feature, View) {

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
     *      request: invoke function
     *      handleRequest: means to handler for invocation, as well as receive info on who requested it
     *
     * Pattern of usage
     *      w1: send:  map.status.request  &#123;types: [view]&#125;
     *      m1: receive map.status.request
     *      m1: send: map.status.view &#123;requester: w1, ... &#125;
     *      w1: receive: map.status.view - and the requester matches, so it handles
     *
     * @exports cmwapi/CMWAPI
     */
    var Map = {};

    /**
     * @see module:cmwapi/map/Status
     */
    Map.status = Status;
    /**
     * @see module:cmwapi/map/Overlay
     */
    Map.overlay = Overlay;
    /**
     * @see module:cmwapi/map/Feature
     */
    Map.feature = Feature;
    /**
     * @see module:cmwapi/map/View
     */
    Map.view = View;
    /**
     * @see module:cmwapi/map/Error
     */
    Map.error = Error;

    // Add any version information and static config elements here.

    /** The version of this implementation of the CMW API specification. */
    Map.version = '1.1';

    /** The name of this library for display purposes. */
    Map.name = 'Common Map Widget Application Program Interface (CMW API) ' + Map.version;
    
    return Map;
});

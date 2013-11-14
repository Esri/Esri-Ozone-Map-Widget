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
 */
define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error", "cmwapi/map/Status", "cmwapi/map/Overlay"],
    function(Channels, Validator, Error, Status, Overlay) {
    /**
     * @ignore
     */
    var Map = {};

    Map.status = Status;

    Map.error = Error;

    Map.overlay = Overlay;

    return Map;
});

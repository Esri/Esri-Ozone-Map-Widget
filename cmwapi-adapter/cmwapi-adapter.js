/**
 * @module EsriAdapter
 */
define(["cmwapi/cmwapi", "cmwapi-adapter/Overlay", "cmwapi-adapter/Feature", "cmwapi-adapter/Status", "cmwapi-adapter/Error",
        "cmwapi-adapter/cmwapi-overlay-manager"],
        function(CommonMapApi, Overlay, Feature, Status, Error, OverlayManager) {

    /**
     * @classdesc Adapter layer between Common Map Widget API v. 1.1 javascript
     *      implementation and ESRI map implementations
     * @constructor
     * @version 1.1
     * @param map {object} ESRI map object for which this adapter should apply
     * @alias module:EsriAdapter
     */
    var EsriAdapter = function(map) {
        var overlayManager = new OverlayManager(this, map);

        this.overlay = new Overlay(this, overlayManager);

        this.feature = new Feature(this, overlayManager);

        this.status = new Status(this, map);

        this.error = new Error(this);
    };

    return EsriAdapter;
});

/**
 * Defines a legend object for this webapp.
 * @module
 */
define(["dojo/_base/declare", "esri/dijit/BasemapGallery", "dojo/_base/connect"],
       function(declare, BasemapGallery, Connect) {

    return declare(BasemapGallery, {

        constructor: function(map, divId) {
            this.startup();
        },
        toggleBasemapGallery: function() {
            $('#popover_content_wrapper').toggle();
            $('#overlay').removeClass('selected');
            $('#popover_overlay_wrapper').hide();
            $('#basemaps').toggleClass('selected');
        }
    });
});

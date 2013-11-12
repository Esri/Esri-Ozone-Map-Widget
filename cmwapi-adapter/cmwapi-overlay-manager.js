define(function() {
    /**
     * @classdesc Manager for overlay layers to be used in conjunction with an ESRI map,
     * the {@link EsriAdapter}, and the {@link Map|Common Map Widget API}
     * @version 1.1
     * @constructor
     * @param map {object} The ESRI map object which this overlay manager should apply to
     */
    var EsriOverlayManager = function(adapter, map) {
        var me = this;

        me.overlays = {};

        /**
         * An overlay layer to contain features.
         * @constructor
         * @param overlayId {String} the unique id by which this overlay should be identified
         * @param name {String} optional; the non-unique readable name; if not specified the id will be used
         * @param parentId {String} optional; the parent to be set for this overlay
         * @memberof EsriOverlayManager
         */
        var Overlay = function(overlayId, name, parentId) {
            this.id= overlayId;
            this.name= name;
            //Overlay IDs of children overlays
            this.children = [];
            //Mapping FeatureID->Feature object of children features
            this.features = {}
            this.isHidden = false;
            if(parentId) {
                resolveParent(overlayId, parentId);
            }
        };

        /**
         * A feature which can be plotted or displayed on a Map.
         * @constructor
         * @param overlayId {String} The id of an overlay layer which will contain this feature;
         *      If an overlay with the given ID does not exist, one will be created
         * @param featureId {String} The id to be given to this feature. If the ID exists for the provided
         *      ovelayId the previous feature with the given featureId will be replaced with this feature;
         *      otherwise the feature will be created.
         * @param name {Stirng} The non-unique readable name to give to this feature
         * @param format {String} The format in which the feature parameter is being specified
         * @param feature The data detailing this feature
         * @param Zoom {boolean} Whether or not the map should zoom to this feature upon being added to the map
         * @memberof EsriOverlayManager
         */
        var Feature = function(overlayId, featureId, name, format, feature, zoom) {
            var resolveFeature = function() {
                //TODO figure out the type of esri feature, create and return
            }

            this.overlayId = overlayId;
            this.featureId = featureId;
            this.name = name;
            this.format = format;
            this.feature = feature;
            this.zoom = zoom;

            this.esriObject = resolveFeature();
        };

        /**
         * @private
         * @method resolveParent
         * @param childId {String} The id of the child for which the parent should be set
         * @param parentId {String} The id of the overlay to be set as parent
         * @param previousParentId {String} optional; The id of the overlay that was previously designated as parent to the childId
         * @memberof EsriOverlayManager#
         */
        var resolveParent = function(childId, parentId, previousParentId) {
            if(previousParentId) {
                var array = me.overlays[previousParentId].children;

                for(var i = 0; i < array.length; i--) {
                    if(array[i] === childId) {
                        array.splice(i, 1);
                    }
                }
            }

            if(me.overlays[parentId]) {
                me.overlays[parentId].children.push(childId);
            }
        };

        /**
         * @method createOverlay
         * @param name {String} optional; The readable name for the overlay; if not specified the id will be used
         * @param overlayId {String} The id of the overlay to create; if it exists nothing will be created
         * @memberof EsriOverlayManager#
         */
        me.createOverlay = function(overlayId, name, parentId) {
            if(me.overlays[overlayId]) {
                me.updateOverlay(name, overlayId, parentId);
            } else {
                me.overlays[overlayId] = new Overlay(overlayId, name, parentId);
            }
        };

        /**
         * @method deleteOverlay
         * @param overlayId {String} the id of the overlay to be deleted from the manager
         * @memberof EsriOverlayManager#
         */
        me.removeOverlay = function(overlayId) {
            delete me.overlays[overlayId];
            //FIXME what do we do about parents
        };

        /**
         * @method hideOverlay
         * @param overlayId {String} the id of the overlay to be hidden
         * @memberof EsriOverlayManager#
         */
        me.hideOverlay = function(overlayId) {
            me.overlays[overlayId].isHidden = true;
            //FIXME hide on the map
        };

        /**
         * @method showOverlay
         * @param overlayId {String} the id of the overlay to be shown
         * @memberof EsriOverlayManager#
         */
        me.showOverlay = function(overlayId) {
            me.overlays[overlayId].isHidden = false;
            //FIXME show on the map
        };

        /**
         * @method updateOverlay
         * @param name {String} The name that should be set; the current or a new name.
         * @param overlayId {String} the id of the overlay to be updated.
         * @param parentId {String} optional; the id of the overlay to be set as the parent.
         * @memberof EsriOverlayManager#
         */
        me.updateOverlay = function(name, overlayId, parentId) {
            if(typeof(me.overlays[overlayId]) === 'undefined') {
                var msg = "No overlay exists with the provided id of " + overlayId;
                adapter.error.error(sender, msg, {type: 'map.overlay.update', msg: msg})
            } else {
                if(me.overlays[overlayId].name !== name) {
                    me.overlays[overlayId].setName(name);
                }
                if(parentId && parentId !== me.overlays[overlayId].parentId) {
                    me.designateParent(overlayId, parentId);
                }
            }
        };

        /**
         * Resolves and returns the overlay and children for a specified overlayId
         * @private
         * @method flattenOverlay
         * @param overlayId {String} the Id for the overlay to be flattened
         * @memberof EsriOverlayManager#
         */
        var flattenOverlay = function(overlayId) {
            var overlay = me.overlays[overlayId];
            console.log(overlay);
            for(var i = 0; i < overlay.children.length; i++) {
                overlay.children[i] = flattenOverlay(overlay.children[i]);
            }
            return overlay;
        };

        /**
         * @method createFeature
         * @param overlayId {String} The id of the overlay on which this feature should be displayed
         * @param featureId {String} The id to be given for the feature, unique to the provided overlayId
         * @param name {String} The readable name for which this feature should be labeled
         * @param format {String} The format type of the feature data included
         * @param feature The data in the format specified providing the detail for this feature
         * @param zoom {boolean} Whether or not the map should zoom to this feature upon creation
         * @memberof EsriOverlayManager#
         */
        me.createFeature = function(overlayId, featureId, name, format, feature, zoom) {

        };

        /**
         * @method deleteFeature
         * @param overlayId {String} The id of the overlay which contains the feature to be removed
         * @param featureId {String} The id of the feature which is to be removed
         * @memberof EsriOverlayManager#
         */
        me.deleteFeature = function(overlayId, featureId) {

        };

        //TODO
        /**
         * @method hideFeature
         * @param overlayId {String} The id of the overlay which contains the feature to be hidden
         * @param featureId {String} The id of the feature which is to be hidden
         * @memberof EsriOverlayManager#
         */
        me.hideFeature = function(overlayId, featureId) {

        };

        //TODO
        /**
         * @method showFeature
         * @param overlayId {String} The id of the overlay which contains the feature to be shown
         * @param featureId {String} The id of the feature which is to be shown
         * @memberof EsriOverlayManager#
         */
        me.showFeature = function() {

        };

        /**
         * @method updateFeature
         * @param overlayId {String}
         * @param featureId {String}
         * @param name {String}
         * @param newOverlayId {String} optional;
         * @memberof EsriOverlayManager#
         */
        me.updateFeature = function(overlayId, featureId, name, newOverlayId) {
            var feature = me.overlays[overlayId].features[featureId];
            if(name != feature.name) {
                feature.name = name;
            }

            if(newOverlayId && newOverlayId !== overlayId) {
                if(typeof(me.overlays[newOverlayId]) !== 'undefined' && me.overlays[newOverlayId] !== null) {
                    delete me.overlays[overlayId].features[featureId];
                } //TODO else error
            }
        };

        me.getOverlays = function() {
            return me.overlays;
        };

        /**
         * outputs the current saved overlays
         * @method debug
         * @memberof EsriOverlayManager#
         */
        me.debug = function() {
            console.log(me.overlays);
        };
    };

    return EsriOverlayManager;
});

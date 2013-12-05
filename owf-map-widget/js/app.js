// Entry point for map webapp
//
// NOTE: Modules that are not compatible with asynchronous module loading
// (AMD) are included in the webapp's HTML file to prevent issues.
require([
    "models/map", "models/legend", "dojo/mouse", "dojo/on", "dojo/dom",
    "dojo/json", "esri/dijit/Geocoder", "esri/layers/KMLLayer","esri/dijit/BasemapGallery",
    "esri/arcgis/utils","dojo/parser","dojo/dom-style", "cmwapi-adapter/cmwapi-adapter",
    "dojo/domReady!"],
    function(Map, Legend, Mouse, On, Dom, JSON, Geocoder, KMLLayer, BasemapGallery, arcgisUtils, parser, domStyle, cmwapiAdapter) {
        var map = new Map("map", {
            center: [-76.809469, 39.168101],
            zoom: 7,
            basemap: "streets"
        });

        var dropZone = Dom.byId("map");
        var owf_adapter = new OWFAdapter(On , dropZone, Mouse, map);

        geocoder = new Geocoder({
            map: map
        }, "search");
        geocoder.startup();

        var basemapGallery = new BasemapGallery({
            showArcGISBasemaps: true,
            map: map
        }, "basemapGallery");
        basemapGallery.startup();

        basemapGallery.on("error", function(msg) {
            console.log("basemap gallery error:  ", msg);
        });

       var adapter = new cmwapiAdapter(map);

        $('#tooltip-x-button').on('click', function() {
            $('#no-overlay-tooltip').toggleClass('hidden');
        });
        $('#overlay').on('click', function() {
            toggleOverlayManager();
            closeManagerWindowsIfOpen();
            if(isOverlayTreeEmpty()) {
                toggleManagerTooltip('show');
            } else {
                toggleManagerTooltip('hide');
                updateTreeData()
                toggleOverlayTree('show');
            }
            console.log(adapter.overlayManager.getOverlayTree());
        });

        $('#basemaps').on('click', function() {
            toggleBaseMaps();
        });
        $('#overlay-add-icon').on('click', function() {
            toggleOverlaySettings();
            toggleOverlayTree('hide');
            toggleManagerTooltip('hide');
            $('#overlay-manager-add').toggleClass('hidden');
            $('#overlay-manager-subtitle').text('Add New Feature');
            $('#popover_overlay_wrapper').css('height', '305px');
        });
        $('#overlay-delete-icon').on('click', function() {
            $('#overlay-manager-delete').toggleClass('hidden');
            toggleOverlaySettings();
            toggleOverlayTree('hide');
            toggleManagerTooltip('hide');
            $('#overlay-manager-subtitle').text('Delete Existing Overlays');
            resizeOverlayToTree('#overlay-removal-tree', 120);
        });
        $('#overlay-back-icon').on('click', function() {
            closeManagerWindowsIfOpen();
            toggleOverlaySettings();
            toggleOverlayTree('show');
            if(isOverlayTreeEmpty()) {
                toggleManagerTooltip('show');
            }
            resizeOverlayToTree('#overlay-tree', 40);
        });


        var isOverlayTreeEmpty = function() {
            console.log(adapter.overlayManager.getOverlayTree().length);
            return adapter.overlayManager.getOverlayTree().length === 0;
        };



        $('form').find('input').keyup(function() {
            var emptyInputLength = $('form > div > div > input').filter(function() {
                return $(this).val() === '';
            }).length;
            var buttonActive = (emptyInputLength === 0 &&  $('#overlay-manager-add-button').hasClass('disabled')) ||
                (emptyInputLength > 0 && !$('#overlay-manager-add-button').hasClass('disabled'));
            if(buttonActive) {
                $('#overlay-manager-add-button').toggleClass('disabled');
            }
        });

        $("[rel=tooltip]").tooltip({ placement: 'bottom'});
        var data = adapter.overlayManager.getOverlayTree();
        console.log(data);
        var $tree = $('#overlay-tree');
        $tree.tree({
            data: data,
            dragAndDrop:true,
            autoOpen: 1,
            onCreateLi: function(node, $li) {
                $li.find('.jqtree-title').before(
                    '<input type="checkbox" class ="tree-node"/>' +
                    '<img src="http://img0056.popscreencdn.com/103222765_watchmen-smiley-1-pin-button-badge-magnet-moore-gibbons-.jpg" alt="Overlay Icon" height="25" width="25">'
                );
            }
        });

        var $overlayRemoveTree = $('#overlay-removal-tree');
        $overlayRemoveTree.tree({
            data: data,
            autoOpen: 1,
            openedIcon: '',
            closedIcon: '',
            onCreateLi: function(node, $li) {
                $li.find('.jqtree-title').before(
                    '<input type="checkbox" class ="tree-node"/>'
                );
            }
        });

        /**
        * Whenever either the trees parent nodes are clicked the children nodes are also checked
        * respectively.
        **/
        $("#overlay-tree input:checkbox, #overlay-removal-tree input:checkbox").on('change', function () {
            $(this).parent().next('ul').find('input:checkbox').prop('checked', $(this).prop("checked"));
        });



        var closeManagerWindowsIfOpen = function() {
            if(!$('#overlay-manager-add').hasClass('hidden')) {
                $('#overlay-manager-add').toggleClass('hidden');
            }
            if(!$('#overlay-manager-delete').hasClass('hidden')) {
                $('#overlay-manager-delete').toggleClass('hidden');
            }
                $('#overlay-manager-subtitle').text('');
        };


        var toggleOverlaySettings = function() {
            $('#overlay-manager').toggleClass('hidden');
            $('#overlay-add-icon').toggleClass('hidden');
            $('#overlay-delete-icon').toggleClass('hidden');
            $('#overlay-back-icon').toggleClass('hidden');
            $('#overlay-vr').css('right', '36px');
        }

        /**
        * Method used by the button binded to the basemaps icon.
        * Toggles the basemaps popover open/close.
        * If the overlay manager popover is already open then close it.
        **/
        var toggleBaseMaps = function() {
            if(!$('#popover_overlay_wrapper').hasClass('hidden')) {
                $('#popover_overlay_wrapper').toggleClass('hidden');
                $('#overlay').toggleClass('selected');
            }
            $('#popover_content_wrapper').toggleClass('hidden');
            $('#basemaps').toggleClass('selected');
        }

        /**
        * Method used by the button binded to the overlay manager icon.
        * Toggles the overlay manager open/close.
        * If the basemap popover is already open then close it.
        * Resize the window to the correct size given the tree.
        **/
        var toggleOverlayManager = function() {
            if(!$('#popover_content_wrapper').hasClass('hidden')) {
                $('#popover_content_wrapper').toggleClass('hidden');
                $('#basemaps').toggleClass('selected');
            }
            $('#popover_overlay_wrapper').toggleClass('hidden');
            resizeOverlayToTree('#overlay-tree', 40);
            $('#overlay').toggleClass('selected');
        }

        /**
        * This function is used to automatically adjust the size of the window to the size of the tree plus
        * a given specified offset/padding.
        **/
        var resizeOverlayToTree = function(tree, offset) {
            var treeHeight = $(tree).css('height');
            treeHeight = parseInt(treeHeight.substr(0, treeHeight.length-2));
            $('#popover_overlay_wrapper').css('height', (treeHeight + offset) + 'px');
        }

        /**
        * This function is called each time the tree needs to be updated, the updating is handled through
        * jquery tree.
        **/
        var updateTreeData = function() {
            $('#overlay-tree').tree('loadData',adapter.overlayManager.getOverlayTree());
            $('#overlay-removal-tree').tree('loadData',adapter.overlayManager.getOverlayTree());
            resizeOverlayToTree('#overlay-tree', 40);
        }

        /**
        * This is used to toggle the overlay tree within the Overlay manager window.  If
        * there are any overlays to display and you are not adding or removing overlays/features
        * then the tree should be visible.
        **/
        var toggleOverlayTree = function(action) {
            var hideOpenTree = (action === 'hide' && !$('#overlay-tree').hasClass('hidden'));
            var openClosedTree = (action === 'show' && $('#overlay-tree').hasClass('hidden'));
            if(hideOpenTree || openClosedTree){
                $('#overlay-tree').toggleClass('hidden');
            }
        };

        /**
        * This is used to toggle the tooltip within the Overlay manager window.  This tooltip
        * should only display if there are no overlays to display.  This is a convenience method
        * to close or open the tooltip depending on action paramater given.
        **/
        var toggleManagerTooltip= function(action) {
            var hideOpenTooltip = (action === 'hide' && !$('#no-overlay-tooltip').hasClass('hidden'));
            var openClosedTooltip = (action === 'show' && $('#no-overlay-tooltip').hasClass('hidden'));
            if(hideOpenTooltip || openClosedTooltip){
                $('#no-overlay-tooltip').toggleClass('hidden');
            }
        };

    });
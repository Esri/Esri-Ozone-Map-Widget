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
    if (OWF.Util.isRunningInOWF()) {

        OWF.ready(function () {
            OWF.notifyWidgetReady();

            var dropZone = Dom.byId("map");

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
            });

            $('#basemaps').on('click', function() {
                toggleBaseMaps();
            });
            $('#overlay-add-icon').on('click', function() {
                setStateAdd();
            });
            $('#overlay-delete-icon').on('click', function() {
                setStateRemove();
            });
            $('#overlay-back-icon').on('click', function() {
                setStateInit();
            });
            $('#overlay-manager-add-button').on('click', function() {
                var featureName = $('#feature-add-name').val();
                var featureId = $('#feature-add-id').val();
                var featureUrl = $('#feature-add-url').val();
                var featureParams = $('#feature-add-params').val();
                var overlayName = $('#overlay-add-name').val();
                var overlayId = $('#overlay-add-id').val();
                if($('#overlay-selection').val() == 'Add New Overlay') {
                    adapter.overlayManager.sendOverlayCreate(overlayId, overlayName);
                    adapter.overlayManager.sendFeaturePlotUrl(overlayId, featureId, featureName,
                        'kml', featureUrl, featureParams);
                } else if('Default Overlay') {
                    adapter.overlayManager.sendOverlayCreate('default-overlay-id', 'Default Overlay');
                    adapter.overlayManager.sendFeaturePlotUrl('default-overlay-id',
                        featureId, featureName,'kml', featureUrl, featureParams);
                }
                else {
                    adapter.overlayManager.sendFeaturePlotUrl($('#overlay-selection').find(":selected").attr('id'),
                        featureId, featureName,'kml', featureUrl, featureParams);
                }
                setStateInit();
            });

            $('#overlay-manager-delete-button').on('click', function() {
                $("#overlay-tree input:checkbox:checked").each(function(index) {
                    if($(this).attr('node-type') === 'overlay') {
                        adapter.overlayManager.sendOverlayRemove($(this).attr('id'));
                    }
                    if($(this).attr('node-type') === 'feature') {
                        var node = $('#overlay-tree').tree('getNodeById', $(this).attr('id'));
                        adapter.overlayManager.sendFeatureUnplot(node.parent.id,$(this).attr('id'));
                    }

                });

            });

            $('#overlay-selection').on('change', function() {
                if(this.value === 'Add New Overlay') {
                    $('#popover_overlay_wrapper').css('height', '435px');
                    $('#add-overlay-div').toggleClass('hidden');
                } else if(!($('#add-overlay-div').hasClass('hidden'))) {
                    $('#add-overlay-div').toggleClass('hidden');
                    $('#popover_overlay_wrapper').css('height', '305px');
                }
                checkAddFormCompleted();
            });

            var setInitManagerState = function() {
                closeManagerWindowsIfOpen();
                toggleOverlaySettings('reset')
                updateTreeData();
                toggleOverlayTree('show')
            };


            var updateOverlaySelection = function() {
                $('#overlay-selection > option').remove();
                var defaultHtml = '<option id= "default-overlay-id">Default Overlay</option>';
                $('#overlay-selection').append(defaultHtml);
                var overlayObject = adapter.overlayManager.getOverlays();
                for(var key in overlayObject) {
                    if(!(overlayObject[key].id == 'default-overlay-id')) {
                        var appendHtml = ' <option id= "'+ overlayObject[key].id +'">' + overlayObject[key].name + '</option>'
                        $('#overlay-selection').append(appendHtml);
                    }
                }
                var defaultHtmlAdd = '<option id= "add-new-overlay-option">Add New Overlay</option>'
                $('#overlay-selection').append(defaultHtmlAdd);
                $('#overlay-selection').val('Default Overlay');
            }

            var isOverlayTreeEmpty = function() {
                return adapter.overlayManager.getOverlayTree().length === 0;
            };



            $('form').find('input').keyup(function() {
                checkAddFormCompleted();
            });

            var toggleManagerAddButton = function(action) {
                var toggle = ($('#overlay-manager-add-button').hasClass('disabled') && action === 'enable') ||
                    (!($('#overlay-manager-add-button').hasClass('disabled')) && action === 'disable');
                if(toggle) {
                    $('#overlay-manager-add-button').toggleClass('disabled');
                }
            }

            var checkAddFormCompleted = function() {
                var hasFeatureName = !($('#feature-add-name').val() === '');
                var hasFeatureId = !($('#feature-add-id').val() === '');
                var hasFeatureUrl = !($('#feature-add-url').val() === '');
                var hasFeatureParams = !($('#feature-add-params').val() === '');
                var hasOverlayName = !($('#overlay-add-name').val() === '');
                var hasOverlayId = !($('#overlay-add-id').val() === '');
                if($('#overlay-selection').val() === 'Add New Overlay') {
                    if(hasFeatureName && hasFeatureId && hasFeatureUrl && hasOverlayName && hasOverlayId) {
                        toggleManagerAddButton('enable');
                    } else {
                        toggleManagerAddButton('disable');
                    }
                } else {
                    if(hasFeatureName && hasFeatureId && hasFeatureUrl) {
                        toggleManagerAddButton('enable');
                    } else {
                        toggleManagerAddButton('disable');
                    }
                }
            };

            $("[rel=tooltip]").tooltip({ placement: 'bottom'});

            var data = adapter.overlayManager.getOverlayTree();
            var $tree = $('#overlay-tree');
            $tree.tree({
                data: data,
                dragAndDrop:true,
                autoOpen: 1,
                onCreateLi: function(node, $li) {
                    node['node-type'] = node.type;
                    $li.find('.jqtree-title').before(
                        '<input type="checkbox" id="' + node.id+ '" class ="tree-node" node-type="' + node.type + '"/>' +
                        '<img src="http://img0056.popscreencdn.com/103222765_watchmen-smiley-1-pin-button-badge-magnet-moore-gibbons-.jpg" alt="Overlay Icon" height="25" width="25">'
                    );
                }
            });


            var clearAddInputs = function() {
                $('#feature-add-name').val('');
                $('#feature-add-id').val('');
                $('#feature-add-url').val('');
                $('#feature-add-params').val('');
                $('#overlay-add-name').val('');
                $('#overlay-add-id').val('');
            };

            /**
            * Whenever either the trees parent nodes are clicked the children nodes are also checked
            * respectively.
            **/
            var bindSelectionHandlers = function() {
                $("#overlay-tree input:checkbox").off('change');
                $("#overlay-tree input:checkbox").on('change', function () {
                    $(this).parent().next('ul').find('input:checkbox').prop('checked', $(this).prop("checked"));
                    if($(this).attr('checked','checked') && $(this).attr('type') === 'overlay') {
                        adapter.overlayManager.sendOverlayShow($(this).attr('id'));
                    } else if($(this).attr('checked','unchecked') && $(this).attr('type') === 'overlay') {
                        adapter.overlayManager.sendOverlayHide($(this).attr('id'));
                    }
                });
            }

            var closeManagerWindowsIfOpen = function() {
                if(!$('#overlay-manager-add').hasClass('hidden')) {
                    $('#overlay-manager-add').toggleClass('hidden');
                }
                if(!$('#overlay-manager-delete').hasClass('hidden')) {
                    $('#overlay-manager-delete').toggleClass('hidden');
                }
                    $('#overlay-manager-subtitle').text('');
            };


            var toggleOverlaySettings = function(action) {
                if(action === 'reset') {
                    if($('#overlay-manager').hasClass('hidden')) {
                        $('#overlay-manager').toggleClass('hidden');
                    }
                    if($('#overlay-add-icon').hasClass('hidden')) {
                        $('#overlay-add-icon').toggleClass('hidden');
                    }
                    if($('#overlay-delete-icon').hasClass('hidden')) {
                        $('#overlay-delete-icon').toggleClass('hidden');
                    }
                    if(!$('#overlay-back-icon').hasClass('hidden')) {
                        $('#overlay-back-icon').toggleClass('hidden');
                    }
                } else {
                    $('#overlay-manager').toggleClass('hidden');
                    $('#overlay-add-icon').toggleClass('hidden');
                    $('#overlay-delete-icon').toggleClass('hidden');
                    $('#overlay-back-icon').toggleClass('hidden');
                }
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
                setStateInit()
                // resizeOverlayToTree('#overlay-tree', 40);
                // $('#overlay').toggleClass('selected');
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
                resizeOverlayToTree('#overlay-tree', 90);
                if(!isOverlayTreeEmpty()) {
                    toggleManagerTooltip('hide');
                } else {
                    toggleManagerTooltip('show');
                }
                $("#overlay-tree input:checkbox").each(function(index) {
                    if(!($(this).attr('isHidden'))) {
                        $(this).attr('checked', 'checked');
                    }
                });
                bindSelectionHandlers();
                setStateInit();
            }
            adapter.overlayManager.bindTreeChangeHandler(updateTreeData);
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
                    $('#overlay-delete-icon').toggleClass('disabled')
                }
            };




            //////////////////////////////////////////////////////////////////////////////////////////////////
            var setStateInit = function() {
                if(isOverlayTreeEmpty()) {
                    toggleManagerTooltip('show');
                }
                if(!$('#overlay-manager-add-button').hasClass('hidden')) {
                    $('#overlay-manager-add-button').toggleClass('hidden');
                }
                if(!$('#overlay-manager-delete-button').hasClass('hidden')) {
                    $('#overlay-manager-delete-button').toggleClass('hidden');
                }
                if(!$('#overlay-manager-add').hasClass('hidden')) {
                    $('#overlay-manager-add').toggleClass('hidden');
                }
                if(!$('#overlay-manager-delete').hasClass('hidden')) {
                    $('#overlay-manager-delete').toggleClass('hidden');
                }
                if(!$('#overlay-back-icon').hasClass('hidden')) {
                    $('#overlay-back-icon').toggleClass('hidden');
                }
                if($('#overlay-add-icon').hasClass('hidden')) {
                    $('#overlay-add-icon').toggleClass('hidden');
                }
                if($('#overlay-delete-icon').hasClass('hidden')) {
                    $('#overlay-delete-icon').toggleClass('hidden');
                }
                if($('#overlay-tree').hasClass('hidden')) {
                    $('#overlay-tree').toggleClass('hidden');
                }
                $('#overlay-tree').css('top','50px');
                resizeOverlayToTree('#overlay-tree', 90);
            }
            var setStateAdd = function() {
                toggleManagerTooltip('hide');
                clearAddInputs();
                if(!($('#overlay-add-icon').hasClass('hidden'))) {
                    $('#overlay-add-icon').toggleClass('hidden');
                }
                if(!($('#overlay-delete-icon').hasClass('hidden'))) {
                    $('#overlay-delete-icon').toggleClass('hidden');
                }
                if($('#overlay-back-icon').hasClass('hidden')) {
                    $('#overlay-back-icon').toggleClass('hidden');
                }
                if($('#overlay-manager-add').hasClass('hidden')) {
                    $('#overlay-manager-add').toggleClass('hidden');
                }
                if(!$('#overlay-manager-delete').hasClass('hidden')) {
                    $('#overlay-manager-delete').toggleClass('hidden');
                }
                if($('#overlay-manager-add-button').hasClass('hidden')) {
                    $('#overlay-manager-add-button').toggleClass('hidden');
                }
                if($('#overlay-manager').hasClass('hidden')) {
                    $('#overlay-manager').toggleClass('hidden');
                }
                if(!$('#overlay-manager-delete-button').hasClass('hidden')) {
                    $('#overlay-manager-delete-button').toggleClass('hidden');
                }
                if($('#overlay-manager-subtitle').hasClass('hidden')) {
                    $('#overlay-manager-subtitle').toggleClass('hidden');
                }
                if(!$('#add-overlay-div').hasClass('hidden')) {
                    $('#add-overlay-div').toggleClass('hidden');
                }
                if(!$('#overlay-tree').hasClass('hidden')) {
                    $('#overlay-tree').toggleClass('hidden');
                }
                $('#overlay-manager-subtitle').text('Add New Feature');
                updateOverlaySelection();
                $('#popover_overlay_wrapper').css('height', '305px');
            }
            var setStateRemove = function() {
                toggleManagerTooltip('hide');
                if(!($('#overlay-add-icon').hasClass('hidden'))) {
                    $('#overlay-add-icon').toggleClass('hidden');
                }
                if(!($('#overlay-delete-icon').hasClass('hidden'))) {
                    $('#overlay-delete-icon').toggleClass('hidden');
                }
                if($('#overlay-back-icon').hasClass('hidden')) {
                    $('#overlay-back-icon').toggleClass('hidden');
                }
                if(!$('#overlay-manager-add').hasClass('hidden')) {
                    $('#overlay-manager-add').toggleClass('hidden');
                }
                if($('#overlay-manager-delete').hasClass('hidden')) {
                    $('#overlay-manager-delete').toggleClass('hidden');
                }
                if(!$('#overlay-manager-add-button').hasClass('hidden')) {
                    $('#overlay-manager-add-button').toggleClass('hidden');
                }
                if($('#overlay-manager').hasClass('hidden')) {
                    $('#overlay-manager').toggleClass('hidden');
                }
                if($('#overlay-manager-delete-button').hasClass('hidden')) {
                    $('#overlay-manager-delete-button').toggleClass('hidden');
                }
                if($('#delete-feature-subtitle').hasClass('hidden')) {
                    $('#delete-feature-subtitle').toggleClass('hidden');
                }
                if(!$('#add-overlay-div').hasClass('hidden')) {
                    $('#add-overlay-div').toggleClass('hidden');
                }
                if($('#overlay-tree').hasClass('hidden')) {
                    $('#overlay-tree').toggleClass('hidden');
                }
                $('#overlay-manager-subtitle').text('Add New Feature');
                updateOverlaySelection();
                $('#overlay-tree').css('top','85px');
                resizeOverlayToTree('#overlay-tree', 125);
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////
        });
    }
    });
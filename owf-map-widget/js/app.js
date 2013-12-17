// Entry point for map webapp
//
// NOTE: Modules that are not compatible with asynchronous module loading
// (AMD) are included in the webapp's HTML file to prevent issues.
require([
    "models/map", "models/legend", "dojo/mouse", "dojo/on", "dojo/dom", "esri/dijit/Scalebar",
    "dojo/json", "esri/dijit/Geocoder", "esri/layers/KMLLayer","esri/dijit/BasemapGallery",
    "esri/arcgis/utils","dojo/parser","dojo/dom-style", "cmwapi-adapter/cmwapi-adapter",
    "dojo/domReady!"],
    function(Map, Legend, Mouse, On, Dom, Scalebar, JSON, Geocoder, KMLLayer, BasemapGallery, arcgisUtils, parser, domStyle, cmwapiAdapter) {
        var map = new Map("map", {
            center: [-76.809469, 39.168101],
            zoom: 7,
            basemap: "streets"
        });
    if (OWF.Util.isRunningInOWF()) {

        OWF.ready(function () {
            OWF.notifyWidgetReady();

            var geocoder = new Geocoder({
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

            new Scalebar({
                map:map,
                attachTo:"bottom-left",
                scalebarUnit: "dual"
            });

            $('#overlay-tree').tree({
                data: adapter.overlayManager.getOverlayTree(),
                dragAndDrop:true,
                autoOpen: 1,
                onCreateLi: function(node, $li) {
                    node['node-type'] = node.type;
                    var image = node.type === 'feature' ? './images/icons/kml_icon.gif': './images/icons/Tree_Folder.png';
                    var inputString = '<input type="checkbox" id="' + node.id+ '" class ="tree-node" node-type="' + node.type;
                    var checked = node.isHidden === false ? (inputString + '" checked="checked"/>') : (inputString + '"/>');
                    $li.find('.jqtree-title').before(
                        checked + '<img src=' + image + ' alt="Overlay Icon" height="25" width="25">'
                    );
                },
                onCanMoveTo: function(moved_node, target_node, position) {
                    if(target_node['node-type'] === 'feature') {
                        return (position !== 'inside');
                    } else {
                        return true;
                    }
                }
            });

            $('#overlay-tree').bind('tree.dblclick',
            function(event) {
                var span = $('#' + event.node.id + '[node-type= "' + event.node['node-type'] + '"]').siblings('span');
                var text = event.node.name;
                var html = '<input value ="' + text + '" type="text">';
                $(span).parent().addClass('form-group');
                $(span).html(html);
                $(span).find('input').focus();

                $(span).find('input').keypress(function(e) {
                    var keycode = (e.keyCode ? e.keyCode : e.which);
                    if(keycode === 13) {
                        doneInput();
                    }
                });

                $(span).find('input').focusout(function() {
                    doneInput();
                });

                var doneInput = function() {
                    var inputValue = $(span).find('input').val();
                    $(span).find('input').remove();
                    if(event.node['node-type'] === 'overlay' && inputValue !== '') {
                        $(span).text(inputValue);
                        adapter.overlayManager.sendOverlayCreate(event.node.id, inputValue);
                    } else if (event.node['node-type'] === 'feature' && inputValue !== '') {
                        $(span).text(inputValue);
                        adapter.overlayManager.sendFeatureUpdate(event.node.parent.id, event.node.id, inputValue, null);
                    } else {
                        $(span).text(text);
                    }
                };
            });
            $('#overlay-tree').bind('tree.move', function(event) {
                var moveInfo = event.move_info;
                if(moveInfo.moved_node['node-type'] === 'feature') {
                    adapter.overlayManager.sendFeatureUpdate(moveInfo.moved_node.parent.id, moveInfo.moved_node.id,
                        moveInfo.moved_node.name, moveInfo.target_node.id);
                } else {
                    adapter.overlayManager.sendOverlayUpdate(moveInfo.moved_node.id, moveInfo.moved_node.name, moveInfo.target_node.id);
                }
            });

            var overlaySelectonChanged = function() {
                 if($('#overlay-selection').val() === 'Add New Overlay') {
                    $('#add-overlay-div').show();
                } else {
                    $('#add-overlay-div').hide();
                }
                resizeOverlayManager();
                checkAddFormCompleted();
            };

            var addOverlayOrFeature = function() {
                var featureName = $('#feature-add-name').val();
                var featureId = $('#feature-add-id').val();
                var featureUrl = $('#feature-add-url').val();
                var featureParams = $('#feature-add-params').val();
                var overlayName = $('#overlay-add-name').val();
                var overlayId = $('#overlay-add-id').val();
                var zoom = $('#zoom-checkbox').is(':checked');
                if(!($('#add-feature-div').is(':visible'))) {
                    adapter.overlayManager.sendOverlayCreate(overlayId, overlayName);
                } else if($('#overlay-selection').val() === 'Add New Overlay') {
                    adapter.overlayManager.sendOverlayCreate(overlayId, overlayName);
                    adapter.overlayManager.sendFeaturePlotUrl(overlayId, featureId, featureName,
                        'kml', featureUrl, featureParams, zoom);
                } else {
                    adapter.overlayManager.sendFeaturePlotUrl($('#overlay-selection').find(":selected").attr('id'),
                        featureId, featureName,'kml', featureUrl, featureParams, zoom);
                }
                setStateInit();
            };

            var deleteOverlayOrFeature = function() {
                $("#overlay-tree input:checkbox:checked").each(function() {
                    if($(this).attr('node-type') === 'overlay') {
                        adapter.overlayManager.sendOverlayRemove($(this).attr('id'));
                    }
                    if($(this).attr('node-type') === 'feature') {
                        var node = $('#overlay-tree').tree('getNodeById', $(this).attr('id'));
                        adapter.overlayManager.sendFeatureUnplot(node.parent.id,$(this).attr('id'));
                    }
                });
            };

            var getRadioButtonSelection = function() {
                if($('#wms-radio').is(':checked')) {
                    $('#feature-params-group').show();
                } else {
                    $('#feature-params-group').hide();
                }
                resizeOverlayManager();
                checkAddFormCompleted();
            };

            var resizeOverlayManager = function() {
                var height = $('#overlay-manager-add').height() + 100;
                $('#popover_overlay_wrapper').css('height', height + 'px');
            };

            var updateOverlaySelection = function() {
                $('#overlay-selection > option').remove();
                var overlayObject = adapter.overlayManager.getOverlays();
                for(var key in overlayObject) {
                    var appendHtml = ' <option id= "'+ overlayObject[key].id +'">' + overlayObject[key].name + '</option>';
                    $('#overlay-selection').append(appendHtml);
                }
                var defaultHtmlAdd = '<option id= "add-new-overlay-option">Add New Overlay</option>';
                $('#overlay-selection').append(defaultHtmlAdd);
                overlaySelectonChanged();
            };

            var isOverlayTreeEmpty = function() {
                return adapter.overlayManager.getOverlayTree().length === 0;
            };

            var removeSucessFromURL = function() {
                if($(this).attr('id') !== 'feature-add-url') {
                    $('#feature-add-url').parent().removeClass('has-success');
                }
                checkAddFormCompleted();
            };

            var validateURLInput = function() {
                if(!isValidUrl($(this).val())) {
                    $(this).parent().removeClass('has-success');
                    $(this).parent().addClass('has-error');
                    $('.help-block').show();
                } else {
                    $(this).parent().removeClass('has-error');
                    $(this).parent().addClass('has-success');
                    $(this).removeClass('has-error');
                    $('.help-block').hide();
                }
                resizeOverlayManager();
            };

            var isValidUrl = function(url){
                  return (/\b(https?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~ |‌​]/).test(url);
            };

            var checkAddFormCompleted = function() {
                var emptyInputs = $('.form-control.default').filter(function() {
                    return $(this).val() === '' && $(this).is(':visible');
                }).length;
                if(emptyInputs === 0 || !($('#add-feature-div').is(':visible'))) {
                    $('#overlay-manager-add-button').removeClass('disabled');
                } else {
                    $('#overlay-manager-add-button').addClass('disabled');
                }
            };

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
                $("#overlay-tree.default input:checkbox").off('change');
                $("#overlay-tree.default input:checkbox").on('change', function () {
                    var node = $('#overlay-tree').tree('getNodeById', $(this).attr('id'));
                    if($(this).is(':checked') && $(this).attr('node-type') === 'overlay') {
                       adapter.overlayManager.sendOverlayShow($(this).attr('id'));
                    } else if(!($(this).is(':checked')) && $(this).attr('node-type') === 'overlay') {
                        adapter.overlayManager.sendOverlayHide($(this).attr('id'));
                    } else if($(this).is(':checked') && $(this).attr('node-type') === 'feature') {
                       adapter.overlayManager.sendFeatureShow(node.parent.id, $(this).attr('id'));
                    } else if(!$(this).is(':checked') && $(this).attr('node-type') === 'feature') {
                        adapter.overlayManager.sendFeatureHide(node.parent.id, $(this).attr('id'));
                    }
                });
                $("#overlay-tree.remove-tree input:checkbox").on('change', function () {
                    checkDeleteButtonDisabled();
                    $(this).parent().next('ul').find('input:checkbox').prop('checked', $(this).prop("checked"));
                });
            };

            /**
            * Method used by the button binded to the basemaps icon.
            * Toggles the basemaps popover open/close.
            * If the overlay manager popover is already open then close it.
            **/
            var toggleBaseMaps = function() {
                $('#popover_content_wrapper').toggle();
                $('#overlay').removeClass('selected');
                $('#popover_overlay_wrapper').hide();
                $('#basemaps').toggleClass('selected');
            };

            /**
            * Method used by the button binded to the overlay manager icon.
            * Toggles the overlay manager open/close.
            * If the basemap popover is already open then close it.
            * Resize the window to the correct size given the tree.
            **/
            var toggleOverlayManager = function() {
                $('#popover_overlay_wrapper').toggle();
                $('#basemaps').removeClass('selected');
                $('#popover_content_wrapper').hide();
                $('#overlay').toggleClass('selected');
                setStateInit();
            };

            /**
            * This function is used to automatically adjust the size of the window to the size of the tree plus
            * a given specified offset/padding.
            **/
            var resizeOverlayToTree = function(tree, offset) {
                var treeHeight = $(tree).css('height');
                treeHeight = parseInt(treeHeight.substr(0, treeHeight.length-2));
                $('#popover_overlay_wrapper').css('height', (treeHeight + offset) + 'px');
            };

            var updateTree = function() {
                $('#overlay-tree').tree('loadData',adapter.overlayManager.getOverlayTree());
                resizeOverlayToTree('#overlay-tree', 90);
                if(!isOverlayTreeEmpty()) {
                    $('#no-overlay-tooltip').hide();
                } else {
                    $('#no-overlay-tooltip').show();
                }
                bindSelectionHandlers();

            };

            /**
            * This function is called each time the tree needs to be updated, the updating is handled through
            * jquery tree.
            **/
            var updateTreeData = function() {
                updateTree();
                setStateInit();
            };
            adapter.overlayManager.bindTreeChangeHandler(updateTreeData);

            var checkDeleteButtonDisabled = function() {
                $('#overlay-manager-delete-button').addClass('disabled');
                if($('#overlay-tree.remove').is(':visible') && $("#overlay-tree input:checkbox:checked").length > 0) {
                    $('#overlay-manager-delete-button').removeClass('disabled');
                }
            };

            var setStateInit = function() {
                $('#overlay-tree').removeClass('remove-tree');
                $('#overlay-tree').addClass('default');
                $('#overlay-delete-icon').removeClass('disabled');
                $('#no-overlay-tooltip').hide();
                if(isOverlayTreeEmpty()) {
                    $('#no-overlay-tooltip').show();
                    $('#overlay-delete-icon').addClass('disabled');
                }
                $('.add').hide();
                $('.remove').hide();
                $('.init').show();
                $('#overlay-tree').css('top','50px');
                $('#feature-add-url').parent().removeClass('has-success');
                $('#feature-add-url').parent().removeClass('has-error');
                updateTree();
                resizeOverlayToTree('#overlay-tree', 90);
            };

            var addState = function() {
                $('#no-overlay-tooltip').hide();
                clearAddInputs();
                $('.init').hide();
                $('.add').show();
                resizeOverlayManager();
            };

            var setStateAdd = function() {
                $('#add-overlay-div').hide();
                $('#add-feature-div').show();
                addState();
                checkAddFormCompleted();
                updateOverlaySelection();
            };

            var setStateAddOverlay = function() {
                $('#add-overlay-div').show();
                $('#add-feature-div').hide();
                addState();
            };

            var setStateRemove = function() {
                $("#overlay-tree.default input:checkbox").off('change');
                $('.init').hide();
                $('.remove').show();
                $('#overlay-tree').addClass('remove-tree');
                $('#overlay-tree').removeClass('default');
                bindSelectionHandlers();
                updateOverlaySelection();
                checkDeleteButtonDisabled();
                $("#overlay-tree.remove-tree input:checkbox").removeAttr('checked');
                $('#overlay-tree').css('top','85px');
                resizeOverlayToTree('#overlay-tree', 125);
            };

            var addButtonHandlers = function() {
                $('#map').on('click', function() {
                    $('#popover_overlay_wrapper').hide();
                    $('#popover_content_wrapper').hide();
                    $('#basemaps').removeClass('selected');
                    $('#overlay').removeClass('selected');
                });
                $('#tooltip-x-button').on('click', function(){$('#no-overlay-tooltip').hide()});
                $('#overlay').on('click', toggleOverlayManager);
                $('#basemaps').on('click', toggleBaseMaps);
                $('#overlay-add-icon').on('click', setStateAdd);
                $('#add-overlay-icon').on('click', setStateAddOverlay);
                $('#overlay-delete-icon').on('click', setStateRemove);
                $('#overlay-back-icon').on('click', setStateInit);
                $('#overlay-manager-add-button').on('click',  addOverlayOrFeature);
                $('#overlay-manager-delete-button').on('click',  deleteOverlayOrFeature);
                $('#overlay-selection').on('change', overlaySelectonChanged);
                $('.type-radio').on('change', getRadioButtonSelection);
                $('form').find('.form-control.default').keyup(removeSucessFromURL);
                $('#feature-add-url').keyup(validateURLInput);
                $("[rel=tooltip]").tooltip({ placement: 'bottom'});
            }();
       });
    }
    });
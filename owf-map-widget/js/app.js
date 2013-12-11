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

            var scalebar = new Scalebar({
                map:map,
                attachTo:"bottom-left",
                scalebarUnit: "dual"
            });

            $('#tooltip-x-button').on('click', function() {
                $('#no-overlay-tooltip').hide();
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
                } else if($('#overlay-selection').val() == 'Default Overlay') {
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
                    $('#add-overlay-div').show();
                } else {
                    $('#add-overlay-div').hide();
                }
                resizeOverlayManager();
                checkAddFormCompleted();
            });
            $('.type-radio').on('change', function() {
                console.log('hi');
                if($('#wms-radio').is(':checked')) {
                    $('#feature-params-group').show();
                } else {
                    $('#feature-params-group').hide();
                }
                resizeOverlayManager();
                checkAddFormCompleted();
            });

            var resizeOverlayManager = function() {
                var height = $('#overlay-manager-add').height() + 100;
                $('#popover_overlay_wrapper').css('height', height + 'px');
            }
            var checkInvalidUrl = function() {
                return $('#feature-add-url').parent().hasClass('has-error');
            }

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
            $('form').find('.form-control.default').keyup(function() {
                if($(this).attr('id') !== 'feature-add-url') {
                    $('#feature-add-url').parent().removeClass('has-success');
                }
                checkAddFormCompleted();
            });
            $('#feature-add-url').keyup(function() {
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
            });

            var isValidUrl = function(url){
                  return /\b(https?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|‌​]/.test(url);
            }

            var checkAddFormCompleted = function() {
                var emptyInputs = $('.form-control.default').filter(function() {
                    return $(this).val() === '' && $(this).is(':visible');
                }).length;
                if(emptyInputs === 0) {
                    $('#overlay-manager-add-button').removeClass('disabled');
                } else {
                    $('#overlay-manager-add-button').addClass('disabled');
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
                    var image = './images/icons/Tree_Folder.png';
                    if(node.type === 'feature') {
                        image = './images/icons/kml_icon.gif';
                    }
                    $li.find('.jqtree-title').before(
                        '<input type="checkbox" id="' + node.id+ '" class ="tree-node" node-type="' + node.type + '" isHidden="' + node.isHidden + '"/>' +
                        '<img src=' + image + ' alt="Overlay Icon" height="25" width="25">'
                    );
                }
            });
        $tree.bind('tree.dblclick',
            function(event) {
                var span = $('#' + event.node.id).siblings('span');
                var text = $(span).text();
                var html = '<input value ="' + text + '" type="text">'
                $(span).parent().addClass('form-group');
                $(span).html(html)
                $(span).find('input').focus();

                $(span).find('input').keypress(function(e) {
                    var keycode = (e.keyCode ? e.keyCode : e.which);
                    if(keycode == '13') {
                        doneInput();
                    }
                });

                $(span).find('input').focusout(function() {
                    doneInput();
                });

                var doneInput = function() {
                    var inputValue = $(span).find('input').val();
                    $(span).find('input').remove();
                    if(event.node['node-type'] === 'overlay' || inputValue !== '') {
                        $(span).text(inputValue);
                        adapter.overlayManager.sendOverlayCreate(event.node.id, inputValue);
                    } else if(event.node['node-type'] === 'overlay' || inputValue === '') {
                        $(span).text(text);
                    }
                };
            }
        );
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
                    $(this).parent().next('ul').find('input:checkbox').prop('checked', $(this).prop("checked"));
                    if($(this).is(':checked') && $(this).attr('node-type') === 'overlay') {
                        adapter.overlayManager.sendOverlayShow($(this).attr('id'));
                    } else if(!($(this).is(':checked')) && $(this).attr('node-type') === 'overlay') {
                        adapter.overlayManager.sendOverlayHide($(this).attr('id'));
                    } else if($(this).is(':checked') && $(this).attr('node-type') === 'feature') {
                        adapter.overlayManager.sendFeatureShow(node.parent.id, $(this).attr('id'))
                    } else if(!($(this).is(':checked')) && $(this).attr('node-type') === 'feature') {
                        adapter.overlayManager.sendFeatureHide(node.parent.id, $(this).attr('id'))
                    }
                    $(this).prop('checked');
                });
                $("#overlay-tree.remove input:checkbox").on('change', function () {
                    $(this).parent().next('ul').find('input:checkbox').prop('checked', $(this).prop("checked"));
                    checkDeleteButtonDisabled();
                });
            }

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
            }

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
                setStateInit()
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
                    $('#no-overlay-tooltip').hide();
                } else {
                    $('#no-overlay-tooltip').show();
                }
                updateCheckBoxes();
                bindSelectionHandlers();
                setStateInit();
            }
            adapter.overlayManager.bindTreeChangeHandler(updateTreeData);

            var updateCheckBoxes = function() {
                $("#overlay-tree.default input:checkbox").each(function(index) {
                    if(($(this).attr('ishidden') == 'false')) {
                        $(this).attr('checked', 'checked');
                    }
                });
            }

            var checkDeleteButtonDisabled = function() {
                $('#overlay-manager-delete-button').addClass('disabled');
                if($('#overlay-tree.remove').is(':visible') && $("#overlay-tree input:checkbox:checked").length > 0) {
                    $('#overlay-manager-delete-button').removeClass('disabled');
                }
            };

            var setStateInit = function() {
                $('#overlay-delete-icon').removeClass('disabled');
                $('#no-overlay-tooltip').hide();
                if(isOverlayTreeEmpty()) {
                    $('#no-overlay-tooltip').show();
                    $('#overlay-delete-icon').addClass('disabled');
                }
                $('#overlay-manager-add-button').hide();
                $('#overlay-manager-delete-button').hide();
                $('#overlay-manager-add').hide();
                $('#overlay-manager-delete').hide();
                $('#overlay-back-icon').hide();
                $('#overlay-add-icon').show();
                $('#overlay-delete-icon').show();
                $('#overlay-tree').show();
                $('#overlay-tree').addClass('default');
                $('#overlay-tree').removeClass('remove');
                $('#overlay-tree').css('top','50px');
                $('.help-block').hide();
                $('#feature-add-url').parent().removeClass('has-success');
                $('#feature-add-url').parent().removeClass('has-error');
                updateCheckBoxes();
                bindSelectionHandlers();
                resizeOverlayToTree('#overlay-tree', 90);
            }
            var setStateAdd = function() {
                $('#no-overlay-tooltip').hide();
                clearAddInputs();
                $('#overlay-add-icon').hide();
                $('#overlay-delete-icon').hide();
                $('#overlay-manager-delete-button').hide();
                $('#add-overlay-div').hide();
                $('#overlay-manager-delete').hide();
                $('#overlay-tree').hide();
                $('#overlay-back-icon').show();
                $('#overlay-manager-add').show();
                $('#overlay-manager-add-button').show();
                $('#overlay-manager').show();
                $('#overlay-manager-subtitle').show();
                checkAddFormCompleted();
                updateOverlaySelection();
                resizeOverlayManager();
            }
            var setStateRemove = function() {
                $('#no-overlay-tooltip').hide();
                $('#overlay-add-icon').hide();
                $('#overlay-delete-icon').hide();
                $('#add-overlay-div').hide();
                $('#overlay-manager-add-button').hide();
                $('#overlay-manager-add').hide();
                $('#overlay-manager-delete').show();
                $('#overlay-manager').show();
                $('#overlay-manager-delete-button').show();
                $('#delete-feature-subtitle').show();
                $('#overlay-back-icon').show();
                $('#overlay-tree').show();
                $("#overlay-tree.default input:checkbox").off('change');
                $('#overlay-tree').removeClass('default');
                $('#overlay-tree').addClass('remove');
                $("#overlay-tree.remove input:checkbox").removeAttr('checked');
                bindSelectionHandlers();
                updateOverlaySelection();
                checkDeleteButtonDisabled();
                $('#overlay-tree').css('top','85px');
                resizeOverlayToTree('#overlay-tree', 125);
            }
        });
    }
    });
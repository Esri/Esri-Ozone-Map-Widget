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

        $('#basemaps').on('click', function() {
            toggleBaseMaps();
        });
        $('#overlay').on('click', function() {
            toggleOverlay();
        });
        $('#overlay-add-icon').on('click', function() {
            toggleOverlaySettings();
            $('#overlay-manager-add').toggleClass('hidden');
            $('#overlay-manager-subtitle').text('Add New Feature');
            //$('#popover_overlay_wrapper').css('height', '305px');
        });
        $('#overlay-delete-icon').on('click', function() {
            $('#overlay-manager-delete').toggleClass('hidden');
            toggleOverlaySettings();
            $('#overlay-manager-subtitle').text('Delete Existing Overlays');
        });
        $('#overlay-back-icon').on('click', function() {
            if(!$('#overlay-manager-add').hasClass('hidden')) {
                $('#overlay-manager-add').toggleClass('hidden');
            }
            if(!$('#overlay-manager-delete').hasClass('hidden')) {
                $('#overlay-manager-delete').toggleClass('hidden');
            }
            toggleOverlaySettings();

        });
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

        /*var kmlUrl = "http://www.dgs.maryland.gov/ISSSD/FuelManagement/FuelingSites.kml";
        var kml = new KMLLayer(kmlUrl);
        map.addLayer(kml);
        kml.on("load", function() {
            domStyle.set("loading", "display", "none");
        });*/

        $("[rel=tooltip]").tooltip({ placement: 'bottom'});

        //Sample tree data for overlay manager
        var data = [
        {
            label: 'node1',
            image: './sampleimage.png',
            type: 'feature',
            children: [
                { label: 'child1' },
                { label: 'Aggrevated Assault/ No Firearm ' }
            ]
        },
        {
            label: 'node2',
            children: [
            { label: 'child3' }
            ]
        },
        {
            label: 'node2',
            children: [
            { label: 'child3' }
            ]
        },
        {
            label: 'node2',
            children: [
            { label: 'child3' }
            ]
        },
        {
            label: 'node2',
            children: [
            { label: 'child3' }
            ]
        },
        {
            label: 'node2',
            children: [
            { label: 'child3' }
            ]
        },
        {
            label: 'node1',
            image: './sampleimage.png',
            type: 'feature',
            children: [
                { label: 'child1' },
                { label: 'Aggrevated Assault/ No Firearm ' }
            ]
        },
        ];

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


        $("#overlay-tree input:checkbox").on('change', function () {
            $(this).parent().next('ul').find('input:checkbox').prop('checked', $(this).prop("checked"));
        });
        $("#overlay-removal-tree input:checkbox").on('change', function () {
            $(this).parent().next('ul').find('input:checkbox').prop('checked', $(this).prop("checked"));
        });


        var toggleBaseMaps = function() {
            if(!$('#popover_overlay_wrapper').hasClass('hidden')) {
                $('#popover_overlay_wrapper').toggleClass('hidden');
                $('#overlay').toggleClass('selected');
            }
            $('#popover_content_wrapper').toggleClass('hidden');
            $('#basemaps').toggleClass('selected');
        }

        var toggleOverlay = function() {
            if(!$('#popover_content_wrapper').hasClass('hidden')) {
                $('#popover_content_wrapper').toggleClass('hidden');
                $('#basemaps').toggleClass('selected');
            }
            $('#popover_overlay_wrapper').toggleClass('hidden');
            $('#overlay').toggleClass('selected');
        }

        var toggleOverlaySettings = function() {
            $('#overlay-tree').toggleClass('hidden');
            $('#overlay-manager').toggleClass('hidden');
            $('#overlay-add-icon').toggleClass('hidden');
            $('#overlay-delete-icon').toggleClass('hidden');
            $('#overlay-back-icon').toggleClass('hidden');
            $('#overlay-vr').css('right', '36px');
        }

    });

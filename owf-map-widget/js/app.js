// Entry point for map webapp
//
// NOTE: Modules that are not compatible with asynchronous module loading
// (AMD) are included in the webapp's HTML file to prevent issues.
require([
    "models/map", "models/legend", "dojo/mouse", "dojo/on", "dojo/dom", 
    "dojo/json", "esri/dijit/Geocoder", "esri/layers/KMLLayer","esri/dijit/BasemapGallery", 
    "esri/arcgis/utils","dojo/parser","dojo/dom-style",
    "dojo/domReady!"],
    function(Map, Legend, Mouse, On, Dom, JSON, Geocoder, KMLLayer, BasemapGallery, arcgisUtils, parser, domStyle) {
        var map = new Map("map", {
            center: [-76.809469, 39.168101],
            zoom: 7,
            basemap: "streets"
        });

        var dropZone = Dom.byId("map");
        var owf_adapter = new OWFAdapter(On , dropZone);
        
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

        $('#basemaps').on('click', function() {
            toggleBaseMaps();
            toggleOverlay(true);
        }); 
        $('#overlay').on('click', function() {
            toggleOverlay();
            toggleBaseMaps(true);
        });

        var kmlUrl = "http://www.dgs.maryland.gov/ISSSD/FuelManagement/FuelingSites.kml";
        var kml = new KMLLayer(kmlUrl);
        map.addLayer(kml);
        kml.on("load", function() {
            domStyle.set("loading", "display", "none");
        });

        $("[rel=tooltip]").tooltip({ placement: 'bottom'});

        //Sample tree data for overlay manager
        var data = [
        {
            label: 'node1',
            image: './sampleimage.png',
            children: [
                { label: 'child1' },
                { label: 'child2' }
            ]
        },
        {
            label: 'node2',
            children: [
            { label: 'child3' }
            ]
        }
        ];

        var $tree = $('#overlay-tree');
        $tree.tree({
            data: data,
            autoOpen: 1,
            onCreateLi: function(node, $li) {
                $li.find('.jqtree-title').before(
                    '<input type="checkbox" class ="tree-node"/>'
                );
            }
        });

                
        $("#overlay-tree input:checkbox").on('change', function () {
            $(this).parent().next('ul').find('input:checkbox').prop('checked', $(this).prop("checked"));
        });


        var toggleBaseMaps = function(close) {
            !close ? $('#basemaps').toggleClass('selected') : false;
            if(($('#popover_content_wrapper').css('visibility') === 'visible') || close) {
                $('#popover_content_wrapper').css('visibility', 'hidden');

            } else {
                $('#popover_content_wrapper').css('visibility', 'visible');
                if($('#overlay').hasClass('selected')) {
                    toggleOverlay();
                }
            }
        }
       
        var toggleOverlay = function(close) {
            !close ? $('#overlay').toggleClass('selected') : false;
            if(($('#popover_overlay_wrapper').css('visibility') === 'visible')|| close) {
                $('#popover_overlay_wrapper').css('visibility', 'hidden');
            } else {
                $('#popover_overlay_wrapper').css('visibility', 'visible');
                if($('#basemaps').hasClass('selected')) {
                    toggleBaseMaps();
                }
            }
        }

    });

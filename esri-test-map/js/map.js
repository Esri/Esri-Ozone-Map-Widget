var Map = function() {
	this.execute = function() {
		var map, geocoder;
		require([
			"esri/map", "esri/dijit/Geocoder", "esri/layers/KMLLayer","esri/dijit/BasemapGallery", 
			"esri/arcgis/utils","dojo/parser","dojo/dom-style", "dojo/domReady!"
			], function(Map, Geocoder, KMLLayer, BasemapGallery, arcgisUtils, parser, domStyle) {
				parser.parse();
				map = new Map("map",{
					basemap: "topo",
					center: [-76.809469, 39.168101], // lon, lat
					zoom: 7 
				});

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

				var data = [
					{
					label: 'node1',
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
							'<input type="checkbox" class ="tree-node">'
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
	}
}
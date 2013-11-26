var Map = function() {
	this.execute = function() {
		var map, geocoder;
		require([
			"esri/map", "esri/dijit/Geocoder", "esri/dijit/BasemapGallery", "esri/arcgis/utils",
			"dojo/parser",
			"dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dijit/TitlePane","dojo/domReady!"
			], function(Map, Geocoder, BasemapGallery, arcgisUtils, parser) {
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
				}); 

				$("[rel=tooltip]").tooltip({ placement: 'bottom'});
        
				var toggleBaseMaps = function() {
					$('#basemaps').toggleClass('selected');
					if($('#popover_content_wrapper').css('visibility') === 'hidden') {
						$('#popover_content_wrapper').css('visibility', 'visible');
					} else {
						$('#popover_content_wrapper').css('visibility', 'hidden');
					}
				}
       
				var toggleOverlay = function() {
					$('#overlay').toggleClass('selected');
					if($('#popover_content_wrapper').css('visibility') === 'hidden') {
						$('#popover_content_wrapper').css('visibility', 'visible');
					} else {
						$('#popover_content_wrapper').css('visibility', 'hidden');
					}
				}

			});
	}
}
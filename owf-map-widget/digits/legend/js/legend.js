define(["esri/dijit/Legend"], function(esriLegend) {

    var Legend = function(map) {
        var me = this;

        var layers = [];
        var legend;

        map.on('load', function() {
            handleLayout();
        });

        map.on("layer-add-result", function (evt) {
            if(evt.layer.declaredClass === "esri.layers.ArcGISTiledMapServiceLayer") {
                //basemap
                //noop
            } else if(evt.layer.declaredClass !== "esri.layers.KMLLayer"){/* ||
                evt.layer.declaredClass === "esri.layers.WMSLayer"){*/

                evt.layer._titleForLegend = evt.layer.id;
                var layerInfo = {layer:evt.layer, name:evt.layer.id};
                layers.push(layerInfo);

                if (layers.length > 0) {
                    /*var legendDijit = new Legend({
                        map: map,
                        layerInfos: layers
                    }, "legend_holder_div");*/
                    //legendDijit.startup();

                    if(legend) {
                        legend.refresh(layers);
                    } else {
                        legend = new esriLegend({
                            autoUpdate: true,
                            map: map,
                            respectCurrentMapScale: true,
                            layerInfos: layers
                        }, 'legend_holder_div');
                        legend.startup();
                    }
                }
            } else {
                //kml layer.... dont display this as it has sublayers which will display making this a duplicate
            }
        });

        var legendWidth = 250;
        var legendDividerWidth = 3;
        me.handleLegendPopOut = function() {
            $('#overlay').removeClass('selected');
            $('#basemaps').removeClass('selected');
            //$('#data_div_button').removeClass('selected');
            $('#legend_button').toggleClass('selected');

            //change handler to close the legend
            $("#legend_button").on('click', handleLegendClose);

            var totalWidth = legendWidth + legendDividerWidth;
            var windowWidth = $(window).width();
            setMapWidth((windowWidth - totalWidth));
            setLegendWidth(legendWidth);

            //$('#legend_button').removeClass('selected');

            $('.legend_vertical_divider').mousedown(function(e){
                e.preventDefault();
                $('*').css({'cursor':'col-resize'});
                $(document).mousemove(handleLegendResize);
            });
            $(document).mouseup(function(e){
                $(document).unbind('mousemove');
                $('*').css({'cursor':''});
            });
        };

        var handleLegendClose = function() {
            setLegendWidth(0);
            setMapWidth($(window).width());
            $('#legend_button').removeClass('selected');
            $("#legend_button").on('click', me.handleLegendPopOut);
        };

        var handleLegendResize = function(e){
            var windowWidth = $(window).width();
            var position = e.pageX;
            legendWidth = position - 3;

            setMapWidth(windowWidth - position);
            setLegendWidth(legendWidth);
        };

        var setLegendWidth = function(width) {
            $("#legend").width(width);
            $(".legend_vertical_divider").css('left', width+'px');
            if(width > 0) {
                $('.esri_info_div').width(width + legendDividerWidth);

                $('#legend_holder_div').width(width - 20);
                $(".legend_vertical_divider").width(3);
            } else {
                $('.esri_info_div').width(0);
                $('#legend_holder_div').width(0);
                $(".legend_vertical_divider").width(0);
            }
        };



        var setMapWidth = function(width) {
            $('#map').width(width);
            map.resize();
        };

        var handleLayout = function() {
            var windowWidth = $(window).width();
            setMapWidth(windowWidth - $("#legend").width());
        };
    };

    return Legend;
});
define(["esri/dijit/Legend"], function(esriLegend) {
    /**
     * @copyright © 2013 Environmental Systems Research Institute, Inc. (Esri)
     *
     * @license
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at<br>
     * <br>
     *     {@link http://www.apache.org/licenses/LICENSE-2.0}<br>
     * <br>
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * @version 1.1
     *
     * @module digits/Legend
     */

    /**
     * @constructor
     * @param map {Object} Esri map for which this legend should apply.
     * @alias module:digits/Legend
     */
    var Legend = function(map) {
        var me = this;

        var layers = [];
        var legend;

         map.on('load', function() {
            $(window).resize(function() {
                handleLayout();
            });
         });

        //Catch layers being added and push them into the legend
        map.on("layer-add-result", function (evt) {
            if(evt.layer.declaredClass === "esri.layers.ArcGISTiledMapServiceLayer") {
                //basemap
                //noop
            } else if(evt.layer.declaredClass !== "esri.layers.KMLLayer"){
                evt.layer._titleForLegend = evt.layer.id;
                var layerInfo = {layer:evt.layer, name:evt.layer.id};
                layers.push(layerInfo);

                if (layers.length > 0) {


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
                //kml layer....
                //dont display this as it has sublayers which will display making this a duplicate
            }
        });

        //clean up the legend when layers are removed from the map.
        map.on('layer-remove', function(layer) {
            for(var i = 0; i < layers.length; i++) {
                if(layers[i].name === layer.layer.id) {
                    layers.splice(i, 1);
                    legend.refresh(layers);
                    return;
                }
            }
        });

        //update the name of layers in the legend when the layer is updated or moved in the overlay manager
        map.on('layerUpdated', function(data) {
            for(var i = 0; i < layers.length; i++) {
                if(layers[i].name === data.old_id) {
                    layers[i] = {name: data.layer.id, layer: data.layer}
                    legend.refresh(layers);
                    return;
                }
            }
        });

        var legendWidth = 250;
        var legendDividerWidth = 3;
        /**
         * Show the legend and resize the map.
         * Note- The map size is set explicitly to prevent it from auto-resizing to 600px x 400px
         */
        me.handleLegendPopOut = function() {
            $('#overlay').removeClass('selected');
            $('#basemaps').removeClass('selected');
            //$('#data_div_button').removeClass('selected');
            $('#legend_button').toggleClass('selected');

            //change handler to close the legend
            $("#legend_button").on('click', handleLegendClose);

            var totalWidth = legendWidth + legendDividerWidth;
            var windowWidth = $(window).width();

            if(totalWidth >= windowWidth) {
                totalWidth = windowWidth - 1;
            }

            setMapWidth(windowWidth - totalWidth);
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

        /**
         *  Close the legend and reset the map to full window size
         */
        var handleLegendClose = function() {
            setLegendWidth(0);
            setMapWidth($(window).width());
            $('#legend_button').removeClass('selected');
            $("#legend_button").on('click', me.handleLegendPopOut);
        };

        var handleLegendResize = function(e){
            var windowWidth = $(window).width();
            var position = e.pageX;

            if(position >= windowWidth) {
                position = windowWidth - 1;
            }

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
            setMapWidth(windowWidth - ($("#legend").width() + $(".legend_vertical_divider").width()));
        };
    };

    return Legend;
});
define([], function() {
    var DataDiv = function(map) {
        var dataDivHeight = 250;
        var dataDivDividerHeight = 3;
        var handleDataDivPopOut = function() {
            $('#overlay').removeClass('selected');
            $('#basemaps').removeClass('selected');
            $('#legend_button').removeClass('selected');
            $('#data_div_button').toggleClass('selected');

            //change handler to close the legend
            $("#data_div_button").on('click', handleDataDivClose);

            var totalHeight = dataDivHeight + dataDivDividerHeight;
            var windowHeight = $(window).height();
            setMapHeight(windowHeight - totalHeight);
            setLegendHeight(windowHeight - totalHeight);
            setDataDivHeight(dataDivHeight);

            $('#data_div_button').removeClass('selected');

            $('.esri_bottom_horizontal_divider').mousedown(function(e){
                e.preventDefault();
                $('*').css({'cursor':'row-resize'});
                $(document).mousemove(handleDataDivResize);
            });
            $(document).mouseup(function(e){
                $(document).unbind('mousemove');
                $('*').css({'cursor':''});
            });
        };

        var setMapHeight = function(height) {
            $('#map').height(height);
            map.resize();
        };

        var setLegendHeight = function(height) {
            $(".legend_vertical_divider").height(height);
            $("#legend").height(height);
            $('.esri_info_div').height(height);
            if(height === '100%') {
                $('#legend_holder_div').css('max-height', height);
            } else {
                $('#legend_holder_div').css('max-height', height+'px');
            }
        };

        var handleDataDivResize = function(e) {
            var windowHeight = $(window).height();
            var position = e.pageY;
            console.log(position);
            dataDivHeight = (windowHeight - position) - 3;

            setMapHeight(position);
            setLegendHeight(position);
            setDataDivHeight(dataDivHeight);
        };

        var handleDataDivClose = function() {
            setDataDivHeight(0);
            setLegendHeight('100%');
            setMapHeight('100%');
            $('#data_div_button').on('click', handleDataDivPopOut);
        };

        var setDataDivHeight = function(height) {
            if(height > 0) {
                $('.esri_bottom_data_div').height(height);
                $('.esri_bottom_horizontal_divider').height(dataDivDividerHeight);
                $('.esri_bottom_horizontal_divider').css('bottom', height+'px');
            } else  {
                $('.esri_bottom_data_div').height(0);
                $('.esri_bottom_horizontal_divider').height(0);
                $('.esri_bottom_horizontal_divider').css('bottom', '0px');
            }
        };
    }
});
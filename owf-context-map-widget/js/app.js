
require([
    "esri/map", "esri/toolbars/navigation", "cmwapi/cmwapi", "dojo/domReady!"],
    function(Map, Navigation, CommonMapApi) {
        var map = new Map("mapDiv", {
            center: [-77.035841, 38.901721],
            zoom: 1,
            basemap: "streets",
            slider:false

        });


       var navToolbar = new Navigation(map);

        map.on('load', function() {
            map.disablePan();
            map.enableRubberBandZoom();
            map.setMapCursor("crosshair");
            map.setScale(map.getMinScale());
        });

        map.on('mouse-down',function(e) {
            //console.log(e);
            // e.preventDefault()
            // navToolbar.activate(navToolbar.ZOOM_OUT);
        });





        if (OWF.Util.isRunningInOWF()) {
            OWF.ready(function () {
                OWF.notifyWidgetReady();
                var dragStart = null;

                map.on('dbl-click', function(e) {
                    var locationEvent = {};
                    locationEvent.location = {lat: e.mapPoint.getLatitude(), lon: e.mapPoint.getLongitude()};
                    CommonMapApi.view.center.location.send(locationEvent);
                });
                map.on('click', function(e) {
                    var locationEvent = {};
                    locationEvent.location = {lat: e.mapPoint.getLatitude(), lon: e.mapPoint.getLongitude()};
                    CommonMapApi.view.center.location.send(locationEvent);
                });
                map.on('mouse-drag-start', function(e) {
                    // console.log("**************************************");
                    // console.log(e);
                    // console.log("**************************************");
                    dragStart = e.map
                    //console.log(navToolbar);
                    navToolbar.activate(Navigation.ZOOM_IN);

                    // var locationEvent = {};
                    // locationEvent.bounds = {};
                    // locationEvent.bounds.southWest;
                    // locationEvent.bounds.northEast;
                    // CommonMapApi.view.center.bounds.send(locationEvent);
                });
                map.on('mouse-drag', function(e) {
                    console.log("**************************************");
                    console.log(navToolbar);
                    console.log("**************************************");
//                     function (a){
//                         var b=this.map;this._graphic||(this._deactivateMapTools(!0,!1,!1,!0),
//                             this._graphic=new r(null,this.zoomSymbol));
//                         switch(a){
//                             case u.ZOOM_IN:case u.ZOOM_OUT:this._deactivate();this._onMouseDownHandler_connect=m.connect(b,"onMouseDown",this,"_onMouseDownHandler");this._onMouseDragHandler_connect=m.connect(b,"onMouseDrag",this,"_onMouseDragHandler");this._onMouseUpHandler_connect=m.connect(b,"onMouseUp",this,"_onMouseUpHandler");this._navType=
// a;break;case u.PAN:this._deactivate(),b.enablePan(),this._navType=a}}

                });

                navToolbar.on('extent-history-change', function(e) {
                    // console.log("**************************************");
                    // console.log(e);
                    // console.log("**************************************");

                });


            });
        }
    }
);

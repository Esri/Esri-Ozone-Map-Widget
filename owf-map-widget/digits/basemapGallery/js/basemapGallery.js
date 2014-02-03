define(['esri/dijit/BasemapGallery', 'OWFWidgetExtensions/owf-widget-extended'], function(EsriBasemapGallery, OWFWidgetExtensions) {
    var OVERLAY_PREF_NAMESPACE = 'com.esri';
    var OVERLAY_PREF_NAME = 'basemapSelection';

    var BasemapGallery = function(params, srcNodeRef) {
        var basemapGallery;
        if(srcNodeRef) {
            basemapGallery = new EsriBasemapGallery(params, srcNodeRef);
        } else {
            basemapGallery = new EsriBasemapGallery(params);
        }


        basemapGallery.on('load', function() {
            var successHandler = function(retValue) {
                var basemap;
                if (retValue && retValue.value) {
                    console.log("Retrieved basemap: " + retValue.value);
                    basemap = retValue.value;
                }

                basemapGallery.select(basemap);
            };

            var failureHandler = function(e) {
                console.log("Error in getting preference" + e);
            };

            OWFWidgetExtensions.Preferences.getWidgetInstancePreference({
                namespace: OVERLAY_PREF_NAMESPACE,
                name: OVERLAY_PREF_NAME,
                onSuccess: successHandler,
                onFailure: failureHandler
            });
        });

        basemapGallery.on('selection-change', function(){
            var basemap = basemapGallery.getSelected();

            //archive basemap
            var successHandler = function() {
                //console.log("Saved basemap preference...");
            };
            var failureHandler = function() {
                console.log ("Unable to archive state.");
            };

            var dataValue = OWFWidgetExtensions.Util.toString(basemap.id);
            OWFWidgetExtensions.Preferences.setWidgetInstancePreference({
                namespace: OVERLAY_PREF_NAMESPACE,
                name: OVERLAY_PREF_NAME,
                value: dataValue,
                onSuccess: successHandler,
                onFailure: failureHandler
            });
        });

        basemapGallery.on("error", function(msg) {
          console.debug("basemap gallery error:  ", msg);
        });

        return basemapGallery;
    }

    return BasemapGallery;
});
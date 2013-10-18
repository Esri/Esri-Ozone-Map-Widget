# Running in Offline Mode

The ESRI OWF Map Widget cab be configured to use a local copy of the ESRI JavaScript API instead of downloading said API from the [Internet](http://js.arcgis.com) on each startup. To enable offline mode:

1. Download the **`arcgis_js_v37_api.zip`** package from the [ESRI site](http://www.esri.com/apps/products/download).
2. Unzip and copy the contents of the **`arcgis_js_api/library/3.7/3.7`** directory to the **`js/lib/esri-3.7`** directory (where this README is located).
3. Run the Map widget with _`offline=true`_ set as a URL parameter.

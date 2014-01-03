var allTestFiles = [];
// var TEST_REGEXP = /test.*\.js$/;
var TEST_REGEXP = /spec\.js$/;

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(file);
    }
});

var dojoConfig = {
    packages: [
        // hosted packages
        // {
        //     name: 'esri',
        //     location: 'http://js.arcgis.com/3.7/js/esri'
        // },
        {
             name: 'dojo',
             location: 'http://js.arcgis.com/3.7/js/dojo/dojo'
         }, {
             name: 'dojox',
             location: 'http://js.arcgis.com/3.7/js/dojo/dojox'
         }, {
             name: 'dijit',
             location: 'http://js.arcgis.com/3.7/js/dojo/dijit'
         },
        {
            name: 'cmwapi',
            location: '/base/cmwapi'
        }, {
            name: 'cmwapi-adapter',
            location: '/base/cmwapi-adapter'
        }, {
            name: 'owf-map-widget',
            location: '/base/owf-map-widget'
        }, {
            name: 'OWFWidgetExtensions',
            location: '/base/owf-map-widget/js'
        },{
            name: 'esri',
            location: '/base/test/mock/esri'
        }, {
            name: 'test',
            location: '/base/test'
        }
    ],
    async: true
};


/**
 * This function must be defined and is called back by the dojo adapter
  * @returns {string} a list of dojo spec/test modules to register with your testing framework
 */
window.__karma__.dojoStart = function(){
    return allTestFiles;
}


# ESRI Components for OWF
 
## Description

This Git Repo provides sample widgets (light-weight web applications) designed for use with the [OZONE Widget Framework (OWF)](https://github.com/ozoneplatform/owf) that leverage the [ArcGIS JavaScript API](https://developers.arcgis.com/en/javascript/) to provide mapping capabilities to end users.  In addition to sample widgets, this repo includes AMD module sets for integrating map based widgets via the [Common Map Widget Application Programming Interface (CMWAPI)](http://www.cmwapi.org).

## Included Components

#### [Basic Map Widget](https://github.com/Esri/Next-Century/tree/master/basic-map-widget)

A simple map widget using the ESRI [ArcGIS JavaScript API](https://developers.arcgis.com/en/javascript/). It's purpose is to provide a basic demonstration of using ArcGIS maps within OWF widgets.  
When run within OWF alongside the Contacts Manager widget described below, it includes the following features:

* Receives [drag and drop](https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Widget-Drag-and-Drop-API) data from other OWF widgets.

    > When an entry is dragged from the Contacts Manager into the map it will then plot and zoom to the location.

* Receives [Intents](https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Widget-Intents-API) from other OWF widgets that plot a location

#### [Contacts Manager](https://github.com/Esri/Next-Century/tree/master/contacts)

A modified version of the [Contacts Manager](https://github.com/ozoneplatform/owf/tree/master/web-app/examples/walkthrough/widgets/contacts) example widget that ships with OWF 7. This version uses Intents to allow the user to select which map widget implementation should receive the address when contact entry is clicked. (The original version was hard coded to send the address to a specific map widget.)

#### [ArcGIS OWF Map Widget](https://github.com/Esri/Next-Century/tree/master/owf-map-widget)

A more complex map widget.  This widget includes a few common ArcGIS JavaScript map controls for map view manipulation and allows the plotting of map layers through the CMWAPI.  Additionally, it includes a basic Overlay Manager for displaying and manipulating map Overlays and Features as defined by the CMWAPI.  This widget leverages the CMWAPI 1.1 Specification Implementation and the ArcGIS CMWAPI Adapter modules described below.

#### [cmwapi](https://github.com/Esri/Next-Century/tree/master/cmwapi)

A set of AMD modules that implement the CMWAPI specification and allow any OWF widget to communicate via CMWAPI channels without having to duplicate standard channel management and verification logic.  These modules attempt to provide all map-agnostic CMWAPI constructs and processing for client code.  They abstract the OWF pub/sub mechanism and include default message validation using specification rules. Where appropriate, missing message elements are replaced with default values (e.g., replacing missing overlayId values with the id of the sending widget).  Any errors detected by these modules are published on the map.error channel. 

#### [cmwapi-adapter](https://github.com/Esri/Next-Century/tree/master/cmwapi-adapter)

A set of AMD modules that can be used in conjunction with an [ArcGIS Map](https://developers.arcgis.com/en/javascript/jsapi/map-amd.html) object to interact with OWF widgets via the CMWAPI.  These modules attach a serices of event handlers to the CMWAPI channels that translate CMWAPI messages to appropriate ArcGIS JavaScript calls via the [cmwapi](https://github.com/Esri/Next-Century/tree/master/cmwapi) modules. They represent the ArcGIS specific portion of a full CMWAPI implementation.

## Requirements

1. OWF 6.0 GA or better.  See the OWF [Get Started](http://www.owfgoss.org/getstarted.html) page, if you are not familiar with the framework.
    
    > NOTE: Although CMWAPI 1.1 makes use of eventing, the widgets also take advantage of widget intents, introduced in OWF6.  Since CMWAPI 1.2 intends to add widget intents to the specification, we have concentrated on supporting releases of OWF which have the widget intents capability.  

2. Web server to host the widgets

    > NOTE: You may choose to host the widgets on the same server as OWF for convenience. The [OWF download](https://www.owfgoss.org/download.html) features a bundled [Tomcat](http://tomcat.apache.org/) instance.

3. Proxy to provide access to Esri services

    > NOTE: Certain Esri services, including those dealing with WMS, require provision of a [proxy](https://developers.arcgis.com/en/javascript/jshelp/ags_proxy.html), which is a server-side code deployment.  Choose and configure the appropriate proxy implementation (ASP.NET, Java, PHP, ...) for your web server.  

    > NOTE: The location for the proxy used by the ArcGIS OWF Map Widget is configured in app.js as esri.config.defaults.io.proxyUrl.

## Installation

1. Create an `esri` directory in the appropriate **_`webapps`_** location for your web server.

2. Copy the contents of this project to the newly created directory.

     > NOTE: To deploy minified versions of the CMWAPI and CMWAPI-ADAPTER modules, build the project using "grunt deploy" and copy the contents of the deployment folder to this location instead.

3. Login to your running OWF instance as an administrator.

4. [Create](https://github.com/ozoneplatform/owf/wiki/OWF-7-Administrator-Creating-and-Editing-Widgets) entries for the widgets in OWF by importing the following descriptor files from your server:
    * http(s)://_**yourserver**_:_**port**_/esri/owf-map-widget/descriptor.html
    * http(s)://_**yourserver**_:_**port**_/esri/basic-map-widget/descriptor.html
    * http(s)://_**yourserver**_:_**port**_/esri/contacts/descriptor/descriptor.html

5. Assign the widgets to the [OWF Users Group](https://github.com/ozoneplatform/owf/wiki/OWF-7-Administrator-Default-Content) or to specific users so they can be opened.

## Development Environment Setup

The unit tests and JavaScript documentation for this repository can be run/generated using the [GRUNT Task Runner](http://gruntjs.com "GRUNT: The JavaScript Task Runner - Homepage"). Said tests leverage the [Jasmine v1.3.1](http://pivotal.github.io/jasmine "Jasmine Introduction") testing framework and are executed with [Karma v0.10.2](http://karma-runner.github.io/0.10/index.html "Karma: Spectacular Test Runner for JavaScript - Homepage"). The required development tools are provided by the [NPM Registry](http://npmjs.org "Node Packaged Modules - Homepage") and [Node JS v0.10.21](http://nodejs.org "Node.js - Homepage").  Java must be installed and available in your PATH for use by [JSDoc](https://github.com/krampstudio/grunt-jsdoc "Grunt-jsdoc plugin").

> NOTE: The products of this repository can be developed and extended using any number of current JavaScript and web development frameworks. The installation steps below are provided for the convenience of contributors.

To setup the development environment, use the directions below. 

1. Install the appropriate [Node JS v0.10.21](http://nodejs.org/download "Node.js Downloads") package for your platform and the accompanying Node Package Manager (NPM).

    > WARNING: Older versions of Node/NPM (e.g., v0.8.x) may not execute the current Karma installation packages correctly on Windows. An update to the latest version of Node/NPM is recommended.

2. Install the GRUNT command line _globally_ by executing:

        npm install -g grunt-cli

3. Install other development dependencies by executing the following in the source code root directory (where the [package.json](package.json) file is located):

        npm install

4. (Optional) Install Karma _globally_ so that it may be executed manually outside of GRUNT (with alternate options specified):

        npm install -g karma

5. To run the unit tests and create JavaScript documentation simply execute `grunt` in the source code root directory.

We are also internally experimenting with the use of [Vagrant](http://www.vagrantup.com) and make our Vagrantfile efforts available in the dev-ops folder.  

### Grunt Targets
Once the development environment has been setup, grunt can be used to run JSHint on the JavaScript code, execute the functional tests and generate project documentation.  To run everything in series, use the following command from the top level directory.

        grunt

Specific build targets are defined in the top level file, Gruntfile.js.  At present, there are a few primary targets:  jshint, test, jsdoc, and deploy.  Provide those targets on the command line to execute only those grunt tasks.

        grunt jsdoc

Notes that targets can be nested for further refinement.  For example, to produce only the documentation for the CMWAPI related JavaScript files, use the following command:

        grunt jsdoc:cmwapi
         

Note that the below task accomplishes all of the development tasks listed above, and finally prepares a deployment folder with minify-ed versions of necessary JavaScript files and all other needed resources.

        grunt deploy


### Additional JavaScript Test Options

If you have installed Karma globally (as noted above) you may execute it manually from the command and reference a specific configuration file:

    karma start test/test-chrome.conf.js

If any tests fail, a common way to debug them is through the use of browser-specific tools. To enable this, you may override the config file settings for a specific browser and put Karma in server mode to allow for repeated test execution:

    karma start test/test-chrome.conf.js --browsers=Chrome --single-run=false

## Copyright

Copyright © 2013 [Environmental Systems Research Institute, Inc. (Esri)](http://www.esri.com)

## License

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's
[license.txt](https://github.com/Esri/Next-Century/blob/master/license.txt) file.

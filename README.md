# ESRI Components for OWF
 
## Description

A set of widgets (light weight web applications) designed for use with the [OZONE Widget Framework (OWF)](https://github.com/ozoneplatform/owf).

## Included Widgets

#### [ESRI OWF Map](esri-owf-map-widget)

A simple Map web application using the ESRI JavaScript API. It has additional features when run within OWF:

* Receives [drag and drop](https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Widget-Drag-and-Drop-API) data from other OWF widgets

    > When an entry is dragged from the Contacts Manager into the map it will then plot and zoom to the location.

* Receives [Intents](https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Widget-Intents-API) from other OWF widgets that plot a location

#### [Contacts Manager](contacts)

A modified version of the [Contacts Manager](https://github.com/ozoneplatform/owf/tree/master/web-app/examples/walkthrough/widgets/contacts) example widget that ships with OWF 7. This version uses Intents to allow the user to select which map widget implementation should receive the address when contact entry is clicked. (The original version was hard coded to send the address to a specific map widget.)

## Requirements

1. OWF 7.0 GA

2. Web server to host the widgets

    > NOTE: You may choose to host the widgets on the same server as OWF for convenience. The [OWF download](https://www.owfgoss.org/download.html) features a bundled [Tomcat](http://tomcat.apache.org/) instance.

## Installation

1. Copy the `esri-owf-map-widget` and `contacts` directories to the appropriate **_`webapps`_** location for your web server.
2. Login to your running OWF instance as an administrator.
3. [Create](https://github.com/ozoneplatform/owf/wiki/OWF-7-Administrator-Creating-and-Editing-Widgets) entries for the widgets in OWF by importing the following descriptor files from your server:
    * http(s)://_**yourserver**_:_**port**_/esri-owf-map-widget/descriptor.html
    * http(s)://_**yourserver**_:_**port**_/contacts/descriptor/descriptor.html

## Development Environment Setup

The unit tests and JavaScript documentation for this repository can be run/generated using the [GRUNT Task Runner](http://gruntjs.com "GRUNT: The JavaScript Task Runner - Homepage"). Said tests leverage the [Jasmine v1.3.1](http://pivotal.github.io/jasmine "Jasmine Introduction") testing framework and are executed with [Karma v0.10.2](http://karma-runner.github.io/0.10/index.html "Karma: Spectacular Test Runner for JavaScript - Homepage"). The required development tools are provided by the [NPM Registry](http://npmjs.org "Node Packaged Modules - Homepage") and [Node JS v0.10.21](http://nodejs.org "Node.js - Homepage").

> NOTE: The products of this repository can be developed and extended using any number of current JavaScript and web development frameworks. The installation steps below are provided for the convenience of contributors.

To setup the development environment:

1. Install the appropriate [Node JS v0.10.21](http://nodejs.org/download "Node.js Downloads") package for your platform and the accompanying Node Package Manager (NPM).

    > WARNING: Older versions of Node/NPM (e.g., v0.8.x) may not execute the current Karma installation packages correctly on Windows. An update to the latest version of Node/NPM is recommended.

2. Install the GRUNT command line _globally_ by executing:

        npm install -g grunt-cli

3. Install other development dependencies by executing the following in the source code root directory (where the [package.json](package.json) file is located):

        npm install

4. (Optional) Install Karma _globally_ so that it may be executed manually outside of GRUNT (with alternate options specified):

        npm install -g karma

5. To run the unit tests and create JavaScript documentation simply execute `grunt` in the source code root directory.

### Additional JavaScript Test Options

If you have installed Karma globally (as noted above) you may execute it manually from the command and reference a specific configuration file:

    karma start test/test-chrome.conf.js

If any tests fail, a common way to debug them is through the use of browser-specific tools. To enable this, you may override the config file settings for a specific browser and put Karma in server mode to allow for repeated test execution:

    karma start test/test-chrome.conf.js --browsers=Chrome --single-run=false

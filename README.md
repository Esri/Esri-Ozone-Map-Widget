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

    > You may choose to host the widgets on the same server as OWF for convenience. The [OWF download](https://www.owfgoss.org/download.html) features a bundled [Tomcat](http://tomcat.apache.org/) instance.

## Installation

1. Copy the `esri-owf-map-widget` and `contacts` directories to the appropriate **_`webapps`_** location for your web server.
2. Login to your running OWF instance as an administrator.
3. [Create](https://github.com/ozoneplatform/owf/wiki/OWF-7-Administrator-Creating-and-Editing-Widgets) entries for the widgets in OWF by importing the following descriptor files from your server:
    * http(s)://_**yourserver**_:_**port**_/esri-owf-map-widget/descriptor.html
    * http(s)://_**yourserver**_:_**port**_/contacts/descriptor/descriptor.html

## JavaScript Tests

At present, the test folder includes various unit/integration tests for the various JavaScript libraries developed herein.  The tests leverage the [Jasmine v1.3.1](http://pivotal.github.io/jasmine/) testing framework and are executed with [Karma v0.10.2](http://karma-runner.github.io/0.10/index.html).  Karma is a test runner that supports multiple JavaScript testing frameworks and allows for execution of JavaScript tests within targeted browsers (e.g., Chrome, IE, Firefox, PhantomJS).  These tools are provided by the [NPM Registry](http://npmjs.org/) and [Node JS v0.10.21](http://www.nodejs.org).  To install the appropriate tools, a good starting place is the [Karma Installation Instructions](http://karma-runner.github.io/0.10/intro/installation.html).

	> Older versions of Node/NPM (e.g., v0.8.xx) may not execute the current Karma installation packages correctly on Windows.  An update to the latest version of Node/NPM is recommended. 

To run the tests from the command line, reference one of the karma configuration files in the test directory:
	karma start test/test-chrome.conf.js

If any tests fail, a common way to debug them is through the use of browser-specific tools.  To enable this, you may override the config file settings for a specifc browser and put Karma in server mode to allow for repeated test execution:
	karma start test/test-chrome.conf.js --browsers=Chrome --single-run=false




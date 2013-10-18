# ESRI Components for OWF
 
## Description

A set of widgets (light weight web applications) designed for use with the [OZONE Widget Framework (OWF)](https://github.com/ozoneplatform/owf).

## Included Widgets

#### [ESRI OWF Map](esri-owf-map-widget)

A simple Map web application using the ESRI JavaScript API. It has additional features when run within OWF:

* Receives [drag and drop](https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Widget-Drag-and-Drop-API) data from other OWF widgets
> When an entry is dragged from the Contacts Manager into the map the map will plot the location and zoom to it.
* Receives [Intents](https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Widget-Intents-API) from other OWF widgets that plot a location

#### [Contacts Manager](contacts)

A modified version of the [Contacts Manager](https://github.com/ozoneplatform/owf/tree/master/web-app/examples/walkthrough/widgets/contacts) example widget that ships with OWF 7. This version uses Intents to allow the user to select which map widget implementation should receive the address when contact entry is clicked. (The original version was hard coded to send the address to a specific map widget.)

## Requirements

1. OWF 7.0 GA
2. Web server to host the widgets
> You may choose to host the widgets on the same server as OWF for convenience. The [OWF download](https://www.owfgoss.org/download.html) features a bundled [Tomcat](http://tomcat.apache.org/) instance.

## Installation

1. Copy the **`esri-owf-map-widget`** and **`contacts`** directories to the appropriate **`webapps`** location for your web server.
2. Login to your running OWF instance as an administrator.
3. [Create](https://github.com/ozoneplatform/owf/wiki/OWF-7-Administrator-Creating-and-Editing-Widgets) entries for the widgets in OWF by importing the following descriptor files from your server:
    * http(s)://_**yourserver**_:_**port**_/esri-owf-map-widget/descriptor.html
    * http(s)://_**yourserver**_:_**port**_/contacts/descriptor/descriptor.html

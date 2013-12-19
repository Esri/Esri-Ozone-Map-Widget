/**
 * Copyright © 2013 Environmental Systems Research Institute, Inc. (Esri)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at<br>
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(["cmwapi/cmwapi", "cmwapi-adapter/EsriOverlayManager", "cmwapi-adapter/View", "esri/kernel", "test/mock/esriMap", 
    "test/mock/OWF", "test/mock/Ozone"],
    function(CommonMapApi, OverlayManager, View, EsriNS, Map, OWF, Ozone) {

    describe("To test the CMWAPI Adapter view module", function() {
        beforeEach(function() {
            // Mock the necessary OWF methods and attach them to the window.
            // OWF should be in global scope when other libraries attempt to
            // access it.
            window.OWF = OWF;
            window.Ozone = Ozone;
            window.Map = Map;
        });

        afterEach(function() {
            // Remove our mock objects from the window so neither they nor
            // any spies upon them hang around for other test suites.
            delete window.OWF;
            delete window.Ozone;
            delete window.Map;
        });

        it("verifies that the view object can be created without error", function() {
            var view  = new View();
            expect(view).toBeDefined();
        });

        describe("spy on the cmwapi methods", function() {
            beforeEach(function() {
                //spyOn(CommonMapApi.view.request, 'addHandler').andCallThrough();
            });

            it("binds handlers to each of the view channels.", function() {
                var map; 
                var view;

                spyOn(CommonMapApi.view.center.bounds, 'addHandler').andCallThrough();
                spyOn(CommonMapApi.view.center.feature, 'addHandler').andCallThrough();
                spyOn(CommonMapApi.view.center.location, 'addHandler').andCallThrough();
                spyOn(CommonMapApi.view.center.overlay, 'addHandler').andCallThrough();
                spyOn(CommonMapApi.view.zoom, 'addHandler').andCallThrough();

                map = new Map();
                view = new View(map,{});

                expect(CommonMapApi.view.center.bounds.addHandler).toHaveBeenCalled();
                expect(CommonMapApi.view.center.feature.addHandler).toHaveBeenCalled();
                expect(CommonMapApi.view.center.location.addHandler).toHaveBeenCalled();
                expect(CommonMapApi.view.center.overlay.addHandler).toHaveBeenCalled();
                expect(CommonMapApi.view.zoom.addHandler).toHaveBeenCalled();
            });

            it("changes the scale of the map.", function() {
                var map = new Map();
                var view  = new View(map, {});

                spyOn(map, 'setScale').andCallThrough();
                view.handleZoom("FakeWidget", {range: 1000});
                expect(map.setScale).toHaveBeenCalled();
                // Not testing the value here since our mock maps do not have proper extent and scale calculations.
            });

            it("changes the scale of the map when given multiple ranges.", function() {
                var map = new Map();
                var view  = new View(map, {});

                spyOn(map, 'setScale').andCallThrough();
                view.handleZoom("FakeWidget", [{range: '1000'}, {range: '2000'}]);
                expect(map.setScale).toHaveBeenCalled();
                // Not testing the value here since our mock maps do not have proper extent and scale calculations.
            });

            it("passes overlay centering info to the overlay manager", function() {
                var map = new Map();
                var overlayMgr = new OverlayManager();
                var view = new View(map, overlayMgr);

                spyOn(overlayMgr.overlay, 'zoom');
                view.handleCenterOverlay("FakeWidget", { overlayId: "one", zoom: "auto" });
                expect(overlayMgr.overlay.zoom).toHaveBeenCalled();
                expect(overlayMgr.overlay.zoom.mostRecentCall.args[0]).toEqual("FakeWidget");
                expect(overlayMgr.overlay.zoom.mostRecentCall.args[1]).toEqual("one");
                expect(overlayMgr.overlay.zoom.mostRecentCall.args[2]).toEqual("auto");
            });

            it("passes overlay centering info to the overlay manager and centers on the last payload object", function() {
                var map = new Map();
                var overlayMgr = new OverlayManager();
                var view = new View(map, overlayMgr);

                spyOn(overlayMgr.overlay, 'zoom');
                view.handleCenterOverlay("FakeWidget", [{ 
                    overlayId: "one", 
                    zoom: "auto" 
                },{
                    overlayId: "two",
                    zoom: 1000
                }]);
                expect(overlayMgr.overlay.zoom).toHaveBeenCalled();
                expect(overlayMgr.overlay.zoom.mostRecentCall.args[0]).toEqual("FakeWidget");
                expect(overlayMgr.overlay.zoom.mostRecentCall.args[1]).toEqual("two");
                expect(overlayMgr.overlay.zoom.mostRecentCall.args[2]).toEqual(1000);
            });

            it("passes feature centering info to the overlay manager", function() {
                var map = new Map();
                var overlayMgr = new OverlayManager();
                var view = new View(map, overlayMgr);

                spyOn(overlayMgr.feature, 'zoomFeature');
                view.handleCenterFeature("FakeWidget", { 
                    overlayId: "one", 
                    featureId: "f1",
                    zoom: "auto" 
                });
                expect(overlayMgr.feature.zoomFeature).toHaveBeenCalled();
                expect(overlayMgr.feature.zoomFeature.mostRecentCall.args[0]).toEqual("FakeWidget");
                expect(overlayMgr.feature.zoomFeature.mostRecentCall.args[1]).toEqual("one");
                expect(overlayMgr.feature.zoomFeature.mostRecentCall.args[2]).toEqual("f1");
                expect(overlayMgr.feature.zoomFeature.mostRecentCall.args[5]).toEqual("auto");
            });

            it("passes feature centering info to the overlay manager and centers on the last payload object", function() {
                var map = new Map();
                var overlayMgr = new OverlayManager();
                var view = new View(map, overlayMgr);

                spyOn(overlayMgr.feature, 'zoomFeature');
                view.handleCenterFeature("FakeWidget", [{ 
                    overlayId: "one", 
                    featureId: "f1",
                    zoom: "auto" 
                },{
                    overlayId: "two",
                    featureId: "f2",
                    zoom: 1000
                }]);
                expect(overlayMgr.feature.zoomFeature).toHaveBeenCalled();
                expect(overlayMgr.feature.zoomFeature.mostRecentCall.args[0]).toEqual("FakeWidget");
                expect(overlayMgr.feature.zoomFeature.mostRecentCall.args[1]).toEqual("two");
                expect(overlayMgr.feature.zoomFeature.mostRecentCall.args[2]).toEqual("f2");
                expect(overlayMgr.feature.zoomFeature.mostRecentCall.args[5]).toEqual(1000);
            });

            it("modifies the map center and scale appropriately when centering on a location.", function() {
                var map = new Map();
                var view  = new View(map, {});

                var scaleSpy = spyOn(map, 'setScale').andCallThrough();
                var centerSpy = spyOn(map, 'centerAt').andCallThrough();
                var zoomSpy = spyOn(map, 'setZoom').andCallThrough();

                // Zoom close in on a location.  Both scale and center should be modified
                view.handleCenterLocation("FakeWidget", {
                    location: {
                        lat: 10,
                        lon: 10
                    },
                    zoom: "auto"
                });
                expect(map.centerAt).toHaveBeenCalled();
                expect(map.setZoom).toHaveBeenCalled();
                expect(map.setScale).not.toHaveBeenCalled();
                
                // Center on a location but don't modify zoom.
                scaleSpy.reset();
                centerSpy.reset();
                zoomSpy.reset();
                view.handleCenterLocation("FakeWidget", {
                    location: {
                        lat: 10,
                        lon: 10
                    }
                });
                expect(map.centerAt).toHaveBeenCalled();
                expect(map.setScale).not.toHaveBeenCalled();
                expect(map.setZoom).not.toHaveBeenCalled();

                // Center on a location with a specific zoom level.
                scaleSpy.reset();
                centerSpy.reset();
                zoomSpy.reset();
                view.handleCenterLocation("FakeWidget", {
                    location: {
                        lat: 10,
                        lon: 10
                    },
                    zoom: 1000
                });
                expect(map.centerAt).toHaveBeenCalled();
                expect(map.setScale).toHaveBeenCalled();
                expect(map.setZoom).not.toHaveBeenCalled();
            });

            it("modifies the map center and scale appropriately when centering on the last location in a list.", function() {
                var map = new Map();
                var view  = new View(map, {});

                var scaleSpy = spyOn(map, 'setScale').andCallThrough();
                var centerSpy = spyOn(map, 'centerAt').andCallThrough();
                var zoomSpy = spyOn(map, 'setZoom').andCallThrough();

                // Zoom close in on a location.  Both scale and center should be modified
                view.handleCenterLocation("FakeWidget", [{
                    location: {
                        lat: 0,
                        lon: 0,
                    }
                },{
                    location: {
                        lat: 10,
                        lon: 10
                    },
                    zoom: "auto"
                }]);
                expect(map.centerAt).toHaveBeenCalled();
                expect(map.setZoom).toHaveBeenCalled();
                expect(map.setScale).not.toHaveBeenCalled();
                
                // Center on a location but don't modify zoom.
                scaleSpy.reset();
                centerSpy.reset();
                zoomSpy.reset();
                view.handleCenterLocation("FakeWidget", [{
                    location: {
                        lat: 10,
                        lon: 10
                    },
                    zoom: "auto"
                },{
                    location: {
                        lat: 10,
                        lon: 10
                    }
                }]);
                expect(map.centerAt).toHaveBeenCalled();
                expect(map.setScale).not.toHaveBeenCalled();
                expect(map.setZoom).not.toHaveBeenCalled();

                // Center on a location with a specific zoom level.
                scaleSpy.reset();
                centerSpy.reset();
                zoomSpy.reset();
                view.handleCenterLocation("FakeWidget", [{
                    location: {
                        lat: 10,
                        lon: 10
                    },
                    zoom: "auto"
                },{
                    location: {
                        lat: 10,
                        lon: 10
                    },
                    zoom: 1000
                }]);
                expect(map.centerAt).toHaveBeenCalled();
                expect(map.setScale).toHaveBeenCalled();
                expect(map.setZoom).not.toHaveBeenCalled();
            });

            it("modifies the map center and scale appropriately when centering on a bounds.", function() {
                var map = new Map();
                var view  = new View(map, {});

                var extentSpy = spyOn(map, 'setExtent').andCallThrough();
                var scaleSpy = spyOn(map, 'setScale').andCallThrough();
                var centerSpy = spyOn(map, 'centerAt').andCallThrough();
                var zoomSpy = spyOn(map, 'setZoom').andCallThrough();

                // Zoom close in on a location.  Both scale and center should be modified
                view.handleCenterBounds("FakeWidget", {
                    bounds: { 
                        southWest: { lat: 1, lon: 1}, 
                        northEast: {lat: 1, lon: 1}
                    },
                    zoom: "auto"
                });
                expect(map.setExtent).toHaveBeenCalled();
                expect(map.setExtent.mostRecentCall.args[1]).toBe(true);
                expect(map.setZoom).not.toHaveBeenCalled();
                expect(map.setScale).not.toHaveBeenCalled();
                
                // Center on a location but don't modify zoom.
                scaleSpy.reset();
                centerSpy.reset();
                zoomSpy.reset();
                view.handleCenterBounds("FakeWidget", {
                    bounds: { 
                        southWest: { lat: 1, lon: 1}, 
                        northEast: {lat: 1, lon: 1}
                    }
                });
                expect(map.centerAt).toHaveBeenCalled();
                expect(map.setScale).not.toHaveBeenCalled();
                expect(map.setZoom).not.toHaveBeenCalled();

                // Center on a location with a specific zoom level.
                scaleSpy.reset();
                centerSpy.reset();
                zoomSpy.reset();
                view.handleCenterBounds("FakeWidget", {
                    bounds: { 
                        southWest: { lat: 1, lon: 1}, 
                        northEast: {lat: 1, lon: 1}
                    },
                    zoom: 1000
                });
                expect(map.centerAt).toHaveBeenCalled();
                expect(map.setScale).toHaveBeenCalled();
                expect(map.setZoom).not.toHaveBeenCalled();
            });

            it("modifies the map center and scale appropriately when centering on the last bounds in a list.", function() {
                var map = new Map();
                var view  = new View(map, {});

                var extentSpy = spyOn(map, 'setExtent').andCallThrough();
                var scaleSpy = spyOn(map, 'setScale').andCallThrough();
                var centerSpy = spyOn(map, 'centerAt').andCallThrough();
                var zoomSpy = spyOn(map, 'setZoom').andCallThrough();

                // Zoom close in on a location.  Both scale and center should be modified
                view.handleCenterBounds("FakeWidget", [{
                    bounds: { 
                        southWest: { lat: 1, lon: 1}, 
                        northEast: {lat: 1, lon: 1}
                    }
                },{
                    bounds: { 
                        southWest: { lat: 1, lon: 1}, 
                        northEast: {lat: 1, lon: 1}
                    },
                    zoom: "auto"
                }]);
                expect(map.setExtent).toHaveBeenCalled();
                expect(map.setExtent.mostRecentCall.args[1]).toBe(true);
                expect(map.setZoom).not.toHaveBeenCalled();
                expect(map.setScale).not.toHaveBeenCalled();
                
                // Center on a location but don't modify zoom.
                scaleSpy.reset();
                centerSpy.reset();
                zoomSpy.reset();
                view.handleCenterBounds("FakeWidget", [{
                    bounds: { 
                        southWest: { lat: 1, lon: 1}, 
                        northEast: {lat: 1, lon: 1}
                    },
                    zoom: 1000
                },{
                    bounds: { 
                        southWest: { lat: 1, lon: 1}, 
                        northEast: {lat: 1, lon: 1}
                    }
                }]);
                expect(map.centerAt).toHaveBeenCalled();
                expect(map.setScale).not.toHaveBeenCalled();
                expect(map.setZoom).not.toHaveBeenCalled();

                // Center on a location with a specific zoom level.
                scaleSpy.reset();
                centerSpy.reset();
                zoomSpy.reset();
                view.handleCenterBounds("FakeWidget", [{
                    bounds: { 
                        southWest: { lat: 1, lon: 1}, 
                        northEast: {lat: 1, lon: 1}
                    }
                },{
                    bounds: { 
                        southWest: { lat: 1, lon: 1}, 
                        northEast: {lat: 1, lon: 1}
                    },
                    zoom: 1000
                }]);
                expect(map.centerAt).toHaveBeenCalled();
                expect(map.setScale).toHaveBeenCalled();
                expect(map.setZoom).not.toHaveBeenCalled();
            });
        });
    });

});
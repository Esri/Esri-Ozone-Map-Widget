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
define(["cmwapi/Channels"], function(Channels) {

    describe("Channels tests.", function() {

        describe("Verify the CMW API Channels.", function() {

            it("returns all the proper channels in getChannels()", function() {
                expect(Channels.getChannels().indexOf(Channels.MAP_OVERLAY_CREATE) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_OVERLAY_REMOVE) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_OVERLAY_HIDE) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_OVERLAY_SHOW) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_OVERLAY_UPDATE) > -1);

                expect(Channels.getChannels().indexOf(Channels.MAP_FEATURE_PLOT) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_FEATURE_PLOT_URL) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_FEATURE_UNPLOT) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_FEATURE_HIDE) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_FEATURE_SHOW) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_FEATURE_SELECTED) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_FEATURE_UPDATE) > -1);

                expect(Channels.getChannels().indexOf(Channels.MAP_FEATURE_STATUS_START) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_FEATURE_STATUS_STOP) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_FEATURE_STATUS_REQUEST) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_FEATURE_STATUS_LAYERS) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_FEATURE_STATUS_REPORT) > -1);

                expect(Channels.getChannels().indexOf(Channels.MAP_VIEW_ZOOM) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_VIEW_PRINT) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_VIEW_CENTER_OVERLAY) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_VIEW_CENTER_FEATURE) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_VIEW_CENTER_LOCATION) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_VIEW_CENTER_BOUNDS) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_VIEW_CLICKED) > -1);

                expect(Channels.getChannels().indexOf(Channels.MAP_STATUS_REQUEST) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_STATUS_VIEW) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_STATUS_FORMAT) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_STATUS_ABOUT) > -1);

                expect(Channels.getChannels().indexOf(Channels.MAP_ERROR) > -1);
            });
        });
    });
});

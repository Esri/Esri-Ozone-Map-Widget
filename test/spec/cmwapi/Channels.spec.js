define(["cmwapi/Channels"], function(Channels) {

    describe("Channels tests.", function() {

        describe("Verify the CMW API Channels.", function() {

            it("returns all the proper channels in getChannels()", function() {
                expect(Channels.getChannels().indexOf(Channels.MAP_STATUS_REQUEST) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_STATUS_ABOUT) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_STATUS_FORMAT) > -1);
                expect(Channels.getChannels().indexOf(Channels.MAP_STATUS_VIEW) > -1);
            });
        });
    });
});

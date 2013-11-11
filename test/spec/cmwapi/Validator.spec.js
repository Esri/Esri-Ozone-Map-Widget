define(["cmwapi/Validator"], function(Validator) {

    describe("Channels tests.", function() {

        describe("Verify the validator ", function() {

            it("validates the CMWAPI 1.1 allowed request types.", function() {
                var types = ['about', 'format', 'view'];
                var results = Validator.validRequestTypes(types);
                expect(results.result).toBe(true);
            });

            it("fails incorrect CMWAPI 1.1 allowed request types.", function() {
                var results = Validator.validRequestTypes(['ghi']);

                expect(results.result).toBe(false);
            });

            it("validates the CMWAPI 1.1 allowed map types.", function() {
                var types = ['2-D', '3-D', 'other'];
                var results = Validator.validMapType(types[0]);
                expect(results.result).toBe(true);

                results = Validator.validMapType(types[1]);
                expect(results.result).toBe(true);

                results = Validator.validMapType(types[2]);
                expect(results.result).toBe(true);
            });

            it("fails incorrect CMWAPI 1.1 allowed map types.", function() {
                var results = Validator.validMapType(['ghi']);

                expect(results.result).toBe(false);
            });
        });
    });
});

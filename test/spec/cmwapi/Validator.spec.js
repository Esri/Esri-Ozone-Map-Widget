define(["cmwapi/Validator"], function(Validator) {

    describe("Channels tests.", function() {

        describe("Verify the validator ", function() {

            it("uses the types passed in at construction", function() {
                var types = ['abc', 'def']
                var validator = new Validator(types);
                expect(validator.types.length = 2);
                expect(validator.types[0] == 'abc');
                expect(validator.types[1] == 'def');
            });

            it("validates the same types passed in at construction.", function() {
                var types = ['abc', 'def']
                var validator = new Validator(types);
                var results = validator.validRequestTypes(types);

                expect(results.result).toBe(true);
            });

            it("fails incorrect types.", function() {
                var types = ['abc', 'def']
                var validator = new Validator(types);
                var results = validator.validRequestTypes(['ghi']);

                expect(results.result).toBe(false);
            });
        });
    });
});

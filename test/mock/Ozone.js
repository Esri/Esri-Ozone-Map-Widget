define(function() {
    return {
        util: {
            toString : function(value) {
                // Just defer to JSON stringify here.
                return JSON.stringify(value);
            },
            parseJson : function(value) {
                // Just defer to JSON parse here.
                return JSON.parse(value);
            }
        }
    };
});
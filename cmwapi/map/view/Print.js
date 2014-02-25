define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error"],
    function(Channels, Validator, Error) {


    var Print = {

        send : function (data) {

            var validData = Validator.validObjectOrArray(data);
            var payload = validData.payload;

            if (!validData.result) {
                Error.send(OWF.getInstanceId(), Channels.MAP_VIEW_PRINT, data, validData.msg);
                return;
            }

            for (var i = 0; i < payload.length; i ++) {
                if (typeof payload[i].templates !== "undefined") {
                    payload[i].zoom = (payload[i].zoom) ? payload[i].zoom : false;
                    if (!Validator.isNumber(payload[i].zoom) && payload[i].zoom.toString().toLowerCase() !== "auto") {
                        validData.result = false;
                        validData.msg += "zoom values must be a number or 'auto'. ";
                    }
                }
            }

            if (validData.result) {
                if (payload.length === 1) {
                    OWF.Eventing.publish(Channels.MAP_VIEW_PRINT, Ozone.util.toString(payload[0]));
                } else {
                    OWF.Eventing.publish(Channels.MAP_VIEW_PRINT, Ozone.util.toString(payload));
                }
            } else {
                Error.send(OWF.getInstanceId(), Channels.MAP_VIEW_PRINT, Ozone.util.toString(data), validData.msg);
            }

        },

        addHandler : function (handler) {

            var newHandler = function(sender, msg) {
                var jsonSender = Ozone.util.parseJson(sender);
                var jsonMsg = (Validator.isString(msg)) ? Ozone.util.parseJson(msg) : msg;
                var data = (Validator.isArray(jsonMsg)) ? jsonMsg : [jsonMsg];
                var validData = {result: true, msg: ""};

                for (var i = 0; i < data.length; i ++) {
                    if (typeof data[i].templates !== "undefined") {
                        data[i].zoom = (data[i].zoom) ? data[i].zoom : false;
                        if (!Validator.isNumber(data[i].zoom) && data[i].zoom.toString().toLowerCase() !== "auto") {
                            validData.result = false;
                            validData.msg += "zoom values must be a number or 'auto'. ";
                        }
                    }
                }

                if (validData.result) {
                    handler(jsonSender.id, (data.length === 1) ? data[0] : data);
                } else {
                    Error.send(jsonSender.id, Channels.MAP_VIEW_PRINT,msg, validData.msg);
                }
            };

            OWF.Eventing.subscribe(Channels.MAP_VIEW_PRINT, newHandler);
            return newHandler;
        },

        removeHandlers : function() {
            OWF.Eventing.unsubscribe(Channels.MAP_VIEW_PRINT);
        }
    };

    return Print;
});

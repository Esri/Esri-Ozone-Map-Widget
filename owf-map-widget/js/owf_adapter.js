var OWFAdapter = function(On, dropZone) {
		// Initialize OWF-specific functionality
		if (OWF.Util.isRunningInOWF()) {
			OWF.ready(function () {
				// Listen to channel used by the example Contacts Manager
				OWF.Eventing.subscribe(
					"org.owfgoss.owf.examples.GoogleMapsExample.plotAddress",
					function (sender, msg, channel) {
						console.log('Got address "' + msg + '"" from "' +
						sender + '" on "' + channel);
						var markerData = {};
						try {
							// Parse the msg as json.
							markerData = JSON.parse(msg);
						} catch (e) {
							// Treat the msg as plain address text and try to pass it along.
							markerData.address = msg;
						}
						map.placeMarker(markerData);
					}
				);

				// Register for intent that plots address
				OWF.Intents.receive({
					action: "plot",
					dataType: "application/vnd.owf.sample.address"
				}, function (sender, intent, msg) {
					console.log('Got address "' + msg + '"" via intent "' +
					intent + '" from "' + sender);
					map.placeMarker(msg);
				}
				);

				// Register for intent that starts navigation search
				OWF.Intents.receive({
					action: "navigate",
					dataType: "application/vnd.owf.sample.addresses"
				}, function (sender, intent, msg) {
						console.log('Got direction search "' + msg +
						'"" via intent "' + intent + '" from "'
						+ sender);
						// TODO: Trigger directions search
					}
				);

				OWF.DragAndDrop.onDragStart(function () {
				// TODO: Examine available drag metadata and highlight
				// drop zone if appropriate
				});

				OWF.DragAndDrop.onDragStop(function () {
				// TODO: Remove drop zone highlighting
				});

				On(dropZone, Mouse.enter, function(evt) {
					OWF.DragAndDrop.setDropEnabled(true);
				});

				On(dropZone, Mouse.leave, function(evt) {
					OWF.DragAndDrop.setDropEnabled(false);
				});

				OWF.DragAndDrop.addDropZoneHandler({
					dropZone: dropZone,
					handler: function (msg) {
						map.placeMarker(msg.dragDropData);
						console.log('Got address "' + msg.dragDropData.address);
					}
				});

				OWF.notifyWidgetReady();
			});
		}

		// TODO: HTML5 file transfer via drop (does not use OWF)
		// This will only occur when a file is dragged into the widget from
		// outside the web browser
		On(dropZone, "dragenter", function(evt) {
			// Prevent browser from opening file in this page
			evt.preventDefault();
		});

		On(dropZone, "dragover", function(evt) {
			evt.preventDefault();
		});

		On(dropZone, "drop", function(evt) {
			evt.preventDefault();
			console.log("Got file drop " + evt);
		});
	};


define(function() {
	var Extent = function() {
		this.getCenter = function() {};
	};
	Extent.prototype._normalizeX = function(x){
		return {
			x: x
		};
	};

    return Extent;
});
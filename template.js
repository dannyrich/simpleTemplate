+function (win) {
	"use strict";

	var Template = function(template, data) {
		this._init(template, data, true);
	};

	Template.prototype._init = function(template, data, resetParse) {

		this.setTemplate(template);
		this.setData(data);

		this._html = '';

		if (resetParse) {
			this._isParsed = false;
			this._parseData = null
		}
	}

	Template.prototype.setTemplate = function(template) {
		this._template = template;
	}

	Template.prototype.setData = function(data) {

		// We want the keys to all be lowercase
		if (!(data instanceof Array)) {
			data = [data];
		}


		for (var i = 0; i < data.length; i++) {
			for (var key in data[i]) {
				if (key.toLowerCase() !== key) {
					data[i][key.toLowerCase()] = data[i][key];
					delete data[i][key];
				}
			}
		}

		this._data = data;
	}

	Template.prototype.getHTML = function() {

		if (!this._isParsed) this.parseTemplate();

		return this._html;

	}

	Template.prototype.parseTemplate = function() {

		var t = this._template,
			d = this._data;

		this._html = "";
		this._isParsed = true;

		if (t && d) {

			// First get all of the blocks available in the template
			var blocks = {},
				showIfs = {},
				regexReplace = new RegExp("{{([a-zA-Z0-9_\.-]*)}}", "i"),
				regexIf = new RegExp("{{@if:([^}}]+)}}", "i");

			for (var i = 0; i < d.length; i++) {

				// First, replace the instances of variables
				var spot = [],
					_t = t;

				// Loop through the template replacing data
				while (spot !== null) {
					// Find the next variable to replace
					spot = _t.match(regexReplace);

					if (spot !== null) {
						// Found, now make sure we aren't putting a bunch of undefineds in the template
						var type = spot[0],
							key = spot[1].toLowerCase(),
							datum = d[i][key];

						if (typeof(datum) == "undefined") {
							datum = "";
						}

						blocks[key] = datum;

						_t = _t.replace(type, datum);
					}
				}

				// Next handle the if statements
				var spot = [];

				while (spot !== null) {
					spot = _t.match(regexIf);

					if (spot !== null) {
						var check = spot[1],
							index = spot.index;

						if (typeof(d[i][check]) !== "undefined" && d[i][check]) {

							// Success. Remove if and end
							_t = _t.replace(spot[0], '');
							_t = _t.replace('{{@end}}', '');

						} else {

							// The data fails, delete through end
							var endspot = _t.indexOf('{{@end}}');

							if (endspot >= 0) {
								_t = _t.substring(0, index) + _t.substring(endspot + 8);
							} else {
								_t = _t.substring(0, index);
							}

						}
					}
				}

				this._html += _t;
			}

		}
	}

	win._template = function(template, data) {

		return new Template(template, data);

	}

	win._template.Constructor = Template;

}(window);

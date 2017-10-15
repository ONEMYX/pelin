const fs = require('fs');
const jsonfile = require('jsonfile');

let Jsonfile = function () {
	this.read = (file, create = false) => {
		if (fs.existsSync(file)) {
			var result = jsonfile.readFileSync(file);
			if (typeof result == "object") {
				return result;
			} else {
				return false;
			}
		} else if (create) {
			this.write(file, {});
			return {};
		}
	};
	this.write = (file, obj) => {
		if (typeof obj != "object") return false;
		jsonfile.writeFileSync(file, obj, {spaces: 2});
	}
};

module.exports = new Jsonfile();
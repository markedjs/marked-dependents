const fs = require("fs");

const packages = fs.readdirSync("./packages");


let versions = {};
let dlGt1000 = [];
packages.forEach((file) => {
	const pkg = require(`./packages/${file}`);

	// versions
	const ver = pkg.depVersion;
	if (!versions[ver]) {
		versions[ver] = 0;
	}
	versions[ver]++;

	// dlGt1000
	if (pkg.downloadsLastWeek > 1000) {
		dlGt1000.push(pkg.name);
	}
});

versions = Object.entries(versions).sort((a, b) => (b[1] - a[1])).map(a => a.reverse());
fs.writeFileSync("./stats/versions.json", JSON.stringify(versions, null, "\t"));

fs.writeFileSync("./stats/dlGt1000.json", JSON.stringify(dlGt1000, null, "\t"));

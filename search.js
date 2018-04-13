const fs = require("fs");

const packages = fs.readdirSync("./packages");


let versions = {};
const dlGt1000 = [];
const modThisYear = [];
const releaseThisYear = [];

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

	// modThisYear
	if (new Date(pkg.modified) > new Date("2018-01-01")) {
		modThisYear.push(pkg.name);
	}

	// releaseThisYear
	if (new Date(pkg.released) > new Date("2018-01-01")) {
		releaseThisYear.push(pkg.name);
	}
});

versions = Object.entries(versions).sort((a, b) => (b[1] - a[1])).map(a => a.reverse());
fs.writeFileSync("./stats/versions.json", JSON.stringify(versions, null, "\t"));

fs.writeFileSync("./stats/dlGt1000.json", JSON.stringify(dlGt1000, null, "\t"));
fs.writeFileSync("./stats/modThisYear.json", JSON.stringify(modThisYear, null, "\t"));
fs.writeFileSync("./stats/releaseThisYear.json", JSON.stringify(releaseThisYear, null, "\t"));

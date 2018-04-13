const fs = require("fs");

const packages = fs.readdirSync("./packages");


let versions = {};
packages.forEach((file) => {
	const pkg = require(`./packages/${file}`);
	const ver = pkg.depVersion;
	if (!versions[ver]) {
		versions[ver] = 0;
	}

	versions[ver]++;
});

versions = Object.entries(versions).sort((a, b) => (b[1] - a[1])).map(a => a.reverse());
fs.writeFileSync("./stats/versions.json", JSON.stringify(versions, null, "\t"));

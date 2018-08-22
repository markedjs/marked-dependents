const NpmClient = require("npm-registry-client");
const api = new NpmClient();
const url = require("url");
const fs = require("fs");

const requestsPerSecond = 30;

let timeouts = [];
let download429 = false;


getDependents("marked");

function getDependents(packageName) {

	// create dir if not exists
	if (!fs.existsSync("./packages")) {
		fs.mkdirSync("./packages");
	}

	const uri = url.format({
		protocol: "https",
		host: "skimdb.npmjs.com",
		pathname: "/registry/_design/app/_view/dependedUpon",
		query: {
			group_level: 2,
			startkey: JSON.stringify([packageName]),
			endkey: JSON.stringify([packageName, {}]),
			state: "update_after"
		}
	});
	api.get(uri, {}, (err, data) => {
		const packages = data.rows.map(r => r.key[1]);
		console.log(`total dependents: ${packages.length}`);
		let count = 0;
		packages.forEach((name) => {
			if (!fs.existsSync(`./packages/${name}.json`)) {
				timeouts.push(setTimeout(() => {
					getInfo(name, packageName);
				}, 1000 / requestsPerSecond * count++));
			}
		});
	});
}

function getInfo(name, packageName) {
	if (download429) {
		return;
	}
	let json = null;
	let downloads = null;
	api.get(`https://skimdb.npmjs.com/registry/${name}`, {}, (err, data) => {
		if (err) {
			console.error(`json connection error: ${name}`);
			return;
		}

		json = data;
		if (downloads) {
			parseJson(json, downloads, name, packageName);
		}
	});

	api.get(`https://api.npmjs.org/downloads/point/last-week/${name}`, {}, (err, data, raw, res) => {
		if (err) {
			console.error(`downloads connection error: ${name}`);
			return;
		}
		if (res.statusCode !== 200) {
			if (res.statusCode === 429) {
				download429 = true;
				if (timeouts) {
					timeouts.forEach((t) => clearTimeout(t));
					timeouts = null;
				}
			}
			console.error(`downloads error ${res.statusCode}: ${name}`);
			if (res.statusCode === 404) {
				downloads = {downloads: 0};
				if (json) {
					parseJson(json, downloads, name, packageName);
				}
			}
			return;
		}

		downloads = data;
		if (json) {
			parseJson(json, downloads, name, packageName);
		}
	});
}

function parseJson(json, downloads, name, packageName) {
	const latest = json["dist-tags"].latest;
	const pkg = json.versions[latest];
	const info = {
		name: pkg.name,
		version: latest,
		depVersion: pkg.dependencies[packageName],
		maintainers: json.maintainers,
		modified: json.time.modified,
		released: json.time[latest],
		downloadsLastWeek: downloads.downloads,
	};
	fs.writeFileSync(`./packages/${name}.json`, JSON.stringify(info, null, "\t"));
	console.log(`Saved ${name}`);
}

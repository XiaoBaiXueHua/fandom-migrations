// function that gets copy-pasted into the console and run to yoink all the wp data at once

function getResults(el) {
	const searchResults = el.querySelector(".search-info");
	const spans = searchResults.querySelectorAll("span.sr-only");
	// console.log(spans);
	let result = 0;
	for (const sp of spans) {
		if (sp.innerText.search("results") >= 0) { // if the span has the results thing in it, 
			result = parseInt(sp.innerText.replace(/(results|,)/g, "")); // clean it up
			break; // and end loop
		}
	}
	// console.log(result);
	return result;
}
function auto() {
	const wpList = JSON.parse(localStorage.getItem("trackedFandoms"));
	const wpObj = JSON.parse(localStorage.getItem("trackedObj"));
	const wpEntries = Object.entries(wpObj);
	// console.log(`wpObj: `, wpObj);

	function categorize(str) {
		var i = 0;
		let category = "misc";
		
		while (i < wpEntries.length) {
			if (wpEntries[i][1].fandoms.includes(str)) {
				category = wpEntries[i][0];
				break;
			}
			i++;
		}
		return category;
	}
	const results = {
		anime: new Array(),
		cartoon: new Array(),
		tv: new Array(),
		game: new Array(),
		bandom: new Array(),
		kpop: new Array(),
		movie: new Array(),
		book: new Array(),
		misc: new Array()
	}

	const tmpDiv = document.createElement("div");
	const numFandoms = wpList.length;
	for (var i = 0; i <= numFandoms; i++) {
		// const fandom = wpList[i];
		let fandom;
		try {
			fandom = wpList[i];
		} catch (e) {
			console.log(`we have hit the end of the list. result array console coming soon.`);
		}
		let categy = categorize(fandom);
		let cat = wpObj[categy];
		async function hoo() {
			// local function
			if (fandom == undefined) {
				// console.log(resultArray);
				// console.log(results)
				setTimeout(() => { console.log(`final results:\n`, results)}, (wpList+50)*3500) // and then we wait to drop the final obj at the bottom. i hope.
			} else {
				const response = await fetch(new Request(`/search/%23${fandom}`));
				if (response.ok) {
					const txt = await response.text();
					tmpDiv.innerHTML = txt;
					const res = getResults(tmpDiv);
					console.debug(`%c [${categy}]`, `color: ${cat.color}`, ` ${fandom}: ${res.toLocaleString()}`);
					// resultArray.push([fandom, res]);
					results[categy].push([fandom, res]);
					tmpDiv.remove();
				} else {
					console.error(`oh no the response was not okay. :( probably just rate-limited... status: ${response.status}\n`, response);
				}
			}

		}
		setTimeout(hoo, 1500); // open a new page every 1.5 seconds to help prevent 429 statuses
	}
	// console.log(`results after the loop: \n`, results); // doing it this way also doesn't work bc of the async lol
}
auto();
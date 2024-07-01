function auto() {
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
	// getResults();

	var resultArray = new Array();

	const wpList = JSON.parse(localStorage.getItem("trackedFandoms"));
	const tmpDiv = document.createElement("div");
	const numFandoms = wpList.length;
	var i = 1;
	for (const fandom of wpList) {
		setTimeout(async () => {
			const response = await fetch(new Request(`/search/%23${fandom}`));
			if (response.ok) {
				const txt = await response.text();
				tmpDiv.innerHTML = txt;
				const res = getResults(tmpDiv);
				console.log(`${fandom}: ${res.toLocaleString()}`);
				resultArray.push([fandom, res]);
				i++;
				if (i == numFandoms) {
					console.log(resultArray);
				}
			} else {
				console.error(`oh no the response was not okay. :( probably just rate-limited... status: ${response.status}\n`, response);
			}
		}, 1500); // open a new page every 1.5 seconds
		// break;
	}
	// console.log(resultArray);
}
auto();
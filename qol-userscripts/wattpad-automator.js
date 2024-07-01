function auto() {
	function getResults(el) {
		const searchResults = el.querySelector(".search-info");
		const spans = searchResults.querySelectorAll("span.sr-only");
		console.log(spans);
		let result = 0;
		for (const sp of spans) {
			if (sp.innerText.search("results") >= 0) { // if the span has the results thing in it, 
				result = parseInt(sp.innerText.replace(/(results|,)/g, "")); // clean it up
				break; // and end loop
			}
		}
		console.log(result);
	}
	// getResults();

	const resultArray = new Array();

	const wpList = JSON.parse(localStorage.getItem("trackedFandoms"));
	const tmpDiv = document.createElement("div");
	for (const fandom of wpList) {
		setTimeout(async () => {
			const response = await fetch(new Request(`/search/%23${fandom}`));
			if (response.ok) {
				const txt = await response.text();
				tmpDiv.innerText = txt;
				resultArray.push([fandom, getResults(tmpDiv)]);
			} else {
				console.error(`oh no the response was not okay. :( probably just rate-limited... status: ${response.status}\n`, response);
			}
		}, 1500); // open a new page every 1.5 seconds
	}
	console.log(resultArray);
}
auto();
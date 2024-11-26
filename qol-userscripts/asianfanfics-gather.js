var results = {};
var found = [];
var bands = ["bts", "exo", "shinee", "superjunior", "redvelvet", "twice", "blackpink", "nct", "straykids", "txt", "got7", "monstax", "loona"]; // array of bands getting tracked
var backup_listing = document.createElement(`div`);
backup_listing.id = `asianfanfics-export-${new Date}`;

// function to loop through the els to read what they are
function ooo(el, i) {
	backup_listing.innerHTML += el.querySelector(`.tags__container`).innerHTML;
	const sps = el.querySelectorAll(`.tags__container > span`);
	for (const s of sps) {
		const a = s.querySelector(`a`);
		if (bands.includes(a.innerText)) {
			console.log(`found ${a.innerText} on page ${i}.`);
			found.push(a.innerText);
			const fics = s.querySelector(`span`).innerText.trim();
			results[a.innerText] = fics.substring(1, fics.length - 1);
		}
	}
}

async function fish() {
	ooo(document, 0); // do it for the current page
	var i = 1;
	while (found.length !== bands.length || i < 15) { // just keep going until all the things are found Or we hit 1500 tags, whichever comes later
		// console.log(`fetching the next ${i*100}`);
		const fetchNext = await fetch(new Request(`/browse/pop_tags/${i * 100}`));
		const nextTxt = await fetchNext.text();
		const tmpDiv = document.createElement(`div`);
		tmpDiv.innerHTML = nextTxt;
		ooo(tmpDiv, i);
		i++;
	}
	console.log(results);

	// download all the backup listing pages at once
	var blob = new Blob([backup_listing.outerHTML], { type: "text/html" }); // create blob object
	const DL_html = URL.createObjectURL(blob);
	const anchor = document.createElement(`a`);
	anchor.href = DL_html;
	anchor.download = `asianfanfics-backup-listing-${new Date()}`;
	document.body.appendChild(anchor);
	anchor.click(); // download the html
	URL.revokeObjectURL(DL_html); //release object url for the html file
	blob = new Blob([JSON.stringify(results)], { type: "application/json" });
	const DL_jason = URL.createObjectURL(blob);
	anchor.href = DL_jason;
	// anchor.download(JSON.stringify(results));
	anchor.download = `asianfanfics-results-${new Date()}`;
	anchor.click();
	document.body.removeChild(anchor); // remove the link now that our downloads are done
}
fish();


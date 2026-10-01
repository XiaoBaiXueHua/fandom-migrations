// ==UserScript==
// @name		AsianFanfics Gatherer
// @namespace	https://sincerelyandyourstruly.neocities.org
// @version		1.0
// @description	gathers all the asianfanfics stuff
// @author		小白雪花
// @match		https://www.asianfanfics.com/**
// @icon		https://www.google.com/s2/favicons?sz=64&domain=asianfanfics.com
// @downloadURL	https://raw.githubusercontent.com/XiaoBaiXueHua/fandom-migrations/qol-userscripts/asianfanfics-gather.js
// @updateURL	https://raw.githubusercontent.com/XiaoBaiXueHua/fandom-migrations/qol-userscripts/asianfanfics-gather.js
// @grant		none
// ==/UserScript==

// const button =

var results = {};
var found = [];
var bands = ["bts", "exo", "shinee", "superjunior", "redvelvet", "twice", "blackpink", "nct", "straykids", "txt", "got7", "monstax", "loona", "seventeen"]; // array of bands getting tracked
var backup_listing = document.createElement(`div`);
backup_listing.id = `asianfanfics-export-${new Date}`;

// function to loop through the els to read what they are
function ooo(el, i) {
	const par_el = `#main-container form + div.flex`;
	backup_listing.innerHTML += `<!-- Page ${i} -->\n${el.querySelector(`${par_el}`).innerHTML}`;
	const sps = el.querySelectorAll(`${par_el} > a`);
	for (const s of sps) {
		// const sp = s.querySelector(`span`);
		const sp = s.innerText.split(/\n/);
		// console.log(sp);
		const inText = sp[0];
		// const inText = s.innerText.replaceAll(sp.outerHTML, ``).trim();
		// console.log(inText);
		// const a = s.querySelector(`a`);
		if (bands.includes(inText)) {
			console.log(`found ${inText} on page ${i}.`);
			found.push(inText);
			// const fics = sp.innerText.trim();
			results[inText] = sp[1];
		}
	}
}

async function fish() {
	ooo(document, 1); // do it for the current page
	var i = 1;
	while (found.length !== bands.length || i < 15) { // just keep going until all the things are found Or we hit 1500 tags, whichever comes later
		i++; // iterate this first?
		console.log(`fetching the next ${i}`);
		const fetchNext = await fetch(new Request(`/browse/popular-tags?page=${i}`));
		const nextTxt = await fetchNext.text();
		const tmpDiv = document.createElement(`div`);
		tmpDiv.innerHTML = nextTxt;
		ooo(tmpDiv, i);
		if (i > 15) {
			break; // the new version of the site is clearly vibes-coded and takes longer to respond, so just kill it after 15 tbh
		}
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

const expButton = document.createElement(`button`);
expButton.innerHTML = `<a href="#">Export Tags</a>`;
expButton.addEventListener("click", fish);

document.querySelector(`.text-center h1`).appendChild(expButton);
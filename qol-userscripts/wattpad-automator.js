// ==UserScript==
// @name		Wattpad Automator
// @namespace	https://sincerelyandyourstruly.neocities.org
// @version		1.0
// @description	automates the harvesting of fic counts from wp
// @author		小白雪花
// @match		https://www.wattpad.com/**
// @icon		https://www.google.com/s2/favicons?sz=64&domain=wattpad.com
// @downloadURL	https://raw.githubusercontent.com/XiaoBaiXueHua/fandom-migrations/qol-userscripts/wattpad-automator.js
// @updateURL	https://raw.githubusercontent.com/XiaoBaiXueHua/fandom-migrations/qol-userscripts/wattpad-automator.js
// @grant		none
// ==/UserScript==

// function that gets copy-pasted into the console and run to yoink all the wp data at once

// make the button to click for ease of working
const loggedIn = () => {
	const login = document.querySelector(`a[href*='login']`); // so if there's a url somewhere with "login" in it
	const frontPageLogin = (document.querySelector(`button.Ngxjj.transparent-button.JVPcL`)); // this one specific button is the only one for the login on a home page
	return (login || frontPageLogin);
};

const pDiv = document.createElement(`div`);
pDiv.id = `exporter`;
const button = document.createElement(`button`);
button.innerHTML = `Fandom Counter (Logged ${loggedIn() ? "Out" : "In"})`;
const progression = document.createElement(`div`);
progression.id = `progression-watcher`
progression.innerHTML = `<h1>Progression Watcher&hellip;</h1>`;
const pre = document.createElement(`textarea`);
pre.id = `results-json`;

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
	const delay = 1000; // open a new page every 0.5 seconds to help prevent 429 statuses
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
			const f = fandom, c = categy; // bind these
			// local function
			if (fandom == undefined) {
				// console.log(resultArray);
				console.log(`finished sending all the requests!`);
				// console.log(results)
				// setTimeout(() => { console.log(`final results:\n`, results)}, (numFandoms+50)*delay) // and then we wait to drop the final obj at the bottom. i hope.
			} else {
				const response = await fetch(new Request(`/search/%23${f}`));
				if (response.ok) {
					const txt = await response.text();
					tmpDiv.innerHTML = txt;
					const res = getResults(tmpDiv);
					// console.debug(`%c [${c}]`, `color: ${cat.color}`, ` ${f}: ${res.toLocaleString()}`);
					const p = document.createElement(`p`);
					p.innerHTML = `<strong>${f}:</strong> ${res.toLocaleString()}`;
					p.setAttribute(`style`, `color: ${cat.color}`);
					// progression.appendChild(p);
					progression.insertAdjacentElement(`afterbegin`, p); // makes it so that the old ones get pushed down
					// resultArray.push([fandom, res]);
					results[c].push({[f]: res}); // push it as an object
					tmpDiv.remove();
					// pre.innerHTML = JSON.stringify(results);
					pre.value = JSON.stringify(results);
				} else {
					console.error(`oh no the response was not okay. :( probably just rate-limited... status: ${response.status}\n`, response);
				}
			}

		}
		setTimeout(hoo, i * delay);
	}

	setTimeout(() => {
		console.log(`final results (FOR REAL THIS TIME):\n`, results)
	}, delay * (numFandoms + 5));
	// console.log(`results after the loop: \n`, results); // doing it this way also doesn't work bc of the async lol
}
// auto();
button.addEventListener(`click`, auto);
pDiv.appendChild(button);
pDiv.appendChild(progression);
pDiv.appendChild(pre);


let parent = document.querySelector(`body`);
try {
	parent = document.querySelector(`header`);
} catch (e) {
	parent = document.querySelector(`#header`); // home page, logged in
}
parent.insertAdjacentElement(`afterend`, pDiv);
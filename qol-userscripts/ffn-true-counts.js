// ==UserScript==
// @name         True Fic Counts
// @namespace    https://sincerelyandyourstruly.neocities.org
// @version      1.0
// @description  shows the true count of fics on ffn listings
// @author       小白雪花
// @match        https://www.fanfiction.net/*
// @exclude      /^https://www\.fanfiction\.net/s//
// @exclude      /^https://www\.fanfiction\.net/r//
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

const fandomList = document.querySelectorAll("#list_output div:has(a)");
const matureOverride = "?&srt=1&r=10";

var trackedFandoms = localStorage["trackedFandoms"] ? JSON.parse(localStorage["trackedFandoms"]) : { // if it's not in the storage already, then make it an object
	anime: [],
	book: [],
	cartoon: [],
	game: [],
	misc: [],
	movie: [],
	tv: []
};
localStorage.setItem("trackedFandoms", JSON.stringify(trackedFandoms));

const currentCategory = function () {
	var currPath = window.location.pathname.substring(1); // should return like /anime/ when on just category pages
	currPath = currPath.substring(0, currPath.search("/"));
	let cat = null;
	switch(currPath) {
		case "comic": cat = "misc"; break;
		case "play": cat = "misc"; break;
		default: cat = currPath;
	}
	// return currPath.substring(1, currPath.search("/"));
	return cat;
}();

// function recurve(link) {
// 	fetchNumPages(link).then((pages) => {
// 		if (pages) {
// 			fetchLastPage(link, pages).then((fics) => {
// 				return 25*(pages-1) + fics;
// 			})
// 		} else {
// 			console.warn("waiting 5s for ", link, "...");
// 			setTimeout(() => {
// 				recurve(link);
// 			}, 5000)
// 		}
// 	})
// }

let catList = trackedFandoms[currentCategory];
// console.log(`currentCategory: ${currentCategory}; catList: `, catList);
for (const fandom of fandomList) {
	const link = fandom.querySelector("a");
	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	// checkbox.id = link.href;
	const fanName = link.title;
	if (catList.includes(fanName)) {
		checkbox.checked = true;
		const ref = link.href;
		setTimeout(function () {
			// recurve(ref);
			fetchNumPages(ref).then((pages) => {

				// console.log(`${fanName} has ${pages} pages of fic.`);
				fetchLastPage(ref, pages).then((fics) => {
					const totalFics = 25*(pages-1) + fics;
					// console.log(`and then the last page of ${fanName} has ${fics} fics, for a total of ${totalFics.toLocaleString()} fics.`);
					const span = fandom.querySelector("span"); // this is the span w/the number
					span.innerHTML += ` [<strong class="trueTotal">${totalFics.toLocaleString()}</strong>]`;
				})
			});
		}, (catList.length * 25)) // for each fandom getting tracked, wait 25ms longer between sending requests
		
	}
	checkbox.addEventListener("click", () => {
		console.log(`${fanName} checked: ${checkbox.checked}`);
		if (checkbox.checked) { // if it's supposed to be included, then...
			if (!catList.includes(fanName)) { // if it's not already there, then add it
				catList.push(fanName);
			}
		} else {
			if (catList.includes(fanName)) { // otherwise,
				// remove the element
				catList = catList.filter(function (item) {
					return item !== fanName;
				})
			}
		}
		trackedFandoms[currentCategory] = catList; // mutate original too i guess
		// console.log(`catList: `, catList, `trackedFandoms: `, trackedFandoms);
		localStorage.setItem("trackedFandoms", JSON.stringify(trackedFandoms));
	})
	fandom.insertAdjacentElement("afterbegin", checkbox);
}
async function fetchNumPages(href) {
	const response = await fetch(new Request(href+matureOverride));
	if (response.ok) {
		const txt = await response.text();
		const tmpDiv = document.createElement("div");
		tmpDiv.innerHTML = txt;

		const pageNav = tmpDiv.querySelectorAll("#content_wrapper_inner > center a");
		let button;
		try {
			button = pageNav[pageNav.length - 2];
		} catch (e) {
			try {
				button = pageNav[pageNav.length - 1];
			} catch (e2) {
				console.log(`huh! ${href} doesn't seem to have either a prev or a next button in its pageNav.`)
			}
		}
		let pgs = 1;
		try {
			switch (button.innerText) {
				case "Last": {
					const nums = button.href.match(/\d+/g);
					pgs = nums[nums.length - 1];
					break;
				}
				case "Next »": {
					pgs = 2;
					break;
				}
				default: {
					// 
				}
			}
		} catch (e) {
			console.warn(`the button in ${href} has no inner text: `, button, `pageNav: `, pageNav);
		}
		return pgs;
	// } else if (response.status == 429) {
	// 	// if it's been overwhelmed, then
	// 	console.log(`we sent too many requests. we shall resent to ${href} in 5 seconds.`)
	// 	// setTimeout(function () {
	// 	// 	fetchNumPages(href).then((page) => {
	// 	// 		return page;
	// 	// 	})
	// 	// }, 5000);
	// 	return null;
	} else {
		throw new Error(`page number fetch failed, status ${response.status}: `, response);
	}
}

async function fetchLastPage(href, i) {
	// "div.z-list"
	const response = await fetch(new Request(href+matureOverride+`&p=${i}`));
	if (response.ok) {
		const txt = await response.text();
		const tmpDiv = document.createElement("div");
		tmpDiv.innerHTML = txt;
		return tmpDiv.querySelectorAll("div.z-list").length;
		// console.log(`pageNav: `, pageNav);
	} else {
		throw new Error(`last page number fetch failed, status ${response.status}: `, response);
	}
}
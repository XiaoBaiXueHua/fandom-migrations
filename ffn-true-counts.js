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
		fetchNumPages(ref).then((pages) => {
			// console.log(`${fanName} has ${pages} pages of fic.`);
			fetchLastPage(ref, pages).then((fics) => {
				const totalFics = 25*(pages-1) + fics;
				// console.log(`and then the last page of ${fanName} has ${fics} fics, for a total of ${totalFics.toLocaleString()} fics.`);
				const span = fandom.querySelector("span"); // this is the span w/the number
				span.innerHTML += ` [<strong class="trueTotal">${totalFics.toLocaleString()}</strong>]`;
			})
		});
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
		// console.log(`pageNav[pageNav.length - 2]: `, pageNav[pageNav.length - 2]);
		if (pageNav[pageNav.length - 2].innerText == "Last") {
			// if there's a last page in sight
			const lastLink = pageNav[pageNav.length - 2];
			const nums = lastLink.href.match(/\d+/g);
			return parseInt(nums[nums.length - 1]); // return the last one
		} else if (pageNav[pageNav.length - 1] == "Next »") {
			// else if there's just a next
			return 2; // then there are just 2 pages
		} else {
			return 1; // otherwise it's just the one page
		}
		// console.log(`pageNav: `, pageNav);
	} else {
		throw new Error("page number fetch failed");
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
		throw new Error("last page number fetch failed: ", response);
	}
}
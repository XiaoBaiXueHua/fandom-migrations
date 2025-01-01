// ==UserScript==
// @name		Fandom Migrations Helper
// @namespace	https://sincerelyandyourstruly.neocities.org
// @version		1.0
// @description	Shows only the fandoms being currently tracked for the fandom-migrations project, to make input easier.
// @author		小白雪花
// @match		https://archiveofourown.org/media/*
// @match		https://squidgeworld.org/media/*
// @grant		none
// ==/UserScript==

// make the button to show the thing
var trackedFandoms = localStorage["trackedFandoms"] ? JSON.parse(localStorage["trackedFandoms"]) : { // if it's not in the storage already, then make it an object
	anime: [],
	band: [],
	book: [],
	cartoon: [],
	game: [],
	misc: [],
	movie: [],
	tv: []
};
// and then a var for the tracked letters getting saved per category
// var trackedLetters = localStorage["trackedLetters"] ? JSON.parse(localStorage["trackedLetters"]) : {
// 	anime: [],
// 	band: [],
// 	book: [],
// 	cartoon: [],
// 	game: [],
// 	misc: [],
// 	movie: [],
// 	tv: []
// };
localStorage.setItem("trackedFandoms", JSON.stringify(trackedFandoms));
// localStorage.setItem("trackedLetters", JSON.stringify(trackedLetters));

const currentCategory = function () {
	var currPath = window.location.pathname.replace("/media/", "");
	let cat = null;
	let types = /anime|book|band|cartoon|game|movie|tv/i;
	var match = currPath.match(types);
	cat = match ? match[0].toLocaleLowerCase() : "misc";
	return cat;
}();
console.log(`current category: ${currentCategory}`);

let catList = trackedFandoms[currentCategory];
// let letterList = trackedLetters[currentCategory];


const actions = document.createElement("ul");
actions.className = "actions";
actions.id = "migrations-helper";
const button = document.createElement("li");
button.innerHTML = `<a href="#">Show Only Tracked Fandoms (${catList.length})</a>`;
button.addEventListener("click", migrationsHelper);
actions.appendChild(button);
document.querySelector(`#main h2.heading + p`).insertAdjacentElement("afterend", actions);

function migrationsHelper() {
	// const fandoms = document.querySelectorAll(`li:has(> a.tag)`);
	const letterHeadings = document.querySelectorAll(`li.letter`);



	for (const l of letterHeadings) {
		// const letter = l.innerText[0];
		// // checkbox for the letter groups
		// const hcb = document.createElement("input");
		// hcb.type = "checkbox";
		// hcb.checked = letterList.includes(letter);

		// // make a function for it so we can call on it in the child loop too
		// function parentChecked() {
		// 	// if it's checked...
		// 	if (hcb.checked) {
		// 		// ...AND the list doesn't have it
		// 		if (!letterList.includes(letter)) {
		// 			// add it to the list
		// 			letterList.push(letter);
		// 		}
		// 	} else {
		// 		// otherwise, if it's NOT checked and the list DOES have the letter...
		// 		if (letterList.includes(letter)) {
		// 			// remove it
		// 			letterList.filter(function (item) {
		// 				return item !== letter;
		// 			})
		// 		}
		// 	}
		// 	trackedLetters[currentCategory] = letterList;
		// 	// then save it to local storage
		// 	localStorage.setItem("trackedLetters", JSON.stringify(trackedLetters));
		// }

		// hcb.addEventListener("click", parentChecked)
		// l.insertAdjacentElement("afterbegin", hcb);
		// pick out the fandoms for each header. could've done them all at once like this, but i want to have a listener that's entangled w/the big group too so like. yee
		// const fandoms = l.querySelectorAll(`li:has(> a.tag)`);
		const fandoms = l.querySelectorAll(`li > a.tag`);
		for (const f of fandoms) { // the f is the 
			var name = f.innerText; // doing it this way instead of grabbing the a el itself is a performance thing
			var p = f.parentElement;
			// the number is in parentheses n digits Only and is also the Last Digit Parentheses Thing
			// const count = name.match(/\(\d+\)/);

			// // this bit's honestly more relevant for working with western tv shows like supernatural. basically it ensures we Only trim off the works count
			let fanName = name;
			try {
				fanName = name.replace(count[count.length - 1], "").trim();
			} catch (e) {
				// should only happen when there's no disambiguators
			}
			// // const 
			const cssName = fanName.replace(/\W+/g, "-");
			// const cssName = name.replace(/\W+/g,"-");
			// console.log(name);
			// checkbox for each fandom
			const cb = document.createElement("input");
			cb.id = cssName;
			cb.type = "checkbox";
			cb.checked = catList.includes(fanName); // since in this case we're only using this script to only make the checked-off fandoms show, this is Fine
			if (cb.checked) {
				// causing crazy slowdown on my computer(!!!) if i just let this run wild on ao3, so maybe this will help
			p.innerHTML = `<label for="${cssName}">${p.innerHTML}</label>`;
			}


			p.insertAdjacentElement("afterbegin", cb);

			function checkListen() {
				// has to be a local function in order to be able to use the fandom name n stuff
				console.log(`${fanName} checked: ${cb.checked}`);
				if (cb.checked) {
					// check the big one if it's not already checked
					// if (!hcb.checked) {
					// 	hcb.checked = true;
					// }

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
				// hcb.checked = l.querySelector(`ul.tags input:checked`);

				trackedFandoms[currentCategory] = catList; // mutate original too i guess
				localStorage.setItem("trackedFandoms", JSON.stringify(trackedFandoms));
				// parentChecked();
			}


			cb.addEventListener("click", checkListen);
		}
	}
}



// ==UserScript==
// @name		Change in Fandoms
// @namespace	https://sincerelyandyourstruly.neocities.org
// @version		2025-10-03
// @description	y'know, like, nya~ >:3c
// @author		小白雪花
// @match		https://archiveofourown.org/media/**/fandoms
// @icon		https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @downloadURL	https://raw.githubusercontent.com/XiaoBaiXueHua/misc-userscripts/main/
// @updateURL	https://raw.githubusercontent.com/XiaoBaiXueHua/misc-userscripts/main/
// @grant		none
// ==/UserScript==

const fandoms = document.querySelectorAll(`.letter ul.tags li`);
const listObj = new Object();
const minimumToTrack = 100; // minimum number of works before i'll start tracking that shit
// var i = 0;
var k = 0;
for (const f of fandoms) {
	const count = parseInt(f.innerText.trim().match(/\(\d+\)$/)[0].replaceAll(/(\(|\))/g, "")); // so. we trim away the spaces, match for the (count number at the end), and remove the parentheses. also parse it as an integer
	if (count >= minimumToTrack) {
		listObj[`${f.querySelector(`a.tag`).innerText.trim()}`] = { count: count, index: k }; // now we stick that baby in our object
	}
	k++;
}
// localStorage.setItem(`change in ${document.querySelector(`#main h2.heading`).innerText.trim()}`, JSON.stringify(listObj)); // save it to local storage
console.log(`listObj: `, Object.entries(listObj));
console.log(`localStorage: `, Object.entries(JSON.parse(localStorage.getItem(`change in ${document.querySelector(`#main h2.heading`).innerText.trim()}`))));

const savedEntries = Object.entries(JSON.parse(localStorage.getItem(`change in ${document.querySelector(`#main h2.heading`).innerText.trim()}`))), newEntries = Object.entries(listObj);

const wan = new Array(), wuqian = new Array(), qian = new Array(), wubai = new Array(), bai = new Array(); // 10k+, 5000-9999, 1000-4999, 500-999, 100-499... all else i think we can just ignore lol
function pusher(obj, key, compVal) {
	if (obj[key]) {
		// console.log(`fandom: ${fname}`,listObj[fname], finfo);
		// const newInfo = listObj[fname];
		obj[key].appeared = true;
		const delta = obj[key].count - compVal;
		obj[key].delta = delta; // save the change
		const whee = obj[key]
		if (delta >= 10000) {
			wan.push({ [`${key}`]: whee });
			console.log(`${key}: ${obj[key].count} - ${compVal} = ${delta}`);
		} else if (delta >= 5000) {
			wuqian.push({ [`${key}`]: whee })
		} else if (delta >= 1000) {
			qian.push({ [`${key}`]: whee })
		} else if (delta >= 500) {
			wubai.push({ [`${key}`]: whee })
		} else if (delta >= 100) {
			bai.push({ [`${key}`]: whee })
		} // any less than that n it's probably not worth looking at
		// console.log(`Δ${fname}:\n\t(${newInfo.count} - ${finfo.count}) = ${newInfo.count - finfo.count}`);
	} else {
		console.log(`hmmm it seems that ${key} has dropped out of the running.`)
	}
}
for (const [fname, finfo] of savedEntries) {
	// wait. we can just do that since we can just get old finfo by doing listObj[fname]
	pusher(listObj, fname, finfo.count);
}

// umm then we look at all the ones which didn't appear via filtering
const newPops = Object.entries(listObj).filter((fan) => !fan[1].appeared);
console.log(newPops);
for (const n of newPops) {
	pusher(listObj, n[0], minimumToTrack);
}
console.log(`da arrays of sorted fandoms: \n`, wan, wuqian, wuqian, wubai, bai);
// var j = 0; // this tracks the adjustment from the other thing
// for (var i = 0; i < newEntries.length; i++) {
//// using the new entries in case some new fandom broke 100 fics
//// we're also going to assume that fandoms don't generally Go Down, though i guess since this is alphabetical order, we could always just test that...

// }
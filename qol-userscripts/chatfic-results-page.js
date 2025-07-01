// ==UserScript==
// @name		Tag Filter Exporter
// @namespace	https://sincerelyandyourstruly.neocities.org
// @version		1.0
// @description	saves just the tag title w/the total works & the filter to preserve user privacy
// @author		小白雪花
// @match		https://squidgeworld.org/tags/**/works
// @match		https://archiveofourown.org/tags/**/works
// @icon		https://www.google.com/s2/favicons?sz=64&domain=squidgeworld.org
// @downloadURL	https://raw.githubusercontent.com/XiaoBaiXueHua/fandom-migrations/qol-userscripts/chatfic-results-page.js
// @updateURL	https://raw.githubusercontent.com/XiaoBaiXueHua/fandom-migrations/qol-userscripts/chatfic-results-page.js
// @grant		none
// ==/UserScript==

// saves just the number of results & the filters form to an html file instead of saving the whole page
const button = document.createElement(`button`);
button.innerHTML = `Export Tag Filter`;
button.addEventListener(`click`, fwoomp);

function fwoomp() {
	const bod = document.createElement("div");
	const h = document.querySelector(`#main h2.heading`).cloneNode(true);
	const f = document.querySelector(`#work-filters`).cloneNode(true);
	// console.log(h, f);
	bod.append(h, f);
	const DL = URL.createObjectURL(new Blob([bod.outerHTML], { type: "text/html" }));

	const a = document.createElement("a");
	a.href = DL;
	a.download = `${window.location.host} -  ${document.querySelector(`#main h2.heading a`).innerText.trim()}.html`; // site host - tag name
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(DL);
}
// fwoomp();
document.querySelector(`#main ul.actions`).insertAdjacentElement(`afterbegin`, button);
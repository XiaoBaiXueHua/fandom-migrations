// ==UserScript==
// @name		FimFiction Stat Counter
// @namespace	https://sincerelyandyourstruly.neocities.org
// @version		1.0
// @description	counts the stats For Me :3
// @author		小白雪花
// @match		https://www.fimfiction.net/statistics
// @icon		https://www.google.com/s2/favicons?sz=64&domain=fimfiction.net
// @downloadURL	https://raw.githubusercontent.com/XiaoBaiXueHua/fandom-migrations/main/qol-userscripts/fimfiction-adder.js
// @updateURL	https://raw.githubusercontent.com/XiaoBaiXueHua/fandom-migrations/main/qol-userscripts/fimfiction-adder.js
// @grant		none
// ==/UserScript==

const pDiv = document.createElement(`div`);
pDiv.className = `content_box`;
pDiv.id = `progress-watcher`;
const article = document.createElement(`article`);
article.className = `article`;
article.innerHTML = `<h1>Progress Watcher&hellip;</h1>`
const progression = document.createElement(`div`);
progression.className = `chart`;

const label = document.createElement(`label`);
label.innerHTML = `Total: `;
label.setAttribute(`for`, `progression-total`);
const input = document.createElement(`input`);
input.id = `progression-total`;
input.setAttribute(`type`, `number`);

label.appendChild(input);

article.append(label, progression);

pDiv.appendChild(article);

document.querySelector(`.content_box`).insertAdjacentElement(`afterend`, pDiv); // puts it after the stories approved thing
function nya() {
	const storyJson = JSON.parse(document.querySelector(".content_box").getAttribute("data-data"));
	var total = 0, quarterly = 0;
	const months = [0, 3, 6, 9];
	for (const day of storyJson) {
		const date = new Date(day.date);
		for (const category of Object.values(day)) {
			if (typeof (category) == "number") {
				total += category;
				quarterly += category;
				input.value = total;
			}
		}
		if (months.includes(date.getMonth()) && date.getDate() == 1) {
			// console.log(`%ctotal as of ${day.date}: ${total}`, "color: darkred;");
			const d = document.createElement(`section`);
			d.className = `total-update`;
			const p = document.createElement(`p`);
			p.className = `total`;
			p.innerHTML = `<strong>total as of ${day.date}:</strong> ${total.toLocaleString()}`;
			// progression.insertAdjacentElement(`afterbegin`, p);
			const p2 = document.createElement(`p`);
			p2.className = `quarterly`;
			p2.innerHTML = `<strong>total for this quarter:</strong> ${quarterly.toLocaleString()}`;
			d.append(p, p2);
			progression.insertAdjacentElement(`afterbegin`, d);
			// console.log(`total for this quarter: ${quarterly}`);

			quarterly = 0;
		}
	}
	input.value = total;
	const d = document.createElement(`section`);
	d.className = `total-update`;
	const p = document.createElement(`p`);
	p.className = `total`;
	p.innerHTML = `<strong>total as of <ins>today</ins>:</strong> ${total.toLocaleString()}`;
	// progression.insertAdjacentElement(`afterbegin`, p);
	const p2 = document.createElement(`p`);
	p2.className = `quarterly`;
	p2.innerHTML = `<strong>total for this quarter:</strong> ${quarterly.toLocaleString()}`;
	d.append(p, p2);
	progression.insertAdjacentElement(`afterbegin`, d);

	// console.log(`%ctotal as of today: ${total}`, "color: red");
	// console.log(`total for this quarter: ${quarterly}`);
	console.log(`storyJson:`, storyJson);
	
	const anchor = document.createElement(`a`);
	const blob = new Blob([JSON.stringify(storyJson)], { type: "application/json" });
	const DL_jason = URL.createObjectURL(blob);
	anchor.href = DL_jason;
	// anchor.download(JSON.stringify(results));
	anchor.download = `fimfiction`;
	anchor.click();
	document.body.removeChild(anchor); // remove the link now that our downloads are done
}

nya();
// article.append(progression, txtarea);
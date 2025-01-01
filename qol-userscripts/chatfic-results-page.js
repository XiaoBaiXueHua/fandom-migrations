// saves just the number of results & the filters form to an html file instead of saving the whole page

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
fwoomp();
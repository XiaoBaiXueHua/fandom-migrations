const currSite = window.location.hostname;
console.log(currSite);

let str = "", filename = "", elName = "button", parent = "#migrations-helper";
switch (currSite) {
	case "www.fanfiction.net": {
		str = "#content_wrapper_inner";
		filename = "#content_wrapper_inner td";
		parent = ".lc-wrapper"
		break;
	}
	case "www.asianfanfics.com": {
		str = "div.tags";
		filename = "h1"; // should just say AsianFanfics lol
		parent = "#advanced-search form";
		break;
	}
	default: { // designed to work with sites built w/the otw software
		str = "#main";
		filename = "#main h2.heading";
		elName = "li";
		// parent = "#migrations-helper";
	}
}
parent = document.querySelector(parent);
const expButton = document.createElement(elName);
expButton.innerHTML = `<a href="#">Export Fandom Listing</a>`;
expButton.addEventListener("click", yahoo);
parent.appendChild(expButton);


function yahoo() {
	const txt = document.querySelector(str).outerHTML;
	const blob = new Blob([txt], { type: "text/html" }); //create blob object
	const DL_jason = URL.createObjectURL(blob);
	// const saveDate = new Date();
	const anchor = document.createElement("a");
	anchor.href = DL_jason;
	anchor.download = document.querySelector(filename).innerText;
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	// download(DL_jason, `autofilters_${saveDate.getFullYear()}_${saveDate.getMonth()}_${saveDate.getDay()}.json`); //download the file
	URL.revokeObjectURL(DL_jason); //release object url
}
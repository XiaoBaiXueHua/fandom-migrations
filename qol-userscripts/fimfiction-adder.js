function nya() {
	const storyJson = JSON.parse(document.querySelector(".content_box").getAttribute("data-data"));
	var total = 0, quarterly = 0;
	const months = [0, 3, 6, 9];
	for (const day of storyJson) {
		const date = new Date(day.date);
		for (const category of Object.values(day)) {
			if (typeof (category) == "number") { total += category; quarterly += category }
		}
		if (months.includes(date.getMonth()) && date.getDate() == 1) {
			console.log(`%ctotal as of ${day.date}: ${total}`, "color: darkred;");
			console.log(`total for this quarter: ${quarterly}`);
			quarterly = 0;
		}
	}
	console.log(`%ctotal as of today: ${total}`, "color: red");
	console.log(`total for this quarter: ${quarterly}`);
	console.log(`storyJson:`, storyJson);
}

nya();
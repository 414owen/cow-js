/**
 *
 * @preserve
 * This is CowJS, a web developer's easter egg
 * Homepage: https://github.com/414owen/cow-js
 *
 */

/**
 *
 * @license
 * Copyright (c) 2017 Owen Shepherd
 * This software is open-source under the MIT license.
 * The full license can be viewed here: https://opensource.org/licenses/MIT
 *
 */

(function() {

	// Repeat a string
	function rep(a, b) {
		var res = "";
		while (b--) {res += a;}
		return res;
	}

	// State, whitespace regex, space alias
	var text = "", ws = /^\s*$/, space = " ",
		repSpace = rep.bind(space, space), badEls = ["textarea", "input"];

	function cow(a) {

		// Array of lines based on newlines and 50 char limit
		var split = a.split("\n").reduce(function(a, s) {
			var res = [];
			while (s.length > 50) {
				var t = 49, n = 50, f = "";
				if (ws.test(s[50])) {t++; n++;} 
				else if (ws.test(s[48])) {t--; n--;} 
				else if (!ws.test(s[49])) {f = "-"; n--;}
				res.push(s.slice(0, t) + f);
				s = s.slice(n);
			}
			res.push(s);
			return a.concat(res);
		}, []);
		// Trim blank lines, but leave spaces in for formatting
		while (ws.test(split[0])) {split = split.slice(1);}
		while (ws.test(split[split.length - 1])) {split = split.slice(0, split.length - 1);}

		// Don't print nothing
		if (split.length === 0) {return;}

		// Find longest line
		var longest = split.reduce(function(acc, val) {
			return acc > val.length ? acc : val.length;
		}, 0);

		// Generate text box sides
		var sides = split.length === 1 ? "<>" : 
			"/\\" + rep("|", split.length * 2 - 4) + "\\/";

		var cow = rep("_", longest + 2) + "\n" +
			split.map(function(b, i) {
				return sides[i * 2] + space + b + repSpace(longest - b.length) + 
					space + sides[i * 2 + 1] + "\n";
			}).join("") +
			space + rep("-", longest + 2) + "\n" +
			repSpace(8)  + "\\   ^__^\n" +
			repSpace(9)  + "\\  (oo)\\_______\n" +
			repSpace(12) + "(__)\\       )\\/\\\n" +
			repSpace(16) + "||----w |\n" +
			repSpace(16) + "||     ||";

		console.log("%c " + cow,
			"font-family: monospace"
		);
	}

	// Enable pasting
	document.addEventListener("paste", function(e){
		text += e.clipboardData.getData("text");
	});

	// Handle keypresses
	document.onkeydown = function(e) {
		var elName = document.activeElement.tagName.toLowerCase();
		if (e.ctrlKey || (badEls.indexOf(elName) !== -1)) {return;}
		e.preventDefault();
		if (e.keyCode === 13) {
			if (e.shiftKey) {text += "\n";} 
			else {cow(text); text  = "";}
		} else if (e.keyCode === 8) {
			text = text.slice(0, text.length - 1);
		} else if (e.key && e.key.length === 1) {
			text += e.key;
		} else if (e.keyIdentifier) {
			var code = parseInt(e.keyIdentifier.slice(2), 16);
			if (code > 0) {
				var key = String.fromCharCode(code);
				if (!e.shiftKey) {key = key.toLowerCase();}
				if (key.length === 1) {
					text += key;
				}
			}
		}
	};

	// Be helpful
	cow("Focus the page, type, then press enter");
})();

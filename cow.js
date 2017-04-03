/**
 *
 * @preserve
 * This is CowJS, a web developer's easter egg
 * Homepage: https://github.com/414owen/Nutmeg
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

!function() {

	// Repeat a string
	function rep(a, b) {
		return Array(b).fill(a).join("");
	}

	// State and whitespace regex
	var text = "", ws = /^\s*$/;

	function cow(a) {

		// Array of lines based on newlines and 50 char limit
		var s = a.split("\n").reduce(function(a, s) {
			var res = [];
			while (s.length > 50) {
				var t, n, f = "";
				if (ws.test(s[49])) {t = 49; n = 50;} 
				else if (ws.test(s[50])) {t = 50; n = 51;} 
				else if (ws.test(s[48])) {t = 48; n = 49;} 
				else {t = 49; n = 49; f = "-";}
				res.push(s.slice(0, t) + f);
				s = s.slice(n);
			}
			res.push(s)
			return a.concat(res);
		}, []);

		// Trim blank lines, but leave spaces in for formatting
		while (ws.test(s[0])) {s = s.slice(1);}
		while (ws.test(s[s.length - 1])) {s = s.slice(0, s.length - 1);}

		// Don't print nothing
		if (s.length === 0) {return;}

		// Find longest line
		var l = s.reduce(function(acc, val) {
			return acc > val.length ? acc : val.length;
		}, 0);

		// Generate text box sides
		var sides = s.length === 1 ? "<>" : "/\\" + rep("|", s.length * 2 - 4) + "\\/";

		console.log(
			" " + rep("_", l + 2) + " \n" +
			s.map(function(b, i) {
				return sides[i * 2] + " " + b + rep(" ", l - b.length) + " " + sides[i * 2 + 1] + "\n";
			}).join("") +
			" " + rep("-", l + 2) + " \n" +
			"        \\   ^__^\n" +
			"         \\  (oo)\\_______\n" +
			"            (__)\\       )\\/\\\n" +
			"                ||----w |\n" +
			"                ||     ||"
		);
	}

	// Enable pasting
	document.addEventListener("paste", function(e){
		text += e.clipboardData.getData("text");
	});

	// Handle keypresses
	document.onkeydown = function(e) {
		if (e.ctrlKey) {return;}
		if (e.keyCode === 13) {
			if (e.shiftKey) {
				text += "\n";
			} else {
				cow(text);
				text = "";
			}
		} else if (e.keyCode === 8) {
			text = text.slice(0, text.length - 1);
		} else if (e.key.length === 1) {
			text += e.key;
		}
	};

	// Be helpful
	cow("Focus the page, type, then press enter");
}();

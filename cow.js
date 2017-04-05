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

	// This should enable far smaller minification, but it's not working...
	// closure compiler keeps inlining it, even though I counted the bytes
	// and leaving the function as-is is advantageous
	function length(a) {return a.length;}

	// State, whitespace regex, space alias
	var text = "";
	var ws = /^\s*$/;
	var repSpace = rep.bind(" ", " ");

	function printMono(text) {
		if (text) {
			console.log("%c " + text,
				"font-family: monospace"
			);
		}
	}

	function cow(a) {

		// Array of lines based on newlines and 50 char limit
		var split = a.split("\n").reduce(function(a, s) {
			var res = [];
			while (length(s) > 50) {
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
		while (ws.test(split[length(split) - 1])) {split = split.slice(0, length(split) - 1);}

		// Don't print nothing
		if (length(split) === 0) {return;}

		// Find longest line
		var longest = split.reduce(function(acc, val) {
			return acc > length(val) ? acc : length(val);
		}, 0);

		// Generate text box sides
		var sides = length(split) === 1 ? "<>" : 
			"/\\" + rep("|", length(split) * 2 - 4) + "\\/";

		return rep("_", longest + 2) + "\n" +
			split.map(function(b, i) {
				return sides[i * 2] + " " + b + repSpace(longest - length(b)) + 
					" " + sides[i * 2 + 1] + "\n";
			}).join("") +
			" " + rep("-", longest + 2) + "\n" +
			repSpace(8)  + "\\   ^__^\n" +
			repSpace(9)  + "\\  (oo)\\_______\n" +
			repSpace(12) + "(__)\\       )\\/\\\n" +
			repSpace(16) + "||----w |\n" +
			repSpace(16) + "||     ||";
	}

	// Enable pasting
	document.addEventListener("paste", function(e){
		text += e.clipboardData.getData("text");
	});

	// Handle keypresses
	document.onkeydown = function(e) {
		var elName = document.activeElement.tagName.toLowerCase();
		var prevent = true;

		// Backspace
		if (e.keyCode === 8) {

			// Ctrl-backspace = delete word
			if (e.ctrlKey) {
				var t = text.split(/\s/);
				text = text.slice(0, length(text) - length(t[length(t) - 1]));
				while (ws.test(text[length(text) - 1])) {
					text = text.slice(0, length(text) - 1);
				}
			} else {
				text = text.slice(0, length(text) - 1);
			}
		} else if (e.ctrlKey || (["textarea", "input"].indexOf(elName) !== -1)) {
			prevent = false;
			
		// Enter key triggers cow
		} else if (e.keyCode === 13) {
			if (e.shiftKey) {text += "\n";} 
			else {
				printMono(cow(text));
				text = "";
			}

		// Add the character to the queue
		} else if (e.key && length(e.key) === 1) {
			text += e.key;

		// Compensate for webkit being slow to adopt KeyboardEvent.key
		} else if (e.keyIdentifier) {
			var code = parseInt(e.keyIdentifier.slice(2), 16);
			if (code > 0) {
				var key = String.fromCharCode(code);
				if (!e.shiftKey) {key = key.toLowerCase();}
				if (length(key) === 1) {
					text += key;
				}
			}
		}
		if (prevent) {e.preventDefault();}
	};

	// Be helpful
	printMono(cow("Focus the page, type, then press enter"));
})();

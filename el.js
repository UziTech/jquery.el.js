/**
 * Author: Tony Brix, https://Tony.Brix.ninja
 * Repo: https://github.com/UziTech/jquery.el.js
 * License: MIT
 * Version: 0.2.0
 *
 * simple way to create elements without jquery
 * example:
 * document.el("table#tab1[border=0]").el("tbody").el("tr.odd").el("td{text}");
 */

(function (doc) {
	function isStartTokenChar(char) {
		return /[#.[{\s]/.test(char);
	}

	function startNextToken(char) {
		if (/\s/.test(char)) {
			return {
				type: "whitespace"
			};
		}
		switch (char) {
			case null:
				return;
			case "#":
				return {
					type: "id",
					value: ""
				};
			case ".":
				return {
					type: "class",
					value: ""
				};
			case "[":
				return {
					type: "attrs",
					value: ""
				};
			case "{":
				return {
					type: "text",
					value: ""
				};
			default:
				throw new Error("'" + char + "' is not a valid start of a token");
		}
	}

	function parseAttrs(attrs, text) {
		text = text.trim();
		var token = "next";
		var inString = false;
		var inWhitespace = false;
		var attr = {
			name: "",
			value: ""
		};
		for (var i = 0; i <= text.length; i++) {
			var char = null;
			if (i < text.length) {
				char = text[i];
				switch (token) {
					case "name":
						if (char === "=") {
							token = "equals";
							inWhitespace = false;
						} else if (/\s/.test(char)) {
							inWhitespace = true;
						} else if (inWhitespace) {
							// empty attr
							attrs[attr.name] = "";
							attr = {
								name: "",
								value: ""
							};
							inWhitespace = false;
							token = "name";
							if (/[\w-]/.test(char)) {
								attr.name += char;
							} else {
								throw new Error("'" + char + "' is not a valid attribute name character");
							}
						} else if (/[\w-]/.test(char)) {
							attr.name += char;
						} else {
							throw new Error("'" + char + "' is not a valid attribute name character");
						}
						break;
					case "equals":
						if (/\s/.test(char)) {
							// ignore whitespace
						} else if (/["']/.test(char)) {
							inString = char;
							token = "value";
						} else {
							attr.value += char;
							token = "value";
						}
						break;
					case "value":
						if (inString) {
							if (char === "\\") {
								if (text.length > i + 1) {
									var nextInStringChar = text[i + 1];
									switch (nextInStringChar) {
										case "\\":
										case "'":
										case "\"":
											attr.value += nextInStringChar;
											i++;
											break;
										default:
											attr.value += char;
									}
								} else {
									attr.value += char;
								}
							} else if (char === inString) {
								inString = false;
								attrs[attr.name] = attr.value;
								attr = {
									name: "",
									value: ""
								};
								token = "next";
							} else {
								attr.value += char;
							}
						} else {
							if (char === "\\") {
								if (text.length > i + 1) {
									var nextChar = text[i + 1];
									switch (nextChar) {
										case "\\":
											attr.value += nextChar;
											i++;
											break;
										default:
											attr.value += char;
									}
								} else {
									attr.value += char;
								}
							} else if (/\s/.test(char)) {
								attrs[attr.name] = attr.value;
								attr = {
									name: "",
									value: ""
								};
								token = "next";
							} else {
								attr.value += char;
							}
						}
						break;
					case "next":
						if (/[\w-]/.test(char)) {
							inWhitespace = false;
							attr.name += char;
							token = "name";
						} else if (/[^\s]/.test(char)) {
							throw new Error("'" + char + "' is not a valid attribute name character");
						}
						break;
					default:
						// this should never happen
						throw new Error("'" + token + "' is an invalid token");
				}
			} else {
				if (attr.name) {
					attrs[attr.name] = attr.value;
				}
			}
		}
		return attrs;
	}

	function parseText(text) {
		var parsed = {
			tag: "div",
			id: null,
			classes: [],
			attrs: {},
			text: ""
		};
		var token = {
			type: "tag",
			value: "",
		};
		for (var i = 0; i <= text.length; i++) {

			var char = null;
			if (i < text.length) {
				char = text[i];
			}
			switch (token.type) {
				case "whitespace":
					if (char && /\S/.test(char)) {
						token = startNextToken(char);
					}
					break;
				case "tag":
					if (char === "\\") {
						if (text.length > i + 1) {
							var nextTagChar = text[i + 1];
							if (nextTagChar === "\\" || (isStartTokenChar(nextTagChar) && /\S/.test(nextTagChar))) {
								token.value += nextTagChar;
								i++;
							} else {
								token.value += char;
							}
						} else {
							token.value += char;
						}
					} else if (char && !isStartTokenChar(char)) {
						token.value += char;
					} else {
						if (token.value) {
							if (/^[0-9]/.test(token.value)) {
								throw new Error("Tag cannot start with a number.");
							}
							parsed.tag = token.value;
						}
						token = startNextToken(char);
					}
					break;
				case "id":
					if (char === "\\") {
						if (text.length > i + 1) {
							var nextIdChar = text[i + 1];
							if (nextIdChar === "\\" || (isStartTokenChar(nextIdChar) && /\S/.test(nextIdChar))) {
								token.value += nextIdChar;
								i++;
							} else {
								token.value += char;
							}
						} else {
							token.value += char;
						}
					} else if (char && !isStartTokenChar(char)) {
						token.value += char;
					} else {
						if (!token.value) {
							throw new Error("id cannot be empty");
						}
						if (parsed.id) {
							throw new Error("cannot have multiple ids");
						} else {
							parsed.id = token.value;
							token = startNextToken(char);
						}
					}
					break;
				case "class":
					if (char === "\\") {
						if (text.length > i + 1) {
							var nextClassChar = text[i + 1];
							if (nextClassChar === "\\" || (isStartTokenChar(nextClassChar) && /\S/.test(nextClassChar))) {
								token.value += nextClassChar;
								i++;
							} else {
								token.value += char;
							}
						} else {
							token.value += char;
						}
					} else if (char && !isStartTokenChar(char)) {
						token.value += char;
					} else {
						if (!token.value) {
							throw new Error("class cannot be empty");
						}
						parsed.classes.push(token.value);
						token = startNextToken(char);
					}
					break;
				case "attrs":
					if (char === null) {
						throw new Error("missing ']' at end of attributes token");
					} else if (char === "\\") {
						if (text.length > i + 1) {
							var nextAttrChar = text[i + 1];
							switch (nextAttrChar) {
								case "\\":
									token.value += "\\\\";
									i++;
									break;
								case "]":
									token.value += nextAttrChar;
									i++;
									break;
								default:
									token.value += char;
							}
						} else {
							token.value += char;
						}
					} else if (/[^\]]/.test(char)) {
						token.value += char;
					} else {
						parseAttrs(parsed.attrs, token.value);
						token = {
							type: "next"
						};
					}
					break;
				case "text":
					if (char === null) {
						throw new Error("missing '}' at end of text token");
					} else if (char === "\\") {
						if (text.length > i + 1) {
							var nextTextChar = text[i + 1];
							switch (nextTextChar) {
								case "\\":
								case "}":
									token.value += nextTextChar;
									i++;
									break;
								default:
									token.value += char;
							}
						} else {
							token.value += char;
						}
					} else if (/[^}]/.test(char)) {
						token.value += char;
					} else {
						parsed.text += token.value;
						token = {
							type: "next"
						};
					}
					break;
				case "next":
					if (char) {
						token = startNextToken(char);
					}
					break;
				default:
					// this should never happen
					throw new Error("'" + token.type + "' is not a valid token type");
			}
		}
		return el;
	}

	function el(text, returnParent) {
		if (typeof text === "undefined" || text === null) {
			text = "";
		} else if (typeof text === "function") {
			text = text.call(this);
		}
		// TODO: object
		text = ("" + text).trim();
		var parsed = parseText(text);
		var created = doc.createElement(parsed.tag);
		if (parsed.id) {
			created.setAttribute("id", parsed.id);
		}
		if (parsed.classes.length > 0) {
			created.classList.add.call(created, parsed.classes);
		}
		if (parsed.attrs) {
			for (var attr in parsed.attrs) {
				created.setAttribute(attr, parsed.attrs[attr]);
			}
		}
		if (parsed.text) {
			created.textContent = parsed.text;
		}
		created.el = el;

		if (this instanceof HTMLElement) {
			this.appendChild(created);
		}

		if (returnParent) {
			return this;
		}
		return created;
	}

	doc.el = el;
})(document);

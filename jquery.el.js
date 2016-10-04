/**
 * Author: Tony Brix, https://Tony.Brix.ninja
 * Repo: https://github.com/UziTech/jquery.el.js
 * License: MIT
 * Version: 0.1.0
 *
 * simple way to create elements in jquery
 * example:
 * $.el("table#tab1[border=0]").el("tbody").el("tr.odd").el("td{text}");
 */

(function ($) {
	function startNextToken(char) {
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
				throw "'" + char + "' is not a valid start of a token";
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
								throw "'" + char + "' is not a valid attribute name character";
							}
						} else if (/[\w-]/.test(char)) {
							attr.name += char;
						} else {
							throw "'" + char + "' is not a valid attribute name character";
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
							throw "'" + char + "' is not a valid attribute name character";
						}
						break;
					default:
						// this should never happen
						throw "'" + token + "' is an invalid token";
				}
			} else {
				if (attr.name) {
					attrs[attr.name] = attr.value;
				}
			}
		}
		return attrs;
	}

	function parseTag(text) {
		if (typeof text === "undefined") {
			text = "";
		}
		if (typeof text !== "string") {
			throw "invalid input";
		}
		text = text.trim();
		var el = {
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
				case "tag":
					if (char && /\w/.test(char)) {
						token.value += char;
					} else {
						if (token.value) {
							el.tag = token.value;
						}
						token = startNextToken(char);
					}
					break;
				case "id":
					if (char && /[\w-]/.test(char)) {
						token.value += char;
					} else {
						if (!token.value) {
							if (char === null) {
								throw "id cannot be empty";
							} else {
								throw "'" + char + "' is not a valid id character";
							}
						}
						if (el.id) {
							throw "cannot have multiple ids";
						} else {
							el.id = token.value;
							token = startNextToken(char);
						}
					}
					break;
				case "class":
					if (char && /[\w-]/.test(char)) {
						token.value += char;
					} else {
						if (!token.value) {
							if (char === null) {
								throw "class cannot be empty";
							} else {
								throw "'" + char + "' is not a valid class character";
							}
						}
						el.classes.push(token.value);
						token = startNextToken(char);
					}
					break;
				case "attrs":
					if (char === null) {
						throw "missing ']' at end of attributes token";
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
						parseAttrs(el.attrs, token.value);
						token = {
							type: "next"
						};
					}
					break;
				case "text":
					if (char === null) {
						throw "missing '}' at end of text token";
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
						el.text += token.value;
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
					throw "'" + token.type + "' is not a valid token type";
			}
		}
		return el;
	}

	$.el = function (text) {
		var el = parseTag(text);
		var $el = $("<" + el.tag + " />");
		if (el.id) {
			$el.attr({ id: el.id });
		}
		if (el.classes.length > 0) {
			$el.addClass(el.classes.join(" "));
		}
		if (el.attrs) {
			$el.attr(el.attrs);
		}
		if (el.text) {
			$el.text(el.text);
		}
		return $el;
	};

	$.fn.el = function (tag) {
		var $el = $.el(tag);
		this.append($el);
		return $el;
	};
})(jQuery);

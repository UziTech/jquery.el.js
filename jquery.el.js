/**
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
		var inString = false;
		var inName = true;
		var attr = {
			name: "",
			value: ""
		};
		for (var i = 0; i <= text.length; i++) {
			var char = null;
			if (i < text.length) {
				char = text[i];
			} else {
				attrs[attr.name.trim()] = attr.value.trim();	
			}
			if (inName) {
				if (char === "=") {
					inName = false;
				} else {
					attr.name += char;
				}
			} else {
				if (inString) {
					if (char === inString) {
						// TODO: check for slash
						inString = false;
						attrs[attr.name.trim()] = attr.value.trim();
						attr = {
							name: "",
							value: ""
						};
						inName = true;
					} else {
						attr.value += char;
					}
				} else {
					if (char === " " && attr.value.trim()) {
						attrs[attr.name.trim()] = attr.value.trim();
						attr = {
							name: "",
							value: ""
						};
						inName = true;
					} else if (/["']/.test(char)) {
						if (attr.value.trim()) {
							attr.value += char;
						} else {
							inString = char;
						}
					} else {
						attr.value += char;
					}
				}
			}
		}
		return attrs;
	}

	function parseTag(tag) {
		var el = {
			tag: "div",
			id: "",
			classes: [],
			attrs: {},
			text: ""
		};
		var token = {
			type: "tag",
			value: "",
		};
		for (var i = 0; i <= tag.length; i++) {

			var char = null;
			if (i < tag.length) {
				char = tag[i];
			}
			switch (token.type) {
				case "tag":
					if (char && /\w/.test(char)) {
						token.value += char;
					} else {
						el.tag = token.value || "div";
						token = startNextToken(char);
					}
					break;
				case "id":
					if (char && /\w/.test(char)) {
						token.value += char;
					} else {
						if (!token.value) {
							throw "'" + token.value + "' is not a valid id";
						}
						el.id = token.value;
						token = startNextToken(char);
					}
					break;
				case "class":
					if (char && /\w/.test(char)) {
						token.value += char;
					} else {
						if (!token.value) {
							throw "'" + token.value + "' is not a valid class";
						}
						el.classes.push(token.value);
						token = startNextToken(char);
					}
					break;
				case "attrs":
					if (char && /[^\]]/.test(char)) {
						token.value += char;
					} else {
						parseAttrs(el.attrs, token.value);
						token = {
							type: "next"
						};
					}
					break;
				case "text":
					if (char && /[^}]/.test(char)) {
						token.value += char;
					} else {
						el.text = token.value;
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
					throw "'" + token.type + "' is not a valid token type";
			}
		}
		return el;
	}
	$.el = function (tag) {
		var el = parseTag(tag);
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

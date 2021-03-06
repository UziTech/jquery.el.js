/* globals QUnit */
/* eslint-disable quotes */
function eq(title, text, expected) {
	QUnit.test(title, function (assert) {
		var actual = $.el(text)[0].outerHTML;
		var test;
		if (typeof text === "function") {
			test = text.toString().replace(/\s+/g, " ");
		} else {
			test = JSON.stringify(text);
		}
		assert.deepEqual(actual, expected, "$.el(" + test + ")[0].outerHTML\nExpected: " + JSON.stringify(expected) + "\nActual: " + JSON.stringify(actual));
	});
}

function err(title, text, expected) {
	QUnit.test(title, function (assert) {
		var actual;
		try {
			$.el(text);
		} catch (error) {
			actual = (error.message ? error.message : error);
		}
		assert.deepEqual(actual, expected, "$.el(" + JSON.stringify(text) + ")\nExpected: throws " + JSON.stringify(expected) + "\nActual: throws " + JSON.stringify(actual));
	});
}

var undef;
eq("undefined", undef, '<div></div>');
eq("nothing", "", '<div></div>');
eq("space", " ", '<div></div>');
var rand = Math.random().toString(36).replace(/\W/g, "");
eq("function", function () {
	return "#rand-" + rand;
}, '<div id="rand-' + rand + '"></div>');
eq("arrow function", () => ("#rand-arrow-" + rand), '<div id="rand-arrow-' + rand + '"></div>');
err("number", 1, "Tag cannot start with a number.");
err("invalid start of token", "div !test", "'!' is not a valid start of a token");

QUnit.module("tag");
eq("regular", "span", '<span></span>');
eq("unknown", "unknown", '<unknown></unknown>');
eq("spaces", " span ", '<span></span>');
eq("escaped start token", "div\\.", '<div.></div.>');
err("\\ at end", "div\\", "Failed to execute 'createElement' on 'Document': The tag name provided ('div\\') is not a valid name.");
err("invalid char", "di\\v", "Failed to execute 'createElement' on 'Document': The tag name provided ('di\\v') is not a valid name.");

QUnit.module("id");
eq("single", "#div", '<div id="div"></div>');
eq("spaces around", " #div ", '<div id="div"></div>');
eq("symbol char", "#div1!", '<div id="div1!"></div>');
eq("escaped start token", "#div\\#", '<div id="div#"></div>');
eq("escaped \\", "#div\\\\", '<div id="div\\"></div>');
eq("non-escaped \\ before whitespace", "#div\\ .class", '<div id="div\\" class="class"></div>');
eq("\\ at end", "#div\\", '<div id="div\\"></div>');
err("empty", "#", "id cannot be empty");
err("multiple", "#div1#div2", "cannot have multiple ids");

QUnit.module("class");
eq("single", ".div", '<div class="div"></div>');
eq("multiple", ".div1.div2", '<div class="div1 div2"></div>');
eq("symbol char", ".div1!", '<div class="div1!"></div>');
eq("escaped start token", ".div\\#", '<div class="div#"></div>');
eq("escaped \\", ".div\\\\", '<div class="div\\"></div>');
eq("non-escaped \\ before whitespace", ".div\\ .class", '<div class="div\\ class"></div>');
eq("\\ at end", ".div\\", '<div class="div\\"></div>');
err("empty", ".", "class cannot be empty");

QUnit.module("attr");
eq("no quote", "[data-test=test]", '<div data-test="test"></div>');
eq("single quote", "[data-test='test']", '<div data-test="test"></div>');
eq("double quote", "[data-test=\"test\"]", '<div data-test="test"></div>');
eq("single quote in no quote", "[data-test=t'est]", '<div data-test="t\'est"></div>');
eq("double quote in no quote", "[data-test=t\"est]", '<div data-test="t&quot;est"></div>');
eq("spaces no quotes", "[ data-test = test ]", '<div data-test="test"></div>');
eq("spaces single quotes", "[ data-test = ' test ' ]", '<div data-test=" test "></div>');
eq("spaces double quotes", "[ data-test = \" test \" ]", '<div data-test=" test "></div>');
eq("single quotes in double quoted attr value", "[data-test=\"'test\"]", '<div data-test="\'test"></div>');
eq("escaped double quote in double quoted attr value", "[data-test=\"\\\"test\"]", '<div data-test="&quot;test"></div>');
eq("escaped double quote in single quoted attr value", "[data-test='\\\"test']", '<div data-test="&quot;test"></div>');
eq("escaped single quote in single quoted attr value", "[data-test='\\'test']", '<div data-test="\'test"></div>');
eq("escaped single quote in double quoted attr value", "[data-test=\"\\'test\"]", '<div data-test="\'test"></div>');
eq("multiple", "[data-test1='test1' data-test2='test2']", '<div data-test1="test1" data-test2="test2"></div>');
eq("multiple no strings", "[data-test1=test1 data-test2=test2]", '<div data-test1="test1" data-test2="test2"></div>');
eq("multiple groups", "[data-test1='test1'][data-test2='test2']", '<div data-test1="test1" data-test2="test2"></div>');
eq("empty", "[]", '<div></div>');
eq("empty value", "[data-test]", '<div data-test=""></div>');
eq("empty value before next attr", "[data-test data-test1='test1']", '<div data-test="" data-test1="test1"></div>');
eq("no space between attrs", "[data-test1='test1'data-test2='test2']", '<div data-test1="test1" data-test2="test2"></div>');
eq("new line in value", "[data-test1='tes\nt1']", '<div data-test1="tes\nt1"></div>');
eq("non-escaped \\ in string", "[data-test1='test\\1']", '<div data-test1="test\\1"></div>');
eq("non-escaped \\ in string at end of attr", "[data-test1='test\\ ]", '<div data-test1="test\\"></div>');
eq("non-escaped \\ not in string", "[data-test1=test\\1]", '<div data-test1="test\\1"></div>');
eq("non-escaped \\ not in string at end of attr", "[data-test1=test\\ ]", '<div data-test1="test\\"></div>');
eq("escaped ]", "[data-test1='test1\\]']", '<div data-test1="test1]"></div>');
eq("escaped ] no quotes", "[data-test1=test1\\]]", '<div data-test1="test1]"></div>');
eq("escaped \\", "[data-test1='test1\\\\']", '<div data-test1="test1\\"></div>');
eq("escaped \\ no quotes", "[data-test1=test1\\\\]", '<div data-test1="test1\\"></div>');
eq("escaped \\ and ]", "[data-test1='test1\\\\\\]']", '<div data-test1="test1\\]"></div>');
eq("escaped \\ and ] no quotes", "[data-test1=test1\\\\\\]]", '<div data-test1="test1\\]"></div>');
err("non-escaped \\ at end of attr missing ]", "[data-test1=test\\", "missing ']' at end of attributes token");
err("missing ]", "[data-test1=test", "missing ']' at end of attributes token");
err("invalid name char after empty attr", "[data-test1 :data-test]", "':' is not a valid attribute name character");
err("invalid name char", "[d:ata-test]", "':' is not a valid attribute name character");
err("invalid name char", "[:data-test]", "':' is not a valid attribute name character");

QUnit.module("text");
eq("regular", "{test}", '<div>test</div>');
eq("multiple", "{multiple}{ tests}", '<div>multiple tests</div>');
eq("escaped }", "{test\\}}", '<div>test}</div>');
eq("escaped \\", "{test\\\\}", '<div>test\\</div>');
eq("non-escaped \\", "{test\\1}", '<div>test\\1</div>');
eq("new line", "{te\nst}", '<div>te\nst</div>');
eq("spaces around", "{ test }", '<div> test </div>');
err("non-escaped \\ at end of text missing }", "{test\\", "missing '}' at end of text token");
err("missing }", "{test", "missing '}' at end of text token");

QUnit.module("typical");
eq("usual", "span#test.t1.t2[data-test1='test1' data-test2='test2']{text}", '<span id="test" class="t1 t2" data-test1="test1" data-test2="test2">text</span>');
eq("checkbox", "input#id.class[type='checkbox' name='name' checked]", '<input id="id" class="class" type="checkbox" name="name" checked="checked">');
eq("space between tokens", "input #id .class [type='checkbox' name='name' checked]", '<input id="id" class="class" type="checkbox" name="name" checked="checked">');

QUnit.module("advanced");
QUnit.test("append el", function (assert) {
	var actual = $("<div/>").el("span").parent()[0].outerHTML;
	var expected = "<div><span></span></div>";
	assert.deepEqual(actual, expected, "$('<div/>').el('span').parent()[0].outerHTML\nActual: " + JSON.stringify(actual) + "\nExpected: " + JSON.stringify(expected));
});
QUnit.test("return parent", function (assert) {
	var actual = $.el().el("span", true)[0].outerHTML;
	var expected = "<div><span></span></div>";
	assert.deepEqual(actual, expected, "$.el().el('span', true)[0].outerHTML\nActual: " + JSON.stringify(actual) + "\nExpected: " + JSON.stringify(expected));
});

// test time if all other tests pass
var done = false;
QUnit.done(function (details) {
	if (!done && details.failed === 0) {
		done = true;
		QUnit.module("time");
		QUnit.test("$.el 10000 times", function (assert) {
			for (var i = 0; i < 10000; i++) {
				// eslint-disable-next-line no-unused-vars
				var $input = $.el("textarea#text.text[data-text='text' disabled]{text}");
			}
			assert.ok(true, "var $input = $.el(\"textarea#text.text[data-text='text' disabled]{text}\");");
		});
		QUnit.test("document.el 10000 times", function (assert) {
			for (var i = 0; i < 10000; i++) {
				// eslint-disable-next-line no-unused-vars
				var $input = $(document.el("textarea#text.text[data-text='text' disabled]{text}"));
			}
			assert.ok(true, "var $input = document.el(\"textarea#text.text[data-text='text' disabled]{text}\");");
		});
		QUnit.test("jquery 10000 times", function (assert) {
			for (let i = 0; i < 10000; i++) {
				// eslint-disable-next-line no-unused-vars
				var $input = $("<textarea />")
					.attr({
						id: "text",
						"data-text": "text"
					})
					.addClass("text")
					.prop({
						disabled: true
					})
					.text("text");
			}
			assert.ok(true,
				"var $input = $(\"<textarea />\")\n" +
					" .attr({\n" +
					"   id: \"text\",\n" +
					"   \"data-text\": \"text\"\n" +
					" })\n" +
					" .addClass(\"text\")\n" +
					" .prop({\n" +
					"   disabled: true\n" +
					" })\n" +
					" .text(\"text\");");
		});
		QUnit.test("dom 10000 times", function (assert) {
			for (let i = 0; i < 10000; i++) {
				var input = document.createElement("input");
				input.setAttribute("id", "text");
				input.setAttribute("data-text", "text");
				input.className = "text";
				input.setAttribute("disabled", "disabled");
				input.textContent = "text";
				// eslint-disable-next-line no-unused-vars
				var $input = $(input);
			}
			assert.ok(true,
				"var input = document.createElement(\"input\");\n" +
					"input.setAttribute(\"id\", \"text\");\n" +
					"input.setAttribute(\"data-text\", \"text\");\n" +
					"input.className = \"text\";\n" +
					"input.setAttribute(\"disabled\", \"disabled\");\n" +
					"input.textContent = \"text\";\n" +
					"var $input = $(input);");
		});
	}
});

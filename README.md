# jquery.el.js

Create HTML elements with css syntax

## Introduction

This is meant to be an easy way to create/append elements with jquery

### Create Element

Using regular jQuery

```javascript
$("<div>").attr({id: "hello", "data-test": "test"}).addClass("world").text("!").prop({contentEditable: true});
```

Using $.el

```javascript
$.el("#hello.world[data-test='test' contentEditable]{!}");
```

### Append Element

Using regular jQuery

```javascript
var $table = $("<table />").attr({id: "table1"});
var $thead = $("<thead />").appendTo($table);
var $row1 = $("<tr />").addClass("row1").appendTo($thead);
$("<th />").addClass("col1").text("1").appendTo($row1);
$("<th />").addClass("col2").text("2").appendTo($row1);
var $tbody = $("<tbody />").appendTo($table);
var $row2 = $("<tr />").addClass("row2").appendTo($tbody);
$("<td />").addClass("col1").text("3").appendTo($row2);
$("<td />").addClass("col2").text("4").appendTo($row2);
```

Using $.el

```javascript
var $table = $.el("table#table1");
var $thead = $table.el("thead");
var $row1 = $thead.el("tr.row1");
$row1.el("th.col1{1}");
$row1.el("th.col2{2}");
var $tbody = $table.el("tbody");
var $row2 = $tbody.el("tr.row2");
$row2.el("td.col1{3}");
$row2.el("td.col2{4}");
```

1 | 2
- | -
3 | 4

## Usage

### Tag

The tag must be specified at the beginning of the string otherwise `div` is assumed.

```javascript
// <div></div>
$.el();

// <span></span>
$.el("span");
```

### ID

The ID must be preceded by a `#`. There may be at most one ID specified.

```javascript
// <div id="id"></div>
$.el("#id");
```

### Classes

A Class must be preceded by a `.`. There may be multiple classes specified.

```javascript
// <div class="class1 class2"></div>
$.el(".class1.class2");
```

### Attributes

Attributes must be surrounded by `[]`. There may be multiple attributes in one group or multiple attribute groups.

```javascript
// <div data-test1="test1" data-test2="test2"></div>
$.el("[data-test1='test1' data-test2='test2']");

// <div data-test1="test1" data-test2="test2"></div>
$.el("[data-test1='test1'][data-test2='test2']");
```

### Text

Text must be surrounded by `{}`. Multiple text nodes will be appended.

```javascript
// <div>Hello World!</div>
$.el("{Hello}{ World!}");
```

### Return Parent

When chaining .el by default it returns the newly created element. There is a second argument `returnParent` that will return the parent of the newly created element to allow creating siblings easily.

```javascript
// <table><tbody><tr><td>1</td><td>2</td></tr></tbody></table>
$.el("table").el("tbody").el("tr").el("td{1}", true).el("td{2}");
```

### Advanced

You can use these in any order with the exception of the tag which, if specified, must be specified first.

```javascript
// <label for="checkme">Check This <input id="checkme" class="check" type="checkbox" name="checkme" checked="checked" /></label>
$.el("label[for='checkme']{Check This }").el("input#checkme.check[type='checkbox' name='checkme' checked]", true);
```

## Tests

[Run Tests](https://rawgit.com/UziTech/jquery.el.js/master/tests/?coverage)

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
var $table = $("<table>").attr({id: "table1"});
var $thead = $("thead").appendTo($table);
var $row1 = $("<tr>").addClass("row1").appendTo($thead);
$("<th>").addClass("col1").text("1").appendTo($row1);
$("<th>").addClass("col2").text("2").appendTo($row1);
var $tbody = $("tbody").appendTo($table);
var $row2 = $("<tr>").addClass("row2").appendTo($tbody);
$("<td>").addClass("col1").text("3").appendTo($row2);
$("<td>").addClass("col2").text("4").appendTo($row2);
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

| 1 | 2 |
|---|---|
| 3 | 4 |

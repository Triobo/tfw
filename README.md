## Classes

<dl>
<dt><a href="#tfw">tfw</a></dt>
<dd></dd>
<dt><a href="#prvek">prvek</a></dt>
<dd></dd>
<dt><del><a href="#Dyntable">Dyntable</a></del></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#AJAX_LOADER">AJAX_LOADER</a> : <code>string</code></dt>
<dd><p>HTML to show when some content is being loaded.</p>
</dd>
</dl>

<a name="tfw"></a>
## tfw
**Kind**: global class  

* [tfw](#tfw)
    * [new tfw()](#new_tfw_new)
    * [.dynamicTable](#tfw.dynamicTable)
        * [new dynamicTable(param)](#new_tfw.dynamicTable_new)
        * _instance_
            * [.myDiv](#tfw.dynamicTable+myDiv) : <code>Object</code>
            * [.url](#tfw.dynamicTable+url) : <code>string</code>
            * [.data](#tfw.dynamicTable+data) : <code>Object</code>
            * [.rowEdit](#tfw.dynamicTable+rowEdit) : <code>[rowEdit](#tfw.dynamicTable..rowEdit)</code>
            * [.ascSortingSymbol](#tfw.dynamicTable+ascSortingSymbol) : <code>string</code>
            * [.descSortingSymbol](#tfw.dynamicTable+descSortingSymbol) : <code>string</code>
            * [.labelTrue](#tfw.dynamicTable+labelTrue) : <code>string</code>
            * [.labelFalse](#tfw.dynamicTable+labelFalse) : <code>string</code>
            * [.create()](#tfw.dynamicTable+create) ⇒ <code>Object</code>
            * [.reload()](#tfw.dynamicTable+reload)
            * [.paint()](#tfw.dynamicTable+paint)
            * [.sort(event)](#tfw.dynamicTable+sort)
            * [.filterSearch(column, value, searchType)](#tfw.dynamicTable+filterSearch)
            * [.filterBoolean(column, value)](#tfw.dynamicTable+filterBoolean)
            * [.filterNumeric(column, compareValue, cmp)](#tfw.dynamicTable+filterNumeric)
            * [.toggleColumn(column)](#tfw.dynamicTable+toggleColumn)
        * _inner_
            * [~rowEdit](#tfw.dynamicTable..rowEdit) : <code>function</code>
            * [~ajaxGet](#tfw.dynamicTable..ajaxGet) ⇒ <code>Object</code>
    * [.fillElemDefs(element, params)](#tfw.fillElemDefs)
    * [.select(params)](#tfw.select) ⇒ <code>Object</code>
    * [.button(params)](#tfw.button) ⇒ <code>Object</code>
    * [.inputFieldLegend(element, params)](#tfw.inputFieldLegend) ⇒ <code>Object</code>
    * [.input(params)](#tfw.input) ⇒ <code>Object</code>
    * [.textArea(params)](#tfw.textArea) ⇒ <code>Object</code>
    * [.checkbox(params)](#tfw.checkbox) ⇒ <code>Object</code>
    * [.icon(params)](#tfw.icon) ⇒ <code>Object</code>
    * [.table(params)](#tfw.table) ⇒ <code>Object</code>
    * [.tr(params)](#tfw.tr) ⇒ <code>Object</code>
    * [.td(params)](#tfw.td) ⇒ <code>Object</code>
    * [.slider(params)](#tfw.slider) ⇒ <code>Object</code>
    * [.decodeJSON(json)](#tfw.decodeJSON) ⇒ <code>Object</code>

<a name="new_tfw_new"></a>
### new tfw()
Triobo framework. This is a singleton (a single "instance" of a "class").

<a name="tfw.dynamicTable"></a>
### tfw.dynamicTable
**Kind**: static class of <code>[tfw](#tfw)</code>  
**Todo**

- [ ] Use tfw.calendar
- [ ] Implement date filter (calendar range)
- [ ] View preferences (width?, order of columns)
- [ ] Allow editing of simple cells


* [.dynamicTable](#tfw.dynamicTable)
    * [new dynamicTable(param)](#new_tfw.dynamicTable_new)
    * _instance_
        * [.myDiv](#tfw.dynamicTable+myDiv) : <code>Object</code>
        * [.url](#tfw.dynamicTable+url) : <code>string</code>
        * [.data](#tfw.dynamicTable+data) : <code>Object</code>
        * [.rowEdit](#tfw.dynamicTable+rowEdit) : <code>[rowEdit](#tfw.dynamicTable..rowEdit)</code>
        * [.ascSortingSymbol](#tfw.dynamicTable+ascSortingSymbol) : <code>string</code>
        * [.descSortingSymbol](#tfw.dynamicTable+descSortingSymbol) : <code>string</code>
        * [.labelTrue](#tfw.dynamicTable+labelTrue) : <code>string</code>
        * [.labelFalse](#tfw.dynamicTable+labelFalse) : <code>string</code>
        * [.create()](#tfw.dynamicTable+create) ⇒ <code>Object</code>
        * [.reload()](#tfw.dynamicTable+reload)
        * [.paint()](#tfw.dynamicTable+paint)
        * [.sort(event)](#tfw.dynamicTable+sort)
        * [.filterSearch(column, value, searchType)](#tfw.dynamicTable+filterSearch)
        * [.filterBoolean(column, value)](#tfw.dynamicTable+filterBoolean)
        * [.filterNumeric(column, compareValue, cmp)](#tfw.dynamicTable+filterNumeric)
        * [.toggleColumn(column)](#tfw.dynamicTable+toggleColumn)
    * _inner_
        * [~rowEdit](#tfw.dynamicTable..rowEdit) : <code>function</code>
        * [~ajaxGet](#tfw.dynamicTable..ajaxGet) ⇒ <code>Object</code>

<a name="new_tfw.dynamicTable_new"></a>
#### new dynamicTable(param)
Class for creating dynamic tables.

**Returns**: <code>Object</code> - Returns an object instance.  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>string</code> | table name (not used yet) |

**Example**  
```js
function myRowEditFunction(order){	// ...}var table = tfw.dynamicTable();document.body.appendChild(table.create());table.url = "action=download&id=8"; //optionaltable.rowEdit = myRowEditFunction; //optionaltable.reload();
```
<a name="tfw.dynamicTable+myDiv"></a>
#### dynamicTable.myDiv : <code>Object</code>
DIV containing the table.

**Kind**: instance property of <code>[dynamicTable](#tfw.dynamicTable)</code>  
**Default**: <code>null</code>  
**Read only**: true  
<a name="tfw.dynamicTable+url"></a>
#### dynamicTable.url : <code>string</code>
URL parameters (appended to URL after the quotation mark "?") in the form "name1=value1&name2=value2". Has to be set before calling [reload()](#tfw.dynamicTable+reload).

**Kind**: instance property of <code>[dynamicTable](#tfw.dynamicTable)</code>  
**Default**: <code>&quot;null&quot;</code>  
**Access:** public  
<a name="tfw.dynamicTable+data"></a>
#### dynamicTable.data : <code>Object</code>
Data obtained from server. [reload()](#tfw.dynamicTable+reload) has to be called to fill this.

**Kind**: instance property of <code>[dynamicTable](#tfw.dynamicTable)</code>  
**Default**: <code>null</code>  
**Access:** public  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| cols | <code>Array.&lt;Object&gt;</code> |  | list of columns |
| cols[].n | <code>string</code> |  | HTML content (innerHTML) |
| cols[].w | <code>number</code> |  | width |
| cols[].h | <code>boolean</code> |  | hidden |
| cols[].type | <code>string</code> | <code>null</code> | type of field, possible values: null (general), "text", "number", "date" |
| cols[].sort | <code>boolean</code> | <code>false</code> | whether to allow sorting by this column's values |
| cols[].search | <code>number</code> | <code>0</code> | whether to allow searching, 0=disabled, 1=match from beginning, 2=match anywhere |
| cols[].filter | <code>boolean</code> | <code>false</code> | whether to allow filtering (depends on type) |
| rows | <code>Array.&lt;Object&gt;</code> |  | list of rows |
| rows[].id | <code>number</code> |  | row ID |
| rows[].cols | <code>Array.&lt;string&gt;</code> |  | contents for each column (HTML) |

<a name="tfw.dynamicTable+rowEdit"></a>
#### dynamicTable.rowEdit : <code>[rowEdit](#tfw.dynamicTable..rowEdit)</code>
Function that is fired when row editing is triggered.

**Kind**: instance property of <code>[dynamicTable](#tfw.dynamicTable)</code>  
**Default**: <code>null</code>  
**Access:** public  
<a name="tfw.dynamicTable+ascSortingSymbol"></a>
#### dynamicTable.ascSortingSymbol : <code>string</code>
Ascending sorting symbol.

**Kind**: instance constant of <code>[dynamicTable](#tfw.dynamicTable)</code>  
**Default**: <code>&quot;&amp;darr;&quot;</code>  
<a name="tfw.dynamicTable+descSortingSymbol"></a>
#### dynamicTable.descSortingSymbol : <code>string</code>
Descending sorting symbol.

**Kind**: instance constant of <code>[dynamicTable](#tfw.dynamicTable)</code>  
**Default**: <code>&quot;&amp;uarr;&quot;</code>  
<a name="tfw.dynamicTable+labelTrue"></a>
#### dynamicTable.labelTrue : <code>string</code>
Default label for true.

**Kind**: instance constant of <code>[dynamicTable](#tfw.dynamicTable)</code>  
**Default**: <code>&quot;Yes&quot;</code>  
<a name="tfw.dynamicTable+labelFalse"></a>
#### dynamicTable.labelFalse : <code>string</code>
Default label for false.

**Kind**: instance constant of <code>[dynamicTable](#tfw.dynamicTable)</code>  
**Default**: <code>&quot;No&quot;</code>  
<a name="tfw.dynamicTable+create"></a>
#### dynamicTable.create() ⇒ <code>Object</code>
Create a dynamic table.

**Kind**: instance method of <code>[dynamicTable](#tfw.dynamicTable)</code>  
**Returns**: <code>Object</code> - Returns the value of [myDiv()](#tfw.dynamicTable+myDiv) - a "loading" DIV (with content defined by [AJAX_LOADER](#AJAX_LOADER)).  
<a name="tfw.dynamicTable+reload"></a>
#### dynamicTable.reload()
Reload (or load) data from server.Sends a GET request to "data.php", decodes JSON and [paints](#tfw.dynamicTable+paint) the table.A global function [ajaxGet](#tfw.dynamicTable..ajaxGet) must be defined.

**Kind**: instance method of <code>[dynamicTable](#tfw.dynamicTable)</code>  
**See**

- tfw.dynamicTable#paint
- tfw.decodeJSON

**Todo**

- [ ] Don't repaint table, just change values.

<a name="tfw.dynamicTable+paint"></a>
#### dynamicTable.paint()
Refresh the content of the table using data gotten by (re)loading.Empties the table and recreates it using [data](#tfw.dynamicTable+data).If [rowEdit](#tfw.dynamicTable+rowEdit) is set, it will be fired when a row is clicked.

**Kind**: instance method of <code>[dynamicTable](#tfw.dynamicTable)</code>  
**Todo**

- [ ] Localize
- [ ] Think about using different IDs for rows (e.g. add a prefix)

<a name="tfw.dynamicTable+sort"></a>
#### dynamicTable.sort(event)
Apply sorting by values (text without HTML) of a column.Inspired by ProGM's solution from [Stack Exchange](http://codereview.stackexchange.com/questions/37632/sorting-an-html-table-with-javascript)Overrides style attribute of TR elements inside TBODY.

**Kind**: instance method of <code>[dynamicTable](#tfw.dynamicTable)</code>  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | Event object |

<a name="tfw.dynamicTable+filterSearch"></a>
#### dynamicTable.filterSearch(column, value, searchType)
Apply search filter (case insensitive).Requires .searchFilterInvalid{display:none}

**Kind**: instance method of <code>[dynamicTable](#tfw.dynamicTable)</code>  

| Param | Type | Description |
| --- | --- | --- |
| column | <code>number</code> | order number of searched column |
| value | <code>string</code> | searched string |
| searchType | <code>number</code> | type of search |

<a name="tfw.dynamicTable+filterBoolean"></a>
#### dynamicTable.filterBoolean(column, value)
Apply boolean filter.Requires .booleanFilterInvalid{display:none}

**Kind**: instance method of <code>[dynamicTable](#tfw.dynamicTable)</code>  

| Param | Type | Description |
| --- | --- | --- |
| column | <code>number</code> | order number of searched column |
| value | <code>string</code> | searched string |

<a name="tfw.dynamicTable+filterNumeric"></a>
#### dynamicTable.filterNumeric(column, compareValue, cmp)
Apply numeric filter.Requires .numericFilterInvalid1, .numericFilterInvalid-1{display:none}

**Kind**: instance method of <code>[dynamicTable](#tfw.dynamicTable)</code>  

| Param | Type | Description |
| --- | --- | --- |
| column | <code>number</code> | order number of searched column |
| compareValue | <code>number</code> | value to compare to |
| cmp | <code>number</code> | type of comparison (1 means greater than, -1 means lower than) |

<a name="tfw.dynamicTable+toggleColumn"></a>
#### dynamicTable.toggleColumn(column)
Toggle visibility of a column. Only hides TDs in TBODY and THs.Requires .hideColumn{display:none}

**Kind**: instance method of <code>[dynamicTable](#tfw.dynamicTable)</code>  
**Todo**

- [ ] Save user preferences (to localStorage/server)


| Param | Type | Description |
| --- | --- | --- |
| column | <code>number</code> | order number of column |

<a name="tfw.dynamicTable..rowEdit"></a>
#### dynamicTable~rowEdit : <code>function</code>
Function that handles row editing.

**Kind**: inner typedef of <code>[dynamicTable](#tfw.dynamicTable)</code>  

| Param | Type | Description |
| --- | --- | --- |
| order | <code>number</code> | order of the row being edited |

<a name="tfw.dynamicTable..ajaxGet"></a>
#### dynamicTable~ajaxGet ⇒ <code>Object</code>
Send a GET request to server (handle errors).

**Kind**: inner typedef of <code>[dynamicTable](#tfw.dynamicTable)</code>  
**Returns**: <code>Object</code> - The XMLHttpRequest object after sending the request.  
**See**: desktop  

| Param | Type | Description |
| --- | --- | --- |
| urlWithoutQueryString | <code>string</code> | URL (can be relative) of data source (e. g. PHP script) |
| urlParameters | <code>string</code> | URL parameters (appended to URL after the quotation mark "?") in the form "name1=value1&name2=value2" |
| callback | <code>function</code> | callback function that handles the XMLHttpRequest object (only in case of success) |
| darken | <code>number</code> | whether to call desktop.working(), if set to 2, 1 is passed as parameter, 0 otherwise |

<a name="tfw.fillElemDefs"></a>
### tfw.fillElemDefs(element, params)
Set parameters of a HTML element.

**Kind**: static method of <code>[tfw](#tfw)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| element | <code>Object</code> |  | HTML element |
| params | <code>Object</code> |  | parameters object |
| [params.id] | <code>string</code> |  | ID |
| [params.className] | <code>string</code> |  | class |
| [params.innerHTML] | <code>string</code> |  | content (HTML) |
| [params.text] | <code>string</code> |  | content (text), works same as innerHTML |
| [params.style] | <code>string</code> |  | CSS styling |
| [params.title] | <code>string</code> |  | title (shows on hover) |
| [params.children] | <code>Array.&lt;Object&gt;</code> |  | descendant element(s) |
| [params.disabled] | <code>boolean</code> | <code>false</code> | disabled input field |
| [params.maxLength] | <code>number</code> |  | maximum input length |
| [params.evaluate] | <code>boolean</code> | <code>false</code> | evaluate (eval) field value after change (onchange), set to 1 or true |
| [params.onchange] | <code>function</code> |  | function to call when field changes value (onchange fires) |
| [params.onClick] | <code>function</code> |  | function to call when user clicks on the field (onclick fires) |
| [params.value] | <code>string</code> |  | default field value (or button text) |
| [params.placeholder] | <code>string</code> |  | text field placeholder |

<a name="tfw.select"></a>
### tfw.select(params) ⇒ <code>Object</code>
Create a select field with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>Object</code> - Created select field (HTML element).  
**See**: tfw.fillElemDefs  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | select parameters (for more see [fillElemDefs](#tfw.fillElemDefs)) |
| [params.multiple] | <code>boolean</code> | can multiple values be selected |
| params.list | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> &#124; <code>Array.&lt;Object&gt;</code> | list of options as string "label1;label2" or "label1|value1;label2|value2", as array of string labels or as object (nonspecified value defaults to numeric index, NOT label text) |
| [params.list[].id] | <code>string</code> | value (defaults to numeric index of option) |
| params.list[].t | <code>string</code> | label |

<a name="tfw.button"></a>
### tfw.button(params) ⇒ <code>Object</code>
Create a button with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>Object</code> - Created button (HTML element)  
**See**: tfw.fillElemDefs  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  | button parameters (for more see [fillElemDefs](#tfw.fillElemDefs)) |
| [params.step] | <code>number</code> |  | step between allowed numeric values |
| [params.default] | <code>boolean</code> | <code>false</code> | if true, type=submit, otherwise type=button |
| [params.action] | <code>function</code> |  | Function to fire when button is clicked (event propagation is stopped) |

<a name="tfw.inputFieldLegend"></a>
### tfw.inputFieldLegend(element, params) ⇒ <code>Object</code>
Wrap an input field with a legend and a container.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>Object</code> - container with legend and input field (HTML element)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Object</code> | input field HTML element |
| params | <code>Object</code> | legend parameters |
| params.legend | <code>string</code> | legend text |
| [params.legendStyle] | <code>string</code> | legend CSS styling |
| [params.containerId] | <code>string</code> | legend container ID |
| [params.containerStyle] | <code>string</code> | legend container CSS styling |
| [params.postText] | <code>string</code> | text after input field |

<a name="tfw.input"></a>
### tfw.input(params) ⇒ <code>Object</code>
Create an input field with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>Object</code> - Created input field (HTML element)  
**See**

- tfw.fillElemDefs
- tfw.inputFieldLegend


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  | input fields parameters (for more see [fillElemDefs](#tfw.fillElemDefs) and [inputFieldLegend](#tfw.inputFieldLegend)) |
| [params.type] | <code>string</code> | <code>&quot;\&quot;text\&quot;&quot;</code> | input field type |
| [params.value] | <code>string</code> |  | prefilled value |
| [params.min] | <code>number</code> |  | minimum allowed value |
| [params.max] | <code>number</code> |  | maximum allowed value |
| [params.step] | <code>number</code> |  | step between allowed numeric values |

<a name="tfw.textArea"></a>
### tfw.textArea(params) ⇒ <code>Object</code>
Create a text area with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>Object</code> - Created text area (HTML element)  
**See**

- tfw.fillElemDefs
- tfw.inputFieldLegend


| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | text area parameters (for more see [fillElemDefs](#tfw.fillElemDefs) and [inputFieldLegend](#tfw.inputFieldLegend)) |
| [params.value] | <code>string</code> | prefilled value |

<a name="tfw.checkbox"></a>
### tfw.checkbox(params) ⇒ <code>Object</code>
Create a checkbox with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>Object</code> - Created checkbox (HTML element)  
**See**

- tfw.fillElemDefs
- tfw.inputFieldLegend

**Todo**

- [ ] Use "value" for real value, instead of using it for "checked"


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  | checkbox parameters (for more see [fillElemDefs](#tfw.fillElemDefs) and [inputFieldLegend](#tfw.inputFieldLegend)) |
| [params.onchange] | <code>function</code> |  | function to call when field changes value (onchange fires) |
| [params.text] | <code>string</code> |  | checkbox label text |
| [params.value] | <code>string</code> | <code>0</code> | initial value (0=unchecked,1=checked) |

<a name="tfw.icon"></a>
### tfw.icon(params) ⇒ <code>Object</code>
Create an icon with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>Object</code> - Created icon (HTML element)  
**See**: tfw.fillElemDefs  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | icon parameters (for more see [fillElemDefs](#tfw.fillElemDefs)) |
| [params.action] | <code>function</code> | function triggered when icon is clicked (basically onclick) |
| [params.index] | <code>number</code> | move background image up by this number of pixels (background-position-x) |

<a name="tfw.table"></a>
### tfw.table(params) ⇒ <code>Object</code>
Create a table with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>Object</code> - Created table (HTML element)  
**See**: tfw.fillElemDefs  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | table parameters (for more see [fillElemDefs](#tfw.fillElemDefs), use params.children for rows) |

<a name="tfw.tr"></a>
### tfw.tr(params) ⇒ <code>Object</code>
Create a table row with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>Object</code> - Created table row (HTML element)  
**See**: tfw.fillElemDefs  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | table row parameters (for more see [fillElemDefs](#tfw.fillElemDefs), use params.children for columns/cells) |
| [params.columns] | <code>Array</code> | list of objects, that will be passed to tfw.td and added as children |

<a name="tfw.td"></a>
### tfw.td(params) ⇒ <code>Object</code>
Create a table cell with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>Object</code> - Created table cell (HTML element)  
**See**: tfw.fillElemDefs  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | table cell parameters (for more see [fillElemDefs](#tfw.fillElemDefs)) |
| [params.colspan] | <code>number</code> | number of columns that this cell will merge |

<a name="tfw.slider"></a>
### tfw.slider(params) ⇒ <code>Object</code>
Create a slider with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>Object</code> - Created slider (HTML element)  
**See**: tfw.fillElemDefs  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  | slider parameters (for more see [fillElemDefs](#tfw.fillElemDefs)) |
| params.id | <code>string</code> |  | ID, has to be present! |
| [params.legend] | <code>string</code> |  | legend text |
| [params.legendStyle] | <code>string</code> |  | legend CSS styling |
| [params.min] | <code>number</code> | <code>0</code> | minimum (smallest) value |
| [params.max] | <code>number</code> | <code>100</code> | maximum (largest) value |
| [params.step] | <code>number</code> |  | step between allowed values |
| [params.width] | <code>string</code> |  | width of slider (CSS, including unit) |
| [params.valueStyle] | <code>string</code> |  | value box CSS styling |
| [params.postText] | <code>string</code> |  | text after slider |

<a name="tfw.decodeJSON"></a>
### tfw.decodeJSON(json) ⇒ <code>Object</code>
Decode JSON data, show error in case they are invalid.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>Object</code> - Object that was encoded in given JSON string.  

| Param | Type | Description |
| --- | --- | --- |
| json | <code>string</code> | JSON encoded data |

<a name="prvek"></a>
## prvek
**Kind**: global class  

* [prvek](#prvek)
    * [new prvek()](#new_prvek_new)
    * [.seznamZatrzitek()](#prvek.seznamZatrzitek)
    * ~~[.tabulka()](#prvek.tabulka)~~
    * ~~[.radek()](#prvek.radek)~~
    * ~~[.sloupec()](#prvek.sloupec)~~
    * [.soubory()](#prvek.soubory)
    * [.barva()](#prvek.barva)
    * [.barvaSLegendou()](#prvek.barvaSLegendou)

<a name="new_prvek_new"></a>
### new prvek()
Function package for preparing HTML elements.

<a name="prvek.seznamZatrzitek"></a>
### prvek.seznamZatrzitek()
**Kind**: static method of <code>[prvek](#prvek)</code>  
**Todo**

- [ ] Move to [tfw](#tfw)

<a name="prvek.tabulka"></a>
### ~~prvek.tabulka()~~
***Deprecated***

**Kind**: static method of <code>[prvek](#prvek)</code>  
**See**: tfw.table  
<a name="prvek.radek"></a>
### ~~prvek.radek()~~
***Deprecated***

**Kind**: static method of <code>[prvek](#prvek)</code>  
**See**: tfw.tr  
<a name="prvek.sloupec"></a>
### ~~prvek.sloupec()~~
***Deprecated***

**Kind**: static method of <code>[prvek](#prvek)</code>  
**See**: tfw.td  
<a name="prvek.soubory"></a>
### prvek.soubory()
**Kind**: static method of <code>[prvek](#prvek)</code>  
**Todo**

- [ ] Remove dependencies on Triobo
- [ ] Move to [tfw](#tfw)

<a name="prvek.barva"></a>
### prvek.barva()
**Kind**: static method of <code>[prvek](#prvek)</code>  
**Todo**

- [ ] Remove dependencies on Triobo
- [ ] Move to [tfw](#tfw)

<a name="prvek.barvaSLegendou"></a>
### prvek.barvaSLegendou()
**Kind**: static method of <code>[prvek](#prvek)</code>  
**Todo**

- [ ] Remove dependencies on Triobo
- [ ] Move to [tfw](#tfw)

<a name="Dyntable"></a>
## ~~Dyntable~~
***Deprecated***

**Kind**: global class  
**See**: tfw.dynamicTable  
<a name="AJAX_LOADER"></a>
## AJAX_LOADER : <code>string</code>
HTML to show when some content is being loaded.

**Kind**: global constant  

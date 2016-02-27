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
<dd><p>Used by <a href="#tfw.dynamicTable+create">create</a></p>
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
            * [.create()](#tfw.dynamicTable+create) ⇒ <code>Object</code>
            * [.reload()](#tfw.dynamicTable+reload)
            * [.paint()](#tfw.dynamicTable+paint)
            * [.sort(event)](#tfw.dynamicTable+sort)
        * _inner_
            * [~dataCol](#tfw.dynamicTable..dataCol) : <code>Object</code>
            * [~dataRow](#tfw.dynamicTable..dataRow) : <code>Object</code>
            * [~rowEdit](#tfw.dynamicTable..rowEdit) : <code>function</code>
            * [~ajaxGet](#tfw.dynamicTable..ajaxGet) ⇒ <code>Object</code>
    * [.fillElemDefs(element, params)](#tfw.fillElemDefs)
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

- [ ] Implement filter (columns with boolean - on/off/both, numbers - range, text/number - search, date - ranges)
- [ ] Use tfw.calendar
- [ ] View preferences (width, order and visibility of columns)


* [.dynamicTable](#tfw.dynamicTable)
    * [new dynamicTable(param)](#new_tfw.dynamicTable_new)
    * _instance_
        * [.myDiv](#tfw.dynamicTable+myDiv) : <code>Object</code>
        * [.url](#tfw.dynamicTable+url) : <code>string</code>
        * [.data](#tfw.dynamicTable+data) : <code>Object</code>
        * [.rowEdit](#tfw.dynamicTable+rowEdit) : <code>[rowEdit](#tfw.dynamicTable..rowEdit)</code>
        * [.ascSortingSymbol](#tfw.dynamicTable+ascSortingSymbol) : <code>string</code>
        * [.descSortingSymbol](#tfw.dynamicTable+descSortingSymbol) : <code>string</code>
        * [.create()](#tfw.dynamicTable+create) ⇒ <code>Object</code>
        * [.reload()](#tfw.dynamicTable+reload)
        * [.paint()](#tfw.dynamicTable+paint)
        * [.sort(event)](#tfw.dynamicTable+sort)
    * _inner_
        * [~dataCol](#tfw.dynamicTable..dataCol) : <code>Object</code>
        * [~dataRow](#tfw.dynamicTable..dataRow) : <code>Object</code>
        * [~rowEdit](#tfw.dynamicTable..rowEdit) : <code>function</code>
        * [~ajaxGet](#tfw.dynamicTable..ajaxGet) ⇒ <code>Object</code>

<a name="new_tfw.dynamicTable_new"></a>
#### new dynamicTable(param)
Class for creating dynamic tables.

**Returns**: <code>Object</code> - Returns an object instance.  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>string</code> | table name (not used) |

**Example**  
```js
function myRowEditFunction(order){	// ...}var table = tfw.dynamicTable();document.body.appendChild(table.create());table.url = "action=download&id=8"; //optionaltable.rowEdit = myRowEditFunction; //optionaltable.reload();
```
<a name="tfw.dynamicTable+myDiv"></a>
#### dynamicTable.myDiv : <code>Object</code>
DIV with "loading" indicator, created by [create()](tfw.DynamicTable#create).

**Kind**: instance property of <code>[dynamicTable](#tfw.dynamicTable)</code>  
**Default**: <code>null</code>  
**Access:** protected  
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

| Name | Type | Description |
| --- | --- | --- |
| cols | <code>[Array.&lt;dataCol&gt;](#tfw.dynamicTable..dataCol)</code> | list of columns |
| rows | <code>[Array.&lt;dataRow&gt;](#tfw.dynamicTable..dataRow)</code> | list of rows |

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

<a name="tfw.dynamicTable+paint"></a>
#### dynamicTable.paint()
Refresh the content of the table using data gotten by (re)loading.Empties the table and recreates it using [data](#tfw.dynamicTable+data).If [rowEdit](#tfw.dynamicTable+rowEdit) is set, it will be fired when a row is clicked.

**Kind**: instance method of <code>[dynamicTable](#tfw.dynamicTable)</code>  
<a name="tfw.dynamicTable+sort"></a>
#### dynamicTable.sort(event)
Apply sorting by values of a column.Inspired by ProGM's solution from [Stack Exchange](http://codereview.stackexchange.com/questions/37632/sorting-an-html-table-with-javascript)

**Kind**: instance method of <code>[dynamicTable](#tfw.dynamicTable)</code>  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | Event object |

<a name="tfw.dynamicTable..dataCol"></a>
#### dynamicTable~dataCol : <code>Object</code>
**Kind**: inner typedef of <code>[dynamicTable](#tfw.dynamicTable)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| n | <code>string</code> |  | HTML content (innerHTML) |
| w | <code>number</code> |  | width |
| h | <code>boolean</code> |  | hidden |
| type | <code>string</code> | <code>null</code> | type of field, possible values: null (general), "text", "number", "date" |
| sort | <code>boolean</code> | <code>false</code> | whether to allow sorting by this column's values |

<a name="tfw.dynamicTable..dataRow"></a>
#### dynamicTable~dataRow : <code>Object</code>
**Kind**: inner typedef of <code>[dynamicTable](#tfw.dynamicTable)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | row ID |
| cols | <code>Array.&lt;string&gt;</code> | contents for each column (HTML) |

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
Used by [create](#tfw.dynamicTable+create)

**Kind**: global constant  

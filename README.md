## Classes

<dl>
<dt><a href="#tfw">tfw</a></dt>
<dd></dd>
<dt><a href="#desktop">desktop</a></dt>
<dd></dd>
<dt><a href="#prvek">prvek</a></dt>
<dd></dd>
<dt><del><a href="#Dyntable">Dyntable</a></del></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#$">$(id)</a> ⇒ <code>HTMLElement</code></dt>
<dd><p>Get HTML element by ID.</p>
</dd>
</dl>

<a name="tfw"></a>

## tfw
**Kind**: global class  
**Todo**

- [ ] Replace [reserved words](http://www.w3schools.com/js/js_reserved.asp) in function names
- [ ] freeze


* [tfw](#tfw)
    * [new tfw()](#new_tfw_new)
    * _static_
        * [.dynamicTableClass](#tfw.dynamicTableClass)
            * [new dynamicTableClass(params)](#new_tfw.dynamicTableClass_new)
            * _instance_
                * [.tableContainer](#tfw.dynamicTableClass+tableContainer) : <code>Object</code>
                * [.data](#tfw.dynamicTableClass+data) : <code>Object</code>
                * [.setPreference(key, [value])](#tfw.dynamicTableClass+setPreference)
                * [.getPreference(key)](#tfw.dynamicTableClass+getPreference) ⇒ <code>Object</code>
                * [.getTable()](#tfw.dynamicTableClass+getTable) ⇒ <code>HTMLElement</code>
                * [.reload()](#tfw.dynamicTableClass+reload)
                * [.serverWatch()](#tfw.dynamicTableClass+serverWatch)
                * [.destroy()](#tfw.dynamicTableClass+destroy)
                * [.reorderEnabled()](#tfw.dynamicTableClass+reorderEnabled) ⇒ <code>boolean</code>
                * [.toggleReorder()](#tfw.dynamicTableClass+toggleReorder)
                * [.orderChange(referenceRow)](#tfw.dynamicTableClass+orderChange)
                * [.updateInput(input)](#tfw.dynamicTableClass+updateInput)
                * [.setColumnWidth(dataCol, width, [dontSave])](#tfw.dynamicTableClass+setColumnWidth)
                * [.paint([changes])](#tfw.dynamicTableClass+paint)
                * [.filter(filterElement, dataCol)](#tfw.dynamicTableClass+filter)
                * [.sort(dataCol, asc, [dontSave])](#tfw.dynamicTableClass+sort)
                * [.setActiveFilterInColumn(column, on, arrowType, [arrowBase])](#tfw.dynamicTableClass+setActiveFilterInColumn)
                * [.filterAny(dataCol, value, [searchType], [dontSave])](#tfw.dynamicTableClass+filterAny)
                * [.resetFilters()](#tfw.dynamicTableClass+resetFilters)
                * [.toggleColumn(dataCol, [dontSave])](#tfw.dynamicTableClass+toggleColumn)
                    * [~hiddenColumns](#tfw.dynamicTableClass+toggleColumn..hiddenColumns) : <code>Array.&lt;boolean&gt;</code>
                * [.toggleColumnDialog(element)](#tfw.dynamicTableClass+toggleColumnDialog)
            * _static_
                * [.placePositionedDialog](#tfw.dynamicTableClass.placePositionedDialog) : <code>function</code>
                * [.serverActions](#tfw.dynamicTableClass.serverActions) : <code>enum</code>
                * [.colCmpTypes](#tfw.dynamicTableClass.colCmpTypes) : <code>enum</code>
                * [.colTypes](#tfw.dynamicTableClass.colTypes) : <code>enum</code>
                * [.sortTypes](#tfw.dynamicTableClass.sortTypes) : <code>enum</code>
                * [.arrowTypes](#tfw.dynamicTableClass.arrowTypes) : <code>enum</code>
                * [.ROW_EDIT_WIDTH](#tfw.dynamicTableClass.ROW_EDIT_WIDTH) : <code>number</code>
                * [.serverAction](#tfw.dynamicTableClass.serverAction) : <code>Object</code>
            * _inner_
                * [~serverCall(params)](#tfw.dynamicTableClass..serverCall)
                * [~serverUpdateOrder(params)](#tfw.dynamicTableClass..serverUpdateOrder)
                * [~serverUpdateCell(params)](#tfw.dynamicTableClass..serverUpdateCell)
                * [~setActiveArrow(element, base, [on])](#tfw.dynamicTableClass..setActiveArrow)
                * [~columnRenderer](#tfw.dynamicTableClass..columnRenderer) ⇒ <code>Array.&lt;HTMLElement&gt;</code>
                * [~dataCol](#tfw.dynamicTableClass..dataCol) : <code>Object</code>
                * [~dataRow](#tfw.dynamicTableClass..dataRow) : <code>Object</code>
                * [~rowEdit](#tfw.dynamicTableClass..rowEdit) : <code>function</code>
                * [~goToSub](#tfw.dynamicTableClass..goToSub) : <code>function</code>
                * [~serverCallback](#tfw.dynamicTableClass..serverCallback) : <code>function</code>
                * [~dataChange](#tfw.dynamicTableClass..dataChange) : <code>Object</code>
                * [~filterValue](#tfw.dynamicTableClass..filterValue) : <code>string</code> &#124; <code>Object</code>
        * [.calendarExtend](#tfw.calendarExtend)
            * [new calendarExtend(input)](#new_tfw.calendarExtend_new)
            * _static_
                * [.months](#tfw.calendarExtend.months) : <code>Array.&lt;string&gt;</code>
                * [.daysShort](#tfw.calendarExtend.daysShort) : <code>Array.&lt;string&gt;</code>
                * [.placeCalendar](#tfw.calendarExtend.placeCalendar) : <code>[placeCalendar](#tfw.calendarExtend..placeCalendar)</code>
            * _inner_
                * [~completeDate(date)](#tfw.calendarExtend..completeDate) ⇒ <code>string</code>
                * [~placeCalendar](#tfw.calendarExtend..placeCalendar) : <code>function</code>
        * [.strings](#tfw.strings) : <code>enum</code>
        * [.ajaxIncludeParams](#tfw.ajaxIncludeParams) : <code>function</code>
        * [.ajaxOnErrorCode](#tfw.ajaxOnErrorCode) : <code>function</code>
        * [.ajaxOnError](#tfw.ajaxOnError) : <code>function</code>
        * [.ajaxOnDone](#tfw.ajaxOnDone) : <code>function</code>
        * [.ajaxOnAutoHide](#tfw.ajaxOnAutoHide) : <code>function</code>
        * [.AJAX_LOADER](#tfw.AJAX_LOADER) : <code>string</code>
        * [.addAll(parentNode, childNodes)](#tfw.addAll)
        * [.insertStyle(style, [tag])](#tfw.insertStyle)
        * [.init()](#tfw.init)
        * [.localize(newStrings)](#tfw.localize)
        * [.fillElemDefs(element, params)](#tfw.fillElemDefs)
        * [.select(params)](#tfw.select) ⇒ <code>HTMLElement</code>
        * ~~[.dropDown()](#tfw.dropDown)~~
        * [.button(params)](#tfw.button) ⇒ <code>HTMLElement</code>
        * [.inputFieldLegend(element, params)](#tfw.inputFieldLegend) ⇒ <code>HTMLElement</code>
        * [.input(params)](#tfw.input) ⇒ <code>HTMLElement</code>
        * [.textArea(params)](#tfw.textArea) ⇒ <code>HTMLElement</code>
        * [.checkbox(params)](#tfw.checkbox) ⇒ <code>HTMLElement</code>
        * [.icon(params)](#tfw.icon) ⇒ <code>HTMLElement</code>
        * [.table(params)](#tfw.table) ⇒ <code>HTMLElement</code>
        * [.tr(params)](#tfw.tr) ⇒ <code>HTMLElement</code>
        * [.td(params)](#tfw.td) ⇒ <code>HTMLElement</code>
        * [.slider(params)](#tfw.slider) ⇒ <code>HTMLElement</code>
        * [.image(params)](#tfw.image) ⇒ <code>HTMLElement</code>
        * [.filebox(params)](#tfw.filebox) ⇒ <code>HTMLElement</code>
        * ~~[.dialog()](#tfw.dialog)~~
        * ~~[.dialogPrepareAndDownload()](#tfw.dialogPrepareAndDownload)~~
        * [.ajaxGet(o)](#tfw.ajaxGet) ⇒ <code>XMLHttpRequest</code>
        * [.ajaxPost(o)](#tfw.ajaxPost) ⇒ <code>XMLHttpRequest</code>
        * [.encodeFormValues(fields)](#tfw.encodeFormValues) ⇒ <code>string</code>
        * [.decodeJSON(json)](#tfw.decodeJSON) ⇒ <code>Object</code>
        * ~~[.novyElement()](#tfw.novyElement)~~
        * [.noveZalozky()](#tfw.noveZalozky)
        * [.dynamicTable(params)](#tfw.dynamicTable) ⇒ <code>HTMLElement</code>
        * [.calendar(params)](#tfw.calendar) ⇒ <code>HTMLElement</code>
        * [.multiCheckbox(params)](#tfw.multiCheckbox) ⇒ <code>HTMLElement</code>
        * [.dialogPrepareAndDownload(params)](#tfw.dialogPrepareAndDownload)
    * _inner_
        * [~ajaxGetCallback](#tfw..ajaxGetCallback) : <code>function</code>

<a name="new_tfw_new"></a>

### new tfw()
Triobo framework. This is a singleton.

<a name="tfw.dynamicTableClass"></a>

### tfw.dynamicTableClass
**Kind**: static class of <code>[tfw](#tfw)</code>  
**See**: tfw.AJAX_LOADER  
**Todo**

- [ ] View preferences (order of columns)
- [ ] Custom filter renderers and custom filter functions (returning true/false if row passes/fails filter)
- [ ] freeze


* [.dynamicTableClass](#tfw.dynamicTableClass)
    * [new dynamicTableClass(params)](#new_tfw.dynamicTableClass_new)
    * _instance_
        * [.tableContainer](#tfw.dynamicTableClass+tableContainer) : <code>Object</code>
        * [.data](#tfw.dynamicTableClass+data) : <code>Object</code>
        * [.setPreference(key, [value])](#tfw.dynamicTableClass+setPreference)
        * [.getPreference(key)](#tfw.dynamicTableClass+getPreference) ⇒ <code>Object</code>
        * [.getTable()](#tfw.dynamicTableClass+getTable) ⇒ <code>HTMLElement</code>
        * [.reload()](#tfw.dynamicTableClass+reload)
        * [.serverWatch()](#tfw.dynamicTableClass+serverWatch)
        * [.destroy()](#tfw.dynamicTableClass+destroy)
        * [.reorderEnabled()](#tfw.dynamicTableClass+reorderEnabled) ⇒ <code>boolean</code>
        * [.toggleReorder()](#tfw.dynamicTableClass+toggleReorder)
        * [.orderChange(referenceRow)](#tfw.dynamicTableClass+orderChange)
        * [.updateInput(input)](#tfw.dynamicTableClass+updateInput)
        * [.setColumnWidth(dataCol, width, [dontSave])](#tfw.dynamicTableClass+setColumnWidth)
        * [.paint([changes])](#tfw.dynamicTableClass+paint)
        * [.filter(filterElement, dataCol)](#tfw.dynamicTableClass+filter)
        * [.sort(dataCol, asc, [dontSave])](#tfw.dynamicTableClass+sort)
        * [.setActiveFilterInColumn(column, on, arrowType, [arrowBase])](#tfw.dynamicTableClass+setActiveFilterInColumn)
        * [.filterAny(dataCol, value, [searchType], [dontSave])](#tfw.dynamicTableClass+filterAny)
        * [.resetFilters()](#tfw.dynamicTableClass+resetFilters)
        * [.toggleColumn(dataCol, [dontSave])](#tfw.dynamicTableClass+toggleColumn)
            * [~hiddenColumns](#tfw.dynamicTableClass+toggleColumn..hiddenColumns) : <code>Array.&lt;boolean&gt;</code>
        * [.toggleColumnDialog(element)](#tfw.dynamicTableClass+toggleColumnDialog)
    * _static_
        * [.placePositionedDialog](#tfw.dynamicTableClass.placePositionedDialog) : <code>function</code>
        * [.serverActions](#tfw.dynamicTableClass.serverActions) : <code>enum</code>
        * [.colCmpTypes](#tfw.dynamicTableClass.colCmpTypes) : <code>enum</code>
        * [.colTypes](#tfw.dynamicTableClass.colTypes) : <code>enum</code>
        * [.sortTypes](#tfw.dynamicTableClass.sortTypes) : <code>enum</code>
        * [.arrowTypes](#tfw.dynamicTableClass.arrowTypes) : <code>enum</code>
        * [.ROW_EDIT_WIDTH](#tfw.dynamicTableClass.ROW_EDIT_WIDTH) : <code>number</code>
        * [.serverAction](#tfw.dynamicTableClass.serverAction) : <code>Object</code>
    * _inner_
        * [~serverCall(params)](#tfw.dynamicTableClass..serverCall)
        * [~serverUpdateOrder(params)](#tfw.dynamicTableClass..serverUpdateOrder)
        * [~serverUpdateCell(params)](#tfw.dynamicTableClass..serverUpdateCell)
        * [~setActiveArrow(element, base, [on])](#tfw.dynamicTableClass..setActiveArrow)
        * [~columnRenderer](#tfw.dynamicTableClass..columnRenderer) ⇒ <code>Array.&lt;HTMLElement&gt;</code>
        * [~dataCol](#tfw.dynamicTableClass..dataCol) : <code>Object</code>
        * [~dataRow](#tfw.dynamicTableClass..dataRow) : <code>Object</code>
        * [~rowEdit](#tfw.dynamicTableClass..rowEdit) : <code>function</code>
        * [~goToSub](#tfw.dynamicTableClass..goToSub) : <code>function</code>
        * [~serverCallback](#tfw.dynamicTableClass..serverCallback) : <code>function</code>
        * [~dataChange](#tfw.dynamicTableClass..dataChange) : <code>Object</code>
        * [~filterValue](#tfw.dynamicTableClass..filterValue) : <code>string</code> &#124; <code>Object</code>

<a name="new_tfw.dynamicTableClass_new"></a>

#### new dynamicTableClass(params)
Class for creating dynamic tables.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  | table parameters |
| params.baseURL | <code>string</code> |  | URL of script (etc.) handling data, without query string |
| [params.urlParams] | <code>string</code> |  | general parameters appended to requests (e.g. a token) |
| [params.id] | <code>string</code> | <code>&quot;&#x27;dynamicTable&#x27;&quot;</code> | table ID (name) - required for field (cell) updates |
| [params.rowEdit] | <code>[rowEdit](#tfw.dynamicTableClass..rowEdit)</code> |  | Function fired when row editing/adding is triggered |
| [params.goToSub] | <code>[goToSub](#tfw.dynamicTableClass..goToSub)</code> |  | Function fired when moving to subordinate table is triggered |
| [params.rowAdd] | <code>boolean</code> | <code>false</code> | whether to allow adding new rows |
| [params.bodyHeight] | <code>string</code> |  | (CSS) height of table body including unit (to make header and footer always visible) |
| [params.watchChanges] | <code>boolean</code> | <code>false</code> | whether to allow [watching](#tfw.dynamicTableClass+serverWatch) for changes (long polling) |
| [params.onload] | <code>function</code> |  | function to call after data is loaded for the first time |
| [params.columnRenderers] | <code>[Array.&lt;columnRenderer&gt;](#tfw.dynamicTableClass..columnRenderer)</code> |  | functions to create custom columns' content |

**Example**  
```js
function myRowEditFunction(id){    // ...}var table = document.body.appendChild( tfw.dynamicTable(  {   id: 'table1',   baseURL: 'data.php',   urlParams: 'token=Nd5qPxH&timestamp=1234567890',   rowEdit: myRowEditFunction,   bodyHeight: '300px'  } ));
```
<a name="tfw.dynamicTableClass+tableContainer"></a>

#### dynamicTableClass.tableContainer : <code>Object</code>
DIV containing the table.

**Kind**: instance property of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Read only**: true  
<a name="tfw.dynamicTableClass+data"></a>

#### dynamicTableClass.data : <code>Object</code>
Data obtained from server. [reload()](#tfw.dynamicTableClass+reload) has to be called to fill this.Any other attributes provided by server are preserved (e.g. data.meta).

**Kind**: instance property of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Default**: <code>null</code>  
**Access:** public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cols | <code>[Array.&lt;dataCol&gt;](#tfw.dynamicTableClass..dataCol)</code> | list of columns |
| rows | <code>[Array.&lt;dataRow&gt;](#tfw.dynamicTableClass..dataRow)</code> | list of rows |

<a name="tfw.dynamicTableClass+setPreference"></a>

#### dynamicTableClass.setPreference(key, [value])
Save user's preference.

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | preference key (name) |
| [value] | <code>string</code> &#124; <code>number</code> &#124; <code>boolean</code> &#124; <code>Array</code> &#124; <code>Object</code> | preference value (any type) - if not set, preference is deleted |

<a name="tfw.dynamicTableClass+getPreference"></a>

#### dynamicTableClass.getPreference(key) ⇒ <code>Object</code>
Read user's preference.

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Returns**: <code>Object</code> - preference value (any type)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | preference key (name) |

<a name="tfw.dynamicTableClass+getTable"></a>

#### dynamicTableClass.getTable() ⇒ <code>HTMLElement</code>
Get table container (for inserting into document).

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Returns**: <code>HTMLElement</code> - Table container  
<a name="tfw.dynamicTableClass+reload"></a>

#### dynamicTableClass.reload()
Reload (or load) data from server.Loads preferences and data, then [paint](#tfw.dynamicTableClass+paint)s the table.

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**See**

- tfw.dynamicTableClass#paint
- tfw.dynamicTableClass~serverCall

<a name="tfw.dynamicTableClass+serverWatch"></a>

#### dynamicTableClass.serverWatch()
Watch for updates from the server.

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**See**: tfw.dynamicTableClass#paint  
<a name="tfw.dynamicTableClass+destroy"></a>

#### dynamicTableClass.destroy()
A "destructor" for table.Aborts all pending requests created by current table.Removes associated CSS.

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**See**: tfw.dynamicTableClass~serverCall  
<a name="tfw.dynamicTableClass+reorderEnabled"></a>

#### dynamicTableClass.reorderEnabled() ⇒ <code>boolean</code>
Test if no filters are applied and table is sorted by column of type 'order'.

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Returns**: <code>boolean</code> - True if reordering can be done, false otherwise.  
<a name="tfw.dynamicTableClass+toggleReorder"></a>

#### dynamicTableClass.toggleReorder()
Toggle reordering of rows via drag & drop.Reflects the value of a private variable set by onclick events fired with filters.Recommended CSS: tr.draggable{cursor:grab}, tr.draggable:active{cursor:grabbing}

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
<a name="tfw.dynamicTableClass+orderChange"></a>

#### dynamicTableClass.orderChange(referenceRow)
Reflect a change in order in the table.

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  

| Param | Type | Description |
| --- | --- | --- |
| referenceRow | <code>HTMLElement</code> | before which row should be the moved row placed (if null, insert at the end) |

<a name="tfw.dynamicTableClass+updateInput"></a>

#### dynamicTableClass.updateInput(input)
Updates data and sends change to server.

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**See**: tfw.dynamicTableClass~serverUpdateCell  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>HTMLElement</code> | input field in a cell of dynamic table |
| input.value | <code>string</code> | value that can be obtained |

<a name="tfw.dynamicTableClass+setColumnWidth"></a>

#### dynamicTableClass.setColumnWidth(dataCol, width, [dontSave])
Set width of a column.

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataCol | <code>number</code> |  | order of column (in data) |
| width | <code>number</code> |  | width of column in pixels |
| [dontSave] | <code>boolean</code> | <code>false</code> | don't save into preferences |

<a name="tfw.dynamicTableClass+paint"></a>

#### dynamicTableClass.paint([changes])
Refresh the content of the table using data gotten by (re)loading.Assumes that there is only 1 order column and that data is initially sorted by that column.

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Todo**

- [ ] Change checkbox value so that it's not sent back to server
- [ ] Handle update of cell that is currently being edited


| Param | Type | Description |
| --- | --- | --- |
| [changes] | <code>[Array.&lt;dataChange&gt;](#tfw.dynamicTableClass..dataChange)</code> | changes made to data (loaded by [watch](#tfw.dynamicTableClass+serverWatch)) |

<a name="tfw.dynamicTableClass+filter"></a>

#### dynamicTableClass.filter(filterElement, dataCol)
Apply filter for values of a column.Creates a [dialog](#tfw.dialog) with filter (and moves focus to input field).

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Todo**

- [ ] Change rangeMin/rangeMax/dateMin/dateMax classes + [filterAny](#tfw.dynamicTableClass+filterAny)


| Param | Type | Description |
| --- | --- | --- |
| filterElement | <code>HTMLElement</code> | element to position new layer to |
| dataCol | <code>number</code> | order of searched column (in data) |

<a name="tfw.dynamicTableClass+sort"></a>

#### dynamicTableClass.sort(dataCol, asc, [dontSave])
Apply sorting by values (text without HTML) of a column.Text fields are sorted locale aware, with empty strings always last.

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataCol | <code>number</code> |  | order of column (in data), if null sorts by IDs |
| asc | <code>[sortTypes](#tfw.dynamicTableClass.sortTypes)</code> |  | sorting type (ascending or descending) |
| [dontSave] | <code>boolean</code> | <code>false</code> | don't save into preferences |

<a name="tfw.dynamicTableClass+setActiveFilterInColumn"></a>

#### dynamicTableClass.setActiveFilterInColumn(column, on, arrowType, [arrowBase])
Set status of filter icon in a column.

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**See**: tfw.dynamicTableClass~setActiveArrow  

| Param | Type | Description |
| --- | --- | --- |
| column | <code>number</code> | column number |
| on | <code>boolean</code> | whether to toggle active on or off |
| arrowType | <code>[arrowTypes](#tfw.dynamicTableClass.arrowTypes)</code> | type of arrow |
| [arrowBase] | <code>HTMLElement</code> | base to pass to [setActiveArrow](#tfw.dynamicTableClass..setActiveArrow) (defaults to column's heading) |

<a name="tfw.dynamicTableClass+filterAny"></a>

#### dynamicTableClass.filterAny(dataCol, value, [searchType], [dontSave])
Apply any filter.

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Todo**

- [ ] Better behaviour when min and max are crossed (min > max)


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataCol | <code>number</code> |  | order number of filtered column (in data) |
| value | <code>[filterValue](#tfw.dynamicTableClass..filterValue)</code> |  | value to filter by |
| [searchType] | <code>number</code> | <code>2</code> | type of search for TEXT (1 = starts with, 2 = includes) |
| [dontSave] | <code>boolean</code> | <code>false</code> | dont save into preferences (for TEXT) |

<a name="tfw.dynamicTableClass+resetFilters"></a>

#### dynamicTableClass.resetFilters()
Reset all applied filters.

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
<a name="tfw.dynamicTableClass+toggleColumn"></a>

#### dynamicTableClass.toggleColumn(dataCol, [dontSave])
Toggle visibility of a column. Only hides cells in TBODY and THEAD.Requires .hideColumn{display:none}

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataCol | <code>number</code> |  | number of column (in data) |
| [dontSave] | <code>boolean</code> | <code>false</code> | don't save into preferences |

<a name="tfw.dynamicTableClass+toggleColumn..hiddenColumns"></a>

##### toggleColumn~hiddenColumns : <code>Array.&lt;boolean&gt;</code>
**Kind**: inner property of <code>[toggleColumn](#tfw.dynamicTableClass+toggleColumn)</code>  
<a name="tfw.dynamicTableClass+toggleColumnDialog"></a>

#### dynamicTableClass.toggleColumnDialog(element)
Toggle visibility of a column.Creates a [dialog](#tfw.dialog) with checkboxes.

**Kind**: instance method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | above which element should checkboxes be positioned |

<a name="tfw.dynamicTableClass.placePositionedDialog"></a>

#### dynamicTableClass.placePositionedDialog : <code>function</code>
Callback for showing controls.

**Kind**: static property of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
<a name="tfw.dynamicTableClass.serverActions"></a>

#### dynamicTableClass.serverActions : <code>enum</code>
Implemented server actions.

**Kind**: static enum property of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| LOAD | <code>[serverAction](#tfw.dynamicTableClass.serverAction)</code> | <code>{&quot;name&quot;:&quot;load&quot;}</code> | load all rows |
| NEW | <code>[serverAction](#tfw.dynamicTableClass.serverAction)</code> | <code>{&quot;name&quot;:&quot;new&quot;,&quot;method&quot;:&quot;POST&quot;}</code> | add new row, return ID |
| SAVE | <code>[serverAction](#tfw.dynamicTableClass.serverAction)</code> | <code>{&quot;name&quot;:&quot;savedata&quot;,&quot;method&quot;:&quot;POST&quot;}</code> | edit 1 cell (id, col) |
| CHANGE_ORDER | <code>[serverAction](#tfw.dynamicTableClass.serverAction)</code> | <code>{&quot;name&quot;:&quot;changeorder&quot;,&quot;method&quot;:&quot;POST&quot;}</code> | change order of rows - updates multiple rows |
| WATCH | <code>[serverAction](#tfw.dynamicTableClass.serverAction)</code> | <code>{&quot;name&quot;:&quot;watch&quot;}</code> | long polling |
| DELETE | <code>[serverAction](#tfw.dynamicTableClass.serverAction)</code> | <code>{&quot;name&quot;:&quot;delete&quot;,&quot;method&quot;:&quot;POST&quot;}</code> | delete row |
| PREF_GET | <code>[serverAction](#tfw.dynamicTableClass.serverAction)</code> | <code>{&quot;name&quot;:&quot;getusersettings&quot;}</code> | load user's preferences |
| PREF_SET | <code>[serverAction](#tfw.dynamicTableClass.serverAction)</code> | <code>{&quot;name&quot;:&quot;setusersettings&quot;,&quot;method&quot;:&quot;POST&quot;}</code> | save user's preferences |

<a name="tfw.dynamicTableClass.colCmpTypes"></a>

#### dynamicTableClass.colCmpTypes : <code>enum</code>
Types of column sorting.

**Kind**: static enum property of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| NUMERIC | <code>number</code> | <code>0</code> | 
| TEXT | <code>number</code> | <code>1</code> | 

<a name="tfw.dynamicTableClass.colTypes"></a>

#### dynamicTableClass.colTypes : <code>enum</code>
Types of columns (and filters).

**Kind**: static enum property of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| TEXT | <code>string</code> | <code>&quot;text&quot;</code> | 
| NUMBER | <code>string</code> | <code>&quot;number&quot;</code> | 
| CHECKBOX | <code>string</code> | <code>&quot;checkbox&quot;</code> | 
| DATE | <code>string</code> | <code>&quot;date&quot;</code> | 
| ORDER | <code>string</code> | <code>&quot;order&quot;</code> | 
| cmpType | <code>[Array.&lt;colCmpTypes&gt;](#tfw.dynamicTableClass.colCmpTypes)</code> | <code>{&quot;text&quot;:&quot;&quot;,&quot;date&quot;:&quot;&quot;,&quot;number&quot;:&quot;&quot;,&quot;checkbox&quot;:&quot;&quot;,&quot;order&quot;:&quot;&quot;}</code> | 

<a name="tfw.dynamicTableClass.sortTypes"></a>

#### dynamicTableClass.sortTypes : <code>enum</code>
Types of sorting.

**Kind**: static enum property of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| ASC | <code>number</code> | <code>1</code> | 
| DESC | <code>number</code> | <code>-1</code> | 

<a name="tfw.dynamicTableClass.arrowTypes"></a>

#### dynamicTableClass.arrowTypes : <code>enum</code>
Types of "arrows".

**Kind**: static enum property of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| FILTER | <code>string</code> | <code>&quot;filter&quot;</code> | 
| UP | <code>string</code> | <code>&quot;up&quot;</code> | 
| DOWN | <code>string</code> | <code>&quot;down&quot;</code> | 

<a name="tfw.dynamicTableClass.ROW_EDIT_WIDTH"></a>

#### dynamicTableClass.ROW_EDIT_WIDTH : <code>number</code>
Width of column with row edit icon (icon's width including padding, border, margin + cell's padding + border), in pixels

**Kind**: static property of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Default**: <code>25</code>  
**Read only**: true  
<a name="tfw.dynamicTableClass.serverAction"></a>

#### dynamicTableClass.serverAction : <code>Object</code>
**Kind**: static typedef of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | action name sent to server |
| method | <code>string</code> | <code>&quot;\&quot;GET\&quot;&quot;</code> | HTTP method to use (e.g. GET, POST) |

<a name="tfw.dynamicTableClass..serverCall"></a>

#### dynamicTableClass~serverCall(params)
Send a table-specific request to server.If table is [destroy](#tfw.dynamicTableClass+destroy)ed, pending requests are aborted.

**Kind**: inner method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**See**

- tfw.ajaxGet
- tfw.decodeJSON


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  | query parameters |
| params.action | <code>[serverActions](#tfw.dynamicTableClass.serverActions)</code> |  | server action |
| [params.callback] | <code>[serverCallback](#tfw.dynamicTableClass..serverCallback)</code> |  | callback that receives data |
| [params.parameters] | <code>string</code> | <code>null</code> | parameters to be send with the request (e.g. POST) |

<a name="tfw.dynamicTableClass..serverUpdateOrder"></a>

#### dynamicTableClass~serverUpdateOrder(params)
**Kind**: inner method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | update parameters |
| params.id | <code>number</code> | ID of edited row |
| params.neworder | <code>number</code> | new order number of edited row |

<a name="tfw.dynamicTableClass..serverUpdateCell"></a>

#### dynamicTableClass~serverUpdateCell(params)
**Kind**: inner method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | update parameters |
| params.id | <code>number</code> | ID of edited row |
| params.col | <code>number</code> | order number of edited column |
| params.value | <code>number</code> | new value |

<a name="tfw.dynamicTableClass..setActiveArrow"></a>

#### dynamicTableClass~setActiveArrow(element, base, [on])
Set active arrow (and make other arrows of same group inactive).

**Kind**: inner method of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| element | <code>HTMLElement</code> |  | arrow to make active |
| base | <code>HTMLElement</code> |  | where to search for arrows |
| [on] | <code>boolean</code> | <code>true</code> | whether to toggle active on or off |

<a name="tfw.dynamicTableClass..columnRenderer"></a>

#### dynamicTableClass~columnRenderer ⇒ <code>Array.&lt;HTMLElement&gt;</code>
Callback that creates content to insert into a custom column.

**Kind**: inner typedef of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Returns**: <code>Array.&lt;HTMLElement&gt;</code> - Return array of elements to be inserted into table cell  

| Param | Type | Description |
| --- | --- | --- |
| columnValue | <code>string</code> | value that was loaded as data from server |

<a name="tfw.dynamicTableClass..dataCol"></a>

#### dynamicTableClass~dataCol : <code>Object</code>
Object representing a column in data.

**Kind**: inner typedef of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | name (HTML) |
| width | <code>number</code> | <code>200</code> | width (in pixels) |
| hidden | <code>boolean</code> | <code>false</code> | hidden |
| type | <code>[colTypes](#tfw.dynamicTableClass.colTypes)</code> | <code></code> | type of field (string) |
| sort | <code>boolean</code> | <code>false</code> | whether to allow sorting by this column's values |
| filter | <code>boolean</code> &#124; <code>number</code> | <code>false</code> | whether to allow filtering/searching (depends on type; 1=match from beginning, 2=match anywhere) |
| subtable | <code>boolean</code> | <code>false</code> | whether this column should contain a link to subtable (handled by goToSub) |
| noresize | <code>boolean</code> | <code>false</code> | whether this column should NOT be resizable (default is resizable) |
| readonly | <code>boolean</code> | <code>false</code> | whether inputs in this column should be disabled |

<a name="tfw.dynamicTableClass..dataRow"></a>

#### dynamicTableClass~dataRow : <code>Object</code>
Object representing a row in data.

**Kind**: inner typedef of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>number</code> |  | row ID |
| cols | <code>Array.&lt;string&gt;</code> |  | contents for each column (HTML) |
| readonly | <code>boolean</code> | <code>false</code> | whether inputs in this row should be disabled |

<a name="tfw.dynamicTableClass..rowEdit"></a>

#### dynamicTableClass~rowEdit : <code>function</code>
Function that handles row editing.

**Kind**: inner typedef of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | ID of the row being edited or 0 if new row is being inserted |

<a name="tfw.dynamicTableClass..goToSub"></a>

#### dynamicTableClass~goToSub : <code>function</code>
Function that handles moving to subordinate table.

**Kind**: inner typedef of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  

| Param | Type | Description |
| --- | --- | --- |
| rowID | <code>number</code> | ID of the row being edited |
| column | <code>number</code> | order number of column in which the callback was triggered |

<a name="tfw.dynamicTableClass..serverCallback"></a>

#### dynamicTableClass~serverCallback : <code>function</code>
Function that handles data received from server.

**Kind**: inner typedef of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  

| Param | Type | Description |
| --- | --- | --- |
| receivedData | <code>Object</code> | JSON decoded data received from request |

<a name="tfw.dynamicTableClass..dataChange"></a>

#### dynamicTableClass~dataChange : <code>Object</code>
Object representing an update/insertion/deletion in data.Type of change is determined by present properties.

**Kind**: inner typedef of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | ID of row - if neither col nor cols are present, implies deletion |
| [col] | <code>number</code> | column number of updated cell (in data) - implies update |
| [value] | <code>string</code> | new value of updated cell - for change only |
| [cols] | <code>Array.&lt;string&gt;</code> | values of inserted row - implies insertion |

<a name="tfw.dynamicTableClass..filterValue"></a>

#### dynamicTableClass~filterValue : <code>string</code> &#124; <code>Object</code>
Value by which the table can be filtered.

**Kind**: inner typedef of <code>[dynamicTableClass](#tfw.dynamicTableClass)</code>  
<a name="tfw.calendarExtend"></a>

### tfw.calendarExtend
**Kind**: static class of <code>[tfw](#tfw)</code>  
**See**: tfw.calendar  
**Todo**

- [ ] freeze


* [.calendarExtend](#tfw.calendarExtend)
    * [new calendarExtend(input)](#new_tfw.calendarExtend_new)
    * _static_
        * [.months](#tfw.calendarExtend.months) : <code>Array.&lt;string&gt;</code>
        * [.daysShort](#tfw.calendarExtend.daysShort) : <code>Array.&lt;string&gt;</code>
        * [.placeCalendar](#tfw.calendarExtend.placeCalendar) : <code>[placeCalendar](#tfw.calendarExtend..placeCalendar)</code>
    * _inner_
        * [~completeDate(date)](#tfw.calendarExtend..completeDate) ⇒ <code>string</code>
        * [~placeCalendar](#tfw.calendarExtend..placeCalendar) : <code>function</code>

<a name="new_tfw.calendarExtend_new"></a>

#### new calendarExtend(input)
Class for enhancing date input fields. Requires CSS styling.If style.width is set on input, resulting input including calendar icon will have that width.If input is readonly or disabled, calendar will be too.

**Returns**: <code>HTMLElement</code> - Returns input wrapper (for inserting into DOM in case input was not inserted yet)  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>HTMLElement</code> | input field to turn into calendar field |

**Example**  
```js
var input = tfw.input({value:'2016-03-07',style:'width:200px'});document.body.appendChild(input);tfw.calendarExtend(input);
```
**Example**  
```js
tfw.calendarExtend.placeCalendar = function (cal, input){ input.parentNode.insertBefore(cal, input);}document.body.add(tfw.calendarExtend(tfw.input({value: '2016-03-07'})));
```
<a name="tfw.calendarExtend.months"></a>

#### calendarExtend.months : <code>Array.&lt;string&gt;</code>
List of months' names.

**Kind**: static property of <code>[calendarExtend](#tfw.calendarExtend)</code>  
**Default**: <code>[&quot;January&quot;,&quot;February&quot;,&quot;March&quot;,&quot;April&quot;,&quot;May&quot;,&quot;June&quot;,&quot;July&quot;,&quot;August&quot;,&quot;September&quot;,&quot;October&quot;,&quot;November&quot;,&quot;December&quot;]</code>  
<a name="tfw.calendarExtend.daysShort"></a>

#### calendarExtend.daysShort : <code>Array.&lt;string&gt;</code>
List of days' names' first two letters (beginning with Monday)

**Kind**: static property of <code>[calendarExtend](#tfw.calendarExtend)</code>  
**Default**: <code>[&quot;Mo&quot;,&quot;Tu&quot;,&quot;We&quot;,&quot;Th&quot;,&quot;Fr&quot;,&quot;Sa&quot;,&quot;Su&quot;]</code>  
<a name="tfw.calendarExtend.placeCalendar"></a>

#### calendarExtend.placeCalendar : <code>[placeCalendar](#tfw.calendarExtend..placeCalendar)</code>
Function called when a calendar widget is created.

**Kind**: static property of <code>[calendarExtend](#tfw.calendarExtend)</code>  
<a name="tfw.calendarExtend..completeDate"></a>

#### calendarExtend~completeDate(date) ⇒ <code>string</code>
Adjust date.

**Kind**: inner method of <code>[calendarExtend](#tfw.calendarExtend)</code>  
**Returns**: <code>string</code> - Date in format yyyy-mm-dd  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>string</code> | inserted date (yyyy/yyyy-mm/yyyy-mm-dd) |

<a name="tfw.calendarExtend..placeCalendar"></a>

#### calendarExtend~placeCalendar : <code>function</code>
Callback function that puts calendar widget for an input field into page.Most likely create an overlay that closes calendar when user clicks somewhere else.

**Kind**: inner typedef of <code>[calendarExtend](#tfw.calendarExtend)</code>  

| Param | Type | Description |
| --- | --- | --- |
| calendar | <code>HTMLElement</code> | calendar widget |
| input | <code>HTMLElement</code> | related input field |

<a name="tfw.strings"></a>

### tfw.strings : <code>enum</code>
Strings that are output by tfw functions. Change them for localization.

**Kind**: static enum property of <code>[tfw](#tfw)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| NO | <code>string</code> | <code>&quot;No&quot;</code> | Label for checkbox with false value. |
| YES | <code>string</code> | <code>&quot;Yes&quot;</code> | Label for checkbox with true value. |
| ALL | <code>string</code> | <code>&quot;All&quot;</code> | Word for 'all' (e.g. both true and false) |
| FROM | <code>string</code> | <code>&quot;From:&quot;</code> | Minimum input label |
| TO | <code>string</code> | <code>&quot;To:&quot;</code> | Maximum input label |
| FILTER | <code>string</code> | <code>&quot;Filter…&quot;</code> | Placeholder when searching anywhere in a string |
| HIDDEN_ROWS | <code>string</code> | <code>&quot;Hidden rows&quot;</code> | Label of hidden rows count |
| UPLOADING | <code>string</code> | <code>&quot;Uploading … %1&quot;</code> | progress during file upload |
| OR | <code>string</code> | <code>&quot;or&quot;</code> | when composing list, last OR word (f.e. jpg, png or gif) |
| EXTNOTALLOWED | <code>string</code> | <code>&quot;Only %1 files are allowed.&quot;</code> | Error, when not allowed file extension is used |

<a name="tfw.ajaxIncludeParams"></a>

### tfw.ajaxIncludeParams : <code>function</code>
Generates permanent AJAX queries parameters (e.g. tokens, anti-cache)

**Kind**: static property of <code>[tfw](#tfw)</code>  
**Default**: <code>null</code>  
<a name="tfw.ajaxOnErrorCode"></a>

### tfw.ajaxOnErrorCode : <code>function</code>
Handles error generated by server (receives error code returned by server).

**Kind**: static property of <code>[tfw](#tfw)</code>  
**Default**: <code>null</code>  
<a name="tfw.ajaxOnError"></a>

### tfw.ajaxOnError : <code>function</code>
Handles HTTP errors (HTTP codes other than 200).

**Kind**: static property of <code>[tfw](#tfw)</code>  
**Default**: <code>null</code>  
**Todo**

- [ ] Implement

<a name="tfw.ajaxOnDone"></a>

### tfw.ajaxOnDone : <code>function</code>
Fired after any finished AJAX request.

**Kind**: static property of <code>[tfw](#tfw)</code>  
**Default**: <code>null</code>  
<a name="tfw.ajaxOnAutoHide"></a>

### tfw.ajaxOnAutoHide : <code>function</code>
Fired when autohide is not 0.

**Kind**: static property of <code>[tfw](#tfw)</code>  
**Default**: <code>null</code>  
<a name="tfw.AJAX_LOADER"></a>

### tfw.AJAX_LOADER : <code>string</code>
HTML to show when some content is being loaded.

**Kind**: static constant of <code>[tfw](#tfw)</code>  
**Default**: <code>&quot;&lt;div class=\&quot;tfwDivContentLoader\&quot;&gt;&lt;span&gt;&lt;/span&gt;&lt;/div&gt;&quot;</code>  
<a name="tfw.addAll"></a>

### tfw.addAll(parentNode, childNodes)
Add multiple HTML elements.

**Kind**: static method of <code>[tfw](#tfw)</code>  

| Param | Type | Description |
| --- | --- | --- |
| parentNode | <code>HTMLElement</code> | node to append to |
| childNodes | <code>Array.&lt;HTMLElement&gt;</code> | nodes to append |

<a name="tfw.insertStyle"></a>

### tfw.insertStyle(style, [tag])
Add Javascript-generated CSS to the document.

**Kind**: static method of <code>[tfw](#tfw)</code>  

| Param | Type | Description |
| --- | --- | --- |
| style | <code>string</code> | CSS to be added |
| [tag] | <code>string</code> | identify (tag) CSS for overriding |

<a name="tfw.init"></a>

### tfw.init()
Initialization needed to run tfw functions (e.g. adds required CSS styling).Can be run multiple times (after adding localized strings).

**Kind**: static method of <code>[tfw](#tfw)</code>  
<a name="tfw.localize"></a>

### tfw.localize(newStrings)
Add new translations and re-[init](#tfw.init) tfw.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**See**: tfw.init  

| Param | Type | Description |
| --- | --- | --- |
| newStrings | <code>[strings](#tfw.strings)</code> | translated strings to be used (keys same as in [strings](#tfw.strings)) |

<a name="tfw.fillElemDefs"></a>

### tfw.fillElemDefs(element, params)
Set attributes of a HTML element.

**Kind**: static method of <code>[tfw](#tfw)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| element | <code>HTMLElement</code> |  | element to set attributes of |
| params | <code>Object</code> |  | parameters object |
| [params.id] | <code>string</code> |  | ID |
| [params.className] | <code>string</code> |  | class |
| [params.innerHTML] | <code>string</code> |  | content (HTML) |
| [params.text] | <code>string</code> |  | content (text), works same as innerHTML |
| [params.style] | <code>string</code> |  | CSS styling |
| [params.title] | <code>string</code> |  | title (shows on hover) |
| [params.children] | <code>Array.&lt;Object&gt;</code> |  | descendant element(s) |
| [params.disabled] | <code>boolean</code> | <code>false</code> | disabled input field |
| [params.readOnly] | <code>boolean</code> | <code>false</code> | read only input field |
| [params.maxLength] | <code>number</code> |  | maximum input length |
| [params.evaluate] | <code>boolean</code> | <code>false</code> | evaluate (eval) field value after change (onchange), set to 1 or true |
| [params.onchange] | <code>function</code> |  | function to call when field changes value (onchange fires) |
| [params.onClick] | <code>function</code> |  | function to call when user clicks on the field (onclick fires) |
| [params.value] | <code>string</code> |  | default field value (or button text) |
| [params.placeholder] | <code>string</code> |  | text field placeholder |

<a name="tfw.select"></a>

### tfw.select(params) ⇒ <code>HTMLElement</code>
Create a select field with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>HTMLElement</code> - Created select field.  
**See**: tfw.fillElemDefs  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | select parameters (for more see [fillElemDefs](#tfw.fillElemDefs)) |
| [params.multiple] | <code>boolean</code> | can multiple values be selected |
| params.list | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> &#124; <code>Array.&lt;Object&gt;</code> | list of options as string "label1;label2" or "label1\|value1;label2\|value2", as array of string labels or as object (nonspecified value defaults to numeric index, NOT label text) |
| [params.list[].id] | <code>string</code> | value (defaults to numeric index of option) |
| params.list[].t | <code>string</code> | label |

<a name="tfw.dropDown"></a>

### ~~tfw.dropDown()~~
***Deprecated***

Use [dropDown](#desktop.dropDown) instead.

**Kind**: static method of <code>[tfw](#tfw)</code>  
<a name="tfw.button"></a>

### tfw.button(params) ⇒ <code>HTMLElement</code>
Create a button with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>HTMLElement</code> - Created button  
**See**: tfw.fillElemDefs  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  | button parameters (for more see [fillElemDefs](#tfw.fillElemDefs)) |
| [params.step] | <code>number</code> |  | step between allowed numeric values |
| [params.default] | <code>boolean</code> | <code>false</code> | if true, type=submit, otherwise type=button |
| [params.action] | <code>function</code> |  | Function to fire when button is clicked (event propagation is stopped) |

<a name="tfw.inputFieldLegend"></a>

### tfw.inputFieldLegend(element, params) ⇒ <code>HTMLElement</code>
Wrap an input field with a legend and a container.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>HTMLElement</code> - container with legend and input field  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | input field |
| params | <code>Object</code> | legend parameters |
| params.legend | <code>string</code> | legend text |
| [params.legendStyle] | <code>string</code> | legend CSS styling |
| [params.containerId] | <code>string</code> | legend container ID |
| [params.containerStyle] | <code>string</code> | legend container CSS styling |
| [params.postText] | <code>string</code> | text after input field |

<a name="tfw.input"></a>

### tfw.input(params) ⇒ <code>HTMLElement</code>
Create an input field with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>HTMLElement</code> - Created input field, optionally wrapped with label  
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

### tfw.textArea(params) ⇒ <code>HTMLElement</code>
Create a text area with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>HTMLElement</code> - Created text area, optionally wrapped with label  
**See**

- tfw.fillElemDefs
- tfw.inputFieldLegend


| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | text area parameters (for more see [fillElemDefs](#tfw.fillElemDefs) and [inputFieldLegend](#tfw.inputFieldLegend)) |
| [params.value] | <code>string</code> | prefilled value |

<a name="tfw.checkbox"></a>

### tfw.checkbox(params) ⇒ <code>HTMLElement</code>
Create a checkbox with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>HTMLElement</code> - Created checkbox, optionally wrapped with label  
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
| [params.disabled] | <code>boolean</code> | <code>false</code> | whether checkbox should be disabled |

<a name="tfw.icon"></a>

### tfw.icon(params) ⇒ <code>HTMLElement</code>
Create an icon with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>HTMLElement</code> - Created icon  
**See**: tfw.fillElemDefs  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | icon parameters (for more see [fillElemDefs](#tfw.fillElemDefs)) |
| [params.action] | <code>function</code> | function triggered when icon is clicked (basically onclick) |
| [params.index] | <code>number</code> | move background image up by this number of pixels (background-position-x) |

<a name="tfw.table"></a>

### tfw.table(params) ⇒ <code>HTMLElement</code>
Create a table with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>HTMLElement</code> - Created table  
**See**: tfw.fillElemDefs  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | table parameters (for more see [fillElemDefs](#tfw.fillElemDefs), use params.children for rows) |

<a name="tfw.tr"></a>

### tfw.tr(params) ⇒ <code>HTMLElement</code>
Create a table row with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>HTMLElement</code> - Created table row  
**See**: tfw.fillElemDefs  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | table row parameters (for more see [fillElemDefs](#tfw.fillElemDefs), use params.children for columns/cells) |
| [params.columns] | <code>Array</code> | list of objects, that will be passed to tfw.td and added as children |

<a name="tfw.td"></a>

### tfw.td(params) ⇒ <code>HTMLElement</code>
Create a table cell with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>HTMLElement</code> - Created table cell  
**See**: tfw.fillElemDefs  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | table cell parameters (for more see [fillElemDefs](#tfw.fillElemDefs)) |
| [params.colspan] | <code>number</code> | number of columns that this cell will merge |

<a name="tfw.slider"></a>

### tfw.slider(params) ⇒ <code>HTMLElement</code>
Create a slider with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>HTMLElement</code> - Created slider  
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

<a name="tfw.image"></a>

### tfw.image(params) ⇒ <code>HTMLElement</code>
Create an image with specified parameters.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>HTMLElement</code> - Created image  
**See**: tfw.fillElemDefs  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | image parameters (for more see [fillElemDefs](#tfw.fillElemDefs)) |
| [params.src] | <code>string</code> | URL of image |
| [params.title] | <code>title</code> | image title (displays on hover) |

<a name="tfw.filebox"></a>

### tfw.filebox(params) ⇒ <code>HTMLElement</code>
Create control for uploading files (images).

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>HTMLElement</code> - Created file box, optionally wrapped with label  
**See**

- tfw.fillElemDefs
- tfw.inputFieldLegend


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  | file box parameters (for more see [fillElemDefs](#tfw.fillElemDefs) and [inputFieldLegend](#tfw.inputFieldLegend)) |
| [params.id] | <code>string</code> | <code>&quot;\&quot;filebox\&quot;&quot;</code> | ID of box |
| [params.className] | <code>string</code> | <code>&quot;\&quot;tfwFilebox\&quot;&quot;</code> | class(es) of box (tfwFilebox is always appended) |
| [params.value] | <code>number</code> | <code>0</code> |  |
| [params.text] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | text to be placed inside inner div (ignored for [fillElemDefs](#tfw.fillElemDefs)) |
| [params.filename] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | name of file (image) |
| [params.path] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | path to file (image), with trailing slash |
| [params.imgStyle] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | CSS styling for image |
| [params.onloaded] | <code>function</code> | <code></code> | callback fired when upload finishes |
| [params.onstart] | <code>function</code> | <code></code> | callback fired when upload starts |
| [params.limitExtensions] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | allowed extensions, without dot (e.g. "png|jpeg|jpg|gif") |
| [params.style] | <code>string</code> |  | CSS styling of outter and inner DIV |

<a name="tfw.dialog"></a>

### ~~tfw.dialog()~~
***Deprecated***

Use [desktop.dialog](desktop.dialog) instead.

**Kind**: static method of <code>[tfw](#tfw)</code>  
<a name="tfw.dialogPrepareAndDownload"></a>

### ~~tfw.dialogPrepareAndDownload()~~
***Deprecated***

Use [desktop.dialogPrepareAndDownload](desktop.dialogPrepareAndDownload) instead.

**Kind**: static method of <code>[tfw](#tfw)</code>  
<a name="tfw.ajaxGet"></a>

### tfw.ajaxGet(o) ⇒ <code>XMLHttpRequest</code>
Get data from server via AJAX.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>XMLHttpRequest</code> - Returns XMLHttpRequest object  
**See**

- tfw.ajaxIncludeParams
- tfw.ajaxOnErrorCode
- tfw.ajaxOnError


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| o | <code>Object</code> |  | parameters object |
| o.url | <code>string</code> |  | URL of server script with data |
| o.onload | <code>[ajaxGetCallback](#tfw..ajaxGetCallback)</code> |  | function to call when request has successfully completed |
| [o.autohide] | <code>number</code> | <code>0</code> | whether to show overlay after finishing (0 = off, 2 = pass 1 to [ajaxOnAutoHide](#tfw.ajaxOnAutoHide), otherwise pass 0) |
| [o.method] | <code>string</code> | <code>&quot;\&quot;GET\&quot;&quot;</code> | HTTP method to be used (GET or POST) |
| [o.parameters] | <code>string</code> | <code>null</code> | parameters to be send with the request (e.g. POST) |

<a name="tfw.ajaxPost"></a>

### tfw.ajaxPost(o) ⇒ <code>XMLHttpRequest</code>
Post data to server via AJAX.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>XMLHttpRequest</code> - Returns XMLHttpRequest object  
**See**: tfw.ajaxGet  

| Param | Type | Description |
| --- | --- | --- |
| o | <code>Object</code> | parameters object (see [ajaxGet](#tfw.ajaxGet)) |

<a name="tfw.encodeFormValues"></a>

### tfw.encodeFormValues(fields) ⇒ <code>string</code>
Encode all items as URL.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>string</code> - String, that can be used to call server via ajax  

| Param | Type | Description |
| --- | --- | --- |
| fields | <code>Object</code> | items to be encoded {key1:id1,key2:id2,...} |

<a name="tfw.decodeJSON"></a>

### tfw.decodeJSON(json) ⇒ <code>Object</code>
Decode JSON data, show error in case they are invalid.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>Object</code> - Object that was encoded in given JSON string.  

| Param | Type | Description |
| --- | --- | --- |
| json | <code>string</code> | JSON encoded data |

<a name="tfw.novyElement"></a>

### ~~tfw.novyElement()~~
***Deprecated***

**Kind**: static method of <code>[tfw](#tfw)</code>  
<a name="tfw.noveZalozky"></a>

### tfw.noveZalozky()
**Kind**: static method of <code>[tfw](#tfw)</code>  
**Todo**

- [ ] Remove dependencies on Triobo

<a name="tfw.dynamicTable"></a>

### tfw.dynamicTable(params) ⇒ <code>HTMLElement</code>
Wrapper that creates a dynamic table and returns it's HTML node for inserting into DOM.Class instance's properties are mirrored into the HTML element.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>HTMLElement</code> - Table  
**See**: tfw.dynamicTableClass  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | table parameters (see [dynamicTableClass](#tfw.dynamicTableClass)) |

<a name="tfw.calendar"></a>

### tfw.calendar(params) ⇒ <code>HTMLElement</code>
Create a calendar input field.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>HTMLElement</code> - Returns input (+ optionally legend) wrapper  
**See**

- tfw.input
- tfw.calendarExtend


| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | see [input](#tfw.input) |

<a name="tfw.multiCheckbox"></a>

### tfw.multiCheckbox(params) ⇒ <code>HTMLElement</code>
Create a list of checkboxes, with common controls.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>HTMLElement</code> - Returns checkboxes' container (with value attribute and methods setNone and setAll)  
**Todo**

- [ ] Change seznamZatrzitek to tfwMultiCheckbox


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  | checkbox list parameters (for more see [fillElemDefs](#tfw.fillElemDefs)) |
| [params.className] | <code>string</code> | <code>&quot;\&quot;seznamZatrzitek\&quot;&quot;</code> | container classes (seznamZatrzitek is always added) |
| [params.list] | <code>Array.&lt;Object&gt;</code> |  | list of checkboxes' parameters (makes params.id mandatory) |
| params.list[].id | <code>string</code> |  | ID of checkbox |
| params.list[].text | <code>string</code> |  | text of checkbox |
| [params.value] | <code>string</code> |  | initial value ("A" means all) |

<a name="tfw.dialogPrepareAndDownload"></a>

### tfw.dialogPrepareAndDownload(params)
Show dialog while preparing something for download in background, when ready show download link.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**See**: tfw.ajaxGet  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | parameters |
| params.title | <code>string</code> | dialog title |
| params.waiting | <code>string</code> | HTML to show while waiting |
| params.ajaxFile | <code>string</code> | url for [ajaxGet](#tfw.ajaxGet) |
| params.ajaxParam | <code>string</code> | url-encoded parameters separated by & for [ajaxGet](#tfw.ajaxGet) |
| params.text | <code>string</code> | text to show when ready, with "%1" getting replaced with download link |
| params.item | <code>string</code> | download link inner HTML |

<a name="tfw..ajaxGetCallback"></a>

### tfw~ajaxGetCallback : <code>function</code>
Callback after successfull HTTP request.

**Kind**: inner typedef of <code>[tfw](#tfw)</code>  

| Param | Type | Description |
| --- | --- | --- |
| httpRequest | <code>XMLHttpRequest</code> | associated XMLHttpRequest object |
| httpRequest.responseText | <code>string</code> | server response |

<a name="desktop"></a>

## desktop
**Kind**: global class  
**Todo**

- [ ] freeze?


* [desktop](#desktop)
    * [new desktop()](#new_desktop_new)
    * [.newLayer(params)](#desktop.newLayer)
    * [.createLayerAndWrapperAtElement(element, params, [above], [right])](#desktop.createLayerAndWrapperAtElement) ⇒ <code>HTMLElement</code>
    * [.dropDown(params)](#desktop.dropDown) ⇒ <code>HTMLElement</code>

<a name="new_desktop_new"></a>

### new desktop()
Triobo. This is a singleton.

<a name="desktop.newLayer"></a>

### desktop.newLayer(params)
Create a new layer.

**Kind**: static method of <code>[desktop](#desktop)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  | layer parameters |
| [params.modal] | <code>boolean</code> &#124; <code>string</code> |  | whether to add class modal (if set to "auto", copies from currently active layer) |
| [params.autoclose] | <code>boolean</code> | <code>false</code> | whether to close layer by clicking it |
| [param.overlay] | <code>boolean</code> | <code>false</code> | whether to add overlay to this layer |

<a name="desktop.createLayerAndWrapperAtElement"></a>

### desktop.createLayerAndWrapperAtElement(element, params, [above], [right]) ⇒ <code>HTMLElement</code>
Create a new layer and a wrapper that starts at a given element.

**Kind**: static method of <code>[desktop](#desktop)</code>  
**Returns**: <code>HTMLElement</code> - Created wrapper  
**See**: desktop.newLayer  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| element | <code>HTMLElement</code> |  | element to position wrapper at |
| params | <code>Object</code> |  | parameters for [newLayer](#desktop.newLayer) |
| [above] | <code>boolean</code> | <code>false</code> | whether to position above element instead of below |
| [right] | <code>boolean</code> | <code>false</code> | whether to align with right edge of element instead of left |

<a name="desktop.dropDown"></a>

### desktop.dropDown(params) ⇒ <code>HTMLElement</code>
Create a dropdown menu.

**Kind**: static method of <code>[desktop](#desktop)</code>  
**Returns**: <code>HTMLElement</code> - Created dropdown menu  
**See**: tfw.select  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  | dropdown parameters |
| [params.legend] | <code>string</code> |  | label |
| [params.legendWidth] | <code>string</code> |  | label CSS width (including unit) |
| [params.legendStyle] | <code>string</code> |  | label CSS styling |
| [params.containerId] | <code>string</code> |  | ID of containing paragraph |
| [params.containerStyle] | <code>string</code> |  | CSS styling of containing paragraph |
| [params.id] | <code>string</code> |  | dropdown ID |
| [params.className] | <code>string</code> |  | dropdown classes (separated by spaces) |
| [params.style] | <code>string</code> |  | dropdown CSS styling |
| [params.itemWidth] | <code>number</code> | <code>0</code> | width of an item |
| [params.itemHeight] | <code>number</code> | <code>20</code> | height of an item |
| [params.onchange] | <code>function</code> |  | function to call when value changes (onchange) |
| params.list | <code>Array.&lt;string&gt;</code> &#124; <code>Array.&lt;Object&gt;</code> |  | list of options passed to [select](#tfw.select) |
| [params.value] | <code>string</code> |  | default (selected) value |

<a name="prvek"></a>

## prvek
**Kind**: global class  

* [prvek](#prvek)
    * [new prvek()](#new_prvek_new)
    * [.rezimVyberuBarvy](#prvek.rezimVyberuBarvy)
    * ~~[.seznamZatrzitek(params)](#prvek.seznamZatrzitek) ⇒ <code>HTMLElement</code>~~
    * ~~[.tabulka()](#prvek.tabulka)~~
    * ~~[.radek()](#prvek.radek)~~
    * ~~[.sloupec()](#prvek.sloupec)~~
    * [.barva()](#prvek.barva)
    * [.barvaSLegendou()](#prvek.barvaSLegendou)

<a name="new_prvek_new"></a>

### new prvek()
Function package for preparing HTML elements.

<a name="prvek.rezimVyberuBarvy"></a>

### prvek.rezimVyberuBarvy
**Kind**: static property of <code>[prvek](#prvek)</code>  
**Todo**

- [ ] Remove dependencies on Triobo
- [ ] Move to [tfw](#tfw)

<a name="prvek.seznamZatrzitek"></a>

### ~~prvek.seznamZatrzitek(params) ⇒ <code>HTMLElement</code>~~
***Deprecated***

Create a list of checkboxes, with common controls.

**Kind**: static method of <code>[prvek](#prvek)</code>  
**Returns**: <code>HTMLElement</code> - Returns container with checkboxes  
**See**: tfw.multiCheckbox  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  | checkbox list parameters (for more see [fillElemDefs](#tfw.fillElemDefs)) |
| [params.className] | <code>string</code> | <code>&quot;\&quot;seznamZatrzitek\&quot;&quot;</code> | container classes (seznamZatrzitek is always added) |
| [params.seznam] | <code>Array.&lt;Object&gt;</code> |  | list of checkboxes' parameters (makes params.id mandatory) |
| params.seznam[].id | <code>string</code> |  | ID of checkbox |
| params.seznam[].text | <code>string</code> |  | text of checkbox |
| [params.init] | <code>string</code> |  | initial value |

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
<a name="$"></a>

## $(id) ⇒ <code>HTMLElement</code>
Get HTML element by ID.

**Kind**: global function  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 


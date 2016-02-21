## Classes

<dl>
<dt><a href="#tfw">tfw</a></dt>
<dd></dd>
<dt><a href="#prvek">prvek</a></dt>
<dd></dd>
<dt><a href="#Dyntable">Dyntable</a></dt>
<dd></dd>
</dl>

<a name="tfw"></a>
## tfw
**Kind**: global class  

* [tfw](#tfw)
    * [new tfw()](#new_tfw_new)
    * [.fillElemDefs(element, params)](#tfw.fillElemDefs)
    * [.inputFieldLegend(element, params)](#tfw.inputFieldLegend) ⇒ <code>object</code>
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
### tfw.inputFieldLegend(element, params) ⇒ <code>object</code>
Wrap an input field with a legend and a container.

**Kind**: static method of <code>[tfw](#tfw)</code>  
**Returns**: <code>object</code> - container with legend and input field (HTML element)  

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
| [params.textWidth] | <code>string</code> |  | width of text (CSS, including unit) |
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
    * ~~[.tahlo()](#prvek.tahlo)~~

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

<a name="prvek.tahlo"></a>
### ~~prvek.tahlo()~~
***Deprecated***

**Kind**: static method of <code>[prvek](#prvek)</code>  
**See**: tfw.slider  
<a name="Dyntable"></a>
## Dyntable
**Kind**: global class  
**Todo**

- [ ] Move to [tfw](#tfw)


* [Dyntable](#Dyntable)
    * [new Dyntable(x)](#new_Dyntable_new)
    * [.myDiv](#Dyntable+myDiv)
    * [.url](#Dyntable+url)
    * [.data](#Dyntable+data)
    * [.rowEdit](#Dyntable+rowEdit)
    * [.create()](#Dyntable+create) ⇒ <code>function</code>
    * [.reload()](#Dyntable+reload)
    * [.paint()](#Dyntable+paint)

<a name="new_Dyntable_new"></a>
### new Dyntable(x)
Class for creating dynamic tables.

**Returns**: <code>Object</code> - Returns an object instance.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Object</code> | parameters object (not used) |

<a name="Dyntable+myDiv"></a>
### dyntable.myDiv
**Kind**: instance property of <code>[Dyntable](#Dyntable)</code>  
**Access:** protected  
<a name="Dyntable+url"></a>
### dyntable.url
**Kind**: instance property of <code>[Dyntable](#Dyntable)</code>  
**Access:** protected  
<a name="Dyntable+data"></a>
### dyntable.data
**Kind**: instance property of <code>[Dyntable](#Dyntable)</code>  
**Access:** protected  
<a name="Dyntable+rowEdit"></a>
### dyntable.rowEdit
**Kind**: instance property of <code>[Dyntable](#Dyntable)</code>  
**Access:** protected  
<a name="Dyntable+create"></a>
### dyntable.create() ⇒ <code>function</code>
Create a dynamic table.

**Kind**: instance method of <code>[Dyntable](#Dyntable)</code>  
**Returns**: <code>function</code> - Function that returns a "loading" DIV.  
<a name="Dyntable+reload"></a>
### dyntable.reload()
Reload (or load) data from server.Sends a GET request to "data.php", decodes JSON and [paints](#Dyntable+paint) the table.

**Kind**: instance method of <code>[Dyntable](#Dyntable)</code>  
**See**

- Dyntable#paint
- tfw.decodeJSON

<a name="Dyntable+paint"></a>
### dyntable.paint()
Refresh the content of the table using data gotten by (re)loading.Empties the table and recreates it using this.data.

**Kind**: instance method of <code>[Dyntable](#Dyntable)</code>  
**See**: prvek  

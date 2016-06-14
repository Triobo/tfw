/**
 * @file Triobo Framework
 * @author mpl75
 * @author melanger
 */

/* global token:false, chyba:false, t:false, editor:false */

/**
 * Get HTML element by ID.
 * @param {string} id
 * @return {HTMLElement}
 */
function $(id){//eslint-disable-line no-implicit-globals
  var x = document.getElementById(id);
  return x;
}

HTMLElement.prototype.hasClass = function(c){
  return (this.className.split(" ").indexOf(c) != -1);
};
HTMLElement.prototype.hasAnyClass = function(c){
  var searchedClasses = c.split(" ");
  for (var i in searchedClasses) {
    if (this.className.split(" ").indexOf(searchedClasses[i]) != -1) {
      return true;
    }
  }
  return false;
};
HTMLElement.prototype.addClass = function(c){
  if (!this.hasClass(c)) {
    if (this.className) {
      var cs = this.className.split(" ");
      cs.push(c);
      this.className = cs.join(" ");
    } else this.className = c;
  }
};
HTMLElement.prototype.removeClass = function(c){
  var cs = this.className.split(" ");
  var id = cs.indexOf(c);
  if (id >= 0) cs.splice(id, 1);
  if (cs.length) this.className = cs.join(" ");
  else this.removeAttribute("class");
};
HTMLElement.prototype.toggleClass = function(c){
  if (this.hasClass(c)) this.removeClass(c);
  else this.addClass(c);
};
HTMLElement.prototype.myOrder = function(){
  return this.parentNode == null ? null : Array.prototype.indexOf.call(this.parentNode.children, this);
};
HTMLElement.prototype.add = function(x){
  this.appendChild(x);
};

/**
 * Triobo framework. This is a singleton.
 * @class
 * @todo Replace {@link http://www.w3schools.com/js/js_reserved.asp|reserved words} in function names
 * @todo freeze
 */
var tfw = {//eslint-disable-line no-implicit-globals
  /**
   * Add multiple HTML elements.
   * @param {HTMLElement} parentNode - node to append to
   * @param {HTMLElement[]} childNodes - nodes to append
   */
  addAll: function(parentNode, childNodes){
    for (var i = 0; i < childNodes.length; i++) {
      parentNode.appendChild(childNodes[i]);
    }
  },
  /**
   * Wrapper for parseInt, additionally turns NaN into zero (0).
   * @param {string} str
   * @return {number}
   */
  parseIntOr0: function(str){
    var number = parseInt(str);
    return isNaN(number) ? 0 : number;
  },
  /**
   * HTML to show when some content is being loaded.
   * @constant {string}
   * @default
   */
  AJAX_LOADER: "<div class=\"tfwDivContentLoader\"><span></span></div>",
  /**
   * Strings that are output by tfw functions. Change them for localization.
   * @enum {string}
   */
  strings: {
    /** Label for checkbox with false value. */
    NO: "No",
    /** Label for checkbox with true value. */
    YES: "Yes",
    /** Word for "all" (e.g. both true and false) */
    ALL: "All",
    /** Minimum input label */
    FROM: "From:",
    /** Maximum input label */
    TO: "To:",
    /** Placeholder when searching anywhere in a string */
    FILTER: "Filter…",
    /** Label of hidden rows count */
    HIDDEN_ROWS: "Hidden rows",
    /** progress during file upload */
    UPLOADING: "Uploading … %1",
    /** when composing list, last OR word (f.e. jpg, png or gif) */
    OR: "or",
    /** Error, when not allowed file extension is used  */
    EXTNOTALLOWED: "Only %1 files are allowed."
  },
  /**
   * Orientation, either vertical or horizontal.
   * @enum {number}
   */
  orientation: {
    HORIZONTAL: 0,
    VERTICAL: 1
  },
  /**
   * Add Javascript-generated CSS to the document.
   * @param {string} style - CSS to be added
   * @param {string} [tag] - identify (tag) CSS for overriding
   */
  insertStyle: function(style, tag){
    var id = "tfwInsertStyle";
    if (typeof tag != "undefined") {
      id += "-" + tag;
    }
    if (document.getElementById(id) == null) {
      var styleElement = document.createElement("style");
      styleElement.setAttribute("id", id);
      document.getElementsByTagName("head")[0].add(styleElement);
    }
    if (typeof tag == "undefined") {
      document.getElementById(id).innerHTML += style;
    } else {
      document.getElementById(id).innerHTML = style;
    }
  },
  /**
   * Initialization needed to run tfw functions (e.g. adds required CSS styling).
   * Can be run multiple times (after adding localized strings).
   */
  init: function(){
    var tfwStyling = ".tfwDynamicTable .tfwCheckbox:after{content:\"" + tfw.strings.NO + "\"}\n"
      + ".tfwDynamicTable .tfwCheckbox.checked:after{content:\"" + tfw.strings.YES + "\"}";
    tfw.insertStyle(tfwStyling, "tfwDynamicTable-checkbox");
  },
  /**
   * Add new translations and re-{@link tfw.init|init} tfw.
   * @param {tfw.strings} newStrings - translated strings to be used (keys same as in {@link tfw.strings})
   * @see tfw.init
   */
  localize: function(newStrings){
    for (var stringKey in newStrings) {
      if (Object.prototype.hasOwnProperty.call(newStrings, stringKey)) {
        tfw.strings[stringKey] = newStrings[stringKey];
      }
    }
    tfw.init();
  },
  /**
   * Set attributes of a HTML element.
   * @memberof tfw
   * @param {HTMLElement} element - element to set attributes of
   * @param {Object} params - parameters object
   * @param {string} [params.id] - ID
   * @param {string} [params.className] - class
   * @param {string} [params.innerHTML] - content (HTML)
   * @param {string} [params.text] - content (text), works same as innerHTML
   * @param {string} [params.style] - CSS styling
   * @param {string} [params.title] - title (shows on hover)
   * @param {Object[]} [params.children] - descendant element(s)
   * @param {boolean} [params.disabled=false] - disabled input field
   * @param {boolean} [params.readOnly=false] - read only input field
   * @param {number} [params.maxLength] - maximum input length
   * @param {boolean} [params.evaluate=false] - evaluate (eval) field value after change (onchange), set to 1 or true
   * @param {function} [params.onchange] - function to call when field changes value (onchange fires)
   * @param {function} [params.onClick] - function to call when user clicks on the field (onclick fires)
   * @param {string} [params.value] - default field value (or button text)
   * @param {string} [params.placeholder] - text field placeholder
   */
  fillElemDefs: function(element, params){
    if ("text" in params) {
      params.innerHTML = params.text;
    }
    var attributesToCopy = ["id", "innerHTML", "disabled", "readOnly", "maxLength", "evaluate", "onclick", "value", "placeholder"];
    var i;
    for (i = 0; i < attributesToCopy.length; i++) {
      var attribute = attributesToCopy[i];
      if (attribute in params) {
        element[attribute] = params[attribute];
      }
    }
    if ("style" in params) {
      element.style.cssText = params.style;
    }
    if ("className" in params) {
      if (element.className) {
        element.className += " " + params.className;
      } else {
        element.className = params.className;
      }
    }
    if ("children" in params) {
      for (i = 0; i < params.children.length; i++) {
        if (params.children[i]) {
          element.add(params.children[i]);
        }
      }
    }
    if ("onchange" in params) {
      element.speconchange = params.onchange;
    }
    if ("onchange" in params || "evaluate" in params) {
      element.addEventListener("change", function(){
        if (this.speconchange) {
          this.speconchange();
        }
        if (this.evaluate) {
          var a;
          try {
            a = this.value.replace(/,/g, ".");
            a = eval(a);
            if (isNaN(a)) a = "";
          } catch (err) {
            a = this.value;
          }
          this.value = a;
        }
      });
    }
  },
  /**
   * Helper function for methods that create simple elements.
   * @param {string} tag - HTML tag name
   * @param {Object} params
   * @see tfw.fillElemDefs
   * @return {HTMLElement}
   */
  createAndFillElement: function(tag, params){
    var element = document.createElement(tag);
    this.fillElemDefs(element, params);
    return element;
  },
  /**
   * Alias for tfw.createAndFillElement("div", params)
   * @param {Object} params
   * @memberof tfw
   * @return {HTMLElement}
   */
  div: function(params){
    return tfw.createAndFillElement("div", params);
  },
  /**
   * Alias for tfw.createAndFillElement("p", params)
   * @param {Object} params
   * @memberof tfw
   * @return {HTMLElement}
   */
  par: function(params){
    return tfw.createAndFillElement("p", params);
  },
  /**
   * Alias for tfw.createAndFillElement("span", params)
   * @param {Object} params
   * @memberof tfw
   * @return {HTMLElement}
   */
  span: function(params){
    return tfw.createAndFillElement("span", params);
  },
  /**
   * Create a select field with specified parameters.
   * @param {Object} params - select parameters
   * @see tfw.fillElemDefs
   * @param {boolean} [params.multiple] - can multiple values be selected
   * @param {(string|string[]|Object[])} params.list - list of options as string "label1;label2" or "label1\|value1;label2\|value2", as array of string labels or as object (nonspecified value defaults to numeric index, NOT label text)
   * @param {string} [params.list[].id] - value (defaults to numeric index of option)
   * @param {string} params.list[].text - label
   * @return {HTMLElement} Created select field.
   */
  select: function(params){
    var element = document.createElement("div");
    params.className = "tfwSelect " + (("className" in params) ? params.className : "");
    element.multiple = ("multiple" in params && params.multiple);
    if (!("value" in params)) {
      params.value = "0";
    }
    if ("onchange" in params) element.onchange = params.onchange;
    this.fillElemDefs(element, params);
    element.clickOnItem = function(e){
      e.stopPropagation();
      e.preventDefault();
      var i;
      if (element.multiple) {
        this.toggleClass("selected");
      } else {
        for (i = 0; i < element.childNodes.length; i++) element.childNodes[i].removeClass("selected");
        this.addClass("selected");
      }
      var m = [];
      for (i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].hasClass("selected")) {
          m.push(element.childNodes[i].value);
        }
      }
      element.value = m.join(",");
      if (element.onchange) element.onchange();
      element.addClass("hasBeenChanged");
    };
    if (!element.value) element.value = 0;
    var m = element.value.toString().split(","),
        i;
    if (typeof params.list === "string") {
      var szn = params.list.split(";");
      params.list = [];
      for (i = 0; i < szn.length; i++) {
        var prt = szn[i].split("|");
        if (prt.length == 1) prt[1] = i;
        params.list.push({
          id: prt[1],
          text: prt[0]
        });
      }
    }
    for (i = 0; i < params.list.length; i++) {
      var p = params.list[i];
      if (typeof p === "string") {
        p = {
          id: i,
          text: p
        };
      }
      if (!("id" in p)) p.id = i;
      var l = document.createElement("div");
      l.value = String(p.id);
      l.innerHTML = p.n || p.t || p.text;
      if (m.indexOf(l.value) > -1) l.className = "selected";
      l.addEventListener("mousedown", element.clickOnItem, false);
      element.add(l);
    }
    element.setValue = function(a){
      for (var i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].value == a) {
          element.childNodes[i].addClass("selected");
        } else {
          element.childNodes[i].removeClass("selected");
        }
      }
      element.value = String(a);
    };
    return element;
  },
  /* eslint-disable */
  /**
   * Alias for desktop.dropDown
   * @memberof tfw
   * @see desktop.dropDown
   */
  dropDown: function(params){
    return desktop.dropDown(params);
  },
  /**
   * Alias for desktop.dialog
   * @memberof tfw
   * @see desktop.dialog
   */
  dialog: function(co){
    return desktop.dialog(co);//eslint-disable-line no-use-before-define
  },
  /**
   * Alias for desktop.dialogPrepareAndDownload
   * @memberof tfw
   * @see desktop.dialogPrepareAndDownload
   */
  dialogPrepareAndDownload: function(params){
    return desktop.dialogPrepareAndDownload(params);//eslint-disable-line no-use-before-define
  },
  /* eslint-enable */
  /**
   * Create a button with specified parameters.
   * @memberof tfw
   * @param {Object} params - button parameters
   * @see tfw.fillElemDefs
   * @param {number} [params.step] - step between allowed numeric values
   * @param {boolean} [params.default=false] - if true, type=submit, otherwise type=button
   * @param {function} [params.action] - Function to fire when button is clicked (event propagation is stopped)
   * @return {HTMLElement} Created button
   */
  button: function(params){
    var element = tfw.createAndFillElement("button", params);
    element.type = ((params["default"]) ? "submit" : "button");
    if (params.action) {
      element.action = params.action;
      element.onclick = function(e){
        e.stopPropagation();
        if (!this.disabled) {
          this.action(e);
        }
      };
    }
    return element;
  },
  /**
   * Wrap an input field with a legend and a container.
   * @memberof tfw
   * @param {HTMLElement} element - input field
   * @param {Object} params - legend parameters
   * @param {string} params.legend - legend text
   * @param {string} [params.legendStyle] - legend CSS styling
   * @param {string} [params.containerTag=p] - tag to use as legend container
   * @param {string} [params.containerId] - legend container ID
   * @param {string} [params.containerClassName] - legend container class(es)
   * @param {string} [params.containerStyle] - legend container CSS styling
   * @param {string} [params.after] - text after input field
   * @return {HTMLElement} container with legend and input field
   */
  inputFieldLegend: function(element, params){
    var x = document.createElement(("containerTag" in params) ? params.containerTag : "p");
    var l = document.createElement("span");
    if (params.legend) l.innerHTML = params.legend;
    if (params.legendStyle) l.style.cssText = params.legendStyle;
    if (params.containerId) x.id = params.containerId;
    x.className = "tfwContainer" + (params.containerClassName ? (" " + params.containerClassName) : "");
    if (params.containerStyle) x.style.cssText = params.containerStyle;
    x.add(l);
    x.add(element);
    if (params.after) {
      var a = document.createElement("span");
      a.innerHTML = params.after;
      if (params.afterStyle) a.style.cssText = params.afterStyle;
      x.add(a);
    }
    return x;
  },
  /**
   * Create an input field with specified parameters.
   * @memberof tfw
   * @param {Object} params - input fields parameters
   * @see tfw.fillElemDefs
   * @see tfw.inputFieldLegend
   * @param {string} [params.type=text] - input field type
   * @param {string} [params.value] - prefilled value
   * @param {number} [params.min] - minimum allowed value
   * @param {number} [params.max] - maximum allowed value
   * @param {number} [params.step] - step between allowed numeric values
   * @return {HTMLElement} Created input field, optionally wrapped with label
   */
  input: function(params){
    var element = document.createElement("input");
    element.addEventListener("change", function(){
      this.addClass("hasBeenChanged");
    });

    this.fillElemDefs(element, params);
    var attributesToCopy = ["type", "min", "max", "step"];
    for (var i = 0; i < attributesToCopy.length; i++) {
      if (attributesToCopy[i] in params) {
        element[attributesToCopy[i]] = params[attributesToCopy[i]];
      }
    }
    return (params.legend || params.after) ? (this.inputFieldLegend(element, params)) : element;
  },
  /**
   * Create a text area with specified parameters.
   * @memberof tfw
   * @param {Object} params - text area parameters
   * @see tfw.fillElemDefs
   * @see tfw.inputFieldLegend
   * @param {string} [params.value] - prefilled value
   * @return {HTMLElement} Created text area, optionally wrapped with label
   */
  textArea: function(params){
    var element = document.createElement("textarea");
    element.addEventListener("change", function(){
      this.addClass("hasBeenChanged");
    });

    this.fillElemDefs(element, params);
    if (params.value) {
      element.innerHTML = params.value;
    }
    return (params.legend) ? (this.inputFieldLegend(element, params)) : element;
  },
  /**
   * Create a checkbox with specified parameters.
   * @memberof tfw
   * @param {Object} params - checkbox parameters
   * @see tfw.fillElemDefs
   * @see tfw.inputFieldLegend
   * @param {function} [params.onchange] - function to call when field changes value (onchange fires)
   * @param {string} [params.text] - checkbox label text
   * @param {string} [params.value=0] - initial value (0=unchecked,1=checked)
   * @param {boolean} [params.disabled=false] - whether checkbox should be disabled
   * @return {HTMLElement} Created checkbox, optionally wrapped with label
   */
  checkbox: function(params){
    var labelText = (params.text) ? params.text : "";
    params.text = "";
    var x = tfw.createAndFillElement("div", params);
    x.addClass("tfwCheckbox");
    if (params.onchange) x.onchange = params.onchange;
    if (params.onclick) x.onclick = params.onclick;
    var b = document.createElement("div");
    x._value = 0;
    if ("value" in params) x._value = params.value ? 1 : 0;
    x.className += x._value ? " checked" : "";
    b.className = x._value ? "checked" : "";
    x.add(b);
    var text = document.createElement("span");
    text.innerHTML = labelText;
    x.add(text);
    Object.defineProperty(x, "value", {
      set: function(val){
        var box = this.childNodes[0];
        if (val) {
          box.addClass("checked");
          x.addClass("checked");
        } else {
          box.removeClass("checked");
          x.removeClass("checked");
        }
        this._value = val;
        if (this.onchange) this.onchange();
        this.addClass("hasBeenChanged");
      },
      get: function(){
        return this._value;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(x, "disabled", {
      set: function(val){
        if (val) this.addClass("disabled");
        else this.removeClass("disabled");
        this.zakazano = val;
      },
      get: function(){
        return this.zakazano;
      },
      enumerable: true,
      configurable: true
    });
    x.addEventListener("click", function(e){
      if (!this.zakazano) x.value = 1 - this._value;
      e.stopPropagation();
      e.preventDefault();
    }, false);
    if (params.disabled) x.disabled = 1;
    return (params.legend) ? (this.inputFieldLegend(x, params)) : x;
  },
  /**
   * Create an icon with specified parameters.
   * @memberof tfw
   * @param {Object} params - icon parameters
   * @see tfw.fillElemDefs
   * @param {function} [params.action] - function triggered when icon is clicked (basically onclick)
   * @param {number} [params.index] - move background image up by this number of pixels (background-position-x)
   * @return {HTMLElement} Created icon
   */
  icon: function(params){
    params.className = "tfwIcon" + ((params.className) ? (" " + params.className) : "");
    var element = tfw.createAndFillElement("div", params);
    if (params.action) {
      element.action = params.action;
      element.onclick = function(e){
        if (!element.hasClass("disabled")) this.action(e);
      };
    }
    var b = document.createElement("div");
    if (params.index) b.style.backgroundPositionX = (-params.index) + "px";
    element.add(b);
    element.disabled = 0;
    Object.defineProperty(element, "disabled", {
      set: function(val){
        if (val) element.addClass("disabled");
        else element.removeClass("disabled");
      },
      get: function(){
        return element.hasClass("disabled");
      },
      enumerable: true,
      configurable: true
    });
    if (params.disabled) element.disabled = params.disabled;
    Object.defineProperty(element, "selected", {
      set: function(val){
        if (val) element.addClass("selected");
        else element.removeClass("selected");
      },
      get: function(){
        return element.hasClass("selected");
      },
      enumerable: true,
      configurable: true
    });
    if (params.selected) element.selected = 1;
    return element;
  },
  /**
   * Creates {@link tfw.div} classed tfwGroupOfIcons with {@link tfw.icon}s.
   * @param {Object} params - parameters (mostly for containing div)
   * @param {string} params.iconsClassName - class given to each icon
   * @param {Object[]} params.children - array of params objects for {@link tfw.icon}
   * @see tfw.icon
   * @see tfw.div
   * @return {HTMLElement} icon group's container
   */
  groupOfIcons: function(params){
    var cn = params.iconsClassName;
    delete params.iconsClassName;
    var ch = params.children;
    delete params.children;
    params.className = "tfwGroupOfIcons";
    var container = tfw.div(params);
    for (var i = 0; i < ch.length; i++) {
      if (ch[i] != null) {
        ch[i].className = cn;
        container.appendChild(tfw.icon(ch[i]));
      }
    }
    return container;
  },
  /**
   * Alias for tfw.createAndFillElement("table", params)
   * @param {Object} params - table parameters (use params.children for rows)
   * @memberof tfw
   * @return {HTMLElement}
   */
  table: function(params){
    return tfw.createAndFillElement("table", params);
  },
  /**
   * Create a table row with specified parameters.
   * @memberof tfw
   * @param {Object} params - table row parameters (use params.children for columns/cells)
   * @see tfw.fillElemDefs
   * @param {Array} [params.columns] - list of objects, that will be passed to tfw.td and added as children
   * @return {HTMLElement} Created table row
   */
  tr: function(params){
    var element = tfw.createAndFillElement("tr", params);
    if ("columns" in params) {
      for (var i = 0; i < params.columns.length; i++) {
        element.add(tfw.td(params.columns[i]));
      }
    }
    return element;
  },
  /**
   * Create a table cell with specified parameters.
   * @memberof tfw
   * @param {Object} params - table cell parameters
   * @param {number} [params.colspan] - number of columns that this cell will merge
   * @see tfw.fillElemDefs
   * @return {HTMLElement} Created table cell
   */
  td: function(params){
    var element = tfw.createAndFillElement("td", params);
    if ("colspan" in params) {
      element.setAttribute("colspan", params.colspan);
    }
    return element;
  },
  /**
   * Create a slider with specified parameters.
   * @memberof tfw
   * @param {Object} params - slider parameters
   * @see tfw.fillElemDefs
   * @param {string} params.id - ID, has to be present!
   * @param {string} [params.legend] - legend text
   * @param {string} [params.legendStyle] - legend CSS styling
   * @param {number} [params.min=0] - minimum (smallest) value
   * @param {number} [params.max=100] - maximum (largest) value
   * @param {number} [params.step] - step between allowed values
   * @param {string} [params.width] - width of slider (CSS, including unit)
   * @param {string} [params.valueStyle] - value box CSS styling
   * @param {string} [params.postText] - text after slider
   * @return {HTMLElement} Created slider
   */
  slider: function(params){
    var element = document.createElement("p");
    element.min = 0;
    element.max = 100;
    params.className = "tfwSlider" + ((params.className) ? (" " + params.className) : "");
    var sliderValue = ("value" in params) ? params.value : 0;
    params.value = false;
    this.fillElemDefs(element, params);
    var l = document.createElement("span");
    element.add(l);
    if (params.legend) l.innerHTML = params.legend;
    if (params.legendStyle) l.style.cssText = params.legendStyle;
    var s = document.createElement("input");
    element.add(s);
    s.type = "range";
    if (params.id) s.id = params.id + "-s";
    if (params.max) {
      s.max = params.max;
      element.max = params.max;
    }
    if ("min" in params) {
      s.min = params.min;
      element.min = params.min;
    }
    if (params.step) s.step = params.step;
    if (params.width) s.style.width = params.width;
    s.value = sliderValue;
    s.oninput = function(){
      $(params.id + "-v").value = this.value;
      if (element.onchange) element.onchange();
    };
    s.onkeyup = function(){
      $(params.id + "-v").value = this.value;
      if (element.onchange) element.onchange();
    };
    var v = document.createElement("input");
    element.add(v);
    v.type = "text";
    if (params.id) v.id = params.id + "-v";
    if (params.valueStyle) v.style.cssText = params.valueStyle;
    v.style.textAlign = "right";
    v.value = sliderValue;
    v.onchange = function(){
      if (!this.value.match(/^\d+$/)) this.value = 0;
      if (this.value < element.min) this.value = element.min;
      if (this.value > element.max) this.value = element.max;
      $(params.id + "-s").value = this.value;
      if (element.onchange) element.onchange();
    };
    v.addEventListener("keydown", function(e){
      var h = parseInt(this.value);
      if (e.which == 38) {
        this.value = h - (e.altKey ? 8 : 1);
        if (this.value < element.min) this.value = element.min;
        $(element.id + "-s").value = this.value;
        if (element.onchange) element.onchange();
        e.stopPropagation();
        e.preventDefault();
      }
      if (e.which == 40) {
        this.value = h + (e.altKey ? 8 : 1);
        if (this.value > element.max) this.value = element.max;
        $(element.id + "-s").value = this.value;
        if (element.onchange) element.onchange();
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);
    Object.defineProperty(element, "value", {
      set: function(a){
        this.childNodes[1].value = a;
        this.childNodes[2].value = a;
      },
      get: function(){
        return this.childNodes[2].value;
      },
      enumerable: true,
      configurable: true
    });
    if (params.postText) {
      var p = document.createElement("span");
      element.add(p);
      p.innerHTML = params.postText;
      if (params.postStyle) p.style.cssText = params.postStyle;
    }
    return element;
  },
  /**
   * Create an image with specified parameters.
   * @memberof tfw
   * @param {Object} params - image parameters
   * @param {string} [params.src] - URL of image
   * @param {title} [params.title] - image title (displays on hover)
   * @see tfw.fillElemDefs
   * @return {HTMLElement} Created image
   */
  image: function(params){
    var element = tfw.createAndFillElement("img", params);
    if (params.src) element.src = params.src;
    if (params.title) element.title = params.title;
    return element;
  },
  /**
   * Create control for uploading files (images).
   * @memberof tfw
   * @param {Object} params - file box parameters
   * @see tfw.fillElemDefs
   * @see tfw.inputFieldLegend
   * @param {string} [params.id=filebox] - ID of box
   * @param {string} [params.className=tfwFilebox] - class(es) of box (tfwFilebox is always appended)
   * @param {number} [params.value=0]
   * @param {string} [params.text] - text to be placed inside inner div (ignored for {@link tfw.fillElemDefs|fillElemDefs})
   * @param {string} [params.filename] - name of file (image)
   * @param {string} [params.path] - path to file (image), with trailing slash
   * @param {string} [params.imgStyle] - CSS styling for image
   * @param {function} [params.onloaded=null] - callback fired when upload finishes
   * @param {function} [params.onstart=null] - callback fired when upload starts
   * @param {string} [params.limitExtensions] - allowed extensions, without dot (e.g. "png|jpeg|jpg|gif")
   * @param {string} [params.style] - CSS styling of outter and inner DIV
   * @return {HTMLElement} Created file box, optionally wrapped with label
   */
  filebox: function(params){
    var element = document.createElement("div");
    if (!("id" in params)) params.id = "filebox";
    params.className = (("className" in params) ? (params.className + " ") : "") + "tfwFilebox";
    if (!("value" in params)) params.value = 0;
    var innerDivStyle = ("style" in params) ? params.style : "";
    element.text = ("text" in params) ? params.text : "";
    delete params.text;
    this.fillElemDefs(element, params);

    element.filename = ("filename" in params) ? params.filename : "";
    element.path = ("path" in params) ? params.path : "";
    element.imgStyle = ("imgStyle" in params) ? ("style=\"" + params.imgStyle + "\" ") : "";
    element.onloaded = ("onloaded" in params) ? params.onloaded : null;
    element.onstart = ("onstart" in params) ? params.onstart : null;
    element.limitExtensions = ("limitExtensions" in params) ? params.limitExtensions : "";

    element.uploading = 0;
    var b = tfw.div({});
    element.add(b);
    b.className = "content";
    if (innerDivStyle) b.style.cssText = innerDivStyle;
    b.addEventListener("click", function(){
      element.lastChild.dispatchEvent(new MouseEvent("click", {view: window, bubbles: true, cancelable: false}));
    });
    b.addEventListener("dragenter", function(e){
      this.style.outline = "red 2px solid";
      e.stopPropagation();
      e.preventDefault();
    }, false);
    b.addEventListener("dragleave", function(e){
      this.style.outline = "";
      e.stopPropagation();
      e.preventDefault();
    }, false);
    b.addEventListener("dragover", function(e){
      e.stopPropagation();
      e.preventDefault();
    }, false);
    b.addEventListener("drop", function(e){
      e.stopPropagation();
      e.preventDefault();
      this.style.outline = "";
      element.upload(e.dataTransfer.files);
    }, false);
    element.add(b = document.createElement("input"));
    b.type = "file";
    b.style.display = "none";
    b.addEventListener("change", function(e){
      element.upload(e.target.files);
    });
    element.prekresli = function(prc){
      if (element.uploading) {
        element.childNodes[0].innerHTML = "<p class=\"verticalCenter\" style=\"height:20px;\">" + tfw.strings.UPLOADING.replace("%1", (prc + " %")) + "</p>";
      } else if (element.value) {
        element.removeClass("empty");
        if (element.filename.match(/\.(gif|jpg|jpeg|png)$/i)) {
          element.childNodes[0].innerHTML = "<img id=\"fileboximg" + element.id + "\" class=\"verticalCenter\" " + element.imgStyle + " src=\"/zdroje/"
          + element.path + element.filename + "?" + element.value + "\">";
        } else {
          element.childNodes[0].innerHTML = "<p class=\"verticalCenter\" style=\"height:20px;\">" + element.filename + "</p>";
        }
      } else {
        element.addClass("empty");
        element.childNodes[0].innerHTML = "<p class=\"verticalCenter\" style=\"height:40px;\">" + element.text + "</p>";
      }
    };
    element.upload = function(u){
      element.prekresli(0);
      var jmeno = u[0].name;
      var canbe = 1;
      if (element.limitExtensions) {
        var re = new RegExp("\\.(" + element.limitExtensions + ")$", "i");
        if (!jmeno.match(re)) canbe = 0;
      }
      if (canbe) {
        element.uploading = u[0].size;
        if (element.onstart) element.onstart();
        element.hr = new XMLHttpRequest();
        var fUp = element.hr.upload;
        fUp.addEventListener("progress", function(e){
          element.prekresli(Math.round(e.loaded / element.uploading * 100));
        });
        fUp.addEventListener("load", function(){
          element.uploading = 0;
          element.value = Math.floor(Math.random() * 1000000) + 1;
          if (element.onloaded) element.onloaded();
          window.setTimeout(function(){
            $(element.id).prekresli();
          }, 500);
        });
        element.hr.open("POST", "uploadFile.php?token=" + token);
        element.hr.setRequestHeader("X_FILENAME", element.path + element.filename);
        element.hr.send(u[0]);
      } else {
        var lims = element.limitExtensions.split("|");
        var lastl = lims.pop();
        var lim;
        if (lims.length) lim = "<b>" + lims.join("</b>, <b>") + "</b> " + tfw.strings.OR + " <b>" + lastl + "</b>";
        else lim = "<b>" + lastl + "</b>";
        chyba("#300-" + tfw.strings.EXTNOTALLOWED.replace("%1", lim));
      }
    };
    element.prekresli();
    return (params.legend) ? (this.inputFieldLegend(element, params)) : element;
  },
  /**
   * Generates permanent AJAX queries parameters (e.g. tokens, anti-cache)
   * @var {function}
   * @default null
   */
  ajaxIncludeParams: null,
  /**
   * Handles error generated by server (receives error code returned by server).
   * @var {function}
   * @default null
   */
  ajaxOnErrorCode: null,
  /**
   * Handles HTTP errors (HTTP codes other than 200).
   * @var {function}
   * @default null
   * @todo Implement
   */
  ajaxOnError: null,
  /**
   * Fired after any finished AJAX request.
   * @var {function}
   * @default null
   */
  ajaxOnDone: null,
  /**
   * Fired when autohide is not 0.
   * @var {function}
   * @default null
   */
  ajaxOnAutoHide: null,
  /**
   * Callback after successfull HTTP request.
   * @callback tfw~ajaxGetCallback
   * @param {XMLHttpRequest} httpRequest - associated XMLHttpRequest object
   * @param {string} httpRequest.responseText - server response
   */
  /**
   * Get data from server via AJAX.
   * @memberof tfw
   * @param {Object} o - parameters object
   * @param {string} o.url - URL of server script with data
   * @param {tfw~ajaxGetCallback} o.onload - function to call when request has successfully completed
   * @param {number} [o.autohide=0] - whether to show overlay after finishing (0 = off, 2 = pass 1 to {@link tfw.ajaxOnAutoHide|ajaxOnAutoHide}, otherwise pass 0)
   * @param {string} [o.method=GET] - HTTP method to be used (GET or POST)
   * @param {string} [o.parameters=null] - parameters to be send with the request (e.g. POST)
   * @return {XMLHttpRequest} Returns XMLHttpRequest object
   * @see tfw.ajaxIncludeParams
   * @see tfw.ajaxOnErrorCode
   * @see tfw.ajaxOnError
   */
  ajaxGet: function(o){
    if (!("method" in o)) {
      o.method = "GET";
    }
    if (!("parameters" in o)) {
      o.parameters = null;
    }
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
      if (httpRequest.readyState === 4) {
        if (tfw.ajaxOnDone != null) tfw.ajaxOnDone();
        if (httpRequest.status === 200) {
          var rt;
          if (tfw.ajaxOnErrorCode && (rt = httpRequest.responseText).substr(0, 1) == "#") {
            tfw.ajaxOnErrorCode(rt);
          } else {
            o.onload(httpRequest);
          }
        } else if (tfw.ajaxOnError) {
          tfw.ajaxOnError();
        }
      }
    };
    var ur = o.url;
    if (tfw.ajaxIncludeParams) {
      switch (o.method) {
        case "GET":
          ur += "&" + tfw.ajaxIncludeParams();
          break;
        case "POST":
          o.parameters += "&" + tfw.ajaxIncludeParams();
          break;
        // intentionally omitted default
      }
    }
    httpRequest.open(o.method, ur);
    switch (o.method) {
      case "GET":
        httpRequest.setRequestHeader("Cache-Control", "max-age=0,no-cache,no-store,post-check=0,pre-check=0");
        break;
      case "POST":
        httpRequest.setRequestHeader("Cache-Control", "no-cache");
        httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        break;
      // intentionally omitted default
    }
    httpRequest.send(o.parameters);
    if (o.autohide && tfw.ajaxOnAutoHide != null) {
      tfw.ajaxOnAutoHide((o.autohide == 2) ? 1 : 0);
    }
    return httpRequest;
  },
  /**
   * Post data to server via AJAX.
   * @memberof tfw
   * @param {Object} o - parameters object
   * @return {XMLHttpRequest} Returns XMLHttpRequest object
   * @see tfw.ajaxGet
   */
  ajaxPost: function(o){
    o.method = "POST";
    return tfw.ajaxGet(o);
  },
  /**
   * Encode all items as URL.
   * @memberof tfw
   * @param {Object} fields - items to be encoded {key1:id1,key2:id2,...}
   * @return {string} String, that can be used to call server via ajax
   */
  encodeFormValues: function(fields){
    var x = [];
    for (var key in fields) {
      if (Object.prototype.hasOwnProperty.call(fields, key)) {
        x.push(key + "=" + encodeURIComponent($(fields[key]).value));
      }
    }
    return x.join("&");
  },
  /**
   * Decode JSON data, show error in case they are invalid.
   * @memberof tfw
   * @param {string} json - JSON encoded data
   * @return {Object} Object that was encoded in given JSON string.
   */
  decodeJSON: function(json){
    var odpoved = {};
    try {
      odpoved = JSON.parse(json);
    } catch (e) {
      tfw.dialog({
        width: 600,
        height: 420,
        title: "Error",
        children: [
          tfw.div({
            innerHTML: "This is unknown error, please contact Triobo representative:",
            className: "nazev"
          }), tfw.div({
            style: "width:100%;height:300px;overflow-y:scroll;font-size:80%;",
            innerHTML: json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          })
        ],
        buttons: [{
          action: desktop.closeTopLayer,
          text: "x"
        }]
      });
    }
    return odpoved;
  },
  getRealCoordinates: function(element){
    var totalOffsetX = 0,
        totalOffsetY = 0,
        ancestor = element;
    do {
      totalOffsetX += ancestor.offsetLeft - ancestor.scrollLeft;
      totalOffsetY += ancestor.offsetTop - ancestor.scrollTop;
      ancestor = ancestor.offsetParent;
    } while (ancestor != null);
    return [totalOffsetX, totalOffsetY];
  },
  /* eslint-disable */
  /**
   * Use various tfw functions instead.
   * @deprecated
   */
  novyElement: function(typ, id, c, obsah, styl){
    //console.warn("DEPRECATED novyElement "+id);  // tohoto je ještě strašně moc………
    var x = document.createElement(typ);
    if (id) x.setAttribute("id", id);
    if (c) x.setAttribute("class", c);
    if (obsah) x.innerHTML = obsah;
    if (styl) x.setAttribute("style", styl);
    return x;
  },
  /**
   * @deprecated
   * @see tfw.checkbox
   */
  zatrzitko: function(id, text, init, styl){
    console.warn("DEPRECATED tfw.zatrzitko, use tfw.checkbox instead. (call from " + arguments.callee.caller.name + ")");
    return tfw.checkbox({
      id: id,
      text: text,
      value: init,
      style: styl
    });
  },
  /**
   * @deprecated
   * @see tfw.div
   */
  tlacitko: function(id, text, funkce, styl){
    console.warn("DEPRECATED tfw.tlacitko, use tfw.div({className: \"button\"}) instead.");
    return tfw.div({
      className: "button",
      id: id,
      innerHTML: text,
      onclick: funkce,
      style: styl
    });
  },
  /**
   * @deprecated
   * @see tfw.select
   */
  novySelect: function(id, w, h, l, i){
    console.warn("DEPRECATED tfw.novySelect, use tfw.select instead. (call from " + arguments.callee.caller.name + ")");
    return tfw.select({
      id: id,
      style: "width:" + w + "px;height:" + h + "px;",
      list: l,
      value: i
    });
  },
  /**
   * @deprecated
   * @see tfw.tabs
   */
  noveZalozky: function(id, w, h, zalozky, init){
    console.warn("DEPRECATED tfw.noveZalozky, use tfw.tabs instead. (call from " + arguments.callee.caller.name + ")");
    return tfw.tabs({
      id: id,
      style: "width: "+w+"px;height: "+h+"px",
      tabs: zalozky.split(";").map(function(value){
        return {title: value};
      }),
      active: Number(init)
    });
  },
  /**
   * @deprecated
   * @see tfw.tabs
   */
  noveSvisleZalozky: function(id, wl, w, h, zalozky, init){
    console.warn("DEPRECATED tfw.noveSvisleZalozky, use tfw.tabs instead. (call from " + arguments.callee.caller.name + ")");
    return tfw.tabs({
      id: id,
      style: "width: "+w+"px;height: "+h+"px",
      tabs: zalozky.split(";").map(function(value, i){
        var ret = {},
            item = value.split("|");
        if(item.length > 1) ret.id = item[1];
        else ret.id = id+"-tab-"+String(i);
        ret.title = item[0];
        return ret;
      }),
      active: init,
      orientation: tfw.orientation.VERTICAL,
      styleTabs: "width: "+wl+"px;"
    }, true);
  },
  /**
   * @deprecated
   * @see tfw.tabs
   */
  zvolSvislouZalozku: function(jmeno, novy){
    console.warn("DEPRECATED zvolSvislouZalozku, use setActiveTab instead.");
    $(jmeno).setActiveTab(String(novy));
  },
  /**
   * @deprecated
   * @see tfw.progress
   */
  progressBar: function(id, styl){
    console.warn("DEPRECATED tfw.progressBar, use tfw.progress instead (with value attribute).");
    var x = document.createElement("div");
    x.id = id;
    x.style.cssText = styl;
    x.className = "progressbar";
    var y = document.createElement("div");
    x.add(y);
    y.add(document.createElement("div"));
    return x;
  },
  /* eslint-enable */
  /**
   * Alias for tfw.createAndFillElement("ol", params)
   * @param {Object} params
   * @memberof tfw
   * @return {HTMLElement}
   */
  ol: function(params){
    return tfw.createAndFillElement("ol", params);
  },
  /**
   * Alias for tfw.createAndFillElement("li", params)
   * @param {Object} params
   * @memberof tfw
   * @return {HTMLElement}
   */
  li: function(params){
    return tfw.createAndFillElement("li", params);
  },
  /**
   * Specification of a tab - either numeric index or name.
   * @typedef {(number|string)} tfw.Tabs~tabLabel
   */
  /**
   * Class for creating tabs.
   * @class
   * @param {Object} params - table parameters
   * @param {string} params.id - ID of tabs container
   * @param {tfw.Tabs~tabLabel} [params.active=-1] - index or name of tab active by default (negative means none)
   * @param {tfw.orientation} [params.orientation=tfw.orientation.HORIZONTAL] - orientation of tabs
   * @param {string} [params.styleTabs] - style of tab titles' list (width required for vertical tabs)
   * @param {string} params.style - style of each tab's content (width and height required, but not checked)
   * @param {Object[]} params.tabs - array of tabs
   * @param {string} params.tabs[].title - tab title
   * @param {HTMLElement[]} [params.tabs[].children] - tab content (as HTML elements)
   * @param {string} [params.tabs[].innerHTML] - tab content (as HTML string)
   * @param {string} [params.tabs[].id] - tab ID/name (has to be unique in document)
   * @todo Remove deprecated properties and ids
   */
  Tabs: function(params){
    this.orientation = ("orientation" in params) ? params.orientation : tfw.orientation.HORIZONTAL;
    this.name = params.id;
    this.tabContainer = tfw.div({
      className: "tfwTabContainer " + ((this.orientation == tfw.orientation.HORIZONTAL) ? "horizontal" : "vertical"),
      id: this.name
    });
    this.activeTab = -1;
    this.tabNav = tfw.ol({className: "semantic tfwTabNav", style: ("styleTabs" in params) ? params.styleTabs : ""});
    if (this.orientation == tfw.orientation.VERTICAL) this.tabNav.style.height = params.tabHeight + "px";

    this.tabStyle = params.style;

    /**
     * @typedef {Object} tfw.Tabs~tab
     * @property {HTMLElement} title - tab title
     * @property {HTMLElement} content - tab content
     * @property {?string} name - tab name
     */
    /**
     * @protected
     * @var {tfw.Tabs~tab[]}
     */
    this.tabs = [];

    this.tabContainer.add(this.tabNav);

    /**
     * Getter for activeTab.
     * @public
     * @return {number} Value of {@link tfw.Tabs#activeTab}
     */
    this.getActiveTab = function(){
      return this.activeTab;
    };

    /**
     * Get active tab's name.
     * @public
     * @return {?string} {@link tfw.Tabs#activeTab}'s name
     */
    this.getActiveTabName = function(){
      return (this.activeTab < 0) ? null : this.tabs[this.activeTab].name;
    };

    /**
     * @private
     * @param {tfw.Tabs~tabLabel} tabLabel
     * @return {number} tab index
     */
    this.tabLabelToIndex = function(tabLabel){
      return (typeof tabLabel === "number") ? tabLabel : this.tabs.reduce(function(previous, current, i){
        return (previous == null) ? (current.name == tabLabel ? i : null) : previous;
      }, null);
    };

    /**
     * Set active tab (and set previously active tab as inactive).
     * @public
     * @param {tfw.Tabs~tabLabel} tabLabel - tab index or name (-1 to deactive all)
     * @fires tabhide
     * @fires tabshow
     */
    this.setActiveTab = function(tabLabel){
      var tabIndex = this.tabLabelToIndex(tabLabel);
      if (tabIndex == null) {
        console.error("Tabs.setActiveTab: name was not found");
        return;
      }

      if (tabIndex != this.activeTab) {
        if (this.activeTab >= 0) {
          var previousTab = this.tabs[this.activeTab];
          previousTab.title.removeClass("active");
          previousTab.content.removeClass("active");
          previousTab.content.dispatchEvent(new CustomEvent("tabhide"));
        }
        if (tabIndex >= 0) {
          var nextTab = this.tabs[tabIndex];
          nextTab.title.addClass("active");
          nextTab.content.addClass("active");
          this.activeTab = tabIndex;
          nextTab.content.dispatchEvent(new CustomEvent("tabshow"));
        }
      }
    };

    /**
     * Add a new tab.
     * @public
     * @param {string} title - new tab title
     * @param {HTMLElement[]|string} content - new tab content (may be HTML)
     * @param {boolean} [active=false] - whether to make new tab active by default
     * @param {string} [tabId] - ID (name) of tab
     */
    this.appendTab = function(title, content, active, tabId){
      var i = this.tabs.length,
          tabs = this,
          tabTitle,
          tabContent;

      // create tab title
      tabTitle = tfw.li({
        className: "tfwTabTitle",
        innerHTML: title
      });
      tabTitle.dataset.tabIndex = i;
      tabTitle.addEventListener("mousedown", function(e){
        tabs.setActiveTab(parseInt(this.dataset.tabIndex));
        e.stopPropagation();
        e.preventDefault();
      }, false);
      if (typeof tabId != "undefined") {
        tabTitle.dataset.tabName = tabId;
        Object.defineProperty(tabTitle, "value", {
          configurable: false,
          enumerable: true,
          get: function(){
            console.warn("DEPRECATED use of tab title's value attribute, use .dataset.tabName instead.");
            return this.dataset.tabName;
          }
        });
      }
      this.tabNav.add(tabTitle);

      // create tab content
      var tabContentParams = {
        className: "tfwTabContent",
        style: this.tabStyle
      };

      if (typeof content != "undefined") {
        if (typeof content === "string") {
          tabContentParams.innerHTML = content;
        } else {
          tabContentParams.children = content;
        }
      }

      this.tabContainer.add(
        tabContent = tfw.div(tabContentParams)
      );

      if (typeof tabId != "undefined") {
        tabContent.id = tabId; // TODO: prefix?
      }
      tabContent.dataset.tabIndex = i;
      tabContent.removeItem = function(){
        tabs.removeTab(this.dataset.tabIndex);
      };
      Object.defineProperty(tabContent, "onHide", {
        configurable: false,
        enumerable: true,
        set: function(listener){
          console.warn("DEPRECATED use of vertical tab's attribute onHide, use addEventListener(\"tabhide\") instead.");
          this.addEventListener("tabhide", listener);
        }
      });
      Object.defineProperty(tabContent, "onShow", {
        configurable: false,
        enumerable: true,
        set: function(listener){
          console.warn("DEPRECATED use of vertical tab's attribute onShow, use addEventListener(\"tabshow\") instead.");
          this.addEventListener("tabshow", listener);
          this._onShowListener = listener;
        },
        get: function(){
          console.warn("DEPRECATED use of vertical tab's attribute onShow, fire custom event \"tabshow\" instead.");
          return this._onShowListener;
        }
      });

      var tab = {title: tabTitle, content: tabContent};
      if (typeof tabId != "undefined") tab.name = tabId;
      this.tabs[i] = tab;

      if (typeof active != "undefined" && active) this.setActiveTab(i);
    };

    /**
     * Remove a tab.
     * @public
     * @param {tfw.Tabs~tabLabel} tabLabel - tab index or name
     * @fires tabhide
     */
    this.removeTab = function(tabLabel){
      var tabIndex = this.tabLabelToIndex(tabLabel),
          tab = this.tabs[tabIndex];
      tab.content.dispatchEvent(new CustomEvent("tabhide"));
      tab.title.remove();
      tab.content.remove();
      this.tabs.splice(tabIndex, 1);
    };

    /**
     * Getter for tab content container (for editing).
     * @public
     * @param {tfw.Tabs~tabLabel} tabLabel - index or name
     * @return {HTMLElement}
     */
    this.getTab = function(tabLabel){
      return this.tabs[this.tabLabelToIndex(tabLabel)].content;
    };

    /**
     * Setter for tab content.
     * @public
     * @param {tfw.Tabs~tabLabel} tabLabel - index or name
     * @param {HTMLElement[]} content - contents of tab (no container)
     */
    this.setTab = function(tabLabel, content){
      var tabIndex = this.tabLabelToIndex(tabLabel);
      this.tabs[tabIndex].content.innerHTML = "";
      tfw.addAll(this.tabs[tabIndex].content, content);
    };


    for (var i = 0; i < params.tabs.length; i++) {
      this.appendTab(
        params.tabs[i].title,
        params.tabs[i].children || params.tabs[i].innerHTML,
        this.tabLabelToIndex(params.active) == i,
        params.tabs[i].id
      );
    }
  },
  /**
   * Wrapper that creates a tabs container and returns it's HTML node for inserting into DOM.
   * API methods are mirrored into the HTML element.
   * @param {Object} params - tabs parameters
   * @param {boolean} [_valueAsName=false] - simulate behaviour of noveSvisleZalozky (for compatibility)
   * @return {HTMLElement} Tabs
   * @see tfw.Tabs
   * @todo Remove deprecated argument, properties and methods
   */
  tabs: function(params, _valueAsName){
    var tabObject = new tfw.Tabs(params),
        container = tabObject.tabContainer,
        api = ["getActiveTab", "getActiveTabName", "setActiveTab", "appendTab", "removeTab", "getTab", "setTab"];
    tabObject._valueAsName = (typeof _valueAsName == "undefined") ? false : _valueAsName;
    for (var i = 0; i < api.length; i++) {
      container[api[i]] = tabObject[api[i]].bind(tabObject);
    }

    Object.defineProperty(container, "value", {
      configurable: false,
      enumerable: true,
      get: function(){
        if (tabObject._valueAsName) console.warn("DEPRECATED use of tab's attribute value (requesting name), use getActiveTabName instead.");
        return tabObject._valueAsName ? tabObject.getActiveTabName() : tabObject.getActiveTab();
      },
      set: function(value){
        if (tabObject._valueAsName) console.warn("DEPRECATED use of tab's attribute value (setting name), use setActiveTabName instead.");
        tabObject.setActiveTab(tabObject._valueAsName ? String(value) : value);
      }
    });
    if (tabObject.orientation == tfw.orientation.VERTICAL) {
      Object.defineProperty(container, "vybrany", {
        configurable: false,
        enumerable: true,
        get: function(){
          console.warn("DEPRECATED use of vertical tab's attribute vybrany, use getActiveTab instead.");
          return tabObject.getActiveTab();
        },
        set: function(value){
          console.warn("DEPRECATED use of vertical tab's attribute vybrany, use setActiveTab instead.");
          tabObject.setActiveTab(value);
        }
      });
      container.vyber = function(ord){
        console.warn("DEPRECATED use of function vyber on vertical tab container, use setActiveTab instead.");
        tabObject.setActiveTab(ord);
      };
      container.appendItem = function(item){
        console.warn("DEPRECATED use of function appendItem on vertical tab container, use appendTab instead.");
        tabObject.appendTab(item.text, "", ("aktivni" in item) ? item.aktivni : false, item.id);
      };
    }

    if (this.orientation == tfw.orientation.VERTICAL) { // TODO: Set somewhere else??
      setTimeout(function(verticalScroll){
        tabObject.tabNav.scrollTop = verticalScroll;
      }, 20, tabObject.activeTab * 20);
    }

    return container;
  },
  /**
   * Create a progress bar.
   * @param {Object} params - parameters
   * @see tfw.fillElemDefs
   * @param {number} [params.max=1] - equivalent of 100 % (e. g. 100)
   * @param {number} params.value - current progress, between 0 and params.max
   * @param {boolean} [params.showPercentage=false] - if true, show "value %" after progress bar (requires params.max=100)
   * @return {HTMLElement} Created progress bar
   */
  progress: function(params){
    var progressbar = tfw.createAndFillElement("progress", params);
    progressbar.max = ("max" in params) ? params.max : 1;
    if ("showPercentage" in params && params.showPercentage) progressbar.addClass("showPercentage");
    return progressbar;
  },
  /**
   * Callback that creates content to insert into a custom column.
   * @callback tfw.DynamicTable~columnRenderer
   * @param {string} columnValue - value that was loaded as data from server
   * @return {HTMLElement[]} Return array of elements to be inserted into table cell
   */
  /**
   * Class for creating dynamic tables.
   * @class
   * @todo View preferences (order of columns)
   * @todo Custom filter renderers and custom filter functions (returning true/false if row passes/fails filter)
   * @todo freeze
   * @param {Object} params - table parameters
   * @param {string} params.baseURL - URL of script (etc.) handling data, without query string
   * @param {string} [params.urlParams] - general parameters appended to requests (e.g. a token)
   * @param {string} [params.id=dynamicTable] - table ID (name) - required for field (cell) updates
   * @param {tfw.DynamicTable~rowEdit} [params.rowEdit] - Function fired when row editing/adding is triggered
   * @param {tfw.DynamicTable~goToSub} [params.goToSub] - Function fired when moving to subordinate table is triggered
   * @param {boolean} [params.rowAdd=false] - whether to allow adding new rows
   * @param {string} [params.bodyHeight] - (CSS) height of table body including unit (to make header and footer always visible)
   * @param {boolean} [params.watchChanges=false] - whether to allow {@link tfw.DynamicTable#serverWatch|watching} for changes (long polling)
   * @param {function} [params.onload] - function to call after data is loaded for the first time
   * @param {tfw.DynamicTable~columnRenderer[]} [params.columnRenderers] - functions to create custom columns' content
   * @example
   * function myRowEditFunction(id){
   *     // ...
   * }
   * var table = document.body.appendChild(
   *  tfw.dynamicTable(
   *   {
   *    id: "table1",
   *    baseURL: "data.php",
   *    urlParams: "token=Nd5qPxH&timestamp=1234567890",
   *    rowEdit: myRowEditFunction,
   *    bodyHeight: "300px"
   *   }
   *  )
   * );
   * @see tfw.AJAX_LOADER
   */
  DynamicTable: function(params){
    /**
     * @private
     */
    var tableId = ("id" in params) ? params.id : "dynamicTable";
    /**
     * DIV containing the table.
     * @var {Object}
     * @default
     * @readonly
     */
    this.tableContainer = tfw.div({
      innerHTML: tfw.AJAX_LOADER,
      className: "tfwDynamicTableContainer"
    });
    var baseURL = params.baseURL;
    /**
     * @var {string}
     * @private
     */
    var urlParams = ("urlParams" in params) ? params.urlParams : "";
    /**
     * @var {string}
     * @private
     */
    var bodyHeight = ("bodyHeight" in params) ? params.bodyHeight : null;
    /**
     * Object representing a column in data.
     * @typedef {Object} tfw.DynamicTable~dataCol
     * @property {string} name - name (HTML)
     * @property {number} [width=200] - width (in pixels)
     * @property {boolean} [hidden=false] - hidden
     * @property {?tfw.DynamicTable.colTypes} [type=null] - type of field (string)
     * @property {boolean} [sort=false] - whether to allow sorting by this column's values
     * @property {(boolean|number)} [filter=false] - whether to allow filtering/searching (depends on type; 1=match from beginning, 2=match anywhere)
     * @property {boolean} [subtable=false] - whether this column should contain a link to subtable (handled by goToSub)
     * @property {boolean} [noresize=false] - whether this column should NOT be resizable (default is resizable)
     * @property {boolean} [readonly=false] - whether inputs in this column should be disabled
     */
    /**
     * Object representing a row in data.
     * @typedef {Object} tfw.DynamicTable~dataRow
     * @property {number} id - row ID
     * @property {string[]} cols - contents for each column (HTML)
     * @property {boolean} [readonly=false] - whether inputs in this row should be disabled
     */
    /**
     * Data obtained from server. {@link tfw.DynamicTable#reload|reload()} has to be called to fill this.
     * Any other attributes provided by server are preserved (e.g. data.meta).
     * @var {Object}
     * @default null
     * @public
     * @readonly
     * @property {tfw.DynamicTable~dataCol[]} cols - list of columns
     * @property {tfw.DynamicTable~dataRow[]} rows - list of rows
     */
    this.data = null;
    /**
     * Function that handles row editing.
     * @callback tfw.DynamicTable~rowEdit
     * @param {number} id - ID of the row being edited or 0 if new row is being inserted
     */
    /**
     * @private
     */
    var rowEdit = ("rowEdit" in params) ? params.rowEdit : null;
    /**
     * @var {boolean}
     * @private
     */
    var addRowEnabled = ("rowAdd" in params) ? params.rowAdd : false;
    if (addRowEnabled && typeof rowEdit != "function") {
      console.error("No callback was set for adding new rows.");
    }
    /**
     * @var {boolean}
     * @private
     */
    var watchChanges = ("watchChanges" in params) ? params.watchChanges : false;
    /**
     * Function that handles moving to subordinate table.
     * @callback tfw.DynamicTable~goToSub
     * @param {number} rowID - ID of the row being edited
     * @param {number} column - order number of column in which the callback was triggered
     */
    /**
     * @private
     */
    var goToSub = ("goToSub" in params) ? params.goToSub : null;
    /**
     * @private
     */
    var columnRenderers = ("columnRenderers" in params) ? params.columnRenderers : [];
    /**
     * @private
     * @var {number}
     */
    var orderDataCol = null;
    /**
     * @private
     * @var {XMLHttpRequest[]}
     */
    var pendingHttpRequests = [];
    /**
     * Function that handles data received from server.
     * @callback tfw.DynamicTable~serverCallback
     * @param {Object} receivedData - JSON decoded data received from request
     */
    /**
     * Send a table-specific request to server.
     * If table is {@link tfw.DynamicTable#destroy|destroy}ed, pending requests are aborted.
     * @param {Object} params - query parameters
     * @param {tfw.DynamicTable.serverActions} params.action - server action
     * @param {tfw.DynamicTable~serverCallback} [params.callback] - callback that receives data
     * @param {string} [params.parameters=null] - parameters to be send with the request (e.g. POST)
     * @see tfw.ajaxGet
     * @see tfw.decodeJSON
     */
    function serverCall(params){
      pendingHttpRequests.push(tfw.ajaxGet({
        url: baseURL + "?t=" + tableId + "&a=" + params.action.name + (urlParams ? ("&" + urlParams) : ""),
        method: ("method" in params.action) ? params.action.method : "GET",
        parameters: params.parameters,
        onload: function(hr){
          pendingHttpRequests.splice(pendingHttpRequests.indexOf(hr), 1);
          var receivedData = tfw.decodeJSON(hr.responseText);
          if (params.callback != null) {
            params.callback(receivedData);
          }
        }
      }));
    }
    /**
     * User preferences.
     * @private
     * @var {Object}
     */
    var preferences = null;
    /**
     * Load user preferences.
     * @private
     * @param {function} callback - callback to fire when done loading
     * @todo Fire callback even if loading is not successfull
     */
    function loadPreferences(callback){
      serverCall({
        action: tfw.DynamicTable.serverActions.PREF_GET,
        callback: function(receivedData){
          if (receivedData == null) {
            preferences = {};
          } else {
            preferences = receivedData;
          }
          callback();
        }
      });
    }
    /**
     * Save user preferences.
     * @private
     */
    function savePreferences(){
      // convert array to object
      var savedPreferences = {};
      for (var prop in preferences) {
        if (Object.prototype.hasOwnProperty.call(preferences, prop)) {
          savedPreferences[prop] = preferences[prop];
        }
      }
      serverCall({
        action: tfw.DynamicTable.serverActions.PREF_SET,
        parameters: "data=" + JSON.stringify(savedPreferences)
      });
    }
    /**
     * Save user's preference.
     * @param {string} key - preference key (name)
     * @param {string|number|boolean|Array|Object} [value] - preference value (any type) - if not set, preference is deleted
     */
    this.setPreference = function(key, value){
      if (preferences == null) {
        console.error("Preferences were not loaded yet.");
        return;
      }
      if (typeof value == "undefined") {
        delete preferences[key];
      } else {
        preferences[key] = value;
      }
      savePreferences();
    };
    /**
     * Read user's preference.
     * @param {string} key - preference key (name)
     * @return {Object} preference value (any type)
     */
    this.getPreference = function(key){
      if (preferences == null) {
        console.error("Preferences were not loaded yet.");
        return null;
      }
      return (key in preferences) ? preferences[key] : null;
    };
    /**
     * Get table container (for inserting into document).
     * @return {HTMLElement} Table container
     */
    this.getTable = function(){
      return this.tableContainer;
    };
    /** @private */
    var ajaxPendingCalls = 0;
    /** @private */
    function ifEverythingReadyCallPaint(){
      if (--ajaxPendingCalls <= 0) {
        this.paint();
      }
    }
    /**
     * Reload (or load) data from server.
     * Loads preferences and data, then {@link tfw.DynamicTable#paint|paint}s the table.
     * @see tfw.DynamicTable#paint
     * @see tfw.DynamicTable~serverCall
     */
    this.reload = function(){
      var dynamicTable = this;
      if (ajaxPendingCalls > 0) {
        console.error("Dynamic table reload called before last reload finished.");
        return;
      }
      ajaxPendingCalls = 2;
      serverCall({
        action: tfw.DynamicTable.serverActions.LOAD,
        callback: function(receivedData){
          dynamicTable.data = receivedData;

          ifEverythingReadyCallPaint.call(dynamicTable);
        }
      });
      loadPreferences(ifEverythingReadyCallPaint.bind(this));
    };
    /**
     * Watch for updates from the server.
     * @see tfw.DynamicTable#paint
     */
    this.serverWatch = function(){
      var dynamicTable = this;
      serverCall({
        action: tfw.DynamicTable.serverActions.WATCH,
        callback: function(changes){
          if (changes.length > 0) {
            dynamicTable.paint(changes);
          }
          dynamicTable.serverWatch();
        }
      });
    };
    /**
     * A "destructor" for table.
     * Aborts all pending requests created by current table.
     * Removes associated CSS.
     * @see tfw.DynamicTable~serverCall
     */
    this.destroy = function(){
      for (var i = 0; i < pendingHttpRequests.length; i++) {
        pendingHttpRequests[i].abort();
      }
      document.getElementById("tfwInsertStyle-tfwDynamicTableStyling-" + this.tableHTMLId).remove();
    };
    /**
     * Test if no filters are applied and table is sorted by column of type "order".
     * @return {boolean} True if reordering can be done, false otherwise.
     */
    this.reorderEnabled = function(){
      var sorting = this.getPreference("sorting");
      var sortedByOrder = (sorting != null && ("dataCol" in sorting) && sorting.dataCol == orderDataCol && sorting.asc == tfw.DynamicTable.sortTypes.ASC);
      return sortedByOrder && this.getVisibleRowsCount() == this.getTotalRowsCount();
    };
    /**
     * @param {Object} params - update parameters
     * @param {number} params.id - ID of edited row
     * @param {number} params.neworder - new order number of edited row
     */
    function serverUpdateOrder(params){
      serverCall({
        action: tfw.DynamicTable.serverActions.CHANGE_ORDER,
        parameters: "id=" + params.id + "&neworder=" + params.neworder
      });
    }
    /**
     * Toggle reordering of rows via drag & drop.
     * Reflects the value of a private variable set by onclick events fired with filters.
     * Recommended CSS: tr.draggable{cursor:grab}, tr.draggable:active{cursor:grabbing}
     * @listens dragstart
     * @listens dragover
     * @listens dragend
     * @listens drop
     */
    this.toggleReorder = function(){
      var dynamicTable = this;
      var rowReorderEnabled = this.reorderEnabled();
      var tbody = this.tableContainer.querySelector("tbody");
      if (rowReorderEnabled) {
        window.getSelection().removeAllRanges();
      }
      var rows = tbody.getElementsByTagName("tr");
      for (var i = 0; i < rows.length; i++) {
        rows[i][rowReorderEnabled ? "addClass" : "removeClass"]("draggable");
        rows[i].draggable = rowReorderEnabled;
        rows[i].ondragstart = rowReorderEnabled ? function(event){
          this.addClass("dragged");
          event.dataTransfer.setData("text", event.target.myOrder());
        } : null;
        rows[i].ondragover = rowReorderEnabled ? function(event){
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          var dragged = dynamicTable.tableContainer.querySelector("tbody tr.dragged");
          if (!dragged.isSameNode(this)) {
            dynamicTable.orderChange((dragged.myOrder() < this.myOrder()) ? this.nextSibling : this);
          }
          return false;
        } : null;
        rows[i].ondrop = rowReorderEnabled ? function(event){
          event.preventDefault();
        } : null;
        rows[i].ondragend = rowReorderEnabled ? function(){
          this.removeClass("dragged");
          serverUpdateOrder({
            id: this.dataset.rowid,
            neworder: this.myOrder() + 1
          });
        } : null;
      }
    };
    /**
     * Reflect a change in order in the table.
     * @param {?HTMLElement} referenceRow - before which row should be the moved row placed (if null, insert at the end)
     */
    this.orderChange = function(referenceRow){
      var draggedRow = this.tableContainer.querySelector("tbody tr.dragged");
      if (draggedRow.isSameNode(referenceRow)) {
        return;
      }
      var tbody = this.tableContainer.querySelector("tbody");
      var orderColumn = this.data.cols[orderDataCol].columnOrder;
      var originalRowOrder = draggedRow.myOrder();
      var droppedRowOrder = (referenceRow == null) ? (tbody.rows.length - 1)
        : (referenceRow.myOrder() - ((referenceRow.myOrder() < originalRowOrder) ? 0 : 1));
      tbody.insertBefore(draggedRow, referenceRow);

      this.data.rows[originalRowOrder].cols[orderDataCol] = draggedRow.cells[orderColumn].innerHTML = droppedRowOrder + 1;

      var movedDataRow = this.data.rows.splice(originalRowOrder, 1)[0];
      this.data.rows.splice(droppedRowOrder, 0, movedDataRow);

      if (originalRowOrder < droppedRowOrder) { // drag down
        tbody.rows[originalRowOrder].cells[orderColumn].innerHTML--;
        this.data.rows[originalRowOrder].cols[orderDataCol]--;
      } else { // drag up
        tbody.rows[originalRowOrder].cells[orderColumn].innerHTML = parseInt(tbody.rows[originalRowOrder].cells[orderColumn].innerHTML) + 1;
        this.data.rows[originalRowOrder].cols[orderDataCol] = parseInt(this.data.rows[originalRowOrder].cols[orderDataCol]) + 1;
      }
    };
    /**
     * @param {Object} params - update parameters
     * @param {number} params.id - ID of edited row
     * @param {number} params.col - order number of edited column
     * @param {number} params.value - new value
     */
    function serverUpdateCell(params){
      serverCall({
        action: tfw.DynamicTable.serverActions.SAVE,
        parameters: "id=" + params.id + "&col=" + params.col + "&value=" + encodeURIComponent(params.value)
      });
    }
    /**
     * Updates data and sends change to server.
     * @param {HTMLElement} input - input field in a cell of dynamic table
     * @param {string} input.value - value that can be obtained
     * @see tfw.DynamicTable~serverUpdateCell
     */
    this.updateInput = function(input){
      var rowID = input.closest("tr").dataset.rowid;
      var dataCol = input.closest("td").dataset.dataCol;
      var value = input.value;
      var rowOrder = this.getDataRowById(rowID);
      if (rowOrder == null) {
        console.error("Input was updated in a row with ID not present in data.");
      }
      this.data.rows[rowOrder].cols[dataCol] = value;
      serverUpdateCell({
        id: rowID,
        col: dataCol,
        value: value
      });
    };
    /**
     * Set active arrow (and make other arrows of same group inactive).
     * @param {HTMLElement} element - arrow to make active
     * @param {HTMLElement} base - where to search for arrows
     * @param {boolean} [on=true] - whether to toggle active on or off
     */
    function setActiveArrow(element, base, on){
      if (typeof base != "undefined" && base != null) {
        var arrowType = null,
            arrowGroup = null,
            arrowGroups = [
            [tfw.DynamicTable.arrowTypes.FILTER],
            [tfw.DynamicTable.arrowTypes.UP, tfw.DynamicTable.arrowTypes.DOWN]
            ],
            i;
        for (var j = 0; j < arrowGroups.length; j++) {
          var arrowTypes = arrowGroups[j];
          for (i in arrowTypes) {
            if (element.hasClass(arrowTypes[i])) {
              arrowGroup = arrowTypes;
              arrowType = arrowTypes[i];
            }
          }
        }
        if (arrowType == null) {
          console.error("setActiveArrow called on invalid element.");
        } else {
          var otherArrows = base.getElementsByClassName("tfwArrow");
          for (i = 0; i < otherArrows.length; i++) {
            if (otherArrows[i].hasAnyClass(arrowGroup.join(" "))) {
              otherArrows[i].removeClass("active");
            }
          }
        }
      }
      if (element != null && (typeof on == "undefined" || on)) {
        element.addClass("active");
      }
    }
    /**
     * @private
     * @param {Object} cell - the cell from which to move (TD)
     * @param {number} column - order number of column in which the cell is in
     * @param {number} shift - how many rows to move by (positive = down, negative = up)
     */
    function moveFocusToCell(cell, column, shift){
      var row = cell.parentNode,
          shifted = shift;
      while (shifted < 0) {
        row = row.previousSibling;
        if (row == null) {
          return;
        }
        shifted++;
      }
      while (shifted > 0) {
        row = row.nextSibling;
        if (row == null) {
          return;
        }
        shifted--;
      }
      row.children[column].querySelector("input").focus();
    }
    /**
     * @private
     * @param {number} dataCol - order of column (in data)
     * @return {boolean}
     */
    this.isColumnVisible = function(dataCol){
      return (!("hidden" in this.data.cols[dataCol]) || this.data.cols[dataCol].hidden === false)
        && !(this.tableContainer.querySelector("thead").rows[0].cells[this.data.cols[dataCol].columnOrder].hasClass("hideColumn"));
    };
    /**
     * @private
     */
    this.setTableWidth = function(){
      var dynamicTable = this,
          width = this.data.cols.reduce(function(previous, current, dataCol){
            return (dynamicTable.isColumnVisible(dataCol) ? parseInt(current.width) : 0) + previous;
          }, 0);
      if (rowEdit) {
        width += tfw.DynamicTable.ROW_EDIT_WIDTH;
      }
      width += 10; // scrollbar

      this.tableContainer.querySelector("table").style.width = width + "px";
    };
    /**
     * @private
     * @param {number} dataCol - order of column (in data)
     * @param {number} newWidth - width in pixels
     */
    this.setColumnCellsWidths = function(dataCol, newWidth){
      var columnOrder = this.data.cols[dataCol].columnOrder,
          cells = this.tableContainer.querySelectorAll("thead tr > :nth-child(" + (parseInt(columnOrder) + 1) + "), "
          + "tbody tr > :nth-child(" + (parseInt(columnOrder) + 1) + ")");
      for (var i = 0; i < cells.length; i++) {
        cells[i].style.width = newWidth + "px";
      }
      this.data.cols[dataCol].width = newWidth;
      this.setTableWidth();
    };
    /**
     * Set width of a column.
     * @param {number} dataCol - order of column (in data)
     * @param {number} width - width of column in pixels
     * @param {boolean} [dontSave=false] - don't save into preferences
     */
    this.setColumnWidth = function(dataCol, width, dontSave){
      if (typeof dontSave == "undefined" || !dontSave) {
        this.setWidthsPreference(width, dataCol, !dontSave);
      }

      this.setColumnCellsWidths(dataCol, width);
    };
    /**
     * @private
     * @param {number} rowOrder - order of row in data
     * @return {HTMLElement} table row
     */
    this.createRow = function(rowOrder){
      var readonlyRow = ("readonly" in this.data.rows[rowOrder]) && this.data.rows[rowOrder].readonly === true,
          r = tfw.tr({
            id: "rowID-" + this.data.rows[rowOrder].id
          });
      if (readonlyRow) {
        r.addClass("readonly");
      }
      r.setAttribute("data-rowid", this.data.rows[rowOrder].id);
      var columnOrder = 0,
          b,
          dynamicTable = this;
      if (rowEdit) {
        r.add(tfw.td({
          className: "rowEditCell",
          children: [b = tfw.span({
            className: "rowEditIcon clickable icon fa fa-info"
          })]
        }));
        if (readonlyRow) {
          b.addClass("disabled");
        } else {
          b.onclick = rowEdit.bind(null, dynamicTable.data.rows[rowOrder].id);
        }
        columnOrder++;
      }
      var updateInputCallback = function(){
        dynamicTable.updateInput(this);
      };
      var val,
          shift,
          type,
          c,
          readonlyCol,
          keyCallback = function(event){
            switch (event.keyCode) {
              case 38: // up
                shift = -1;
                break;
              case 40: // down
                shift = 1;
                break;
              default:
                return;
            }
            moveFocusToCell(this.closest("td"), this.dataset.columnOrder, shift);
          };
      for (var j = 0; j < this.data.cols.length; j++) {
        if (!("hidden" in this.data.cols[j])) {
          var params = {};
          params.children = [];
          if ("subtable" in this.data.cols[j] && this.data.cols[j].subtable) {
            params.className = "withSubtable";
            params.children.push(b = tfw.div({
              className: "subtable clickable icon fa fa-caret-down"
            }));
            b.onclick = goToSub.bind(null, dynamicTable.data.rows[rowOrder].id, j);
          }
          val = this.data.rows[rowOrder].cols[j];
          readonlyCol = ("readonly" in this.data.cols[j]) && this.data.cols[j] === true;
          if (typeof columnRenderers[j] == "function") {
            params.children.push.apply(params.children, columnRenderers[j](val));
          } else {
            type = ("type" in this.data.cols[j]) ? this.data.cols[j].type : null;
            var id = "tfwDynamicTable-" + rowOrder + "-" + columnOrder;
            var setKeys = null;
            switch (type) {
              case tfw.DynamicTable.colTypes.CHECKBOX:
                params.children.push(tfw.checkbox({
                  id: id,
                  value: (val ? 1 : 0),
                  onchange: updateInputCallback,
                  disabled: readonlyRow || readonlyCol
                }));
                break;
              case tfw.DynamicTable.colTypes.NUMBER:
                params.children.push(setKeys = tfw.input({
                  type: "number",
                  id: id,
                  value: val,
                  onchange: updateInputCallback,
                  readOnly: readonlyRow || readonlyCol
                }));
                break;
              case tfw.DynamicTable.colTypes.DATE:
                params.children.push(tfw.calendar({
                  id: id,
                  value: val.match(/\d{4,}-\d{2}-\d{2}/)[0],
                  onchange: updateInputCallback,
                  readOnly: readonlyRow || readonlyCol
                }));
                break;
              case tfw.DynamicTable.colTypes.TEXT:
                params.children.push(setKeys = tfw.input({
                  type: "text",
                  id: id,
                  value: val,
                  onchange: updateInputCallback,
                  readOnly: readonlyRow || readonlyCol
                }));
                break;
              default:
                params.innerHTML = val;
            }
            if (setKeys != null) {
              setKeys.dataset.columnOrder = columnOrder;
              setKeys.addEventListener("keyup", keyCallback);
            }
          }
          r.add(c = tfw.td(params));
          c.dataset.dataCol = j;
          c.style.width = this.data.cols[j].width + "px";
          columnOrder++;
        }
      }
      return r;
    };
    /**
     * Get visible rows count (from HTML table).
     * @private
     * @return {number}
     */
    this.getVisibleRowsCount = function(){
      return [].slice.call(this.tableContainer.querySelectorAll("tbody tr")).reduce(function(previous, current){
        return previous + ((current.className.match(/(^| )filter[0-9]+Invalid( |$)/)) ? 0 : 1);
      }, 0);
    };
    /**
     * Get total rows count (from HTML table).
     * @private
     * @return {number}
     */
    this.getTotalRowsCount = function(){
      return this.tableContainer.querySelectorAll("tbody tr").length;
    };
    /**
     * Recompute rows counts and update text in table footer.
     * @private
     */
    function updateRowCounts(){
      var vis = this.getVisibleRowsCount();
      var tot = this.getTotalRowsCount();
      $(this.tableHTMLId + "-hiddenRowsInfo").style.display = (vis == tot) ? "none" : "inline-block";
      $(this.tableHTMLId + "-hiddenRowsCount").innerHTML = tfw.strings.HIDDEN_ROWS + ": " + (tot - vis);
    }

    /**
     * @private
     * @return {function} mouse down callback
     */
    function setupColumnResizing(){
      if (typeof document.body.dataset.colResizingSet == "undefined" || !document.body.dataset.colResizingSet) {
        document.body.dataset.colResizingSet = true;

        var RESIZING_MIN_WIDTH = 40;
        document.body.addEventListener("mousemove", function(event){
          if (typeof window._resizedElement != "undefined") {
            var cell = window._resizedElement;
            var diff = event.clientX - cell._resizePositionX;
            if (diff != 0) {
              cell.dispatchEvent(new CustomEvent("resizing", {detail: {move: diff}}));

              /** @todo apply min/max width */
              var width = parseInt(cell.style.width) + diff;
              if (width < RESIZING_MIN_WIDTH) {
                width = RESIZING_MIN_WIDTH;
              }
              cell.style.width = width + "px";

              cell._resizePositionX = event.clientX;
            }
          }
        });

        var resizerMouseEnd = function(){
          if (typeof window._resizedElement != "undefined") {
            var cell = window._resizedElement;
            cell.dispatchEvent(new CustomEvent("resizestop"));
            document.body.removeClass("resizing");
            delete window._resizedElement;
          }
        };
        document.body.addEventListener("mouseup", resizerMouseEnd);
        document.addEventListener("mouseout", function(event){
          if (!event.relatedTarget || event.relatedTarget.nodeName == "HTML") {
            resizerMouseEnd(event);
          }
        });
      }

      return function(event){
        var cell = window._resizedElement = event.target.closest("th");
        cell.dispatchEvent(new CustomEvent("resizestart"));
        document.body.addClass("resizing");
        cell._resizePositionX = event.clientX;
      };
    }

    /**
     * @private
     * @return {HTMLElement}
     */
    this.createAndFillTableHead = function(){
      var thead = document.createElement("thead"),
          r;
      thead.add(r = tfw.tr({
        className: "headlines"
      }));

      var resizerMouseDown = setupColumnResizing();

      /**
       * @private
       * @param {number} resizedDataCol
       * @param {number} newWidth
       */
      var onResizeCallback = function(resizedDataCol, newWidth){
        if (newWidth != this.data.cols[resizedDataCol].width) {
          this.setColumnCellsWidths(resizedDataCol, newWidth);
        }
      };

      var columnOrder = 0;
      if (rowEdit) {
        var th = document.createElement("th");
        th.innerHTML = "&nbsp;";
        th.className = "rowEditCell";
        r.add(th);
        columnOrder++;
      }
      var resizer,
          d,
          j,
          c,
          b,
          dynamicTable = this,
          filterOnclick = function(){
            dynamicTable.filter(this, this.dataset.dataCol);
          };
      for (j = 0; j < this.data.cols.length; j++) {
        if (!("hidden" in this.data.cols[j])) {
          c = document.createElement("th");
          c.add(d = tfw.span({className: "colHeadingControl"}));
          var deltaWidth = 0;
          if ("filter" in this.data.cols[j] && this.data.cols[j].filter && this.data.cols[j].type) {
            d.add(b = tfw.div({
              className: "tfwArrow " + tfw.DynamicTable.arrowTypes.FILTER
            }));
            b.dataset.dataCol = j;
            b.onclick = filterOnclick;
            deltaWidth += 16;
          }
          if ("sort" in this.data.cols[j] && this.data.cols[j].sort) {
            var b1,
                b2;
            d.add(b2 = tfw.div({
              className: "tfwArrow " + tfw.DynamicTable.arrowTypes.UP,
              style: "position:relative;left:2px;"
            }));
            b2.dataset.sortOrder = tfw.DynamicTable.sortTypes.ASC;
            d.add(b1 = tfw.div({
              className: "tfwArrow " + tfw.DynamicTable.arrowTypes.DOWN
            }));
            b1.dataset.sortOrder = tfw.DynamicTable.sortTypes.DESC;
            b1.dataset.dataCol = b2.dataset.dataCol = j;
            b1.onclick = b2.onclick = function(){
              dynamicTable.sort(this.dataset.dataCol, this.dataset.sortOrder);
            };
            deltaWidth += 24;
          }
          if (!("noresize" in this.data.cols[j]) || this.data.cols[j].noresize === false) {
            c.addClass("resizable");
            d.add(resizer = tfw.span({className: "resizer"}));
            resizer.addEventListener("mousedown", resizerMouseDown);
            c.addEventListener("resizing", function(){
              onResizeCallback.call(dynamicTable, this.dataset.dataCol, parseInt(this.style.width));
            });
            c.addEventListener("resizestop", function(){
              dynamicTable.setColumnWidth(this.dataset.dataCol, parseInt(this.style.width));
            });
            deltaWidth += 8;
          }

          c.add(tfw.span({className: "colHeading", innerHTML: this.data.cols[j].name, style: "width: calc(100% - " + deltaWidth + "px);"}));

          if ("width" in this.data.cols[j]) {
            this.data.cols[j].width = parseInt(this.data.cols[j].width);
          } else {
            this.data.cols[j].width = 200;
          }
          c.style.width = this.data.cols[j].width + "px";
          c.dataset.dataCol = j;
          r.add(c);
          this.data.cols[j].columnOrder = columnOrder;
          columnOrder++;
        }
      }
      return thead;
    };

    /** @private */
    this.createAndFillTable = function(){
      // add CSS styling for filters
      var tableCSS = "";
      for (var dataCol = 0; dataCol < this.data.cols.length; dataCol++) {
        tableCSS += "#" + this.tableHTMLId + " .filter" + dataCol + "Invalid{display:none}\n";
      }
      tfw.insertStyle(tableCSS, "tfwDynamicTableStyling-" + this.tableHTMLId);
      this.tableContainer.innerHTML = "";
      var o,
          dynamicTable = this;
      this.tableContainer.add(o = tfw.table({
        id: this.tableHTMLId,
        className: "tfwDynamicTable"
      }));
      o.addEventListener("focus", function(event){
        dynamicTable.setFocusedRow(dynamicTable.data.rows[event.target.closest("tr").myOrder()].id);
      }, true);
      o.addEventListener("blur", this.setFocusedRow.bind(this, null), true);
      for (var j = 0; j < this.data.cols.length; j++) {
        if (!this.data.cols[j].hidden && this.data.cols[j].type == "order") {
          this.data.cols[j].sort = true;
          orderDataCol = j;
        }
      }

      o.appendChild(this.createAndFillTableHead());

      var tbody;
      o.add(tbody = document.createElement("tbody"));
      if (bodyHeight != null) {
        tbody.style.maxHeight = bodyHeight;
      }
      for (var i = 0; i < this.data.rows.length; i++) {
        tbody.add(this.createRow(i));
      }
      var tfoot;
      o.add(tfoot = document.createElement("tfoot"));
      tfoot.add(tfw.tr({
        children: [
          tfw.td(addRowEnabled ? {
            children: [
              tfw.button({
                onclick: rowEdit.bind(null, 0),
                innerHTML: "<span class=\"fa fa-plus\"></span>"
              })
            ]
          } : {}), tfw.td({
            children: [
              tfw.div({
                id: this.tableHTMLId + "-hiddenRowsInfo",
                children: [
                  tfw.span({
                    id: this.tableHTMLId + "-hiddenRowsCount"
                  }), tfw.button({
                    className: "resetTableFilter",
                    onclick: function(){
                      dynamicTable.resetFilters();
                    },
                    innerHTML: "<span class=\"tfwArrow filter reset\"></span>"
                  })
                ]
              })
            ]
          }), tfw.td({
            children: [
              tfw.button({
                onclick: function(){
                  dynamicTable.toggleColumnDialog(this);
                },
                innerHTML: "<span class=\"fa fa-cog\"></span>"
              })
            ]
          })
        ]
      }));
      updateRowCounts.call(dynamicTable);
      this.setTableWidth();
    };
    /**
     * @private
     * @var {Object}
     */
    var defaultFilterValues = null;
    /**
     * Get row order in data from row's ID.
     * @private
     * @param {number} rowID - ID of row
     * @return {number} row's order in data
     */
    this.getDataRowById = function(rowID){
      var rowOrder = null;
      for (var j = 0; j < this.data.rows.length; j++) {
        if (this.data.rows[j].id == rowID) {
          rowOrder = j;
          break;
        }
      }
      return rowOrder;
    };

    /**
     * @private
     * @param {number} rowOrder - row order (in data)
     * @param {number} dataCol - column order (in data)
     * @param {string|number} newValue - new value
     */
    this.updateCellFromChange = function(rowOrder, dataCol, newValue){
      this.data.rows[rowOrder].cols[dataCol] = newValue;
      var cell = this.tableContainer.querySelector("tbody").rows[rowOrder].cells[this.data.cols[dataCol].columnOrder];
      cell.addClass("hasBeenChanged");
      setTimeout(function(updatedCell){
        updatedCell.removeClass("hasBeenChanged");
      }, 3000, cell);
      if (typeof columnRenderers[dataCol] == "function") {
        cell.innerHTML = "";
        tfw.addAll(cell, columnRenderers[dataCol](newValue));
      } else {
        switch (this.data.cols[dataCol].type) {
          case tfw.DynamicTable.colTypes.CHECKBOX:
            cell.querySelector(".tfwCheckbox").value = parseInt(newValue);
            break;
          case tfw.DynamicTable.colTypes.NUMBER:
          case tfw.DynamicTable.colTypes.DATE:
          case tfw.DynamicTable.colTypes.TEXT:
            cell.querySelector("input").value = newValue;
            break;
          default:
            cell.innerHTML = newValue;
        }
      }
    };

    /** @private */
    this.paintNew = function(){
      this.createAndFillTable();
      if (watchChanges) {
        this.serverWatch();
      }
      if ("onload" in params) {
        params.onload();
      }
      // hide columns
      var hiddenColumns = this.getPreference("hiddenColumns"),
          dataCol;
      if (hiddenColumns != null) {
        for (dataCol in hiddenColumns) {
          if (hiddenColumns[dataCol] === true && this.isColumnVisible(dataCol)) {
            this.toggleColumn(dataCol, true);
          }
        }
      }
      // apply column widths
      var widths = this.getPreference("widths");
      if (widths != null) {
        for (dataCol in widths) {
          if (Object.prototype.hasOwnProperty.call(widths, dataCol)) {
            this.setColumnWidth(dataCol, widths[dataCol], true);
          }
        }
      }
    };

    /**
     * @private
     * @param {tfw.DynamicTable~dataChange[]} changes
     * @return {boolean} true if change happened in the column by which the table is sorted
     */
    this.paintChanges = function(changes){
      var tbody = this.tableContainer.querySelector("tbody"),
          rowOrder,
          rowID,
          sorting = this.getPreference("sorting"),
          changeInSortCol = false,
          dataCol;
      for (var i = 0; i < changes.length; i++) {
        rowID = changes[i].id;
        if ("col" in changes[i]) { // update
          dataCol = changes[i].col;
          var newValue = changes[i].value;
          rowOrder = this.getDataRowById(rowID);
          if (rowOrder == null) {
            console.error("Row that is not present in the table was updated. (id=" + rowID + ")");
          } else if (newValue == this.data.rows[rowOrder].cols[dataCol]) {
            console.warn("Server watch sent change to same content.");
          } else {
            this.updateCellFromChange(rowOrder, dataCol, newValue);
            if (sorting != null && sorting.dataCol == dataCol) {
              changeInSortCol = true;
            }
          }
        } else if ("cols" in changes[i]) { // insertion
          var comparator = this.getCmp(sorting === null ? null : sorting.dataCol).bind(null, sorting.asc);
          rowOrder = this.data.rows.push({id: rowID, cols: changes[i].cols}) - 1;
          var newRow = this.createRow(rowOrder);
          var greaterRow = null;
          for (i = 0; i < this.data.rows.length - 1; i++) { // don't iterate over new row
            if (comparator(this.data.rows[rowOrder], this.data.rows[i]) < 0) {
              greaterRow = tbody.rows[i];
              break;
            }
          }
          tbody.insertBefore(newRow, greaterRow);
        } else { // deletion
          rowOrder = this.getDataRowById(rowID);
          this.data.rows.splice(rowOrder, 1);
          if (rowOrder === null) {
            console.error("Row that is not present in the table was deleted.");
          } else {
            tbody.rows[rowOrder].remove();
            if (orderDataCol !== null && this.reorderEnabled()) {
              for (i = rowOrder; i < this.data.rows.length; i++) {
                this.data.rows[i].cols[orderDataCol] -= 1;
                tbody.rows[i].cells[this.data.cols[orderDataCol].columnOrder].innerHTML -= 1;
              }
            }
          }
        }
      }
      return changeInSortCol;
    };

    /**
     * Object representing an update/insertion/deletion in data.
     * Type of change is determined by present properties.
     * @typedef {Object} tfw.DynamicTable~dataChange
     * @param {number} id - ID of row - if neither col nor cols are present, implies deletion
     * @param {number} [col] - column number of updated cell (in data) - implies update
     * @param {string} [value] - new value of updated cell - for change only
     * @param {string[]} [cols] - values of inserted row - implies insertion
     */
    /**
     * Refresh the content of the table using data gotten by (re)loading.
     * Assumes that there is only 1 order column and that data is initially sorted by that column.
     * @param {tfw.DynamicTable~dataChange[]} [changes] - changes made to data (loaded by {@link tfw.DynamicTable#serverWatch|watch})
     * @todo Change checkbox value so that it's not sent back to server
     * @todo Handle update of cell that is currently being edited
     */
    this.paint = function(changes){
      var changeInSortCol;
      this.tableHTMLId = "dynamicTable-" + tableId;
      if (document.getElementById(this.tableHTMLId) == null) {
        this.paintNew();
        changeInSortCol = true;
      } else if (typeof changes == "undefined") {
        console.error("Dynamic table reloading not implemented yet.");
      } else {
        changeInSortCol = this.paintChanges(changes);
      }
      // calculate filter default values
      defaultFilterValues = {};
      var columnValues,
          minV,
          maxV;
      for (var i = 0; i < this.data.cols.length; i++) {
        if (this.data.cols[i].filter) {
          var defaultValue;
          switch (this.data.cols[i].type) {
            case tfw.DynamicTable.colTypes.CHECKBOX:
              defaultValue = "0";
              break;
            case tfw.DynamicTable.colTypes.TEXT:
              defaultValue = "";
              break;
            case tfw.DynamicTable.colTypes.DATE:
              columnValues = this.data.rows.map(function(row){return row.cols[i];}).sort();//eslint-disable-line no-loop-func
              minV = columnValues[0];
              maxV = columnValues.pop();
              defaultValue = {
                min: minV,
                max: maxV
              };
              break;
            case tfw.DynamicTable.colTypes.NUMBER:
              columnValues = this.data.rows.map(function(row){return row.cols[i];});//eslint-disable-line no-loop-func
              minV = Math.min.apply(null, columnValues);
              maxV = Math.max.apply(null, columnValues);
              defaultValue = {
                min: minV,
                max: maxV
              };
              break;
            default:
              console.error("Cannot calculate default value for filter on field of unsupported type \"" + this.data.cols[i].type + "\"");
          }
          defaultFilterValues[i] = defaultValue;
        }
      }
      // apply filters
      var filterValues = this.getPreference("filterValues");
      if (filterValues != null) {
        for (var dataCol in filterValues) {
          if (filterValues[dataCol] != null) {
            this.filterAny(dataCol, filterValues[dataCol], this.data.cols[dataCol].type, true);
          }
        }
      }
      // apply sorting
      var sorting = this.getPreference("sorting");
      if (sorting == null) {
        this.toggleReorder();
      } else if (changeInSortCol) {
        this.sort(sorting.dataCol, sorting.asc, true);
      }
    };
    /**
     * Range represented by object with min and max properties (strings for date, numbers for numeric).
     * @typedef {Object} tfw.DynamicTable~filterRange
     * @property {(string|number)} min
     * @property {(string|number)} max
     */
    /**
     * Value by which the table can be filtered.
     * @typedef {(string|tfw.DynamicTable~filterRange)} tfw.DynamicTable~filterValue
     */
    /**
     * @private
     * @param {tfw.DynamicTable~filterValue} value - filter value
     * @param {number} dataCol - order of filtered column (in data)
     * @param {boolean} [save=true] - whether to save immidiatelly
     */
    this.setFilterPreferenceIfNotDefault = function(value, dataCol, save){
      var filterValues = this.getPreference("filterValues");
      if (filterValues == null) {
        filterValues = {};
      }
      if (this.isFilterValueDefault(value, dataCol)) {
        delete filterValues[dataCol];
      } else {
        filterValues[dataCol] = value;
      }
      if (typeof save == "undefined" || save) {
        this.setPreference("filterValues", filterValues);
      }
    };
    /**
     * Save column's width into preferences.
     * @private
     * @param {number} width
     * @param {number} dataCol - order of column (in data)
     * @param {boolean} [save=true] - whether to save into preferences
     */
    this.setWidthsPreference = function(width, dataCol, save){
      var widths = this.getPreference("widths");
      if (widths == null) {
        widths = {};
      }
      if (this.data.cols[dataCol].width == width) {
        delete widths[dataCol];
      } else {
        widths[dataCol] = width;
      }
      if (typeof save == "undefined" || save) {
        this.setPreference("widths", widths);
      }
    };
    /**
     * @private
     * @param {string} preference - preference name
     * @param {number} dataCol - order of column (in data)
     * @return {tfw.DynamicTable~filterValue|Object} preference value
     */
    this.getColumnPreference = function(preference, dataCol){
      var values = this.getPreference(preference);
      if (values != null && dataCol in values) {
        return values[dataCol];
      } else {
        return null;
      }
    };
    /**
     * Test whether a value if filter's default.
     * @private
     * @param {tfw.DynamicTable~filterValue} value - filter value
     * @param {number} dataCol - order of filtered column (in data)
     * @return {boolean}
     */
    this.isFilterValueDefault = function(value, dataCol){
      if (typeof value == "object" && ("min" in value || "max" in value)) {
        return (!("min" in value) || value.min === defaultFilterValues[dataCol].min)
          && (!("max" in value) || value.max === defaultFilterValues[dataCol].max);
      }
      return value === defaultFilterValues[dataCol];
    };
    /** @private */
    this.filterContainer = null;
    /**
     * Apply filter for values of a column.
     * Creates a {@link tfw.dialog|dialog} with filter (and moves focus to input field).
     * @param {HTMLElement} filterElement - element to position new layer to
     * @param {number} dataCol - order of searched column (in data)
     * @todo Change rangeMin/rangeMax/dateMin/dateMax classes + {@link tfw.DynamicTable#filterAny}
     */
    this.filter = function(filterElement, dataCol){
      var dynamicTable = this;
      if (this.data.cols[dataCol].hidden) {
        console.error("Tried to apply filter on a hidden column.");
        return;
      } else if (!("filter" in this.data.cols[dataCol]) || !this.data.cols[dataCol].filter) {
        console.error("Tried to apply filter on a column with no filter.");
        return;
      }
      var c = document.createElement("div");
      var type = this.data.cols[dataCol].type,
          value = this.getColumnPreference("filterValues", dataCol),
          minV,
          maxV,
          f1,
          f2,
          inputToFocus = null;
      switch (type) {
        case tfw.DynamicTable.colTypes.CHECKBOX:
          var filter = tfw.select({
            list: [tfw.strings.ALL, tfw.strings.YES, tfw.strings.NO].join(";"),
            value: value,
            onchange: function(){
              dynamicTable.filterAny(this.dataset.dataCol, this.value);
            }
          });
          filter.dataset.dataCol = dataCol;
          filter.addEventListener("click", function(event){
            event.stopPropagation();
          });
          c.add(filter);
          break;
        case tfw.DynamicTable.colTypes.NUMBER:
          minV = defaultFilterValues[dataCol].min;
          maxV = defaultFilterValues[dataCol].max;
          f1 = tfw.input({
            type: "number",
            className: "rangeMin",
            onchange: function(){
              var max = this.closest("th").querySelector(".rangeMax");
              max.min = this.value;
              if (parseInt(max.value) < parseInt(max.min)) {
                max.value = max.min;
                max.onchange();
              }
              dynamicTable.filterAny(this.dataset.dataCol, this.value);
            },
            min: minV,
            max: maxV,
            value: (value) ? value.min : minV,
            legend: tfw.strings.FROM
          });
          f2 = tfw.input({
            type: "number",
            className: "rangeMax",
            onchange: function(){
              var min = this.closest("th").querySelector(".rangeMin");
              min.max = this.value;
              if (parseInt(min.value) > parseInt(min.max)) {
                min.value = min.max;
                min.onchange();
              }
              dynamicTable.filterAny(this.dataset.dataCol, this.value, -1);
            },
            min: minV,
            max: maxV,
            value: (value) ? value.max : maxV,
            legend: tfw.strings.TO
          });
          inputToFocus = f1.querySelector(".rangeMin");
          f1.querySelector(".rangeMin").dataset.dataCol = f2.querySelector(".rangeMax").dataset.dataCol = dataCol;
          c.add(f1);
          c.add(f2);
          f1.addEventListener("click", function(event){
            event.stopPropagation();
          });
          f2.addEventListener("click", function(event){
            event.stopPropagation();
          });
          break;
        case tfw.DynamicTable.colTypes.DATE:
          minV = defaultFilterValues[dataCol].min;
          maxV = defaultFilterValues[dataCol].max;

          f1 = tfw.input({
            type: "text",
            className: "dateMin",
            value: (value) ? value.min : minV.match(/\d{4,}-\d{2}-\d{2}/)[0],
            legend: tfw.strings.FROM
          });
          tfw.calendarExtend(inputToFocus = f1.querySelector("input"));
          f1.querySelector("input").addEventListener("change", function(){
            dynamicTable.filterAny(this.dataset.dataCol, {
              min: this.value,
              max: this.closest("div").querySelector(".dateMax").value
            });
          });

          f2 = tfw.input({
            type: "text",
            className: "dateMax",
            value: (value) ? value.max : maxV.match(/\d{4,}-\d{2}-\d{2}/)[0],
            legend: tfw.strings.TO
          });
          tfw.calendarExtend(f2.querySelector("input"));
          f2.querySelector("input").addEventListener("change", function(){
            dynamicTable.filterAny(this.dataset.dataCol, {
              min: this.closest("div").querySelector(".dateMin").value,
              max: this.value
            });
          });

          f1.querySelector("input").size = f2.querySelector("input").size = 10;
          f1.querySelector(".dateMin").dataset.dataCol = f2.querySelector(".dateMax").dataset.dataCol = dataCol;
          f1.addEventListener("click", function(event){
            event.stopPropagation();
          });
          f2.addEventListener("click", function(event){
            event.stopPropagation();
          });
          c.add(f1);
          c.add(f2);
          break;
        case tfw.DynamicTable.colTypes.TEXT:
          var searchInput = inputToFocus = tfw.input({
            type: "text",
            placeholder: tfw.strings.FILTER,
            value: value,
            onchange: function(){
              dynamicTable.filterAny(this.dataset.dataCol, this.value.trim(), this.dataset.searchType);
            }
          });
          searchInput.dataset.searchType = this.data.cols[dataCol].search;
          searchInput.dataset.dataCol = dataCol;
          searchInput.onkeyup = function(){
            dynamicTable.filterAny(this.dataset.dataCol, this.value.trim(), this.dataset.searchType, true);
          };
          c.add(searchInput);
          searchInput.addEventListener("click", function(event){
            event.stopPropagation();
          });
          break;
        default:
          console.error("Tried to apply filter on type that is not supported: \"" + type + "\"");
          return;
      }
      if (tfw.DynamicTable.placePositionedDialog == null) console.error("tfw.DynamicTable.placePositionedDialog has not been set.");
      else tfw.DynamicTable.placePositionedDialog(filterElement.closest("th"), c);
      this.filterContainer = c;
      if (inputToFocus !== null) {
        inputToFocus.focus();
      }
    };
    /**
     * Compare two numbers - for use with sorting functions.
     * @private
     * @param {number} a - number to be compared
     * @param {number} b - number to compare to
     * @return {number} -1 if a < b, 0 if a == b, 1 if a > b
     */
    function cmp(a, b){
      var l = parseInt(a),
          r = parseInt(b);
      return l < r ? -1 : l > r;
    }
    /**
     * Compare two table rows by their IDs - for use with sorting functions.
     * @private
     * @param {tfw.DynamicTable.sortTypes} asc - sorting type (ascending or descending)
     * @param {tfw.DynamicTable~dataRow} row1 - row to be compared
     * @param {tfw.DynamicTable~dataRow} row2 - row to compare to
     * @return {number} -1 if a < b, 0 if a == b, 1 if a > b
     */
    function cmpRowsIds(asc, row1, row2){
      return cmp(row1.id, row2.id) * asc;
    }
    /**
     * Compare two table rows by numeric value of a column - for use with sorting functions.
     * @private
     * @param {number} dataCol - order of column (in data)
     * @param {tfw.DynamicTable.sortTypes} asc - sorting type (ascending or descending)
     * @param {tfw.DynamicTable~dataRow} row1 - row to be compared
     * @param {tfw.DynamicTable~dataRow} row2 - row to compare to
     * @return {number} -1 if a < b, 0 if a == b, 1 if a > b
     */
    function cmpNumericRows(dataCol, asc, row1, row2){
      var a = row1.cols[dataCol],
          b = row2.cols[dataCol];
      return (a == b) ? cmpRowsIds(asc, row1, row2) : (cmp(a, b) * asc);
    }
    /**
     * Compare two table rows alphabetically by value of a column - for use with sorting functions.
     * @private
     * @param {number} dataCol - order of column (in data)
     * @param {tfw.DynamicTable.sortTypes} asc - sorting type (ascending or descending)
     * @param {tfw.DynamicTable~dataRow} row1 - row to be compared
     * @param {tfw.DynamicTable~dataRow} row2 - row to compare to
     * @return {number} -1 if a < b, 0 if a == b, 1 if a > b
     */
    function cmpTextRows(dataCol, asc, row1, row2){
      var a = row1.cols[dataCol],
          b = row2.cols[dataCol];
      return (a === "" && b === "") ? (cmpRowsIds(asc, row1, row2))
        : ((a === "") ? 1 : ((b === "") ? -1 : ((a.localeCompare(b) * asc) || cmpRowsIds(asc, row1, row2))));
    }

    /**
     * Get comparator function for certain column.
     * @private
     * @param {number} dataCol - order of column (in data)
     * @return {function} row comparator
     */
    this.getCmp = function(dataCol){
      return (dataCol === null) ? cmpRowsIds : (
        (tfw.DynamicTable.colTypes.cmpType[this.data.cols[dataCol].type] == tfw.DynamicTable.colCmpTypes.NUMERIC)
          ? cmpNumericRows : cmpTextRows
      ).bind(null, dataCol);
    };

    /**
     * Apply sorting by values (text without HTML) of a column.
     * Text fields are sorted locale aware, with empty strings always last.
     * @param {?number} dataCol - order of column (in data), if null sorts by IDs
     * @param {tfw.DynamicTable.sortTypes} asc - sorting type (ascending or descending)
     * @param {boolean} [dontSave=false] - don't save into preferences
     */
    this.sort = function(dataCol, asc, dontSave){
      var tbody = this.tableContainer.querySelector("tbody");
      if (dataCol !== null) {
        if (typeof dontSave == "undefined" || !dontSave) {
          this.setPreference("sorting", {
            dataCol: dataCol,
            asc: asc
          });
        }
        var column = this.data.cols[dataCol].columnOrder;
        this.setActiveFilterInColumn(column, true, tfw.DynamicTable.arrowTypes[asc == 1 ? "UP" : "DOWN"], this.tableContainer);
      }

      var comp = this.getCmp(dataCol).bind(null, asc);
      this.data.rows.sort(comp);

      var i = 0;
      if (this.focusedRowId != null) {
        // sort so that focused row is not moved, therefore not looses focus
        var focusedDataRow = this.data.rows[this.getDataRowById(this.focusedRowId)],
            focusedRow = tbody.rows.namedItem("rowID-" + this.focusedRowId);
        while (comp(this.data.rows[i], focusedDataRow) < 0) {
          tbody.insertBefore(tbody.rows.namedItem("rowID-" + this.data.rows[i].id), focusedRow);
          i++;
        }
        // leave focusedRow untouched
        i++;
      }
      for (; i < this.data.rows.length; i++) {
        tbody.appendChild(tbody.rows.namedItem("rowID-" + this.data.rows[i].id));
      }

      this.toggleReorder();
    };

    /**
     * @private
     * @var {?number}
     * @default null
     */
    this.focusedRowId = null;
    /**
     * @private
     * @param {?number} rowId
     */
    this.setFocusedRow = function(rowId){
      this.focusedRowId = rowId;
    };

    /**
     * Set status of filter icon in a column.
     * @param {number} column - column number
     * @param {boolean} on - whether to toggle active on or off
     * @param {tfw.DynamicTable.arrowTypes} arrowType - type of arrow
     * @param {?HTMLElement} [arrowBase] - base to pass to {@link tfw.DynamicTable~setActiveArrow} (defaults to column's heading)
     * @see tfw.DynamicTable~setActiveArrow
     */
    this.setActiveFilterInColumn = function(column, on, arrowType, arrowBase){
      var base = this.tableContainer.getElementsByClassName("headlines")[0].getElementsByTagName("th")[column];
      var filterIcon = base.getElementsByClassName("tfwArrow " + arrowType)[0];
      setActiveArrow(filterIcon, (typeof arrowBase == "undefined") ? base : arrowBase, on);
    };

    /**
     * Corrects filter value, also updates inputs if needed.
     * @private
     * @param {number} dataCol - order of column (in data)
     * @param {tfw.DynamicTable.colTypes} type - type, either NUMBER or DATE
     * @param {tfw.DynamicTable~filterRange} originalValue - original value
     * @return {tfw.DynamicTable~filterRange} corrected value (may be same)
     */
    function validValuesOrDefaults(dataCol, type, originalValue){
      var p,
          value = JSON.parse(JSON.stringify(originalValue)); // deep copy
      for (p in value) {
        if (Object.prototype.hasOwnProperty.call(value, p)) {
          switch (type) {
            case tfw.DynamicTable.colTypes.NUMBER:
              value[p] = parseInt(value[p]);
              if (!value[p].match(/^[0-9]+$/)) {
                value[p] = defaultFilterValues[dataCol][p];
              }
              break;
            case tfw.DynamicTable.colTypes.DATE:
              if (!value[p].match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
                value[p] = defaultFilterValues[dataCol][p];
              }
              break;
            // intentionally omitted default
          }
        }
      }
      if (value.min < defaultFilterValues[dataCol].min) {
        value.min = defaultFilterValues[dataCol].min;
      }
      if (value.max > defaultFilterValues[dataCol].max) {
        value.max = defaultFilterValues[dataCol].max;
      }
      if (value.min > value.max) {
        // could be better
        value.min = defaultFilterValues[dataCol].min;
        value.max = defaultFilterValues[dataCol].max;
      }
      for (p in value) {
        if (value[p] != originalValue[p]) {
          var prefix;
          switch (type) {
            case tfw.DynamicTable.colTypes.NUMBER:
              prefix = "range";
              break;
            case tfw.DynamicTable.colTypes.DATE:
              prefix = "date";
              break;
            // intentionally omitted default
          }
          this.filterContainer.querySelector(".tfwContainer ." + prefix + "M" + p.substring(1)).value = value[p];
        }
      }
      return value;
    }

    /**
     * Apply any filter.
     * @param {number} dataCol - order number of filtered column (in data)
     * @param {tfw.DynamicTable~filterValue} value - value to filter by
     * @param {number} [searchType=2] - type of search for TEXT (1 = starts with, 2 = includes)
     * @param {boolean} [dontSave=false] - dont save into preferences (for TEXT)
     * @todo Better behaviour when min and max are crossed (min > max)
     */
    this.filterAny = function(dataCol, value, searchType, dontSave){
      var column = this.data.cols[dataCol].columnOrder,
          type = this.data.cols[dataCol].type;
      // reset invalid/unset values to defaults
      if ([tfw.DynamicTable.colTypes.NUMBER, tfw.DynamicTable.colTypes.DATE].indexOf(type) != -1) {
        validValuesOrDefaults(type, value);
      }
      // update current filter values
      this.setFilterPreferenceIfNotDefault(value, dataCol, (typeof dontSave == "undefined" || !dontSave));
      this.setActiveFilterInColumn(column, !this.isFilterValueDefault(value, dataCol), tfw.DynamicTable.arrowTypes.FILTER);
      var tbody = this.tableContainer.querySelector("tbody"),
          searchFunc = (typeof searchType != "undefined" && searchType == 1) ? "startsWith" : "includes",
          rowValue;
      for (var i = 0; i < tbody.rows.length; i++) {
        var matches = true;
        switch (type) {
          case tfw.DynamicTable.colTypes.CHECKBOX:
            var checked = tbody.rows[i].cells[column].querySelector(".checked") != null;
            matches = (value === "0") || (value === "1" && checked) || (value === "2" && !checked);
            break;
          case tfw.DynamicTable.colTypes.TEXT:
            matches = (value == "") || tbody.rows[i].cells[column].querySelector("input[type=\"text\"]").value.toLowerCase()[searchFunc](
              value.toLowerCase());
            break;
          case tfw.DynamicTable.colTypes.NUMBER:
            rowValue = parseInt(tbody.rows[i].cells[column].querySelector("input").rowValue);
            matches = (rowValue === "" || (value.min <= rowValue && rowValue <= value.max));
            break;
          case tfw.DynamicTable.colTypes.DATE:
            rowValue = tbody.rows[i].cells[column].querySelector("input").value;
            matches = (rowValue === "" || (value.min <= rowValue && rowValue <= value.max));
            break;
          // intentionally omitted default
        }
        tbody.rows[i][matches ? "removeClass" : "addClass"]("filter" + dataCol + "Invalid");
      }
      updateRowCounts.call(this);
    };
    /** Reset all applied filters. */
    this.resetFilters = function(){
      var last = null;
      for (var i = 0; i < this.data.cols.length; i++) {
        if ("filter" in this.data.cols) {
          var value = this.getColumnPreference("filterValues", i);
          if (value != null && !this.isFilterValueDefault(value, i)) {
            this.filterAny(i, defaultFilterValues[i], null, true);
            last = i;
          }
        }
      }
      if (last != null) {
        this.filterAny(last, defaultFilterValues[last]); // save
      }
    };
    /**
     * Toggle visibility of a column. Only hides cells in TBODY and THEAD.
     * Requires .hideColumn{display:none}
     * @param {number} dataCol - number of column (in data)
     * @param {boolean} [dontSave=false] - don't save into preferences
     */
    this.toggleColumn = function(dataCol, dontSave){
      var column = this.data.cols[dataCol].columnOrder;
      var visible;
      [].slice.call(this.tableContainer.querySelectorAll("tbody tr > :nth-child(" + (column + 1) + "), thead tr > :nth-child("
        + (column + 1) + ")")).forEach(function(cell){
          visible = cell.hasClass("hideColumn");
          cell.toggleClass("hideColumn");
        });
      this.setTableWidth();
      if (typeof dontSave == "undefined" || !dontSave) {
        /** @var {boolean[]} */
        var hiddenColumns = this.getPreference("hiddenColumns") || [];
        if (visible) {
          delete hiddenColumns[dataCol];
        } else {
          hiddenColumns[dataCol] = true;
        }
        this.setPreference("hiddenColumns", hiddenColumns);
      }
    };
    /**
     * Toggle visibility of a column.
     * Creates a {@link tfw.dialog|dialog} with checkboxes.
     * @param {HTMLElement} element - above which element should checkboxes be positioned
     */
    this.toggleColumnDialog = function(element){
      var dynamicTable = this,
          hiddenColumns = this.getPreference("hiddenColumns"),
          c = tfw.div({
            className: "tfwDynamicTableColumnDialog"
          });
      for (var j = 0; j < this.data.cols.length; j++) {
        if (!this.data.cols[j].hidden) {
          var checkbox = tfw.checkbox({
            text: this.data.cols[j].name,
            value: (hiddenColumns != null && hiddenColumns[j] === true) ? 0 : 1,
            onchange: function(){
              dynamicTable.toggleColumn(this.dataset.dataCol);
            }
          });
          checkbox.dataset.dataCol = j;
          c.add(checkbox);
        }
      }
      if (tfw.DynamicTable.placePositionedDialog == null) console.error("tfw.DynamicTable.placePositionedDialog has not been set.");
      else tfw.DynamicTable.placePositionedDialog(element, c, true);
    };
  },
  /**
   * Wrapper that creates a dynamic table and returns it's HTML node for inserting into DOM.
   * Class instance's properties are mirrored into the HTML element.
   * @param {Object} params - table parameters
   * @return {HTMLElement} Table
   * @see tfw.DynamicTable
   */
  dynamicTable: function(params){
    var tableObject = new tfw.DynamicTable(params);
    var ret = tableObject.tableContainer;
    for (var prop in tableObject) {
      if (Object.prototype.hasOwnProperty.call(tableObject, prop)) {
        ret[prop] = tableObject[prop];
      }
    }
    ret.reload();
    return ret;
  },
  /**
   * Create a calendar input field.
   * @param {Object} params - parameters
   * @see tfw.input
   * @see tfw.calendarExtend
   * @return {HTMLElement} Returns input (+ optionally legend) wrapper
   */
  calendar: function(params){
    var inputAndMaybeLegend = tfw.input(params);
    if (inputAndMaybeLegend.tagName.toUpperCase() == "INPUT") {
      inputAndMaybeLegend = tfw.calendarExtend(inputAndMaybeLegend);
    } else {
      var input = inputAndMaybeLegend.querySelector("input");
      tfw.calendarExtend(input);
    }
    return inputAndMaybeLegend;
  },
  /**
   * Class for enhancing date input fields. Requires CSS styling.
   * If style.width is set on input, resulting input including calendar icon will have that width.
   * If input is readonly or disabled, calendar will be too.
   * @class
   * @todo freeze
   * @example
   * var input = tfw.input({value:"2016-03-07",style:"width:200px"});
   * document.body.appendChild(input);
   *
   * tfw.calendarExtend(input);
   * @example
   * tfw.calendarExtend.placeCalendar = function (cal, input){
   *  input.parentNode.insertBefore(cal, input);
   * }
   *
   * document.body.add(tfw.calendarExtend(tfw.input({value: "2016-03-07"})));
   * @param {HTMLElement} input - input field to turn into calendar field
   * @return {HTMLElement} Returns input wrapper (for inserting into DOM in case input was not inserted yet)
   * @see tfw.calendar
   */
  calendarExtend: function(input){
    var calendarInput = input,
        calendarWrapper = document.createElement("span"),
        calendarIcon = document.createElement("span");
    calendarWrapper.className = "tfwCalendarWrapper";
    if (input.parentNode) {
      input.parentNode.insertBefore(calendarWrapper, input);
    }
    if (input.style.width) {
      calendarWrapper.style.width = input.style.width;
      input.style.width = "";
    }
    calendarWrapper.appendChild(input);
    calendarWrapper.appendChild(calendarIcon);
    calendarIcon.className = "tfwCalendarIcon clicable icon fa fa-calendar";
    calendarIcon._calendarInput = input;
    input.addClass("calendarInput");
    input._calendar = this;
    input.setAttribute("pattern", "[0-9]{4,}-[0-9]{2}-[0-9]{2}");
    /**
     * Adjust date.
     * @param {string} date - inserted date (yyyy/yyyy-mm/yyyy-mm-dd)
     * @return {string} Date in format yyyy-mm-dd
     */
    function completeDate(date){
      if (date.match(/^\d{4}$/)) { // yyyy
        return date + "-01-01";
      } else if (date.match(/^\d{4}-\d{2}$/)) { // yyyy-mm
        return date + "-01";
      } else {
        return date;
      }
    }
    input.addEventListener("change", function(){
      this.value = completeDate(this.value);
    }, true);
    var calendarContainer = document.createElement("div");
    calendarContainer.addClass("calendarWidget");
    var selectedYear;
    /**
     * Month number, 1-12
     * @private
     */
    var selectedMonth;
    /**
     * Day number, 1-31 (or 0 for undefined)
     * @private
     */
    var selectedDay;
    var setSelectedDate = function(year, month, day){
      selectedYear = parseInt(year);
      selectedMonth = parseInt(month);
      selectedDay = parseInt(day);
    };
    var readonly = input.readOnly || input.disabled;
    if (tfw.calendarExtend.placeCalendar == null) {
      console.error("Calendar widget was not added to the document - no callback was set.");
    } else if (readonly) {
      calendarIcon.addClass("disabled");
    } else {
      calendarIcon.addEventListener("click", function(){
        tfw.calendarExtend.placeCalendar(calendarContainer, input);
      });
    }

    /**
     * (Re)paint the calendar.
     * @private
     */
    function paint(){
      var d = new Date(selectedYear, selectedMonth - 1, 1),
          i,
          // which day of week is the first one of a month
          w = (d.getDay() + 6) % 7, // so that Monday is first
          sp = 0;
      calendarContainer.innerHTML = "";
      var header = tfw.div({className: "head", innerHTML: tfw.calendarExtend.months[selectedMonth - 1] + " " + selectedYear});
      calendarContainer.add(header);
      var backButton = tfw.div({className: "calendarBackButton", innerHTML: "&nbsp;"});
      backButton.addEventListener("mousedown", function backward(event){
        event.stopPropagation();
        event.preventDefault();
        setSelectedDate(selectedYear - (selectedMonth == 1 ? 1 : 0), selectedMonth == 1 ? 12 : selectedMonth - 1, 0);
        paint();
      }, true);
      header.add(backButton);
      var forwardButton = tfw.div({className: "calendarForwardButton", innerHTML: "&nbsp;"});
      forwardButton.addEventListener("mousedown", function forward(event){
        event.stopPropagation();
        event.preventDefault();
        setSelectedDate(selectedYear + (selectedMonth == 12 ? 1 : 0), selectedMonth == 12 ? 1 : selectedMonth + 1, 0);
        paint();
      }, true);
      header.add(forwardButton);
      var day,
          dayNames = tfw.par({className: "dayNames"});
      for (i = 0; i < 7; i++) {
        day = tfw.span({innerHTML: tfw.calendarExtend.daysShort[i]});
        if (i % 7 == 6) {
          day.setAttribute("class", "sunday");
        }
        dayNames.add(day);
      }
      calendarContainer.add(dayNames);
      var week = tfw.par({className: "week"});
      for (i = 0; i < w; i++) {
        day = tfw.span({innerHTML: "&nbsp;"});
        week.add(day);
        sp++;
      }
      var pdm = new Date(selectedYear, selectedMonth, 0).getDate();
      for (i = 1; i <= pdm; i++) {
        day = tfw.span({
          id: "day-" + selectedYear + "-" + (selectedMonth < 10 ? "0" + selectedMonth : selectedMonth) + "-" + (i < 10 ? "0" + i : i),
          className: "day" + (sp % 7 == 6 ? " sunday" : "") + (i == selectedDay ? " current" : ""),
          innerHTML: i
        });
        day.addEventListener("mousedown", function clicked(){
          input.value = this.id.substr(4);
          var current = calendarContainer.querySelector(".current");
          if (current) {
            current.toggleClass("current");
          }
          this.addClass("current");
          calendarInput.dispatchEvent(new Event("change"));
        }, true);
        week.add(day);
        sp++;
        if ((sp == 7) && (i < pdm)) {
          sp = 0;
          calendarContainer.add(week);
          week = tfw.par({className: "week"});
        }
      }
      for (i = sp; i < 7; i++) {
        day = tfw.span({innerHTML: "&nbsp;"});
        if (i % 7 == 6) day.setAttribute("class", "sunday");
        week.add(day);
      }
      calendarContainer.add(week);
    }
    calendarIcon.addEventListener("click", function(){
      var selectedDate = this._calendarInput.value.split("-");
      setSelectedDate(selectedDate[0], selectedDate[1], selectedDate[2]);
      paint();
    });
    return calendarWrapper;
  },
  /**
   * Create a list of checkboxes, with common controls.
   * @todo Change seznamZatrzitek to tfwMultiCheckbox
   * @param {Object} params - checkbox list parameters
   * @see tfw.fillElemDefs
   * @param {string} [params.className=seznamZatrzitek] - container classes (seznamZatrzitek is always added)
   * @param {Object[]} [params.list] - list of checkboxes' parameters (makes params.id mandatory)
   * @param {string} params.list[].id - ID of checkbox
   * @param {string} params.list[].text - text of checkbox
   * @param {string[]|string} [params.value] - initial value ("AllItems" means all)
   * @return {HTMLElement} Returns checkboxes' container (with value attribute and methods setNone and setAll)
   */
  multiCheckbox: function(params){
    var i,
        container = tfw.createAndFillElement("div", params);
    container.addClass("seznamZatrzitek");
    container._value = [];
    if (params.value) container._value = params.value;
    var checkboxOnChange = function(){
      var checkboxContainer = this.parentNode,
          checkboxes = checkboxContainer.childNodes;
      checkboxContainer._value = [];
      for (var j = 0; j < checkboxes.length; j++) {
        if (checkboxes[j].value) checkboxContainer._value.push(checkboxes[j].id.split("-")[1]);
      }
      if (container.onchange) container.dispatchEvent(new Event("change"));
    };
    if ("list" in params) {
      for (i = 0; i < params.list.length; i++) {
        container.add(tfw.checkbox({
          id: params.id + "-" + params.list[i].id,
          text: params.list[i].text,
          onchange: checkboxOnChange,
          value: (container._value.indexOf(params.list[i].id) > -1) ? 1 : 0
        }));
      }
    }
    Object.defineProperty(container, "value", {
      set: function(val){
        if (val === "AllItems") {
          for (i = 0; i < this.childNodes.length; i++) {
            this.childNodes[i].value = 1;
          }
        } else {
          var v = [];
          if (val) {
            v = val;
          }
          for (i = 0; i < this.childNodes.length; i++) {
            this.childNodes[i].value = 0;
          }
          var itemId;
          for (i = 0; i < v.length; i++) {
            itemId = this.id + "-" + v[i];
            if ($(itemId)) $(itemId).value = 1;
          }
        }
      },
      get: function(){
        return this._value;
      },
      enumerable: true,
      configurable: true
    });
    container.setNone = function(){
      this.value = [];
    };
    container.setAll = function(){
      this.value = "AllItems";
    };
    return container;
  }
};
Object.seal(tfw.strings);
/**
 * Callback for showing controls.
 * @var {function}
 */
tfw.DynamicTable.placePositionedDialog = null;
/**
 * @typedef {Object} tfw.DynamicTable.serverAction
 * @property {string} name - action name sent to server
 * @property {string} [method=GET] - HTTP method to use (e.g. GET, POST)
 */
/**
 * Implemented server actions.
 * @readonly
 * @enum {tfw.DynamicTable.serverAction}
 */
tfw.DynamicTable.serverActions = {
  /** load all rows */
  LOAD: {
    name: "load"
  },
  /** add new row, return ID */
  NEW: {
    name: "new",
    method: "POST"
  },
  /** edit 1 cell (id, col) */
  SAVE: {
    name: "savedata",
    method: "POST"
  },
  /** change order of rows - updates multiple rows */
  CHANGE_ORDER: {
    name: "changeorder",
    method: "POST"
  },
  /** long polling */
  WATCH: {
    name: "watch"
  },
  /** delete row */
  DELETE: {
    name: "delete",
    method: "POST"
  },
  /** load user's preferences */
  PREF_GET: {
    name: "getusersettings"
  },
  /** save user's preferences */
  PREF_SET: {
    name: "setusersettings",
    method: "POST"
  }
};
Object.freeze(tfw.DynamicTable.serverActions);
/**
 * Types of column sorting.
 * @readonly
 * @enum {number}
 */
tfw.DynamicTable.colCmpTypes = {
  NUMERIC: 0,
  TEXT: 1
};
Object.freeze(tfw.DynamicTable.colCmpTypes);
/**
 * Types of columns (and filters).
 * @readonly
 * @enum {string}
 */
tfw.DynamicTable.colTypes = {
  TEXT: "text",
  NUMBER: "number",
  CHECKBOX: "checkbox",
  DATE: "date",
  ORDER: "order",
  /** @type {tfw.DynamicTable.colCmpTypes[]} */
  cmpType: {
    text: tfw.DynamicTable.colCmpTypes.TEXT,
    date: tfw.DynamicTable.colCmpTypes.TEXT,
    number: tfw.DynamicTable.colCmpTypes.NUMERIC,
    checkbox: tfw.DynamicTable.colCmpTypes.NUMERIC,
    order: tfw.DynamicTable.colCmpTypes.NUMERIC
  }
};
Object.freeze(tfw.DynamicTable.colTypes);
/**
 * Types of sorting.
 * @readonly
 * @enum {number}
 */
tfw.DynamicTable.sortTypes = {
  ASC: 1,
  DESC: -1
};
Object.freeze(tfw.DynamicTable.sortTypes);
/**
 * Types of "arrows".
 * @readonly
 * @enum {string}
 */
tfw.DynamicTable.arrowTypes = {
  FILTER: "filter",
  UP: "up",
  DOWN: "down"
};
Object.freeze(tfw.DynamicTable.arrowTypes);
/**
 * Width of column with row edit icon (icon's width including padding, border, margin + cell's padding + border), in pixels
 * @var {number}
 * @readonly
 * @default
 */
tfw.DynamicTable.ROW_EDIT_WIDTH = 25;
Object.seal(tfw.DynamicTable);
/**
 * List of months' names.
 * @var {string[]}
 * @default
 */
tfw.calendarExtend.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/**
 * List of days' names' first two letters (beginning with Monday)
 * @var {string[]}
 * @default
 */
tfw.calendarExtend.daysShort = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
/**
 * Callback function that puts calendar widget for an input field into page.
 * Most likely create an overlay that closes calendar when user clicks somewhere else.
 * @callback tfw.calendarExtend~placeCalendar
 * @param {HTMLElement} calendar - calendar widget
 * @param {HTMLElement} input - related input field
 * @default
 */
/**
 * Function called when a calendar widget is created.
 * @var {tfw.calendarExtend~placeCalendar}
 */
tfw.calendarExtend.placeCalendar = null;
Object.seal(tfw.calendarExtend);

window.addEventListener("load", tfw.init);
Object.seal(tfw);

/** @todo Remove */
Object.defineProperty(window, "AJAX_LOADER", {get: function(){
  console.warn("DEPRECATED use of global AJAX_LOADER, use tfw.AJAX_LOADER instead.");
  return tfw.AJAX_LOADER;
}});

/**
 * Triobo. This is a singleton.
 * @class
 * @todo freeze?
 */
var desktop = {//eslint-disable-line no-implicit-globals
  div: null,
  layers: [],
  activeLayer: 0,
  width: 0,
  height: 0,
  resizingFunctions: [],
  isWorking: 0,
  mainLoaderTimer: null,
  URLbase: "",
  URLparams: [],
  go: null,
  dialogMoveData: {},
  init: function(id){
    desktop.div = $(id);
    desktop.clean();
    window.addEventListener("resize", function(){
      desktop.width = desktop.div.clientWidth;
      desktop.height = desktop.div.clientHeight;
      for (var i = 0; i < desktop.resizingFunctions.length; i++) desktop.resizingFunctions[i]();
    }, false);
    var myURLparts = document.URL.split("?");
    desktop.URLbase = myURLparts[0];
    if (myURLparts.length > 1) desktop.URLparams = myURLparts[1].substr(2).split("/");
  },
  clean: function(){
    desktop.layers = [];
    desktop.activeLayer = 0;
    desktop.div.innerHTML = "";
    desktop.div.add(desktop.layers[0] = tfw.div({
      id: "tfwLayer0",
      className: "tfwLayer"
    }));
    desktop.width = desktop.div.clientWidth;
    desktop.height = desktop.div.clientHeight;
    desktop.resizingFunctions = [];
    desktop.isWorking = 0;
    if (desktop.mainLoaderTimer) clearTimeout(desktop.mainLoaderTimer);
  },
  closeTopLayer: function(){
    if (desktop.activeLayer) {
      desktop.layers[desktop.activeLayer].innerHTML = "";
      desktop.div.removeChild(desktop.layers[desktop.activeLayer]);
      desktop.activeLayer--;
    }
  },
  /**
   * Create a new layer.
   * @param {Object} params - layer parameters
   * @param {(boolean|string)} [params.modal] - whether to add class modal (if set to "auto", copies from currently active layer)
   * @param {boolean} [params.autoclose=false] - whether to close layer by clicking it
   * @param {boolean} [param.overlay=false] - whether to add overlay to this layer
   * @listens click
   * @listens mousemove
   * @listens mouseup
   */
  newLayer: function(params){
    if (params.modal) {
      if (params.modal == "auto") {
        params.modal = desktop.layers[desktop.activeLayer].hasClass("modal") ? 1 : 0;
      }
    }
    desktop.activeLayer++;
    desktop.div.add(desktop.layers[desktop.activeLayer] = tfw.div({
      id: "tfwLayer" + desktop.activeLayer,
      className: "tfwLayer" + (params.modal ? " modal" : "")
    }));
    if (params.autoclose) {
      desktop.layers[desktop.activeLayer].addEventListener("click", desktop.closeTopLayer);
    }
    if (params.overlay) {
      desktop.layers[desktop.activeLayer].add(tfw.div({
        id: "tfwLayerOverlay" + desktop.activeLayer,
        className: "tfwLayerOverlay"
      }));
    }
    desktop.layers[desktop.activeLayer].addEventListener("mousemove", desktop.dialogMoveGo, false);
    desktop.layers[desktop.activeLayer].addEventListener("mouseup", desktop.dialogMoveEnd, false);
  },
  /**
   * Create a new layer and a wrapper that starts at a given element.
   * @param {HTMLElement} element - element to position wrapper at
   * @param {Object} params - parameters for {@link desktop.newLayer}
   * @param {boolean} [above=false] - whether to position above element instead of below
   * @param {boolean} [right=false] - whether to align with right edge of element instead of left
   * @return {HTMLElement} Created wrapper
   * @see desktop.newLayer
   */
  createLayerAndWrapperAtElement: function(element, params, above, right){
    var placeAbove = (typeof above != "undefined" && above),
        placeRight = (typeof right != "undefined" && right);
    desktop.newLayer(params);
    var rect = element.getBoundingClientRect(),
        wrapper,
        leftOrRight = placeRight ? "right" : "left",
        leftOrRightPx = placeRight ? (window.innerWidth - rect.right) : rect.left;
    desktop.layers[desktop.activeLayer].add(wrapper = tfw.div({
      style: "overflow:hidden;position:absolute;" + leftOrRight + ":" + leftOrRightPx + "px;"
        + (placeAbove ? "bottom" : "top") + ":" + (placeAbove ? (window.innerHeight - rect.top) : rect.bottom) + "px"
    }));
    return wrapper;
  },
  working: function(now){
    if (!desktop.isWorking) {
      desktop.newLayer({});
      if (now) desktop.hide();
      else desktop.mainLoaderTimer = setTimeout(function(){desktop.hide();}, 500);
      desktop.isWorking = true;
    }
  },
  hide: function(){
    desktop.layers[desktop.activeLayer].add(tfw.div({
      id: "tfwLayerOverlay" + desktop.activeLayer,
      className: "tfwLayerOverlay",
      style: "cursor:progress;"
    }));
    desktop.layers[desktop.activeLayer].add(tfw.div({
      id: "tfwLoader",
      style: "left:" + Math.round(desktop.width / 2 - 16) + "px;top:" + Math.round(desktop.height / 2 - 16) + "px"
    }));
  },
  done: function(){
    if (desktop.isWorking) {
      if (desktop.mainLoaderTimer) clearTimeout(desktop.mainLoaderTimer);
      desktop.closeTopLayer();
      desktop.isWorking = false;
    }
  },
  dialogMoveStart: function(e){
    desktop.dialogMoveData = {
      x: e.clientX,
      y: e.clientY,
      who: e.target
    };
    while (desktop.dialogMoveData.who.className != "tfwDialogContainer") desktop.dialogMoveData.who = desktop.dialogMoveData.who.parentNode;
    e.stopPropagation();
    e.preventDefault();
  },
  dialogMoveGo: function(e){
    if ("who" in desktop.dialogMoveData) {
      var px = e.clientX - desktop.dialogMoveData.x;
      var py = e.clientY - desktop.dialogMoveData.y;
      desktop.dialogMoveData.x = e.clientX;
      desktop.dialogMoveData.y = e.clientY;
      desktop.dialogMoveData.who.style.left = parseInt(desktop.dialogMoveData.who.style.left) + px + "px";
      desktop.dialogMoveData.who.style.top = parseInt(desktop.dialogMoveData.who.style.top) + py + "px";
      e.stopPropagation();
      e.preventDefault();
    }
  },
  dialogMoveEnd: function(e){
    if ("who" in desktop.dialogMoveData) {
      e.stopPropagation();
      e.preventDefault();
      desktop.dialogMoveData = {};
    }
  },
  /**
   * Create a dropdown menu.
   * @param {Object} params - dropdown parameters
   * @param {string} [params.legend] - label
   * @param {string} [params.legendWidth] - label CSS width (including unit)
   * @param {string} [params.legendStyle] - label CSS styling
   * @param {string} [params.containerId] - ID of containing paragraph
   * @param {string} [params.containerStyle] - CSS styling of containing paragraph
   * @param {string} [params.id] - dropdown ID
   * @param {string} [params.className] - dropdown classes (separated by spaces)
   * @param {string} [params.style] - dropdown CSS styling
   * @param {number} [params.itemWidth=0] - width of an item
   * @param {number} [params.itemHeight=20] - height of an item
   * @param {function} [params.onchange] - function to call when value changes (onchange)
   * @param {(string[]|Object[])} params.list - list of options passed to {@link tfw.select}
   * @param {string} [params.value] - default (selected) value
   * @return {HTMLElement} Created dropdown menu
   * @see tfw.select
   */
  dropDown: function(params){
    var y = document.createElement("p");
    y.className = "tfwContainer";
    if (params.legend) {
      var l = document.createElement("span");
      l.style.display = "inline-block";
      l.innerHTML = params.legend;
      if (params.legendWidth) {
        l.style.width = params.legendWidth;
      }
      if (params.legendStyle) {
        l.style.cssText = params.legendStyle;
      }
      if (params.containerId) {
        y.id = params.containerId;
      }
      if (params.containerStyle) {
        y.style.cssText = params.containerStyle;
      }
      y.add(l);
    }
    var x = tfw.div({});
    if (params.id) {
      x.id = params.id;
    }
    if (params.className) {
      x.className = "tfwDropDown " + params.className;
    } else {
      x.className = "tfwDropDown";
    }
    if (params.style) {
      x.style.cssText = params.style;
    }
    if (params.itemWidth) {
      x.itemWidth = params.itemWidth;
    } else {
      x.itemWidth = 0;
    }
    if (params.itemHeight) {
      x.itemHeight = params.itemHeight;
    } else {
      x.itemHeight = 20;
    }
    if (params.onchange) {
      x.onchange = params.onchange;
    }
    x.onmousedown = function(e){
      e.preventDefault();
    };
    x.onclick = function(){
      if (!x._disabled) {
        var vyska = params.list.length * x.itemHeight;
        if (params.maxHeight && vyska > params.maxHeight) {
          vyska = params.maxHeight;
        }
        if (vyska > 210) {
          vyska = 210;
        }
        var rect = x.getBoundingClientRect();
        var c = desktop.createLayerAndWrapperAtElement(x, {
          autoclose: true,
          modal: "auto"
        });
        var b = tfw.select({
          id: "drop" + params.id,
          list: params.list,
          value: x.value,
          style: "width:" + (rect.width - 2 + x.itemWidth) + "px;position:relative;top:-1px;height:" + vyska + "px;",
          onchange: function(){
            for (var i = 0; i < this.childNodes.length; i++) {
              if (this.childNodes[i].value == this.value) {
                x.innerHTML = this.childNodes[i].innerHTML;
                x.value = this.childNodes[i].value;
              }
            }
            if (x.onchange) {
              x.onchange();
            }
            x.addClass("hasBeenChanged");
          }
        });
        c.add(b);
        b.style.webkitTransform = "translateY(-" + vyska + "px)";
        window.setTimeout(function(){
          $("drop" + params.id).style.webkitTransform = "";
        }, 10);
      }
    };
    Object.defineProperty(x, "disabled", {
      set: function(val){
        if (val) this.addClass("disabled");
        else this.removeClass("disabled");
        this._disabled = val;
      },
      get: function(){
        return this._disabled;
      },
      enumerable: true,
      configurable: true
    });

    if (("value" in params) && params.list) {
      for (var i = 0; i < params.list.length; i++) {
        if (typeof params.list[i] === "object") {
          if (params.list[i].id == params.value) x.innerHTML = params.list[i].t;
        } else if (i == params.value) x.innerHTML = params.list[i];
      }
    }
    if ("value" in params) {
      x.value = params.value;
    }
    if ("disabled" in params) {
      x.disabled = params.disabled;
    }
    x.setValue = function(a){
      x.value = a;
      for (var i = 0; i < params.list.length; i++) {
        if (typeof params.list[i] === "object") {
          if (params.list[i].id == a) x.innerHTML = params.list[i].t;
        } else if (i == a) x.innerHTML = params.list[i];
      }
    };
    y.add(x);
    return y;
  },
  dialog: function(co){
    var b;
    desktop.newLayer({
      overlay: true,
      modal: true
    });
    var vnit,
        dlg,
        sirka = 300,
        vyska = 200,
        nazev = "";
    if (co.width) sirka = co.width;
    if (co.height) vyska = co.height;
    if (co.title) nazev = co.title;
    var obal = tfw.div({
      className: "tfwDialogContainer" + (nazev ? "" : " noTitle"),
      style: "left:" + Math.round((desktop.width - sirka) / 2) + "px;top:" + Math.round((desktop.height - vyska) / 2) + "px;width:"
        + sirka + "px;height:" + vyska + "px;"
    });
    obal.style.webkitTransform = "translateY(-32px)";
    obal.style.opacity = 0;
    obal.id = "tfwDialog" + desktop.activeLayer;
    desktop.layers[desktop.activeLayer].add(obal);
    if (nazev) {
      var h = tfw.par({
        innerHTML: nazev,
        className: "tfwDialogTitle"
      });
      obal.add(h);
      h.addEventListener("mousedown", desktop.dialogMoveStart, false);
    }
    var f = document.createElement("form");
    f.onsubmit = function(e){
      e.stopPropagation();
      e.preventDefault();
    };
    obal.add(f);
    f.add(vnit = tfw.div({
      className: "tfwDialog",
      style: "height:" + (vyska - (nazev ? 60 : 32)) + "px"
    }));
    desktop.layers[desktop.activeLayer].addEventListener("keydown", function(e){
      if (e.which == 27) desktop.closeTopLayer();
    }, true);
    /**/
    vnit.add(dlg = tfw.div({
      style: "height:" + (vyska - (nazev ? 60 : 32) - 27) + "px"
    }));
    dlg.addEventListener("mousedown", function(e){
      e.stopPropagation();
    }, false);
    if (co.obsah) dlg.innerHTML = co.obsah;
    var i;
    if (co.children) {
      for (i = 0; i < co.children.length; i++) {
        dlg.add(co.children[i]);
      }
    }
    vnit.add(dlg.buttons = tfw.div({
      className: "buttonsBar"
    }));
    if (co.buttons) {
      for (i = 0; i < co.buttons.length; i++) {
        if (co.buttons[i].text) {
          dlg.buttons.add(b = tfw.button(co.buttons[i]));
          if (!co.vychozi && b.type == "submit") b.focus();
        }
      }
    }
    if (co.id) dlg.id = co.id;
    if (co.vychozi) $(co.vychozi).focus();
    dlg.hasBeenChanged = function(){
      return this.getElementsByClassName("hasBeenChanged").length ? 1 : 0;
    };
    dlg.resetChanges = function(){
      var list = this.getElementsByClassName("hasBeenChanged");
      for (var i = 0; i < list.length; i++) list[i].removeClass("hasBeenChanged");
    };
    window.setTimeout(function(activeLayer){
      activeLayer.style.webkitTransform = "";
      activeLayer.style.opacity = 1;
    }, 10, $("tfwDialog" + desktop.activeLayer));
    return dlg;
  },
  /**
   * Show dialog while preparing something for download in background, when ready show download link.
   * @memberof tfw
   * @param {Object} params - parameters
   * @param {string} params.title - dialog title
   * @param {string} params.waiting - HTML to show while waiting
   * @param {string} params.ajaxFile - url for {@link tfw.ajaxGet}
   * @param {string} params.ajaxParam - url-encoded parameters separated by & for {@link tfw.ajaxGet}
   * @param {string} params.text - text to show when ready, with "%1" getting replaced with download link
   * @param {string} params.item - download link inner HTML
   * @see tfw.ajaxGet
   */
  dialogPrepareAndDownload: function(params){
    tfw.dialog({
      width: 360,
      height: 140,
      title: params.title,
      children: [
        tfw.div({
          id: "dlgPaD",
          children: [
            tfw.par({
              innerHTML: params.waiting
            }), tfw.par({
              innerHTML: tfw.AJAX_LOADER
            })
          ]
        })
      ],
      buttons: [{
        text: t(1),
        action: desktop.closeTopLayer
      }]
    });
    tfw.ajaxGet({
      url: params.ajaxFile + "?" + params.ajaxParam,
      onload: function(hr){
        $("dlgPaD").innerHTML = params.text.replace("%1", "<a href=\"" + hr.responseText + "\" download>" + params.item + "</a>");
      },
      autohide: 0
    });
  }
};
Object.seal(desktop);

tfw.ajaxOnDone = desktop.done;
tfw.ajaxOnAutoHide = desktop.working;
tfw.DynamicTable.placePositionedDialog = function(positionAtElement, filterElement, right){
  var wrapper = desktop.createLayerAndWrapperAtElement(positionAtElement, {
    autoclose: true,
    modal: "auto"
  }, true, typeof right == "undefined" ? false : right);
  wrapper.add(filterElement);
};
tfw.calendarExtend.placeCalendar = function(cal, input){
  var wrapper = desktop.createLayerAndWrapperAtElement(input, {
    autoclose: true,
    modal: "auto"
  });
  wrapper.add(cal);
};

/* eslint-disable */
/**
 * Function package for preparing HTML elements.
 * @class
 * @deprecated
 */
var prvek = {//eslint-disable-line no-implicit-globals
  /**
   * Create a list of checkboxes, with common controls.
   * @deprecated
   * @see tfw.multiCheckbox
   * @param {Object} params - checkbox list parameters
   * @see tfw.fillElemDefs
   * @param {string} [params.className=seznamZatrzitek] - container classes (seznamZatrzitek is always added)
   * @param {Object[]} [params.seznam] - list of checkboxes' parameters (makes params.id mandatory)
   * @param {string} params.seznam[].id - ID of checkbox
   * @param {string} params.seznam[].text - text of checkbox
   * @param {string} [params.init] - initial value
   * @return {HTMLElement} Returns container with checkboxes
   */
  seznamZatrzitek: function(params){
    console.warn("DEPRECATED use of prvek.seznamZatrzitek, use tfw.multiCheckbox instead.");
  },
  /**
   * @deprecated
   * @see tfw.table
   */
  tabulka: function(co){
    console.warn("DEPRECATED prvek.tabulka, use tfw.table instead.");
    if (co.radky) co.rows = co.radky;
    return tfw.table(co);
  },
  /**
   * @deprecated
   * @see tfw.tr
   */
  radek: function(co){
    console.warn("DEPRECATED prvek.radek, use tfw.tr instead.");
    if (co.sloupce) co.columns = co.sloupce;
    return tfw.tr(co);
  },
  /**
   * @deprecated
   * @see tfw.td
   */
  sloupec: function(co){
    console.warn("DEPRECATED prvek.sloupec, use tfw.td instead.");
    if (co.obsah) co.innerHTML = co.obsah;
    if (co.width) co.style = "width:" + co.width + "px;" + ((co.style) ? co.style : "");
    return tfw.td(co);
  },
  /**
   * @todo Remove dependencies on Triobo
   * @todo Move to {@link tfw}
   */
  rezimVyberuBarvy: 0,
  /**
   * @todo Remove dependencies on Triobo
   * @todo Move to {@link tfw}
   */
  barva: function(co){
    var x = document.createElement("div");
    if (co.id) x.id = co.id;
    if (co.className) co.className = "nastaveniBarvy " + co.className;
    else co.className = "nastaveniBarvy";
    x.className = co.className;
    if (co.style) x.style.cssText = co.style;
    x.mouseDown = 0;
    if (co.action) x.action = co.action;
    x.zmenaPalety = 0;
    x.addEventListener("mousedown", function(e){
      var b;
      var dlg = tfw.dialog({
        title: t(208),
        width: 500 + (co.paleta ? 200 : 0),
        height: 420,
        buttons: [
          co.zadnaAkce ? {} : {
            id: "dlgBarvaNastavit",
            text: t(134),
            default: 1,
            action: function(){
              x.barvaAktualniAVychozi(x.value, 0);
              if (x.action) x.action();
              prvek.rezimVyberuBarvy = $("zalMichani").value;
              if (x.zmenaPalety) editorUlozitPaletu();
              desktop.closeTopLayer();
            }
          },
          co.lzeOdebrat ? {
            text: t(309),
            action: function(){
              x.barvaAktualniAVychozi("rgba(0,0,0,0)", x.value);
              x.value = "";
              if (x.action) x.action();
              prvek.rezimVyberuBarvy = $("zalMichani").value;
              if (x.zmenaPalety) editorUlozitPaletu();
              desktop.closeTopLayer();
            }
          } : {}, {
            text: t(1),
            action: function(){
              x.value = x.puvodniHodnota;
              prvek.rezimVyberuBarvy = $("zalMichani").value;
              if (x.zmenaPalety) editorUlozitPaletu();
              desktop.closeTopLayer();
            }
          }
        ]
      });
      var bar = x.value;
      if (bar == "transparent") bar = "rgba(255,255,255,0)";
      if (!bar) bar = "rgba(255,255,255,0)";
      if (bar.substr(0, 4) == "rgba") rgb = bar.slice(5, -1).split(",");
      else if (bar.substr(0, 3) == "rgb") {
        rgb = bar.slice(4, -1).split(",");
        rgb[3] = 1;
      } else rgb = [0, 0, 0, 1];
      var opac = Math.round(rgb[3] * 100);
      if (isNaN(opac)) opac = 100;
      var ab = parseInt(rgb[0]) + "," + parseInt(rgb[1]) + "," + parseInt(rgb[2]) + "," + (Math.round(parseFloat(rgb[3]) * 100)) / 100;
      if (co.paleta) {
        dlg.add(c = tfw.div({
          style: "width:200px;height:312px;",
          className: "tfwInline tfwSeparatorRight"
        }));
        c.add(tfw.par({
          className: "nadpis",
          innerHTML: t(548),
          style: "border-bottom:none;"
        }));
        //paleta vydání
        c.add(b = tfw.div({
          id: "dlgPaleta",
          className: "tfwSelect",
          style: "width:200px;height:250px;margin:2px 0 4px;"
        }));
        c.add(tfw.div({
          className: "tfwIconGroup",
          children: [
            tfw.icon({
              className: "ikona24",
              index: 51 * 24,
              title: t(20),
              action: function(e){
                //nová barva
                if ($("dlgPaleta").value) $($("dlgPaleta").value).className = "";
                var pi, max = 0;
                for (i = 0; i < $("dlgPaleta").childNodes.length; i++) {
                  pi = parseInt($("dlgPaleta").childNodes[i].id.substr(7));
                  if (pi > max) max = pi;
                }
                max++;
                x.pridatDoPalety({
                  id: max,
                  n: "r" + $("barvaR-v").value + " g" + $("barvaG-v").value + " b" + $(
                    "barvaB-v").value + ((parseInt($("barvaO-v").value) < 100) ? (" (" +
                    $("barvaO-v").value + " %)") : ""),
                  v: $("barvaR-v").value + "," + $("barvaG-v").value + "," + $("barvaB-v").value +
                    "," + ($("barvaO-v").value / 100),
                  a: 1
                });
                $("dlgPaleta").value = "paleta-" + max;
                $("dlgPalUloz").disabled = 0;
                $("dlgPalSmaz").disabled = 0;
                $("dlgPalNahoru").disabled = 0;
                $("dlgPalDolu").disabled = 1;
                $("paleta-" + max).scrollIntoView(true);
                x.zmenaPalety = 1;
                x.prejmenujBarvu();
              }
            }), tfw.icon({
              id: "dlgPalUloz",
              className: "ikona24",
              index: 57 * 24,
              title: t(9),
              zakazano: 1,
              action: function(e){
                var pal = $($("dlgPaleta").value);
                pal.value = $("barvaR-v").value + "," + $("barvaG-v").value + "," + $("barvaB-v").value +
                  "," + ($("barvaO-v").value / 100);
                pal.childNodes[0].style.backgroundImage = "-webkit-linear-gradient(rgba(" + pal.value +
                  "),rgba(" + pal.value + ")),url(pics/vzorek.png)";
                var re = /^r[0-9]+ g[0-9]+ b[0-9]+/;
                if (re.test($($("dlgPaleta").value).childNodes[1].innerHTML)) $($("dlgPaleta").value).childNodes[
                    1].innerHTML = "r" + $("barvaR-v").value + " g" + $("barvaG-v").value + " b" +
                  $("barvaB-v").value + ((parseInt($("barvaO-v").value) < 100) ? (" (" + $("barvaO-v")
                    .value + " %)") : "");
                x.zmenaPalety = 1;
                x.prejmenujBarvu();
              }
            }), tfw.icon({
              id: "dlgPalSmaz",
              className: "ikona24",
              index: 52 * 24,
              title: t(17),
              zakazano: 1,
              action: function(e){
                var pal = $($("dlgPaleta").value);
                pal.parentNode.removeChild(pal);
                $("dlgPaleta").value = "";
                $("dlgPalUloz").disabled = 1;
                $("dlgPalSmaz").disabled = 1;
                $("dlgPalNahoru").disabled = 1;
                $("dlgPalDolu").disabled = 1;
                x.zmenaPalety = 1;
              }
            })
          ]
        }));
        c.add(tfw.div({
          className: "tfwIconGroup",
          children: [
            tfw.icon({
              id: "dlgPalNahoru",
              className: "ikona24",
              index: 53 * 24,
              title: t(512),
              zakazano: 1,
              action: function(e){
                //Nahoru
                var c = $("dlgPaleta").childNodes;
                for (i = 1; i < c.length; i++)
                  if (c[i].hasClass("selected")) {
                    c[i].parentNode.insertBefore(c[i], c[i - 1]);
                    $("dlgPalNahoru").disabled = (i == 1) ? 1 : 0;
                    $("dlgPalDolu").disabled = 0;
                    break;
                  }
                x.zmenaPalety = 1;
              }
            }), tfw.icon({
              id: "dlgPalDolu",
              className: "ikona24",
              index: 54 * 24,
              title: t(513),
              zakazano: 1,
              action: function(e){
                //Dolů
                var c = $("dlgPaleta").childNodes;
                for (i = (c.length - 2); i >= 0; i--)
                  if (c[i].hasClass("selected")) {
                    c[i].parentNode.insertBefore(c[i + 1], c[i]);
                    $("dlgPalNahoru").disabled = 0;
                    $("dlgPalDolu").disabled = (i == c.length - 2) ? 1 : 0;
                  }
                x.zmenaPalety = 1;
              }
            })
          ]
        }));
        $("dlgPaleta").value = "";
        for (var i = 0; i < editor.aktVydani.paleta.length; i++) {
          x.pridatDoPalety(editor.aktVydani.paleta[i]);
          if (!$("dlgPaleta").value)
            if (ab == editor.aktVydani.paleta[i].v) {
              $("dlgPaleta").value = "paleta-" + editor.aktVydani.paleta[i].id;
              $("dlgPaleta").childNodes[i].className = "selected";
              $("dlgPalUloz").disabled = 0;
              $("dlgPalSmaz").disabled = 0;
              $("dlgPalNahoru").disabled = (i == 0) ? 1 : 0;
              $("dlgPalDolu").disabled = (i == editor.aktVydani.paleta.length - 1) ? 1 : 0;
              $("paleta-" + editor.aktVydani.paleta[i].id).scrollIntoView(true);
            }
        }
      }
      dlg.add(b = tfw.div({
        style: "width:216px;height:312px;",
        className: "tfwInline tfwSeparatorRight"
      }));
      b.add(z = tfw.noveZalozky("zalMichani", 216, 200, t(546) + ";" + t(547), prvek.rezimVyberuBarvy));
      z.childNodes[1].add(tfw.div({
        id: "paletaHSV",
        style: "width:200px;height:200px;background-size: 200px 200px;position:relative;overflow:hidden;cursor:crosshair;",
        children: [
          tfw.div({
            id: "paletaHSVpoint",
            style: "position:absolute;width:7px;height:7px;border:1px solid black;border-radius:4px;"
          })
        ]
      }));
      z.childNodes[1].add(tfw.slider({
        id: "barvaH",
        legend: "H:",
        legendStyle: "width:18px",
        postText: "°",
        min: 0,
        max: 359,
        step: 1,
        value: 0,
        valueStyle: "width:32px",
        onchange: x.repaintH,
        style: "margin-top:16px;"
      }));
      z.childNodes[1].add(tfw.slider({
        id: "barvaS",
        legend: "S:",
        legendStyle: "width:18px",
        postText: "%",
        min: 0,
        max: 100,
        step: 1,
        value: 0,
        valueStyle: "width:32px",
        onchange: x.repaintH
      }));
      z.childNodes[1].add(tfw.slider({
        id: "barvaV",
        legend: "B:",
        legendStyle: "width:18px",
        postText: "%",
        min: 0,
        max: 100,
        step: 1,
        value: 0,
        valueStyle: "width:32px",
        onchange: x.repaintH
      }));
      for (var ry = 0; ry < 10; ry++)
        for (var rx = 0; rx < 9; rx++) {
          z.childNodes[2].add(b = tfw.div({
            className: "paletaTrioboPole"
          }));
          if (ry < 9) {
            hue = [0, 30, 60, 120, 180, 200, 240, 270, 300];
            sat = [100, 50, 25];
            bri = [100, 80, 50];
            plt = HSV2RGB(hue[rx], sat[ry % 3], bri[Math.floor(ry / 3)]);
          } else plt = HSV2RGB(0, 0, rx / 8 * 100);
          b.value = plt[0] + "," + plt[1] + "," + plt[2];
          b.style.backgroundColor = "rgb(" + b.value + ")";
          b.addEventListener("click", function(){
            var rb = this.value.split(",");
            $("barvaR").value = (rb[0]);
            $("barvaG").value = (rb[1]);
            $("barvaB").value = (rb[2]);
            x.repaintR();
          }, false);
          b.addEventListener("dblclick", function(e){
            $("dlgBarvaNastavit").onclick(e);
          }, false);
        }
      dlg.add(b = tfw.div({
        style: "width:220px;height:312px;",
        className: "tfwInline",
        children: [
          tfw.div({
            style: "text-align:center;",
            children: [
              tfw.div({
                id: "puvodniBarva",
                className: "ukazkaBarvy",
                style: "width:88px;height:58px;display:inline-block;border:1px solid black;border-right:none;"
              }), tfw.div({
                id: "barvaNahled",
                className: "ukazkaBarvy",
                style: "width:88px;height:58px;display:inline-block;border:1px solid black;border-left:none;"
              })
            ]
          }), tfw.slider({
            id: "barvaR",
            legend: "R:",
            legendStyle: "width:18px",
            min: 0,
            max: 255,
            step: 1,
            value: parseInt(rgb[0]),
            valueStyle: "width:32px",
            onchange: x.repaintR,
            style: "margin-top:8px;"
          }), tfw.slider({
            id: "barvaG",
            legend: "G:",
            legendStyle: "width:18px",
            min: 0,
            max: 255,
            step: 1,
            value: parseInt(rgb[1]),
            valueStyle: "width:32px",
            onchange: x.repaintR
          }), tfw.slider({
            id: "barvaB",
            legend: "B:",
            legendStyle: "width:18px",
            min: 0,
            max: 255,
            step: 1,
            value: parseInt(rgb[2]),
            valueStyle: "width:32px",
            onchange: x.repaintR
          }), tfw.slider({
            id: "barvaC",
            legend: "C:",
            legendStyle: "width:18px",
            postText: "%",
            min: 0,
            max: 100,
            step: 1,
            value: 0,
            valueStyle: "width:32px",
            onchange: x.repaintC,
            style: "margin-top:8px;"
          }), tfw.slider({
            id: "barvaM",
            legend: "M:",
            legendStyle: "width:18px",
            postText: "%",
            min: 0,
            max: 100,
            step: 1,
            value: 0,
            valueStyle: "width:32px",
            onchange: x.repaintC
          }), tfw.slider({
            id: "barvaY",
            legend: "Y:",
            legendStyle: "width:18px",
            postText: "%",
            min: 0,
            max: 100,
            step: 1,
            value: 0,
            valueStyle: "width:32px",
            onchange: x.repaintC
          }), tfw.slider({
            id: "barvaK",
            legend: "K:",
            legendStyle: "width:18px",
            postText: "%",
            min: 0,
            max: 100,
            step: 1,
            value: 0,
            valueStyle: "width:32px",
            onchange: x.repaintC
          }), tfw.input({
            id: "barvaW",
            legend: "Web #",
            legendStyle: "width:138px",
            style: "width:56px;margin-top:8px;text-align:center;font-family:courier,monospace;font-size:13px;",
            maxLength: 6,
            onchange: x.repaintW
          }), tfw.par({
            innerHTML: t(36) + ":",
            style: "margin:8 0 0px;"
          }), tfw.slider({
            id: "barvaO",
            legend: "",
            legendStyle: "width:18px",
            postText: "%",
            min: 0,
            max: 100,
            step: 1,
            value: opac,
            valueStyle: "width:32px",
            onchange: x.repaintR
          })
        ]
      }));
      if (co.bezSytosti) {
        $("barvaO").value = (100);
        $("barvaO-s").disabled = 1;
        $("barvaO-v").disabled = 1;
      }
      $("puvodniBarva").style.backgroundImage = "-webkit-linear-gradient(" + bar + "," + bar + "),url(pics/vzorek.png)";
      $("paletaHSV").addEventListener("mousedown", function(e){
        x.mouseDown = 1;
        x.paletaClick(e);
      }, false);
      desktop.layers[desktop.activeLayer].addEventListener("mousemove", x.paletaClick, false);
      desktop.layers[desktop.activeLayer].addEventListener("mouseup", function(e){
        x.mouseDown = 0;
      }, false);
      x.zmenaPalety = 0;
      x.repaintR();
    }, false);
    x.prejmenujBarvu = function(){
      tfw.dialog({
        title: t(545),
        width: 332,
        height: 180,
        children: [ //"Název barvy"
          tfw.input({
            id: "nazevBarvy",
            value: $($("dlgPaleta").value).childNodes[1].innerHTML,
            legend: t(545) + ":",
            legendStyle: "width:80px",
            style: "width:200px"
          })
        ],
        vychozi: "nazevBarvy",
        buttons: [{
          text: t(9),
          default: 1,
          action: function(){
            $($("dlgPaleta").value).childNodes[1].innerHTML = $("nazevBarvy").value;
            desktop.closeTopLayer();
          }
        }, {
          text: t(342),
          action: function(){
            $($("dlgPaleta").value).childNodes[1].innerHTML = "r" + $("barvaR-v").value + " g" + $("barvaG-v").value +
              " b" + $("barvaB-v").value + ((parseInt($("barvaO-v").value) < 100) ? (" (" + $("barvaO-v").value +
                " %)") : "");
            desktop.closeTopLayer();
          }
        }, {
          text: t(1),
          action: desktop.closeTopLayer
        }]
      });
    };
    x.pridatDoPalety = function(barva){
      $("dlgPaleta").add(d = tfw.div({
        id: "paleta-" + barva.id,
        className: (barva.a ? "selected" : ""),
        children: [
          tfw.span({
            className: "vzorekBarvy",
            style: "float:left;background-image:-webkit-linear-gradient(rgba(" + barva.v + "),rgba(" + barva.v +
              ")),url(pics/vzorek.png)"
          }), tfw.span({
            className: "nazevBarvy",
            style: "width:160px;",
            innerHTML: barva.n
          })
        ]
      }));
      d.value = barva.v;
      d.addEventListener("click", function(e){
        if ($("dlgPaleta").value) $($("dlgPaleta").value).className = "";
        this.className = "selected";
        $("dlgPaleta").value = this.id;
        var rgb = this.value.split(",");
        $("barvaR").value = (rgb[0]);
        $("barvaG").value = (rgb[1]);
        $("barvaB").value = (rgb[2]);
        $("barvaO").value = (rgb[3] * 100);
        x.repaintR();
        $("dlgPalUloz").disabled = 0;
        $("dlgPalSmaz").disabled = 0;
        $("dlgPalNahoru").disabled = this.myOrder() ? 0 : 1;
        $("dlgPalDolu").disabled = (this.myOrder() == this.parentNode.childNodes.length - 1) ? 1 : 0;
        e.stopPropagation();
        e.preventDefault();
      }, false);
      d.addEventListener("dblclick", function(e){
        $("dlgBarvaNastavit").onclick(e);
      }, false);
    };
    x.paletaClick = function(e){
      if (x.mouseDown) {
        var lhr = tfw.getRealCoordinates($("paletaHSV"));
        var h = Math.floor((e.pageX - lhr[0]) / 200 * 360);
        var s = 100 - Math.floor((e.pageY - lhr[1]) / 2);
        if (h < 0) h = 0;
        if (h > 359) h = 359;
        if (s < 0) s = 0;
        if (s > 100) s = 100;
        $("barvaH").value = (h);
        $("barvaS").value = (s);
        x.repaintH();
        e.stopPropagation();
        e.preventDefault();
      }
    };
    x.repaintR = function(){
      var hsv = RGB2HSV($("barvaR-v").value, $("barvaG-v").value, $("barvaB-v").value);
      $("barvaH").value = (hsv[0]);
      $("barvaS").value = (hsv[1]);
      $("barvaV").value = (hsv[2]);
      var cmyk = RGB2CMYK($("barvaR-v").value, $("barvaG-v").value, $("barvaB-v").value);
      $("barvaC").value = (cmyk[0]);
      $("barvaM").value = (cmyk[1]);
      $("barvaY").value = (cmyk[2]);
      $("barvaK").value = (cmyk[3]);
      $("barvaW").value = RGB2Web($("barvaR-v").value, $("barvaG-v").value, $("barvaB-v").value);
      x.repaintPal();
    };
    x.repaintH = function(){
      var rgb = HSV2RGB($("barvaH-v").value, $("barvaS-v").value, $("barvaV-v").value);
      $("barvaR").value = (rgb[0]);
      $("barvaG").value = (rgb[1]);
      $("barvaB").value = (rgb[2]);
      var cmyk = RGB2CMYK($("barvaR-v").value, $("barvaG-v").value, $("barvaB-v").value);
      $("barvaC").value = (cmyk[0]);
      $("barvaM").value = (cmyk[1]);
      $("barvaY").value = (cmyk[2]);
      $("barvaK").value = (cmyk[3]);
      $("barvaW").value = RGB2Web($("barvaR-v").value, $("barvaG-v").value, $("barvaB-v").value);
      x.repaintPal();
    };
    x.repaintC = function(){
      var rgb = CMYK2RGB($("barvaC-v").value, $("barvaM-v").value, $("barvaY-v").value, $("barvaK-v").value);
      $("barvaR").value = (rgb[0]);
      $("barvaG").value = (rgb[1]);
      $("barvaB").value = (rgb[2]);
      var hsv = RGB2HSV($("barvaR-v").value, $("barvaG-v").value, $("barvaB-v").value);
      $("barvaH").value = (hsv[0]);
      $("barvaS").value = (hsv[1]);
      $("barvaV").value = (hsv[2]);
      $("barvaW").value = RGB2Web($("barvaR-v").value, $("barvaG-v").value, $("barvaB-v").value);
      x.repaintPal();
    };
    x.repaintW = function(){
      var rgb = Web2RGB($("barvaW").value);
      $("barvaR").value = (rgb[0]);
      $("barvaG").value = (rgb[1]);
      $("barvaB").value = (rgb[2]);
      var hsv = RGB2HSV($("barvaR-v").value, $("barvaG-v").value, $("barvaB-v").value);
      $("barvaH").value = (hsv[0]);
      $("barvaS").value = (hsv[1]);
      $("barvaV").value = (hsv[2]);
      var cmyk = RGB2CMYK($("barvaR-v").value, $("barvaG-v").value, $("barvaB-v").value);
      $("barvaC").value = (cmyk[0]);
      $("barvaM").value = (cmyk[1]);
      $("barvaY").value = (cmyk[2]);
      $("barvaK").value = (cmyk[3]);
      x.repaintPal();
    };
    x.repaintPal = function(){
      var h = parseInt($("barvaH-v").value);
      var s = parseInt($("barvaS-v").value);
      var v = parseInt($("barvaV-v").value);
      $("paletaHSVpoint").style.left = (Math.round(h / 360 * 200) - 4) + "px";
      $("paletaHSVpoint").style.top = ((100 - s) * 2 - 4) + "px";
      $("paletaHSVpoint").style.borderColor = (v > 50) ? "black" : "white";
      var jas = "rgba(0,0,0," + (1 - v / 100) + ")";
      $("paletaHSV").style.backgroundImage = "-webkit-linear-gradient(" + jas + "," + jas + "),url(pics/hsl.png)";
      var bar = "rgba(" + $("barvaR-v").value + "," + $("barvaG-v").value + "," + $("barvaB-v").value + "," + $("barvaO-v").value / 100 + ")";
      x.value = bar;
      $("barvaNahled").style.backgroundImage = "-webkit-linear-gradient(" + bar + "," + bar + "),url(pics/vzorek.png)";
      if ($("dlgPaleta"))
        if ($("dlgPaleta").value) $("dlgPalUloz").disabled = 0;
    };
    x.barvaAktualniAVychozi = function(a, v){
      if (a) {
        x.value = a;
        x.puvodniHodnota = a;
        x.style.backgroundImage = "-webkit-linear-gradient(" + a + "," + a + "),url(pics/vzorek.png)";
      } else {
        x.value = v;
        x.puvodniHodnota = v;
        x.style.backgroundImage = "url(pics/vzorek.png)";
      }
    };
    if (co.value) x.barvaAktualniAVychozi(co.value, co.value);
    return x;
  },
  /**
   * @todo Remove dependencies on Triobo
   * @todo Move to {@link tfw}
   */
  barvaSLegendou: function(co){
    var x = document.createElement("p");
    var l = document.createElement("span");
    l.style.display = "inline-block";
    if (co.legenda) l.innerHTML = co.legenda;
    if (co.legend) l.innerHTML = co.legend;
    if (co.legendaSirka) l.style.width = co.legendaSirka;
    if (co.legendStyle) l.style.cssText = co.legendStyle;
    x.add(l);
    x.add(prvek.barva(co));
    return x;
  }
};

function RGB2HSV(r, g, b){
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
  var h, s, v = max;
  var d = max - min;
  s = max == 0 ? 0 : d / max;
  if (max == min) {
    h = 0; //achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

function HSV2RGB(h, s, v){
  h /= 360, s /= 100, v /= 100;
  var r, g, b;
  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v, g = t, b = p;
      break;
    case 1:
      r = q, g = v, b = p;
      break;
    case 2:
      r = p, g = v, b = t;
      break;
    case 3:
      r = p, g = q, b = v;
      break;
    case 4:
      r = t, g = p, b = v;
      break;
    case 5:
      r = v, g = p, b = q;
      break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function RGB2CMYK(r, g, b){
  r /= 255, g /= 255, b /= 255;
  var c = m = y = 0;
  var k = Math.min(1 - r, 1 - g, 1 - b);
  if (k != 1) {
    c = (1 - r - k) / (1 - k);
    m = (1 - g - k) / (1 - k);
    y = (1 - b - k) / (1 - k);
  }
  return [Math.round(c * 100), Math.round(m * 100), Math.round(y * 100), Math.round(k * 100)];
}

function CMYK2RGB(c, m, y, k){
  c /= 100, m /= 100, y /= 100, k /= 100;
  var r, g, b;
  r = 1 - Math.min(1, c * (1 - k) + k);
  g = 1 - Math.min(1, m * (1 - k) + k);
  b = 1 - Math.min(1, y * (1 - k) + k);
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function RGB2Web(r, g, b){
  r = parseInt(r).toString(16);
  g = parseInt(g).toString(16);
  b = parseInt(b).toString(16);
  if (r.length < 2) r = "0" + r;
  if (g.length < 2) g = "0" + g;
  if (b.length < 2) b = "0" + b;
  return (r + g + b);
}

function Web2RGB(h){
  if (h.length == 3) h = h.substr(0, 1) + h.substr(0, 1) + h.substr(1, 1) + h.substr(1, 1) + h.substr(2, 1) + h.substr(2, 1);
  while (h.length < 6) h = "0" + h;
  var r = parseInt(h.substr(0, 2), 16);
  var g = parseInt(h.substr(2, 2), 16);
  var b = parseInt(h.substr(4, 2), 16);
  if (isNaN(r)) r = 0;
  if (isNaN(g)) g = 0;
  if (isNaN(b)) b = 0;
  return [r, g, b];
}

/**
 * @class
 * @name Dyntable
 * @deprecated
 * @see tfw.dynamicTable
 */
function Dyntable(x){
  console.warn("DEPRECATED Dyntable, use tfw.dynamicTable instead.");
  return tfw.Dyntable(x);
}
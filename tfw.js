/**
 * @file Triobo Framework
 * @author mpl75
 * @author melanger
 */

/**
 * HTML to show when some content is being loaded.
 * @constant {string}
 * @default
 */
var AJAX_LOADER = '<div class="tfwDivContentLoader"><span></span></div>';

/**
 * Compare two numbers - for use with sorting functions.
 * @param {number} a
 * @param {number} b
 */
function cmp(a, b) {
    a = parseInt(a);
    b = parseInt(b);
    return a < b ? -1 : a > b;
}

function $(id) {
    var x = document.getElementById(id);
    return x;
}

HTMLElement.prototype.nodeOrder = function () {
    return Array.prototype.indexOf.call(this.parentNode.children, this);
}
HTMLElement.prototype.hasClass = function (c) {
    return (this.className.split(' ').indexOf(c) != -1);
}
HTMLElement.prototype.hasAnyClass = function (c) {
    var searchedClasses = c.split(' ');
    for (var i in searchedClasses) {
        if (this.className.split(' ').indexOf(searchedClasses[i]) != -1) {
            return true;
        }
    }
    return false;
}
HTMLElement.prototype.addClass = function (c) {
    if (!this.hasClass(c)) {
        if (this.className) {
            var cs = this.className.split(' ');
            cs.push(c);
            this.className = cs.join(' ');
        } else this.className = c;
    }
}
HTMLElement.prototype.removeClass = function (c) {
    var cs = this.className.split(' ');
    var id = cs.indexOf(c);
    if (id >= 0) cs.splice(id, 1);
    if (cs.length) this.className = cs.join(' ');
    else this.removeAttribute('class');
}
HTMLElement.prototype.toggleClass = function (c) {
    if (this.hasClass(c)) this.removeClass(c);
    else this.addClass(c);
}
HTMLElement.prototype.myOrder = function () {
    var x = 0;
    if (this.parentNode)
        for (var i = 0; i < this.parentNode.childNodes.length; i++)
            if (this == this.parentNode.childNodes[i]) x = i;
    return x;
}
HTMLElement.prototype.amIFirst = function () {
    var x = 0;
    if (!this.myOrder) x = 1;
    return x;
}
HTMLElement.prototype.amILast = function () {
    var x = 0;
    if (this.myOrder == (this.parentNode.childNodes.length - 1)) x = 1;
    return x;
}
HTMLElement.prototype.add = function (x) {
    this.appendChild(x);
}

/**
 * Triobo. This is a singleton.
 * @class
 */
var desktop = {
    div: null,
    layers: [],
    activeLayer: 0,
    width: 0,
    height: 0,
    resizingFunctions: [],
    isWorking: 0,
    mainLoaderTimer: null,
    URLbase: '',
    URLparams: [],
    go: null,
    dialogMoveData: {},
    init: function (id) {
        desktop.div = $(id);
        desktop.clean();
        window.addEventListener('resize', function() {
            desktop.width = desktop.div.clientWidth;
            desktop.height = desktop.div.clientHeight;
            for (var i = 0; i < desktop.resizingFunctions.length; i++) desktop.resizingFunctions[i]();
        }, false);
        var myURLparts = document.URL.split('?');
        desktop.URLbase = myURLparts[0];
        if (myURLparts.length > 1) desktop.URLparams = myURLparts[1].substr(2).split('/');
    },
    clean: function () {
        desktop.layers = [];
        desktop.activeLayer = 0;
        desktop.div.innerHTML = '';
        desktop.div.add(desktop.layers[0] = tfw.div({
            id: 'tfwLayer0',
            className: 'tfwLayer'
        }));
        desktop.width = desktop.div.clientWidth;
        desktop.height = desktop.div.clientHeight;
        desktop.resizingFunctions = [];
        isWorking: 0;
        if (desktop.mainLoaderTimer) clearTimeout(desktop.mainLoaderTimer);
    },
    closeTopLayer: function () {
        if (desktop.activeLayer) {
            desktop.layers[desktop.activeLayer].innerHTML = '';
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
    newLayer: function (params) {
        if (params.modal) {
            if (params.modal == 'auto') {
                params.modal = desktop.layers[desktop.activeLayer].hasClass('modal') ? 1 : 0;
            }
        }
        desktop.activeLayer++;
        desktop.div.add(desktop.layers[desktop.activeLayer] = tfw.div({
            id: 'tfwLayer' + desktop.activeLayer,
            className: 'tfwLayer' + (params.modal ? ' modal' : '')
        }));
        if (params.autoclose) {
            desktop.layers[desktop.activeLayer].addEventListener('click', desktop.closeTopLayer);
        }
        if (params.overlay) {
            desktop.layers[desktop.activeLayer].add(tfw.div({
                id: 'tfwLayerOverlay' + desktop.activeLayer,
                className: 'tfwLayerOverlay'
            }));
        }
        desktop.layers[desktop.activeLayer].addEventListener('mousemove', desktop.dialogMoveGo, false);
        desktop.layers[desktop.activeLayer].addEventListener('mouseup', desktop.dialogMoveEnd, false);
    },
    working: function (now) {
        if (!desktop.isWorking) {
            desktop.newLayer({});
            if (now) desktop.hide();
            else desktop.mainLoaderTimer = setTimeout('desktop.hide();', 500);
            desktop.isWorking = true;
        }
    },
    hide: function () {
        desktop.layers[desktop.activeLayer].add(tfw.div({
            id: 'tfwLayerOverlay' + desktop.activeLayer,
            className: 'tfwLayerOverlay',
            style: 'cursor:progress;'
        }));
        desktop.layers[desktop.activeLayer].add(tfw.div({
            id: 'tfwLoader',
            style: 'left:' + Math.round(desktop.width / 2 - 16) + 'px;top:' + Math.round(desktop.height / 2 - 16) + 'px'
        }));
    },
    done: function () {
        if (desktop.isWorking) {
            if (desktop.mainLoaderTimer) clearTimeout(desktop.mainLoaderTimer);
            desktop.closeTopLayer();
            desktop.isWorking = false;
        }
    },
    dialogMoveStart: function (e) {
        desktop.dialogMoveData = {
            x: e.clientX,
            y: e.clientY,
            who: e.target
        };
        while (desktop.dialogMoveData.who.className != 'tfwDialogContainer') desktop.dialogMoveData.who = desktop.dialogMoveData.who.parentNode;
        e.stopPropagation();
        e.preventDefault();
    },
    dialogMoveGo: function (e) {
        if ('who' in desktop.dialogMoveData) {
            var px = e.clientX - desktop.dialogMoveData.x;
            var py = e.clientY - desktop.dialogMoveData.y;
            desktop.dialogMoveData.x = e.clientX;
            desktop.dialogMoveData.y = e.clientY;
            desktop.dialogMoveData.who.style.left = parseInt(desktop.dialogMoveData.who.style.left) + px + 'px';
            desktop.dialogMoveData.who.style.top = parseInt(desktop.dialogMoveData.who.style.top) + py + 'px';
            e.stopPropagation();
            e.preventDefault();
        }
    },
    dialogMoveEnd: function (e) {
        if ('who' in desktop.dialogMoveData) {
            e.stopPropagation();
            e.preventDefault();
            desktop.dialogMoveData = {};
        }
    }
}

/**
 * Triobo framework. This is a singleton.
 * @class
 * @todo Replace {@link http://www.w3schools.com/js/js_reserved.asp|reserved words} in function names
 */
var tfw = {
    /**
     * Strings that are output by tfw functions. Change them for localization.
     * @enum {string}
     * @default
     */
    strings: {
        /** Label for checkbox with false value. */
        NO: 'No',
        /** Label for checkbox with true value. */
        YES: 'Yes',
        /** Word for 'all' (e.g. both true and false) */
        ALL: 'All',
        /** Minimum input label */
        FROM: 'From:',
        /** Maximum input label */
        TO: 'To:',
        /** Placeholder when searching anywhere in a string */
        FILTER: 'Filter…',
        /** Label of hidden rows count */
        HIDDEN_ROWS: 'Hidden rows'
    },
    /**
     * Add Javascript-generated CSS to the document.
     * @param {string} style - CSS to be added
     * @param {string} [tag] - identify (tag) CSS for overriding
     */
    insertStyle: function (style, tag) {
        var id = 'tfwInsertStyle';
        if (typeof(tag) != 'undefined') {
            id += '-' + tag;
        }
        if (document.getElementById(id) == null) {
            var styleElement = document.createElement('style');
            styleElement.setAttribute('id', id);
            document.getElementsByTagName('head')[0].add(styleElement);
        }
        if (typeof(tag) == 'undefined') {
            document.getElementById(id).innerHTML += style;
        } else {
            document.getElementById(id).innerHTML = style;
        }
    },
    /**
     * Initialization needed to run tfw functions (e.g. adds required CSS styling).
     * Can be run multiple times (after adding localized strings).
     */
    init: function () {
        var tfwStyling = '.tfwDynamicTable .tfwCheckbox:after{content:"' + tfw.strings.NO + '"}\n' +
            '.tfwDynamicTable .tfwCheckbox.checked:after{content:"' + tfw.strings.YES + '"}';
        tfw.insertStyle(tfwStyling, 'tfwDynamicTable-checkbox');
    },
    /**
     * Add new translations and re-{@link tfw.init|init} tfw.
     * @param {tfw.strings} newStrings - translated strings to be used (keys same as in {@link tfw.strings})
     * @see tfw.init
     */
    localize: function (newStrings) {
        for (var stringKey in newStrings) {
            tfw.strings[stringKey] = newStrings[stringKey];
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
     * @param {number} [params.maxLength] - maximum input length
     * @param {boolean} [params.evaluate=false] - evaluate (eval) field value after change (onchange), set to 1 or true
     * @param {function} [params.onchange] - function to call when field changes value (onchange fires)
     * @param {function} [params.onClick] - function to call when user clicks on the field (onclick fires)
     * @param {string} [params.value] - default field value (or button text)
     * @param {string} [params.placeholder] - text field placeholder
     */
    fillElemDefs: function (element, params) {
        if ('text' in params) {
            params.innerHTML = params.text;
        }
        var attributesToCopy = ['id', 'innerHTML', 'disabled', 'maxLength', 'evaluate', 'onclick', 'value', 'placeholder'];
        var i;
        for (i = 0; i < attributesToCopy.length; i++) {
            var attribute = attributesToCopy[i];
            if (attribute in params) {
                element[attribute] = params[attribute];
            }
        }
        if ('style' in params) {
            element.style.cssText = params.style;
        }
        if ('className' in params) {
            if (element.className) {
                element.className += ' ' + params.className;
            } else {
                element.className = params.className;
            }
        }
        if ('children' in params) {
            for (i = 0; i < params.children.length; i++) {
                if (params.children[i]) {
                    element.add(params.children[i]);
                }
            }
        }
        if ('onchange' in params) {
            element.speconchange = params.onchange;
        }
        if ('onchange' in params || 'evaluate' in params) {
            element.addEventListener('change', function () {
                if (this.speconchange) {
                    this.speconchange();
                }
                if (this.evaluate) {
                    var a;
                    try {
                        a = this.value.replace(/,/g, '.');
                        a = eval(a);
                        if (isNaN(a)) a = '';
                    } catch (err) {
                        a = this.value;
                    }
                    this.value = a;
                }
            });
        }
    },
    div: function (n) {
        var x = document.createElement('div');
        this.fillElemDefs(x, n);
        return x;
    },
    par: function (n) {
        var x = document.createElement('p');
        this.fillElemDefs(x, n);
        return x;
    },
    span: function (n) {
        var x = document.createElement('span');
        this.fillElemDefs(x, n);
        return x;
    },
    /**
     * Create a select field with specified parameters.
     * @param {Object} params - select parameters (for more see {@link tfw.fillElemDefs|fillElemDefs})
     * @see tfw.fillElemDefs
     * @param {boolean} [params.multiple] - can multiple values be selected
     * @param {(string|string[]|Object[])} params.list - list of options as string "label1;label2" or "label1|value1;label2|value2", as array of string labels or as object (nonspecified value defaults to numeric index, NOT label text)
     * @param {string} [params.list[].id] - value (defaults to numeric index of option)
     * @param {string} params.list[].t - label
     * @return {HTMLElement} Created select field.
     */
    select: function (params) {
        var element = document.createElement('div');
        params.className = 'tfwSelect ' + (('className' in params) ? params.className : '');
        element.multiple = ('multiple' in params && params.multiple);
        if (!('value' in params)) {
            params.value = '0';
        }
        if ("onchange" in params) element.onchange=params.onchange;
        this.fillElemDefs(element, params);
        element.clickOnItem = function (e) {
            e.stopPropagation();
            e.preventDefault();
            var i;
            if (element.multiple) {
                this.toggleClass('selected');
            } else {
                for (i = 0; i < element.childNodes.length; i++) element.childNodes[i].removeClass('selected');
                this.addClass('selected');
            }
            var m = [];
            for (i = 0; i < element.childNodes.length; i++) {
                if (element.childNodes[i].hasClass('selected')) {
                    m.push(element.childNodes[i].value);
                }
            }
            element.value = m.join(',');
            if (element.onchange) element.onchange();
        }
        if (!element.value) element.value = 0;
        var m = element.value.toString().split(',');
        if (typeof params.list === 'string') {
            var szn = params.list.split(';');
            params.list = [];
            for (var i = 0; i < szn.length; i++) {
                var prt = szn[i].split('|');
                if (prt.length == 1) prt[1] = i;
                params.list.push({
                    id: prt[1],
                    t: prt[0]
                });
            }
        }
        for (i = 0; i < params.list.length; i++) {
            var p = params.list[i];
            if (typeof p === 'string') p = {
                id: i,
                t: p
            };
            if (!('id' in p)) p.id = i;
            var l = document.createElement('div');
            l.value = '' + p.id;
            if ('n' in p) l.innerHTML = p.n;
            else l.innerHTML = p.t;
            if (m.indexOf(l.value) > -1) l.className = 'selected';
            l.addEventListener('mousedown', element.clickOnItem, false);
            element.add(l);
        }
        element.setValue = function (a) {
            for (var i = 0; i < element.childNodes.length; i++) {
                if (element.childNodes[i].value == a) {
                    element.childNodes[i].addClass('selected');
                } else {
                    element.childNodes[i].removeClass('selected');
                }
            }
            element.value = '' + a;
        }
        return element;
    },
    /**
     * Create a new layer and a wrapper that starts at a given element.
     * @param {HTMLElement} element - element to position wrapper at
     * @param {Object} params - parameters for {@link desktop.newLayer}
     * @param {boolean} [above=false] - whether to position above element instead of below
     * @return {HTMLElement} Created wrapper
     * @see desktop.newLayer
     */
    createLayerAndWrapperAtElement: function (element, params, above) {
        if (typeof(above) == 'undefined') {
            above = false;
        }
        desktop.newLayer(params);
        var rect = element.getBoundingClientRect();
        var wrapper;
        desktop.layers[desktop.activeLayer].add(wrapper = tfw.div({
            style: 'overflow:hidden;position:absolute;left:' + rect.left + 'px;' + (above ? 'bottom' : 'top') + ':' + (above ? (window.innerHeight -
                rect.top) : rect.bottom) + 'px'
        }));
        return wrapper;
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
    dropDown: function (params) {
        var y = document.createElement('p');
        y.className = 'tfwContainer';
        if (params.legend) {
            var l = document.createElement('span');
            l.style.display = 'inline-block';
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
            x.className = 'tfwDropDown ' + params.className;
        } else {
            x.className = 'tfwDropDown';
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
        x.onmousedown = function (e) {
            e.preventDefault();
        };
        x.onclick = function () {
            var vyska = params.list.length * x.itemHeight;
            if (params.maxHeight) {
                if (vyska > params.maxHeight) {
                    vyska = params.maxHeight;
                }
            }
            if (vyska > 210) {
                vyska = 210;
            }
            var rect = x.getBoundingClientRect();
            var c = tfw.createLayerAndWrapperAtElement(x, {
                autoclose: true,
                modal: 'auto'
            });
            var b = tfw.select({
                id: 'drop' + params.id,
                list: params.list,
                value: x.value,
                style: 'width:' + (rect.width - 2 + x.itemWidth) + 'px;position:relative;top:-1px;height:' + vyska + 'px;',
                onchange: function () {
                    for (i = 0; i < this.childNodes.length; i++)
                        if (this.childNodes[i].value == this.value) {
                            x.innerHTML = this.childNodes[i].innerHTML;
                            x.value = this.childNodes[i].value;
                        }
                    if (x.onchange) {
                        x.onchange();
                    }
                }
            });
            c.add(b);
            b.style.webkitTransform = 'translateY(-' + vyska + 'px)';
            window.setTimeout('$(\"drop' + params.id + '\").style.webkitTransform=\"\";', 10);
        };
        if (('value' in params) && params.list) {
            for (var i = 0; i < params.list.length; i++) {
                if (typeof params.list[i] === 'object') {
                    if (params.list[i].id == params.value) x.innerHTML = params.list[i].t;
                } else {
                    if (i == params.value) x.innerHTML = params.list[i];
                }
            }
        }
        if ('value' in params) {
            x.value = params.value;
        }
        x.setValue = function (a) {
            x.value = a;
            for (i = 0; i < params.list.length; i++) {
                if (typeof params.list[i] === 'object') {
                    if (params.list[i].id == a) x.innerHTML = params.list[i].t;
                } else {
                    if (i == a) x.innerHTML = params.list[i];
                }
            }
        }
        y.add(x);
        return y;
    },
    /**
     * Create a button with specified parameters.
     * @memberof tfw
     * @param {Object} params - button parameters (for more see {@link tfw.fillElemDefs|fillElemDefs})
     * @see tfw.fillElemDefs
     * @param {number} [params.step] - step between allowed numeric values
     * @param {boolean} [params.default=false] - if true, type=submit, otherwise type=button
     * @param {function} [params.action] - Function to fire when button is clicked (event propagation is stopped)
     * @return {HTMLElement} Created button
     */
    button: function (params) {
        var element = document.createElement('button');
        this.fillElemDefs(element, params);
        element.type = ((params.default) ? 'submit' : 'button');
        if (params.action) {
            element.action = params.action;
            element.onclick = function (e) {
                e.stopPropagation();
                if (!this.disabled) {
                    this.action(e);
                }
            }
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
     * @param {string} [params.containerId] - legend container ID
     * @param {string} [params.containerStyle] - legend container CSS styling
     * @param {string} [params.postText] - text after input field
     * @return {HTMLElement} container with legend and input field
     */
    inputFieldLegend: function (element, params) {
        var x = document.createElement('p');
        var l = document.createElement('span');
        if (params.legend) l.innerHTML = params.legend;
        if (params.legendStyle) l.style.cssText = params.legendStyle;
        if (params.containerId) x.id = params.containerId;
        x.className = 'tfwContainer' + (params.containerClassName ? (' ' + params.containerClassName) : '');
        if (params.containerStyle) x.style.cssText = params.containerStyle;
        x.add(l);
        x.add(element);
        if (params.postText) x.add(tfw.span({
            innerHTML: params.postText
        }));
        return x;
    },
    /**
     * Create an input field with specified parameters.
     * @memberof tfw
     * @param {Object} params - input fields parameters (for more see {@link tfw.fillElemDefs|fillElemDefs} and {@link tfw.inputFieldLegend|inputFieldLegend})
     * @see tfw.fillElemDefs
     * @see tfw.inputFieldLegend
     * @param {string} [params.type="text"] - input field type
     * @param {string} [params.value] - prefilled value
     * @param {number} [params.min] - minimum allowed value
     * @param {number} [params.max] - maximum allowed value
     * @param {number} [params.step] - step between allowed numeric values
     * @return {HTMLElement} Created input field
     */
    input: function (params) {
        var element = document.createElement('input');
        this.fillElemDefs(element, params);
        var attributesToCopy = ['type', 'min', 'max', 'step'];
        for (var i = 0; i < attributesToCopy.length; i++) {
            if (attributesToCopy[i] in params) {
                element[attributesToCopy[i]] = params[attributesToCopy[i]];
            }
        }
        return (params.legend) ? (this.inputFieldLegend(element, params)) : element;
    },
    /**
     * Create a text area with specified parameters.
     * @memberof tfw
     * @param {Object} params - text area parameters (for more see {@link tfw.fillElemDefs|fillElemDefs} and {@link tfw.inputFieldLegend|inputFieldLegend})
     * @see tfw.fillElemDefs
     * @see tfw.inputFieldLegend
     * @param {string} [params.value] - prefilled value
     * @return {HTMLElement} Created text area
     */
    textArea: function (params) {
        var element = document.createElement('textarea');
        this.fillElemDefs(element, params);
        if (params.value) {
            element.innerHTML = params.value;
        }
        return (params.legend) ? (this.inputFieldLegend(element, params)) : element;
    },
    /**
     * Create a checkbox with specified parameters.
     * @memberof tfw
     * @param {Object} params - checkbox parameters (for more see {@link tfw.fillElemDefs|fillElemDefs} and {@link tfw.inputFieldLegend|inputFieldLegend})
     * @see tfw.fillElemDefs
     * @see tfw.inputFieldLegend
     * @param {function} [params.onchange] - function to call when field changes value (onchange fires)
     * @param {string} [params.text] - checkbox label text
     * @param {string} [params.value=0] - initial value (0=unchecked,1=checked)
     * @return {HTMLElement} Created checkbox
     * @todo Use "value" for real value, instead of using it for "checked"
     */
    checkbox: function (params) {
        var x = document.createElement('div');
        var labelText = (params.text) ? params.text : '';
        params.text = '';
        this.fillElemDefs(x, params);
        x.addClass('tfwCheckbox');
        if (params.onchange) x.onchange = params.onchange;
        if (params.onclick) x.onclick = params.onclick;
        var b = document.createElement('div');
        x._value = 0;
        if ('value' in params) x._value = params.value ? 1 : 0;
        x.className += x._value ? ' checked' : '';
        b.className = x._value ? 'checked' : '';
        x.add(b);
        var t = document.createElement('span');
        t.innerHTML = labelText;
        x.add(t);
        Object.defineProperty(x, 'value', {
            set: function (val) {
                var b = this.childNodes[0];
                if (val) {
                    b.addClass('checked');
                    x.addClass('checked');
                } else {
                    b.removeClass('checked');
                    x.removeClass('checked');
                }
                this._value = val;
                if (this.onchange) this.onchange();
            },
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(x, 'disabled', {
            set: function (val) {
                if (val) this.addClass('disabled');
                else this.removeClass('disabled');
                this.zakazano = val;
            },
            get: function () {
                return this.zakazano;
            },
            enumerable: true,
            configurable: true
        });
        x.addEventListener('click', function(e) {
            if (!this.zakazano) x.value = 1 - this._value;
            e.stopPropagation();
            e.preventDefault();
        }, false);
        if (params.disabled) x.disabled = 1;
        return x;
    },
    /**
     * Create an icon with specified parameters.
     * @memberof tfw
     * @param {Object} params - icon parameters (for more see {@link tfw.fillElemDefs|fillElemDefs})
     * @see tfw.fillElemDefs
     * @param {function} [params.action] - function triggered when icon is clicked (basically onclick)
     * @param {number} [params.index] - move background image up by this number of pixels (background-position-x)
     * @return {HTMLElement} Created icon
     */
    icon: function (params) {
        var element = document.createElement('div');
        params.className = 'tfwIcon' + ((params.className) ? (' ' + params.className) : '');
        this.fillElemDefs(element, params);
        if (params.action) {
            element.action = params.action;
            element.onclick = function (e) {
                if (!element.hasClass('disabled')) this.action(e);
            }
        }
        var b = document.createElement('div');
        if (params.index) b.style.backgroundPositionX = (-params.index) + 'px';
        element.add(b);
        element.disabled = 0;
        Object.defineProperty(element, 'disabled', {
            set: function (val) {
                if (val) element.addClass('disabled');
                else element.removeClass('disabled');
            },
            get: function () {
                return element.hasClass('disabled')
            },
            enumerable: true,
            configurable: true
        });
        if (params.disabled) element.disabled = params.disabled;
        Object.defineProperty(element, 'selected', {
            set: function (val) {
                if (val) element.addClass('selected');
                else element.removeClass('selected');
            },
            get: function () {
                return element.hasClass('selected')
            },
            enumerable: true,
            configurable: true
        });
        if (params.selected) element.selected = 1;
        return element;
    },
    /**
     * Create a table with specified parameters.
     * @memberof tfw
     * @param {Object} params - table parameters (for more see {@link tfw.fillElemDefs|fillElemDefs}, use params.children for rows)
     * @see tfw.fillElemDefs
     * @return {HTMLElement} Created table
     */
    table: function (params) {
        var element = document.createElement('table');
        this.fillElemDefs(element, params);
        return element;
    },
    /**
     * Create a table row with specified parameters.
     * @memberof tfw
     * @param {Object} params - table row parameters (for more see {@link tfw.fillElemDefs|fillElemDefs}, use params.children for columns/cells)
     * @see tfw.fillElemDefs
     * @param {Array} [params.columns] - list of objects, that will be passed to tfw.td and added as children
     * @return {HTMLElement} Created table row
     */
    tr: function (params) {
        var element = document.createElement('tr');
        this.fillElemDefs(element, params);
        if ('columns' in params)
            for (var i = 0; i < params.columns.length; i++) element.add(tfw.td(params.columns[i]));
        return element;
    },
    /**
     * Create a table cell with specified parameters.
     * @memberof tfw
     * @param {Object} params - table cell parameters (for more see {@link tfw.fillElemDefs|fillElemDefs})
     * @param {number} [params.colspan] - number of columns that this cell will merge
     * @see tfw.fillElemDefs
     * @return {HTMLElement} Created table cell
     */
    td: function (params) {
        var element = document.createElement('td');
        this.fillElemDefs(element, params);
        if ('colspan' in params) {
            element.setAttribute('colspan', params.colspan);
        }
        return element;
    },
    /**
     * Create a slider with specified parameters.
     * @memberof tfw
     * @param {Object} params - slider parameters (for more see {@link tfw.fillElemDefs|fillElemDefs})
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
    slider: function (params) {
        var element = document.createElement('p');
        element.min = 0;
        element.max = 100;
        params.className = 'tfwSlider' + ((params.className) ? (' ' + params.className) : '');
        var sliderValue = ('value' in params) ? params.value : 0;
        params.value = false;
        this.fillElemDefs(element, params);
        var l = document.createElement('span');
        element.add(l);
        if (params.legend) l.innerHTML = params.legend;
        if (params.legendStyle) l.style.cssText = params.legendStyle;
        var s = document.createElement('input');
        element.add(s)
        s.type = 'range';
        if (params.id) s.id = params.id + '-s';
        if (params.max) {
            s.max = params.max;
            element.max = params.max;
        }
        if ('min' in params) {
            s.min = params.min;
            element.min = params.min;
        }
        if (params.step) s.step = params.step;
        if (params.width) s.style.width = params.width;
        s.value = sliderValue;
        s.oninput = function () {
            $(params.id + '-v').value = this.value;
            if (element.onchange) element.onchange();
        }
        s.onkeyup = function () {
            $(params.id + '-v').value = this.value;
            if (element.onchange) element.onchange();
        }
        var v = document.createElement('input');
        element.add(v)
        v.type = 'text';
        if (params.id) v.id = params.id + '-v';
        if (params.valueStyle) v.style.cssText = params.valueStyle;
        v.style.textAlign = 'right';
        v.value = sliderValue;
        v.onchange = function () {
            if (!this.value.match(/^\d+$/)) this.value = 0;
            if (this.value < element.min) this.value = element.min;
            if (this.value > element.max) this.value = element.max;
            $(params.id + '-s').value = this.value;
            if (element.onchange) element.onchange();
        }
        v.addEventListener('keydown', function(e) {
            var h = parseInt(this.value);
            if (e.which == 38) {
                this.value = h - (e.altKey ? 8 : 1);
                if (this.value < element.min) this.value = element.min;
                $(element.id + '-s').value = this.value;
                if (element.onchange) element.onchange();
                e.stopPropagation();
                e.preventDefault();
            }
            if (e.which == 40) {
                this.value = h + (e.altKey ? 8 : 1);
                if (this.value > element.max) this.value = element.max;
                $(element.id + '-s').value = this.value;
                if (element.onchange) element.onchange();
                e.stopPropagation();
                e.preventDefault();
            }
        }, true);
        Object.defineProperty(element, 'value', {
            set: function (a) {
                this.childNodes[1].value = a;
                this.childNodes[2].value = a;
            },
            get: function () {
                return this.childNodes[2].value;
            },
            enumerable: true,
            configurable: true
        });
        if (params.postText) {
            var p = document.createElement('span');
            element.add(p);
            p.innerHTML = params.postText;
            if (params.postStyle) p.style.cssText = params.postStyle;
        }
        return element;
    },
    image: function (n) {
        var x = document.createElement('img');
        this.fillElemDefs(x, n);
        if (n.src) x.src = n.src;
        if (n.title) x.title = n.title;
        return x;
    },
    /** @todo Remove dependencies on Triobo */
    filebox: function (n) {
        /* eslint-disable no-undef */
        var x = document.createElement('div');
        if (n.id) x.id = n.id;
        else x.id = 'filebox';
        if (n.className) n.className = 'tfwFilebox ' + n.className;
        else n.className = 'tfwFilebox';
        x.className = n.className;
        if (n.style) x.style.cssText = n.style;
        if (n.text) x.text = n.text;
        else x.text = '';
        if (n.value) x.value = n.value;
        else x.value = 0;
        if (n.filename) x.filename = n.filename;
        else x.filename = '';
        if (n.path) x.path = n.path;
        else x.path = '';
        if (n.imgStyle) x.imgStyle = 'style="' + n.imgStyle + '" ';
        else x.imgStyle = '';
        if (n.onloaded) x.onloaded = n.onloaded;
        else x.onloaded = null;
        if (n.onstart) x.onstart = n.onstart;
        else x.onstart = null;
        if (n.limitExtensions) x.limitExtensions = n.limitExtensions;
        else x.limitExtensions = '';
        x.uploading = 0;
        var b = tfw.div({});
        x.add(b);
        b.className = 'content';
        if (n.style) b.style.cssText = n.style;
        b.addEventListener('click', function() {
            x.childNodes[1].click();
        });
        b.addEventListener('dragenter', function(e) {
            this.style.outline = 'red 2px solid';
            e.stopPropagation();
            e.preventDefault();
        }, false);
        b.addEventListener('dragleave', function(e) {
            this.style.outline = '';
            e.stopPropagation();
            e.preventDefault();
        }, false);
        b.addEventListener('dragover', function(e) {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        b.addEventListener('drop', function(e) {
            e.stopPropagation();
            e.preventDefault();
            this.style.outline = '';
            x.upload(e.dataTransfer.files);
        }, false);
        x.add(b = document.createElement('input'));
        b.type = 'file';
        b.style.display = 'none';
        b.addEventListener('change', function(e) {
            x.upload(e.target.files);
        });
        x.prekresli = function (prc) {
            if (x.uploading) {
                x.childNodes[0].innerHTML = '<p class="verticalCenter" style="height:20px;">' + tPRELOZ('Uploading ') + prc + ' %' + '</p>';
            } else if (x.value) {
                x.removeClass('empty');
                if (x.filename.match(/\.(gif|jpg|jpeg|png)$/i)) {
                    x.childNodes[0].innerHTML = '<img id="fileboximg' + x.id + '" class="verticalCenter" ' + x.imgStyle + ' src="/zdroje/' + x.path +
                        x.filename + '?' + x.value + '">';
                } else {
                    x.childNodes[0].innerHTML = '<p class="verticalCenter" style="height:20px;">' + x.filename + '</p>';
                }
            } else {
                x.addClass('empty');
                x.childNodes[0].innerHTML = '<p class="verticalCenter" style="height:40px;">' + x.text + '</p>';
            }
        }
        x.upload = function (u) {
            x.prekresli(0);
            var jmeno = u[0].name;
            var canbe = 1;
            if (x.limitExtensions) {
                var re = new RegExp('\.(' + x.limitExtensions + ')$', 'i');
                if (!jmeno.match(re)) canbe = 0;
            }
            if (canbe) {
                if (x.onstart) x.onstart();
                x.uploading = u[0].size;
                x.hr = new XMLHttpRequest();
                var fUp = x.hr.upload;
                fUp.addEventListener('progress', function(e) {
                    x.prekresli(Math.round(e.loaded / x.uploading * 100));
                });
                fUp.addEventListener('load', function() {
                    x.uploading = 0;
                    x.value = Math.floor(Math.random() * 1000000) + 1;
                    if (x.onloaded) x.onloaded();
                    window.setTimeout('$("' + x.id + '").prekresli();', 500);
                });
                x.hr.open('POST', 'uploadFile.php?token=' + token);
                x.hr.setRequestHeader('X_FILENAME', x.path + x.filename);
                x.hr.send(u[0]);
            } else {
                var lims = x.limitExtensions.split('|');
                var lastl = lims.pop();
                var lim;
                if (lims.length) lim = '<b>' + lims.join('</b>, <b>') + '</b>' + tPRELOZ(' or ') + '<b>' + lastl + '</b>';
                else lim = '<b>' + lastl + '</b>';
                chyba('#300-' + tPRELOZ('Only ' + lim + ' files are allowed.'));
            }
        };
        x.remove = function () {}
        x.prekresli();
        return (n.legend) ? (this.inputFieldLegend(x, n)) : x;
        /* eslint-enable no-undef */
    },
    dialog: function (co) {
        var b;
        desktop.newLayer({
            overlay: true,
            modal: true
        });
        var vnit, dlg;
        var sirka = 300,
            vyska = 200,
            nazev = '';
        if (co.width) sirka = co.width;
        if (co.height) vyska = co.height;
        if (co.title) nazev = co.title;
        var obal = tfw.div({
            className: 'tfwDialogContainer' + (nazev ? '' : ' noTitle'),
            style: 'left:' + Math.round((desktop.width - sirka) / 2) + 'px;top:' + Math.round((desktop.height - vyska) / 2) + 'px;width:' +
                sirka + 'px;height:' + vyska + 'px;'
        });
        obal.style.webkitTransform = 'translateY(-32px)';
        obal.style.opacity = 0;
        obal.id = 'tfwDialog' + desktop.activeLayer;
        desktop.layers[desktop.activeLayer].add(obal);
        if (nazev) {
            var h = tfw.par({
                innerHTML: nazev,
                className: 'tfwDialogTitle'
            });
            obal.add(h);
            h.addEventListener('mousedown', desktop.dialogMoveStart, false);
        }
        var f = document.createElement('form');
        f.onsubmit = function (e) {
            e.stopPropagation();
            e.preventDefault();
        };
        obal.add(f);
        f.add(vnit = tfw.div({
            className: 'tfwDialog',
            style: 'height:' + (vyska - (nazev ? 60 : 32)) + 'px'
        }));
        desktop.layers[desktop.activeLayer].addEventListener('keydown', function(e) {
            if (e.which == 27) desktop.closeTopLayer();
        }, true);
        /**/
        vnit.add(dlg = tfw.div({
            style: 'height:' + (vyska - (nazev ? 60 : 32) - 27) + 'px'
        }));
        dlg.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        }, false);
        if (co.obsah) dlg.innerHTML = co.obsah;
        var i;
        if (co.children){
            for (i = 0; i < co.children.length; i++){
                dlg.add(co.children[i]);
            }
        }
        vnit.add(dlg.buttons = tfw.div({
            className: 'buttonsBar'
        }));
        if (co.buttons){
            for (i = 0; i < co.buttons.length; i++){
                if (co.buttons[i].text) {
                    dlg.buttons.add(b = tfw.button(co.buttons[i]));
                    if (!co.vychozi)
                        if (b.type == 'submit') b.focus();
                }
            }
        }
        if (co.id) dlg.id = co.id;
        if (co.vychozi) $(co.vychozi).focus();
        window.setTimeout('$(\"tfwDialog' + desktop.activeLayer + '\").style.webkitTransform=\"\";$(\"tfwDialog' + desktop.activeLayer +
            '\").style.opacity=1;', 10);
        return dlg;
    },
    /** @todo Remove dependencies on Triobo */
    dialogPrepareAndDownload: function (co) {
        /* eslint-disable no-undef */
        var dlgPaD = tfw.dialog({ // eslint-disable-line no-unused-vars
            width: 360,
            height: 140,
            title: co.title,
            children: [
                tfw.div({
                    id: 'dlgPaD',
                    children: [
                        tfw.par({
                            innerHTML: co.waiting
                        }), tfw.par({
                            innerHTML: AJAX_LOADER
                        })
                    ]
                })
            ],
            buttons: [{
                text: t(1),
                action: desktop.closeTopLayer
            }]
        });
        ajaxGet(co.ajaxFile, co.ajaxParam, function(hr) {
            $('dlgPaD').innerHTML = co.text.replace('%1', '<a href="' + hr.responseText + '" download>' + co.item + '</a>');
        }, 0);
        /* eslint-enable no-undef */
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
     * @param {number} [o.autohide=0] - whether to show overlay after finishing (1 = yes after 500ms, 2 = yes immediately)
     * @param {string} [o.method="GET"] - HTTP method to be used (GET or POST)
     * @param {string} [o.parameters=null] - parameters to be send with the request (e.g. POST)
     * @return {XMLHttpRequest} - Returns XMLHttpRequest object
     * @see tfw.ajaxIncludeParams
     * @see tfw.ajaxOnErrorCode
     * @see tfw.ajaxOnError
     */
    ajaxGet: function (o) {
        if (!('method' in o)) {
            o.method = 'GET';
        }
        if (!('parameters' in o)) {
            o.parameters = null;
        }
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                desktop.done();
                if (httpRequest.status === 200) {
                    var pe = 0;
                    if (tfw.ajaxOnErrorCode) {
                        var rt = httpRequest.responseText;
                        if (rt.substr(0, 1) == '#') pe = 1;
                    }
                    if (pe) {
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
                case 'GET':
                    ur += '&' + tfw.ajaxIncludeParams();
                    break;
                case 'POST':
                    o.parameters += '&' + tfw.ajaxIncludeParams();
                    break;
            }
        }
        console.info('Desktop ajax ' + o.method + ' ' + ur);
        httpRequest.open(o.method, ur);
        switch (o.method) {
            case 'GET':
                httpRequest.setRequestHeader('Cache-Control', 'max-age=0,no-cache,no-store,post-check=0,pre-check=0');
                break;
            case 'POST':
                httpRequest.setRequestHeader('Cache-Control', 'no-cache');
                httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                break;
        }
        httpRequest.send(o.parameters);
        if (o.autohide) {
            desktop.working((o.autohide == 2) ? 1 : 0);
        }
        return httpRequest;
    },
    /**
     * Post data to server via AJAX.
     * @memberof tfw
     * @param {Object} o - parameters object (see {@link tfw.ajaxGet})
     * @return {XMLHttpRequest} - Returns XMLHttpRequest object
     * @see tfw.ajaxGet
     */
    ajaxPost: function (o) {
        o.method = 'POST';
        return tfw.ajaxGet(o);
    },
    /**
     * Encode all items as URL.
     * @memberof tfw
     * @param {Object} fields - items to be encoded {key1:id1,key2:id2,...}
     * @return {string} String, that can be used to call server via ajax
     */
    encodeFormValues: function (fields) {
        var x = [];
        for (var key in fields)
            if (fields.hasOwnProperty(key)) {
                x.push(key + '=' + encodeURIComponent($(fields[key]).value));
            }
        return x.join('&');
    },
    /**
     * Decode JSON data, show error in case they are invalid.
     * @memberof tfw
     * @param {string} json - JSON encoded data
     * @return {Object} Object that was encoded in given JSON string.
     */
    decodeJSON: function (json) {
        var odpoved = {};
        try {
            odpoved = JSON.parse(json);
        } catch (e) {
            tfw.dialog({
                width: 600,
                height: 420,
                title: 'Error',
                children: [
                    tfw.div({
                        innerHTML: 'This is unknown error, please contact Triobo representative:',
                        className: 'nazev'
                    }), tfw.div({
                        style: 'width:100%;height:300px;overflow-y:scroll;font-size:80%;',
                        innerHTML: json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                    })
                ],
                buttons: [{
                    action: desktop.closeTopLayer,
                    text: 'x'
                }]
            });
        }
        return odpoved;
    },
    getRealCoordinates: function (o) {
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        do {
            totalOffsetX += o.offsetLeft - o.scrollLeft;
            totalOffsetY += o.offsetTop - o.scrollTop;
        } while (o = o.offsetParent); // eslint-disable-line no-cond-assign
        return [totalOffsetX, totalOffsetY];
    },
    /* bude postupně také odstraněno (nahrazeno novými metodami) */
    novyElement: function (typ, id, c, obsah, styl) {
        //console.error('DEPRECATED novyElement '+id);  -- tohoto je ještě strašně moc………
        var x = document.createElement(typ);
        if (id) x.setAttribute('id', id);
        if (c) x.setAttribute('class', c);
        if (obsah) x.innerHTML = obsah;
        if (styl) x.setAttribute('style', styl);
        return x;
    },
    /** @todo Remove dependencies on Triobo */
    noveZalozky: function (id, w, h, zalozky, init) {
        /* eslint-disable no-undef */
        var l;
        var x = document.createElement('div');
        x.id = id;
        x.className = 'zalozkyObal';
        x.value = init;
        var u = document.createElement('div');
        u.className = 'zalozkySeznam';
        x.add(u);
        var z = zalozky.split(';'),
            i;
        for (i = 0; i < z.length; i++) {
            l = document.createElement('p');
            l.id = id + '-ousko-' + i;
            l.className = 'zalozkyOusko' + ((i == init) ? ' aktivni' : '');
            l.innerHTML = z[i];
            l.addEventListener('mousedown', function(e) {
                var t = e.target;
                var jmeno = t.parentNode.parentNode.id;
                var stary = cislo(t.parentNode.parentNode.value);
                var novy = t.id.substr(t.id.lastIndexOf('-') + 1);
                if (novy != stary) {
                    if (stary >= 0) {
                        document.getElementById(jmeno + '-obsah-' + stary).className = 'zalozkyObsah skryty';
                        document.getElementById(jmeno + '-ousko-' + stary).className = document.getElementById(jmeno + '-ousko-' + stary).className
                            .replace(/ aktivni/i, '');
                    }
                    document.getElementById(jmeno + '-obsah-' + novy).className = 'zalozkyObsah';
                    document.getElementById(jmeno + '-ousko-' + novy).className += ' aktivni';
                    t.parentNode.parentNode.value = novy;
                }
                e.stopPropagation();
                e.preventDefault();
            }, false);
            u.add(l);
        }
        /*x.add(tfw.novyElement('br'));*/
        for (i = 0; i < z.length; i++) {
            o = document.createElement('div');
            o.id = id + '-obsah-' + i
            o.className = 'zalozkyObsah' + ((i == init) ? '' : ' skryty');
            o.style.width = w + 'px';
            o.style.height = h + 'px';
            x.add(o);
        }
        return x;
        /* eslint-enable no-undef */
    },
    noveSvisleZalozky: function (id, wl, w, h, zalozky, init) {
        var l;
        var poziceY = 0;
        var idxs = new Array();
        var x = document.createElement('div');
        x.id = id;
        x.className = 'zalozkyObal';
        x.value = null;
        x.vybrany = 0;
        x.w = w;
        x.h = h;
        var u = document.createElement('div');
        u.className = 'zalozkySvisleSeznam';
        u.style.width = wl + 'px';
        u.style.height = h + 'px';
        x.add(u);
        x.vyber = function (ord) {
            var stary = this.value;
            var novy = this.childNodes[0].childNodes[ord].value;
            if (novy != stary) {
                if ($(this.id + '-ousko-' + stary)) {
                    $(this.id + '-obsah-' + stary).className = 'zalozkySvisleObsah skryty';
                    $(this.id + '-ousko-' + stary).className = $(this.id + '-ousko-' + stary).className.replace(/ aktivni/i, '');
                    if ($(this.id + '-obsah-' + stary).onHide) $(this.id + '-obsah-' + stary).onHide();
                }
                $(this.id + '-obsah-' + novy).className = 'zalozkySvisleObsah';
                $(this.id + '-ousko-' + novy).className += ' aktivni';
                if ($(this.id + '-obsah-' + novy).onShow) $(this.id + '-obsah-' + novy).onShow();
                this.value = novy;
                this.vybrany = ord;
                if (this.onchange) this.onchange();
            }
        }
        x.appendItem = function (item) {
            l = document.createElement('p');
            l.id = this.id + '-ousko-' + item.id;
            l.className = 'zalozkyOusko' + (item.aktivni ? ' aktivni' : '');
            l.innerHTML = item.text;
            l.value = item.id;
            l.addEventListener('mousedown', function(e) {
                this.parentNode.parentNode.vyber(this.myOrder());
                e.stopPropagation();
                e.preventDefault();
            }, false);
            this.childNodes[0].add(l);
            var o = document.createElement('div');
            o.id = this.id + '-obsah-' + item.id;
            o.className = 'zalozkySvisleObsah' + (item.aktivni ? '' : ' skryty');
            o.style.width = this.w + 'px';
            o.style.height = this.h + 'px';
            o.removeItem = function () {
                if (this.onHide) this.onHide();
                var casti = this.id.split('-');
                var a = $(casti[0] + '-obsah-' + casti[2]);
                var b = $(casti[0] + '-ousko-' + casti[2]);
                a.parentNode.removeChild(a);
                b.parentNode.removeChild(b);
            }
            x.add(o);
        }
        var z = zalozky.split(';'),
            sp,
            ind;
        for (var i = 0; i < z.length; i++) {
            sp = z[i].split('|');
            if (sp.length > 1) ind = sp[1];
            else ind = i;
            idxs[i] = ind;
            if (ind == init) {
                poziceY = i;
                x.vybrany = i;
                x.value = ind;
            }
            x.appendItem({
                id: ind,
                aktivni: (ind == init) ? 1 : 0,
                text: sp[0]
            });
        }
        window.setTimeout('if ($("' + id + '")) $("' + id + '").childNodes[0].scrollTop=' + (poziceY * 20) + ';', 20);
        return x;
    },
    /** @todo Remove dependencies on Triobo */
    zvolSvislouZalozku: function (jmeno, novy) {
        /* eslint-disable no-undef */
        var stary = cislo($(jmeno).value);
        if (novy != stary) {
            if (stary >= 0) {
                $(jmeno + '-obsah-' + stary).className = 'zalozkySvisleObsah skryty';
                $(jmeno + '-ousko-' + stary).className = $(jmeno + '-ousko-' + stary).className.replace(/ aktivni/i, '');
            }
            $(jmeno + '-obsah-' + novy).className = 'zalozkySvisleObsah';
            $(jmeno + '-ousko-' + novy).className += ' aktivni';
            $(jmeno).value = novy;
        }
        /* eslint-enable no-undef */
    },
    novyCudl: function (id, c, pozice, stisk, popis) {
        var x = document.createElement('div');
        x.className = 'cudl';
        var b = document.createElement('div');
        b.id = id;
        b.className = c;
        if (popis) b.title = popis;
        b.style.backgroundPositionX = (-pozice) + 'px';
        b.addEventListener('mousedown', stisk, false);
        x.add(b);
        return x;
    },
    vstupniPole: function (id, styl, legenda, stylL, postT, postL) {
        var x = document.createElement('div');
        x.className = 'vstup';
        x.innerHTML = '<span class="legenda"' + (stylL ? (' style="' + stylL + '"') : '') + '>' + legenda + '</span><input id="' + id +
            '" type="text" class="data"' + (styl ? (' style="' + styl + '"') : '') + '>' + (postT ? '<span ' + (postL ? (' style="' + postL + '"') : '') +
                '>' + postT + '</span>' : '');
        return x;
    },
    vstupniPoleR: function (id, styl, legenda, stylL, postT, postL) {
        styl += ';text-align:right;';
        var x = this.vstupniPole(id, styl, legenda, stylL, postT, postL);
        return x;
    },
    zatrzitko: function (id, text, init, styl) {
        console.error('DEPRECATED tfw.zatrzitko');
        return tfw.checkbox({
            id: id,
            text: text,
            value: init,
            style: styl
        });
    },
    tlacitko: function (id, text, funkce, styl) {
        var x = document.createElement('div');
        x.id = id;
        x.className = 'button';
        x.onclick = funkce;
        x.innerHTML = text;
        if (styl) x.style.cssText = styl;
        return x;
    },
    progressBar: function (id, styl) {
        var x = document.createElement('div');
        x.id = id;
        x.style.cssText = styl;
        x.className = 'progressbar';
        var y = document.createElement('div');
        x.add(y);
        y.add(document.createElement('div'));
        return x;
    },
    novySelect: function (id, w, h, l, i) /* nahradit!!! */ {
        return tfw.select({
            id: id,
            style: 'width:' + w + 'px;height:' + h + 'px;',
            list: l,
            value: i
        })
    },
    /**
     * Callback that creates content to insert into a custom column.
     * @callback tfw.dynamicTableClass~columnRenderer
     * @param {string} columnValue - value that was loaded as data from server
     * @return {HTMLElement[]} - Return array of elements to be inserted into table cell
     */
    /**
     * Class for creating dynamic tables.
     * @class
     * @todo View preferences (width, order of columns)
     * @param {Object} params - table parameters
     * @param {string} params.baseURL - URL of script (etc.) handling data, without query string
     * @param {string} [params.urlParams] - general parameters appended to requests (e.g. a token)
     * @param {string} [params.id='dynamicTable'] - table ID (name) - required for field (cell) updates
     * @param {tfw.dynamicTableClass~rowEdit} [params.rowEdit] - Function fired when row editing/adding is triggered
     * @param {tfw.dynamicTableClass~goToSub} [params.goToSub] - Function fired when moving to subordinate table is triggered
     * @param {boolean} [params.rowAdd=false] - whether to allow adding new rows
     * @param {string} [params.bodyHeight] - (CSS) height of table body including unit (to make header and footer always visible)
     * @param {boolean} [params.watchChanges=false] - whether to allow {@link tfw.dynamicTableClass#serverWatch|watching} for changes (long polling)
     * @param {function} [params.onload] - function to call after data is loaded for the first time
     * @param {tfw.dynamicTableClass~columnRenderer[]} [params.columnRenderers] - functions to create custom columns' content
     * @example
     * function myRowEditFunction(id){
     *     // ...
     * }
     * var table = document.body.appendChild(
     *  tfw.dynamicTable(
     *   {
     *    id: 'table1',
     *    baseURL: 'data.php',
     *    urlParams: 'token=Nd5qPxH&timestamp=1234567890',
     *    rowEdit: myRowEditFunction,
     *    bodyHeight: '300px'
     *   }
     *  )
     * );
     * @see AJAX_LOADER
     */
    dynamicTableClass: function (params) {
        /**
         * @private
         */
        var tableId = ('id' in params) ? params.id : 'dynamicTable';
        /**
         * DIV containing the table.
         * @var {Object}
         * @default
         * @readonly
         */
        this.tableContainer = tfw.div({
            innerHTML: AJAX_LOADER,
            className: 'tfwDynamicTableContainer'
        });
        var baseURL = params.baseURL;
        /**
         * @var {string}
         * @private
         */
        var urlParams = ('urlParams' in params) ? params.urlParams : '';
        /**
         * @var {string}
         * @private
         */
        var bodyHeight = ('bodyHeight' in params) ? params.bodyHeight : null;
        /**
         * Data obtained from server. {@link tfw.dynamicTableClass#reload|reload()} has to be called to fill this.
         * Any other attributes provided by server are preserved (e.g. data.meta).
         * @var {Object}
         * @default null
         * @public
         * @readonly
         * @property {Object[]} cols - list of columns
         * @property {string} cols[].name - name (HTML)
         * @property {number} [cols[].width=200] - width (in pixels)
         * @property {boolean} [cols[].hidden=false] - hidden
         * @property {?tfw.dynamicTableClass.colTypes} [cols[].type=null] - type of field (string)
         * @property {boolean} [cols[].sort=false] - whether to allow sorting by this column's values
         * @property {(boolean|number)} [cols[].filter=false] - whether to allow filtering/searching (depends on type; 1=match from beginning, 2=match anywhere)
         * @property {boolean} [cols[].subtable=false] - whether this column should contain a link to subtable (handled by goToSub)
         * @property {Object[]} rows - list of rows
         * @property {number} rows[].id - row ID
         * @property {string[]} rows[].cols - contents for each column (HTML)
         */
        this.data = null;
        /**
         * Function that handles row editing.
         * @callback tfw.dynamicTableClass~rowEdit
         * @param {number} id - ID of the row being edited or 0 if new row is being inserted
         */
        /**
         * @private
         */
        var rowEdit = ('rowEdit' in params) ? params.rowEdit : null;
        /**
         * @var {boolean}
         * @private
         */
        var addRowEnabled = ('rowAdd' in params) ? params.rowAdd : false;
        if (addRowEnabled && typeof(rowEdit) != 'function') {
            console.error('No callback was set for adding new rows.');
        }
        /**
         * @var {boolean}
         * @private
         */
        var watchChanges = ('watchChanges' in params) ? params.watchChanges : false;
        /**
         * Function that handles moving to subordinate table.
         * @callback tfw.dynamicTableClass~goToSub
         * @param {number} rowID - ID of the row being edited
         * @param {number} column - order number of column in which the callback was triggered
         */
        /**
         * @private
         */
        var goToSub = ('goToSub' in params) ? params.goToSub : null;
        /**
         * @private
         */
        var columnRenderers = ('columnRenderers' in params) ? params.columnRenderers : [];
        /**
         * @private
         * @var {number}
         */
        var orderDataCol = null;
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
        function loadPreferences(callback) {
            serverCall({
                action: tfw.dynamicTableClass.serverActions.PREF_GET,
                callback: function (receivedData) {
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
        function savePreferences() {
            //FIX: convert array to object
            var savedPreferences = {};
            for (var prop in preferences) {
                savedPreferences[prop] = preferences[prop];
            }
            serverCall({
                action: tfw.dynamicTableClass.serverActions.PREF_SET,
                parameters: 'data=' + JSON.stringify(savedPreferences)
            });
        }
        /**
         * Save user's preference.
         * @param {string} key - preference key (name)
         * @param [value] - preference value (any type) - if not set, preference is deleted
         */
        this.setPreference = function (key, value) {
            if (preferences == null) {
                console.error('Preferences were not loaded yet.');
                return;
            }
            if (typeof(value) != 'undefined') {
                preferences[key] = value;
            } else {
                delete preferences[key];
            }
            savePreferences();
        }
        /**
         * Read user's preference.
         * @param {string} key - preference key (name)
         * @return {Object} preference value (any type)
         */
        this.getPreference = function (key) {
            if (preferences == null) {
                console.error('Preferences were not loaded yet.');
                return;
            }
            if (key in preferences) {
                return preferences[key];
            } else {
                return null;
            }
        }
        /**
         * Get table container (for inserting into document).
         * @returns {HTMLElement} Table container
         */
        this.getTable = function () {
            return this.tableContainer;
        };
        /** @private */
        var ajaxPendingCalls = 0;
        /** @private */
        function ifEverythingReadyCallPaint() {
            if (--ajaxPendingCalls <= 0) {
                this.paint();
            }
        }
        /**
         * Reload (or load) data from server.
         * Loads preferences and data, then {@link tfw.dynamicTableClass#paint|paint}s the table.
         * @see tfw.dynamicTableClass#paint
         * @see tfw.dynamicTableClass~serverCall
         */
        this.reload = function () {
            var dynamicTable = this;
            if (ajaxPendingCalls > 0) {
                console.error('Dynamic table reload called before last reload finished.');
                return;
            }
            ajaxPendingCalls = 2;
            serverCall({
                action: tfw.dynamicTableClass.serverActions.LOAD,
                callback: function (receivedData) {
                    dynamicTable.data = receivedData;
                    ifEverythingReadyCallPaint.call(dynamicTable);
                }
            });
            loadPreferences(ifEverythingReadyCallPaint.bind(this));
        };
        /**
         * Watch for updates from the server.
         * @see tfw.dynamicTableClass#paint
         */
        this.serverWatch = function () {
            var dynamicTable = this;
            serverCall({
                action: tfw.dynamicTableClass.serverActions.WATCH,
                callback: function (changes) {
                    if (changes.length > 0) {
                        dynamicTable.paint(changes);
                    }
                    dynamicTable.serverWatch();
                }
            });
        }
        /**
         * @private
         * @var {XMLHttpRequest[]}
         */
        var pendingHttpRequests = [];
        /**
         * Function that handles data received from server.
         * @callback tfw.dynamicTableClass~serverCallback
         * @param {Object} receivedData - JSON decoded data received from request
         */
        /**
         * Send a table-specific request to server.
         * If table is {@link tfw.dynamicTableClass#destroy|destroy}ed, pending requests are aborted.
         * @param {Object} params - query parameters
         * @param {tfw.dynamicTableClass.serverActions} params.action - server action
         * @param {tfw.dynamicTableClass~serverCallback} [params.callback] - callback that receives data
         * @param {string} [params.parameters=null] - parameters to be send with the request (e.g. POST)
         * @see tfw.ajaxGet
         * @see tfw.decodeJSON
         */
        function serverCall(params) {
            pendingHttpRequests.push(tfw.ajaxGet({
                url: baseURL + '?t=' + tableId + '&a=' + params.action.name + (urlParams ? ('&' + urlParams) : ''),
                method: ('method' in params.action) ? params.action.method : 'GET',
                parameters: params.parameters,
                onload: function (hr) {
                    pendingHttpRequests.splice(pendingHttpRequests.indexOf(hr), 1);
                    var receivedData = tfw.decodeJSON(hr.responseText);
                    if (params.callback != null) {
                        params.callback(receivedData);
                    }
                }
            }));
        }
        /**
         * A "destructor" for table.
         * Aborts all pending requests created by current table.
         * Removes associated CSS.
         * @see tfw.dynamicTableClass~serverCall
         */
        this.destroy = function () {
            for (var i = 0; i < pendingHttpRequests.length; i++) {
                pendingHttpRequests[i].abort();
            }
            document.getElementById('tfwInsertStyle-tfwDynamicTableStyling-' + this.tableHTMLId).remove();
        }
        /**
         * Test if no filters are applied and table is sorted by column of type 'order'.
         * @return {boolean} True if reordering can be done, false otherwise.
         */
        this.reorderEnabled = function () {
            var sorting = this.getPreference('sorting');
            var sortedByOrder = sorting != null && ('dataCol' in sorting) && sorting.dataCol == orderDataCol && sorting.asc == tfw.dynamicTableClass
                .sortTypes.ASC;
            return sortedByOrder && this.getVisibleRowsCount() == this.getTotalRowsCount();
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
        this.toggleReorder = function () {
            var dynamicTable = this;
            var rowReorderEnabled = this.reorderEnabled();
            var tbody = this.tableContainer.querySelector('tbody');
            if (rowReorderEnabled) {
                window.getSelection().removeAllRanges();
            }
            var rows = tbody.getElementsByTagName('tr');
            for (var i = 0; i < rows.length; i++) {
                rows[i][rowReorderEnabled ? 'addClass' : 'removeClass']('draggable');
                rows[i].draggable = rowReorderEnabled;
                rows[i].ondragstart = rowReorderEnabled ? function(event) {
                    this.addClass('dragged');
                    event.dataTransfer.setData('text', event.target.nodeOrder());
                } : null;
                rows[i].ondragover = rowReorderEnabled ? function(event) {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'move';
                    var dragged = dynamicTable.tableContainer.querySelector('tbody tr.dragged');
                    if (!dragged.isSameNode(this)) {
                        dynamicTable.orderChange.call(dynamicTable, (dragged.nodeOrder() < this.nodeOrder()) ? this.nextSibling : this);
                    }
                    return false;
                } : null;
                rows[i].ondrop = rowReorderEnabled ? function(event) {
                    event.preventDefault();
                } : null;
                rows[i].ondragend = rowReorderEnabled ? function() {
                    this.removeClass('dragged');                    
                    serverUpdateOrder({
                        id: this.dataset.rowid,
                        neworder: this.nodeOrder() + 1
                    });
                } : null;
            }
        }
        /**
         * Reflect a change in order in the table.
         * @param {?HTMLElement} referenceRow - before which row should be the moved row placed (if null, insert at the end)
         */
        this.orderChange = function (referenceRow) {
            var draggedRow = this.tableContainer.querySelector('tbody tr.dragged');
            if (draggedRow.isSameNode(referenceRow)) {
                return;
            }
            var tbody = this.tableContainer.querySelector('tbody');
            var orderColumn = this.data.cols[orderDataCol].columnOrder;
            var originalRowOrder = draggedRow.nodeOrder();
            var droppedRowOrder = (referenceRow != null) ? (referenceRow.nodeOrder() - ((referenceRow.nodeOrder() < originalRowOrder) ? 0 : 1)) : (
                tbody.rows.length - 1);
            tbody.insertBefore(draggedRow, referenceRow);
            draggedRow.cells[orderColumn].innerHTML = droppedRowOrder + 1;
            if (originalRowOrder < droppedRowOrder) { //drag down
                tbody.rows[originalRowOrder].cells[orderColumn].innerHTML--;
            } else { //drag up
                tbody.rows[originalRowOrder].cells[orderColumn].innerHTML = parseInt(tbody.rows[originalRowOrder].cells[orderColumn].innerHTML) + 1;
            }
        }
        /**
         * @param {Object} params - update parameters
         * @param {number} params.id - ID of edited row
         * @param {number} params.col - order number of edited column
         * @param {number} params.value - new value
         */
        function serverUpdateCell(params) {
            serverCall({
                action: tfw.dynamicTableClass.serverActions.SAVE,
                parameters: 'id=' + params.id + '&col=' + params.col + '&value=' + encodeURIComponent(params.value)
            });
        }
        /**
         * @param {Object} params - update parameters
         * @param {number} params.id - ID of edited row
         * @param {number} params.neworder - new order number of edited row
         */
        function serverUpdateOrder(params) {
            serverCall({
                action: tfw.dynamicTableClass.serverActions.CHANGE_ORDER,
                parameters: 'id=' + params.id + '&neworder=' + params.neworder
            });
        }
        /**
         * Updates data and sends change to server.
         * @param {HTMLElement} input - input field in a cell of dynamic table
         * @param {string} input.value - value that can be obtained
         * @see tfw.dynamicTableClass~serverUpdateCell
         */
        this.updateInput = function (input) {
            var rowID = input.closest('tr').dataset.rowid;
            var dataCol = input.closest('td').dataset.dataCol;
            var value = input.value;
            var rowOrder = this.getDataRowById(rowID);
            if (rowOrder == null) {
                console.error('Input was updated in a row with ID not present in data.');
            }
            this.data.rows[rowOrder].cols[dataCol] = value;
            serverUpdateCell({
                id: rowID,
                col: dataCol,
                value: value
            });
        }
        /**
         * Set active arrow (and make other arrows of same group inactive).
         * @param {HTMLElement} element - arrow to make active
         * @param {HTMLElement} base - where to search for arrows
         */
        function setActiveArrow(element, base, on) {
            if (typeof(base) != 'undefined' && base != null) {
                var arrowType = null,
                    arrowGroup = null,
                    arrowGroups = [
                        [tfw.dynamicTableClass.arrowTypes.FILTER],
                        [tfw.dynamicTableClass.arrowTypes.UP, tfw.dynamicTableClass.arrowTypes.DOWN]
                    ],
                    i;
                for (var j in arrowGroups) {
                    var arrowTypes = arrowGroups[j];
                    for (i in arrowTypes) {
                        if (element.hasClass(arrowTypes[i])) {
                            arrowGroup = arrowTypes;
                            arrowType = arrowTypes[i];
                        }
                    }
                }
                if (arrowType == null) {
                    console.error('setActiveArrow called on invalid element.');
                } else {
                    var otherArrows = base.getElementsByClassName('tfwArrow');
                    for (i = 0; i < otherArrows.length; i++) {
                        if (otherArrows[i].hasAnyClass(arrowGroup.join(' '))) {
                            otherArrows[i].removeClass('active');
                        }
                    }
                }
            }
            if (element != null && (typeof(on) == 'undefined' || on)) {
                element.addClass('active');
            }
        }
        /**
         * @private
         * @param {Object} cell - the cell from which to move (TD)
         * @param {number} column - order number of column in which the cell is in
         * @param {number} shift - how many rows to move by (positive = down, negative = up)
         */
        function moveFocusToCell(cell, column, shift) {
            var row = cell.parentNode;
            while (shift < 0) {
                row = row.previousSibling;
                if (row == null) {
                    return;
                }
                shift++;
            }
            while (shift > 0) {
                row = row.nextSibling;
                if (row == null) {
                    return;
                }
                shift--;
            }
            row.children[column].querySelector('input').focus();
        }
        /**
         * @private
         */
        function setTableWidth(){
            var width = this.data.cols.reduce(function(previous, current) {
                return parseInt(current.width) + previous
            }, 0);
            if (rowEdit) {
                width += tfw.dynamicTableClass.ROW_EDIT_WIDTH;
            }
            width += 10; //scrollbar
            
            this.tableContainer.querySelector('table').style.width = width + 'px';
        }
        /**
         * @private
         * @listens click
         * @listens keyup
         */
        function createAndFillTable() {
            //add CSS styling for filters
            var tableCSS = '';
            for (var dataCol = 0; dataCol < this.data.cols.length; dataCol++) {
                tableCSS += '#' + this.tableHTMLId + ' .filter' + dataCol + 'Invalid{display:none}\n';
            }
            tfw.insertStyle(tableCSS, 'tfwDynamicTableStyling-' + this.tableHTMLId);
            var o, thead, tbody, r, c, columnOrder, dynamicTable = this, b, j;
            this.tableContainer.innerHTML = '';
            this.tableContainer.add(o = tfw.table({
                id: this.tableHTMLId,
                className: 'tfwDynamicTable'
            }));
            setTableWidth.call(this);
            for (j = 0; j < this.data.cols.length; j++) {
                if (!this.data.cols[j].hidden && this.data.cols[j].type == 'order') {
                    this.data.cols[j].sort = true;
                    orderDataCol = j;
                    o.addEventListener('click', dynamicTable.toggleReorder.bind(dynamicTable));
                }
            }
            o.add(thead = document.createElement('thead'));
            thead.add(r = tfw.tr({
                className: 'headlines'
            }));
            
            /** @todo Make movement detection more precise, so that mouse and resized element are synced */
            /** @todo Save into preferences */
            var RESIZING_MIN_WIDTH = 40;
            var resizerMouseDown = function(event){
                var t = window._resizedElement = event.target.closest('th');
                t.dispatchEvent(new CustomEvent('resizestart'));
                document.body.addClass('resizing');
                t._resizePositionX = event.clientX;
                event.stopPropagation();
                event.preventDefault();
            };
            var resizerMouseMove = function(event){
                if(typeof(window._resizedElement) != 'undefined'){
                    var t = window._resizedElement;
                    var diff = event.clientX - t._resizePositionX;
                    if(diff != 0){
                        t.dispatchEvent(new CustomEvent('resizing', {detail: {move: diff}}));
                        
                        /** @todo apply min/max width */
                        var width = parseInt(t.style.width) + diff;
                        if(width < RESIZING_MIN_WIDTH){
                            width = RESIZING_MIN_WIDTH;
                        }
                        t.style.width = width + 'px';
                        
                        t._resizePositionX = event.clientX;
                    }
                }
                event.stopPropagation();
                event.preventDefault();
            };
            var resizerMouseEnd = function(event){
                if(typeof(window._resizedElement) != 'undefined'){
                    var t = window._resizedElement;
                    t.dispatchEvent(new CustomEvent('resizestop'));
                    document.body.removeClass('resizing');
                    delete window._resizedElement;
                    event.stopPropagation();
                    event.preventDefault();
                }
            };
            document.body.addEventListener('mousemove', resizerMouseMove);
            document.body.addEventListener('mouseup', resizerMouseEnd);
            document.addEventListener('mouseout', function(event){
                if(!event.relatedTarget || event.relatedTarget.nodeName == 'HTML'){
                    resizerMouseEnd(event);
                }
            });
            
            /**
             * @private
             * @param {number} dataCol
             */
            var onResizeCallback = function(dataCol, newWidth){
                var columnOrder = this.data.cols[dataCol].columnOrder;
                var oldWidth = this.data.cols[dataCol].width;
                if(newWidth != oldWidth){
                    var cells = this.tableContainer.querySelectorAll('tbody tr > :nth-child('+(parseInt(columnOrder)+1)+')');
                    for(var i=0;i<cells.length;i++){
                        cells[i].style.width = newWidth+'px';
                    }
                    this.data.cols[dataCol].width = newWidth;
                    setTableWidth.call(this);
                }
            };
            var resizingCallback = function(){
                onResizeCallback.call(dynamicTable, this.dataset.dataCol, parseInt(this.style.width));
            };
            
            columnOrder = 0;
            if (rowEdit) {
                var th = document.createElement('th');
                th.innerHTML = '&nbsp;';
                th.className = 'rowEditCell';
                r.add(th);
                columnOrder++;
            }
            var resizer;
            for (j = 0; j < this.data.cols.length; j++) {
                if (!('h' in this.data.cols[j])) {
                    c = document.createElement('th');
                    c.add(d=tfw.span({className:'colHeadingControl'}));
                    var deltaWidth=0;
                    if ('filter' in this.data.cols[j] && this.data.cols[j].filter && this.data.cols[j].type) {
                        d.add(b = tfw.div({
                            className: 'tfwArrow ' + tfw.dynamicTableClass.arrowTypes.FILTER
                        }));
                        b.dataset.dataCol = j;
                        b.onclick = function () {
                            dynamicTable.filter.call(dynamicTable, this, this.dataset.dataCol);
                        }
                        deltaWidth+=16;
                    }
                    if ('sort' in this.data.cols[j] && this.data.cols[j].sort) {
                        var b1, b2;
                        d.add(b2 = tfw.div({
                            className: 'tfwArrow ' + tfw.dynamicTableClass.arrowTypes.UP,
                            style: 'position:relative;left:2px;'                            
                        }));
                        b2.dataset.sortOrder = tfw.dynamicTableClass.sortTypes.ASC;
                        d.add(b1 = tfw.div({
                            className: 'tfwArrow ' + tfw.dynamicTableClass.arrowTypes.DOWN
                        }));
                        b1.dataset.sortOrder = tfw.dynamicTableClass.sortTypes.DESC;
                        b1.dataset.dataCol = b2.dataset.dataCol = j;
                        b1.onclick = b2.onclick = function () {
                            dynamicTable.sort.call(dynamicTable, this.dataset.dataCol, this.dataset.sortOrder);
                        };
                        deltaWidth+=24;
                    }
                    if(true) { /** @todo Supply condition */
                        c.className = 'resizable';
                        d.add(resizer = tfw.span({className: 'resizer'}));
                        resizer.addEventListener('mousedown', resizerMouseDown);
                        c.addEventListener('resizing', resizingCallback);
                        deltaWidth+=8;
                    }

                    c.add(tfw.span({className:'colHeading', innerHTML: this.data.cols[j].name, style:"width: calc(100% - "+deltaWidth+"px);"}));
                    
                    if (!('width' in this.data.cols[j])) {
                        this.data.cols[j].width = 200;
                    } else {
                        this.data.cols[j].width = parseInt(this.data.cols[j].width);
                    }
                    c.style.width = this.data.cols[j].width + 'px';
                    c.dataset.dataCol = j;
                    r.add(c);
                    this.data.cols[j].columnOrder = columnOrder;
                    columnOrder++;
                }
            }
            o.add(tbody = document.createElement('tbody'));
            if (bodyHeight != null) {
                tbody.style.maxHeight = bodyHeight;
            }
            for (var i = 0; i < this.data.rows.length; i++) {
                tbody.add(r = tfw.tr({
                    id: 'rowID-' + this.data.rows[i].id
                }));
                r.setAttribute('data-rowid', this.data.rows[i].id);
                columnOrder = 0;
                if (rowEdit) {
                    r.add(tfw.td({
                        className: 'rowEditCell',
                        children: [b = tfw.span({
                            className: 'rowEditIcon clickable fa invert fa-info'
                        })]
                    }));
                    b.onclick = rowEdit.bind(null, dynamicTable.data.rows[i].id);
                    columnOrder++;
                }
                var updateInputCallback = function () {
                    dynamicTable.updateInput.call(dynamicTable, this);
                };
                var val, shift, calendarInput, type;
                for (j = 0; j < this.data.cols.length; j++) {
                    if (!('h' in this.data.cols[j])) {
                        var params = {};
                        params.children = [];
                        if ('subtable' in this.data.cols[j] && this.data.cols[j].subtable) {
                            params.className = 'withSubtable';
                            params.children.push(b = tfw.div({
                                className: 'subtable clickable fa invert fa-caret-down'
                            }));
                            b.onclick = goToSub.bind(null, dynamicTable.data.rows[i].id, j);
                        }
                        val = this.data.rows[i].cols[j];
                        if(typeof(columnRenderers[j]) == 'function') {
                            params.children.push.apply(params.children, columnRenderers[j](val));
                        } else {
                            type = ('type' in this.data.cols[j]) ? this.data.cols[j].type : null;
                            var id = 'tfwDynamicTable-' + i + '-' + columnOrder;
                            var setKeys = null;
                            switch (type) {
                                case tfw.dynamicTableClass.colTypes.CHECKBOX:
                                    params.children.push(tfw.checkbox({
                                        id: id,
                                        value: (val ? 1 : 0),
                                        onchange: updateInputCallback
                                    }));
                                    break;
                                case tfw.dynamicTableClass.colTypes.NUMBER:
                                    params.children.push(setKeys = tfw.input({
                                        type: 'number',
                                        id: id,
                                        value: val,
                                        onchange: updateInputCallback
                                    }));
                                    break;
                                case tfw.dynamicTableClass.colTypes.DATE:
                                    this.prepareCalendar();
                                    params.children.push(tfw.calendar(calendarInput=tfw.input({
                                        type: 'text',
                                        id: id,
                                        value: val.match(/\d{4,}-\d{2}-\d{2}/)[0]
                                    })));
                                    calendarInput.addEventListener('change', updateInputCallback);
                                    break;
                                case tfw.dynamicTableClass.colTypes.TEXT:
                                    params.children.push(setKeys = tfw.input({
                                        type: 'text',
                                        id: id,
                                        value: val,
                                        onchange: updateInputCallback
                                    }));
                                    break;
                                default:
                                    params.innerHTML = val;
                            }
                            if (setKeys != null) {
                                setKeys.dataset.columnOrder = columnOrder;
                                setKeys.addEventListener('keyup', function(event) {
                                    switch (event.keyCode) {
                                        case 38: //up
                                            shift = -1;
                                            break;
                                        case 40: //down
                                            shift = 1;
                                            break;
                                        default:
                                            return;
                                    }
                                    moveFocusToCell(this.closest('td'), this.dataset.columnOrder, shift);
                                });
                            }
                        }
                        r.add(c = tfw.td(params));
                        c.dataset.dataCol = j;
                        c.style.width = this.data.cols[j].width + 'px';
                        columnOrder++;
                    }
                }
            }
            var tfoot;
            o.add(tfoot = document.createElement('tfoot'));
            tfoot.add(tfw.tr({
                children: [
                    tfw.td(addRowEnabled ? {
                        children: [
                            tfw.button({
                                onclick: rowEdit.bind(null, 0),
                                innerHTML: '<span class="fa fa-plus"></span>'
                            })
                        ]
                    } : {}), tfw.td({
                        children: [
                            tfw.div({
                                id: this.tableHTMLId + '-hiddenRowsInfo',
                                children: [
                                    tfw.span({
                                        id: this.tableHTMLId + '-hiddenRowsCount'
                                    }), tfw.button({
                                        className: 'resetTableFilter',
                                        onclick: function () {
                                            dynamicTable.resetFilters.call(dynamicTable);
                                        },
                                        innerHTML: '<span class="tfwArrow filter reset"></span>'
                                    })
                                ]
                            })
                        ]
                    }), tfw.td({
                        children: [
                            tfw.button({
                                onclick: function () {
                                    dynamicTable.toggleColumnDialog.call(dynamicTable, this)
                                },
                                innerHTML: '<span class="fa fa-cog"></span>'
                            })
                        ]
                    })
                ]
            }));
            updateRowCounts.call(dynamicTable);
        }
        /**
         * @private
         * @var {Object}
         */
        var defaultFilterValues = null;
        /** @private */
        function updateRowCounts() {
            var vis = this.getVisibleRowsCount();
            var tot = this.getTotalRowsCount();
            $(this.tableHTMLId + '-hiddenRowsInfo').style.display = (vis == tot) ? 'none' : 'inline-block';
            $(this.tableHTMLId + '-hiddenRowsCount').innerHTML = tfw.strings.HIDDEN_ROWS + ': ' + (tot - vis);
        }
        /** @private */
        this.getVisibleRowsCount = function () {
            return [].slice.call(this.tableContainer.querySelectorAll('tbody tr')).reduce(function(previous, current) {
                return previous + ((current.className.match(/(^| )filter[0-9]+Invalid( |$)/)) ? 0 : 1);
            }, 0);
        }
        /** @private */
        this.getTotalRowsCount = function () {
            return this.tableContainer.querySelectorAll('tbody tr').length;
        }
        /** @private */
        this.getDataRowById = function (rowID) {
            var rowOrder = null;
            for (var j = 0; j < this.data.rows.length; j++) {
                if (this.data.rows[j].id == rowID) {
                    rowOrder = j;
                    break;
                }
            }
            return rowOrder;
        }
        /**
         * Object representing an update/insertion/deletion in data.
         * Type of change is determined by present properties.
         * @typedef {Object} tfw.dynamicTableClass~dataChange
         * @param {number} id - ID of row - if neither col nor cols are present, implies deletion
         * @param {number} [col] - column number of updated cell (in data) - implies update
         * @param {string} [value] - new value of updated cell - for change only
         * @param {string[]} [cols] - values of inserted row - implies insertion
         */
        /**
         * Refresh the content of the table using data gotten by (re)loading.
         * Assumes that there is only 1 order column and that data is initially sorted by that column.
         * @param {tfw.dynamicTableClass~dataChange[]} [changes] - changes made to data (loaded by {@link tfw.dynamicTableClass#serverWatch|watch})
         * @todo Add temporary class hasBeenChanged to edited cells.
         * @todo Change checkbox value so that it's not sent back to server
         * @todo Handle update of cell that is currently being edited
         */
        this.paint = function (changes) {
            var i, dataCol;
            this.tableHTMLId = 'dynamicTable-' + tableId;
            if (document.getElementById(this.tableHTMLId) == null) {
                createAndFillTable.call(this);
                if (watchChanges) {
                    this.serverWatch();
                }
                if ('onload' in params) {
                    params.onload();
                }
            } else if (typeof(changes) != 'undefined') {
                console.log(changes);
                for (i = 0; i < changes.length; i++) {
                    if ('col' in changes[i]) { //update
                        var rowID = changes[i].id;
                        dataCol = changes[i].col;
                        var column = this.data.cols[dataCol].columnOrder;
                        var newValue = changes[i].value;
                        var rowOrder = this.getDataRowById(rowID);
                        if (rowOrder == null) {
                            console.error('Row that is not present in the table was updated.');
                        } else {
                            if (newValue != this.data.rows[rowOrder].cols[dataCol]) {
                                this.data.rows[rowOrder].cols[dataCol] = newValue;
                                var cell = this.tableContainer.querySelector('tbody').rows[rowOrder].cells[column];
                                switch (this.data.cols[dataCol].type) {
                                    case tfw.dynamicTableClass.colTypes.CHECKBOX:
                                        cell.querySelector('.tfwCheckbox').value = parseInt(newValue);
                                        break;
                                    case tfw.dynamicTableClass.colTypes.NUMBER:
                                    case tfw.dynamicTableClass.colTypes.DATE:
                                    case tfw.dynamicTableClass.colTypes.TEXT:
                                        cell.querySelector('input').value = newValue;
                                        break;
                                    default:
                                        cell.innerHTML = newValue;
                                }
                            }
                        }
                    } else if ('cols' in changes[i]) { //insertion
                    } else { //deletion
                    }
                }
            } else {
                console.error('Dynamic table reloading not implemented yet.');
            }
            //calculate filter default values
            defaultFilterValues = {};
            var columnValues, minV, maxV;
            for (i = 0; i < this.data.cols.length; i++) {
                if (this.data.cols[i].filter) {
                    var defaultValue;
                    switch (this.data.cols[i].type) {
                        case tfw.dynamicTableClass.colTypes.CHECKBOX:
                            defaultValue = '0';
                            break;
                        case tfw.dynamicTableClass.colTypes.TEXT:
                            defaultValue = '';
                            break;
                        case tfw.dynamicTableClass.colTypes.DATE:
                            columnValues = this.data.rows.map(function(row){return row.cols[i];}).sort();
                            minV = columnValues[0],
                            maxV = columnValues.pop();
                            defaultValue = {
                                min: minV,
                                max: maxV
                            };
                            break;
                        case tfw.dynamicTableClass.colTypes.NUMBER:
                            columnValues = this.data.rows.map(function(row){return row.cols[i];});
                            minV = Math.min.apply(null, columnValues),
                            maxV = Math.max.apply(null, columnValues);
                            defaultValue = {
                                min: minV,
                                max: maxV
                            };
                            break;
                        default:
                            console.error('Cannot calculate default value for filter on field of unsupported type "' + this.data.cols[i].type + '"');
                    }
                    defaultFilterValues[i] = defaultValue;
                }
            }
            //apply filters
            var filterValues = this.getPreference('filterValues');
            if (filterValues != null) {
                for (dataCol in filterValues) {
                    if (filterValues[dataCol] != null) {
                        this.filterAny(dataCol, filterValues[dataCol], this.data.cols[dataCol].type, true);
                    }
                }
            }
            //apply sorting
            var sorting = this.getPreference('sorting');
            if (sorting != null) {
                this.sort(sorting.dataCol, sorting.asc, true);
            }
            //hide columns
            var hiddenColumns = this.getPreference('hiddenColumns');
            if (hiddenColumns != null) {
                for (dataCol in hiddenColumns) {
                    if (hiddenColumns[dataCol] === true) {
                        this.toggleColumn(dataCol, true);
                    }
                }
            }
            this.toggleReorder();
        };
        /**
         * Prepare calendar class for use. Sets the {@link tfw.calendar.placeCalendar} callback, if null.
         * @todo Use as (default) placeCalendar for all calendars
         */
        this.prepareCalendar = function () {
            if (tfw.calendar.placeCalendar == null) {
                tfw.calendar.placeCalendar = function (cal, input) {
                    var wrapper = tfw.createLayerAndWrapperAtElement(input, {
                        autoclose: true,
                        modal: 'auto'
                    });
                    wrapper.add(cal);
                };
            }
        }
        /**
         * Value by which the table can be filtered.
         * @typedef {(string|{min:(string|number),max:(string|number)})} tfw.dynamicTableClass~filterValue
         */
        /**
         * @private
         * @param {tfw.dynamicTableClass~filterValue} value - filter value
         * @param {number} dataCol - order of filtered column (in data)
         * @param {boolean} [save=true] - whether to save immidiatelly
         */
        this.setFilterPreferenceIfNotDefault = function (value, dataCol, save) {
            var filterValues = this.getPreference('filterValues');
            if (filterValues == null) {
                filterValues = {};
            }
            if (this.isFilterValueDefault(value, dataCol)) {
                delete filterValues[dataCol];
            } else {
                filterValues[dataCol] = value;
            }
            if (typeof(save) == 'undefined' || save) {
                this.setPreference('filterValues', filterValues);
            }
        }
        /**
         * @private
         * @param {number} dataCol - order of filtered column (in data)
         * @return {tfw.dynamicTableClass~filterValue} filter value
         */
        this.getFilterPreference = function (dataCol) {
            var filterValues = this.getPreference('filterValues');
            if (filterValues != null && dataCol in filterValues) {
                return filterValues[dataCol];
            } else {
                return null;
            }
        }
        /**
         * @private
         * @param {tfw.dynamicTableClass~filterValue} value - filter value
         * @param {number} dataCol - order of filtered column (in data)
         */
        this.isFilterValueDefault = function (value, dataCol) {
            if (typeof(value) == 'object' && ('min' in value || 'max' in value)) {
                return (!('min' in value) || value.min === defaultFilterValues[dataCol].min) && (!('max' in value) || value.max ===
                    defaultFilterValues[dataCol].max);
            }
            return value === defaultFilterValues[dataCol];
        }
        /**
         * Apply filter for values of a column.
         * Creates a {@link tfw.dialog|dialog} with filter (and moves focus to input field).
         * @param {HTMLElement} filterElement - element to position new layer to
         * @param {number} dataCol - order of searched column (in data)
         * @todo Change rangeMin/rangeMax/dateMin/dateMax classes + {@link tfw.dynamicTableClass#filterAny}
         */
        this.filter = function (filterElement, dataCol) {
            var dynamicTable = this;
            if (this.data.cols[dataCol].hidden) {
                console.error('Tried to apply filter on a hidden column.');
                return;
            } else if (!('filter' in this.data.cols[dataCol]) || !this.data.cols[dataCol].filter) {
                console.error('Tried to apply filter on a column with no filter.');
                return;
            }
            var c = document.createElement('div');
            var type = this.data.cols[dataCol].type,
                value = this.getFilterPreference(dataCol),
                minV,
                maxV,
                f1,
                f2,
                inputToFocus = null;
            switch (type) {
                case tfw.dynamicTableClass.colTypes.CHECKBOX:
                    var filter = tfw.select({
                        list: [tfw.strings.ALL, tfw.strings.YES, tfw.strings.NO].join(';'),
                        value: value,
                        onchange: function () {
                            dynamicTable.filterAny(this.dataset.dataCol, this.value);
                        }
                    });
                    filter.dataset.dataCol = dataCol;
                    filter.addEventListener('click', function(event) {
                        event.stopPropagation();
                    });
                    c.add(filter);
                    break;
                case tfw.dynamicTableClass.colTypes.NUMBER:
                    minV = defaultFilterValues[dataCol].min;
                    maxV = defaultFilterValues[dataCol].max;
                    f1 = tfw.input({
                        type: 'number',
                        className: 'rangeMin',
                        onchange: function () {
                            var max = this.closest('th').querySelector('.rangeMax');
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
                        type: 'number',
                        className: 'rangeMax',
                        onchange: function () {
                            var min = this.closest('th').querySelector('.rangeMin');
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
                    inputToFocus = f1.querySelector('.rangeMin');
                    f1.querySelector('.rangeMin').dataset.dataCol = f2.querySelector('.rangeMax').dataset.dataCol = dataCol;
                    c.add(f1);
                    c.add(f2);
                    f1.addEventListener('click', function(event) {
                        event.stopPropagation();
                    });
                    f2.addEventListener('click', function(event) {
                        event.stopPropagation();
                    });
                    break;
                case tfw.dynamicTableClass.colTypes.DATE:
                    minV = defaultFilterValues[dataCol].min;
                    maxV = defaultFilterValues[dataCol].max;
                    
                    f1 = tfw.input({
                        type: 'text',
                        className: 'dateMin',
                        value: (value) ? value.min : minV.match(/\d{4,}-\d{2}-\d{2}/)[0],
                        legend: tfw.strings.FROM
                    });
                    tfw.calendar(inputToFocus = f1.querySelector('input'));
                    f1.querySelector('input').addEventListener('change', function () {
                        dynamicTable.filterAny(this.dataset.dataCol, {
                            min: this.value,
                            max: this.closest('div').querySelector('.dateMax').value
                        });
                    });
                    
                    f2 = tfw.input({
                        type: 'text',
                        className: 'dateMax',
                        value: (value) ? value.max : maxV.match(/\d{4,}-\d{2}-\d{2}/)[0],
                        legend: tfw.strings.TO
                    });
                    tfw.calendar(f2.querySelector('input'));
                    f2.querySelector('input').addEventListener('change', function () {
                        dynamicTable.filterAny(this.dataset.dataCol, {
                            min: this.closest('div').querySelector('.dateMin').value,
                            max: this.value
                        });
                    });
                    
                    f1.querySelector('input').size = f2.querySelector('input').size = 10;
                    f1.querySelector('.dateMin').dataset.dataCol = f2.querySelector('.dateMax').dataset.dataCol = dataCol;
                    f1.addEventListener('click', function(event) {
                        event.stopPropagation();
                    });
                    f2.addEventListener('click', function(event) {
                        event.stopPropagation();
                    });
                    c.add(f1);
                    c.add(f2);
                    break;
                case tfw.dynamicTableClass.colTypes.TEXT:
                    var searchInput = inputToFocus = tfw.input({
                        type: 'text',
                        placeholder: tfw.strings.FILTER,
                        value: value,
                        onchange: function () {
                            dynamicTable.filterAny(this.dataset.dataCol, this.value.trim(), this.dataset.searchType);
                        }
                    });
                    searchInput.dataset.searchType = this.data.cols[dataCol].search;
                    searchInput.dataset.dataCol = dataCol;
                    searchInput.onkeyup = function () {
                        dynamicTable.filterAny(this.dataset.dataCol, this.value.trim(), this.dataset.searchType, true);
                    }
                    c.add(searchInput);
                    searchInput.addEventListener('click', function(event) {
                        event.stopPropagation();
                    });
                    break;
                default:
                    console.error('Tried to apply filter on type that is not supported: "' + type + '"');
                    return;
            }
            var wrapper = tfw.createLayerAndWrapperAtElement(filterElement.closest('th'), {
                autoclose: true,
                modal: 'auto'
            }, true);
            wrapper.add(c);
            if(inputToFocus !== null){
                inputToFocus.focus();
            }
        }
        /**
         * Apply sorting by values (text without HTML) of a column.
         * Text fields are sorted locale aware, with empty strings always last.
         * @param {number} dataCol - order of column (in data)
         * @param {tfw.dynamicTableClass.sortTypes} asc - sorting type (ascending or descending)
         */
        this.sort = function (dataCol, asc, dontSave) {
            if (typeof(dontSave) == 'undefined' || !dontSave) {
                this.setPreference('sorting', {
                    dataCol: dataCol,
                    asc: asc
                });
            }
            var column = this.data.cols[dataCol].columnOrder;
            this.setActiveFilterInColumn(column, true, tfw.dynamicTableClass.arrowTypes[asc == 1 ? 'UP' : 'DOWN'], this.tableContainer);
            var tbody = this.tableContainer.querySelector('tbody'),
                type = this.data.cols[dataCol].type,
                i;
            if ([tfw.dynamicTableClass.colTypes.NUMBER, tfw.dynamicTableClass.colTypes.ORDER, tfw.dynamicTableClass.colTypes.CHECKBOX].indexOf(type) !=
                -1) {
                this.data.rows.sort(function(row1, row2) {
                    var a = row1.cols[dataCol],
                        b = row2.cols[dataCol];
                    return ((a != b) ? cmp(a, b) : cmp(row1.id, row2.id)) * asc;
                });
            } else {
                this.data.rows.sort(function(row1, row2) {
                    var a = row1.cols[dataCol],
                        b = row2.cols[dataCol];
                    return (a === '' && b === '') ? (cmp(row1.id, row2.id) * asc) : ((a === '') ? 1 : ((b === '') ? -1 : ((a.localeCompare(
                        b) || cmp(row1.id, row2.id)) * asc)));
                });
            }
            for (i = 0; i < this.data.rows.length; i++) {
                tbody.appendChild(tbody.rows.namedItem('rowID-' + this.data.rows[i].id));
            }
        };
        /**
         * Set status of filter icon in a column.
         * @param {number} column - column number
         * @param {boolean} on - whether to toggle active on or off
         * @param {tfw.dynamicTableClass.arrowTypes} arrowType - type of arrow
         * @param {?HTMLElement} [arrowBase] - base to pass to {@link tfw.dynamicTableClass~setActiveArrow} (defaults to column's heading)
         * @see tfw.dynamicTableClass~setActiveArrow
         */
        this.setActiveFilterInColumn = function (column, on, arrowType, arrowBase) {
            var base = this.tableContainer.getElementsByClassName('headlines')[0].getElementsByTagName('th')[column];
            var filterIcon = base.getElementsByClassName('tfwArrow ' + arrowType)[0];
            setActiveArrow(filterIcon, (typeof(arrowBase) != 'undefined') ? arrowBase : base, on);
        }
        /**
         * Apply any filter.
         * @param {number} dataCol - order number of filtered column (in data)
         * @param {tfw.dynamicTableClass~filterValue} value - value to filter by
         * @param {number} [searchType=2] - type of search for TEXT (1 = starts with, 2 = includes)
         * @param {boolean} [dontSave=false] - dont save into preferences (for TEXT)
         * @todo Better behaviour when min and max are crossed (min > max)
         */
        this.filterAny = function (dataCol, value, searchType, dontSave) {
            var p;
            var column = this.data.cols[dataCol].columnOrder;
            var type = this.data.cols[dataCol].type;
            //reset invalid/unset values to defaults
            if ([tfw.dynamicTableClass.colTypes.NUMBER, tfw.dynamicTableClass.colTypes.DATE].indexOf(type) != -1) {
                var originalValue = JSON.parse(JSON.stringify(value)); //deep copy
                for (p in value) {
                    switch (type) {
                        case tfw.dynamicTableClass.colTypes.NUMBER:
                            value[p] = parseInt(value[p]);
                            if (!value[p].match(/^[0-9]+$/)) {
                                value[p] = defaultFilterValues[dataCol][p];
                            }
                            break;
                        case tfw.dynamicTableClass.colTypes.DATE:
                            if (!value[p].match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
                                value[p] = defaultFilterValues[dataCol][p];
                            }
                            break;
                    }
                }
                if (value.min < defaultFilterValues[dataCol].min) {
                    value.min = defaultFilterValues[dataCol].min;
                }
                if (value.max > defaultFilterValues[dataCol].max) {
                    value.max = defaultFilterValues[dataCol].max;
                }
                if (value.min > value.max) {
                    //could be better
                    value.min = defaultFilterValues[dataCol].min;
                    value.max = defaultFilterValues[dataCol].max;
                }
                for (p in value) {
                    if (value[p] != originalValue[p]) {
                        var prefix;
                        switch (type) {
                            case tfw.dynamicTableClass.colTypes.NUMBER:
                                prefix = 'range';
                                break;
                            case tfw.dynamicTableClass.colTypes.DATE:
                                prefix = 'date';
                                break;
                        }
                        desktop.div.querySelector('.tfwContainer .' + prefix + 'M' + p.substring(1)).value = value[p];
                    }
                }
            }
            //update current filter values
            this.setFilterPreferenceIfNotDefault(value, dataCol, (typeof(dontSave) == 'undefined' || !dontSave));
            this.setActiveFilterInColumn(column, !this.isFilterValueDefault(value, dataCol), tfw.dynamicTableClass.arrowTypes.FILTER);
            var tbody = this.tableContainer.querySelector('tbody');
            if (typeof(searchType) != 'undefined') {
                var searchFunc = (searchType == 1) ? 'startsWith' : 'includes';
            }
            var rowValue;
            for (var i = 0; i < tbody.rows.length; i++) {
                var matches = true;
                switch (type) {
                    case tfw.dynamicTableClass.colTypes.CHECKBOX:
                        var checked = tbody.rows[i].cells[column].querySelector('.checked') != null;
                        matches = (value === '0') || (value === '1' && checked) || (value === '2' && !checked);
                        break;
                    case tfw.dynamicTableClass.colTypes.TEXT:
                        matches = (value == '') || tbody.rows[i].cells[column].querySelector('input[type="text"]').value.toLowerCase()[searchFunc](
                            value.toLowerCase());
                        break;
                    case tfw.dynamicTableClass.colTypes.NUMBER:
                        rowValue = parseInt(tbody.rows[i].cells[column].querySelector('input').rowValue);
                        matches = (rowValue === '' || (value.min <= rowValue && rowValue <= value.max));
                        break;
                    case tfw.dynamicTableClass.colTypes.DATE:
                        rowValue = tbody.rows[i].cells[column].querySelector('input').value;
                        matches = (rowValue === '' || (value.min <= rowValue && rowValue <= value.max));
                        break;
                }
                tbody.rows[i][matches ? 'removeClass' : 'addClass']('filter' + dataCol + 'Invalid');
            }
            updateRowCounts.call(this);
        }
        /** Reset all applied filters. */
        this.resetFilters = function () {
            var last = null;
            for (var i = 0; i < this.data.cols.length; i++) {
                if ('filter' in this.data.cols) {
                    var value = this.getFilterPreference(i);
                    if (value != null && !this.isFilterValueDefault(value, i)) {
                        this.filterAny(i, defaultFilterValues[i], null, true);
                        last = i;
                    }
                }
            }
            if (last != null) {
                this.filterAny(last, defaultFilterValues[last]); //save
            }
        }
        /**
         * Toggle visibility of a column. Only hides cells in TBODY and THEAD.
         * Requires .hideColumn{display:none}
         * @param {number} dataCol - number of column (in data)
         * @param {boolean} [dontSave=false] - don't save into preferences
         */
        this.toggleColumn = function (dataCol, dontSave) {
            var column = this.data.cols[dataCol].columnOrder;
            var visible;
            [].slice.call(this.tableContainer.querySelectorAll('tbody tr > :nth-child(' + (column + 1) + '), thead tr > :nth-child(' +
                (column + 1) + ')')).forEach(function(cell) {
                    visible = cell.hasClass('hideColumn');
                    cell.toggleClass('hideColumn');
                });
            var table = this.tableContainer.querySelector('.tfwDynamicTable');
            table.style.width = (parseInt(table.style.width) + (visible ? 1 : -1) * this.data.cols[dataCol].width) + 'px';
            if (typeof(dontSave) == 'undefined' || !dontSave) {
                /** @var {boolean[]} */
                var hiddenColumns = this.getPreference('hiddenColumns') || [];
                if (visible) {
                    delete hiddenColumns[dataCol];
                } else {
                    hiddenColumns[dataCol] = true;
                }
                this.setPreference('hiddenColumns', hiddenColumns);
            }
        };
        /**
         * Toggle visibility of a column.
         * Creates a {@link tfw.dialog|dialog} with checkboxes.
         * @param {HTMLElement} element - above which element should checkboxes be positioned
         */
        this.toggleColumnDialog = function (element) {
            var dynamicTable = this,
                hiddenColumns = this.getPreference('hiddenColumns'),
                c = tfw.div({
                    className: 'tfwDynamicTableColumnDialog'
                });
            for (var j = 0; j < this.data.cols.length; j++) {
                if (!this.data.cols[j].hidden) {
                    var checkbox = tfw.checkbox({
                        text: this.data.cols[j].name,
                        value: (hiddenColumns != null && hiddenColumns[j] === true) ? 0 : 1,
                        onchange: function () {
                            dynamicTable.toggleColumn(this.dataset.dataCol);
                        }
                    });
                    checkbox.dataset.dataCol = j;
                    c.add(checkbox);
                }
            }
            var wrapper = tfw.createLayerAndWrapperAtElement(element, {
                autoclose: true,
                modal: 'auto',
                overlay: true
            }, true);
            wrapper.add(c);
        }
    },
    /**
     * Wrapper that creates a dynamic table and returns it's HTML node for inserting into DOM.
     * Class instance's properties are mirrored into the HTML element.
     * @param {Object} params - table parameters (see {@link tfw.dynamicTableClass})
     * @return {HTMLElement} Table
     * @see tfw.dynamicTableClass
     */
    dynamicTable: function (params) {
        var t = new tfw.dynamicTableClass(params);
        var ret = t.tableContainer;
        for (var prop in t) {
            ret[prop] = t[prop];
        }
        ret.reload();
        return ret;
    },
    /**
     * Class for enhancing date input fields. Requires CSS styling.
     * If you want to preserve autocompletion, don't attach any onchange event listeners before using tfw.calendar() on the input field.
     * @class
     * @example
     * tfw.calendar.placeCalendar = function (cal, input){
     *  input.parentNode.insertBefore(cal, input);
     * }
     *
     * var input = tfw.input({value:'2016-03-07'});
     * document.body.appendChild(input);
     *
     * tfw.calendar(input);
     * @example
     * tfw.calendar.placeCalendar = function (cal, input){
     *  input.parentNode.insertBefore(cal, input);
     * }
     *
     * document.body.appendChild(
     *  tfw.calendar(
     *   tfw.input({
     *    value: '2016-03-07'
     *   })
     *  )
     * );
     * @param {HTMLElement} input - input field to turn into calendar field
     * @return {HTMLElement} Returns input wrapper (for inserting into DOM in case input was not inserted yet)
     */
    calendar: function (input) {
        var calendarInput = input,
            calendarWrapper = document.createElement('span'),
            calendarIcon = document.createElement('span');
        calendarWrapper.className = 'tfwCalendarWrapper';
        if (input.parentNode) {
            input.parentNode.insertBefore(calendarWrapper, input);
        }
        calendarWrapper.appendChild(input);
        calendarWrapper.appendChild(calendarIcon);
        calendarIcon.className = 'tfwCalendarIcon fa invert clickable fa-calendar';
        calendarIcon._calendarInput = input;
        input.addClass('calendarInput');
        input._calendar = this;
        input.setAttribute('pattern', '[0-9]{4,}-[0-9]{2}-[0-9]{2}');
        /**
         * Adjust date.
         * @param {string} date - inserted date (yyyy/yyyy-mm/yyyy-mm-dd)
         * @return {string} Date in format yyyy-mm-dd
         */
        function completeDate(date){
            if(date.match(/^\d{4}$/)){ //yyyy
                return date+'-01-01';
            } else if(date.match(/^\d{4}-\d{2}$/)){ //yyyy-mm
                return date+'-01';
            } else {
                return date;
            }
        }
        input.addEventListener('change', function(){console.log(this.value);this.value=completeDate(this.value);}, true);
        var calendarContainer = document.createElement('div');
        calendarContainer.addClass('calendarWidget');
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
        var setSelectedDate = function (year, month, day) {
            selectedYear = parseInt(year);
            selectedMonth = parseInt(month);
            selectedDay = parseInt(day);
        }
        if (tfw.calendar.placeCalendar != null) {
            calendarIcon.addEventListener('click', function() {
                tfw.calendar.placeCalendar(calendarContainer, input);
            });
        } else {
            console.error('Calendar widget was not added to the document - no callback was set.');
        }

        function paint() {
            var d = new Date(selectedYear, selectedMonth - 1, 1),
                i,
                /* which day of week is the first one of a month */
                w = (d.getDay()+6) % 7, /* so that Monday is first */
                sp = 0;
            calendarContainer.innerHTML = '';
            var header = document.createElement('div');
            header.setAttribute('class', 'head');
            header.innerHTML = tfw.calendar.months[selectedMonth - 1] + ' ' + selectedYear;
            calendarContainer.add(header);
            var backButton = document.createElement('div');
            backButton.addClass('calendarBackButton');
            backButton.innerHTML = '&nbsp;';
            backButton.addEventListener('mousedown', backward, true);
            header.add(backButton);
            var forwardButton = document.createElement('div');
            forwardButton.addClass('calendarForwardButton');
            forwardButton.innerHTML = '&nbsp;';
            forwardButton.addEventListener('mousedown', forward, true);
            header.add(forwardButton);
            var day;
            var dayNames = document.createElement('p');
            dayNames.setAttribute('class', 'dayNames');
            for (i = 0; i < 7; i++) {
                day = document.createElement('span');
                day.innerHTML = tfw.calendar.daysShort[i];
                if (i % 7 == 6) {
                    day.setAttribute('class', 'sunday');
                }
                dayNames.add(day);
            }
            calendarContainer.add(dayNames);
            var week = document.createElement('p');
            week.setAttribute('class', 'week');
            for (i = 0; i < w; i++) {
                day = document.createElement('span');
                day.innerHTML = '&nbsp;';
                week.add(day);
                sp++;
            }
            var pdm = new Date(selectedYear, selectedMonth, 0).getDate();
            for (i = 1; i <= pdm; i++) {
                day = document.createElement('span');
                day.setAttribute('id', 'day-' + selectedYear + '-' + (selectedMonth < 10 ? '0' + selectedMonth : selectedMonth) + '-' + (i < 10 ? '0' +
                    i : i));
                day.setAttribute('class', 'day' + (sp % 7 == 6 ? ' sunday' : '') + (i == selectedDay ? ' current' : ''));
                day.innerHTML = i;
                day.addEventListener('mousedown', clicked, true);
                week.add(day);
                sp++;
                if ((sp == 7) && (i < pdm)) {
                    sp = 0;
                    calendarContainer.add(week);
                    week = document.createElement('p');
                    week.setAttribute('class', 'week');
                }
            }
            for (i = sp; i < 7; i++) {
                day = document.createElement('span');
                if (i % 7 == 6) day.setAttribute('class', 'sunday');
                day.innerHTML = '&nbsp;';
                week.add(day);
            }
            calendarContainer.add(week);
        }
        calendarIcon.addEventListener('click', function() {
            var selectedDate = this._calendarInput.value.split('-');
            setSelectedDate(selectedDate[0], selectedDate[1], selectedDate[2]);
            paint();
        });

        function backward(event) {
            event.stopPropagation();
            event.preventDefault();
            setSelectedDate(selectedYear - (selectedMonth == 1 ? 1 : 0), selectedMonth == 1 ? 12 : selectedMonth - 1, 0);
            paint();
        }

        function forward(event) {
            event.stopPropagation();
            event.preventDefault();
            setSelectedDate(selectedYear + (selectedMonth == 12 ? 1 : 0), selectedMonth == 12 ? 1 : selectedMonth + 1, 0);
            paint();
        }

        function clicked() {
            input.value = this.id.substr(4);
            var current = calendarContainer.querySelector('.current');
            if (current) {
                current.toggleClass('current');
            }
            this.addClass('current');
            if (calendarInput.onchange) {
                calendarInput.onchange();
            }
        }
        return calendarWrapper;
    }
}
/**
 * @typedef {Object} tfw.dynamicTableClass.serverAction
 * @property {string} name - action name sent to server
 * @property {string} [method="GET"] - HTTP method to use (e.g. GET, POST)
 */
/**
 * Implemented server actions.
 * @readonly
 * @enum {tfw.dynamicTableClass.serverAction}
 */
tfw.dynamicTableClass.serverActions = {
    /** load all rows */
    LOAD: {
        name: 'load'
    },
    /** add new row, return ID */
    NEW: {
        name: 'new',
        method: 'POST'
    },
    /** edit 1 cell (id, col) */
    SAVE: {
        name: 'savedata',
        method: 'POST'
    },
    /** change order of rows - updates multiple rows */
    CHANGE_ORDER: {
        name: 'changeorder',
        method: 'POST'
    },
    /** long polling */
    WATCH: {
        name: 'watch'
    },
    /** delete row */
    DELETE: {
        name: 'delete',
        method: 'POST'
    },
    /** load user's preferences */
    PREF_GET: {
        name: 'getusersettings'
    },
    /** save user's preferences */
    PREF_SET: {
        name: 'setusersettings',
        method: 'POST'
    }
};
/**
 * Types of columns (and filters).
 * @readonly
 * @enum {string}
 */
tfw.dynamicTableClass.colTypes = {
    TEXT: 'text',
    NUMBER: 'number',
    CHECKBOX: 'checkbox',
    DATE: 'date',
    ORDER: 'order'
};
/**
 * Types of sorting.
 * @readonly
 * @enum {number}
 */
tfw.dynamicTableClass.sortTypes = {
    ASC: 1,
    DESC: -1
};
/**
 * Types of "arrows".
 * @readonly
 * @enum {string}
 */
tfw.dynamicTableClass.arrowTypes = {
    FILTER: 'filter',
    UP: 'up',
    DOWN: 'down'
};
/**
 * Width of column with row edit icon (icon's width including padding, border, margin + cell's padding + border), in pixels
 * @var {number}
 * @readonly
 * @default
 */
tfw.dynamicTableClass.ROW_EDIT_WIDTH = 25;
/**
 * List of months' names.
 * @var {String[]}
 * @default
 */
tfw.calendar.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/**
 * List of days' names' first two letters (beginning with Monday)
 * @var {String[]}
 * @default
 */
tfw.calendar.daysShort = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
/**
 * Callback function that puts calendar widget for an input field into page.
 * Most likely create an overlay that closes calendar when user clicks somewhere else.
 * @callback tfw.calendar~placeCalendar
 * @param {HTMLElement} calendar - calendar widget
 * @param {HTMLElement} input - related input field
 * @default
 */
/**
 * Function called when a calendar widget is created.
 * @var {tfw.calendar~placeCalendar}
 * @default
 */
tfw.calendar.placeCalendar = null;
window.addEventListener('load', tfw.init);

/* eslint-disable */

/**
 * Function package for preparing HTML elements.
 * @class
 */
var prvek = {
    /**
     * @todo Move to {@link tfw}
     */
    seznamZatrzitek: function (co) {
        var z;
        var x = document.createElement('div');
        if (co.id) x.id = co.id;
        var c = 'seznamZatrzitek';
        if (co.className) c += ' ' + co.className;
        x.className = c;
        if (co.style) x.style.cssText = co.style;
        if (co.onchange) x.onchange = co.onchange;
        if (co.seznam)
            for (var i = 0; i < co.seznam.length; i++) x.add(tfw.checkbox({
                id: co.id + '-' + co.seznam[i].id,
                text: co.seznam[i].text,
                onchange: function () {
                    var y = [];
                    var s = this.parentNode;
                    for (var i = 0; i < s.childNodes.length; i++)
                        if (s.childNodes[i].value) y.push(s.childNodes[i].id.split('-')[1]);
                    s._value = y.join(',');
                    if (x.onchange) x.onchange();
                }
            }));
        Object.defineProperty(x, 'value', {
            set: function (val) {
                y = [];
                if (val == 'A') {
                    for (var i = 0; i < this.childNodes.length; i++) this.childNodes[i].value = 1;
                } else {
                    v = [];
                    if (val) v = val.split(',');
                    for (var i = 0; i < this.childNodes.length; i++) this.childNodes[i].value = 0;
                    for (var i = 0; i < v.length; i++) {
                        z = this.id + '-' + v[i];
                        if ($(z)) $(z).value = 1;
                    }
                }
            },
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        x._value = '';
        if (co.init) x.value = co.init;
        x.setNone = function () {
            this.value = ''
        };
        x.setAll = function () {
            this.value = 'A'
        };
        return x;
    },
    /**
     * @deprecated
     * @see tfw.table
     */
    tabulka: function (co) {
        console.error('DEPRECATED prvek.tabulka(' + JSON.stringify(co) + ')');
        if (co.radky) co.rows = co.radky;
        return tfw.table(co);
    },
    /**
     * @deprecated
     * @see tfw.tr
     */
    radek: function (co) {
        console.error('DEPRECATED prvek.radek(' + JSON.stringify(co) + ')');
        if (co.sloupce) co.columns = co.sloupce;
        return tfw.tr(co);
    },
    /**
     * @deprecated
     * @see tfw.td
     */
    sloupec: function (co) {
        console.error('DEPRECATED prvek.sloupec(' + JSON.stringify(co) + ')');
        if (co.obsah) co.innerHTML = co.obsah;
        if (co.width) co.style = 'width:' + co.width + 'px;' + ((co.style) ? co.style : '');
        return tfw.td(co);
    },
    /**
     * @todo Remove dependencies on Triobo
     * @todo Move to {@link tfw}
     */
    soubory: function (co) {
        var b, c, s;
        var trd = 'soubory';
        if (co.nahledy) trd += ' nahledy';
        else trd += ' seznam';
        if (co.filtr === undefined) {
            co.filtr = -1;
        } else {
            if (co.filtr & 1) trd += ' hideImg';
            if (co.filtr & 2) trd += ' hideVideo';
            if (co.filtr & 4) trd += ' hideAudio';
            if (co.filtr & 8) trd += ' hideHtml';
        }
        var x = tfw.div({
            id: co.id,
            className: trd,
            style: 'width:' + co.width + 'px;height:' + co.height + ';'
        });
        x.add(b = tfw.div({
            className: 'nastroje'
        }));
        b.add(tfw.div({
            className: 'tfwIconGroup',
            children: [
                tfw.icon({
                    className: 'ikona24' + (co.nahledy ? ' aktivni' : ''),
                    index: 46 * 24,
                    title: t(511),
                    action: function (e) {
                        /*náhledy*/
                        x.removeClass('seznam');
                        x.addClass('nahledy');
                        this.parentNode.childNodes[0].addClass('aktivni');
                        this.parentNode.childNodes[1].removeClass('aktivni');
                    }
                }), tfw.icon({
                    className: 'ikona24' + (co.nahledy ? '' : ' aktivni'),
                    index: 47 * 24,
                    title: t(396),
                    action: function (e) {
                        /*"Seznam"*/
                        x.removeClass('nahledy');
                        x.addClass('seznam');
                        this.parentNode.childNodes[0].removeClass('aktivni');
                        this.parentNode.childNodes[1].addClass('aktivni');
                    }
                })
            ]
        }));
        b.add(c = tfw.div({
            className: 'tfwIconGroup'
        }));
        c.add(tfw.icon({
            className: 'ikona24',
            index: 49 * 24,
            title: t(295),
            action: function (e) {
                /*vybrat vše*/
                var c = x.files;
                for (i = 0; i < c.length; i++)
                    if (window.getComputedStyle(c[i]).display != 'none') c[i].addClass('oznacen');
            }
        }));
        if (co.linky) c.add(tfw.icon({
            className: 'ikona24',
            index: 63 * 24,
            title: t(644),
            action: function (e) {
                /*vybrat nepoužité*/
                var c = x.files;
                for (i = 0; i < c.length; i++)
                    if ((window.getComputedStyle(c[i]).display != 'none') && (!c[i].linky)) c[i].addClass('oznacen');
            }
        }));
        c.add(tfw.icon({
            className: 'ikona24',
            index: 50 * 24,
            title: t(296),
            action: function (e) {
                /*zrušit výběr*/
                for (i = 0; i < x.files.length; i++) x.files[i].removeClass('oznacen');
            }
        }));
        b.add(c = tfw.div({
            className: 'tfwIconGroup'
        }));
        if (co.akcePridat) {
            c.add(tfw.icon({
                className: 'ikona24',
                index: 51 * 24,
                title: t(498),
                action: co.akcePridat
            }));
            x.akcePridat = co.akcePridat;
        }
        if (co.akceSmazat) c.add(tfw.icon({
            className: 'ikona24',
            index: 52 * 24,
            title: t(297),
            action: co.akceSmazat
        }));
        /* smazat vybrané*/
        if (co.menitPoradi) b.add(tfw.div({
            className: 'tfwIconGroup',
            children: [
                tfw.icon({
                    className: 'ikona24',
                    index: 53 * 24,
                    title: t(512),
                    action: function (e) {
                        /*"Nahoru"*/
                        var c = x.files;
                        for (i = 1; i < c.length; i++)
                            if (c[i].hasClass('oznacen')) c[i].parentNode.insertBefore(c[i], c[i - 1]);
                    }
                }), tfw.icon({
                    className: 'ikona24',
                    index: 54 * 24,
                    title: t(513),
                    action: function (e) {
                        /*Dolů*/
                        var c = x.files;
                        for (i = (c.length - 2); i >= 0; i--)
                            if (c[i].hasClass('oznacen')) c[i].parentNode.insertBefore(c[i + 1], c[i]);
                    }
                })
            ]
        }));
        if (co.filtr >= 0) b.add(tfw.div({
            className: 'tfwIconGroup',
            children: [
                tfw.icon({
                    className: 'ikona24' + ((co.filtr & 1) ? '' : ' selected'),
                    index: 1 * 24,
                    title: t(514),
                    action: function (e) {
                        if (this.hasClass('selected')) {
                            this.removeClass('selected');
                            x.addClass('hideImg');
                        } else {
                            this.addClass('selected');
                            x.removeClass('hideImg');
                        }
                    }
                }), tfw.icon({
                    className: 'ikona24' + ((co.filtr & 2) ? '' : ' selected'),
                    index: 2 * 24,
                    title: t(515),
                    action: function (e) {
                        if (this.hasClass('selected')) {
                            this.removeClass('selected');
                            x.addClass('hideVideo');
                        } else {
                            this.addClass('selected');
                            x.removeClass('hideVideo');
                        }
                    }
                }), tfw.icon({
                    className: 'ikona24' + ((co.filtr & 4) ? '' : ' selected'),
                    index: 4 * 24,
                    title: t(516),
                    action: function (e) {
                        if (this.hasClass('selected')) {
                            this.removeClass('selected');
                            x.addClass('hideAudio');
                        } else {
                            this.addClass('selected');
                            x.removeClass('hideAudio');
                        }
                    }
                }), tfw.icon({
                    className: 'ikona24' + ((co.filtr & 8) ? '' : ' selected'),
                    index: 3 * 24,
                    title: 'HTML',
                    action: function (e) {
                        if (this.hasClass('selected')) {
                            this.removeClass('selected');
                            x.addClass('hideHtml');
                        } else {
                            this.addClass('selected');
                            x.removeClass('hideHtml');
                        }
                    }
                }), tfw.icon({
                    className: 'ikona24' + ((co.filtr & 16) ? '' : ' selected'),
                    index: 0 * 24,
                    title: t(316),
                    action: function (e) {
                        if (this.hasClass('selected')) {
                            this.removeClass('selected');
                            x.addClass('hideFont');
                        } else {
                            this.addClass('selected');
                            x.removeClass('hideFont');
                        }
                    }
                })
            ]
        }));
        x.toolbar = b;
        x.slozka = co.slozka;
        x.podslozka = co.podslozka;
        if (co.akceDvojklik) x.akceDvojklik = co.akceDvojklik;
        x.oznac = co.oznac;
        x._aktivni = 0;
        x.add(c = tfw.div({
            style: 'overflow-y:scroll;height:' + (co.height - 36) + 'px;'
        }));
        x.filesWrapper = c;
        x.appendFile = function (file) {
            var s, jm, zdroj, c = '';
            jm = file.f.split('/')[1];
            zdroj = '/zdroje/noimage.png';
            if (jm.match(/\.(gif|jpg|jpeg|png)$/i)) {
                zdroj = this.slozka + file.f;
                c = 'typImg';
            }
            if (jm.match(/\.(mp4|m4v)$/i)) {
                zdroj = 'pics/icon-video.png';
                c = 'typVideo';
            }
            if (jm.match(/\.(wav|mp3|aiff|ogg)$/i)) {
                zdroj = 'pics/icon-audio.png';
                c = 'typAudio';
            }
            if (jm.match(/\.(html|htm|xhtml|js|css)$/i)) {
                zdroj = 'pics/icon-html.png';
                c = 'typHtml';
            }
            if (jm.match(/\.(otf|ttf)$/i)) {
                zdroj = 'pics/icon-font.png';
                c = 'typFont';
            }
            if (file.f == x.oznac) c += ' oznacen';
            this.filesWrapper.add(s = tfw.div({
                className: 'soubor ' + c
            }));
            x.napoveda();
            s.value = file.f;
            s.scrollIntoView();
            if (file.f == x.oznac) {
                s.id = x.id + '-siv';
                window.setTimeout('$("' + s.id + '").scrollIntoView();', 10);
                x._aktivni = s.myOrder();
            }
            s.add(tfw.image({
                className: 'nahled',
                src: zdroj
            }));
            s.add(tfw.par({
                className: 'jmeno',
                innerHTML: x.podslozka ? file.f : jm
            }));
            if (co.info) s.add(tfw.par({
                className: 'informace',
                innerHTML: file.i
            }));
            if (co.popisky) {
                if (!('c' in file)) file.c = '';
                s.add(tfw.input({
                    className: 'nazevFotky',
                    value: file.c
                }));
                s.add(tfw.input({
                    className: 'popisek',
                    value: file.p
                }));
            }
            if (triobo.user.id == 1) s.add(tfw.div({
                style: 'float:right;',
                innerHTML: '<a href="' + (this.slozka + file.f) + '" style="text-decoration:none;">⬇︎</a>'
            }));
            if (co.linky) {
                s.linky = file.l.length;
                s.add(b = tfw.div({
                    className: 'linky',
                    style: (file.l.length ? '' : 'display:none;')
                }));
                b.add(tfw.div({
                    style: 'width:16px;height:8px;display:inline-block;background-image:url(pics/ikony-16x16.png);background-position:-800px 13px;margin-right:4px;'
                }));
                b.add(tfw.span({
                    innerHTML: file.l.length
                }));
                b.title = t(643) + ':\n' + file.l.join('\n');
            }
            s.addEventListener('mousedown', function(e) {
                if ((e.ctrlKey) || (e.metaKey)) {
                    if (this.hasClass('oznacen')) this.removeClass('oznacen');
                    else {
                        x._aktivni = this.myOrder();
                        this.addClass('oznacen');
                    }
                } else if (e.shiftKey) {
                    var ia = this.myOrder();
                    var ib = x._aktivni;
                    if (ib < ia) {
                        ib = ia;
                        ia = x._aktivni;
                    }
                    for (var i = ia; i <= ib; i++) x.files[i].addClass('oznacen');
                } else if (!this.hasClass('oznacen')) {
                    for (var i = 0; i < x.files.length; i++) x.files[i].removeClass('oznacen');
                    x._aktivni = this.myOrder();
                    this.addClass('oznacen');
                }
            }, false);
            s.addEventListener('dblclick', function(e) {
                for (var i = 0; i < this.parentNode.childNodes.length; i++) this.parentNode.childNodes[i].removeClass('oznacen');
                this.addClass('oznacen');
                e.preventDefault();
                e.stopPropagation();
                if (x.akceDvojklik) {
                    x.akceDvojklik();
                    desktop.closeTopLayer();
                }
            }, false);
        }
        x.files = c.childNodes;
        x.napoveda = function () {
            if (x.akcePridat) x.textNapovedy.style.display = x.files.length ? 'none' : 'block';
        }
        if (x.akcePridat) {
            var h = co.infoPridat;
            h = h.replace('%iconPlus',
                '<div class="tfwIconGroup" style="vertical-align:bottom;margin-right:0px;"><div class="tfwIcon ikona24"><div style="background-position-x:-1224px;"></div></div></div>'
            );
            x.add(b = tfw.div({
                className: 'zadnySoubor',
                innerHTML: h
            }));
            b.style.cursor = 'pointer';
            b.addEventListener('click', x.akcePridat, false);
            x.textNapovedy = b;
        }
        x.napoveda();
        for (var i = 0; i < co.seznam.length; i++) x.appendFile(co.seznam[i]);
        return x;
    },
    rezimVyberuBarvy: 0,
    /**
     * @todo Remove dependencies on Triobo
     * @todo Move to {@link tfw}
     */
    barva: function (co) {
        var x = document.createElement('div');
        if (co.id) x.id = co.id;
        if (co.className) co.className = 'nastaveniBarvy ' + co.className;
        else co.className = 'nastaveniBarvy';
        x.className = co.className;
        if (co.style) x.style.cssText = co.style;
        x.mouseDown = 0;
        if (co.action) x.action = co.action;
        x.zmenaPalety = 0;
        x.addEventListener('mousedown', function(e) {
            var b;
            var dlg = tfw.dialog({
                title: t(208),
                width: 500 + (co.paleta ? 200 : 0),
                height: 420,
                buttons: [
                    co.zadnaAkce ? {} : {
                        id: 'dlgBarvaNastavit',
                        text: t(134),
                        default: 1,
                        action: function () {
                            x.barvaAktualniAVychozi(x.value, 0);
                            if (x.action) x.action();
                            prvek.rezimVyberuBarvy = $('zalMichani').value;
                            if (x.zmenaPalety) editorUlozitPaletu();
                            desktop.closeTopLayer();
                        }
                    },
                    co.lzeOdebrat ? {
                        text: t(309),
                        action: function () {
                            x.barvaAktualniAVychozi('rgba(0,0,0,0)', x.value);
                            x.value = '';
                            if (x.action) x.action();
                            prvek.rezimVyberuBarvy = $('zalMichani').value;
                            if (x.zmenaPalety) editorUlozitPaletu();
                            desktop.closeTopLayer();
                        }
                    } : {}, {
                        text: t(1),
                        action: function () {
                            x.value = x.puvodniHodnota;
                            prvek.rezimVyberuBarvy = $('zalMichani').value;
                            if (x.zmenaPalety) editorUlozitPaletu();
                            desktop.closeTopLayer();
                        }
                    }
                ]
            });
            var bar = x.value;
            if (bar == 'transparent') bar = 'rgba(255,255,255,0)';
            if (!bar) bar = 'rgba(255,255,255,0)';
            if (bar.substr(0, 4) == 'rgba') rgb = bar.slice(5, -1).split(',');
            else if (bar.substr(0, 3) == 'rgb') {
                rgb = bar.slice(4, -1).split(',');
                rgb[3] = 1;
            } else rgb = [0, 0, 0, 1];
            var opac = Math.round(rgb[3] * 100);
            if (isNaN(opac)) opac = 100;
            var ab = parseInt(rgb[0]) + ',' + parseInt(rgb[1]) + ',' + parseInt(rgb[2]) + ',' + (Math.round(parseFloat(rgb[3]) * 100)) / 100;
            if (co.paleta) {
                dlg.add(c = tfw.div({
                    style: 'width:200px;height:312px;',
                    className: 'tfwInline tfwSeparatorRight'
                }));
                c.add(tfw.par({
                    className: 'nadpis',
                    innerHTML: t(548),
                    style: 'border-bottom:none;'
                }));
                /* paleta vydání */
                c.add(b = tfw.div({
                    id: 'dlgPaleta',
                    className: 'tfwSelect',
                    style: 'width:200px;height:250px;margin:2px 0 4px;'
                }));
                c.add(tfw.div({
                    className: 'tfwIconGroup',
                    children: [
                        tfw.icon({
                            className: 'ikona24',
                            index: 51 * 24,
                            title: t(20),
                            action: function (e) {
                                /* nová barva */
                                if ($('dlgPaleta').value) $($('dlgPaleta').value).className = '';
                                var pi, max = 0;
                                for (i = 0; i < $('dlgPaleta').childNodes.length; i++) {
                                    pi = parseInt($('dlgPaleta').childNodes[i].id.substr(7));
                                    if (pi > max) max = pi;
                                }
                                max++;
                                x.pridatDoPalety({
                                    id: max,
                                    n: 'r' + $('barvaR-v').value + ' g' + $('barvaG-v').value + ' b' + $(
                                        'barvaB-v').value + ((parseInt($('barvaO-v').value) < 100) ? (' (' +
                                        $('barvaO-v').value + ' %)') : ''),
                                    v: $('barvaR-v').value + ',' + $('barvaG-v').value + ',' + $('barvaB-v').value +
                                        ',' + ($('barvaO-v').value / 100),
                                    a: 1
                                });
                                $('dlgPaleta').value = 'paleta-' + max;
                                $('dlgPalUloz').disabled = 0;
                                $('dlgPalSmaz').disabled = 0;
                                $('dlgPalNahoru').disabled = 0;
                                $('dlgPalDolu').disabled = 1;
                                $('paleta-' + max).scrollIntoView(true);
                                x.zmenaPalety = 1;
                                x.prejmenujBarvu();
                            }
                        }), tfw.icon({
                            id: 'dlgPalUloz',
                            className: 'ikona24',
                            index: 57 * 24,
                            title: t(9),
                            zakazano: 1,
                            action: function (e) {
                                var pal = $($('dlgPaleta').value);
                                pal.value = $('barvaR-v').value + ',' + $('barvaG-v').value + ',' + $('barvaB-v').value +
                                    ',' + ($('barvaO-v').value / 100);
                                pal.childNodes[0].style.backgroundImage = '-webkit-linear-gradient(rgba(' + pal.value +
                                    '),rgba(' + pal.value + ')),url(pics/vzorek.png)';
                                var re = /^r[0-9]+ g[0-9]+ b[0-9]+/;
                                if (re.test($($('dlgPaleta').value).childNodes[1].innerHTML)) $($('dlgPaleta').value).childNodes[
                                        1].innerHTML = 'r' + $('barvaR-v').value + ' g' + $('barvaG-v').value + ' b' +
                                    $('barvaB-v').value + ((parseInt($('barvaO-v').value) < 100) ? (' (' + $('barvaO-v')
                                        .value + ' %)') : '');
                                x.zmenaPalety = 1;
                                x.prejmenujBarvu();
                            }
                        }), tfw.icon({
                            id: 'dlgPalSmaz',
                            className: 'ikona24',
                            index: 52 * 24,
                            title: t(17),
                            zakazano: 1,
                            action: function (e) {
                                var pal = $($('dlgPaleta').value);
                                pal.parentNode.removeChild(pal);
                                $('dlgPaleta').value = '';
                                $('dlgPalUloz').disabled = 1;
                                $('dlgPalSmaz').disabled = 1;
                                $('dlgPalNahoru').disabled = 1;
                                $('dlgPalDolu').disabled = 1;
                                x.zmenaPalety = 1;
                            }
                        })
                    ]
                }));
                c.add(tfw.div({
                    className: 'tfwIconGroup',
                    children: [
                        tfw.icon({
                            id: 'dlgPalNahoru',
                            className: 'ikona24',
                            index: 53 * 24,
                            title: t(512),
                            zakazano: 1,
                            action: function (e) {
                                /*"Nahoru"*/
                                var c = $('dlgPaleta').childNodes;
                                for (i = 1; i < c.length; i++)
                                    if (c[i].hasClass('selected')) {
                                        c[i].parentNode.insertBefore(c[i], c[i - 1]);
                                        $('dlgPalNahoru').disabled = (i == 1) ? 1 : 0;
                                        $('dlgPalDolu').disabled = 0;
                                        break;
                                    }
                                x.zmenaPalety = 1;
                            }
                        }), tfw.icon({
                            id: 'dlgPalDolu',
                            className: 'ikona24',
                            index: 54 * 24,
                            title: t(513),
                            zakazano: 1,
                            action: function (e) {
                                /*Dolů*/
                                var c = $('dlgPaleta').childNodes;
                                for (i = (c.length - 2); i >= 0; i--)
                                    if (c[i].hasClass('selected')) {
                                        c[i].parentNode.insertBefore(c[i + 1], c[i]);
                                        $('dlgPalNahoru').disabled = 0;
                                        $('dlgPalDolu').disabled = (i == c.length - 2) ? 1 : 0;
                                    }
                                x.zmenaPalety = 1;
                            }
                        })
                    ]
                }));
                $('dlgPaleta').value = '';
                for (var i = 0; i < editor.aktVydani.paleta.length; i++) {
                    x.pridatDoPalety(editor.aktVydani.paleta[i]);
                    if (!$('dlgPaleta').value)
                        if (ab == editor.aktVydani.paleta[i].v) {
                            $('dlgPaleta').value = 'paleta-' + editor.aktVydani.paleta[i].id;
                            $('dlgPaleta').childNodes[i].className = 'selected';
                            $('dlgPalUloz').disabled = 0;
                            $('dlgPalSmaz').disabled = 0;
                            $('dlgPalNahoru').disabled = (i == 0) ? 1 : 0;
                            $('dlgPalDolu').disabled = (i == editor.aktVydani.paleta.length - 1) ? 1 : 0;
                            $('paleta-' + editor.aktVydani.paleta[i].id).scrollIntoView(true);
                        }
                }
            }
            dlg.add(b = tfw.div({
                style: 'width:216px;height:312px;',
                className: 'tfwInline tfwSeparatorRight'
            }));
            b.add(z = tfw.noveZalozky('zalMichani', 216, 200, t(546) + ';' + t(547), prvek.rezimVyberuBarvy));
            z.childNodes[1].add(tfw.div({
                id: 'paletaHSV',
                style: 'width:200px;height:200px;background-size: 200px 200px;position:relative;overflow:hidden;cursor:crosshair;',
                children: [
                    tfw.div({
                        id: 'paletaHSVpoint',
                        style: 'position:absolute;width:7px;height:7px;border:1px solid black;border-radius:4px;'
                    })
                ]
            }));
            z.childNodes[1].add(tfw.slider({
                id: 'barvaH',
                legend: 'H:',
                legendStyle: 'width:18px',
                postText: '°',
                min: 0,
                max: 359,
                step: 1,
                value: 0,
                valueStyle: 'width:32px',
                onchange: x.repaintH,
                style: 'margin-top:16px;'
            }));
            z.childNodes[1].add(tfw.slider({
                id: 'barvaS',
                legend: 'S:',
                legendStyle: 'width:18px',
                postText: '%',
                min: 0,
                max: 100,
                step: 1,
                value: 0,
                valueStyle: 'width:32px',
                onchange: x.repaintH
            }));
            z.childNodes[1].add(tfw.slider({
                id: 'barvaV',
                legend: 'B:',
                legendStyle: 'width:18px',
                postText: '%',
                min: 0,
                max: 100,
                step: 1,
                value: 0,
                valueStyle: 'width:32px',
                onchange: x.repaintH
            }));
            for (var ry = 0; ry < 10; ry++)
                for (var rx = 0; rx < 9; rx++) {
                    z.childNodes[2].add(b = tfw.div({
                        className: 'paletaTrioboPole'
                    }));
                    if (ry < 9) {
                        hue = [0, 30, 60, 120, 180, 200, 240, 270, 300];
                        sat = [100, 50, 25];
                        bri = [100, 80, 50];
                        plt = HSV2RGB(hue[rx], sat[ry % 3], bri[Math.floor(ry / 3)]);
                    } else plt = HSV2RGB(0, 0, rx / 8 * 100);
                    b.value = plt[0] + ',' + plt[1] + ',' + plt[2];
                    b.style.backgroundColor = 'rgb(' + b.value + ')';
                    b.addEventListener('click', function() {
                        var rb = this.value.split(',');
                        $('barvaR').value = (rb[0]);
                        $('barvaG').value = (rb[1]);
                        $('barvaB').value = (rb[2]);
                        x.repaintR();
                    }, false);
                    b.addEventListener('dblclick', function(e) {
                        $('dlgBarvaNastavit').onclick(e);
                    }, false);
                }
            dlg.add(b = tfw.div({
                style: 'width:220px;height:312px;',
                className: 'tfwInline',
                children: [
                    tfw.div({
                        style: 'text-align:center;',
                        children: [
                            tfw.div({
                                id: 'puvodniBarva',
                                className: 'ukazkaBarvy',
                                style: 'width:88px;height:58px;display:inline-block;border:1px solid black;border-right:none;'
                            }), tfw.div({
                                id: 'barvaNahled',
                                className: 'ukazkaBarvy',
                                style: 'width:88px;height:58px;display:inline-block;border:1px solid black;border-left:none;'
                            })
                        ]
                    }), tfw.slider({
                        id: 'barvaR',
                        legend: 'R:',
                        legendStyle: 'width:18px',
                        min: 0,
                        max: 255,
                        step: 1,
                        value: parseInt(rgb[0]),
                        valueStyle: 'width:32px',
                        onchange: x.repaintR,
                        style: 'margin-top:8px;'
                    }), tfw.slider({
                        id: 'barvaG',
                        legend: 'G:',
                        legendStyle: 'width:18px',
                        min: 0,
                        max: 255,
                        step: 1,
                        value: parseInt(rgb[1]),
                        valueStyle: 'width:32px',
                        onchange: x.repaintR
                    }), tfw.slider({
                        id: 'barvaB',
                        legend: 'B:',
                        legendStyle: 'width:18px',
                        min: 0,
                        max: 255,
                        step: 1,
                        value: parseInt(rgb[2]),
                        valueStyle: 'width:32px',
                        onchange: x.repaintR
                    }), tfw.slider({
                        id: 'barvaC',
                        legend: 'C:',
                        legendStyle: 'width:18px',
                        postText: '%',
                        min: 0,
                        max: 100,
                        step: 1,
                        value: 0,
                        valueStyle: 'width:32px',
                        onchange: x.repaintC,
                        style: 'margin-top:8px;'
                    }), tfw.slider({
                        id: 'barvaM',
                        legend: 'M:',
                        legendStyle: 'width:18px',
                        postText: '%',
                        min: 0,
                        max: 100,
                        step: 1,
                        value: 0,
                        valueStyle: 'width:32px',
                        onchange: x.repaintC
                    }), tfw.slider({
                        id: 'barvaY',
                        legend: 'Y:',
                        legendStyle: 'width:18px',
                        postText: '%',
                        min: 0,
                        max: 100,
                        step: 1,
                        value: 0,
                        valueStyle: 'width:32px',
                        onchange: x.repaintC
                    }), tfw.slider({
                        id: 'barvaK',
                        legend: 'K:',
                        legendStyle: 'width:18px',
                        postText: '%',
                        min: 0,
                        max: 100,
                        step: 1,
                        value: 0,
                        valueStyle: 'width:32px',
                        onchange: x.repaintC
                    }), tfw.input({
                        id: 'barvaW',
                        legend: 'Web #',
                        legendStyle: 'width:138px',
                        style: 'width:56px;margin-top:8px;text-align:center;font-family:courier,monospace;font-size:13px;',
                        maxLength: 6,
                        onchange: x.repaintW
                    }), tfw.par({
                        innerHTML: t(36) + ':',
                        style: 'margin:8 0 0px;'
                    }), tfw.slider({
                        id: 'barvaO',
                        legend: '',
                        legendStyle: 'width:18px',
                        postText: '%',
                        min: 0,
                        max: 100,
                        step: 1,
                        value: opac,
                        valueStyle: 'width:32px',
                        onchange: x.repaintR
                    })
                ]
            }));
            if (co.bezSytosti) {
                $('barvaO').value = (100);
                $('barvaO-s').disabled = 1;
                $('barvaO-v').disabled = 1;
            }
            $('puvodniBarva').style.backgroundImage = '-webkit-linear-gradient(' + bar + ',' + bar + '),url(pics/vzorek.png)';
            $('paletaHSV').addEventListener('mousedown', function(e) {
                x.mouseDown = 1;
                x.paletaClick(e);
            }, false);
            desktop.layers[desktop.activeLayer].addEventListener('mousemove', x.paletaClick, false);
            desktop.layers[desktop.activeLayer].addEventListener('mouseup', function(e) {
                x.mouseDown = 0;
            }, false);
            x.zmenaPalety = 0;
            x.repaintR();
        }, false);
        x.prejmenujBarvu = function () {
            tfw.dialog({
                title: t(545),
                width: 332,
                height: 180,
                children: [ /* "Název barvy" */
                    tfw.input({
                        id: 'nazevBarvy',
                        value: $($('dlgPaleta').value).childNodes[1].innerHTML,
                        legend: t(545) + ':',
                        legendStyle: 'width:80px',
                        style: 'width:200px'
                    })
                ],
                vychozi: 'nazevBarvy',
                buttons: [{
                    text: t(9),
                    default: 1,
                    action: function () {
                        $($('dlgPaleta').value).childNodes[1].innerHTML = $('nazevBarvy').value;
                        desktop.closeTopLayer();
                    }
                }, {
                    text: t(342),
                    action: function () {
                        $($('dlgPaleta').value).childNodes[1].innerHTML = 'r' + $('barvaR-v').value + ' g' + $('barvaG-v').value +
                            ' b' + $('barvaB-v').value + ((parseInt($('barvaO-v').value) < 100) ? (' (' + $('barvaO-v').value +
                                ' %)') : '');
                        desktop.closeTopLayer();
                    }
                }, {
                    text: t(1),
                    action: desktop.closeTopLayer
                }]
            });
        }
        x.pridatDoPalety = function (barva) {
            $('dlgPaleta').add(d = tfw.div({
                id: 'paleta-' + barva.id,
                className: (barva.a ? 'selected' : ''),
                children: [
                    tfw.span({
                        className: 'vzorekBarvy',
                        style: 'float:left;background-image:-webkit-linear-gradient(rgba(' + barva.v + '),rgba(' + barva.v +
                            ')),url(pics/vzorek.png)'
                    }), tfw.span({
                        className: 'nazevBarvy',
                        style: 'width:160px;',
                        innerHTML: barva.n
                    })
                ]
            }));
            d.value = barva.v;
            d.addEventListener('click', function(e) {
                if ($('dlgPaleta').value) $($('dlgPaleta').value).className = '';
                this.className = 'selected';
                $('dlgPaleta').value = this.id;
                var rgb = this.value.split(',');
                $('barvaR').value = (rgb[0]);
                $('barvaG').value = (rgb[1]);
                $('barvaB').value = (rgb[2]);
                $('barvaO').value = (rgb[3] * 100);
                x.repaintR();
                $('dlgPalUloz').disabled = 0;
                $('dlgPalSmaz').disabled = 0;
                $('dlgPalNahoru').disabled = this.myOrder() ? 0 : 1;
                $('dlgPalDolu').disabled = (this.myOrder() == this.parentNode.childNodes.length - 1) ? 1 : 0;
                e.stopPropagation();
                e.preventDefault();
            }, false);
            d.addEventListener('dblclick', function(e) {
                $('dlgBarvaNastavit').onclick(e);
            }, false);
        }
        x.paletaClick = function (e) {
            if (x.mouseDown) {
                var lhr = tfw.getRealCoordinates($('paletaHSV'));
                var h = Math.floor((e.pageX - lhr[0]) / 200 * 360);
                var s = 100 - Math.floor((e.pageY - lhr[1]) / 2);
                if (h < 0) h = 0;
                if (h > 359) h = 359;
                if (s < 0) s = 0;
                if (s > 100) s = 100;
                $('barvaH').value = (h);
                $('barvaS').value = (s);
                x.repaintH();
                e.stopPropagation();
                e.preventDefault();
            }
        }
        x.repaintR = function () {
            var hsv = RGB2HSV($('barvaR-v').value, $('barvaG-v').value, $('barvaB-v').value);
            $('barvaH').value = (hsv[0]);
            $('barvaS').value = (hsv[1]);
            $('barvaV').value = (hsv[2]);
            var cmyk = RGB2CMYK($('barvaR-v').value, $('barvaG-v').value, $('barvaB-v').value);
            $('barvaC').value = (cmyk[0]);
            $('barvaM').value = (cmyk[1]);
            $('barvaY').value = (cmyk[2]);
            $('barvaK').value = (cmyk[3]);
            $('barvaW').value = RGB2Web($('barvaR-v').value, $('barvaG-v').value, $('barvaB-v').value);
            x.repaintPal();
        }
        x.repaintH = function () {
            var rgb = HSV2RGB($('barvaH-v').value, $('barvaS-v').value, $('barvaV-v').value);
            $('barvaR').value = (rgb[0]);
            $('barvaG').value = (rgb[1]);
            $('barvaB').value = (rgb[2]);
            var cmyk = RGB2CMYK($('barvaR-v').value, $('barvaG-v').value, $('barvaB-v').value);
            $('barvaC').value = (cmyk[0]);
            $('barvaM').value = (cmyk[1]);
            $('barvaY').value = (cmyk[2]);
            $('barvaK').value = (cmyk[3]);
            $('barvaW').value = RGB2Web($('barvaR-v').value, $('barvaG-v').value, $('barvaB-v').value);
            x.repaintPal();
        }
        x.repaintC = function () {
            var rgb = CMYK2RGB($('barvaC-v').value, $('barvaM-v').value, $('barvaY-v').value, $('barvaK-v').value);
            $('barvaR').value = (rgb[0]);
            $('barvaG').value = (rgb[1]);
            $('barvaB').value = (rgb[2]);
            var hsv = RGB2HSV($('barvaR-v').value, $('barvaG-v').value, $('barvaB-v').value);
            $('barvaH').value = (hsv[0]);
            $('barvaS').value = (hsv[1]);
            $('barvaV').value = (hsv[2]);
            $('barvaW').value = RGB2Web($('barvaR-v').value, $('barvaG-v').value, $('barvaB-v').value);
            x.repaintPal();
        }
        x.repaintW = function () {
            var rgb = Web2RGB($('barvaW').value);
            $('barvaR').value = (rgb[0]);
            $('barvaG').value = (rgb[1]);
            $('barvaB').value = (rgb[2]);
            var hsv = RGB2HSV($('barvaR-v').value, $('barvaG-v').value, $('barvaB-v').value);
            $('barvaH').value = (hsv[0]);
            $('barvaS').value = (hsv[1]);
            $('barvaV').value = (hsv[2]);
            var cmyk = RGB2CMYK($('barvaR-v').value, $('barvaG-v').value, $('barvaB-v').value);
            $('barvaC').value = (cmyk[0]);
            $('barvaM').value = (cmyk[1]);
            $('barvaY').value = (cmyk[2]);
            $('barvaK').value = (cmyk[3]);
            x.repaintPal();
        }
        x.repaintPal = function () {
            var h = parseInt($('barvaH-v').value);
            var s = parseInt($('barvaS-v').value);
            var v = parseInt($('barvaV-v').value);
            $('paletaHSVpoint').style.left = (Math.round(h / 360 * 200) - 4) + 'px';
            $('paletaHSVpoint').style.top = ((100 - s) * 2 - 4) + 'px';
            $('paletaHSVpoint').style.borderColor = (v > 50) ? 'black' : 'white';
            var jas = 'rgba(0,0,0,' + (1 - v / 100) + ')';
            $('paletaHSV').style.backgroundImage = '-webkit-linear-gradient(' + jas + ',' + jas + '),url(pics/hsl.png)';
            var bar = 'rgba(' + $('barvaR-v').value + ',' + $('barvaG-v').value + ',' + $('barvaB-v').value + ',' + $('barvaO-v').value / 100 + ')';
            x.value = bar;
            $('barvaNahled').style.backgroundImage = '-webkit-linear-gradient(' + bar + ',' + bar + '),url(pics/vzorek.png)';
            if ($('dlgPaleta'))
                if ($('dlgPaleta').value) $('dlgPalUloz').disabled = 0;
        }
        x.barvaAktualniAVychozi = function (a, v) {
            if (a) {
                x.value = a;
                x.puvodniHodnota = a;
                x.style.backgroundImage = '-webkit-linear-gradient(' + a + ',' + a + '),url(pics/vzorek.png)';
            } else {
                x.value = v;
                x.puvodniHodnota = v;
                x.style.backgroundImage = 'url(pics/vzorek.png)';
            }
        }
        if (co.value) x.barvaAktualniAVychozi(co.value, co.value);
        return x;
    },
    /**
     * @todo Remove dependencies on Triobo
     * @todo Move to {@link tfw}
     */
    barvaSLegendou: function (co) {
        var x = document.createElement('p');
        var l = document.createElement('span');
        l.style.display = 'inline-block';
        if (co.legenda) l.innerHTML = co.legenda;
        if (co.legend) l.innerHTML = co.legend;
        if (co.legendaSirka) l.style.width = co.legendaSirka;
        if (co.legendStyle) l.style.cssText = co.legendStyle;
        x.add(l);
        x.add(prvek.barva(co));
        return x;
    }
}

function RGB2HSV(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, v = max;
    var d = max - min;
    s = max == 0 ? 0 : d / max;
    if (max == min) {
        h = 0; // achromatic
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

function HSV2RGB(h, s, v) {
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

function RGB2CMYK(r, g, b) {
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

function CMYK2RGB(c, m, y, k) {
    c /= 100, m /= 100, y /= 100, k /= 100;
    var r, g, b;
    r = 1 - Math.min(1, c * (1 - k) + k);
    g = 1 - Math.min(1, m * (1 - k) + k);
    b = 1 - Math.min(1, y * (1 - k) + k);
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function RGB2Web(r, g, b) {
    r = parseInt(r).toString(16);
    g = parseInt(g).toString(16);
    b = parseInt(b).toString(16);
    if (r.length < 2) r = '0' + r;
    if (g.length < 2) g = '0' + g;
    if (b.length < 2) b = '0' + b;
    return (r + g + b);
}

function Web2RGB(h) {
    if (h.length == 3) h = h.substr(0, 1) + h.substr(0, 1) + h.substr(1, 1) + h.substr(1, 1) + h.substr(2, 1) + h.substr(2, 1);
    while (h.length < 6) h = '0' + h;
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
function Dyntable(x) {
    console.error('DEPRECATED Dyntable(' + JSON.stringify(x) + '), use tfw.dynamicTable()');
    return tfw.Dyntable(x);
}
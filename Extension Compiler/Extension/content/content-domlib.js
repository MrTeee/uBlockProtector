//The DOM manipulation library for content rules, this library behaves differently than jQuery
"use strict";

//=====Shortcuts=====
/**
 * Shortcut for new $.Selection(input).
 * @function
 * @param {string} input - The selector.
 * @return {$.Selection} The Selection object.
 */
var $ = (input) => new $.Selection(input);

//=====Main=====
/**
 * Selection class.
 * Unless otherwise specified, all methods returns the keyword this.
 * @class
 */
$.Selection = class {
    /**
     * Constructor.
     * @constructor
     * @param {string} selector - The selector.
     */
    constructor(selector) {
        /**
         * The selected elements.
         * @member {Array.<DOMElement>}
         */
        this.selection = document.querySelectorAll(selector);
        /**
         * The amount of selected elements.
         * @member {integer}
         */
        this.length = this.selection.length;
    }

    //---CSS---
    /**
     * Set or update CSS of all selected elements.
     * @method
     * @param {string} key - The key of the style, use "maxHeight" instead of "max-height" (same for all other similar keys).
     * @param {string} val - The value to set.
     */
    css(key, val) {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].style[key] = val;
        }
        return this;
    }
    /**
     * Show all selected elements.
     * @method
     * @param {string} [state="block"] - The state to apply, defaults to "block";
     */
    show(state = "block") {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].style.display = state;
        }
        return this;
    }
    /**
     * Hide all selected elements. Current state will not be saved. Things may break if you try to show them again.
     * @method
     */
    hide() {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].style.display = "none";
        }
        return this;
    }
    /**
     * Remove all selected elements from DOM.
     * @method
     */
    remove() {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].remove();
        }
        return this;
    }
    /**
     * Remove classes from all selected elements.
     * @method
     * @param {string} ...args - Classes to remove, omit to remove all.
     */
    rmClass(...args) {
        if (args.length) {
            for (let i = 0; i < this.selection.length; i++) {
                this.selection[i].classList.remove(...args);
            }
        } else {
            for (let i = 0; i < this.selection.length; i++) {
                this.selection[i].className = "";
            }
        }
        return this;
    }

    //---Selection---
    /**
     * Update current selection, only keep the first selected element.
     * @method
     */
    first() {
        if (this.selection.length) {
            this.selection = [this.selection[0]];
            this.length = 1
        } //Ignore if nothing is selected
        return this;
    }
    /**
     * Update current selection, only keep the last selected element.
     * @method
     */
    last() {
        if (this.selection.length) {
            this.selection = [this.selection[this.selection.length - 1]];
            this.length = 1
        } //Ignore if nothing is selected
        return this;
    }
    /**
     * Update current selection, set it to immediate children of the first selected element that match the new selector.
     * @method
     * @param {string} selector - The new selector.
     */
    children(selector) {
        if (this.selection.length) {
            this.selection = this.selection[0].querySelectorAll(`:scope > ${selector}`);
            this.length = this.selection.length;
        } //Ignore if nothing is selected
        return this;
    }
    /**
     * Update current selection, set it to children of the first selected element that match the new selector.
     * @method
     * @param {string} selector - The new selector.
     */
    find(selector) {
        if (this.selection.length) {
            this.selection = this.selection[0].querySelectorAll(selector);
            this.length = this.selection.length;
        } //Ignore if nothing is selected
        return this;
    }
    /**
     * Update current selection, set it to the parent of each selected elements.
     * @method
     */
    parent() {
        for (let i = 0; i < this.selection.length; i++) {
            //Only update if current element has a parent
            const elem = this.selection[i].parentNode;
            if (elem) {
                this.selection[i] = elem;
            }
        }
        return this;
    }
    /**
     * Update current selection, filter out elements that do not have the matcher string in their textContent.
     * @method
     * @param {string} matcher - The matcher string.
     */
    includes(matcher) {
        let newSelection = [];
        for (let i = 0; i < this.selection.length; i++) {
            if (this.selection[i].textContent.includes(matcher)) {
                newSelection.push(this.selection[i]);
            }
        }
        this.selection = newSelection;
        this.length = newSelection.length;
        return this;
    }
    /**
     * Update current selection, filter out elements that do not have the matcher string as their textContent.
     * @method
     * @param {string} matcher - The matcher string.
     */
    textIs(matcher) {
        let newSelection = [];
        for (let i = 0; i < this.selection.length; i++) {
            if (matcher === this.selection[i].textContent.includes) {
                newSelection.push(this.selection[i]);
            }
        }
        this.selection = newSelection;
        this.length = newSelection.length;
        return this;
    }

    //---Events---
    /**
     * Trigger a click to all selected elements.
     * @method
     */
    click() {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].click();
        }
        return this;
    }

    //---Get and Set---
    /**
     * Get or set textContent of first selected element.
     * @method
     * @param {string} [text=undefined] - The text to set, omit to get.
     * @return {string|this} String in get mode, the keyword this in set mode. An empty string will be returned
     ** if the textContent cannot be retrieved.
     */
    text(text) {
        if (text === undefined) {
            return this.selection.length ? this.selection[0].textContent : "";
        } else {
            if (this.selection.length) {
                this.selection[0].textContent = text;
            } //Ignore if nothing is selected
            return this;
        }
    }
    /**
     * Get or set innerHTML of first selected element.
     * @method
     * @param {DOMString} [html=undefined] - The DOM string to set, omit to get.
     * @return {DOMString|this} DOM string in get mode, the keyword this in set mode. An empty string will be returned
     ** if the innerHTML cannot be retrieved.
     */
    html(html) {
        if (html === undefined) {
            return this.selection.length ? this.selection[0].innerHTML : "";
        } else {
            if (this.selection.length) {
                this.selection[0].innerHTML = html;
            } //Ignore if nothing is selected
            return this;
        }
    }
    /**
     * Get or set data property, only affect the first selected element.
     * @method
     * @param {string} name - The name of the data entry.
     * @param {string} [val=undefined] - The value to set, omit to get.
     * @return {Any|this} Something appropriate in get mode, the keyword this in set mode.
     */
    data(name, val) {
        if (val === undefined) {
            return this.selection.length ? this.selection[0].dataset[name] : undefined;
        } else {
            if (this.selection.length) {
                this.selection[0].dataset[name] = val;
            } //Ignore if nothing is selected
            return this;
        }
    }
    /**
     * Get, set, or delete an attribute, only affect the first selected element.
     * Set del for delete mode, set val but not del for set mode, omit both val and del for get mode.
     * @method
     * @param {string} name - The name of the attribute.
     * @param {string} [val=undefined] - The value to set.
     * @param {boolean} [del=false] - Whether this attribute should be deleted.
     * @return {Any|this} Something appropriate in get mode, the keyword this in other modes.
     */
    attr(name, val, del) {
        if (val === undefined && !del) {
            return this.selection.length ? this.selection[0][name] : undefined;
        } else {
            if (this.selection.length) {
                if (del) {
                    this.selection[0].removeAttribute(name);
                } else {
                    this.selection[0].setAttribute(name, val);
                }
            } //Ignore if nothing is selected
            return this;
        }
    }

    //---Insert---
    /**
     * Insert HTML before the beginning of the first selected element.
     * @method
     * @param {DOMString} input - The DOM string to insert.
     */
    before(input) {
        if (this.selection.length && this.selection[0].parentNode) {
            this.selection[0].insertAdjacentHTML("beforebegin", input);
        } //Ignore if cannot insert
        return this;
    }
    /**
     * Insert HTML after the beginning of the first selected element.
     * @method
     * @param {DOMString} input - The DOM string to insert.
     */
    prepend(input) {
        if (this.selection.length) {
            this.selection[0].insertAdjacentHTML("afterbegin", input);
        } //Ignore if cannot insert
        return this;
    }
    /**
     * Insert HTML before the end of the first selected element.
     * @method
     * @param {DOMString} input - The DOM string to insert.
     */
    append(input) {
        if (this.selection.length) {
            this.selection[0].insertAdjacentHTML("beforeend", input);
        } //Ignore if cannot insert
        return this;
    }
    /**
     * Insert HTML after the end of the first selected element.
     * @method
     * @param {DOMString} input - The DOM string to insert.
     */
    after(input) {
        if (this.selection.length && this.selection[0].parentNode) {
            this.selection[0].insertAdjacentHTML("afterend", input);
        } //Ignore if cannot insert
        return this;
    }

    //---Other---
    /**
     * Get offsetWidth of the first selected element.
     * @method
     * @return {integer} The offsetWidth, or -1 if the offsetWidth cannot be retrieved.
     */
    width() {
        return this.selection.length ? this.selection[0].offsetWidth : -1;
    }
    /**
     * Get offsetHeight of the first selected element.
     * @method
     * @return {integer} The offsetHeight, or -1 if the offsetHeight cannot be retrieved.
     */
    height() {
        return this.selection.length ? this.selection[0].offsetHeight : -1;
    }
    /**
     * Loop though each selected element.
     * @method
     * @param {Function} func - The handler.
     ** @param {DOMElement} elem - The current DOM element.
     */
    each(func) {
        for (let i = 0; i < this.selection.length; i++) {
            func(this.selection[i]);
        }
        return this;
    }
};

//=====Utilities=====
/**
 * Same as a.request(), but request directly in the content script.
 * @function
 */
$.request = (details, onload, onerror) => {
    let req = new XMLHttpRequest();
    //Event handler
    req.onreadystatechange = () => {
        if (req.readyState === 4) {
            if (req.responseText === null) {
                onerror();
            } else {
                onload(req.responseText);
            }
        }
    };
    //Create request
    req.open(details.method, details.url);
    //Set headers
    if (details.headers) {
        for (let key in details.headers) {
            req.setRequestHeader(key, details.headers[key]);
        }
    }
    //Send request
    req.send(details.payload || null);
};

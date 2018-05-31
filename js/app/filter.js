/**
 * TODO remember last tab selection in a local/session storage, by current path and ID of content
 *      retain tab selection on page re-visits.
 */
(function () {
    'use strict';

    const ALL_TAG = '*';

    // css
    const ACTIVE = "is-active";
    const HIDDEN = "is-hidden";
    const FILTERABLE = "is-filterable";
    const FILTER_TAG = "is-filter-tag";
    const STATIC = "is-static";
    const FIRST = "is-first";
    const LAST = "is-last"
    const FILTER_DISPLAY = "is-filter-display";
    const FOR ="data-for";

    // data-filter-X
    const FILTER_CONTENT_ID = "data-filter-content";
    const WATCH = "data-filter-watch";
    const TAG_VALUE = "data-filter-tag-value";

    App.register("filter", class extends Stimulus.Controller {
        _filterables(){
            return this._content().getElementsByClassName(FILTERABLE);
        }
        _tabs(){
            return this.element.getElementsByTagName('a');
        }
        _content(){
            return document.getElementById(this.element.getAttribute(FILTER_CONTENT_ID).substring(1));
        }
        _tagMap(){
            var definitions = new Map();
            var first = new Map();
            var middle = new Map();
            var last = new Map();
            var staticAll = false;

            // Evaluate pre-defined static + definitions:
            {
                var pre = this.element.getElementsByClassName(FILTER_DISPLAY);
                for (var i = 0; i < pre.length; i++) {
                    var pre = pre[i];
                    var key = pre.getAttribute(FOR);
                    var value = pre.innerHTML;
                    var position = pre.classList.contains(FIRST) ? 'first' : (pre.classList.contains(LAST) ? 'last' : 'middle');
                    if (pre.classList.contains(STATIC)) {
                        var map = (position == 'first') ? first : (position == 'last' ? last : middle);
                        if (map) map.set(key, value);
                        if (key == ALL_TAG) staticAll = true;
                    } else {
                        definitions.set(key, {position: position, display: value});
                    }
                }
            }

            // Evaluate content:
            {
                var contentTags = this._content().getElementsByClassName(FILTER_TAG);

                for (let i = 0; i < contentTags.length; i++) {
                    var contentTag = contentTags[i];

                    var key = contentTag.hasAttribute(TAG_VALUE) ? contentTag.getAttribute(TAG_VALUE) : contentTag.innerHTML;
                    var position = 'middle';
                    var value = key;
                    if (definitions.has(key)){
                        value = definitions.get(key).display;
                        position = definitions.get(key).position;
                    }

                    if (!first.has(key) && !last.has(key) && !middle.has(key)) {
                        var map = (position == 'first') ? first : (position == 'last' ? last : middle);
                        if (map) map.set(key, value);
                    }
                }
            }

            // Handle special 'all' filter, only if not already statically displayed:
            if (!staticAll && this._filterables().length > 0){
                var key = ALL_TAG;
                var value = key;
                var position = 'middle';
                if (definitions.has(key)){
                    value = definitions.get(key).display;
                    position = definitions.get(key).position;
                }
                var map = (position == 'first') ? first : (position == 'last' ? last : middle);
                if (map) map.set(key, value);
            }

            // Add to final result, relying on insertion order
            var out = new Map();
            for (var [key, value] of first) out.set(key, value);
            for (var [key, value] of middle) out.set(key, value);
            for (var [key, value] of last) out.set(key, value);
            return out;
        }
        _build(){

            // If it's a preview, then it's already been built.
            var rebuild = !document.documentElement.hasAttribute("data-turbolinks-preview");

            if (rebuild) {
                var items = '';

                this._tagMap().forEach(function(value, key){
                    items += "<li><a data-turbolinks='false' href='#" + key + "'>" + value + "</a></li>";
                }, this);

                this.element.innerHTML = "<ul>" + items + "</ul>";

                var tabs = this._tabs();

                this.element.classList.toggle(HIDDEN, tabs.length == 0);

                if (tabs.length == 0){
                    this._hideAll();
                } else {
                    /// TODO restore this.selectedTags if it is defined and still exists
                    this._select(tabs[0]);
                }
            }

            this._addListeners();
        }
        _addListeners(){
            var tabs = this._tabs();
            var thiz = this;
            for (var i = 0; i < tabs.length; i++) {
                tabs[i].addEventListener('click', function(e){
                    thiz._select(e.currentTarget);
                    e.stopPropagation();
                    e.preventDefault();
                });
            }
            var t = this._content().getElementsByClassName(FILTER_TAG);
            for (var i = 0; i < t.length; i++) {
                if (t[i].tagName == 'INPUT' &&
                    t[i].getAttribute('type') == 'checkbox'){
                    t[i].addEventListener('change', function(e){
                        thiz._refresh();
                    });
                }
            }
        }
        _refresh(){
            this._select(this.element.getElementsByClassName(ACTIVE)[0].getElementsByTagName('a')[0]);
        }
        _resetSelected(){
            //this.selectedTags.clear();
            var tabs = this._tabs();
            for (var i = 0; i < tabs.length; i++){
                tabs[i].parentElement.classList.toggle(ACTIVE, false);
                tabs[i].setAttribute('aria-selected', 'false');
            }
        }
        _hasFilterable(list){
            if (!list) return false
            for (var i = 0; i < list.length; i++){
                if (list[i] instanceof Element &&
                    (list[i].classList.contains(FILTERABLE) || list[i].classList.contains(FILTER_TAG))
                ) return true;
            }
            return false;
        }
        _hideAll(){
            var filterables = this._filterables();
            for (var i = 0; i < filterables.length; i++)
                filterables[i].classList.toggle(HIDDEN, true);
        }
        /**
         * Watch for changes to DOM and re-filter/re-build as needed.
         */
        _watch(){
            // childList and attributes must be used in conjunction with subtree
            var config = {childList: true, attributes: false, subtree: true};
            var thiz = this;
            var callback = function(mutationsList) {
                var shouldRefresh = false;
                for(var mutation of mutationsList) {
                    if (mutation.type == 'childList') {
                        if (thiz._hasFilterable(mutation.addedNodes) ||
                            thiz._hasFilterable(mutation.removedNodes)){
                            shouldRefresh = true; break;
                        //} else if (mutation.type == 'attributes') {
                        }
                    }
                }
                if (shouldRefresh) thiz._build();
            };
            this.observer = new MutationObserver(callback);
            this.observer.observe(this.element.nextElementSibling, config);
        }
        _select(tab){
            this._resetSelected();
            var tagId = tab.getAttribute('href').substring(1);
            //this.selectedTags = new Set();
            //this.selectedTags.add(tagId);
            var parent = tab.parentElement;
            parent.classList.toggle(ACTIVE, true);
            tab.setAttribute('aria-selected', 'true');

            var filterables = this._filterables();
            for (var i = 0; i < filterables.length; i++) {
                filterables[i].classList.toggle(HIDDEN, !this._hasTag(filterables[i], tagId));
            }
        }
        _hasTag(filterable, tagId){
            if (tagId == ALL_TAG) return true;
            var tags = filterable.getElementsByClassName(FILTER_TAG);
            for (var t = 0; t < tags.length; t++){
                if (tags[t].innerHTML == tagId || tags[t].getAttribute(TAG_VALUE) == tagId){
                    return (tags[t].tagName == 'INPUT') ? tags[t].checked : true;
                }
            }
            return false;
        }
        disconnect(){
            if (this.observer) this.observer.disconnect();
        }
        connect(){
            // this state would need to go on the element itself to survive turbolinks.
            //this.selectedTags = new Set();
            //this.selectableTags = new Set();

            this._build();

            if (this.element.getAttribute(WATCH) == 'true') this._watch();
        }
    })
})();
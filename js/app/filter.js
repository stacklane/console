/**
 * TODO static/ever-present tabs
 * TODO remember last tab selection in a local/session storage, by current path and ID of content
 *      retain tab selection on page re-visits.
 */
(function () {
    'use strict';

    const ACTIVE = "is-active";
    const FILTERABLE = "is-filterable";
    const FILTER_TAG = "is-filter-tag";
    const FILTER_CONTENT_ID = "data-filter-content";
    const WATCH = "data-filter-watch";

    App.register("filter", class extends Stimulus.Controller {
        _filterables(){
            return this._content().getElementsByClassName(FILTERABLE);
        }
        _tabs(){
            return this.element.getElementsByTagName('a');
        }
        _altDisplay(){
            var altDisplays = {};
            var alt = this.element.getElementsByClassName('is-filter-display');
            for (var i = 0; i < alt.length; i++) altDisplays[alt[i].getAttribute('data-for')] = alt[i].innerHTML;
            return altDisplays;
        }
        _content(){
            return document.getElementById(this.element.getAttribute(FILTER_CONTENT_ID).substring(1));
        }
        _filterableTags(){
            var out = new Set();
            var t = this._content().getElementsByClassName(FILTER_TAG);
            for (var i = 0; i < t.length; i++) out.add(t[i].innerHTML);
            return out;
        }
        _build(){
            var newTags = this._filterableTags();

            // If it's a preview, then it's already been built.
            var rebuild = !document.documentElement.hasAttribute("data-turbolinks-preview");

            if (rebuild) {
                var html = "<ul>";
                var alt = this._altDisplay();
                newTags.forEach(function(v){
                    var display = alt[v];
                    if (!display) display = v;
                    html += "<li><a data-turbolinks='false' href='#" + v + "'>" + display + "</a></li>";
                }, this);
                html+="</ul>";

                this.element.innerHTML = html;

                //this.selectableTags = newTags;

                var tabs = this._tabs();

                this.element.classList.toggle('is-invisible', tabs.length == 0);

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
                filterables[i].classList.toggle(ACTIVE, false);
        }
        /**
         * Watch for changes to DOM and re-filter/re-build as needed.
         */
        _watch(){
            // childList and attributes must be used in conjunction with subtree
            var config = {childList: true, /*attributes: true,*/ subtree: true};
            var thiz = this;
            var callback = function(mutationsList) {
                var shouldRefresh = false;
                for(var mutation of mutationsList) {
                    if (mutation.type == 'childList') {
                        if (thiz._hasFilterable(mutation.addedNodes) ||
                            thiz._hasFilterable(mutation.removedNodes)){
                            shouldRefresh = true; break;
                        }
                        /* } else if (mutation.type == 'attributes') {
                        if (mutation.attributeName == 'data-tab-filter') {
                            shouldRefresh = true; break;
                        }*/
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
                var tags = filterables[i].getElementsByClassName(FILTER_TAG);
                var visible = false;
                for (var t = 0; t < tags.length; t++){
                   if (tags[t].innerHTML == tagId){
                       visible = true; break;
                   }
                }
                filterables[i].classList.toggle(ACTIVE, visible);
            }
        }
        disconnect(){
            if (this.observer) this.observer.disconnect();
        }
        connect(){
            // this state would need to go on the element itself to survive turbolinks.
            //this.selectedTags = new Set();
            //this.selectableTags = new Set();

            this._build();

            if (this.element.hasAttribute(WATCH) == 'true') this._watch();
        }
    })
})();
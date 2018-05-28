/**
 * Hybrid of Bulma (for tabs) and Boostrap (for panes) structure.
 *
 * Bulma has no pane concept.
 *
 * Auto-adds: 'role', 'aria-selected', 'aria-controls', 'data-turbolinks'
 *
 * http://accessibility.athena-ict.com/aria/examples/tabpanel2.shtml
 */
(function () {
    'use strict';
    App.register("tabs", class extends Stimulus.Controller {
        _panes(){
            return this.element.nextElementSibling.getElementsByClassName('tab-pane');
        }
        _filterables(){
            return this.element.nextElementSibling.getElementsByClassName('is-filterable');
        }
        _tabs(){
            return this.element.getElementsByTagName('a');
        }
        _isFiltering(){
            return this.element.getAttribute("data-tab-type") == 'filter';
        }
        _reset(){
            var tabs = this._tabs();
            for (var i = 0; i < tabs.length; i++){
                tabs[i].parentElement.classList.remove('is-active');
                tabs[i].setAttribute('aria-selected', 'false');
            }
            if (!this._isFiltering()){
                var panes = this._panes();
                for (var i = 0; i < panes.length; i++) {
                    panes[i].classList.remove('show');
                    panes[i].classList.remove('is-active');
                }
            }
        }
        _hasFilterable(list){
            if (!list) return false
            for (var i = 0; i < list.length; i++){
                if (list[i] instanceof Element && list[i].classList.contains('is-filterable')){
                    return true;
                }
            }
            return false;
        }
        /**
         * Watch for changes to dom and re-filter as needed.
         */
        _watch(){
            // childList and attributes must be used in conjunction with subtree
            var config = { childList: true, attributes: true, subtree: true };
            var thiz = this;
            var callback = function(mutationsList) {
                var shouldRefresh = false;
                for(var mutation of mutationsList) {
                    if (mutation.type == 'childList') {
                        if (thiz._hasFilterable(mutation.addedNodes) ||
                            thiz._hasFilterable(mutation.removedNodes)){
                            shouldRefresh = true; break;
                        }
                    } else if (mutation.type == 'attributes') {
                        if (mutation.attributeName == 'data-tab-filter') {
                            shouldRefresh = true; break;
                        }
                    }
                }
                if (shouldRefresh) thiz._reselect();
            };
            this.observer = new MutationObserver(callback);
            this.observer.observe(this.element.nextElementSibling, config);
        }
        _reselect(){
            this._select(this.element.getElementsByClassName('is-active')[0].getElementsByTagName('a')[0]);
        }
        _select(tab){
            this._reset();
            var paneId = tab.getAttribute('href').substring(1);
            tab.parentElement.classList.add('is-active');
            tab.setAttribute('aria-selected', 'true');
            if (this._isFiltering()) {
                var filterables = this._filterables();
                for (var i = 0; i < filterables.length; i++) {
                    var filters = filterables[i].getAttribute('data-tab-filter');
                    var visible = filters.indexOf(paneId + ';') > -1;
                    filterables[i].classList.toggle('is-visible', visible);
                }
            } else {
                var pane = document.getElementById(paneId);
                pane.classList.add('show');
                pane.classList.add('is-active');
            }
        }
        disconnect(){
            if (this.observer) this.observer.disconnect();
        }
        connect(){
            if (!this.element.nextElementSibling.classList.contains('tab-content')){
                throw new Error("expected next sibling to be 'tab-content'");
            }

            this.element.setAttribute('role', 'tablist');

            var tabs = this._tabs();
            var activeIndex = -1;
            var filtering = this._isFiltering();

            if (filtering) {
                this._watch();
            } else {
                var panes = this._panes();
                for (var i = 0; i < panes.length; i++) panes[i].setAttribute('role', 'tabpanel');
            }

            var thiz = this;

            for (var i = 0; i < tabs.length; i++) {
                var tab = tabs[i];

                tab.setAttribute('role', 'tab');
                tab.setAttribute('data-turbolinks', 'false');

                if (tab.parentElement.classList.contains('is-active')) activeIndex = i;

                if (!filtering) {
                    var paneId = tab.getAttribute('href').substring(1);
                    tab.setAttribute('aria-controls', paneId);
                }

                tab.addEventListener('click', function(e){
                    thiz._select(e.currentTarget);
                    e.stopPropagation();
                    e.preventDefault();
                });
            }

            if (activeIndex == -1) {
                this._select(tabs[0]);
            } else if (filtering){
                this._select(tabs[activeIndex]);
            }
        }
    })
})();
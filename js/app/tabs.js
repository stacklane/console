/**
 * Hybrid of Bulma (for tabs) and Boostrap (for panes) structure.
 *
 * This requires a 'tab-content' as the next sibling after the tabs.
 *
 * Auto-adds: 'role', 'aria-selected', 'aria-controls', 'data-turbolinks'
 *
 * http://accessibility.athena-ict.com/aria/examples/tabpanel2.shtml
 *
 * Use data-tabs-remember="[KEY]" if the last selected tab should be remembered + re-selected.
 */
(function () {
    'use strict';

    const ACTIVE = "is-active";

    App.register("tabs", class extends Stimulus.Controller {
        _panes(){
            return this.element.nextElementSibling.getElementsByClassName('tab-pane');
        }
        _tabs(){
            return this.element.getElementsByTagName('a');
        }
        _reset(){
            var tabs = this._tabs();
            for (var i = 0; i < tabs.length; i++){
                tabs[i].parentElement.classList.toggle(ACTIVE, false);
                tabs[i].setAttribute('aria-selected', 'false');
            }
            var panes = this._panes();
            for (var i = 0; i < panes.length; i++) {
                panes[i].classList.toggle(ACTIVE, false);
            }
        }
        _select(tab){
            this._reset();
            var paneId = tab.getAttribute('href').substring(1);
            var parent = tab.parentElement;
            parent.classList.toggle(ACTIVE, true);
            tab.setAttribute('aria-selected', 'true');
            var pane = document.getElementById(paneId);
            pane.classList.toggle(ACTIVE, true);

            if (this.data.get('remember')){
                localStorage.setItem('tabs-remember-' + this.data.get('remember'), tab.id);
            }
        }
        connect(){
            if (!this.element.nextElementSibling.classList.contains('tab-content')){
                throw new Error("expected next sibling to be 'tab-content'");
            }

            this.element.setAttribute('role', 'tablist');

            var tabs = this._tabs();
            var activeIndex = -1;

            var panes = this._panes();
            for (var i = 0; i < panes.length; i++) panes[i].setAttribute('role', 'tabpanel');

            var thiz = this;

            for (var i = 0; i < tabs.length; i++) {
                var tab = tabs[i];

                tab.setAttribute('role', 'tab');
                tab.setAttribute('data-turbolinks', 'false');

                if (tab.parentElement.classList.contains(ACTIVE)) activeIndex = i;

                var paneId = tab.getAttribute('href').substring(1);
                tab.setAttribute('aria-controls', paneId);

                tab.addEventListener('click', function(e){
                    thiz._select(e.currentTarget);
                    e.stopPropagation();
                    e.preventDefault();
                });
            }

            if (this.data.get('remember')){
                var value = localStorage.getItem('tabs-remember-' + this.data.get('remember'));
                var tab = document.getElementById(value);
                if (tab){ // Tab may have been renamed or deleted
                    this._select(tab);
                    return;
                } // Otherwise fall through
            }

            if (activeIndex == -1) {
                this._select(tabs[0]);
            }
        }
    })
})();
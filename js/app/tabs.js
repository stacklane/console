/**
 * For standard Bootstrap tab/nav CSS structure and classes.
 *
 * Auto-adds: 'role', 'aria-selected', 'aria-controls', 'data-turbolinks'
 */
(function () {
    'use strict';
    App.register("tabs", class extends Stimulus.Controller {
        _reset(){
            var tabs = this.element.getElementsByClassName('nav-link');
            for (var i = 0; i < tabs.length; i++){
                tabs[i].classList.remove('active');
                tabs[i].setAttribute('aria-selected', 'false');
            }
            var panes = this.element.nextElementSibling.getElementsByClassName('tab-pane');
            for (var i = 0; i < panes.length; i++){
                panes[i].classList.remove('show');
                panes[i].classList.remove('active');
            }
        }
        _select(tab){
            this._reset();
            var paneId = tab.getAttribute('href').substring(1);
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            var pane = document.getElementById(paneId);
            pane.classList.add('show');
            pane.classList.add('active');
        }
        connect(){
            this.element.setAttribute('role', 'tablist');
            var thiz = this;
            var tabs = this.element.getElementsByClassName('nav-link');
            var hasActive = false;
            for (var i = 0; i < tabs.length; i++){
                var tab = tabs[i];
                tab.setAttribute('role', 'tab');
                tab.setAttribute('data-turbolinks', 'false');
                var paneId = tab.getAttribute('href').substring(1);
                tab.setAttribute('aria-controls', paneId);
                if (tab.classList.contains('active')) hasActive = true;
                tab.addEventListener('click', function(e){
                    //thiz._select(tab);
                    thiz._select(e.currentTarget);
                    e.stopPropagation();
                    e.preventDefault();
                });
            }
            if (!hasActive) this._select(tabs[0]);
            var panes = this.element.nextElementSibling.getElementsByClassName('tab-pane');
            for (var i = 0; i < panes.length; i++){
                panes[i].setAttribute('role', 'tabpanel');
            }
        }
    })
})();
/**
 * For the standard Bootstrap dropdown CSS structure and classes.
 */
(function () {
    'use strict';
    app.register("dropdown", class extends Stimulus.Controller {
        _menu(){
            return this.element.getElementsByClassName('dropdown-menu')[0];
        }
        connect(){
            var toggle = this.element.getElementsByClassName('dropdown-toggle')[0];
            toggle.setAttribute('data-turbolinks', 'false');
        }
        toggle(evt){
            evt.preventDefault();
            evt.stopPropagation();
            this.element.classList.toggle('dropped');
            this._menu().classList.toggle('show');
        }
    })
})();
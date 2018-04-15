/**
 * For the standard Bootstrap dropdown CSS structure.
 */
(function () {
    app.register("dropdown", class extends Stimulus.Controller {
        _menu(){
            return this.element.getElementsByClassName('dropdown-menu')[0];
        }
        toggle(evt){
            evt.stopPropagation();
            this.element.classList.toggle('dropped');
            this._menu().classList.toggle('show');
        }
    })
})();
/**
 * For standard Bulma CSS structure:
 *
 * https://bulma.io/documentation/elements/tag/
 *
 * <span data-controller="badge" class="tag">..</span>
 *
 * (optional) data-value="success/primary/etc" -- otherwise innerText
 * (optional) data-success="somevalue" -- IF the value is X, THEN 'success', etc.
 */
(()=>{
    'use strict';
    const TYPES = ['success', 'primary', 'dark', 'success', 'danger', 'info', 'warning'];
    const COMMON = {'enabled':'success', 'active':'success'};
    const DEF = 'dark';
    App.register("badge", class extends Stimulus.Controller {
        connect(){this._update();}
        _update(){
            var e = this.element;
            var value = e.getAttribute('data-value');
            if (!value) value = e.innerText.trim(); // Fallback value
            for (var i = 0; i < TYPES.length; i++) {
                var defined = e.getAttribute('data-' + TYPES[i]);
                if (defined && value == defined) {
                    this.element.className = 'tag is-' + TYPES[i];
                    return;
                }
            }
            var common = COMMON[value];
            if (common){
                this.element.className = 'tag is-' + common;
            } else {
                this.element.className = 'tag is-' + DEF;
            }
        }
    })
})();
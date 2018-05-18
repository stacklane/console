/**
 * For standard Bootstrap badge CSS structure:
 *
 * https://getbootstrap.com/docs/4.0/components/badge/
 *
 * <span data-controller="badge" class="badge">..</span>
 *
 * (optional) data-value="success/primary/etc" -- otherwise innerText
 * (optional) data-success="somevalue" -- if the value is X, then 'success', etc.
 */
(function () {
    'use strict';
    const TYPES = ['success', 'primary', 'secondary', 'success', 'danger', 'info', 'warning'];
    const COMMON = {'enabled':'success', 'active':'success'};
    const DEF = 'secondary';
    App.register("badge", class extends Stimulus.Controller {
        connect(){this._update();}
        _update(){
            var e = this.element;
            var value = e.getAttribute('data-value');
            if (!value) value = e.innerText.trim(); // Fallback value
            for (var i = 0; i < TYPES.length; i++) {
                var defined = e.getAttribute('data-' + TYPES[i]);
                if (!defined) defined = COMMON[value];
                if (value == defined) {
                    this.element.className = 'badge badge-' + TYPES[i];
                    return;
                }
            }
            this.element.className = 'badge badge-' + DEF;
        }
    })
})();
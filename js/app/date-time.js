/**
 * <span data-controller="date-seconds" data-date-seconds-value="..">..</span>
 */
(function () {
    'use strict';
    App.register("date-seconds", class extends Stimulus.Controller {
        connect(){this._update();}
        _update(){
            var e = this.element;
            var value = this.data.get('value');

            if (!value) {
                e.classList.toggle('is-hidden', true);
                return;
            }

            e.classList.toggle('is-hidden', false);

            e.innerText = new Date(parseInt(value) * 1000).toLocaleDateString();
        }
    })
})();
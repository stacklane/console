/**
 * Various formatting/conversion/display utilities
 */
(function () {
    'use strict';
    /**
     * <span data-controller="date-seconds" data-date-seconds-value="..">..</span>
     */
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

    const DEFAULT_CURRENCY = "USD";
    App.register("currency", class extends Stimulus.Controller {
        connect() {
            var e = this.element;
            var val = this.data.get('value');
            if (!val || val.length == 0) val = e.innerText.trim();

            if (!val || val.length == 0) {
                e.classList.toggle('is-hidden', true);
                return;
            }

            var currency = this.data.get('code');
            if (!currency) currency = DEFAULT_CURRENCY;

            e.classList.toggle('is-hidden', false);

            try {
                var str = parseFloat(val).toLocaleString(
                    undefined /* use host */, {style:'currency', currency:currency, minimumFractionDigits: 0}
                );
                if (this.data.get('symbol-class')){
                    // TBD
                    e.innerHTML = str.replace('$', '<span class="' + this.data.get('symbol-class') + '">$</span>');
                } else {
                    e.innerText = str;
                }
            } catch (e) {
                e.classList.toggle('is-hidden', true);
                console.error(e);
            }
        }
    })
})();
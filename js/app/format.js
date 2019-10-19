/**
 * Various formatting/conversion/display utilities.
 *
 * Value may be an attribute, or within the element's body.
 */
(()=>{
    'use strict';

    const HIDE = function(ctrl){
        ctrl.element.classList.toggle('is-hidden', true);
    };

    const VAL = function(ctrl){
        var val = ctrl.data.get('value');
        if (!val || val.length == 0) val = ctrl.element.innerText.trim();

        if (!val || val.length == 0) {
            HIDE(ctrl);
            return undefined;
        }

        ctrl.element.classList.toggle('is-hidden', false);

        return val;
    };

    App.register("percent", class extends Stimulus.Controller {
        connect() {
            let val = VAL(this); if (!val) return;
            let e = this.element;

            try {
                let v = parseFloat(val);
                // CSS attribute targets:
                if (v == 0) e.setAttribute('data-percent-direction', 'even');
                else if (v > 0) e.setAttribute('data-percent-direction', 'up');
                else if (v < 0) e.setAttribute('data-percent-direction', 'down');
                let str = v.toLocaleString(); // all defaults
                e.innerText = str + '%'; // TODO formatting other locales
            } catch (e) {
                console.warn(e);
            }
        }
    });

    /**
     * <span data-controller="date-seconds" data-date-seconds-value="..">..</span>
     */
    App.register("date-seconds", class extends Stimulus.Controller {
        connect(){
            let val = VAL(this); if (!val) return;
            this.element.innerText = new Date(parseInt(val) * 1000).toLocaleDateString();
        }
    });

    App.register("number", class extends Stimulus.Controller {
        connect() {
            let val = VAL(this); if (!val) return;
            let e = this.element;

            try {
                let str = parseFloat(val).toLocaleString(); // all defaults
                e.innerText = str;
            } catch (e) {
                console.warn(e);
            }
        }
    });

    const DEFAULT_CURRENCY = "USD";
    App.register("currency", class extends Stimulus.Controller {
        connect() {
            let val = VAL(this); if (!val) return;

            let currency = this.data.get('code');
            if (!currency) currency = DEFAULT_CURRENCY;

            let e = this.element;

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
                HIDE(this);
                console.error(e);
            }
        }
    });
})();
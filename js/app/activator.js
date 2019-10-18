/**
 * Generic utilities around managing the is-active class.
 *
 * data-controller="activator"
 * data-activator-mode
 * .is-activator
 * .is-deactivator
 */
(()=>{
    'use strict';

    App.register("activator", class extends Stimulus.Controller {
        connect(){
            let thiz = this.element;

            let mode = this.data.get('mode') ? this.data.get('mode') : 'this';
            let deactivate = this.data.get('deactivate');

            thiz.querySelectorAll('.is-deactivator').forEach((deactivator)=>{
                deactivator.addEventListener('click', (evt)=> {
                    let c = deactivator.closest('[data-controller="activator"]');
                    if (c) c.classList.toggle('is-active', false);
                });
            });

            thiz.querySelectorAll('.is-activator').forEach((activator)=>{
                activator.addEventListener('click', (evt)=>{
                    // Clicking a nested <a> should not implicitly deactivate auto-toggle (see is-deactivator)
                    if (!evt.target.isSameNode(activator) && evt.target.nodeName == 'A') return;

                    let activated = null;

                    if (mode == 'this') activated = thiz;
                    else if (mode == 'target') activated = activator;
                    else return;

                    activated.classList.toggle('is-active'); // An is-activator toggles

                    if (deactivate) {
                        if (mode == 'this') {
                            if (deactivate.startsWith('.')) {
                                document.querySelectorAll('[data-controller="activator"].is-active' + deactivate).forEach((e) => {
                                    if (!e.isEqualNode(activated)) e.classList.toggle('is-active', false);
                                });
                            }
                        } else if (mode =='target'){
                            if (deactivate == 'others'){
                                thiz.querySelectorAll('.is-activator.is-active').forEach((e) => {
                                    if (!e.isEqualNode(activated)) e.classList.toggle('is-active', false);
                                });
                            }
                        }
                    }
                });
            });
        }
    })
})();
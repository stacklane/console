/**
 * For standard Bulma CSS structure.
 */
(()=>{
    'use strict';

    App.register("dropdown", class extends Stimulus.Controller {
        connect(){
            var dropdown = this.element;
            var link = dropdown.querySelector('.navbar-link');
            link.addEventListener('click', function(){ dropdown.classList.toggle('is-active'); });
        }
    })
})();
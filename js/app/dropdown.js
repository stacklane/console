/**
 * Use .is-dropdown-activator to manage the toggle of .is-active on the element this controller is attached to.
 */
(()=>{
    'use strict';
    App.register("dropdown", class extends Stimulus.Controller {
        connect(){
            let dropdown = this.element;
            let link = dropdown.querySelector('.is-dropdown-activator');
            link.addEventListener('click', ()=>{
                dropdown.classList.toggle('is-active');
                // Remove any others which are currently open:
                document.querySelectorAll('.has-dropdown.is-active').forEach((e)=>{
                   if (!e.isEqualNode(dropdown)) e.classList.toggle('is-active', false);
                });
            });
        }
    })
})();
(()=>{
    'use strict';

    App.register("modal", class extends Stimulus.Controller {
        connect(){
            let modal = document.getElementById(this.data.get('id'));

            let hide = modal.getElementsByClassName('is-modal-hide');
            for (let i = 0; i < hide.length; i++){
                hide[i].addEventListener('click', (evt)=>{
                    evt.preventDefault(); evt.stopPropagation();
                    modal.classList.toggle('is-active', false);
                });
            }

            let save = modal.getElementsByClassName('is-modal-save');
            if (save.length == 1){
                modal.getElementsByTagName('form')[0].addEventListener('submit', (evt)=>{
                    save[0].classList.toggle('is-loading', true);
                });
            }
        }
        show(evt){
            evt.preventDefault(); evt.stopPropagation();
            let modal = document.getElementById(this.data.get('id'));
            modal.classList.toggle('is-active', true);
        }
    })
})();
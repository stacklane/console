(function () {
    'use strict';
    App.register("project-instance", class extends Stimulus.Controller {
        //static get targets() {
        //    return [ "star", "title" ];
        //}
        connect(){

        }
        delete(event){
            event.preventDefault();

            if (!confirm('Delete this project instance?')) return;

            var thiz = this;

            thiz.element.classList.toggle('is-hiding', true);

            fetch('/api/instances/' + this.data.get('id'), {
                method: 'DELETE',
                credentials: 'same-origin', mode: 'same-origin',
                //body: data,
                headers:{ Accept: 'application/json' }
            }).then(function (response) {
                if (response.status != 200) {
                    thiz.element.classList.toggle('is-hiding', false);
                    Messages.error('Unable to delete', response);
                } else {
                    response.json().then(function(j){
                        thiz.element.remove();
                    });
                }
            }).catch(function (ex) {
                thiz.element.classList.toggle('is-hiding', false);
                Messages.error('Unable to delete' + ' [' + ex.message + ']', ex);
            });
        }
    });
})();
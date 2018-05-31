(function () {
    'use strict';
    App.register("project-user", class extends Stimulus.Controller {
        static get targets() {
            return [ "star" ];
        }
        connect(){

        }
        changeStar(){
            var data = new FormData();
            data.append('star', this.starTarget.checked ? 'true' : 'false');

            fetch('/api/projects/' + this.data.get('project') + '/UpdateUser', {
                method: 'POST',
                credentials: 'same-origin', mode: 'same-origin',
                body: data,
                headers:{ Accept: 'application/json' }
            }).then(function (response) {
                if (response.status != 200) Messages.error('Unable to update favorite setting', response);
            }).catch(function (ex) {
                Messages.error('Unable to update favorite setting: ' + ex.message, ex);
            });
        }
    });
})();
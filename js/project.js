(function () {
    'use strict';
    App.register("project", class extends Stimulus.Controller {
        static get targets() {
            return [ "star", "title" ];
        }
        connect(){

        }
        changeTitle(event){
            event.preventDefault();
            var data = new FormData();
            data.append('title', this.titleTarget.value);
            var thiz = this;
            this.titleTarget.blur();
            this._changeOneField(data, 'title', function(json){
                thiz.titleTarget.value = json.name;
            });
        }
        changeStar(){
            var data = new FormData();
            data.append('star', this.starTarget.checked ? 'true' : 'false');
            this._changeOneField(data, 'favorite setting');
        }
        _changeOneField(data, settingName, responseHandler) {
            fetch('/api/projects/' + this.data.get('id') + '/user', {
                method: 'POST',
                credentials: 'same-origin', mode: 'same-origin',
                body: data,
                headers:{ Accept: 'application/json' }
            }).then(function (response) {
                if (response.status != 200) {
                    Messages.error('Unable to update ' + settingName, response);
                } else {
                    if (responseHandler) {
                        response.json().then(function(j){
                           responseHandler(j);
                        });
                    }
                }
            }).catch(function (ex) {
                Messages.error('Unable to update ' + settingName + ' [' + ex.message + ']', ex);
            });
        }
        delete(event){
            event.preventDefault();

            if (!confirm('Delete this Project?')) return;

            var thiz = this;

            thiz.element.classList.toggle('is-hiding', true);

            fetch('/api/projects/' + this.data.get('id') + '/user', {
                method: 'DELETE',
                credentials: 'same-origin', mode: 'same-origin',
                //body: data,
                headers:{ Accept: 'application/json' }
            }).then(function (response) {
                if (response.status != 200) {
                    thiz.element.classList.toggle('is-hiding', false);
                    Messages.error('Unable to delete [' + response.status + ']', response);
                } else {
                    response.json().then(function(j){
                        thiz.element.remove();

                        /**
                         * TODO extract because this is general approach for ajax
                         */
                        Messages.post(j);
                        if (j.redirect) Turbolinks.visit(j.redirect, {action: 'replace'});
                        Turbolinks.clearCache();
                    });
                }
            }).catch(function (ex) {
                thiz.element.classList.toggle('is-hiding', false);
                Messages.error('Unable to delete' + ' [' + ex.message + ']', ex);
            });
        }
    });
})();
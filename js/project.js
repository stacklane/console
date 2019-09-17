(()=>{
    'use strict';
    App.register("project", class extends Stimulus.Controller {
        static get targets() {
            return [ "star" ];
        }
        connect(){

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
    });
})();
/**
 * Utility goes on a <form>
 *
 * - data-validate -- Use JS/boostrap validation
 * - data-ajax -- Submit using ajax
 *
 * If needed, fetch polyfill https://github.com/github/fetch
 *
 * Considers setCustomValidity to be for server side.
 */
(function () {
    'use strict';
    const SUBMITTED = "submitted";
    const SR_PROCESSING = "Processing";

    app.register("form", class extends Stimulus.Controller {
        isAjax(){ return this.element.getAttribute('data-ajax') == 'true' ; }
        isValidate(){ return this.element.getAttribute('data-validate') == 'true'; }

        //https://getbootstrap.com/docs/4.0/components/forms/#disabled-forms
        disable() {
            var f = this.element.getElementsByTagName('fieldset');
            for (var i = 0; i < f.length; i++) f[i].setAttribute('disabled', 'disabled');
        }

        enable(){
            this.element.classList.remove(SUBMITTED);
            var f = this.element.getElementsByTagName('fieldset');
            for (var i = 0; i < f.length; i++) f[i].removeAttribute('disabled');
        }

        connect(){
            if (this.element.tagName != 'FORM') throw new Error("Expected controller on <form>");

            if (this.isValidate()) {
                // Disable, because we are controlling it via JS here
                this.element.setAttribute("novalidate", "novalidate");
            }

            this._addProgress();

            var thiz = this;

            var inputs = this.element.getElementsByTagName('input');
            for (var i = 0; i < inputs.length; i++){
                var input = inputs[i];
                input.addEventListener('input', function(e){
                    // For initial form input, everything would be valid.
                    // In that case, wait until they submit the form to check validity.
                    // In other words, this logic is for after the first time a form has been submitted.
                    if (input.validity.customError) {
                        input.setCustomValidity(''); // For server side
                        //input.checkValidity(); // Reset pseudo classes TODO is this necessary?
                    }
                });
            }

            this.element.addEventListener('submit', function(event){
                var submitting = true;

                thiz._resetValidation();

                if (thiz.isValidate()) {
                    //if (thiz.element.checkValidity() === false) {
                    if (thiz.element.reportValidity() === false){
                        // We're using a combo of browser validity, with some Bootstrap classes.
                        // Browser validity (via reportValidity) is to show the messages in a native way,
                        // AND for use of setCustomValidity
                        event.preventDefault();
                        event.stopPropagation();
                        submitting = false;
                    }
                    // See: https://getbootstrap.com/docs/4.1/components/forms/#custom-styles
                    thiz.element.classList.add('was-validated');
                }

                if (submitting){
                    var formData = new FormData(thiz.element); // must occur before disabling form.
                    thiz.element.classList.add(SUBMITTED);
                    thiz.disable();
                    thiz._notify(event.currentTarget);

                    if (thiz.isAjax()) {
                        event.preventDefault();
                        event.stopPropagation();
                        thiz._submitAjax(formData);
                    }
                }
            }, false);
        }

        _addProgress(){
            var b = this.element.getElementsByTagName('button');
            for (var i = 0; i < b.length; i++){
                if (b[i].getAttribute('type') == 'submit'){
                    b[i].innerHTML += '<div class="form-processing"><div></div><div></div><div></div><div></div><span class="sr-only">' + SR_PROCESSING + '</span></div></div>';
                    break;
                }
            }
        }

        _notify(target){
            if (typeof this.element.getAttribute('data-message-info') === 'string'){
                var detail = {info: this.element.getAttribute('data-message-info'),
                            track: this.element.getAttribute('data-message-info-track') == 'true'};
                window.notify(detail);
            }
        }

        _resetValidation(){
            var inputs = this.element.getElementsByTagName('input');
            for (var i = 0; i < inputs.length; i++) inputs[i].setCustomValidity('');
        }

        /**
         * {field:'x', error:'y'}
         */
        _fieldMsg(msg){
            var inputs = this.element.getElementsByTagName('input');
            for (var i = 0; i < inputs.length; i++) {
                if (msg.field == inputs[i].getAttribute('name')) {
                    if (typeof msg.error === 'string') {
                        inputs[i].setCustomValidity(msg.error);
                    } else {
                        inputs[i].setCustomValidity(msg.field);
                    }
                }
            }
            this.enable();
            this.element.reportValidity();
        }

        _handleMsg(msg){
            (msg.field) ? this._fieldMsg(msg) : window.postMessage(msg);
        }

        _handleJSON(json){
            if (json.messages) {
                for (var i = 0; i < json.messages.length; i++) this._handleMsg(json.messages[i]); // Many
            } else {
                this._handleMsg(json); // One
            }

            if (json.redirect) {
                var enabled = typeof Turbolinks !== 'undefined' && Turbolinks.supported && thiz.element.getAttribute('data-turbolinks') != 'false';
                if (enabled) {
                    var action = thiz.element.getAttribute('data-turbolinks-action'); // default to 'replace' for post->redirect
                    var clearCache = thiz.element.getAttribute('data-turbolinks-clear-cache') == 'true';
                    if (clearCache) Turbolinks.clearCache();
                    Turbolinks.visit(json.redirect, {action: (action == null ? 'replace' : action)});
                } else {
                    window.location.href = json.redirect;
                }
            }
        }

        _submitAjax(formData){
            var thiz = this;

            fetch(thiz.element.getAttribute('action'), {
                method: thiz.element.getAttribute('method'),
                credentials: 'same-origin',
                mode: 'same-origin',
                body: formData
            }).then(function (response) {

                if (response.status == 403) { // Standard for permissions access issue
                    thiz._handleJSON( {error: 'Not accessible with current permissions'} );
                } else {
                    response.json().then(function (json) {
                        thiz._handleJSON(json);
                    }).catch(function (e) {
                        // JSON parsing error
                        window.notify('Unexpected server response');
                        console.error('Expected JSON response', response);
                    });
                }

            }).catch(function (ex) {
                window.notify({error:'Submission Error: ' + ex.message});
                console.error('Form submit failed', ex);
            });

        }

        /**
         * To submit a form via arbitrary click e.g. a link click.
         */
        submit(event){
            event.preventDefault();
            event.stopPropagation();
            this.element.submit();
        }
    })
})();
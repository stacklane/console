/**
 * Utility goes on a <form>
 *
 * - data-form-validate -- Use JS/bootstrap validation
 * - data-form-ajax -- Submit using ajax
 *
 * If needed, fetch polyfill https://github.com/github/fetch
 *
 * Considers setCustomValidity to be for server side.
 */
(function () {
    'use strict';
    const SUBMITTED = "is-submitted";
    const IS_TARGET = "is-target";

    App.register("form", class extends Stimulus.Controller {
        isAjax(){ return this.element.getAttribute('data-form-ajax') == 'true' ; }
        isValidate(){ return this.element.getAttribute('data-form-validate') == 'true'; }

        disable() {
            this._disable(this.element.getElementsByTagName('input'));
            this._disable(this.element.getElementsByClassName('button'));
            this._disable(this.element.getElementsByTagName('a'));
        }

        _disable(f) {
            for (var i = 0; i < f.length; i++) {
                if (f[i].classList.contains('button')) f[i].classList.add('is-loading');
                f[i].setAttribute('disabled', 'disabled');
            }
        }

        enable(){
            this.element.classList.remove(SUBMITTED);
            this._enable(this.element.getElementsByTagName('input'));
            this._enable(this.element.getElementsByClassName('button'));
            this._enable(this.element.getElementsByTagName('a'));
        }

        _enable(f) {
            for (var i = 0; i < f.length; i++) {
                if (f[i].classList.contains('button')) f[i].classList.remove('is-loading');
                f[i].removeAttribute('disabled');
                f[i].classList.toggle(IS_TARGET, false);
            }
        }

        _submit(event){
            if (event.currentTarget){
                if (event.currentTarget && event.currentTarget.getAttribute('disabled')) return; // Ideally not needed because of proper pointer-events use.
                event.currentTarget.classList.toggle(IS_TARGET, true);
            }

            if (this.element.classList.contains(SUBMITTED)) return;

            var thiz = this;
            var submitting = true;
            var stripeController;
            var isLink = event.currentTarget.tagName == 'A';

            thiz._resetValidation();

            if (thiz.isAjax() || isLink) {
                event.preventDefault();
                //event.stopPropagation();
            }

            if (thiz.isValidate()) {
                if (thiz.element.reportValidity() === false){
                    // We're using a combo of browser validity, with some Bootstrap classes.
                    // Browser validity (via reportValidity) is to show the messages in a native way,
                    // AND for use of setCustomValidity
                    event.preventDefault();
                    //event.stopPropagation();

                    /* TODO why doesn't this work? because it's set after reportValidity?
                    var inputs = thiz.element.getElementsByTagName('input');
                    for (var i = 0; i < inputs.length; i++) {
                        var input = inputs[i];
                        var patternMsg = input.getAttribute('data-pattern-msg');
                        if (patternMsg && input.validity && input.validity.patternMismatch){
                            input.setCustomValidity(patternMsg);
                        }
                    }*/

                    submitting = false;
                }
                // See: https://getbootstrap.com/docs/4.1/components/forms/#custom-styles
                thiz.element.classList.add('was-validated');

                // Stripe validation / tokenization TODO generalize instead of explicit dependency to stripe-card
                if (submitting) {
                    var fields = thiz.element.getElementsByClassName('field');
                    for (var i = 0; i < fields.length; i++) {
                        if (fields[i].getAttribute('data-controller') == 'stripe-card') {
                            stripeController = thiz.application.getControllerForElementAndIdentifier(fields[i], 'stripe-card');
                            break;
                        }
                    }
                }
            }

            if (submitting){
                if (isLink && !thiz.isAjax()){
                    thiz.element.submit();
                } else {
                    var formData = new FormData(thiz.element); // Must be constructed before disabling form.

                    thiz.element.classList.add(SUBMITTED);
                    thiz.disable();
                    //thiz._notify(event.currentTarget);

                    var ajaxSubmit = function () {
                        if (thiz.isAjax()) thiz._submitAjax(formData);
                    };

                    if (stripeController) {
                        stripeController.tokenize(ajaxSubmit, function () {
                            thiz._stayAfterSubmit()
                        }, formData);
                    } else {
                        ajaxSubmit();
                    }
                }
            }
        }

        connect(){
            if (this.element.tagName != 'FORM') throw new Error("Expected controller on <form>");

            if (this.isValidate()) {
                // Disable, because we are controlling it via JS here
                this.element.setAttribute("novalidate", "novalidate");
            }

            var thiz = this;

            if (this.data.get('ctrl')){
                document.body.addEventListener('keydown', function(e){
                    if (thiz.data.get('ctrl') == e.code && e.ctrlKey) {
                        e.preventDefault(); e.stopPropagation();
                        thiz.element.classList.toggle('has-form-ctrl');
                    }
                });
            }

            var inputs = this.element.getElementsByTagName('input');
            for (var i = 0; i < inputs.length; i++){
                var input = inputs[i];
                input.addEventListener('input', function(e){
                    // For initial form input, everything would be valid.
                    // In that case, wait until they submit the form to check validity.
                    // In other words, this logic is for after the first time a form has been submitted.
                    if (input.validity && input.validity.customError) {
                        input.setCustomValidity('');
                        //input.checkValidity(); // Reset pseudo classes TODO is this necessary?
                    }
                });
            }

            this.element.addEventListener('submit', function(event){
                thiz._submit(event);
            }, false);
        }

        /*
        _notify(target){
            if (typeof this.element.getAttribute('data-message-info') === 'string'){
                var detail = {info: this.element.getAttribute('data-message-info'),
                            track: this.element.getAttribute('data-message-info-track') == 'true'};
                Messages.post(detail);
            }
        }*/

        _resetValidation(){
            var inputs = this.element.getElementsByTagName('input');
            for (var i = 0; i < inputs.length; i++) inputs[i].setCustomValidity('');
        }

        /**
         * {field:'x', error:'y'}
         * or newer
         * {field:'x', value:'y'}
         */
        _fieldMsg(msg){
            var inputs = this.element.getElementsByTagName('input');
            for (var i = 0; i < inputs.length; i++) {
                if (msg.field == inputs[i].getAttribute('name')) {
                    if (typeof msg.error === 'string') {
                        inputs[i].setCustomValidity(msg.error);
                    } else if (typeof msg.value === 'string') {
                        inputs[i].setCustomValidity(msg.value);
                    } else {
                        inputs[i].setCustomValidity(msg.field);
                    }
                }
            }
        }

        _handleMsg(msg){
            (msg.field) ? this._fieldMsg(msg) : Messages.post(msg);
        }

        _handleJSON(json){
            Progress.step();

            if (json.messages) {
                for (var i = 0; i < json.messages.length; i++) this._handleMsg(json.messages[i]); // Many
            } else {
                this._handleMsg(json); // One
            }

            if (json.redirect) {
                var path;
                if (typeof json.redirect === 'string'){
                    path = json.redirect;
                } else {
                    path = json.redirect.path;
                    if (json.redirect.messages) {
                        for (var i = 0; i < json.redirect.messages.length; i++)
                            this._handleMsg(json.redirect.messages[i]);
                    }
                }

                var enabled = typeof Turbolinks !== 'undefined' && Turbolinks.supported && this.element.getAttribute('data-turbolinks') != 'false';

                if (enabled) {
                    var action = this.element.getAttribute('data-form-turbolinks-action'); // default to 'replace' for post->redirect

                    var clearCache = this.element.getAttribute('data-form-turbolinks-clear-cache') != 'false';
                    if (clearCache) Turbolinks.clearCache();

                    Turbolinks.visit(path, {action: (action == null ? 'replace' : action)});
                } else {
                    window.location.href = path;
                }

                Progress.step(); // From here waiting on 'turbolinks:request-end', which Progress already handles.
            } else {
                this._stayAfterSubmit();
            }
        }

        _stayAfterSubmit(){
            this.enable();
            this.element.reportValidity();
            Progress.end();
        }

        _submitAjax(formData){
            var thiz = this;

            Progress.optimistic();

            fetch(thiz.element.getAttribute('action'), {
                method: thiz.element.getAttribute('method'),
                credentials: 'same-origin',
                mode: 'same-origin',
                body: formData,
                headers:{
                    Accept: 'application/json' // Ensures that any errors/exceptions are also in JSON
                }
            }).then(function (response) {

                Progress.step();

                if (response.status == 403) { // Standard for permissions access issue
                    Messages.post( {error: 'Not accessible with current permissions'} );
                } else {
                    response.json().then(function (json) {
                        thiz._handleJSON(json);
                    }).catch(function (e) {
                        Progress.end();
                        // JSON parsing error
                        Messages.post('Unexpected server response');
                        console.error('Expected JSON response', response);
                    });
                }

            }).catch(function (ex) {
                Progress.end();
                Messages.post({error:'Submission Error: ' + ex.message});
                console.error('Form submit failed', ex);
            });
        }

        /**
         * To submit a form via arbitrary click e.g. a link click.
         */
        submit(event){
            event.preventDefault();
            event.stopPropagation();
            this._submit(event);
        }
    })
})();
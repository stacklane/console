/**
 * Utility goes on a <form>
 *
 * - data-validate -- Use JS/boostrap validation
 * - data-ajax -- Submit using ajax
 *
 * If needed, fetch polyfill https://github.com/github/fetch
 */
(function () {
    const SUBMITTED = "submitted";
    app.register("form", class extends Stimulus.Controller {
        isAjax(){ return this.element.getAttribute('data-ajax') == 'true'  /*|| this.element.classList.contains('ajax')*/; }
        isValidate(){ return this.element.getAttribute('data-validate') == 'true' /*|| this.element.classList.contains('validate')*/; }

        //https://getbootstrap.com/docs/4.0/components/forms/#disabled-forms
        disable() {
            var f = this.element.getElementsByTagName('fieldset');
            for (var i = 0; i < f.length; i++) f[i].setAttribute('disabled', 'disabled');
        }

        connect(){
            if (this.element.tagName != 'FORM') throw new Error("Expected <form>");

            if (this.isValidate()) {
                this.element.setAttribute("novalidate", "novalidate"); // Turn off browser validation to use JS only
            }

            var thiz = this;

            this.element.addEventListener('submit', function(event) {
                var submitting = true;
                if (thiz.isValidate()) {
                    if (thiz.element.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                        submitting = false;
                    }
                    // See: https://getbootstrap.com/docs/4.1/components/forms/#custom-styles
                    thiz.element.classList.add('was-validated');
                }
                if (submitting){
                    thiz.element.classList.add(SUBMITTED);
                    thiz.disable();
                    thiz._notify(event.target);

                    if (thiz.isAjax()) {
                        event.preventDefault();
                        event.stopPropagation();
                        thiz._submitAjax(event.target);
                    }
                }
            }, false);
        }

        _notify(target){
            if (typeof this.element.getAttribute('data-notification') === 'string'){
                var detail = {message: this.element.getAttribute('data-notification'),
                            track: this.element.getAttribute('data-notification-track') == 'true'};
                document.dispatchEvent(new CustomEvent('notification', {detail: detail}));
            }
        }


        /**
         * Expects the following response form:
         *
         * {
         *   "redirect"
         *   or
         *   "errors":[
         *
         *   ]
         * }
         */
        _submitAjax(target){
            var thiz = this;

            fetch(this.element.getAttribute('action'), {
                method: this.element.getAttribute('method'),
                credentials: 'same-origin',
                body: new FormData(this.element)
            }).then(function(response) {
                return response.json()
            }).then(function(json) {
                if (json.redirect){
                    var replace = thiz.data.get('turbolinksReplace') == 'true';
                    var clearCache = thiz.data.get('turbolinksClearCache') == 'true';
                    var enabled = Turbolinks instanceof object && Turbolinks.supported && thiz.data.get('turbolinks') != 'false';
                    if (enabled){
                        if (clearCache) Turbolinks.clearCache();
                        Turbolinks.visit(json.redirect, {action: (replace ? 'replace' : 'advanced')});
                    } else {
                        window.location.href = json.redirect;
                    }
                } else if (json.errors){
                    console.log(json.errors);
                } else {

                }
            }).catch(function(ex) {
                console.log('form submit failed', ex)
            })
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
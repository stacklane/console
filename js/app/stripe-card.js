/**
 * Designed for use as a .field, and in conjunction with form.js
 */
(()=>{
    'use strict';

    App.register("stripe-card", class extends Stimulus.Controller {
        connect(){
            var pk = this.data.get('pk'); // data-stripe-pk
            this.stripe = Stripe(pk);
            this._mount();
        }
        _errors(){
            return this.element.getElementsByClassName('card-errors')[0];
        }
        tokenize(then, cancel, formData){
            var thiz = this;

            var name = document.getElementById(this.data.get('name'));
            var options = {};
            if (name && name.value) options.name = name.value;

            this.stripe.createToken(this.card, options).then(function(result) {
                if (result.error) {
                    // Inform the user if there was an error.
                    thiz._errors().textContent = result.error.message;
                    if (cancel) cancel();
                } else {
                    if (formData){
                        var tokenFormParamName = thiz.data.get('token');
                        formData.append(tokenFormParamName, result.token.id);
                    }
                    if (then) then();
                }
            }).catch(function(e) {
                Messages.error('Card capture error', e);
                if (cancel) cancel();
            });
        }
        _mount(){
            var elements = this.stripe.elements();
            var style={};
            this.card = elements.create('card', {style: style});
            this.card.mount(this.element.getElementsByClassName('card-element')[0]);

            var thiz = this;
            this.card.addEventListener('change', function(event) {
                if (event.error) {
                    thiz._errors().textContent = event.error.message;
                } else {
                    thiz._errors().textContent = '';
                }
            });

            this.element.validator = function(){
                return thiz.stripe.createToken(this.card);
            };
        }
    })
})();
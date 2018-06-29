/**
 * Retrieves HTML and inserts it.
 *
 * Primarily designed to improve perceived load times by breaking up certain pages
 * with potentially slower loading sections into smaller chunks.
 */
(function () {
    'use strict';

    /**
     * A bit like Turbolinks behavior.
     */
    const PREVIEW_CACHE = {};

    App.register("get", class extends Stimulus.Controller {
        connect(){
            this._update();
        }
        _update(){
            var e = this.element;

            if (e.classList.contains('is-loaded')) return; // prevent double loading from stimulus, which seems to be a problem with both connect and initialize.

            var href = e.getAttribute('data-href');

            var cacheKey = window.location.href + href;

            if (PREVIEW_CACHE[cacheKey]){
                e.innerHTML = PREVIEW_CACHE[cacheKey];
            }

            fetch(href, {
                method: 'GET',
                credentials: 'same-origin',
                mode: 'same-origin',
                headers: {
                    Accept: 'text/html'
                }
            }).then(function (response) {
                if (response.status == 403) { // Standard for permissions access issue
                    Messages.post({error: 'Not accessible with current permissions'});
                } else {
                    response.text().then(function (html) {
                        e.innerHTML = html;
                        e.classList.add('is-loaded');
                        PREVIEW_CACHE[cacheKey] = html;
                    }).catch(function (e) {
                        Messages.post({error: 'Unexpected response'});
                    });
                }
            }).catch(function (ex) {
                Messages.post({error: 'Retrieval Error: ' + ex.message});
                console.error('GET failed', ex);
            });
        }
    })
})();
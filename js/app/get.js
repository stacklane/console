/**
 * Async HTML loader.
 *
 * Primarily designed to improve responsiveness by breaking up certain pages
 * with potentially slower loading sections into smaller chunks.
 *
 * Use: <div data-controller="get" data-get-href="list" class="is-loading">Loading</div>
 *
 * For longer terms bits, such as navigation, use data-get-static="true".
 */
(function () {
    'use strict';

    /**
     * A bit like Turbolinks behavior.
     */
    const PREVIEW_CACHE = {};
    const IS_LOADING_CLS = "is-loading";
    const IS_LOADING_QUIET_CLS = "is-loading-quiet";

    App.register("get", class extends Stimulus.Controller {
        connect(){
            this._update();
        }
        _update(){
            var e = this.element;

            if (!e.classList.contains(IS_LOADING_CLS) &&
                !e.classList.contains(IS_LOADING_QUIET_CLS)
            ) return; // prevent double loading from stimulus, which seems to be a problem with both connect and initialize.

            var isStatic = this.data.get('static') == 'true';
            var href = this.data.get('href');
            var cacheKey = "get-" + (href.indexOf('/') == 0 ? href /*abs*/ : window.location.href + href /*rel*/);

            if (isStatic && sessionStorage.getItem(cacheKey)){
                e.innerHTML = sessionStorage.getItem(cacheKey);
                e.classList.remove(IS_LOADING_CLS);
                e.classList.remove(IS_LOADING_QUIET_CLS);
                return;
            } else if (!isStatic && PREVIEW_CACHE[cacheKey]){
                e.innerHTML = PREVIEW_CACHE[cacheKey];
                e.classList.remove(IS_LOADING_CLS);
                e.classList.remove(IS_LOADING_QUIET_CLS);
                // continue below
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
                        e.classList.remove(IS_LOADING_CLS);
                        e.classList.remove(IS_LOADING_QUIET_CLS);
                        if (isStatic){
                            sessionStorage.setItem(cacheKey, html);
                        } else {
                            PREVIEW_CACHE[cacheKey] = html;
                        }
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
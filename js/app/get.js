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

    const LOAD_SWAP = function(existing, newHTML){
        existing.classList.remove(IS_LOADING_CLS);
        newHTML = newHTML.trim(); // ensure no children, so we can detect empty
        existing.innerHTML = newHTML;
    };

    App.register("get", class extends Stimulus.Controller {
        resetCache(){
            var cacheKey = "get-" + (href.indexOf('/') == 0 ? href /*abs*/ : window.location.href + href /*rel*/);
            sessionStorage.removeItem(cacheKey);
            delete PREVIEW_CACHE[cacheKey];
        }
        connect(){
            this._update();
        }
        _update(){
            var e = this.element;

            // prevent double loading from stimulus, which seems to be a problem with both connect and initialize
            if (!e.classList.contains(IS_LOADING_CLS)) return;

            var isStatic = this.data.get('static') == 'true';
            var href = this.data.get('href');
            var cacheKey = "get-" + (href.indexOf('/') == 0 ? href /*abs*/ : window.location.href + href /*rel*/);

            if (isStatic && sessionStorage.getItem(cacheKey)){
                LOAD_SWAP(e, sessionStorage.getItem(cacheKey));
                return; // exit, we do not want to refresh
            } else if (!isStatic && PREVIEW_CACHE[cacheKey]){
                LOAD_SWAP(e, PREVIEW_CACHE[cacheKey]);
                // fall through to refresh contents below
            }

            fetch(href, {
                method: 'GET', credentials: 'same-origin', mode: 'same-origin', headers: { Accept: 'text/html' }
            }).then(function (response) {
                if (response.status == 403) { // Standard for permissions access issue
                    Messages.post({error: 'Not accessible with current permissions'});
                } else {
                    response.text().then(function (html) {
                        LOAD_SWAP(e, html);
                        if (isStatic) sessionStorage.setItem(cacheKey, html);
                        else PREVIEW_CACHE[cacheKey] = html;
                    }).catch(function (ex) {
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
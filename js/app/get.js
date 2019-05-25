/**
 * Async HTML loader.
 *
 * Primarily designed to improve responsiveness by breaking up certain pages
 * with potentially slower loading sections into smaller chunks.
 *
 * Use: <div data-controller="get" data-get-href="list" class="is-loading">Loading</div>
 *
 * For longer term bits, such as navigation, use:
 *
 * {{ Cache-Control-Seconds x }}
 *
 * and take advantage of browser caching.
 *
 * NEAT:
 *
 * https://hacks.mozilla.org/2016/03/referrer-and-cache-control-apis-for-fetch/
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
        if (existing.children.length) {
            /** Becomes a .block if it has children **/
            existing.classList.add('block');
        } else if (newHTML.length == 0) {
            /** Completely removed if empty -- works best for CSS **/
            existing.parentElement.removeChild(existing);
        }
    };

    App.register("get", class extends Stimulus.Controller {
        connect(){
            this._update();
        }
        // Shouldn't be needed with proper use of Cache-Control-Seconds header
        //resetCache(){
        //    var cacheKey = "get-" + (href.indexOf('/') == 0 ? href /*abs*/ : window.location.href + href /*rel*/);
        //    sessionStorage.removeItem(cacheKey);
        //    delete PREVIEW_CACHE[cacheKey];
        //}
        _update(){
            var e = this.element;

            // prevent double loading from stimulus, which seems to be a problem with both connect and initialize
            if (!e.classList.contains(IS_LOADING_CLS)) return;

            var href = this.data.get('href');
            var cacheKey = "get-" + (href.indexOf('/') == 0 ? href /*abs*/ : window.location.href + href /*rel*/);

            if (PREVIEW_CACHE[cacheKey]){
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
                        PREVIEW_CACHE[cacheKey] = html;
                    }).catch(function (ex) {
                        Messages.post({error: 'Unexpected response'});
                        console.error('Unexpected response', ex);
                    });
                }
            }).catch(function (ex) {
                Messages.post({error: 'Retrieval Error: ' + ex.message});
                console.error('GET failed', ex);
            });
        }
    })
})();
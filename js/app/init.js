(function (window) {
    'use strict';
    window.App = Stimulus.Application.start();

    /**
     * Attempt at client-side only nav awareness.
     *
     * https://github.com/turbolinks/turbolinks#installing-javascript-behavior
     *
     * This assumes that each side nav has a unique directory.
     */
    _setActiveNav();
    _setupListeners();

    document.addEventListener('turbolinks:load', function (e) {
       // _setActiveNav();
        _setupListeners();
    });

    document.addEventListener('turbolinks:render', function (e) {
        _setActiveNav();
    });

    /**
     * Select new nav immediately, and de-select others.
     * Provides earliest possible visual indication of the selection.
     */
    function _setupListeners(){
        var a = document.getElementById('sidebar').getElementsByTagName('a');

        for (var i = 0; i < a.length; i++){
            var link = a[i];

            if (link.getAttribute('href').charAt(0) == '/') {
                link.addEventListener('click', function (evt) {
                    var href = evt.currentTarget.getAttribute('href');
                    evt.currentTarget.classList.toggle('is-active', true);

                    // Deselect others:
                    var others = document.getElementById('sidebar').getElementsByTagName('a');
                    for (var o = 0; i < o.length; o++) {
                        if (others[i].href != href) {
                            if (others[i].classList.contains('is-active')){
                                others[i].classList.toggle('is-orig', true);
                            }
                            others[i].classList.toggle('is-active', false);
                        }
                    }
                });
            }
        };
    }

    function _setActiveNav(){
        var a = document.getElementById('sidebar').getElementsByTagName('a');

        for (var i = 0; i < a.length; i++){
            var link = a[i];

            if (window.location.pathname.indexOf(link.getAttribute('href')) == 0){
                link.classList.toggle('is-active', true);
            } else {
                link.classList.toggle('is-active', false);
            }
        };
    }
})(window);
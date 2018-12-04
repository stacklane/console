/**
 * Manages nav and selection in a narrow scenario.
 *
 * Assumes that each nav item and any sub-items are directory based.
 *
 * <nav data-controller="nav"><ul>...
 */
(function () {
    'use strict';

    App.register("nav", class extends Stimulus.Controller {
        connect(){
            var a = this.element.getElementsByTagName('a');

            for (var i = 0; i < a.length; i++){
                /**
                 * Show current selection (and de-select any others)
                 */
                var link = a[i];
                if (link.getAttribute('href').charAt(0) != '/') continue; // abs local links only
                var selected = window.location.pathname.indexOf(link.getAttribute('href')) == 0;
                link.classList.toggle('is-active', selected);

                /**
                 * Immediately respond to next selection, even ahead of upcoming page nav, for more responsiveness
                 */
                link.addEventListener('click', function (evt) {
                    evt.currentTarget.classList.toggle('is-active', true);

                    // Simple: do not try to de-select "all other nav" (including those managed by other nav controllers)
                    // Net result is (VERY) temporarily showing TWO active nav items (currently selected + just clicked),
                    // until which point the page loads and nav controllers are (re)connected.
                });
            }
        }
    });
})();
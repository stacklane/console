/**
 * Uses Bootstrap structure.
 * Requires w-X for the available widths.
 */
(function (window) {
    'use strict';

    const DELAY = 500;
    const progress = document.createElement('div');
    progress.id = 'global-progress';
    progress.setAttribute('class', 'progress');
    progress.innerHTML = '<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>';
    const bar = progress.getElementsByClassName('progress-bar')[0];
    document.documentElement.appendChild(progress); // documentElement allows Turbolinks to swap out the body.

    // TODO this does not seem to get around it installing a stylesheet
    if (Turbolinks) Turbolinks.ProgressBar.defaultCSS = ""; // Disable to get rid of Turoblinks CSP warnings

    /**
     * TODO Turbolinks does a background request even after it's completely shown a page from cache.
     *   This makes showing the status bar somewhat odd.
     */
    document.addEventListener('turbolinks:request-start', function (e) {
        if (Progress.isShowing()) return; // Something else started progress, e.g a form submission AJAX.
        Progress.optimistic();
    });
    document.addEventListener('turbolinks:request-end', function (e) {
        Progress.end();
    });

    const BEGIN_WIDTH = 10;

    var optimistic = 0;
    var optimisticWidth = BEGIN_WIDTH;

    function _resetOptimistic(){
        if (optimistic != 0) clearTimeout(optimistic);
        optimistic = 0;
        optimisticWidth = BEGIN_WIDTH;
    }

    window.Progress = {
        isShowing: function(){
            return optimistic != 0 || progress.classList.contains('show');
        },
        /**
         * Alternative approach. Steps from starting state (10%), through 3 logical steps (25,50,75),
         * and then waits for a call to end() (meaning you can't step beyond 75%).
         */
        step: function(){
            if (bar.classList.contains('w-10')){
                Progress.width(25);
            } else if (bar.classList.contains('w-25')){
                Progress.width(50);
            } else if (bar.classList.contains('w-50')){
                Progress.width(75);
            } else if (bar.classList.contains('w-75')){
                Progress.width(75); // Stay
            }
        },
        width: function(num){
            if (optimistic == 0){
                bar.setAttribute('class','progress-bar w-' + num);
                bar.setAttribute('aria-valuenow', num);
            } else {
                optimisticWidth = num;
            }
        },
        /**
         * Optimistic version that assumes most requests will take less than DELAY.
         * If DELAY passes, then the progress bar will show at whatever width it's currently set to.
         */
        optimistic: function(){
            _resetOptimistic();
            optimistic = setTimeout(function() {
                var width = optimisticWidth;
                optimistic = 0;
                optimisticWidth = BEGIN_WIDTH;
                if (width < 100) {
                    Progress.begin();
                    Progress.width(width);
                }
            }, DELAY);
        },
        begin: function() {
            _resetOptimistic();
            //Progress.width(0); // ideally this already done, otherwise it will visibly shrink to 0.
            progress.classList.toggle('show', true);
            Progress.width(BEGIN_WIDTH);
        },
        end: function(){
            _resetOptimistic();
            Progress.width(100);
            setTimeout(function(){ progress.classList.toggle('show', false); }, 200);
            // Prepare for next time:
            setTimeout(function(){ Progress.width(0); }, 400);
        }
    };
})(window);
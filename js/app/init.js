(function (window) {
    'use strict';
    window.app = Stimulus.Application.start();

    /**
     * Usage:
     *   document.dispatch(new CustomEvent('notification', { message: '..', track: true });
     */
    document.addEventListener('notification', function(e){
        if (e.detail.track){
            var n = sessionStorage.getItem('notifications');
            if (n == null) {
                n = [];
            } else {
                n = JSON.parse(n);
            }
            n.unshift({message: e.detail.message, ts: new Date().getTime()});
            sessionStorage.setItem('notifications', JSON.stringify(n));
        }
    });
})(window);
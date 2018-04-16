/**
 * Usage:
 *   document.dispatchEvent(new CustomEvent('notification', {detail:{ message: '..', track: true }});
 */
(function (window) {
    'use strict';
    const AUTO_HIDE_MS = 5000;

    var lastTimeout = 0;

    var notifications = document.createElement('div');
    notifications.id = 'notification';
    notifications.setAttribute('class', 'shadow');
    notifications = document.body.appendChild(notifications);

    document.addEventListener('notification', function(e){
        if (lastTimeout != 0) clearTimeout(lastTimeout); // Prior to new message

        notifications.innerText = e.detail.message;

        notifications.classList.toggle('notification-active', true);

        lastTimeout = setTimeout(function(){ lastTimeout = 0; notifications.classList.remove('notification-active'); }, AUTO_HIDE_MS);

        if (e.detail.track){
            var n = sessionStorage.getItem('notifications');
            n = (n == null) ? [] : JSON.parse(n);
            n.unshift({message: e.detail.message, ts: new Date().getTime()});
            sessionStorage.setItem('notifications', JSON.stringify(n));
        }
    });
})(window);
/**
 * To be used in conjunction with other on-page progress indicators.
 * Purposefully transient (like GCP Console), and auto-hide doesn't represent completion.
 */
(function (window) {
    'use strict';

    const AUTO_HIDE_MS = 5000;
    const CLASSES = "shadow";
    const ID = "notification";

    var lastTimeout = 0;

    // Initial page load
    {
        var notifications = document.createElement('div');
        notifications.id = ID;
        notifications.setAttribute('class', CLASSES);
        document.body.appendChild(notifications);

        // TODO we could look for an initial notification in a meta element.
    }

    // Convenience over CustomEvent
    window.notify = function(message, track){
        var detail = (typeof(message) === 'object') ? message : {message: message, track: track};
        document.dispatchEvent(new CustomEvent(ID, {detail: detail}));
    }

    // Similar idea to turbolinks permanent option
    // Use cloneNode so no chance to see it removed from existing document.
    document.addEventListener('turbolinks:before-render', function(e){
        var notifications = document.getElementById(ID);
        var clone = notifications.cloneNode(true);
        e.data.newBody.appendChild(clone);
    });

    document.addEventListener(ID, function(e){
        if (lastTimeout != 0) clearTimeout(lastTimeout); // Prior to new message to avoid multiple in-flight timeouts.

        var notifications = document.getElementById(ID);
        notifications.innerText = e.detail.message;
        notifications.setAttribute('class', CLASSES + ' notification-show');

        lastTimeout = setTimeout(function(){
            // Must lookup element in case we've cloned it after a redirect
            lastTimeout = 0; document.getElementById(ID).setAttribute('class', CLASSES + ' notification-hide');
        }, AUTO_HIDE_MS);

        if (e.detail.track == true){
            var stored = sessionStorage.getItem(ID);
            stored = (stored == null) ? [] : JSON.parse(n);
            stored.unshift({message: e.detail.message, ts: new Date().getTime()});
            sessionStorage.setItem(ID, JSON.stringify(n));
        }
    });
})(window);
/**
 * To be used in conjunction with other on-page progress indicators.
 * Purposefully transient (like GCP Console), and auto-hide doesn't represent completion.
 */
(function (window) {
    'use strict';

    const AUTO_HIDE_MS = 5500;
    const CLASSES = "shadow";
    const ID = "message";

    var lastTimeout = 0;

    // Initial page load
    {
        var messages = document.createElement('div');
        messages.id = ID;
        messages.setAttribute('class', CLASSES);
        document.body.appendChild(messages);
        // TODO could look for an initial message in a meta element.
    }

    // Convenience over CustomEvent
    window.postMessage = function(message, track){
        var detail = (typeof(message) === 'object') ? message : {info: message, track: track};
        document.dispatchEvent(new CustomEvent(ID, {detail: detail}));
    }

    // Carry over existing div to next body
    // Similar idea to turbolinks permanent option
    // Use cloneNode so no chance to see it removed from existing document.
    document.addEventListener('turbolinks:before-render', function(e){
        var messages = document.getElementById(ID);
        var clone = messages.cloneNode(true);
        e.data.newBody.appendChild(clone);
    });

    // Ignores anything that doesn't look like a message
    document.addEventListener(ID, function(e){
        if (lastTimeout != 0) clearTimeout(lastTimeout); // Prior to new message to avoid multiple in-flight timeouts.

        var messages = document.getElementById(ID);
        var message = e.detail;
        var txt = '';
        var cls = '';

        if (message.info){
            txt = message.info;
            cls = ''; // default / black / neutral
        } else if (message.success){
            txt = message.success;
            cls = 'message-success'; // something occurred / action was taken
        } else if (message.error){
            txt = message.error;
            cls = 'message-error';
        } else if (message.warn) {
            txt = message.warn;
            cls = 'message-warn';
        }

        if (txt.length == 0) return;

        messages.innerText = txt;
        messages.setAttribute('class', CLASSES + ' message-show ' + cls);

        lastTimeout = setTimeout(function(){
            // Must lookup element in case we've cloned it after a redirect
            lastTimeout = 0; document.getElementById(ID).setAttribute('class', CLASSES + ' message-hide ' + cls);
        }, AUTO_HIDE_MS);

        if (e.detail.track == true){
            var stored = sessionStorage.getItem(ID);
            stored = (stored == null) ? [] : JSON.parse(n);
            stored.unshift({message: e.detail.message, ts: new Date().getTime()});
            sessionStorage.setItem(ID, JSON.stringify(n));
        }
    });
})(window);
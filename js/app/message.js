/**
 * To be used in conjunction with other on-page progress indicators.
 * Purposefully transient and auto-hide doesn't represent completion.
 */
(function (window) {
    'use strict';

    const AUTO_HIDE_MS = 5500;
    const MESSAGES_CLASSES = "messages messages-bottom-left";
    const MESSAGE_CLASSES = "message shadow";
    const MESSAGES_ID = "messages";
    const EVT = "messages:post";

    // Initial page load
    {
        var messages = document.createElement('div');
        messages.id = MESSAGES_ID;
        messages.setAttribute('class', MESSAGES_CLASSES);
        document.documentElement.appendChild(messages); // documentElement allows Turbolinks to swap out the body.
        // TODO could look for an initial message in a meta element.
    }

    // Convenience over CustomEvent
    window.Messages = {
        post: function(message) {
            var detail = (typeof(message) === 'object') ? message : {info: message};
            document.dispatchEvent(new CustomEvent(EVT, {detail: detail}));
        }
    };

    // Ignores any event data that doesn't look like a message
    document.addEventListener(EVT, function(e){
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

        var newMessage = document.createElement('div');
        newMessage.innerText = txt;
        newMessage.setAttribute('class', MESSAGE_CLASSES + ' ' + cls);

        var messages = document.getElementById(MESSAGES_ID);
        messages.appendChild(newMessage);

        // Must occur async, otherwise the animation won't show.
        setTimeout(function(){
            newMessage.setAttribute('class', MESSAGE_CLASSES + ' message-show '  + cls);
        }, 1);

        setTimeout(function(){
            // Must lookup element in case we've cloned it after a redirect
            newMessage.setAttribute('class', MESSAGE_CLASSES + ' message-hide ' + cls);
            // Must be greater than CSS hide transition
            setTimeout(function(){newMessage.remove()}, 300);
        }, AUTO_HIDE_MS);

        if (e.detail.track == true){
            var stored = sessionStorage.getItem(MESSAGES_ID);
            stored = (stored == null) ? [] : JSON.parse(n);
            stored.unshift({message: e.detail.message, ts: new Date().getTime()});
            sessionStorage.setItem(MESSAGES_ID, JSON.stringify(n));
        }
    });
})(window);
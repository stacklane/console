/**
 * Depends on:  https://jdenticon.com/
 */
(function (window) {
    'use strict';

    /**
     * Jdenticon
     *
     * https://jdenticon.com/icon-designer.html?config=ffffff0010c4330a24461852
     */
     window.jdenticon_config = {
        hues: [196],
        lightness: {
            color: [0.36, 0.70],
            grayscale: [0.24, 0.82]
        },
        saturation: {
            color: 0.51,
            grayscale: 0.10
        },
        backColor: "#ffffff00",
        replaceMode: 'none'
    };

    App.register("identicon", class extends Stimulus.Controller {
        connect(){
            //https://jdenticon.com/js-api.html#update
            jdenticon.update(this.element, this.element.getAttribute('data-value'), 0);
        }
    });
})(window);
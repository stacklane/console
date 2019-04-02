/**
 * Expects an 'input' and 'canvas' within the controller.
 * We use canvas instead of CSS to avoid CSP issues.
 */
(function (window) {
    'use strict';

    App.register("reflect-input-color", class extends Stimulus.Controller {
        connect(){
            this.update();

            var input = this.element.getElementsByTagName("input")[0];
            var thiz = this;
            input.addEventListener('change', function(){ thiz.update(); });
        }
        update(){
            var input = this.element.getElementsByTagName("input")[0];
            var color = input.value && input.value.length ? input.value : input.getAttribute('placeholder');
            if (color && color.length) {
                var canvas = this.element.getElementsByTagName("canvas")[0];
                var ctx = canvas.getContext("2d");
                ctx.fillStyle = input.value;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    });
})(window);
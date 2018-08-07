/**
 *
 */
(function () {
    'use strict';

    const $esc = function(s) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(s));
        return div.innerHTML;
    };

    const logLevelToClass = function(level){
        if (level == null) level = 'debug';
        switch (level){
            case 'error': return 'danger';
            case 'warn': return 'grey'; // yellow/warning is currently hard to see
            case 'info': return 'info';
            case 'debug': return 'grey';
            default: return level;
        }
    };

    const langFromPath = function(path){
        if (path.endsWith(".css") || path.endsWith(".scss")) return "css";
        if (path.endsWith(".js")) return "javascript";
        return "html";
    };

    const createProblemHtml = function(value){
        if (typeof value === 'string') return $esc(value);

        var out = '';

        if (value === Object(value) && value.path) {
            out += $esc(value.path);
            out += '<br>';
            out += value.message;

            if (value.source){
                var lines = '';
                var offset = '';

                if (value.beginLine){
                    if (value.beginLine == value.endLine)
                        lines = value.beginLine;
                    else
                        lines = value.beginLine + "-" + value.endLine;
                    offset = value.offset;
                }
                var lang = langFromPath(value.path);

                // yes, put lang on both. long story.
                out += '<pre ' + 'data-line="' + lines  + '" data-line-offset="' + offset  + '" class="language-' + lang + '">';
                out += '<code class="language-' + lang + '">';
                out += $esc(value.source); // fails: Prism.highlight(value.source, lang); // does this HTML escape?
                out += '</code></pre>';
            }
        }

        return out;
    };

    App.register("builder", class extends Stimulus.Controller {
        static get targets() {
            return ["link", "launch", "done", "create", "status"];
        }
        connect(){

        }
        reset(){
            this.createTarget.classList.toggle('is-hidden', false);
            this.statusTarget.innerHTML = '';
        }
        addStatus(html, cls){
            var td = document.createElement("td");
            td.setAttribute("class", cls);
            td.innerHTML = html;
            var tr = document.createElement('tr');
            tr.appendChild(td);
            this.statusTarget.appendChild(tr);

            // TODO needs to be the code element for highlightElement to work
            //if (html.indexOf("language-") > -1) Prism.highlightElement(node); // rerun

            if (html.indexOf("language-") > -1) Prism.highlightAll();
        }
        start(evt){
            evt.preventDefault();
            evt.stopPropagation();

            this.createTarget.classList.toggle('is-loading', true);

            this.reset();

            this.addStatus('Initializing', 'has-text-warning');

            var init = new EventSource(this.data.get('href'));
            var graceful = false;

            var thiz = this;

            init.onerror = function(e){
                if (!graceful) {
                    thiz.addStatus('Connection failed: ' + e.message, "has-text-danger");
                    thiz.createTarget.classList.toggle('is-loading', false);
                }
            };

            init.onmessage = function(e){
                if (e.data.startsWith("{")){
                    var obj = JSON.parse(e.data);
                    thiz.addStatus(createProblemHtml(obj.value), "has-text-" + logLevelToClass(obj.level));
                } else {
                    thiz.addStatus(e.data, "has-text-warning");
                }
            }

            init.addEventListener('completed', function(e) {
                thiz.addStatus("Done", "has-text-success");

                var obj = JSON.parse(e.data);

                thiz.linkTarget.value = obj.url;
                thiz.launchTarget.setAttribute('href', obj.url);
                thiz.launchTarget.setAttribute('target', obj.frame);
                thiz.doneTarget.classList.toggle('is-hidden', false);
                thiz.createTarget.classList.toggle('is-hidden', true);

                init.close();
            });

            init.addEventListener('exception', function(e) {
                thiz.addStatus(e.data, "has-text-danger");
                thiz.createTarget.classList.toggle('is-loading', false);
                init.close();
            });

            init.addEventListener('close', function(e) {
                graceful = true;
                thiz.createTarget.classList.toggle('is-loading', false);
                init.close();
            });

            init.addEventListener('timeout', function(e) {
                thiz.addStatus('Timeout', "has-text-danger");
                thiz.createTarget.classList.toggle('is-loading', false);
            });
        }
    });
})();
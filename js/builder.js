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
            case 'warn': return 'warning';
            case 'info': return 'info';
            case 'debug': return 'light';
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
            return [  ];
        }
        connect(){

        }
        clearStatus(){
            //$get('status').innerHTML = '';
            console.log('clear');
        }
        addStatus(html, cls){
            /*
            var node = document.createElement("li");
            node.setAttribute("class", cls);
            node.innerHTML = html;
            $get('status').appendChild(node);

            // TODO  needs to be the code element for highlighElement to work
            //if (html.indexOf("language-") > -1) Prism.highlightElement(node); // rerun
            if (html.indexOf("language-") > -1) Prism.highlightAll();
             */
            console.log(html);
        }
        start(){
            this.clearStatus();

            this.addStatus('Initializing', 'list-group-item list-group-item-warning pt-1 pb-1');

            var init = new EventSource(this.data.get('href'));
            var graceful = false;

            var thiz = this;

            init.onerror = function(e){
                if (!graceful) {
                    thiz.addStatus('Connection failed: ' + e.message, "list-group-item pt-1 pb-1 list-group-item-danger");
                }
            };

            init.onmessage = function(e){
                if (e.data.startsWith("{")){
                    var obj = JSON.parse(e.data);
                    thiz.addStatus(createProblemHtml(obj.value), "list-group-item pt-1 pb-1 list-group-item-" + logLevelToClass(obj.level));
                } else {
                    thiz.addStatus(e.data, "list-group-item pt-1 pb-1 list-group-item-warning");
                }
            }

            init.addEventListener('completed', function(e) {
                thiz.addStatus("Done", "list-group-item pt-1 pb-1 list-group-item-success");

                var obj = JSON.parse(e.data);

                console.log('launch: ' + obj.url);
                /*
                $get("launch-link").setAttribute('href', obj.url);
                $get("launch-link").setAttribute('target', obj.frame);
                $get("launch-link").classList.remove('disabled', 'btn-secondary');
                $get("launch-link").classList.add('btn-primary');
                */

                init.close();
            });

            init.addEventListener('exception', function(e) {
                thiz.addStatus(e.data, "list-group-item pt-1 pb-1 list-group-item-danger");
                init.close();
            });

            init.addEventListener('close', function(e) {
                graceful = true;
                init.close();
            });

            init.addEventListener('timeout', function(e) {
                thiz.addStatus('Timeout', "list-group-item pt-1 pb-1 list-group-item-danger");
            });
        }
    });
})();
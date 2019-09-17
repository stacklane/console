/**
 *
 */
(()=>{
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
            return ["done", "create", "status", "instanceTemplate"];
        }
        connect(){
            let keyId = this.data.get('key-id')
            this.lastTestStorageKey = "builder-last-" + keyId;

            if (localStorage.getItem(this.lastTestStorageKey)){
                var obj = JSON.parse(localStorage.getItem(this.lastTestStorageKey));
                if (obj.expires > Date.now()){
                    this._makeTestInstanceBlock(obj.url, obj.frame, obj.expires, obj.created);
                }
            }
        }
        reset(){
            this.createTarget.classList.toggle('is-hidden', false);
            this.createTarget.classList.toggle('is-proposed', true);
            this.createTarget.classList.toggle('is-hoverable', true);

            this.statusTarget.classList.toggle('is-hidden', true);
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
        _makeTestInstanceBlock(url, frame, expires, created){
            var template = this.instanceTemplateTarget;

            var clone = document.importNode(template.content, true);

            var launch = clone.querySelector(".builder-launch");
            var linkText = clone.querySelector(".builder-link-text");
            var linkCopy = clone.querySelector(".builder-link-copy");
            var linkExpires = clone.querySelector(".builder-link-expires");

            launch.target = frame;
            launch.href = url;
            linkText.value = url;
            linkExpires.innerText = new Date(expires).toLocaleDateString();

            linkCopy.addEventListener('click', function(){
                linkText.select();
                try {
                    if (document.execCommand('copy'))
                        Messages.post({success:'Link copied to clipboard'});
                    else
                        Messages.post({error:'Oops, unable to copy'});
                } catch(err) {
                    Messages.post({error:'Oops, unable to copy'});
                }
            });

            this.element.appendChild(clone);
        }
        start(evt){
            evt.preventDefault();
            evt.stopPropagation();

            if (this.building){
                Messages.post({error: 'Another test instance is building'});
                return;
            }

            this.reset();

            this.building = true;

            this.createTarget.classList.toggle('is-loading', true);
            this.createTarget.classList.toggle('is-proposed', false);
            this.createTarget.classList.toggle('is-hoverable', false);

            this.statusTarget.classList.toggle('is-hidden', false);

            this.addStatus('Initializing', 'has-text-grey');

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
                    thiz.addStatus(e.data, "has-text-grey");
                }
            }

            init.addEventListener('completed', function(e) {
                thiz.addStatus("Done", "has-text-success");

                var obj = JSON.parse(e.data);

                var expires = Date.now() + (86400000 * 6);
                var created = Date.now();

                thiz._makeTestInstanceBlock(obj.url, obj.frame, expires, created);

                thiz.reset();

                init.close();

                Messages.post({success: 'New test instance is ready'});

                thiz.building = false;

                localStorage.setItem(thiz.lastTestStorageKey, JSON.stringify({
                    //project: thiz.projectId,
                    url: obj.url,
                    frame: obj.frame,
                    created: created,
                    expires: expires
                }));
            });

            init.addEventListener('exception', function(e) {
                thiz.addStatus(e.data, "has-text-danger");
                thiz.createTarget.classList.toggle('is-loading', false);
                init.close();
                thiz.building = false;
            });

            init.addEventListener('close', function(e) {
                graceful = true;
                thiz.createTarget.classList.toggle('is-loading', false);
                init.close();
                thiz.building = false;
            });

            init.addEventListener('timeout', function(e) {
                thiz.addStatus('Timeout', "has-text-danger");
                thiz.createTarget.classList.toggle('is-loading', false);
                thiz.building = false;
            });
        }
    });
})();
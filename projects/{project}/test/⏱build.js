
import {Build, Mapping} from "🔌";
import {project} from '🔗';

let buffered = [];
let bufferedIndex = 0;
let finished = null;

try {
    let instanceLive = project.get();
    let mapping = Mapping.test()
        .region('eu')
        .source(instanceLive.source)
        .theme(instanceLive.properties)
        .keys(project);

    /**
     * Initiate the long running builder and callbacks.
     */
    Build.mapping(mapping)
        .status((log)=>{
            buffered.push({
                level: log.level,
                value: log.value
            });
        })
        .then((site)=>{
            finished = site;
        })
        .catch((error)=>{
            /**
             * Error details should have already been emitted in status callback.
             */
            buffered.push({
                $event: {last: true},
                level: "error",
                value: 'Build failed'
            });
        });
} catch (e){
    buffered.push({
        $event: {last: true},
        level: "error",
        value: 'Initialization failed: ' + e
    });
}

/**
 * Event emitter
 */
(lastEventId)=>{

    /**
     * We do not modify the buffer since it may be written to
     * as we are reading more available events from it.
     */
    let lastIndex = buffered.length;
    let next = buffered.slice(bufferedIndex, lastIndex);
    bufferedIndex = lastIndex;

    if (finished) {

        next.push({
            $event: {type: "completed", last: true},
            level: "info",
            value: "Completed",
            url: finished.url,
            frame: finished.frame
        });

        return next;

    } else {

        return next;

    }

};
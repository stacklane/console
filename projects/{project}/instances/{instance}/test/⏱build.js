
import {Build, Mapping} from "🔌";
import {instance, project} from '🔗';

let buffered = [];
let bufferedIndex = 0;
let finished = null;

let instanceLive = instance.get();
let mapping = Mapping.test()
    .source(instanceLive.source)
    .namespace(instanceLive.data)
    .theme(instanceLive.theme)
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


/**
 * Return a callback that will emit Server Sent Events.
 * This will be periodically called until a "last event" is sent,
 * either explicitly, or by throwing the event(s).
 * The following code sets the last event explicitly.
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
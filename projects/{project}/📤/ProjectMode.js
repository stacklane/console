
import {project} from '🔗';

let simple = project.simple.linked();

let home = Redirect.dir('projects').dir(project.id);

let simpleLinks = {
    source: '',
    keys: '',
    test: '',
    live: '',
    properties: ''
};

if (simple){
    let simpleBase = `/projects/${project.id}/${project.simple.id}`;

    simpleLinks = {
        source: simpleBase + '/source/',
        keys: simpleBase + '/keys/',
        test: simpleBase + '/test/',
        live: simpleBase + '/deploy/simple/',
        properties: simpleBase + '/properties/'
    };
}

export {simple as ProjectModeSimple, simpleLinks as ProjectModeSimpleNav, home as CurrentHome}
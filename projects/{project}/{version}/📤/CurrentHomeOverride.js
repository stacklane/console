
import {project, version} from '🔗';

let isDefaultVersion = project.simple.linked() && version.id == project.simple.id;

let home = isDefaultVersion ?
    Redirect.dir('projects').dir(project.id) :
    Redirect.dir('projects').dir(project.id).dir(project.simple.id)
;

export {home as CurrentHome, isDefaultVersion as IsSimpleModeVersion}

import {project, version} from '🔗';

let r = Redirect.dir('projects').dir(project.id).dir(project.simple.id).dir('keys');

export {r as KeysRedirect};
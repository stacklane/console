
import {project} from '🔗';

let simple = project.simple.linked();

let home = Redirect.dir('projects').dir(project.id);

export {simple as ProjectModeSimple, home as CurrentHome}
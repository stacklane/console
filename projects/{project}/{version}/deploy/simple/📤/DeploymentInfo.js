
import {version, project} from '🔗';
import {ProjectDeployment} from '📦';

let deployment = ProjectDeployment.project(project).version(version).optional();

export {deployment as Deployment};
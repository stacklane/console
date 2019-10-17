
import {version, project} from '🔗';
import {ProjectDeployment} from '📦';

let deployment = ProjectDeployment.version(version).optional();

//let hasDeployment = deployment != null;

export {deployment as Deployment};
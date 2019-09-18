
import {version, project} from '🔗';
import {ProjectDeployment} from '📦';

let deployment = null;

try {
    deployment = ProjectDeployment.version(version).get();
} catch ($ModelNotFound){
    deployment = null;
}

//let hasDeployment = deployment != null;

export {deployment as Deployment};
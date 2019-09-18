
import {Mapping} from '🔌';
import {version as versionPath} from '🔗';
import {ProjectDeployment} from '📦';

let version = versionPath.get();
let deployment = ProjectDeployment.version(version).get();
let deploymentDomain = deployment.domain.get();
let deploymentDomainValue = deploymentDomain.domain;
let resultDomain = deployment.name;

if (deploymentDomainValue.verified && Mapping.exists(resultDomain)){
    try {
        if (Mapping.domain(resultDomain).theme(version.properties).update()){
            ({redirect: Redirect.index().success('Allow 5-10 minutes for changes to propagate')});
        } else {
            ({error: `Domain update failed`});
        }
    } catch (e){
        ({error: `Domain update failed`});
    }
} else {
    ({error: 'Domain not verified or does not exist'});
}
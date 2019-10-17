
import {Domain as DomainValue, Mapping as MappingBuilder} from '🔌';
import {project as projectPath, version as versionPath} from '🔗';
import {Me} from '👤'
import {ProjectDeployment} from '📦';

let project = projectPath.get();
let version = versionPath.get();
let deployment = ProjectDeployment.version(version).get();
let deploymentDomain = deployment.domain.get();

if (DomainValue.verify(deploymentDomain.domain)){
    try {
        let result = MappingBuilder
            .domain(deploymentDomain.domain)
            .source(version.source)
            .region(project.region)
            .users(project.users)
            .namespace(project.data)
            .www(deployment.www)
            .theme(version.properties)
            .keys(version)
            .metadata('billing.base.units', project.account.get().baseUnits + '')
            .metadata('billing.stripe.usage.id', project.account.get().stripeSubItemUsageId)
            .register();

        deployment.ip = result.address;
        deployment.record = result.recordType;
        deployment.name = result.domain;
        deployment.token = result.token;

        ({redirect: '.', success: `Domain successfully verified and registered`});
    } catch (e){
        throw ({error: `Domain verified, but registration failed: ${e.message}`});
    }
} else {
    throw ({error: `Domain not verified`});
}
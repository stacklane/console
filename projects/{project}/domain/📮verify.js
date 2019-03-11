
import {domain} from 'form';
import {Domain, Mapping as MappingBuilder} from '🔌';
import {project} from '🔗';
import {Me} from '👤'
import {Mapping} from '📦';

let instanceLive = project.get();

if (Domain.verify(instanceLive.mapping.domain)){
    try {
        let result = MappingBuilder
            .domain(instanceLive.mapping.domain)
            .source(instanceLive.source)
            .region(instanceLive.region)
            .namespace(instanceLive.data)
            .www(instanceLive.mapping.www)
            .theme(instanceLive.properties)
            .keys(project)
            .register();

        instanceLive.mapping.ip = result.address;
        instanceLive.mapping.record = result.recordType;
        instanceLive.mapping.name = result.name;

        ({redirect: '.', success: `Domain successfully verified and registered`});
    } catch (e){
        ({error: `Domain verified, but registration failed`});
    }
} else {
    ({error: `Domain not verified`});
}
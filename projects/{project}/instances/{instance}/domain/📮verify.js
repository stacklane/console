
import {domain} from 'form';
import {Domain, Mapping as MappingBuilder} from '🔌';
import {project, instance} from '🔗';
import {Me} from '👤'
import {Mapping} from '📦';

let instanceLive = instance.get();

if (Domain.verify(instanceLive.mapping.domain)){
    try {
        let result = MappingBuilder
            .domain(instanceLive.mapping.domain)
            .source(instanceLive.source)
            .namespace(instanceLive.data)
            .www(instanceLive.mapping.www)
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
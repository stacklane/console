
import {domain} from 'form';
import {Domain, Mapping as MappingBuilder} from '🔌';
import {project, version} from '🔗';
import {Me} from '👤'
import {Mapping} from '📦';

let versionLive = version.get();

if (Domain.verify(versionLive.mapping.domain)){
    try {
        let result = MappingBuilder
            .domain(versionLive.mapping.domain)
            .source(versionLive.source)
            .namespace(versionLive.data)
            .www(versionLive.mapping.www)
            .keys(project)
            .register();

        versionLive.mapping.ip = result.address;
        versionLive.mapping.record = result.recordType;
        versionLive.mapping.name = result.name;

        ({redirect: '.', success: `Domain successfully verified and registered`});
    } catch (e){
        ({error: `Domain verified, but registration failed`});
    }
} else {
    ({error: `Domain not verified`});
}

import {domain} from 'form';
import {Domain, Mapping} from '🔌';
import {project} from '🔗';

let p = project.get();
let m = p.mapping;
let mappedDomain = m.name;

if (m && m.domain.verification && m.domain.verification.verified && Mapping.exists(mappedDomain)){
    try {
        if (Mapping.domain(mappedDomain).theme(p.properties).update()){
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
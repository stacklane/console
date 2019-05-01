
import {domain} from 'form';
import {Domain, Mapping} from '🔌';
import {project} from '🔗';

let p = project.get();
let m = p.mapping;

if (m && m.domain.verification && !m.domain.verification.verified){
    p.mapping = null;

    ({redirect: Redirect.index().success('Domain verification canceled')});
} else {
    ({error: 'Domain verification not cancelable'});
}
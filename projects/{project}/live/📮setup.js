
import {domain} from 'form';
import {Domain} from '🔌';
import {project} from '🔗';
import {Me} from '👤'
import {Mapping} from '📦';
import {ProjectHasAccount} from '📤';

if (!Domain.isValid(domain)) throw ({field:'domain', error: 'Invalid domain name: ' + domain});

let instanceLive = project.get();

if (!ProjectHasAccount) throw ({error: 'A billing account must be setup before configure a domain.'});

let domainValue = Domain.of(domain);
domainValue.newVerification('stacklane-domain-verification');

let mapping = new Mapping().domain(domainValue).www(false).path(null);

instanceLive.mapping = mapping;

({redirect: `.`, success: `New domain mapping configured`});


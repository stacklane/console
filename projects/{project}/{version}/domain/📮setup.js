
import {domain} from 'form';
import {Domain} from '🔌';
import {version} from '🔗';
import {Me} from '👤'
import {Mapping} from '📦';

if (!Domain.isValid(domain)) throw ({field:'domain', error: 'Invalid domain name: ' + domain});

let versionLive = version.get();

let domainValue = Domain.of(domain);
domainValue.newVerification('stacklane-domain-verification');

let mapping = new Mapping().domain(domainValue).www(false).path(null);

versionLive.mapping = mapping;

({redirect: `.`, success: `New domain mapping configured`});



import {domain as domainName, region} from 'form';
import {Domain as DomainValue} from '🔌';
import {version} from '🔗';
import {Me, Role} from '👤'
import {Domain, ProjectDeployment, DomainUser} from '📦';
import {ProjectHasAccount} from '📤';

if (!ProjectHasAccount) throw ({error: 'A billing account must be setup first.'});
if (!DomainValue.isValid(domainName)) throw ({field:'domain', error: 'Invalid domain name: ' + domainName});

/**
 * For simple mode, only expect one ProjectDeployment
 */
if (ProjectDeployment.version(version).exists()) {
    throw ({error: 'A deployment already exists.'});
}

/**
 * Check if Domain already exists
 */
if (Domain.name(domainName).exists()){
    throw ({field:'domain', error: 'Domain is already reserved: ' + domainName});
}

let domainValue = DomainValue.of(domainName);
domainValue.newVerification('stacklane-domain-verification');

let domain = new Domain().name(domainName).domain(domainValue);

new DomainUser(domain).role(Role.DomainOwner).user(Me);

version.get().project().region(region);

new ProjectDeployment()
    .version(version)
    .domain(domain)
    .www(false)
    .path('/');

({redirect: `.`, success: `New domain mapping configured`});


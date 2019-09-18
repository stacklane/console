
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
try{
    ProjectDeployment.version(version).get();
    throw ({error: 'A deployment already exists.'});
} catch ($ModelNotFound){
    // Good
}

/**
 * Check if Domain already exists
 */
try {
    Domain.name(domainName).get();
    throw ({field:'domain', error: 'Domain is already reserved: ' + domainName});
} catch ($ModelNotFound){
    // Good
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

